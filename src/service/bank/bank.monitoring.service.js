const pool = require("../../config/db");
const ErrorResponse = require("../../utils/errorResponse");

const getAllMonitoring = async (region_id, main_schet_id, offset, limit, from, to) => {
  try {
    const data = await pool.query(
      `
          WITH data AS (
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
            ORDER BY combined_date
            OFFSET $5 LIMIT $6
        )
        SELECT 
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
                        AND bp.doc_date BETWEEN $3 AND $4), 0))::INTEGER AS total_count,
            COALESCE((SELECT SUM(bp.summa)
              FROM bank_prixod bp
              JOIN users u ON bp.user_id = u.id
              JOIN regions r ON u.region_id = r.id
              WHERE r.id = $1 AND bp.main_schet_id = $2 AND bp.isdeleted = false
              AND bp.doc_date BETWEEN $3 AND $4), 0)::FLOAT AS prixod_sum,
            COALESCE((SELECT SUM(br.summa)
              FROM bank_rasxod br
              JOIN users u ON br.user_id = u.id
              JOIN regions r ON u.region_id = r.id
              WHERE r.id = $1 AND br.main_schet_id = $2 AND br.isdeleted = false
              AND br.doc_date BETWEEN $3 AND $4), 0)::FLOAT AS rasxod_sum,
            (SELECT 
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
                WHERE r.id = $1 AND br.main_schet_id = $2 AND br.isdeleted = false
                AND br.doc_date < $3 ), 0))::FLOAT AS summa_from,
            (SELECT 
                COALESCE((SELECT SUM(bp.summa) 
                FROM bank_prixod bp
                JOIN users u ON bp.user_id = u.id
                JOIN regions r ON u.region_id = r.id
                WHERE r.id = $1 AND bp.main_schet_id = $2 AND bp.isdeleted = false
                AND bp.doc_date <= $4), 0) -
                COALESCE((SELECT SUM(br.summa) 
                FROM bank_rasxod br
                JOIN users u ON br.user_id = u.id
                JOIN regions r ON u.region_id = r.id
                WHERE r.id = $1 AND br.main_schet_id = $2 AND br.isdeleted = false
                AND br.doc_date <= $4 ), 0))::FLOAT AS summa_to,
            ARRAY_AGG(row_to_json(data)) AS data
          FROM data`,[region_id, main_schet_id, from, to, offset, limit],
    ); 
    return {
      data: data.rows[0].data,
      total: data.rows[0].total_count,
      prixod_sum: data.rows[0].prixod_sum,
      rasxod_sum: data.rows[0].rasxod_sum,
      summaFrom: data.rows[0].summa_from,
      summaTo: data.rows[0].summa_to,
    };
  } catch (error) {
    throw new  ErrorResponse(error, error.statusCode)
  }
}

module.exports = {
  getAllMonitoring,
};
