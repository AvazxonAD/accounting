const pool = require("../../config/db");
const ErrorResponse = require("../../utils/errorResponse");

const createBankRasxodDb = async (data) => {
  try {
    const result = await pool.query(
      `
        INSERT INTO bank_rasxod(
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

const createBankRasxodChild = async (data) => {
  try {
    const result = await pool.query(
      `
        INSERT INTO bank_rasxod_child(
            spravochnik_operatsii_id,
            summa,
            id_spravochnik_podrazdelenie,
            id_spravochnik_sostav,
            id_spravochnik_type_operatsii,
            id_spravochnik_podotchet_litso,
            main_schet_id,
            id_bank_rasxod,
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

const updateRasxodService = async (data) => {
  try {
    const result = await pool.query(`
      UPDATE bank_rasxod SET 
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

const getBankRasxodService = async (region_id, main_schet_id, offset, limit, from, to) => {
  try {
    const result = await pool.query(
      ` WITH data AS (SELECT 
              b_r.id,
              b_r.doc_num, 
              TO_CHAR(b_r.doc_date, 'YYYY-MM-DD') AS doc_date, 
              b_r.summa, 
              b_r.provodki_boolean, 
              b_r.dop_provodki_boolean, 
              b_r.opisanie, 
              b_r.id_spravochnik_organization, 
              s_o.name AS spravochnik_organization_name,
              s_o.okonx AS spravochnik_organization_okonx,
              s_o.bank_klient AS spravochnik_organization_bank_klient,
              s_o.raschet_schet AS spravochnik_organization_raschet_schet,
              s_o.raschet_schet_gazna AS spravochnik_organization_raschet_schet_gazna,
              s_o.mfo AS spravochnik_organization_mfo,
              s_o.inn AS spravochnik_organization_inn,
              b_r.id_shartnomalar_organization,
              (SELECT ARRAY_AGG(row_to_json(b_r_ch))
                FROM (
                  SELECT 
                      b_r_ch.id,
                      b_r_ch.spravochnik_operatsii_id,
                      s_o.name AS spravochnik_operatsii_name,
                      b_r_ch.summa,
                      b_r_ch.spravochnik_operatsii_own_id,
                      b_r_ch.id_spravochnik_podrazdelenie,
                      s_p.name AS spravochnik_podrazdelenie_name,
                      b_r_ch.id_spravochnik_sostav,
                      s_s.name AS spravochnik_sostav_name,
                      b_r_ch.id_spravochnik_type_operatsii,
                      s_t_o.name AS spravochnik_type_operatsii_name,
                      b_r_ch.id_spravochnik_podotchet_litso,
                      s_p_l.name AS spravochnik_podotchet_litso_name
                  FROM bank_rasxod_child AS b_r_ch
                  JOIN spravochnik_operatsii AS s_o ON s_o.id = b_r_ch.spravochnik_operatsii_id
                  LEFT JOIN spravochnik_podrazdelenie AS s_p ON s_p.id = b_r_ch.id_spravochnik_podrazdelenie
                  LEFT JOIN spravochnik_sostav AS s_s ON s_s.id = b_r_ch.id_spravochnik_sostav
                  LEFT JOIN spravochnik_type_operatsii AS s_t_o ON s_t_o.id = b_r_ch.id_spravochnik_type_operatsii
                  LEFT JOIN spravochnik_podotchet_litso AS s_p_l ON s_p_l.id = b_r_ch.id_spravochnik_podotchet_litso
                  WHERE b_r_ch.id_bank_rasxod = b_r.id 
                ) AS b_r_ch
              ) AS childs 
          FROM bank_rasxod AS b_r
          JOIN users AS u ON b_r.user_id = u.id
          JOIN regions AS r ON u.region_id = r.id
          JOIN spravochnik_organization AS s_o ON s_o.id = b_r.id_spravochnik_organization 
          WHERE b_r.main_schet_id = $1 AND r.id = $2 AND b_r.isdeleted = false AND doc_date BETWEEN $3 AND $4 ORDER BY b_r.doc_date OFFSET $5 LIMIT $6)
        SELECT 
          ARRAY_AGG(row_to_json(data)) AS data,
          (SELECT SUM(bank_rasxod.summa)
            FROM bank_rasxod 
            JOIN users ON bank_rasxod.user_id = users.id
            JOIN regions ON users.region_id = regions.id
            WHERE bank_rasxod.main_schet_id = $1 AND bank_rasxod.isdeleted = false AND regions.id = $2 AND doc_date BETWEEN $3 AND $4)::FLOAT AS summa,
          (SELECT COUNT(bank_rasxod.id)
            FROM bank_rasxod 
            JOIN users ON bank_rasxod.user_id = users.id
            JOIN regions ON users.region_id = regions.id
            WHERE bank_rasxod.main_schet_id = $1 AND bank_rasxod.isdeleted = false AND regions.id = $2  AND doc_date BETWEEN $3 AND $4)::FLOAT AS total_count
        FROM data
    `, [main_schet_id, region_id, from, to, offset, limit],
    );
    return { data: result.rows[0]?.data || [], summa: result.rows[0]?.summa || 0, total: result.rows[0]?.total_count || 0 };
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const getByIdRasxodService = async (region_id, main_schet_id, id, ignoreDeleted = false) => {
  try {
    let ignore = ``;
    if (!ignoreDeleted) {
      ignore = `AND b_r.isdeleted = false`;
    }
    const result = await pool.query(`
      SELECT 
        b_r.id,
        b_r.doc_num, 
        TO_CHAR(b_r.doc_date, 'YYYY-MM-DD') AS doc_date, 
        b_r.summa, 
        b_r.provodki_boolean, 
        b_r.dop_provodki_boolean, 
        b_r.opisanie, 
        b_r.id_spravochnik_organization, 
        b_r.id_shartnomalar_organization,
        (
          SELECT ARRAY_AGG(row_to_json(b_r_ch))
          FROM (
            SELECT 
                b_r_ch.id,
                b_r_ch.spravochnik_operatsii_id,
                s_o.name AS spravochnik_operatsii_name,
                b_r_ch.summa,
                b_r_ch.spravochnik_operatsii_own_id,
                b_r_ch.id_spravochnik_podrazdelenie,
                s_p.name AS spravochnik_podrazdelenie_name,
                b_r_ch.id_spravochnik_sostav,
                s_s.name AS spravochnik_sostav_name,
                b_r_ch.id_spravochnik_type_operatsii,
                s_t_o.name AS spravochnik_type_operatsii_name,
                b_r_ch.id_spravochnik_podotchet_litso,
                s_p_l.name AS spravochnik_podotchet_litso_name
            FROM bank_rasxod_child AS b_r_ch
            JOIN spravochnik_operatsii AS s_o ON s_o.id = b_r_ch.spravochnik_operatsii_id
            LEFT JOIN spravochnik_podrazdelenie AS s_p ON s_p.id = b_r_ch.id_spravochnik_podrazdelenie
            LEFT JOIN spravochnik_sostav AS s_s ON s_s.id = b_r_ch.id_spravochnik_sostav
            LEFT JOIN spravochnik_type_operatsii AS s_t_o ON s_t_o.id = b_r_ch.id_spravochnik_type_operatsii
            LEFT JOIN spravochnik_podotchet_litso AS s_p_l ON s_p_l.id = b_r_ch.id_spravochnik_podotchet_litso
            WHERE b_r_ch.id_bank_rasxod = b_r.id 
          ) AS b_r_ch
        ) AS childs 
      FROM bank_rasxod AS b_r
      JOIN users AS u ON b_r.user_id = u.id
      JOIN regions AS r ON u.region_id = r.id
      WHERE b_r.main_schet_id = $1 AND r.id = $2 AND b_r.id = $3 ${ignore}
      ORDER BY b_r.doc_date ASC
    `, [main_schet_id, region_id, id]);
    
    if (!result.rows[0]) {
      throw new ErrorResponse('bank prixod doc not found', 404);
    }
    return result.rows[0];
  } catch (error) {
    throw new ErrorResponse(error.message || 'Internal server error', error.statusCode || 500);
  }
}

const deleteBankRasxod = async (id) => {
  try {
    await pool.query(`UPDATE bank_rasxod_child SET isdeleted = $1 WHERE id_bank_rasxod = $2 AND isdeleted = false`, [true, id]);
    await pool.query(`UPDATE bank_rasxod SET isdeleted = $1 WHERE id = $2 AND isdeleted = false`, [true, id]);
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const deleteRasxodChild = async (bank_prixod_id) => {
  try {
    await pool.query(`DELETE FROM bank_rasxod_child WHERE id_bank_rasxod = $1`, [bank_prixod_id]);
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

module.exports = {
  createBankRasxodDb,
  createBankRasxodChild,
  getByIdRasxodService,
  updateRasxodService,
  getBankRasxodService,
  deleteRasxodChild,
  deleteBankRasxod,
};
