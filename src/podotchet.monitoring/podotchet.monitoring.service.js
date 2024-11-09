const pool = require("../config/db");
const ErrorResponse = require("../utils/errorResponse");

const getAllMonitoring = async (region_id, main_schet_id, offset, limit, from, to, podotchet_id = null) => {
    try {
        const params =[region_id, main_schet_id, from, to, offset, limit]
        let k_p_podotchet_filter = ``
        let k_r_podotchet_filter = ``
        let b_r_podotchet_filter = ``
        let a_o_j4_podotchet_filter = ``
        let b_p_podotchet_filter = ``
        if(podotchet_id){
            k_p_podotchet_filter = `AND k_p.id_podotchet_litso = $${params.length + 1}`
            k_r_podotchet_filter = `AND k_r.id_podotchet_litso = $${params.length + 1}`
            a_o_j4_podotchet_filter = `AND a_o_j4.spravochnik_podotchet_litso_id = $${params.length + 1}`
            b_r_podotchet_filter = `AND b_r_ch.id_spravochnik_podotchet_litso = $${params.length + 1}`
            b_p_podotchet_filter = ` IS NOT NULL= $${params.length + 1}`
            params.push(podotchet_id)

        }
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
                s_p_l.name AS podotchet_name,
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
            JOIN spravochnik_podotchet_litso AS s_p_l ON s_p_l.id = k_p.id_podotchet_litso 
            JOIN users u ON k_p.user_id = u.id
            JOIN regions r ON u.region_id = r.id
            WHERE r.id = $1 AND k_p.main_schet_id = $2 AND k_p.isdeleted = false ${k_p_podotchet_filter} AND k_p.id_podotchet_litso IS NOT NULL  
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
                s_p_l.name AS podotchet_name,
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
            JOIN spravochnik_podotchet_litso AS s_p_l ON s_p_l.id = k_r.id_podotchet_litso 
            JOIN users u ON k_r.user_id = u.id
            JOIN regions r ON u.region_id = r.id
            WHERE r.id = $1 AND k_r.main_schet_id = $2 AND k_r.isdeleted = false ${k_r_podotchet_filter} AND k_r.id_podotchet_litso IS NOT NULL 
            AND k_r.doc_date BETWEEN $3 AND $4

            UNION ALL

            SELECT 
                b_r.id, 
                b_r.doc_num,
                TO_CHAR(b_r.doc_date, 'YYYY-MM-DD') AS doc_date,
                b_r_ch.summa AS prixod_sum,
                0 AS rasxod_sum,
                b_r.opisanie,
                b_r_ch.id_spravochnik_podotchet_litso AS podotchet_litso_id,
                s_p_l.name AS podotchet_name,
                u.login,
                u.fio,
                u.id AS user_id,
                (SELECT ARRAY_AGG(s_o.schet || ' - ' || m_sch.jur2_schet)
                FROM bank_rasxod_child AS inner_b_r_ch
                JOIN bank_rasxod AS inner_b_r ON inner_b_r.id = inner_b_r_ch.id_bank_rasxod
                JOIN spravochnik_operatsii AS s_o ON s_o.id = inner_b_r_ch.spravochnik_operatsii_id
                JOIN main_schet AS m_sch ON m_sch.id = inner_b_r.main_schet_id
                WHERE inner_b_r_ch.id_bank_rasxod = b_r.id
                ) AS schet_array
            FROM bank_rasxod b_r
            JOIN bank_rasxod_child AS b_r_ch ON b_r_ch.id_bank_rasxod = b_r.id
            JOIN spravochnik_podotchet_litso AS s_p_l ON s_p_l.id = b_r_ch.id_spravochnik_podotchet_litso 
            JOIN users u ON b_r.user_id = u.id
            JOIN regions r ON u.region_id = r.id
            WHERE r.id = $1 
                AND b_r.main_schet_id = $2 
                AND b_r.isdeleted = false 
                ${b_r_podotchet_filter} AND b_r_ch.id_spravochnik_podotchet_litso IS NOT NULL 
                AND b_r.doc_date BETWEEN $3 AND $4

            UNION ALL

            SELECT 
                b_p.id, 
                b_p.doc_num,
                TO_CHAR(b_p.doc_date, 'YYYY-MM-DD') AS doc_date,
                0 AS prixod_sum,
                b_p_ch.summa AS rasxod_sum,
                b_p.opisanie,
                b_p_ch.id_spravochnik_podotchet_litso AS podotchet_litso_id,
                s_p_l.name AS podotchet_name,
                u.login,
                u.fio,
                u.id AS user_id,
                (SELECT ARRAY_AGG(m_sch.jur2_schet || ' - ' || s_o.schet)
                    FROM bank_prixod_child AS inner_b_p_ch
                    JOIN bank_prixod AS inner_b_p ON inner_b_p.id = inner_b_p_ch.id_bank_prixod
                    JOIN spravochnik_operatsii AS s_o ON s_o.id = inner_b_p_ch.spravochnik_operatsii_id
                    JOIN main_schet AS m_sch ON m_sch.id = inner_b_p.main_schet_id
                    WHERE inner_b_p_ch.id_bank_prixod = b_p.id
                ) AS schet_array
            FROM bank_prixod b_p
            JOIN bank_prixod_child AS b_p_ch ON b_p_ch.id_bank_prixod = b_p.id
            JOIN spravochnik_podotchet_litso AS s_p_l ON s_p_l.id = b_p_ch.id_spravochnik_podotchet_litso 
            JOIN users u ON b_p.user_id = u.id
            JOIN regions r ON u.region_id = r.id
            WHERE r.id = $1 
                AND b_p.main_schet_id = $2 
                AND b_p.isdeleted = false 
                ${b_p_podotchet_filter}  IS NOT NULL
                AND b_p.doc_date BETWEEN $3 AND $4

            UNION ALL

            SELECT 
                a_o_j4.id, 
                a_o_j4.doc_num,
                TO_CHAR(a_o_j4.doc_date, 'YYYY-MM-DD') AS doc_date,
                0 AS prixod_sum,
                a_o_j4.summa AS rasxod_sum,
                a_o_j4.opisanie,
                a_o_j4.spravochnik_podotchet_litso_id AS podotchet_litso_id,
                s_p_l.name AS podotchet_name,
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
            JOIN spravochnik_podotchet_litso AS s_p_l ON s_p_l.id = a_o_j4.spravochnik_podotchet_litso_id
            JOIN users u ON a_o_j4.user_id = u.id
            JOIN regions r ON u.region_id = r.id
            WHERE r.id = $1 AND a_o_j4.main_schet_id = $2 AND a_o_j4.isdeleted = false ${a_o_j4_podotchet_filter}  AND  a_o_j4.spravochnik_podotchet_litso_id IS NOT NULL
            AND a_o_j4.doc_date BETWEEN $3 AND $4
            ORDER BY podotchet_litso_id DESC
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
                    WHERE r.id = $1 AND k_r.main_schet_id = $2 AND k_r.isdeleted = false ${k_r_podotchet_filter} AND k_r.id_podotchet_litso IS NOT NULL
                    AND k_r.doc_date BETWEEN $3 AND $4
                    UNION ALL
                    SELECT COUNT(k_p.id) AS counts
                    FROM kassa_prixod k_p
                    JOIN users u ON k_p.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    WHERE r.id = $1 AND k_p.main_schet_id = $2 AND k_p.isdeleted = false ${k_p_podotchet_filter} AND k_p.id_podotchet_litso IS NOT NULL 
                    AND k_p.doc_date BETWEEN $3 AND $4
                    UNION ALL
                    SELECT COUNT(a_o_j4.id) AS counts
                    FROM avans_otchetlar_jur4 a_o_j4
                    JOIN users u ON a_o_j4.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    WHERE r.id = $1 AND a_o_j4.main_schet_id = $2 AND a_o_j4.isdeleted = false ${a_o_j4_podotchet_filter}  AND  a_o_j4.spravochnik_podotchet_litso_id IS NOT NULL
                    AND a_o_j4.doc_date BETWEEN $3 AND $4
                    UNION ALL
                    SELECT COUNT(b_p_ch.id) AS counts
                    FROM bank_prixod_child b_p_ch
                    JOIN users u ON b_p_ch.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    JOIN bank_prixod AS b_p ON b_p.id = b_p_ch.id_bank_prixod
                    WHERE r.id = $1 AND b_p.main_schet_id = $2 AND b_p_ch.isdeleted = false ${b_p_podotchet_filter} AND b_p_ch.id_spravochnik_podotchet_litso IS NOT NULL
                    AND b_p.doc_date BETWEEN $3 AND $4
                    UNION ALL
                    SELECT COUNT(b_r_ch.id) AS counts
                    FROM bank_rasxod_child b_r_ch
                    JOIN users u ON b_r_ch.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    JOIN bank_rasxod AS b_r ON b_r.id = b_r_ch.id_bank_rasxod
                    WHERE r.id = $1 AND b_r.main_schet_id = $2 AND b_r_ch.isdeleted = false ${b_r_podotchet_filter} AND b_r_ch.id_spravochnik_podotchet_litso IS NOT NULL
                    AND b_r.doc_date BETWEEN $3 AND $4
            ) AS subquery) AS total_count,
            (
                (SELECT COALESCE(SUM(a_o_j4.summa), 0)
                    FROM avans_otchetlar_jur4 a_o_j4
                    JOIN users u ON a_o_j4.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    WHERE r.id = $1 ${a_o_j4_podotchet_filter}  AND  a_o_j4.spravochnik_podotchet_litso_id IS NOT NULL
                        AND a_o_j4.main_schet_id = $2 
                        AND a_o_j4.isdeleted = false
                        AND a_o_j4.doc_date < $3 ) + 
                (SELECT COALESCE(SUM(k_p.summa), 0)
                    FROM kassa_prixod k_p
                    JOIN users u ON k_p.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    WHERE r.id = $1 ${k_p_podotchet_filter} AND k_p.id_podotchet_litso IS NOT NULL 
                        AND k_p.main_schet_id = $2 
                        AND k_p.isdeleted = false
                        AND k_p.doc_date < $3 ) + 
                (SELECT COALESCE(SUM(b_p_ch.summa), 0)
                    FROM bank_prixod_child b_p_ch
                    JOIN bank_prixod b_p ON b_p.id = b_p_ch.id_bank_prixod
                    JOIN users u ON b_p_ch.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    WHERE r.id = $1 ${b_p_podotchet_filter} AND b_p_ch.id_spravochnik_podotchet_litso IS NOT NULL
                        AND b_p_ch.main_schet_id = $2 
                        AND b_p_ch.isdeleted = false
                        AND b_p.doc_date < $3 )
            )::FLOAT AS summa_from_rasxod,
            (   
                (SELECT COALESCE(SUM(k_r.summa), 0)
                    FROM kassa_rasxod k_r
                    JOIN users u ON k_r.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    WHERE r.id = $1 AND k_r.main_schet_id = $2 AND k_r.isdeleted = false ${k_r_podotchet_filter} AND k_r.id_podotchet_litso IS NOT NULL
                    AND k_r.doc_date < $3) + 
                (SELECT COALESCE(SUM(b_r_ch.summa), 0)
                    FROM bank_rasxod_child b_r_ch
                    JOIN bank_rasxod b_r ON b_r.id = b_r_ch.id_bank_rasxod
                    JOIN users u ON b_r_ch.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    WHERE r.id = $1 ${b_r_podotchet_filter} AND b_r_ch.id_spravochnik_podotchet_litso IS NOT NULL
                        AND b_r_ch.main_schet_id = $2 
                        AND b_r_ch.isdeleted = false
                        AND b_r.doc_date < $3 )
            )::FLOAT AS summa_from_prixod, 
            (
                (SELECT COALESCE(SUM(a_o_j4.summa), 0)
                    FROM avans_otchetlar_jur4 a_o_j4
                    JOIN users u ON a_o_j4.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    WHERE r.id = $1 ${a_o_j4_podotchet_filter}  AND  a_o_j4.spravochnik_podotchet_litso_id IS NOT NULL
                        AND a_o_j4.main_schet_id = $2 
                        AND a_o_j4.isdeleted = false
                        AND a_o_j4.doc_date BETWEEN $3 AND $4) + 
                (SELECT COALESCE(SUM(k_p.summa), 0)
                    FROM kassa_prixod k_p
                    JOIN users u ON k_p.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    WHERE r.id = $1 ${k_p_podotchet_filter} AND k_p.id_podotchet_litso IS NOT NULL 
                        AND k_p.main_schet_id = $2 
                        AND k_p.isdeleted = false
                        AND k_p.doc_date BETWEEN $3 AND $4) + 
                (SELECT COALESCE(SUM(b_p_ch.summa), 0)
                    FROM bank_prixod_child b_p_ch
                    JOIN bank_prixod b_p ON b_p.id = b_p_ch.id_bank_prixod
                    JOIN users u ON b_p_ch.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    WHERE r.id = $1 ${b_p_podotchet_filter} AND b_p_ch.id_spravochnik_podotchet_litso IS NOT NULL
                        AND b_p_ch.main_schet_id = $2 
                        AND b_p_ch.isdeleted = false
                        AND b_p.doc_date BETWEEN $3 AND $4 )
            )::FLOAT AS rasxod_sum,
            (
                (SELECT COALESCE(SUM(k_r.summa), 0)
                    FROM kassa_rasxod k_r
                    JOIN users u ON k_r.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    WHERE r.id = $1 AND k_r.main_schet_id = $2 
                        AND k_r.isdeleted = false ${k_r_podotchet_filter} AND k_r.id_podotchet_litso IS NOT NULL
                        AND k_r.doc_date BETWEEN $3 AND $4) + 
                (SELECT COALESCE(SUM(b_r_ch.summa), 0)
                    FROM bank_rasxod_child b_r_ch
                    JOIN bank_rasxod b_r ON b_r.id = b_r_ch.id_bank_rasxod
                    JOIN users u ON b_r_ch.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    WHERE r.id = $1 ${b_r_podotchet_filter} AND b_r_ch.id_spravochnik_podotchet_litso IS NOT NULL
                        AND b_r_ch.main_schet_id = $2 
                        AND b_r_ch.isdeleted = false
                        AND b_r.doc_date BETWEEN $3 AND $4 )
            )::FLOAT AS prixod_sum,
            (
                (SELECT COALESCE(SUM(a_o_j4.summa), 0)
                    FROM avans_otchetlar_jur4 a_o_j4
                    JOIN users u ON a_o_j4.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    WHERE r.id = $1 ${a_o_j4_podotchet_filter}  AND  a_o_j4.spravochnik_podotchet_litso_id IS NOT NULL
                        AND a_o_j4.main_schet_id = $2 
                        AND a_o_j4.isdeleted = false
                        AND a_o_j4.doc_date <= $4) + 
                (SELECT COALESCE(SUM(k_p.summa), 0)
                    FROM kassa_prixod k_p
                    JOIN users u ON k_p.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    WHERE r.id = $1 ${k_p_podotchet_filter} AND k_p.id_podotchet_litso IS NOT NULL 
                        AND k_p.main_schet_id = $2 
                        AND k_p.isdeleted = false
                        AND k_p.doc_date <= $4) +
                (SELECT COALESCE(SUM(b_p_ch.summa), 0)
                    FROM bank_prixod_child b_p_ch
                    JOIN bank_prixod b_p ON b_p.id = b_p_ch.id_bank_prixod
                    JOIN users u ON b_p_ch.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    WHERE r.id = $1 ${b_p_podotchet_filter} AND b_p_ch.id_spravochnik_podotchet_litso IS NOT NULL
                        AND b_p_ch.main_schet_id = $2 
                        AND b_p_ch.isdeleted = false
                        AND b_p.doc_date <= $4 )
            )::FLOAT AS summa_to_rasxod,
            (   
                (SELECT COALESCE(SUM(k_r.summa), 0)
                    FROM kassa_rasxod k_r
                    JOIN users u ON k_r.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    WHERE r.id = $1 AND k_r.main_schet_id = $2 AND k_r.isdeleted = false ${k_r_podotchet_filter} AND k_r.id_podotchet_litso IS NOT NULL
                    AND k_r.doc_date <= $4) + 
                (SELECT COALESCE(SUM(b_r_ch.summa), 0)
                    FROM bank_rasxod_child b_r_ch
                    JOIN bank_rasxod b_r ON b_r.id = b_r_ch.id_bank_rasxod
                    JOIN users u ON b_r_ch.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    WHERE r.id = $1 ${b_r_podotchet_filter} AND b_r_ch.id_spravochnik_podotchet_litso IS NOT NULL
                        AND b_r_ch.main_schet_id = $2 
                        AND b_r_ch.isdeleted = false
                        AND b_r.doc_date <= $4 )
            )::FLOAT AS summa_to_prixod,
            ARRAY_AGG(row_to_json(data)) AS data
            FROM data`, params,
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