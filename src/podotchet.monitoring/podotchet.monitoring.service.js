const pool = require("../config/db");
const ErrorResponse = require("../utils/errorResponse");

const getAllMonitoring = async (region_id, main_schet_id, offset, limit, from, to, podotchet_id) => {
    try {
        const { rows } = await pool.query(
            `
          WITH data AS (
            SELECT 
                k_p.id, 
                k_p.doc_num,
                TO_CHAR(k_p.doc_date, 'YYYY-MM-DD') AS doc_date,
                0 AS prixod_sum,
                k_p.summa AS rasxod_sum,
                k_p.opisanie,
                k_p.id_podotchet_litso AS podotchet_litso_id,
                u.login,
                u.fio,
                u.id AS user_id,
                (SELECT ARRAY_AGG(m_sch.jur1_schet || ' - ' || s_o.schet)
                    FROM kassa_prixod_child AS k_p_ch
                    JOIN spravochnik_operatsii AS s_o ON s_o.id = k_p_ch.spravochnik_operatsii_id
                    JOIN main_schet AS m_sch ON m_sch.id = k_p_ch.main_schet_id
                    WHERE k_p_ch.kassa_prixod_id = k_p.id
                ) AS schet_array
            FROM kassa_prixod k_p
            JOIN users u ON k_p.user_id = u.id
            JOIN regions r ON u.region_id = r.id
            WHERE r.id = $1 AND k_p.main_schet_id = $2 AND k_p.isdeleted = false AND k_p.id_podotchet_litso = $7
            AND k_p.doc_date BETWEEN $3 AND $4

            UNION ALL

            SELECT 
                k_r.id, 
                k_r.doc_num,
                TO_CHAR(k_r.doc_date, 'YYYY-MM-DD') AS doc_date,
                k_r.summa AS prixod_sum,
                0 AS rasxod_sum,
                k_r.opisanie,
                k_r.id_podotchet_litso AS podotchet_litso_id,
                u.login,
                u.fio,
                u.id AS user_id,
                (SELECT ARRAY_AGG(s_o.schet || ' - ' || m_sch.jur1_schet)
                    FROM kassa_rasxod_child AS k_r_ch
                    JOIN spravochnik_operatsii AS s_o ON s_o.id = k_r_ch.spravochnik_operatsii_id
                    JOIN main_schet AS m_sch ON m_sch.id = k_r_ch.main_schet_id
                    WHERE k_r_ch.kassa_rasxod_id = k_r.id
                ) AS schet_array
            FROM kassa_rasxod k_r
            JOIN users u ON k_r.user_id = u.id
            JOIN regions r ON u.region_id = r.id
            WHERE r.id = $1 AND k_r.main_schet_id = $2 AND k_r.isdeleted = false AND k_r.id_podotchet_litso = $7
            AND k_r.doc_date BETWEEN $3 AND $4

            UNION ALL

            SELECT 
                a_o_j4.id, 
                a_o_j4.doc_num,
                TO_CHAR(a_o_j4.doc_date, 'YYYY-MM-DD') AS doc_date,
                0 AS prixod_sum,
                a_o_j4.summa AS rasxod_sum,
                a_o_j4.opisanie,
                a_o_j4.spravochnik_podotchet_litso_id AS podotchet_litso_id,
                u.login,
                u.fio,
                u.id AS user_id,
                (SELECT ARRAY_AGG(s_o.schet || ' - ' || s_own.schet)
                    FROM avans_otchetlar_jur4_child AS a_o_j4_ch
                    JOIN spravochnik_operatsii AS s_o ON s_o.id = a_o_j4_ch.spravochnik_operatsii_id
                    JOIN spravochnik_operatsii AS s_own ON s_own.id = a_o_j4_ch.spravochnik_operatsii_own_id
                    WHERE a_o_j4_ch.avans_otchetlar_jur4_id = a_o_j4.id
                ) AS schet_array
            FROM avans_otchetlar_jur4 a_o_j4
            JOIN users u ON a_o_j4.user_id = u.id
            JOIN regions r ON u.region_id = r.id
            WHERE r.id = $1 AND a_o_j4.main_schet_id = $2 AND a_o_j4.isdeleted = false AND a_o_j4.spravochnik_podotchet_litso_id = $7
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
                    WHERE r.id = $1 AND k_r.main_schet_id = $2 AND k_r.isdeleted = false AND k_r.id_podotchet_litso = $7
                    AND k_r.doc_date BETWEEN $3 AND $4
                    UNION ALL
                    SELECT COUNT(k_p.id) AS counts
                    FROM kassa_prixod k_p
                    JOIN users u ON k_p.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    WHERE r.id = $1 AND k_p.main_schet_id = $2 AND k_p.isdeleted = false AND k_p.id_podotchet_litso = $7
                    AND k_p.doc_date BETWEEN $3 AND $4
                    UNION ALL
                    SELECT COUNT(a_o_j4.id) AS counts
                    FROM avans_otchetlar_jur4 a_o_j4
                    JOIN users u ON a_o_j4.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    WHERE r.id = $1 AND a_o_j4.main_schet_id = $2 AND a_o_j4.isdeleted = false AND a_o_j4.spravochnik_podotchet_litso_id = $7
                    AND a_o_j4.doc_date BETWEEN $3 AND $4
            ) AS subquery) AS total_count,
            COALESCE((SELECT SUM(a_o_j4.summa)
                    FROM avans_otchetlar_jur4 a_o_j4
                    JOIN users u ON a_o_j4.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    WHERE r.id = $1 AND a_o_j4.spravochnik_podotchet_litso_id = $7
                    AND a_o_j4.main_schet_id = $2 
                    AND a_o_j4.isdeleted = false
                    AND a_o_j4.doc_date < $3), 0) + 
            COALESCE((SELECT SUM(k_p.summa)
                    FROM kassa_prixod k_p
                    JOIN users u ON k_p.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    WHERE r.id = $1 AND k_p.id_podotchet_litso = $7
                    AND k_p.main_schet_id = $2 
                    AND k_p.isdeleted = false
                    AND k_p.doc_date < $3), 0)::FLOAT AS summa_from_rasxod,
            COALESCE((SELECT SUM(k_r.summa)
                    FROM kassa_rasxod k_r
                    JOIN users u ON k_r.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    WHERE r.id = $1 AND k_r.main_schet_id = $2 AND k_r.isdeleted = false AND k_r.id_podotchet_litso = $7
                    AND k_r.doc_date < $3), 0)::FLOAT AS summa_from_prixod, 
            COALESCE((SELECT SUM(a_o_j4.summa)
                    FROM avans_otchetlar_jur4 a_o_j4
                    JOIN users u ON a_o_j4.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    WHERE r.id = $1 AND a_o_j4.spravochnik_podotchet_litso_id = $7
                    AND a_o_j4.main_schet_id = $2 
                    AND a_o_j4.isdeleted = false
                    AND a_o_j4.doc_date BETWEEN $3 AND $4), 0) + 
            COALESCE((SELECT SUM(k_p.summa)
                    FROM kassa_prixod k_p
                    JOIN users u ON k_p.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    WHERE r.id = $1 AND k_p.id_podotchet_litso = $7
                    AND k_p.main_schet_id = $2 
                    AND k_p.isdeleted = false
                    AND k_p.doc_date BETWEEN $3 AND $4), 0)::FLOAT AS rasxod_sum,
            COALESCE((SELECT SUM(k_r.summa)
                    FROM kassa_rasxod k_r
                    JOIN users u ON k_r.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    WHERE r.id = $1 AND k_r.main_schet_id = $2 AND k_r.isdeleted = false AND k_r.id_podotchet_litso = $7
                    AND k_r.doc_date BETWEEN $3 AND $4), 0)::FLOAT AS prixod_sum,
            COALESCE((SELECT SUM(a_o_j4.summa)
                    FROM avans_otchetlar_jur4 a_o_j4
                    JOIN users u ON a_o_j4.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    WHERE r.id = $1 AND a_o_j4.spravochnik_podotchet_litso_id = $7
                    AND a_o_j4.main_schet_id = $2 
                    AND a_o_j4.isdeleted = false
                    AND a_o_j4.doc_date < $4), 0) + 
            COALESCE((SELECT SUM(k_p.summa)
                    FROM kassa_prixod k_p
                    JOIN users u ON k_p.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    WHERE r.id = $1 AND k_p.id_podotchet_litso = $7
                    AND k_p.main_schet_id = $2 
                    AND k_p.isdeleted = false
                    AND k_p.doc_date < $4), 0)::FLOAT AS summa_to_rasxod,
            COALESCE((SELECT SUM(k_r.summa)
                    FROM kassa_rasxod k_r
                    JOIN users u ON k_r.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    WHERE r.id = $1 AND k_r.main_schet_id = $2 AND k_r.isdeleted = false AND k_r.id_podotchet_litso = $7
                    AND k_r.doc_date < $4), 0)::FLOAT AS summa_to_prixod,
            ARRAY_AGG(row_to_json(data)) AS data
            FROM data`, [region_id, main_schet_id, from, to, offset, limit, podotchet_id],
        );
        const data = rows[0]
        return {
            data: data?.data || [],
            total: data.total_count,
            prixod_sum: data.prixod_sum,
            rasxod_sum: data.rasxod_sum,
            summa_from_rasxod: data.summa_from_rasxod,
            summa_from_prixod: data.summa_from_prixod,
            summa_to_prixod: data.summa_to_prixod,
            summa_to_rasxod: data.summa_to_rasxod
        };
    } catch (error) {
        throw new ErrorResponse(error.message, error.statusCode);
    }
};

module.exports = {
    getAllMonitoring
};