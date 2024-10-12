const pool = require("../../config/db");
const ErrorResponse = require("../../utils/errorResponse");

const getAllMonitoring = async (region_id, main_schet_id, offset, limit, from, to) => {
    try {
        const { rows } = await pool.query(
            `
          WITH data AS (
            SELECT 
                k_p.id, 
                k_p.doc_num,
                TO_CHAR(k_p.doc_date, 'YYYY-MM-DD') AS doc_date,
                k_p.summa AS prixod_sum,
                0 AS rasxod_sum,
                k_p.opisanie
            FROM kassa_prixod k_p
            JOIN users u ON k_p.user_id = u.id
            JOIN regions r ON u.region_id = r.id
            WHERE r.id = $1 AND k_p.main_schet_id = $2 AND k_p.isdeleted = false 
            AND k_p.doc_date BETWEEN $3 AND $4

            UNION ALL

            SELECT 
                k_r.id, 
                k_r.doc_num,
                TO_CHAR(k_r.doc_date, 'YYYY-MM-DD') AS doc_date,
                0 AS prixod_sum,
                k_r.summa AS rasxod_sum,
                k_r.opisanie
            FROM kassa_rasxod k_r
            JOIN users u ON k_r.user_id = u.id
            JOIN regions r ON u.region_id = r.id
            WHERE r.id = $1 AND k_r.main_schet_id = $2 AND k_r.isdeleted = false
            AND k_r.doc_date BETWEEN $3 AND $4

            UNION ALL

            SELECT 
                a_o_j4.id, 
                a_o_j4.doc_num,
                TO_CHAR(a_o_j4.doc_date, 'YYYY-MM-DD') AS doc_date,
                0 AS prixod_sum,
                a_o_j4.summa AS rasxod_sum,
                a_o_j4.opisanie
            FROM avans_otchetlar_jur4 a_o_j4
            JOIN users u ON a_o_j4.user_id = u.id
            JOIN regions r ON u.region_id = r.id
            WHERE r.id = $1 AND a_o_j4.main_schet_id = $2 AND a_o_j4.isdeleted = false
            AND a_o_j4.doc_date BETWEEN $3 AND $4

            ORDER BY doc_date
            OFFSET $5 LIMIT $6
        )
        SELECT 
            (SELECT 
                COALESCE(SUM(counts), 0)::INTEGER AS total_count
                FROM (
                    SELECT COUNT(k_r.id) AS counts
                    FROM kassa_rasxod k_r
                    JOIN users u ON k_r.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    WHERE r.id = $1 AND k_r.main_schet_id = $2 AND k_r.isdeleted = false
                    AND k_r.doc_date BETWEEN $3 AND $4
                    UNION ALL
                    SELECT COUNT(k_p.id) AS counts
                    FROM kassa_prixod k_p
                    JOIN users u ON k_p.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    WHERE r.id = $1 AND k_p.main_schet_id = $2 AND k_p.isdeleted = false
                    AND k_p.doc_date BETWEEN $3 AND $4
                    UNION ALL
                    SELECT COUNT(a_o_j4.id) AS counts
                    FROM avans_otchetlar_jur4 a_o_j4
                    JOIN users u ON a_o_j4.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    WHERE r.id = $1 AND a_o_j4.main_schet_id = $2 AND a_o_j4.isdeleted = false
                    AND a_o_j4.doc_date BETWEEN $3 AND $4
            ))::INTEGER AS total_count,
            (SELECT 
                COALESCE((SELECT SUM(a_o_j4.summa)
                    FROM avans_otchetlar_jur4 a_o_j4
                    JOIN users u ON a_o_j4.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    WHERE r.id = $1 
                    AND a_o_j4.main_schet_id = $2 
                    AND a_o_j4.isdeleted = false
                    AND a_o_j4.doc_date BETWEEN $3 AND $4), 0) + 
                COALESCE((SELECT SUM(k_p.summa)
                    FROM kassa_prixod k_p
                    JOIN users u ON k_p.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    WHERE r.id = $1 
                    AND k_p.main_schet_id = $2 
                    AND k_p.isdeleted = false
                    AND k_p.doc_date BETWEEN $3 AND $4), 0))::FLOAT AS prixod_sum,
            COALESCE((SELECT SUM(k_r.summa)
              FROM kassa_rasxod k_r
              JOIN users u ON k_r.user_id = u.id
              JOIN regions r ON u.region_id = r.id
              WHERE r.id = $1 AND k_r.main_schet_id = $2 AND k_r.isdeleted = false
              AND k_r.doc_date BETWEEN $3 AND $4), 0)::FLOAT AS rasxod_sum,
            (SELECT 
                (COALESCE((SELECT SUM(a_o_j4.summa)
                    FROM avans_otchetlar_jur4 a_o_j4
                    JOIN users u ON a_o_j4.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    WHERE r.id = $1 AND a_o_j4.main_schet_id = $2 AND a_o_j4.isdeleted = false
                    AND a_o_j4.doc_date < $3 ), 0) + 
                COALESCE((SELECT SUM(k_p.summa)
                    FROM kassa_prixod k_p
                    JOIN users u ON k_p.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    WHERE r.id = $1 AND k_p.main_schet_id = $2 AND k_p.isdeleted = false
                    AND k_p.doc_date < $3), 0)) -
                COALESCE((SELECT SUM(k_r.summa) 
                    FROM kassa_rasxod k_r
                    JOIN users u ON k_r.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    WHERE r.id = $1 AND k_r.main_schet_id = $2 AND k_r.isdeleted = false
                    AND k_r.doc_date < $3 ), 0))::FLOAT AS summa_from,
            (SELECT 
                (COALESCE((SELECT SUM(a_o_j4.summa)
                    FROM avans_otchetlar_jur4 a_o_j4
                    JOIN users u ON a_o_j4.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    WHERE r.id = $1 AND a_o_j4.main_schet_id = $2 AND a_o_j4.isdeleted = false
                    AND a_o_j4.doc_date <= $4 ), 0) + 
                COALESCE((SELECT SUM(k_p.summa)
                    FROM kassa_prixod k_p
                    JOIN users u ON k_p.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    WHERE r.id = $1 AND k_p.main_schet_id = $2 AND k_p.isdeleted = false
                    AND k_p.doc_date <= $4), 0)) -
                COALESCE((SELECT SUM(k_r.summa) 
                    FROM kassa_rasxod k_r
                    JOIN users u ON k_r.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    WHERE r.id = $1 AND k_r.main_schet_id = $2 AND k_r.isdeleted = false
                    AND k_r.doc_date <= $4 ), 0))::FLOAT AS summa_to,
            ARRAY_AGG(row_to_json(data)) AS data
          FROM data`, [region_id, main_schet_id, from, to, offset, limit],
        );
        return {
            data: rows[0]?.data || [],
            total: rows[0].total_count,
            prixod_sum: rows[0].prixod_sum,
            rasxod_sum: rows[0].rasxod_sum,
            summaFrom: rows[0].summa_from,
            summaTo: rows[0].summa_to,
        };
    } catch (error) {
        throw new ErrorResponse(error, error.statusCode)
    }
}

module.exports = {
    getAllMonitoring,
};
