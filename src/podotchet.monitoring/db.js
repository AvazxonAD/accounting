const { db } = require('../db/index');

exports.PodotchetMonitoringDB = class {
    static async getMonitoring(params, podotcbet_id) {
        let podotchet_filter = ``;
        if (podotcbet_id) {
            params.push(podotcbet_id);
            podotchet_filter = `AND p.id = $${params.length}`;
        }
        const query = `--sql
            SELECT 
                b_r.id, 
                b_r.doc_num,
                TO_CHAR(b_r.doc_date, 'YYYY-MM-DD') AS doc_date,
                b_r_ch.summa::FLOAT AS prixod_sum,
                0::FLOAT AS rasxod_sum,
                b_r.opisanie,
                b_r_ch.id_spravochnik_podotchet_litso AS podotchet_id,
                p.name AS podotchet_name,
                p.rayon AS podotchet_rayon,
                u.login,
                u.fio,
                u.id AS user_id,
                s_op.schet AS provodki_schet,
                s_op.sub_schet AS provodki_sub_schet,
                'bank_rasxod' AS type
            FROM bank_rasxod_child b_r_ch
            JOIN bank_rasxod AS b_r ON b_r_ch.id_bank_rasxod = b_r.id
            LEFT JOIN spravochnik_podotchet_litso AS p ON p.id = b_r_ch.id_spravochnik_podotchet_litso 
            JOIN users u ON b_r.user_id = u.id
            JOIN regions r ON u.region_id = r.id
            JOIN spravochnik_operatsii AS s_op ON s_op.id = b_r_ch.spravochnik_operatsii_id
            WHERE r.id = $1 
                AND b_r.main_schet_id = $2 
                AND b_r.isdeleted = false  
                AND b_r.doc_date BETWEEN $3 AND $4
                AND s_op.schet = $5
                ${podotchet_filter}
                AND p.id IS NOT NULL
            UNION ALL
            SELECT 
                b_p.id, 
                b_p.doc_num,
                TO_CHAR(b_p.doc_date, 'YYYY-MM-DD') AS doc_date,
                0::FLOAT AS prixod_sum,
                b_p_ch.summa::FLOAT AS rasxod_sum,
                b_p.opisanie,
                b_p_ch.id_spravochnik_podotchet_litso AS podotchet_id,
                p.name AS podotchet_name,
                p.rayon AS podotchet_rayon,
                u.login,
                u.fio,
                u.id AS user_id,
                s_op.schet AS provodki_schet,
                s_op.sub_schet AS provodki_sub_schet,
                'bank_prixod' AS type
            FROM bank_prixod_child b_p_ch
            JOIN bank_prixod AS b_p ON b_p_ch.id_bank_prixod = b_p.id
            LEFT JOIN spravochnik_podotchet_litso AS p ON p.id = b_p_ch.id_spravochnik_podotchet_litso 
            JOIN users u ON b_p.user_id = u.id
            JOIN regions r ON u.region_id = r.id
            JOIN spravochnik_operatsii AS s_op ON s_op.id = b_p_ch.spravochnik_operatsii_id
            WHERE r.id = $1 
                AND b_p.main_schet_id = $2 
                AND b_p.isdeleted = false   
                AND b_p.doc_date BETWEEN $3 AND $4
                AND s_op.schet = $5
                ${podotchet_filter}
                AND p.id IS NOT NULL
            UNION ALL 
            SELECT 
                k_p.id, 
                k_p.doc_num,
                TO_CHAR(k_p.doc_date, 'YYYY-MM-DD') AS doc_date,
                0::FLOAT AS prixod_sum,
                k_p_ch.summa::FLOAT AS rasxod_sum,
                k_p.opisanie,
                k_p.id_podotchet_litso AS podotchet_id,
                p.name AS podotchet_name,
                p.rayon AS podotchet_rayon,
                u.login,
                u.fio,
                u.id AS user_id,
                s_op.schet AS provodki_schet,
                s_op.sub_schet AS provodki_sub_schet,
                'kassa_prixod' AS type
            FROM kassa_prixod_child k_p_ch
            JOIN kassa_prixod AS k_p ON k_p_ch.kassa_prixod_id = k_p.id
            JOIN spravochnik_podotchet_litso AS p ON p.id = k_p.id_podotchet_litso 
            JOIN users u ON k_p.user_id = u.id
            JOIN regions r ON u.region_id = r.id
            JOIN spravochnik_operatsii AS s_op ON s_op.id = k_p_ch.spravochnik_operatsii_id
            WHERE r.id = $1 AND k_p.main_schet_id = $2 
                AND k_p.isdeleted = false  
                AND k_p.doc_date BETWEEN $3 AND $4
                AND s_op.schet = $5
                ${podotchet_filter}
                AND p.id IS NOT NULL
            UNION ALL
            SELECT 
                k_r.id, 
                k_r.doc_num,
                TO_CHAR(k_r.doc_date, 'YYYY-MM-DD') AS doc_date,
                k_r_ch.summa::FLOAT AS prixod_sum,
                0::FLOAT AS rasxod_sum,
                k_r.opisanie,
                k_r.id_podotchet_litso AS podotchet_id,
                p.name AS podotchet_name,
                p.rayon AS podotchet_rayon,
                u.login,
                u.fio,
                u.id AS user_id,
                s_op.schet AS provodki_schet,
                s_op.sub_schet AS provodki_sub_schet,
                'kassa_rasxod' AS type
            FROM kassa_rasxod_child k_r_ch
            JOIN kassa_rasxod AS k_r ON k_r_ch.kassa_rasxod_id = k_r.id
            JOIN spravochnik_podotchet_litso AS p ON p.id = k_r.id_podotchet_litso 
            JOIN users u ON k_r.user_id = u.id
            JOIN regions r ON u.region_id = r.id
            JOIN spravochnik_operatsii AS s_op ON s_op.id = k_r_ch.spravochnik_operatsii_id
            WHERE r.id = $1 
                AND k_r.main_schet_id = $2 
                AND k_r.isdeleted = false
                AND k_r.doc_date BETWEEN $3 AND $4
                AND s_op.schet = $5
                ${podotchet_filter}
                AND p.id IS NOT NULL
            UNION ALL 
            SELECT  
                a_tj4.id, 
                a_tj4.doc_num,
                TO_CHAR(a_tj4.doc_date, 'YYYY-MM-DD') AS doc_date,
                0::FLOAT AS prixod_sum,
                a_tj4_ch.summa::FLOAT AS rasxod_sum,
                a_tj4.opisanie,
                p.id AS podotchet_id,
                p.name AS podotchet_name,
                p.rayon AS podotchet_rayon,
                u.login,
                u.fio,
                u.id AS user_id,
                s_p.schet AS provodki_schet,
                s_p.sub_schet AS provodki_sub_schet,
                'avans' AS type
            FROM avans_otchetlar_jur4_child a_tj4_ch
            JOIN avans_otchetlar_jur4 AS a_tj4 ON a_tj4_ch.avans_otchetlar_jur4_id = a_tj4.id
            JOIN spravochnik_podotchet_litso AS p ON p.id = a_tj4.spravochnik_podotchet_litso_id 
            JOIN users u ON a_tj4.user_id = u.id
            JOIN regions r ON u.region_id = r.id
            JOIN spravochnik_operatsii AS s_op ON s_op.id = a_tj4.spravochnik_operatsii_own_id
            JOIN spravochnik_operatsii AS s_p ON s_p.id = a_tj4_ch.spravochnik_operatsii_id
            WHERE r.id = $1 
                AND a_tj4.main_schet_id = $2 
                AND a_tj4.isdeleted = false  
                AND a_tj4.doc_date BETWEEN $3 AND $4
                AND s_op.schet = $5
                ${podotchet_filter}
                AND p.id IS NOT NULL
            ORDER BY doc_date OFFSET $6 LIMIT $7
        `;
        const result = await db.query(query, params);
        return result;
    }

    static async getSummaMonitoring(params, podotcbet_id, operator, main_schet_id, budjet_id, operatsii) {
        let main_schet_filter = ``
        let budjet_filter = ``
        let podotchet_filter = ``;
        let operatsii_filter = ``;
        if (podotcbet_id) {
            params.push(podotcbet_id);
            podotchet_filter = `AND p.id = $${params.length}`;
        }
        if(main_schet_id){
            params.push(main_schet_id);
            main_schet_filter = `AND m.id = $${params.length}`;
        }
        if(budjet_id){
            params.push(budjet_id);
            budjet_filter = `AND m.spravochnik_budjet_name_id = $${params.length}`;
        }
        if(operatsii){
            params.push(operatsii);
            operatsii_filter = `AND s_op.schet = $${params.length}`;
        }
        const query = `--sql
            WITH 
                bank_rasxod AS (
                    SELECT 
                        COALESCE(SUM(b_r_ch.summa), 0)::FLOAT AS prixod_sum
                    FROM bank_rasxod_child b_r_ch
                    JOIN bank_rasxod AS b_r ON b_r_ch.id_bank_rasxod = b_r.id
                    LEFT JOIN spravochnik_podotchet_litso AS p ON p.id = b_r_ch.id_spravochnik_podotchet_litso 
                    JOIN users u ON b_r.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    JOIN spravochnik_operatsii AS s_op ON s_op.id = b_r_ch.spravochnik_operatsii_id
                    JOIN main_schet AS m ON m.id = b_r.main_schet_id
                    WHERE r.id = $1  
                        AND b_r.isdeleted = false 
                        AND b_r.doc_date ${operator} $2
                        ${podotchet_filter}
                        AND p.id IS NOT NULL
                        ${main_schet_filter}
                        ${budjet_filter}
                        ${operatsii_filter}
                ),
                bank_prixod AS (
                    SELECT 
                        COALESCE(SUM(b_p_ch.summa), 0)::FLOAT AS rasxod_sum
                    FROM bank_prixod_child b_p_ch
                    JOIN bank_prixod AS b_p ON b_p_ch.id_bank_prixod = b_p.id
                    LEFT JOIN spravochnik_podotchet_litso AS p ON p.id = b_p_ch.id_spravochnik_podotchet_litso 
                    JOIN users u ON b_p.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    JOIN spravochnik_operatsii AS s_op ON s_op.id = b_p_ch.spravochnik_operatsii_id
                    JOIN main_schet AS m ON m.id = b_p.main_schet_id
                    WHERE r.id = $1  
                        AND b_p.isdeleted = false 
                        AND b_p.doc_date ${operator} $2
                        ${podotchet_filter}
                        AND p.id IS NOT NULL
                        ${main_schet_filter}
                        ${budjet_filter}
                        ${operatsii_filter}
                ),
                kassa_prixod AS (
                    SELECT 
                        COALESCE(SUM(k_p_ch.summa), 0)::FLOAT AS rasxod_sum
                    FROM kassa_prixod_child k_p_ch
                    JOIN kassa_prixod AS k_p ON k_p_ch.kassa_prixod_id = k_p.id
                    JOIN spravochnik_podotchet_litso AS p ON p.id = k_p.id_podotchet_litso 
                    JOIN users u ON k_p.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    JOIN spravochnik_operatsii AS s_op ON s_op.id = k_p_ch.spravochnik_operatsii_id
                    JOIN main_schet AS m ON m.id = k_p.main_schet_id
                    WHERE r.id = $1  
                        AND k_p.isdeleted = false 
                        AND k_p.doc_date ${operator} $2
                        ${podotchet_filter}
                        AND p.id IS NOT NULL
                        ${main_schet_filter}
                        ${budjet_filter}
                        ${operatsii_filter}
                ),
                kassa_rasxod AS (
                    SELECT 
                        COALESCE(SUM(k_r_ch.summa), 0)::FLOAT AS prixod_sum
                    FROM kassa_rasxod_child k_r_ch
                    JOIN kassa_rasxod AS k_r ON k_r_ch.kassa_rasxod_id = k_r.id
                    JOIN spravochnik_podotchet_litso AS p ON p.id = k_r.id_podotchet_litso 
                    JOIN users u ON k_r.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    JOIN spravochnik_operatsii AS s_op ON s_op.id = k_r_ch.spravochnik_operatsii_id
                    JOIN main_schet AS m ON m.id = k_r.main_schet_id
                    WHERE r.id = $1  
                        AND k_r.isdeleted = false
                        AND k_r.doc_date ${operator} $2
                        ${podotchet_filter}
                        AND p.id IS NOT NULL
                        ${main_schet_filter}
                        ${budjet_filter}
                        ${operatsii_filter}
                ),
                avans_otchet AS (
                    SELECT 
                        COALESCE(SUM(a_tj4_ch.summa), 0)::FLOAT AS rasxod_sum
                    FROM avans_otchetlar_jur4_child a_tj4_ch
                    JOIN avans_otchetlar_jur4 AS a_tj4 ON a_tj4_ch.avans_otchetlar_jur4_id = a_tj4.id
                    JOIN spravochnik_podotchet_litso AS p ON p.id = a_tj4.spravochnik_podotchet_litso_id 
                    JOIN users u ON a_tj4.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    JOIN spravochnik_operatsii AS s_op ON s_op.id = a_tj4.spravochnik_operatsii_own_id
                    JOIN main_schet AS m ON m.id = a_tj4.main_schet_id
                    WHERE r.id = $1  
                        AND a_tj4.isdeleted = false 
                        AND a_tj4.doc_date ${operator} $2
                        ${podotchet_filter}
                        AND p.id IS NOT NULL
                        ${main_schet_filter}
                        ${budjet_filter}
                        ${operatsii_filter}
                )
            SELECT 
                (bank_rasxod.prixod_sum + kassa_rasxod.prixod_sum) - 
                (bank_prixod.rasxod_sum + kassa_prixod.rasxod_sum + avans_otchet.rasxod_sum) AS balance
            FROM bank_rasxod
            CROSS JOIN bank_prixod
            CROSS JOIN kassa_prixod
            CROSS JOIN kassa_rasxod
            CROSS JOIN avans_otchet
        `;
        const result = await db.query(query, params);
        return result[0].balance;
    }

    static async getTotalMonitoring(params, podotcbet_id, operator) {
        let podotchet_filter = ``;
        if (podotcbet_id) {
            params.push(podotcbet_id);
            podotchet_filter = `AND p.id = $${params.length}`;
        }
        const query = `--sql
            WITH 
                bank_rasxod AS (
                    SELECT 
                        COUNT(b_r_ch.id)::INT AS doc_count
                    FROM bank_rasxod_child b_r_ch
                    JOIN bank_rasxod AS b_r ON b_r_ch.id_bank_rasxod = b_r.id
                    LEFT JOIN spravochnik_podotchet_litso AS p ON p.id = b_r_ch.id_spravochnik_podotchet_litso 
                    JOIN users u ON b_r.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    JOIN spravochnik_operatsii AS s_op ON s_op.id = b_r_ch.spravochnik_operatsii_id
                    WHERE r.id = $1 
                        AND b_r.main_schet_id = $2 
                        AND b_r.isdeleted = false 
                        AND b_r.doc_date BETWEEN $3 AND $4
                        AND s_op.schet = $5
                        ${podotchet_filter}
                        AND p.id IS NOT NULL
                ),
                bank_prixod AS (
                    SELECT 
                        COUNT(b_p_ch.id)::INT AS doc_count
                    FROM bank_prixod_child b_p_ch
                    JOIN bank_prixod AS b_p ON b_p_ch.id_bank_prixod = b_p.id
                    LEFT JOIN spravochnik_podotchet_litso AS p ON p.id = b_p_ch.id_spravochnik_podotchet_litso 
                    JOIN users u ON b_p.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    JOIN spravochnik_operatsii AS s_op ON s_op.id = b_p_ch.spravochnik_operatsii_id
                    WHERE r.id = $1 
                        AND b_p.main_schet_id = $2 
                        AND b_p.isdeleted = false 
                        AND b_p.doc_date BETWEEN $3 AND $4
                        AND s_op.schet = $5
                        ${podotchet_filter}
                        AND p.id IS NOT NULL
                ),
                kassa_prixod AS (
                    SELECT 
                        COUNT(k_p_ch.id)::INT AS doc_count
                    FROM kassa_prixod_child k_p_ch
                    JOIN kassa_prixod AS k_p ON k_p_ch.kassa_prixod_id = k_p.id
                    JOIN spravochnik_podotchet_litso AS p ON p.id = k_p.id_podotchet_litso 
                    JOIN users u ON k_p.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    JOIN spravochnik_operatsii AS s_op ON s_op.id = k_p_ch.spravochnik_operatsii_id
                    WHERE r.id = $1 
                        AND k_p.main_schet_id = $2 
                        AND k_p.isdeleted = false 
                        AND k_p.doc_date BETWEEN $3 AND $4
                        AND s_op.schet = $5
                        ${podotchet_filter}
                        AND p.id IS NOT NULL
                ),
                kassa_rasxod AS (
                    SELECT 
                        COUNT(k_r_ch.id)::INT AS doc_count
                    FROM kassa_rasxod_child k_r_ch
                    JOIN kassa_rasxod AS k_r ON k_r_ch.kassa_rasxod_id = k_r.id
                    JOIN spravochnik_podotchet_litso AS p ON p.id = k_r.id_podotchet_litso 
                    JOIN users u ON k_r.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    JOIN spravochnik_operatsii AS s_op ON s_op.id = k_r_ch.spravochnik_operatsii_id
                    WHERE r.id = $1 
                        AND k_r.main_schet_id = $2 
                        AND k_r.isdeleted = false
                        AND k_r.doc_date BETWEEN $3 AND $4
                        AND s_op.schet = $5
                        ${podotchet_filter}
                        AND p.id IS NOT NULL
                ),
                avans_otchet AS (
                    SELECT 
                        COUNT(a_tj4_ch.id)::INT AS doc_count
                    FROM avans_otchetlar_jur4_child a_tj4_ch
                    JOIN avans_otchetlar_jur4 AS a_tj4 ON a_tj4_ch.avans_otchetlar_jur4_id = a_tj4.id
                    JOIN spravochnik_podotchet_litso AS p ON p.id = a_tj4.spravochnik_podotchet_litso_id 
                    JOIN users u ON a_tj4.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    JOIN spravochnik_operatsii AS s_op ON s_op.id = a_tj4.spravochnik_operatsii_own_id
                    JOIN spravochnik_operatsii AS s_p ON s_p.id = a_tj4_ch.spravochnik_operatsii_id
                    WHERE r.id = $1 
                        AND a_tj4.main_schet_id = $2 
                        AND a_tj4.isdeleted = false 
                        AND a_tj4.doc_date BETWEEN $3 AND $4
                        AND s_op.schet = $5
                        ${podotchet_filter}
                        AND p.id IS NOT NULL
                )
            SELECT 
                (bank_rasxod.doc_count + kassa_rasxod.doc_count + 
                 bank_prixod.doc_count + kassa_prixod.doc_count + 
                 avans_otchet.doc_count) AS total_docs
            FROM bank_rasxod
            CROSS JOIN bank_prixod
            CROSS JOIN kassa_prixod
            CROSS JOIN kassa_rasxod
            CROSS JOIN avans_otchet
        `;
        const result = await db.query(query, params);
        return result[0].total_docs;
    }

    static async cap(params) {
        const query = `--sql           
            SELECT 
                m.jur1_schet AS schet, 
                s_op.sub_schet,
                COALESCE(SUM(kpch.summa), 0)::FLOAT AS summa,
                'kassa_prixod' AS type
            FROM kassa_prixod_child AS kpch
            JOIN kassa_prixod AS kp ON kp.id = kpch.kassa_prixod_id 
            JOIN spravochnik_operatsii AS s_op ON s_op.id = kpch.spravochnik_operatsii_id
            JOIN users AS u ON kp.user_id = u.id
            JOIN main_schet AS m ON m.id = kp.main_schet_id
            JOIN regions AS r ON r.id = u.region_id
            WHERE kp.isdeleted = false
                AND r.id = $1
                AND kp.main_schet_id = $2
                AND s_op.schet = $3
                AND kp.doc_date BETWEEN $4 AND $5
            GROUP BY m.jur1_schet, s_op.sub_schet
            UNION ALL
            SELECT 
                m.jur2_schet AS schet, 
                s_op.sub_schet,
                COALESCE(SUM(b.summa), 0)::FLOAT AS summa,
                'bank_prixod' AS type
            FROM bank_prixod_child AS b
            JOIN bank_prixod AS b_d ON b_d.id = b.id_bank_prixod
            JOIN spravochnik_operatsii AS s_op ON s_op.id = b.spravochnik_operatsii_id
            JOIN users AS u ON b_d.user_id = u.id
            JOIN regions AS r ON r.id = u.region_id
            JOIN main_schet AS m ON m.id = b_d.main_schet_id
            WHERE b_d.isdeleted = false
                AND r.id = $1
                AND m.id = $2
                AND s_op.schet = $3
                AND b_d.doc_date BETWEEN $4 AND $5
            GROUP BY m.jur2_schet, s_op.sub_schet
            UNION ALL
            SELECT 
                s_op.schet, 
                s_op.sub_schet,
                COALESCE(SUM(ach.summa), 0)::FLOAT AS summa,
                'avans' AS type
            FROM avans_otchetlar_jur4_child AS ach
            JOIN avans_otchetlar_jur4 AS a ON a.id = ach.avans_otchetlar_jur4_id 
            JOIN spravochnik_operatsii AS s_o_p ON s_o_p.id = a.spravochnik_operatsii_own_id
            JOIN spravochnik_operatsii AS s_op ON s_op.id = ach.spravochnik_operatsii_id
            JOIN users AS u ON a.user_id = u.id
            JOIN regions AS r ON r.id = u.region_id
            WHERE a.isdeleted = false
                AND r.id = $1
                AND a.main_schet_id = $2
                AND s_o_p.schet = $3
                AND a.doc_date BETWEEN $4 AND $5
            GROUP BY s_op.schet, s_op.sub_schet
        `;
        const result = await db.query(query, params);
        return result;
    }
}
