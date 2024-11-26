const pool = require("../config/db");
const ErrorResponse = require("../utils/errorResponse");

const getByIdPodotchetMonitoringService = async (region_id, main_schet_id, offset, limit, from, to, podotchet_id, operatsii) => {
    try {
        const total = await pool.query(`--sql
                SELECT COALESCE(COUNT(a_tj4_ch.id), 0) AS total_count
                FROM avans_otchetlar_jur4_child a_tj4_ch
                JOIN avans_otchetlar_jur4 AS a_tj4 ON a_tj4_ch.avans_otchetlar_jur4_id = a_tj4.id
                JOIN spravochnik_podotchet_litso AS s_p_l ON s_p_l.id = a_tj4.spravochnik_podotchet_litso_id
                JOIN users u ON a_tj4.user_id = u.id
                JOIN regions r ON u.region_id = r.id
                JOIN spravochnik_operatsii AS s_op ON s_op.id = a_tj4.spravochnik_operatsii_own_id
                WHERE r.id = $1 
                    AND a_tj4.main_schet_id = $2
                    AND a_tj4.isdeleted = false
                    AND a_tj4.doc_date BETWEEN $3 AND $4
                    AND s_p_l.id = $5
                    AND s_op.schet = $6
        
                UNION ALL
        
                SELECT COALESCE(COUNT(k_r_ch.id), 0) AS total_count
                FROM kassa_rasxod_child k_r_ch
                JOIN kassa_rasxod AS k_r ON k_r_ch.kassa_rasxod_id = k_r.id
                JOIN spravochnik_podotchet_litso AS s_p_l ON s_p_l.id = k_r.id_podotchet_litso
                JOIN users u ON k_r.user_id = u.id
                JOIN regions r ON u.region_id = r.id
                JOIN spravochnik_operatsii AS s_op ON s_op.id = k_r_ch.spravochnik_operatsii_id
                WHERE r.id = $1 
                    AND k_r.main_schet_id = $2
                    AND k_r.isdeleted = false
                    AND k_r.doc_date BETWEEN $3 AND $4
                    AND k_r.id_podotchet_litso = $5
                    AND s_op.schet = $6
        
                UNION ALL
        
                SELECT COALESCE(COUNT(b_r_ch.id), 0) AS total_count
                FROM bank_rasxod_child b_r_ch
                JOIN bank_rasxod AS b_r ON b_r_ch.id_bank_rasxod = b_r.id
                JOIN spravochnik_podotchet_litso AS s_p_l ON s_p_l.id = b_r_ch.id_spravochnik_podotchet_litso
                JOIN users u ON b_r.user_id = u.id
                JOIN regions r ON u.region_id = r.id
                JOIN spravochnik_operatsii AS s_op ON s_op.id = b_r_ch.spravochnik_operatsii_id
                WHERE r.id = $1 
                    AND b_r.main_schet_id = $2
                    AND b_r.isdeleted = false
                    AND b_r.doc_date BETWEEN $3 AND $4
                    AND b_r_ch.id_spravochnik_podotchet_litso = $5
                    AND s_op.schet = $6
        
                UNION ALL
        
                SELECT COALESCE(COUNT(b_p_ch.id), 0) AS total_count
                FROM bank_prixod_child b_p_ch
                JOIN bank_prixod AS b_p ON b_p_ch.id_bank_prixod = b_p.id
                JOIN spravochnik_podotchet_litso AS s_p_l ON s_p_l.id = b_p_ch.id_spravochnik_podotchet_litso
                JOIN users u ON b_p.user_id = u.id
                JOIN regions r ON u.region_id = r.id
                JOIN spravochnik_operatsii AS s_op ON s_op.id = b_p_ch.spravochnik_operatsii_id
                WHERE r.id = $1 
                    AND b_p.main_schet_id = $2
                    AND b_p.isdeleted = false
                    AND b_p.doc_date BETWEEN $3 AND $4
                    AND b_p_ch.id_spravochnik_podotchet_litso = $5
                    AND s_op.schet = $6
            ) AS total_count
        `, [region_id, main_schet_id, from, to, podotchet_id, operatsii]);

        const summa_from = await pool.query(`--sql
            WITH 
                kassa_rasxod AS 
                    (SELECT COALESCE(SUM(k_r_ch.summa), 0) AS summa
                    FROM kassa_rasxod_child k_r_ch
                    JOIN kassa_rasxod AS k_r ON k_r_ch.kassa_rasxod_id = k_r.id
                    JOIN spravochnik_podotchet_litso AS s_p_l ON s_p_l.id = k_r.id_podotchet_litso 
                    JOIN users u ON k_r.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    JOIN spravochnik_operatsii AS s_op ON s_op.id = k_r_ch.spravochnik_operatsii_id
                    WHERE r.id = $1 
                        AND k_r.main_schet_id = $2 
                        AND k_r.isdeleted = false
                        AND k_r.doc_date < $3
                        AND k_r.id_podotchet_litso = $4
                        AND s_op.schet = $5),
                bank_rasxod AS 
                    (SELECT COALESCE(SUM(b_r_ch.summa), 0) AS summa
                    FROM bank_rasxod_child b_r_ch
                    JOIN bank_rasxod AS b_r ON b_r_ch.id_bank_rasxod = b_r.id
                    JOIN spravochnik_podotchet_litso AS s_p_l ON s_p_l.id = b_r_ch.id_spravochnik_podotchet_litso 
                    JOIN users u ON b_r.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    JOIN spravochnik_operatsii AS s_op ON s_op.id = b_r_ch.spravochnik_operatsii_id
                    WHERE r.id = $1 
                        AND b_r.main_schet_id = $2 
                        AND b_r.isdeleted = false  
                        AND b_r.doc_date < $3
                        AND b_r_ch.id_spravochnik_podotchet_litso = $4
                        AND s_op.schet = $5),
                kassa_prixod AS 
                    (SELECT COALESCE(SUM(k_p_ch.summa), 0) AS summa
                    FROM kassa_prixod_child k_p_ch
                    JOIN kassa_prixod AS k_p ON k_p_ch.kassa_prixod_id = k_p.id
                    JOIN spravochnik_podotchet_litso AS s_p_l ON s_p_l.id = k_p.id_podotchet_litso 
                    JOIN users u ON k_p.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    JOIN spravochnik_operatsii AS s_op ON s_op.id = k_p_ch.spravochnik_operatsii_id
                    WHERE r.id = $1 
                        AND k_p.main_schet_id = $2 
                        AND k_p.isdeleted = false  
                        AND k_p.doc_date < $3
                        AND k_p.id_podotchet_litso = $4
                        AND s_op.schet = $5),
                avans_otchetlar AS 
                    (SELECT COALESCE(SUM(a_tj4_ch.summa), 0) AS summa
                    FROM avans_otchetlar_jur4_child a_tj4_ch
                    JOIN avans_otchetlar_jur4 AS a_tj4 ON a_tj4_ch.avans_otchetlar_jur4_id = a_tj4.id
                    JOIN spravochnik_podotchet_litso AS s_p_l ON s_p_l.id = a_tj4.spravochnik_podotchet_litso_id 
                    JOIN users u ON a_tj4.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    JOIN spravochnik_operatsii AS s_op ON s_op.id = a_tj4.spravochnik_operatsii_own_id
                    WHERE r.id = $1 
                        AND a_tj4.main_schet_id = $2 
                        AND a_tj4.isdeleted = false  
                        AND a_tj4.doc_date < $3
                        AND s_p_l.id = $4
                        AND s_op.schet = $5),
                bank_prixod AS 
                    (SELECT COALESCE(SUM(b_p_ch.summa), 0) AS summa
                    FROM bank_prixod_child AS b_p_ch
                    JOIN bank_prixod AS b_p ON b_p_ch.id_bank_prixod = b_p.id
                    JOIN main_schet AS m_sch ON m_sch.id = b_p_ch.main_schet_id
                    JOIN spravochnik_podotchet_litso AS s_p_l ON s_p_l.id = b_p_ch.id_spravochnik_podotchet_litso 
                    JOIN users u ON b_p.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    JOIN spravochnik_operatsii AS s_op ON s_op.id = b_p_ch.spravochnik_operatsii_id
                    WHERE r.id = $1 
                        AND b_p.main_schet_id = $2 
                        AND b_p.isdeleted = false   
                        AND b_p.doc_date < $3
                        AND b_p_ch.id_spravochnik_podotchet_litso = $4
                        AND s_op.schet = $5)
            SELECT (
                (kassa_rasxod.summa + bank_rasxod.summa) - 
                (kassa_prixod.summa + bank_prixod.summa + avans_otchetlar.summa)
            )::FLOAT AS summa,
            kassa_prixod.summa AS kassa_prixod_summa, 
            bank_prixod.summa AS bank_prixod_summa, 
            avans_otchetlar.summa AS avans_otchetlar_summa,
            kassa_rasxod.summa AS kassa_rasxod_summa,  
            bank_rasxod.summa AS bank_rasxod_summa
            FROM kassa_prixod, kassa_rasxod, bank_prixod, bank_rasxod, avans_otchetlar
        `, [region_id, main_schet_id, from, podotchet_id, operatsii]);

        console.log(summa_from.rows)

        const summa_to = await pool.query(`--sql
            WITH 
                kassa_rasxod AS 
                    (SELECT COALESCE(SUM(k_r_ch.summa), 0) AS summa
                    FROM kassa_rasxod_child k_r_ch
                    JOIN kassa_rasxod AS k_r ON k_r_ch.kassa_rasxod_id = k_r.id
                    JOIN spravochnik_podotchet_litso AS s_p_l ON s_p_l.id = k_r.id_podotchet_litso 
                    JOIN users u ON k_r.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    JOIN spravochnik_operatsii AS s_op ON s_op.id = k_r_ch.spravochnik_operatsii_id
                    WHERE r.id = $1 
                        AND k_r.main_schet_id = $2 
                        AND k_r.isdeleted = false
                        AND k_r.doc_date <= $3
                        AND k_r.id_podotchet_litso = $4
                        AND s_op.schet = $5),
                bank_rasxod AS 
                    (SELECT COALESCE(SUM(b_r_ch.summa), 0) AS summa
                    FROM bank_rasxod_child b_r_ch
                    JOIN bank_rasxod AS b_r ON b_r_ch.id_bank_rasxod = b_r.id
                    JOIN spravochnik_podotchet_litso AS s_p_l ON s_p_l.id = b_r_ch.id_spravochnik_podotchet_litso 
                    JOIN users u ON b_r.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    JOIN spravochnik_operatsii AS s_op ON s_op.id = b_r_ch.spravochnik_operatsii_id
                    WHERE r.id = $1 
                        AND b_r.main_schet_id = $2 
                        AND b_r.isdeleted = false  
                        AND b_r.doc_date <= $3
                        AND b_r_ch.id_spravochnik_podotchet_litso = $4
                        AND s_op.schet = $5),
                kassa_prixod AS 
                    (SELECT COALESCE(SUM(k_p_ch.summa), 0) AS summa
                    FROM kassa_prixod_child k_p_ch
                    JOIN kassa_prixod AS k_p ON k_p_ch.kassa_prixod_id = k_p.id
                    JOIN spravochnik_podotchet_litso AS s_p_l ON s_p_l.id = k_p.id_podotchet_litso 
                    JOIN users u ON k_p.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    JOIN spravochnik_operatsii AS s_op ON s_op.id = k_p_ch.spravochnik_operatsii_id
                    WHERE r.id = $1 
                        AND k_p.main_schet_id = $2 
                        AND k_p.isdeleted = false  
                        AND k_p.doc_date <= $3
                        AND k_p.id_podotchet_litso = $4
                        AND s_op.schet = $5),
                avans_otchetlar AS 
                    (SELECT COALESCE(SUM(a_tj4_ch.summa), 0) AS summa
                    FROM avans_otchetlar_jur4_child a_tj4_ch
                    JOIN avans_otchetlar_jur4 AS a_tj4 ON a_tj4_ch.avans_otchetlar_jur4_id = a_tj4.id
                    JOIN spravochnik_podotchet_litso AS s_p_l ON s_p_l.id = a_tj4.spravochnik_podotchet_litso_id 
                    JOIN users u ON a_tj4.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    JOIN spravochnik_operatsii AS s_op ON s_op.id = a_tj4.spravochnik_operatsii_own_id
                    WHERE r.id = $1 
                        AND a_tj4.main_schet_id = $2 
                        AND a_tj4.isdeleted = false  
                        AND a_tj4.doc_date <= $3
                        AND s_p_l.id = $4
                        AND s_op.schet = $5),
                bank_prixod AS 
                    (SELECT COALESCE(SUM(b_p_ch.summa), 0) AS summa
                    FROM bank_prixod_child b_p_ch
                    JOIN bank_prixod AS b_p ON b_p_ch.id_bank_prixod = b_p.id
                    JOIN spravochnik_podotchet_litso AS s_p_l ON s_p_l.id = b_p_ch.id_spravochnik_podotchet_litso 
                    JOIN users u ON b_p.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    JOIN spravochnik_operatsii AS s_op ON s_op.id = b_p_ch.spravochnik_operatsii_id
                    WHERE r.id = $1 
                        AND b_p.main_schet_id = $2 
                        AND b_p.isdeleted = false   
                        AND b_p.doc_date <= $3
                        AND b_p_ch.id_spravochnik_podotchet_litso = $4
                        AND s_op.schet = $5)
            SELECT (
                (kassa_rasxod.summa + bank_rasxod.summa) - 
                (kassa_prixod.summa + bank_prixod.summa + avans_otchetlar.summa)
            )::FLOAT AS summa
            FROM kassa_prixod, kassa_rasxod, bank_prixod, bank_rasxod, avans_otchetlar
        `, [region_id, main_schet_id, to, podotchet_id, operatsii]);

        let summa_prixod = 0;
        let summa_rasxod = 0;
        for (let item of data.rows) {
            summa_rasxod += item.rasxod_sum
            summa_prixod += item.prixod_sum
        }
        return {
            data: data.rows,
            total: total.rows[0].total_count || 0,
            summa_prixod,
            summa_rasxod,
            summa_from: summa_from.rows[0].summa || 0,
            summa_to: summa_to.rows[0].summa || 0
        };
    } catch (error) {
        throw new ErrorResponse(error.message, error.statusCode);
    }
};

