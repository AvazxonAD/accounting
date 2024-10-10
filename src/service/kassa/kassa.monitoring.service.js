const pool = require("../../config/db");
const ErrorResponse = require("../../utils/errorResponse");
const getAllMonitoring = async (region_id, main_schet_id, offset, limit, from, to) => {
  try {
    const { rows } = await pool.query(
      ` 
        WITH data AS (
          SELECT 
              kp.id, 
              kp.doc_num,
              TO_CHAR(kp.doc_date, 'YYYY-MM-DD') AS doc_date,
              kp.summa AS prixod_sum,
              0 AS rasxod_sum,
              kp.id_podotchet_litso,
              spravochnik_podotchet_litso.name AS spravochnik_podotchet_litso_name,
              kp.opisanie,
              kp.doc_date AS combined_date
          FROM kassa_prixod kp
          JOIN users u ON kp.user_id = u.id
          JOIN regions r ON u.region_id = r.id
          JOIN spravochnik_podotchet_litso ON spravochnik_podotchet_litso.id = kp.id_podotchet_litso
          WHERE r.id = $1 AND kp.main_schet_id = $2
          AND kp.doc_date BETWEEN $3 AND $4

          UNION ALL

          SELECT 
              kr.id, 
              kr.doc_num,
              TO_CHAR(kr.doc_date, 'YYYY-MM-DD') AS doc_date,
              0 AS prixod_sum,
              kr.summa AS rasxod_sum,
              kr.id_podotchet_litso,
              spravochnik_podotchet_litso.name,
              kr.opisanie,
              kr.doc_date AS combined_date
          FROM kassa_rasxod kr
          JOIN users u ON kr.user_id = u.id
          JOIN regions r ON u.region_id = r.id
          JOIN spravochnik_podotchet_litso ON spravochnik_podotchet_litso.id = kr.id_podotchet_litso
          WHERE r.id = $1 AND kr.main_schet_id = $2
          AND kr.doc_date BETWEEN $3 AND $4
          ORDER BY combined_date
          OFFSET $5 LIMIT $6
      ) 
      SELECT 
          ARRAY_AGG(row_to_json(data)) AS data,
          (SELECT 
              COALESCE((SELECT COUNT(kr.id) 
                        FROM kassa_rasxod kr
                        JOIN users u ON kr.user_id = u.id
                        JOIN regions r ON u.region_id = r.id
                        WHERE r.id = $1 AND kr.main_schet_id = $2 
                        AND kr.doc_date BETWEEN $3 AND $4), 0) +
              COALESCE((SELECT COUNT(kp.id) 
                        FROM kassa_prixod kp
                        JOIN users u ON kp.user_id = u.id
                        JOIN regions r ON u.region_id = r.id
                        WHERE r.id = $1 AND kp.main_schet_id = $2 
                        AND kp.doc_date BETWEEN $3 AND $4), 0))::INTEGER AS total_count,
          (COALESCE((SELECT SUM(kp.summa)
                    FROM kassa_prixod kp
                    JOIN users u ON kp.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    WHERE r.id = $1 AND kp.main_schet_id = $2 
                    AND kp.doc_date BETWEEN $3 AND $4), 0))::FLOAT AS prixod_sum,
          (COALESCE((SELECT SUM(kr.summa)
                    FROM kassa_rasxod kr
                    JOIN users u ON kr.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    WHERE r.id = $1 AND kr.main_schet_id = $2 
                    AND kr.doc_date BETWEEN $3 AND $4), 0))::FLOAT  AS rasxod_sum,
          (SELECT COALESCE((SELECT SUM(kp.summa) 
                            FROM kassa_prixod kp
                            JOIN users u ON kp.user_id = u.id
                            JOIN regions r ON u.region_id = r.id
                            WHERE r.id = $1 AND kp.main_schet_id = $2 
                            AND kp.doc_date < $3), 0) -
                  COALESCE((SELECT SUM(kr.summa) 
                            FROM kassa_rasxod kr
                            JOIN users u ON kr.user_id = u.id
                            JOIN regions r ON u.region_id = r.id
                            WHERE r.id = $1 AND kr.main_schet_id = $2 
                            AND kr.doc_date < $3), 0))::FLOAT  AS summa_from,
          (SELECT COALESCE((SELECT SUM(kp.summa) 
                            FROM kassa_prixod kp
                            JOIN users u ON kp.user_id = u.id
                            JOIN regions r ON u.region_id = r.id
                            WHERE r.id = $1 AND kp.main_schet_id = $2 
                            AND kp.doc_date <= $3), 0) -
                  COALESCE((SELECT SUM(kr.summa) 
                            FROM kassa_rasxod kr
                            JOIN users u ON kr.user_id = u.id
                            JOIN regions r ON u.region_id = r.id
                            WHERE r.id = $1 AND kr.main_schet_id = $2 
                            AND kr.doc_date <= $3), 0))::FLOAT  AS summa_to
      FROM data`
    , [region_id, main_schet_id, from, to, offset, limit])
    return {
      data: rows[0]?.data || [],
      total: rows[0].total_count,
      prixod_sum: rows[0].prixod_sum,
      rasxod_sum: rows[0].rasxod_sum,
      summa_from: rows[0].summa_from,
      summa_to: rows[0].summa_to,
    };
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

module.exports = {
  getAllMonitoring,
};
