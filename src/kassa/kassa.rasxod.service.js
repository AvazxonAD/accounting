const pool = require("../config/db");
const { tashkentTime } = require('../utils/date.function');
const ErrorResponse = require("../utils/errorResponse");

const kassaRasxodCreateDB = async (data) => {
  try {
    const result = await pool.query(
      `
        INSERT INTO kassa_rasxod(
            doc_num, 
            doc_date, 
            opisanie, 
            summa, 
            id_podotchet_litso, 
            main_schet_id, 
            user_id,
            created_at,
            updated_at
        ) 
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) 
        RETURNING * 
      `, [
      data.doc_num,
      data.doc_date,
      data.opisanie,
      data.summa,
      data.id_podotchet_litso,
      data.main_schet_id,
      data.user_id,
      tashkentTime(),
      tashkentTime(),
    ]);
    return result.rows[0];
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const kassaRasxodChild = async (data) => {
  try {
    const result = await pool.query(
      `
        INSERT INTO kassa_rasxod_child (
            spravochnik_operatsii_id,
            summa,
            id_spravochnik_podrazdelenie, 
            id_spravochnik_sostav, 
            id_spravochnik_type_operatsii,
            kassa_rasxod_id,
            user_id, 
            main_schet_id, 
            created_at, 
            updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING * `,
      [
        data.spravochnik_operatsii_id,
        data.summa,
        data.id_spravochnik_podrazdelenie,
        data.id_spravochnik_sostav,
        data.id_spravochnik_type_operatsii,
        data.kassa_rasxod_id,
        data.user_id,
        data.main_schet_id,
        tashkentTime(),
        tashkentTime(),
      ]);
    return result.rows[0]
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const getAllKassaRasxodDb = async (region_id, main_schet_id, from, to, offset, limit) => {
  try {
    const result = await pool.query(
      `
        WITH data AS (
              SELECT 
                  k_r.id, 
                  k_r.doc_num,
                  TO_CHAR(k_r.doc_date, 'YYYY-MM-DD') AS doc_date, 
                  k_r.opisanie, 
                  k_r.summa, 
                  k_r.id_podotchet_litso,
                  s_p_l.name AS spravochnik_podotchet_litso_name,
                  s_p_l.rayon AS spravochnik_podotchet_litso_rayon,
                  (
                      SELECT ARRAY_AGG(row_to_json(k_r_ch))
                      FROM (
                          SELECT  
                              k_r_ch.id,
                              k_r_ch.spravochnik_operatsii_id,
                              k_r_ch.summa,
                              k_r_ch.id_spravochnik_podrazdelenie,
                              k_r_ch.id_spravochnik_sostav,
                              k_r_ch.id_spravochnik_type_operatsii
                          FROM kassa_rasxod_child AS k_r_ch 
                          JOIN users AS u ON u.id = k_r.user_id
                          JOIN regions AS r ON r.id = u.region_id   
                          WHERE r.id = $1 
                            AND k_r_ch.main_schet_id = $2 
                            AND k_r_ch.kassa_rasxod_id = k_r.id
                      ) AS k_r_ch
                  ) AS childs
              FROM kassa_rasxod AS k_r
              JOIN users AS u ON u.id = k_r.user_id
              JOIN regions AS r ON r.id = u.region_id
              LEFT JOIN spravochnik_podotchet_litso AS s_p_l ON s_p_l.id = k_r.id_podotchet_litso
              WHERE r.id = $1 AND k_r.main_schet_id = $2 AND k_r.isdeleted = false AND k_r.doc_date BETWEEN $3 AND $4 ORDER BY k_r.doc_date
              OFFSET $5 LIMIT $6
          )
          SELECT 
              ARRAY_AGG(row_to_json(data)) AS data,
              (
                  SELECT COALESCE(SUM(k_r.summa), 0)
                  FROM kassa_rasxod AS k_r
                  JOIN users AS u ON u.id = k_r.user_id
                  JOIN regions AS r ON r.id = u.region_id  
                  WHERE k_r.main_schet_id = $2
                    AND r.id = $1
                    AND k_r.doc_date BETWEEN $3 AND $4 
                    AND k_r.isdeleted = false
              )::FLOAT AS summa,
              (
                  SELECT COALESCE(COUNT(k_r.id), 0)
                  FROM kassa_rasxod AS k_r
                  JOIN users AS u ON u.id = k_r.user_id
                  JOIN regions AS r ON r.id = u.region_id  
                  WHERE r.id = $1 
                    AND k_r.main_schet_id = $2 
                    AND k_r.doc_date BETWEEN $3 AND $4 
                    AND k_r.isdeleted = false
              )::INTEGER AS total_count
        FROM data
      `, [region_id, main_schet_id, from, to, offset, limit]);
    return { data: result.rows[0]?.data || [], summa: result.rows[0].summa, total: result.rows[0].total_count, };
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const getElementById = async (region_id, main_schet_id, id, ignoreDeleted = false) => {
  try {
    let ignore = ``
    if (!ignoreDeleted) {
      ignore = `AND k_r.isdeleted = false`
    }
    const result = await pool.query(
      ` SELECT 
            k_r.id, 
            k_r.doc_num,
            TO_CHAR(k_r.doc_date, 'YYYY-MM-DD') AS doc_date, 
            k_r.opisanie, 
            k_r.summa::FLOAT, 
            k_r.id_podotchet_litso,
            s_p_l.name AS spravochnik_podotchet_litso_name,
            s_p_l.rayon AS spravochnik_podotchet_litso_rayon,
            (
                SELECT ARRAY_AGG(row_to_json(k_r_ch))
                FROM (
                    SELECT  
                        k_r_ch.id,
                        k_r_ch.spravochnik_operatsii_id,
                        k_r_ch.summa,
                        k_r_ch.id_spravochnik_podrazdelenie,
                        k_r_ch.id_spravochnik_sostav,
                        k_r_ch.id_spravochnik_type_operatsii
                    FROM kassa_rasxod_child AS k_r_ch 
                    JOIN users AS u ON u.id = k_r.user_id
                    JOIN regions AS r ON r.id = u.region_id   
                    WHERE r.id = $1 
                      AND k_r_ch.main_schet_id = $2 
                      AND k_r_ch.kassa_rasxod_id = k_r.id
                ) AS k_r_ch
            ) AS childs
        FROM kassa_rasxod AS k_r
        JOIN users AS u ON u.id = k_r.user_id
        JOIN regions AS r ON r.id = u.region_id
        JOIN spravochnik_podotchet_litso AS s_p_l ON s_p_l.id = k_r.id_podotchet_litso
        WHERE r.id = $1 AND k_r.main_schet_id = $2 AND k_r.id = $3 ${ignore}
      `, [region_id, main_schet_id, id]);
    if (!result.rows[0]) {
      throw new ErrorResponse('kassa prixod doc not found', 404)
    }
    return result.rows[0];
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}


const updateKassaRasxodDB = async (data) => {
  try {
    const result = await pool.query(
      `
              UPDATE kassa_rasxod SET 
                  doc_num = $1, 
                  doc_date = $2, 
                  opisanie = $3, 
                  summa = $4, 
                  id_podotchet_litso = $5, 
                  updated_at = $6
              WHERE id = $7 RETURNING *
          `,
      [
        data.doc_num,
        data.doc_date,
        data.opisanie,
        data.summa,
        data.id_podotchet_litso,
        tashkentTime(),
        data.id,
    ]);
    return result.rows[0]
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const deleteKassaRasxodChild = async (id) => {
  try {
    await pool.query(`DELETE FROM kassa_rasxod_child WHERE kassa_rasxod_id = $1`,[id]);
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const deleteKassaRasxodDB = async (id) => {
  try {
    await pool.query(`UPDATE kassa_rasxod_child SET isdeleted = $1 WHERE kassa_rasxod_id = $2`,[true, id]);
    await pool.query(`UPDATE kassa_rasxod SET isdeleted = true WHERE id = $1 AND isdeleted = false`,[id],);
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

module.exports = {
  kassaRasxodCreateDB,
  kassaRasxodChild,
  getAllKassaRasxodDb,
  getElementById,
  updateKassaRasxodDB,
  deleteKassaRasxodChild,
  deleteKassaRasxodDB,
};
