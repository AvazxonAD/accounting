const pool = require("../../config/db");
const ErrorResponse = require("../../utils/errorResponse");

const createBankPrixodService = async (data) => {
  try {
    const result = await pool.query(
      `
        INSERT INTO bank_prixod(
            doc_num, 
            doc_date, 
            summa, 
            provodki_boolean, 
            opisanie, 
            id_spravochnik_organization, 
            id_shartnomalar_organization, 
            main_schet_id, 
            user_id
        ) 
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) 
        RETURNING * 
      `, [
      data.doc_num,
      data.doc_date,
      data.summa,
      data.provodki_boolean,
      data.opisanie,
      data.id_spravochnik_organization,
      data.id_shartnomalar_organization,
      data.main_schet_id,
      data.user_id,
    ]);
    return result.rows[0];
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const createBankPrixodServiceChild = async (data) => {
  try {
    const result = await pool.query(
      `
        INSERT INTO bank_prixod_child(
            spravochnik_operatsii_id,
            summa,
            id_spravochnik_podrazdelenie,
            id_spravochnik_sostav,
            id_spravochnik_type_operatsii,
            id_spravochnik_podotchet_litso,
            main_schet_id,
            id_bank_prixod,
            user_id
        ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`
      , [data.spravochnik_operatsii_id,
      data.summa,
      data.id_spravochnik_podrazdelenie,
      data.id_spravochnik_sostav,
      data.id_spravochnik_type_operatsii,
      data.id_spravochnik_podotchet_litso,
      data.main_schet_id,
      data.bank_prixod_id,
      data.user_id
      ]);
    return result.rows[0];
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const bankPrixodUpdateService = async (data) => {
  try {
    const result = await pool.query(`
      UPDATE bank_prixod SET 
        doc_num = $1, 
        doc_date = $2, 
        summa = $3, 
        provodki_boolean = $4, 
        opisanie = $5, 
        id_spravochnik_organization = $6, 
        id_shartnomalar_organization = $7
      WHERE id = $8 RETURNING * 
      `,[
        data.doc_num,
        data.doc_date,
        data.summa,
        data.provodki_boolean,
        data.opisanie,
        data.id_spravochnik_organization,
        data.id_shartnomalar_organization,
        data.id,
    ]);
    return result.rows[0]
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const getPrixodService = async (region_id, main_schet_id, offset, limit, from, to) => {
  try {
    const result = await pool.query(
      ` WITH data AS (SELECT 
              b_p.id,
              b_p.doc_num, 
              TO_CHAR(b_p.doc_date, 'YYYY-MM-DD') AS doc_date, 
              b_p.summa, 
              b_p.provodki_boolean, 
              b_p.dop_provodki_boolean, 
              b_p.opisanie, 
              b_p.id_spravochnik_organization, 
              s_o.name AS spravochnik_organization_name,
              s_o.okonx AS spravochnik_organization_okonx,
              s_o.bank_klient AS spravochnik_organization_bank_klient,
              s_o.raschet_schet AS spravochnik_organization_raschet_schet,
              s_o.raschet_schet_gazna AS spravochnik_organization_raschet_schet_gazna,
              s_o.mfo AS spravochnik_organization_mfo,
              s_o.inn AS spravochnik_organization_inn,
              b_p.id_shartnomalar_organization,
              (SELECT ARRAY_AGG(row_to_json(b_p_ch))
                FROM (
                  SELECT 
                      b_p_ch.id,
                      b_p_ch.spravochnik_operatsii_id,
                      s_o.name AS spravochnik_operatsii_name,
                      b_p_ch.summa,
                      b_p_ch.id_spravochnik_podrazdelenie,
                      s_p.name AS spravochnik_podrazdelenie_name,
                      b_p_ch.id_spravochnik_sostav,
                      s_s.name AS spravochnik_sostav_name,
                      b_p_ch.id_spravochnik_type_operatsii,
                      s_t_o.name AS spravochnik_type_operatsii_name,
                      b_p_ch.id_spravochnik_podotchet_litso,
                      s_p_l.name AS spravochnik_podotchet_litso_name
                  FROM bank_prixod_child AS b_p_ch
                  JOIN spravochnik_operatsii AS s_o ON s_o.id = b_p_ch.spravochnik_operatsii_id
                  LEFT JOIN spravochnik_podrazdelenie AS s_p ON s_p.id = b_p_ch.id_spravochnik_podrazdelenie
                  LEFT JOIN spravochnik_sostav AS s_s ON s_s.id = b_p_ch.id_spravochnik_sostav
                  LEFT JOIN spravochnik_type_operatsii AS s_t_o ON s_t_o.id = b_p_ch.id_spravochnik_type_operatsii
                  LEFT JOIN spravochnik_podotchet_litso AS s_p_l ON s_p_l.id = b_p_ch.id_spravochnik_podotchet_litso
                  WHERE b_p_ch.id_bank_prixod = b_p.id 
                ) AS b_p_ch
              ) AS childs 
          FROM bank_prixod AS b_p
          JOIN users AS u ON b_p.user_id = u.id
          JOIN regions AS r ON u.region_id = r.id
          JOIN spravochnik_organization AS s_o ON s_o.id = b_p.id_spravochnik_organization 
          WHERE b_p.main_schet_id = $2 AND r.id = $1 AND b_p.isdeleted = false AND doc_date BETWEEN $3 AND $4 ORDER BY b_p.doc_date OFFSET $5 LIMIT $6)
        SELECT 
          ARRAY_AGG(row_to_json(data)) AS data,
          (SELECT SUM(bank_prixod.summa)
            FROM bank_prixod 
            JOIN users ON bank_prixod.user_id = users.id
            JOIN regions ON users.region_id = regions.id
            WHERE bank_prixod.main_schet_id = $2 AND bank_prixod.isdeleted = false AND regions.id = $1 AND doc_date BETWEEN $3 AND $4)::FLOAT AS summa,
          (SELECT COUNT(bank_prixod.id)
            FROM bank_prixod 
            JOIN users ON bank_prixod.user_id = users.id
            JOIN regions ON users.region_id = regions.id
            WHERE bank_prixod.main_schet_id = $2 AND bank_prixod.isdeleted = false AND regions.id = $1  AND doc_date BETWEEN $3 AND $4)::FLOAT AS total_count
        FROM data
    `, [ region_id, main_schet_id, from, to, offset, limit],
    );
    return { data: result.rows[0]?.data || [], summa: result.rows[0]?.summa || 0, total: result.rows[0]?.total_count || 0 };
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const getByIdPrixodService = async (region_id, main_schet_id, id, ignoreDeleted = false) => {
  try {
    let ignore = ``;
    if (!ignoreDeleted) {
      ignore = `AND b_p.isdeleted = false`;
    }
    const result = await pool.query(`
      SELECT 
        b_p.id,
        b_p.doc_num, 
        TO_CHAR(b_p.doc_date, 'YYYY-MM-DD') AS doc_date, 
        b_p.summa::FLOAT, 
        b_p.provodki_boolean, 
        b_p.dop_provodki_boolean, 
        b_p.opisanie, 
        b_p.id_spravochnik_organization, 
        b_p.id_shartnomalar_organization,
        (
          SELECT ARRAY_AGG(row_to_json(b_p_ch))
          FROM (
            SELECT 
                b_p_ch.id,
                b_p_ch.spravochnik_operatsii_id,
                s_o.name AS spravochnik_operatsii_name,
                b_p_ch.summa,
                b_p_ch.id_spravochnik_podrazdelenie,
                s_p.name AS spravochnik_podrazdelenie_name,
                b_p_ch.id_spravochnik_sostav,
                s_s.name AS spravochnik_sostav_name,
                b_p_ch.id_spravochnik_type_operatsii,
                s_t_o.name AS spravochnik_type_operatsii_name,
                b_p_ch.id_spravochnik_podotchet_litso,
                s_p_l.name AS spravochnik_podotchet_litso_name
            FROM bank_prixod_child AS b_p_ch
            JOIN spravochnik_operatsii AS s_o ON s_o.id = b_p_ch.spravochnik_operatsii_id
            LEFT JOIN spravochnik_podrazdelenie AS s_p ON s_p.id = b_p_ch.id_spravochnik_podrazdelenie
            LEFT JOIN spravochnik_sostav AS s_s ON s_s.id = b_p_ch.id_spravochnik_sostav
            LEFT JOIN spravochnik_type_operatsii AS s_t_o ON s_t_o.id = b_p_ch.id_spravochnik_type_operatsii
            LEFT JOIN spravochnik_podotchet_litso AS s_p_l ON s_p_l.id = b_p_ch.id_spravochnik_podotchet_litso
            WHERE b_p_ch.id_bank_prixod = b_p.id 
          ) AS b_p_ch
        ) AS childs 
      FROM bank_prixod AS b_p
      JOIN users AS u ON b_p.user_id = u.id
      JOIN regions AS r ON u.region_id = r.id
      WHERE b_p.main_schet_id = $2 AND r.id = $1 AND b_p.id = $3 ${ignore}
      ORDER BY b_p.doc_date ASC
    `, [region_id, main_schet_id, id]);
    
    if (!result.rows[0]) {
      throw new ErrorResponse('bank prixod doc not found', 404);
    }
    return result.rows[0];
  } catch (error) {
    throw new ErrorResponse(error.message || 'Internal server error', error.statusCode || 500);
  }
}

const deleteBankPrixod = async (id) => {
  try {
    await pool.query(`UPDATE bank_prixod_child SET isdeleted = $1 WHERE id_bank_prixod = $2 AND isdeleted = false`, [true, id]);
    await pool.query(`UPDATE bank_prixod SET isdeleted = $1 WHERE id = $2 AND isdeleted = false`, [true, id]);
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const deleteBankPrixodChild = async (bank_prixod_id) => {
  try {
    await pool.query(`DELETE FROM bank_prixod_child WHERE id_bank_prixod = $1`, [bank_prixod_id]);
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

module.exports = {
  createBankPrixodService,
  createBankPrixodServiceChild,
  bankPrixodUpdateService,
  deleteBankPrixodChild,
  getPrixodService,
  getByIdPrixodService,
  deleteBankPrixod,
};