const getMonitoringService = async (region_id, main_schet_id, offset, limit, from, to, operatsii) => {
    try {
        const data = await pool.query(`--sql
            SELECT  
                k_p.id, 
                k_p.doc_num,
                TO_CHAR(k_p.doc_date, 'YYYY-MM-DD') AS doc_date,
                0::FLOAT AS prixod_sum,
                k_p_ch.summa::FLOAT AS rasxod_sum,
                k_p.opisanie,
                k_p.id_podotchet_litso AS podotchet_litso_id,
                s_p_l.name AS podotchet_name,
                s_p_l.rayon AS podotchet_rayon,
                u.login,
                u.fio,
                u.id AS user_id,
                s_op.schet AS provodki_schet,
                s_op.sub_schet AS provodki_sub_schet
            FROM kassa_prixod_child k_p_ch
            JOIN main_schet AS m_sch ON m_sch.id = k_p_ch.main_schet_id
            JOIN kassa_prixod AS k_p ON k_p_ch.kassa_prixod_id = k_p.id
            JOIN spravochnik_podotchet_litso AS s_p_l ON s_p_l.id = k_p.id_podotchet_litso 
            JOIN users u ON k_p.user_id = u.id
            JOIN regions r ON u.region_id = r.id
            JOIN spravochnik_operatsii AS s_op ON s_op.id = k_p_ch.spravochnik_operatsii_id
            WHERE r.id = $1 AND k_p.main_schet_id = $2 
                AND k_p.isdeleted = false  
                AND k_p.doc_date BETWEEN $3 AND $4
                AND s_op.schet = $5
        
            UNION ALL
        
            SELECT 
                k_r.id, 
                k_r.doc_num,
                TO_CHAR(k_r.doc_date, 'YYYY-MM-DD') AS doc_date,
                k_r_ch.summa::FLOAT AS prixod_sum,
                0::FLOAT AS rasxod_sum,
                k_r.opisanie,
                k_r.id_podotchet_litso AS podotchet_litso_id,
                s_p_l.name AS podotchet_name,
                s_p_l.rayon AS podotchet_rayon,
                u.login,
                u.fio,
                u.id AS user_id,
                s_op.schet AS provodki_schet,
                s_op.sub_schet AS provodki_sub_schet
            FROM kassa_rasxod_child k_r_ch
            JOIN main_schet AS m_sch ON m_sch.id = k_r_ch.main_schet_id
            JOIN kassa_rasxod AS k_r ON k_r_ch.kassa_rasxod_id = k_r.id
            JOIN spravochnik_podotchet_litso AS s_p_l ON s_p_l.id = k_r.id_podotchet_litso 
            JOIN users u ON k_r.user_id = u.id
            JOIN regions r ON u.region_id = r.id
            JOIN spravochnik_operatsii AS s_op ON s_op.id = k_r_ch.spravochnik_operatsii_id
            WHERE r.id = $1 
                AND k_r.main_schet_id = $2 
                AND k_r.isdeleted = false
                AND k_r.doc_date BETWEEN $3 AND $4
                AND s_op.schet = $5
        
            UNION ALL
        
            SELECT 
                b_r.id, 
                b_r.doc_num,
                TO_CHAR(b_r.doc_date, 'YYYY-MM-DD') AS doc_date,
                b_r_ch.summa::FLOAT AS prixod_sum,
                0::FLOAT AS rasxod_sum,
                b_r.opisanie,
                b_r_ch.id_spravochnik_podotchet_litso AS podotchet_litso_id,
                s_p_l.name AS podotchet_name,
                s_p_l.rayon AS podotchet_rayon,
                u.login,
                u.fio,
                u.id AS user_id,
                s_op.schet AS provodki_schet,
                s_op.sub_schet AS provodki_sub_schet
            FROM bank_rasxod_child b_r_ch
            JOIN main_schet AS m_sch ON m_sch.id = b_r_ch.main_schet_id
            JOIN bank_rasxod AS b_r ON b_r_ch.id_bank_rasxod = b_r.id
            JOIN spravochnik_podotchet_litso AS s_p_l ON s_p_l.id = b_r_ch.id_spravochnik_podotchet_litso 
            JOIN users u ON b_r.user_id = u.id
            JOIN regions r ON u.region_id = r.id
            JOIN spravochnik_operatsii AS s_op ON s_op.id = b_r_ch.spravochnik_operatsii_id
            WHERE r.id = $1 
                AND b_r.main_schet_id = $2 
                AND b_r.isdeleted = false  
                AND b_r.doc_date BETWEEN $3 AND $4
                AND s_op.schet = $5
        
            UNION ALL
        
            SELECT DISTINCT 
                b_p.id, 
                b_p.doc_num,
                TO_CHAR(b_p.doc_date, 'YYYY-MM-DD') AS doc_date,
                0::FLOAT AS prixod_sum,
                b_p_ch.summa::FLOAT AS rasxod_sum,
                b_p.opisanie,
                b_p_ch.id_spravochnik_podotchet_litso AS podotchet_litso_id,
                s_p_l.name AS podotchet_name,
                s_p_l.rayon AS podotchet_rayon,
                u.login,
                u.fio,
                u.id AS user_id,
                s_op.schet AS provodki_schet,
                s_op.sub_schet AS provodki_sub_schet
            FROM bank_prixod_child b_p_ch
            JOIN main_schet AS m_sch ON m_sch.id = b_p_ch.main_schet_id
            JOIN bank_prixod AS b_p ON b_p_ch.id_bank_prixod = b_p.id
            JOIN spravochnik_podotchet_litso AS s_p_l ON s_p_l.id = b_p_ch.id_spravochnik_podotchet_litso 
            JOIN users u ON b_p.user_id = u.id
            JOIN regions r ON u.region_id = r.id
            JOIN spravochnik_operatsii AS s_op ON s_op.id = b_p_ch.spravochnik_operatsii_id
            WHERE r.id = $1 
                AND b_p.main_schet_id = $2 
                AND b_p.isdeleted = false   
                AND b_p.doc_date BETWEEN $3 AND $4
                AND s_op.schet = $5
            ORDER BY doc_date DESC
            OFFSET $6 LIMIT $7
        `, [region_id, main_schet_id, from, to, operatsii, offset, limit]);

        const total = await pool.query(`--sql
            SELECT SUM(total_count)::INTEGER AS total_count 
            FROM (
                SELECT COALESCE(COUNT(k_p_ch.id), 0) AS total_count
                FROM kassa_prixod_child k_p_ch
                JOIN kassa_prixod AS k_p ON k_p_ch.kassa_prixod_id = k_p.id
                JOIN spravochnik_podotchet_litso AS s_p_l ON s_p_l.id = k_p.id_podotchet_litso
                JOIN users u ON k_p.user_id = u.id
                JOIN regions r ON u.region_id = r.id
                JOIN spravochnik_operatsii AS s_op ON s_op.id = k_p_ch.spravochnik_operatsii_id
                WHERE r.id = $1 
                    AND k_p.main_schet_id = $2
                    AND k_p.isdeleted = false
                    AND k_p.doc_date BETWEEN $3 AND $4
                    AND s_op.schet = $5
        
                UNION ALL
        
                SELECT COALESCE(COUNT(k_r_ch.id), 0) AS total_count
                FROM kassa_rasxod_child k_r_ch
                JOIN kassa_rasxod AS k_r ON k_r_ch.kassa_rasxod_id = k_r.id
                JOIN spravochnik_podotchet_litso AS s_p_l ON s_p_l.id = k_r.id_podotchet_litso
                JOIN users u ON k_r.user_id = u.id
                JOIN regions r ON u.region_id = r.id
                JOIN spravochnik_operatsii AS s_op ON s_op.id = k_r_ch.spravochnik_operatsii_id
                WHERE r.id = $1 
                    AND k_r.main_schet_id = $2
                    AND k_r.isdeleted = false
                    AND k_r.doc_date BETWEEN $3 AND $4
                    AND s_op.schet = $5
        
                UNION ALL
        
                SELECT COALESCE(COUNT(b_r_ch.id), 0) AS total_count
                FROM bank_rasxod_child b_r_ch
                JOIN bank_rasxod AS b_r ON b_r_ch.id_bank_rasxod = b_r.id
                JOIN spravochnik_podotchet_litso AS s_p_l ON s_p_l.id = b_r_ch.id_spravochnik_podotchet_litso
                JOIN users u ON b_r.user_id = u.id
                JOIN regions r ON u.region_id = r.id
                JOIN spravochnik_operatsii AS s_op ON s_op.id = b_r_ch.spravochnik_operatsii_id
                WHERE r.id = $1 
                    AND b_r.main_schet_id = $2
                    AND b_r.isdeleted = false
                    AND b_r.doc_date BETWEEN $3 AND $4
                    AND s_op.schet = $5
        
                UNION ALL
        
                SELECT COALESCE(COUNT(b_p_ch.id), 0) AS total_count
                FROM bank_prixod_child b_p_ch
                JOIN bank_prixod AS b_p ON b_p_ch.id_bank_prixod = b_p.id
                JOIN spravochnik_podotchet_litso AS s_p_l ON s_p_l.id = b_p_ch.id_spravochnik_podotchet_litso
                JOIN users u ON b_p.user_id = u.id
                JOIN regions r ON u.region_id = r.id
                JOIN spravochnik_operatsii AS s_op ON s_op.id = b_p_ch.spravochnik_operatsii_id
                WHERE r.id = $1 
                    AND b_p.main_schet_id = $2
                    AND b_p.isdeleted = false
                    AND b_p.doc_date BETWEEN $3 AND $4
                    AND s_op.schet = $5
            ) AS total_count
        `, [region_id, main_schet_id, from, to, operatsii]);

        const summa_from = await pool.query(`--sql
            WITH 
                kassa_rasxod AS 
                    (SELECT COALESCE(SUM(k_r_ch.summa), 0) AS summa
                    FROM kassa_rasxod_child k_r_ch
                    JOIN kassa_rasxod AS k_r ON k_r_ch.kassa_rasxod_id = k_r.id
                    JOIN spravochnik_podotchet_litso AS s_p_l ON s_p_l.id = k_r.id_podotchet_litso 
                    JOIN users u ON k_r.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    JOIN spravochnik_operatsii AS s_op ON s_op.id = k_r_ch.spravochnik_operatsii_id
                    WHERE r.id = $1 
                        AND k_r.main_schet_id = $2 
                        AND k_r.isdeleted = false
                        AND k_r.doc_date < $3
                        AND s_op.schet = $4),
                bank_rasxod AS 
                    (SELECT COALESCE(SUM(b_r_ch.summa), 0) AS summa
                    FROM bank_rasxod_child b_r_ch
                    JOIN bank_rasxod AS b_r ON b_r_ch.id_bank_rasxod = b_r.id
                    JOIN spravochnik_podotchet_litso AS s_p_l ON s_p_l.id = b_r_ch.id_spravochnik_podotchet_litso 
                    JOIN users u ON b_r.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    JOIN spravochnik_operatsii AS s_op ON s_op.id = b_r_ch.spravochnik_operatsii_id
                    WHERE r.id = $1 
                        AND b_r.main_schet_id = $2 
                        AND b_r.isdeleted = false  
                        AND b_r.doc_date < $3
                        AND s_op.schet = $4),
                kassa_prixod AS 
                    (SELECT COALESCE(SUM(k_p_ch.summa), 0) AS summa
                    FROM kassa_prixod_child k_p_ch
                    JOIN kassa_prixod AS k_p ON k_p_ch.kassa_prixod_id = k_p.id
                    JOIN spravochnik_podotchet_litso AS s_p_l ON s_p_l.id = k_p.id_podotchet_litso 
                    JOIN users u ON k_p.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    JOIN spravochnik_operatsii AS s_op ON s_op.id = k_p_ch.spravochnik_operatsii_id
                    WHERE r.id = $1 
                        AND k_p.main_schet_id = $2 
                        AND k_p.isdeleted = false  
                        AND k_p.doc_date < $3
                        AND s_op.schet = $4),
                bank_prixod AS 
                    (SELECT COALESCE(SUM(b_p_ch.summa), 0) AS summa
                    FROM bank_prixod_child b_p_ch
                    JOIN bank_prixod AS b_p ON b_p_ch.id_bank_prixod = b_p.id
                    JOIN spravochnik_podotchet_litso AS s_p_l ON s_p_l.id = b_p_ch.id_spravochnik_podotchet_litso 
                    JOIN users u ON b_p.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    JOIN spravochnik_operatsii AS s_op ON s_op.id = b_p_ch.spravochnik_operatsii_id
                    WHERE r.id = $1 
                        AND b_p.main_schet_id = $2 
                        AND b_p.isdeleted = false   
                        AND b_p.doc_date < $3
                        AND s_op.schet = $4)
            SELECT (
                (kassa_rasxod.summa + bank_rasxod.summa) - 
                (kassa_prixod.summa + bank_prixod.summa)
            )::FLOAT AS summa
            FROM kassa_prixod, kassa_rasxod, bank_prixod, bank_rasxod
        `, [region_id, main_schet_id, from, operatsii]);

        const summa_to = await pool.query(`--sql
            WITH 
                kassa_rasxod AS 
                    (SELECT COALESCE(SUM(k_r_ch.summa), 0) AS summa
                    FROM kassa_rasxod_child k_r_ch
                    JOIN kassa_rasxod AS k_r ON k_r_ch.kassa_rasxod_id = k_r.id
                    JOIN spravochnik_podotchet_litso AS s_p_l ON s_p_l.id = k_r.id_podotchet_litso 
                    JOIN users u ON k_r.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    JOIN spravochnik_operatsii AS s_op ON s_op.id = k_r_ch.spravochnik_operatsii_id
                    WHERE r.id = $1 
                        AND k_r.main_schet_id = $2 
                        AND k_r.isdeleted = false
                        AND k_r.doc_date < $3
                        AND s_op.schet = $4),
                bank_rasxod AS 
                    (SELECT COALESCE(SUM(b_r_ch.summa), 0) AS summa
                    FROM bank_rasxod_child b_r_ch
                    JOIN bank_rasxod AS b_r ON b_r_ch.id_bank_rasxod = b_r.id
                    JOIN spravochnik_podotchet_litso AS s_p_l ON s_p_l.id = b_r_ch.id_spravochnik_podotchet_litso 
                    JOIN users u ON b_r.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    JOIN spravochnik_operatsii AS s_op ON s_op.id = b_r_ch.spravochnik_operatsii_id
                    WHERE r.id = $1 
                        AND b_r.main_schet_id = $2 
                        AND b_r.isdeleted = false  
                        AND b_r.doc_date < $3
                        AND s_op.schet = $4),
                kassa_prixod AS 
                    (SELECT COALESCE(SUM(k_p_ch.summa), 0) AS summa
                    FROM kassa_prixod_child k_p_ch
                    JOIN kassa_prixod AS k_p ON k_p_ch.kassa_prixod_id = k_p.id
                    JOIN spravochnik_podotchet_litso AS s_p_l ON s_p_l.id = k_p.id_podotchet_litso 
                    JOIN users u ON k_p.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    JOIN spravochnik_operatsii AS s_op ON s_op.id = k_p_ch.spravochnik_operatsii_id
                    WHERE r.id = $1 
                        AND k_p.main_schet_id = $2 
                        AND k_p.isdeleted = false  
                        AND k_p.doc_date < $3
                        AND s_op.schet = $4),
                bank_prixod AS 
                    (SELECT COALESCE(SUM(b_p_ch.summa), 0) AS summa
                    FROM bank_prixod_child b_p_ch
                    JOIN bank_prixod AS b_p ON b_p_ch.id_bank_prixod = b_p.id
                    JOIN spravochnik_podotchet_litso AS s_p_l ON s_p_l.id = b_p_ch.id_spravochnik_podotchet_litso 
                    JOIN users u ON b_p.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    JOIN spravochnik_operatsii AS s_op ON s_op.id = b_p_ch.spravochnik_operatsii_id
                    WHERE r.id = $1 
                        AND b_p.main_schet_id = $2 
                        AND b_p.isdeleted = false   
                        AND b_p.doc_date < $3
                        AND s_op.schet = $4)
            SELECT (
                (kassa_rasxod.summa + bank_rasxod.summa) - 
                (kassa_prixod.summa + bank_prixod.summa)
            )::FLOAT AS summa
            FROM kassa_prixod, kassa_rasxod, bank_prixod, bank_rasxod
        `, [region_id, main_schet_id, to, operatsii]);

        let summa_prixod = 0;
        let summa_rasxod = 0;
        for (let item of data.rows) {
            summa_rasxod += item.rasxod_sum
            summa_prixod += item.prixod_sum
        }
        return {
            data: data.rows,
            total: total.rows[0].total_count || 0,
            summa_prixod,
            summa_rasxod,
            summa_from: summa_from.rows[0].summa || 0,
            summa_to: summa_to.rows[0].summa || 0
        };
    } catch (error) {
        throw new ErrorResponse(error.message, error.statusCode);
    }
};

