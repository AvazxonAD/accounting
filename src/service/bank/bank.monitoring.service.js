const pool = require("../../config/db");
const { handleServiceError } = require("../../middleware/service.handle");
const { returnLocalDate } = require("../../utils/date.function");
const ErrorResponse = require("../../utils/errorResponse");

const getAllMonitoring = async (region_id, main_schet_id, offset, limit, from, to) => {
  try {
    const data = await pool.query(
      `
          WHITH data AS (
                SELECT 
                  bp.id, 
                  bp.doc_num,
                  TO_CHAR(bp.doc_date, 'YYYY-MM-DD') AS doc_date,
                  bp.summa AS prixod_sum,
                  0 AS rasxod_sum,
                  bp.id_spravochnik_organization,
                  so.name AS spravochnik_organization_name,
                  so.raschet_schet AS spravochnik_organization_raschet_schet,
                  so.inn AS spravochnik_organization_inn,
                  bp.id_shartnomalar_organization,
                  so2.doc_num AS shartnomalar_doc_num,
                  TO_CHAR(so2.doc_date, 'YYYY-MM-DD') AS shartnomalar_doc_date,
                  bp.opisanie,
                  bp.doc_date AS combined_date
              FROM bank_prixod bp
              JOIN users u ON bp.user_id = u.id
              JOIN regions r ON u.region_id = r.id
              JOIN spravochnik_organization so ON bp.id_spravochnik_organization = so.id
              LEFT JOIN shartnomalar_organization so2 ON bp.id_shartnomalar_organization = so2.id
              WHERE r.id = $1 AND bp.main_schet_id = $2 AND bp.isdeleted = false 
              AND bp.doc_date BETWEEN $3 AND $4
              
              UNION ALL
              
              SELECT 
                  br.id, 
                  br.doc_num,
                  TO_CHAR(br.doc_date, 'YYYY-MM-DD') AS doc_date,
                  0 AS prixod_sum,
                  br.summa AS rasxod_sum,
                  br.id_spravochnik_organization,
                  so.name AS spravochnik_organization_name,
                  so.raschet_schet AS spravochnik_organization_raschet_schet,
                  so.inn AS spravochnik_organization_inn,
                  br.id_shartnomalar_organization,
                  so2.doc_num AS shartnomalar_doc_num,
                  TO_CHAR(so2.doc_date, 'YYYY-MM-DD') AS shartnomalar_doc_date,
                  br.opisanie,
                  br.doc_date AS combined_date
              FROM bank_rasxod br
              JOIN users u ON br.user_id = u.id
              JOIN regions r ON u.region_id = r.id
              JOIN spravochnik_organization so ON br.id_spravochnik_organization = so.id
              LEFT JOIN shartnomalar_organization so2 ON br.id_shartnomalar_organization = so2.id
              WHERE r.id = $1 AND br.main_schet_id = $2 AND br.isdeleted = false
              AND br.doc_date BETWEEN $3 AND $4
              ORDER BY combined_date DESC
              OFFSET $5 LIMIT $6;
          )
          SELECT 
            ARRAY_AGG(row_to_json(data)) AS data,
            (SELECT 
              COALESCE((SELECT COUNT(br.id) 
                      FROM bank_rasxod br
                      JOIN users u ON br.user_id = u.id
                      JOIN regions r ON u.region_id = r.id
                      WHERE r.id = $1 AND br.main_schet_id = $2 AND br.isdeleted = false
                      AND br.doc_date BETWEEN $3 AND $4), 0) +
              COALESCE((SELECT COUNT(bp.id) 
                      FROM bank_prixod bp
                      JOIN users u ON bp.user_id = u.id
                      JOIN regions r ON u.region_id = r.id
                      WHERE r.id = $1 AND bp.main_schet_id = $2 AND bp.isdeleted = false
                      AND bp.doc_date BETWEEN $3 AND $4), 0) AS total_count
            ) AS total_count
            
      `,
      [region_id, main_schet_id, from, to, offset, limit],
    );
  
    const total = await pool.query(
      `
          SELECT 
          COALESCE((SELECT COUNT(br.id) 
                  FROM bank_rasxod br
                  JOIN users u ON br.user_id = u.id
                  JOIN regions r ON u.region_id = r.id
                  WHERE r.id = $1 AND br.main_schet_id = $2 AND br.isdeleted = false
                  AND br.doc_date BETWEEN $3 AND $4), 0) +
          COALESCE((SELECT COUNT(bp.id) 
                  FROM bank_prixod bp
                  JOIN users u ON bp.user_id = u.id
                  JOIN regions r ON u.region_id = r.id
                  WHERE r.id = $1 AND bp.main_schet_id = $2 AND bp.isdeleted = false
                  AND bp.doc_date BETWEEN $3 AND $4), 0) AS total_count
      `,
      [region_id, main_schet_id, from, to],
    );
  
    const prixod_sum = await pool.query(
      `
          SELECT SUM(bp.summa) AS all_prixod_sum
          FROM bank_prixod bp
          JOIN users u ON bp.user_id = u.id
          JOIN regions r ON u.region_id = r.id
          WHERE r.id = $1 AND bp.main_schet_id = $2 AND bp.isdeleted = false
          AND bp.doc_date BETWEEN $3 AND $4
      `,
      [region_id, main_schet_id, from, to],
    );
  
    const rasxod_sum = await pool.query(
      `
          SELECT SUM(br.summa) AS all_rasxod_sum
          FROM bank_rasxod br
          JOIN users u ON br.user_id = u.id
          JOIN regions r ON u.region_id = r.id
          WHERE r.id = $1 AND br.main_schet_id = $2 AND br.isdeleted = false
          AND br.doc_date BETWEEN $3 AND $4
      `,
      [region_id, main_schet_id, from, to],
    );
  
    const summaFrom = await pool.query(`
          SELECT 
            COALESCE((SELECT SUM(bp.summa) 
                    FROM bank_prixod bp
                    JOIN users u ON bp.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    WHERE r.id = $1 AND bp.main_schet_id = $2 AND bp.isdeleted = false
                    AND bp.doc_date < $3), 0) -
            COALESCE((SELECT SUM(br.summa) 
                    FROM bank_rasxod br
                    JOIN users u ON br.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    WHERE r.id = $1 AND br.main_schet_id = $2 AND  br.isdeleted = false
                    AND br.doc_date < $3 ), 0) AS total_sum
          `,
      [
        region_id,
        main_schet_id,
        from,
      ]
    );
  
    const summaTo = await pool.query(`
        SELECT 
          COALESCE((SELECT SUM(bp.summa) 
                  FROM bank_prixod bp
                  JOIN users u ON bp.user_id = u.id
                  JOIN regions r ON u.region_id = r.id
                  WHERE r.id = $1 AND bp.main_schet_id = $2 AND bp.isdeleted = false
                  AND bp.doc_date <= $3), 0) -
          COALESCE((SELECT SUM(br.summa) 
                  FROM bank_rasxod br
                  JOIN users u ON br.user_id = u.id
                  JOIN regions r ON u.region_id = r.id
                  WHERE r.id = $1 AND br.main_schet_id = $2 AND  br.isdeleted = false
                  AND br.doc_date <= $3 ), 0) AS total_sum
      `, [region_id, main_schet_id, to]);
  
    const result_data = data.rows.map((row) => ({
      id: row.id,
      doc_num: row.doc_num,
      doc_date: row.doc_date,
      prixod_sum: Number(row.prixod_sum),
      rasxod_sum: Number(row.rasxod_sum),
      id_spravochnik_organization: row.id_spravochnik_organization,
      spravochnik_organization_name: row.spravochnik_organization_name,
      spravochnik_organization_raschet_schet:
        row.spravochnik_organization_raschet_schet,
      spravochnik_organization_inn: row.spravochnik_organization_inn,
      shartnomalar_doc_num: row.shartnomalar_doc_num,
      shartnomalar_doc_date: row.shartnomalar_doc_date,
      opisanie: row.opisanie,
    }));
  
    return {
      result_data,
      total_count: total.rows[0].total_count,
      all_prixod_sum: prixod_sum.rows[0].all_prixod_sum,
      all_rasxod_sum: rasxod_sum.rows[0].all_rasxod_sum,
      total_sum_from: summaFrom.rows[0].total_sum,
      total_sum_to: summaTo.rows[0].total_sum,
    };
  } catch (error) {
    throw new  ErrorResponse(error, error.statusCode)
  }
}

module.exports = {
  getAllMonitoring,
};