const prixodRasxodPodotchetService = async (region_id, budjet_id, to) => {
    const client = await pool.connect()
    try {
        await client.query(`BEGIN`)
        const podotchets = await client.query(`--sql
            SELECT s_p_l.id, s_p_l.name, s_p_l.rayon
            FROM spravochnik_podotchet_litso AS s_p_l
            JOIN users AS u ON u.id = s_p_l.user_id
            JOIN regions AS r ON r.id = u.region_id
            WHERE r.id = $1
            ORDER BY s_p_l.name, s_p_l.rayon
        `, [region_id])
        for (let podotchet of podotchets.rows) {
            const avans_rasxod = await client.query(`--sql
                SELECT COALESCE(SUM(a_o_j4.summa), 0)::FLOAT AS summa
                FROM avans_otchetlar_jur4 a_o_j4
                JOIN main_schet AS m_sch ON m_sch.id = a_o_j4.main_schet_id 
                JOIN users u ON a_o_j4.user_id = u.id
                JOIN regions r ON u.region_id = r.id
                WHERE r.id = $1 AND m_sch.spravochnik_budjet_name_id = $2 AND a_o_j4.isdeleted = false AND a_o_j4.doc_date <= $3 AND a_o_j4.spravochnik_podotchet_litso_id = $4 
            `, [region_id, budjet_id, to, podotchet.id])
            const kassa_rasxod = await pool.query(`--sql
                SELECT COALESCE(SUM(k_p.summa), 0)::FLOAT AS summa
                FROM kassa_prixod k_p
                JOIN main_schet AS m_sch ON m_sch.id = k_p.main_schet_id
                JOIN users u ON k_p.user_id = u.id
                JOIN regions r ON u.region_id = r.id
                WHERE r.id = $1 AND m_sch.spravochnik_budjet_name_id = $2 AND k_p.isdeleted = false AND k_p.doc_date <= $3 AND k_p.id_podotchet_litso = $4
            `, [region_id, budjet_id, to, podotchet.id])
            const bank_rasxod = await client.query(`--sql
                SELECT COALESCE(SUM(b_p_ch.summa), 0)::FLOAT AS summa
                FROM bank_prixod_child b_p_ch
                JOIN main_schet AS m_sch ON m_sch.id = b_p_ch.main_schet_id
                JOIN bank_prixod b_p ON b_p.id = b_p_ch.id_bank_prixod
                JOIN users u ON b_p_ch.user_id = u.id
                JOIN regions r ON u.region_id = r.id
                WHERE r.id = $1 AND m_sch.spravochnik_budjet_name_id = $2 AND b_p_ch.isdeleted = false AND b_p.doc_date <= $3 AND b_p_ch.id_spravochnik_podotchet_litso = $4 
            `, [region_id, budjet_id, to, podotchet.id])
            const kassa_prixod = await client.query(`--sql
                SELECT COALESCE(SUM(k_r.summa), 0)::FLOAT AS summa
                FROM kassa_rasxod k_r
                JOIN main_schet AS m_sch ON m_sch.id = k_r.main_schet_id
                JOIN users u ON k_r.user_id = u.id
                JOIN regions r ON u.region_id = r.id
                WHERE r.id = $1 AND m_sch.spravochnik_budjet_name_id = $2 AND k_r.isdeleted = false AND k_r.doc_date <= $3 AND k_r.id_podotchet_litso = $4
            `, [region_id, budjet_id, to, podotchet.id])
            const bank_prixod = await client.query(`--sql
                SELECT COALESCE(SUM(b_r_ch.summa), 0)::FLOAT AS summa
                FROM bank_rasxod_child b_r_ch
                JOIN main_schet AS m_sch ON m_sch.id = b_r_ch.main_schet_id
                JOIN bank_rasxod b_r ON b_r.id = b_r_ch.id_bank_rasxod
                JOIN users u ON b_r_ch.user_id = u.id
                JOIN regions r ON u.region_id = r.id
                WHERE r.id = $1 AND m_sch.spravochnik_budjet_name_id = $2 AND b_r_ch.isdeleted = false AND b_r.doc_date <= $3 AND b_r_ch.id_spravochnik_podotchet_litso = $4    
            `, [region_id, budjet_id, to, podotchet.id])
            const summa = (bank_rasxod.rows[0].summa + kassa_rasxod.rows[0].summa) - (avans_rasxod.rows[0].summa + kassa_prixod.rows[0].summa + bank_prixod.rows[0].summa)
            podotchet.summa = summa
        }
        await client.query(`COMMIT`)
        return podotchets.rows
    } catch (error) {
        await client.query(`ROLLBACK`)
        throw new ErrorResponse(error, error.statusCode)
    } finally {
        client.release()
    }
};

const podotchetMonitoringToExcelService = async (region_id, main_schet_id, from, to, podotchet_id, operatsii) => {
    try {
        const data = await pool.query(`--sql
            SELECT 
                k_p.id, 
                k_p.doc_num,
                TO_CHAR(k_p.doc_date, 'YYYY-MM-DD') AS doc_date,
                0::FLOAT AS prixod_sum,
                k_p_ch.summa::FLOAT AS rasxod_sum,
                k_p.opisanie,
                m_sch.jur1_schet AS operatsii,
                s_op.sub_schet,
                'kassa_prixod' AS type
            FROM kassa_prixod_child k_p_ch
            JOIN kassa_prixod AS k_p ON k_p_ch.kassa_prixod_id = k_p.id
            JOIN main_schet AS m_sch ON m_sch.id = k_p.main_schet_id
            JOIN spravochnik_podotchet_litso AS s_p_l ON s_p_l.id = k_p.id_podotchet_litso 
            JOIN users u ON k_p.user_id = u.id
            JOIN regions r ON u.region_id = r.id
            JOIN spravochnik_operatsii AS s_op ON s_op.id = k_p_ch.spravochnik_operatsii_id
            WHERE r.id = $1 AND k_p.main_schet_id = $2 
                AND k_p.isdeleted = false  
                AND k_p.doc_date BETWEEN $3 AND $4
                AND k_p.id_podotchet_litso = $5
                AND s_op.schet = $6
        
            UNION ALL

            SELECT  
                a_tj4.id, 
                a_tj4.doc_num,
                TO_CHAR(a_tj4.doc_date, 'YYYY-MM-DD') AS doc_date,
                0::FLOAT AS prixod_sum,
                a_tj4_ch.summa::FLOAT AS rasxod_sum,
                a_tj4.opisanie,
                s_p.schet AS operatsii,
                s_p.sub_schet,
                'avans_otchetlar_jur4' AS type
            FROM avans_otchetlar_jur4_child a_tj4_ch
            JOIN main_schet AS m_sch ON m_sch.id = a_tj4_ch.main_schet_id
            JOIN avans_otchetlar_jur4 AS a_tj4 ON a_tj4_ch.avans_otchetlar_jur4_id = a_tj4.id
            JOIN spravochnik_podotchet_litso AS s_p_l ON s_p_l.id = a_tj4.spravochnik_podotchet_litso_id 
            JOIN users u ON a_tj4.user_id = u.id
            JOIN regions r ON u.region_id = r.id
            JOIN spravochnik_operatsii AS s_op ON s_op.id = a_tj4.spravochnik_operatsii_own_id
            JOIN spravochnik_operatsii AS s_p ON s_p.id = a_tj4_ch.spravochnik_operatsii_id
            WHERE r.id = $1 AND a_tj4.main_schet_id = $2 
                AND a_tj4.isdeleted = false  
                AND a_tj4.doc_date BETWEEN $3 AND $4
                AND s_p_l.id = $5
                AND s_op.schet = $6
        
            UNION ALL
        
            SELECT 
                k_r.id, 
                k_r.doc_num,
                TO_CHAR(k_r.doc_date, 'YYYY-MM-DD') AS doc_date,
                k_r_ch.summa::FLOAT AS prixod_sum,
                0::FLOAT AS rasxod_sum,
                k_r.opisanie,
                m_sch.jur1_schet AS operatsii,
                s_op.sub_schet,
                'kassa_rasxod' AS type
            FROM kassa_rasxod_child k_r_ch
            JOIN main_schet AS m_sch ON m_sch.id = k_r_ch.main_schet_id
            JOIN kassa_rasxod AS k_r ON k_r_ch.kassa_rasxod_id = k_r.id
            JOIN spravochnik_podotchet_litso AS s_p_l ON s_p_l.id = k_r.id_podotchet_litso 
            JOIN users u ON k_r.user_id = u.id
            JOIN regions r ON u.region_id = r.id
            JOIN spravochnik_operatsii AS s_op ON s_op.id = k_r_ch.spravochnik_operatsii_id
            WHERE r.id = $1 
                AND k_r.main_schet_id = $2 
                AND k_r.isdeleted = false
                AND k_r.doc_date BETWEEN $3 AND $4
                AND k_r.id_podotchet_litso = $5
                AND s_op.schet = $6
        
            UNION ALL
        
            SELECT 
                b_r.id, 
                b_r.doc_num,
                TO_CHAR(b_r.doc_date, 'YYYY-MM-DD') AS doc_date,
                b_r_ch.summa::FLOAT AS prixod_sum,
                0::FLOAT AS rasxod_sum,
                b_r.opisanie,
                m_sch.jur2_schet AS operatsii,
                s_op.sub_schet,
                'bank_rasxod' AS type
            FROM bank_rasxod_child b_r_ch
            JOIN main_schet AS m_sch ON m_sch.id = b_r_ch.main_schet_id
            JOIN bank_rasxod AS b_r ON b_r_ch.id_bank_rasxod = b_r.id
            JOIN spravochnik_podotchet_litso AS s_p_l ON s_p_l.id = b_r_ch.id_spravochnik_podotchet_litso 
            JOIN users u ON b_r.user_id = u.id
            JOIN regions r ON u.region_id = r.id
            JOIN spravochnik_operatsii AS s_op ON s_op.id = b_r_ch.spravochnik_operatsii_id
            WHERE r.id = $1 
                AND b_r.main_schet_id = $2 
                AND b_r.isdeleted = false  
                AND b_r.doc_date BETWEEN $3 AND $4
                AND b_r_ch.id_spravochnik_podotchet_litso = $5
                AND s_op.schet = $6
        
            UNION ALL
        
            SELECT 
                b_p.id, 
                b_p.doc_num,
                TO_CHAR(b_p.doc_date, 'YYYY-MM-DD') AS doc_date,
                0::FLOAT AS prixod_sum,
                b_p_ch.summa::FLOAT AS rasxod_sum,
                b_p.opisanie,
                m_sch.jur2_schet AS operatsii,
                s_op.sub_schet,
                'bank_prixod' AS type
            FROM bank_prixod_child b_p_ch
            JOIN main_schet AS m_sch ON m_sch.id = b_p_ch.main_schet_id
            JOIN bank_prixod AS b_p ON b_p_ch.id_bank_prixod = b_p.id
            JOIN spravochnik_podotchet_litso AS s_p_l ON s_p_l.id = b_p_ch.id_spravochnik_podotchet_litso 
            JOIN users u ON b_p.user_id = u.id
            JOIN regions r ON u.region_id = r.id
            JOIN spravochnik_operatsii AS s_op ON s_op.id = b_p_ch.spravochnik_operatsii_id
            WHERE r.id = $1 
                AND b_p.main_schet_id = $2 
                AND b_p.isdeleted = false   
                AND b_p.doc_date BETWEEN $3 AND $4
                AND b_p_ch.id_spravochnik_podotchet_litso = $5
                AND s_op.schet = $6
            ORDER BY doc_date DESC
        `, [region_id, main_schet_id, from, to, podotchet_id, operatsii]);

        const summa_from = await pool.query(`--sql
            WITH 
                kassa_rasxod AS 
                    (SELECT COALESCE(SUM(k_r_ch.summa), 0) AS summa
                    FROM kassa_rasxod_child k_r_ch
                    JOIN kassa_rasxod AS k_r ON k_r_ch.kassa_rasxod_id = k_r.id
                    JOIN spravochnik_podotchet_litso AS s_p_l ON s_p_l.id = k_r.id_podotchet_litso 
                    JOIN users u ON k_r.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    JOIN spravochnik_operatsii AS s_op ON s_op.id = k_r_ch.spravochnik_operatsii_id
                    WHERE r.id = $1 
                        AND k_r.main_schet_id = $2 
                        AND k_r.isdeleted = false
                        AND k_r.doc_date < $3
                        AND k_r.id_podotchet_litso = $4
                        AND s_op.schet = $5),
                bank_rasxod AS 
                    (SELECT COALESCE(SUM(b_r_ch.summa), 0) AS summa
                    FROM bank_rasxod_child b_r_ch
                    JOIN bank_rasxod AS b_r ON b_r_ch.id_bank_rasxod = b_r.id
                    JOIN spravochnik_podotchet_litso AS s_p_l ON s_p_l.id = b_r_ch.id_spravochnik_podotchet_litso 
                    JOIN users u ON b_r.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    JOIN spravochnik_operatsii AS s_op ON s_op.id = b_r_ch.spravochnik_operatsii_id
                    WHERE r.id = $1 
                        AND b_r.main_schet_id = $2 
                        AND b_r.isdeleted = false  
                        AND b_r.doc_date < $3
                        AND b_r_ch.id_spravochnik_podotchet_litso = $4
                        AND s_op.schet = $5),
                kassa_prixod AS 
                    (SELECT COALESCE(SUM(k_p_ch.summa), 0) AS summa
                    FROM kassa_prixod_child k_p_ch
                    JOIN kassa_prixod AS k_p ON k_p_ch.kassa_prixod_id = k_p.id
                    JOIN spravochnik_podotchet_litso AS s_p_l ON s_p_l.id = k_p.id_podotchet_litso 
                    JOIN users u ON k_p.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    JOIN spravochnik_operatsii AS s_op ON s_op.id = k_p_ch.spravochnik_operatsii_id
                    WHERE r.id = $1 
                        AND k_p.main_schet_id = $2 
                        AND k_p.isdeleted = false  
                        AND k_p.doc_date < $3
                        AND k_p.id_podotchet_litso = $4
                        AND s_op.schet = $5),
                avans_otchetlar AS 
                    (SELECT COALESCE(SUM(a_tj4_ch.summa), 0) AS summa
                    FROM avans_otchetlar_jur4_child a_tj4_ch
                    JOIN avans_otchetlar_jur4 AS a_tj4 ON a_tj4_ch.avans_otchetlar_jur4_id = a_tj4.id
                    JOIN spravochnik_podotchet_litso AS s_p_l ON s_p_l.id = a_tj4.spravochnik_podotchet_litso_id 
                    JOIN users u ON a_tj4.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    JOIN spravochnik_operatsii AS s_op ON s_op.id = a_tj4.spravochnik_operatsii_own_id
                    WHERE r.id = $1 
                        AND a_tj4.main_schet_id = $2 
                        AND a_tj4.isdeleted = false  
                        AND a_tj4.doc_date < $3
                        AND s_p_l.id = $4
                        AND s_op.schet = $5),
                bank_prixod AS 
                    (SELECT COALESCE(SUM(b_p_ch.summa), 0) AS summa
                    FROM bank_prixod_child b_p_ch
                    JOIN bank_prixod AS b_p ON b_p_ch.id_bank_prixod = b_p.id
                    JOIN spravochnik_podotchet_litso AS s_p_l ON s_p_l.id = b_p_ch.id_spravochnik_podotchet_litso 
                    JOIN users u ON b_p.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    JOIN spravochnik_operatsii AS s_op ON s_op.id = b_p_ch.spravochnik_operatsii_id
                    WHERE r.id = $1 
                        AND b_p.main_schet_id = $2 
                        AND b_p.isdeleted = false   
                        AND b_p.doc_date < $3
                        AND b_p_ch.id_spravochnik_podotchet_litso = $4
                        AND s_op.schet = $5)
            SELECT (
                (kassa_rasxod.summa + bank_rasxod.summa) - 
                (kassa_prixod.summa + bank_prixod.summa + avans_otchetlar.summa)
            )::FLOAT AS summa
            FROM kassa_prixod, kassa_rasxod, bank_prixod, bank_rasxod, avans_otchetlar
        `, [region_id, main_schet_id, from, podotchet_id, operatsii]);

        const summa_to = await pool.query(`--sql
            WITH 
                kassa_rasxod AS 
                    (SELECT COALESCE(SUM(k_r_ch.summa), 0) AS summa
                    FROM kassa_rasxod_child k_r_ch
                    JOIN kassa_rasxod AS k_r ON k_r_ch.kassa_rasxod_id = k_r.id
                    JOIN spravochnik_podotchet_litso AS s_p_l ON s_p_l.id = k_r.id_podotchet_litso 
                    JOIN users u ON k_r.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    JOIN spravochnik_operatsii AS s_op ON s_op.id = k_r_ch.spravochnik_operatsii_id
                    WHERE r.id = $1 
                        AND k_r.main_schet_id = $2 
                        AND k_r.isdeleted = false
                        AND k_r.doc_date <= $3
                        AND k_r.id_podotchet_litso = $4
                        AND s_op.schet = $5),
                bank_rasxod AS 
                    (SELECT COALESCE(SUM(b_r_ch.summa), 0) AS summa
                    FROM bank_rasxod_child b_r_ch
                    JOIN bank_rasxod AS b_r ON b_r_ch.id_bank_rasxod = b_r.id
                    JOIN spravochnik_podotchet_litso AS s_p_l ON s_p_l.id = b_r_ch.id_spravochnik_podotchet_litso 
                    JOIN users u ON b_r.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    JOIN spravochnik_operatsii AS s_op ON s_op.id = b_r_ch.spravochnik_operatsii_id
                    WHERE r.id = $1 
                        AND b_r.main_schet_id = $2 
                        AND b_r.isdeleted = false  
                        AND b_r.doc_date <= $3
                        AND b_r_ch.id_spravochnik_podotchet_litso = $4
                        AND s_op.schet = $5),
                kassa_prixod AS 
                    (SELECT COALESCE(SUM(k_p_ch.summa), 0) AS summa
                    FROM kassa_prixod_child k_p_ch
                    JOIN kassa_prixod AS k_p ON k_p_ch.kassa_prixod_id = k_p.id
                    JOIN spravochnik_podotchet_litso AS s_p_l ON s_p_l.id = k_p.id_podotchet_litso 
                    JOIN users u ON k_p.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    JOIN spravochnik_operatsii AS s_op ON s_op.id = k_p_ch.spravochnik_operatsii_id
                    WHERE r.id = $1 
                        AND k_p.main_schet_id = $2 
                        AND k_p.isdeleted = false  
                        AND k_p.doc_date <= $3
                        AND k_p.id_podotchet_litso = $4
                        AND s_op.schet = $5),
                avans_otchetlar AS 
                    (SELECT COALESCE(SUM(a_tj4_ch.summa), 0) AS summa
                    FROM avans_otchetlar_jur4_child a_tj4_ch
                    JOIN avans_otchetlar_jur4 AS a_tj4 ON a_tj4_ch.avans_otchetlar_jur4_id = a_tj4.id
                    JOIN spravochnik_podotchet_litso AS s_p_l ON s_p_l.id = a_tj4.spravochnik_podotchet_litso_id 
                    JOIN users u ON a_tj4.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    JOIN spravochnik_operatsii AS s_op ON s_op.id = a_tj4.spravochnik_operatsii_own_id
                    WHERE r.id = $1 
                        AND a_tj4.main_schet_id = $2 
                        AND a_tj4.isdeleted = false  
                        AND a_tj4.doc_date <= $3
                        AND s_p_l.id = $4
                        AND s_op.schet = $5),
                bank_prixod AS 
                    (SELECT COALESCE(SUM(b_p_ch.summa), 0) AS summa
                    FROM bank_prixod_child b_p_ch
                    JOIN bank_prixod AS b_p ON b_p_ch.id_bank_prixod = b_p.id
                    JOIN spravochnik_podotchet_litso AS s_p_l ON s_p_l.id = b_p_ch.id_spravochnik_podotchet_litso 
                    JOIN users u ON b_p.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    JOIN spravochnik_operatsii AS s_op ON s_op.id = b_p_ch.spravochnik_operatsii_id
                    WHERE r.id = $1 
                        AND b_p.main_schet_id = $2 
                        AND b_p.isdeleted = false   
                        AND b_p.doc_date <= $3
                        AND b_p_ch.id_spravochnik_podotchet_litso = $4
                        AND s_op.schet = $5)
            SELECT (
                (kassa_rasxod.summa + bank_rasxod.summa) - 
                (kassa_prixod.summa + bank_prixod.summa + avans_otchetlar.summa)
            )::FLOAT AS summa
            FROM kassa_prixod, kassa_rasxod, bank_prixod, bank_rasxod, avans_otchetlar
        `, [region_id, main_schet_id, to, podotchet_id, operatsii]);

        let summa_prixod = 0;
        let summa_rasxod = 0;
        for (let item of data.rows) {
            summa_rasxod += item.rasxod_sum
            summa_prixod += item.prixod_sum
        }
        return {
            data: data.rows,
            summa_prixod,
            summa_rasxod,
            summa_from: summa_from.rows[0].summa || 0,
            summa_to: summa_to.rows[0].summa || 0
        };
    } catch (error) {
        throw new ErrorResponse(error.message, error.statusCode);
    }
};

module.exports = {
    getMonitoringService,
    prixodRasxodPodotchetService,
    getByIdPodotchetMonitoringService,
    podotchetMonitoringToExcelService
};