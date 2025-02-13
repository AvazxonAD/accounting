const { db } = require('@db/index');

exports.PodotchetMonitoringDB = class {
    static async getMonitoring(params, podotcbet_id, search) {
        let podotchet_filter = ``;
        let search_filter = ``;

        if (podotcbet_id) {
            params.push(podotcbet_id);
            podotchet_filter = `AND p.id = $${params.length}`;
        }

        if (search) {
            params.push(search);
            search_filter = `AND (
                d.doc_num = $${params.length} OR 
                p.name ILIKE '%' || $${params.length} || '%'
            )`;
        }

        const query = `--sql
            SELECT 
                d.id, 
                d.doc_num,
                TO_CHAR(d.doc_date, 'YYYY-MM-DD') AS doc_date,
                ch.summa::FLOAT AS prixod_sum,
                0::FLOAT AS rasxod_sum,
                d.opisanie,
                ch.id_spravochnik_podotchet_litso AS podotchet_id,
                p.name AS podotchet_name,
                p.rayon AS podotchet_rayon,
                u.login,
                u.fio,
                u.id AS user_id,
                op.schet AS provodki_schet,
                op.sub_schet AS provodki_sub_schet,
                'bank_rasxod' AS type
            FROM bank_rasxod_child ch
            JOIN bank_rasxod AS d ON ch.id_bank_rasxod = d.id
            LEFT JOIN spravochnik_podotchet_litso AS p ON p.id = ch.id_spravochnik_podotchet_litso 
            JOIN users u ON d.user_id = u.id
            JOIN regions r ON u.region_id = r.id
            JOIN spravochnik_operatsii AS op ON op.id = ch.spravochnik_operatsii_id
            WHERE r.id = $1 
                AND d.main_schet_id = $2 
                AND d.isdeleted = false  
                AND d.doc_date BETWEEN $3 AND $4
                AND op.schet = $5
                ${podotchet_filter}
                ${search_filter}
                AND p.id IS NOT NULL

            UNION ALL
            
            SELECT 
                d.id, 
                d.doc_num,
                TO_CHAR(d.doc_date, 'YYYY-MM-DD') AS doc_date,
                0::FLOAT AS prixod_sum,
                ch.summa::FLOAT AS rasxod_sum,
                d.opisanie,
                ch.id_spravochnik_podotchet_litso AS podotchet_id,
                p.name AS podotchet_name,
                p.rayon AS podotchet_rayon,
                u.login,
                u.fio,
                u.id AS user_id,
                op.schet AS provodki_schet,
                op.sub_schet AS provodki_sub_schet,
                'bank_prixod' AS type
            FROM bank_prixod_child ch
            JOIN bank_prixod AS d ON ch.id_bank_prixod = d.id
            LEFT JOIN spravochnik_podotchet_litso AS p ON p.id = ch.id_spravochnik_podotchet_litso 
            JOIN users u ON d.user_id = u.id
            JOIN regions r ON u.region_id = r.id
            JOIN spravochnik_operatsii AS op ON op.id = ch.spravochnik_operatsii_id
            WHERE r.id = $1 
                AND d.main_schet_id = $2 
                AND d.isdeleted = false   
                AND d.doc_date BETWEEN $3 AND $4
                AND op.schet = $5
                ${podotchet_filter}
                ${search_filter}
                AND p.id IS NOT NULL
            
            UNION ALL 
        
            SELECT 
                d.id, 
                d.doc_num,
                TO_CHAR(d.doc_date, 'YYYY-MM-DD') AS doc_date,
                0::FLOAT AS prixod_sum,
                ch.summa::FLOAT AS rasxod_sum,
                d.opisanie,
                d.id_podotchet_litso AS podotchet_id,
                p.name AS podotchet_name,
                p.rayon AS podotchet_rayon,
                u.login,
                u.fio,
                u.id AS user_id,
                op.schet AS provodki_schet,
                op.sub_schet AS provodki_sub_schet,
                'kassa_prixod' AS type
            FROM kassa_prixod_child ch
            JOIN kassa_prixod AS d ON ch.kassa_prixod_id = d.id
            JOIN spravochnik_podotchet_litso AS p ON p.id = d.id_podotchet_litso 
            JOIN users u ON d.user_id = u.id
            JOIN regions r ON u.region_id = r.id
            JOIN spravochnik_operatsii AS op ON op.id = ch.spravochnik_operatsii_id
            WHERE r.id = $1 AND d.main_schet_id = $2 
                AND d.isdeleted = false  
                AND d.doc_date BETWEEN $3 AND $4
                AND op.schet = $5
                ${podotchet_filter}
                ${search_filter}
                AND p.id IS NOT NULL

            UNION ALL
            
            SELECT 
                d.id, 
                d.doc_num,
                TO_CHAR(d.doc_date, 'YYYY-MM-DD') AS doc_date,
                ch.summa::FLOAT AS prixod_sum,
                0::FLOAT AS rasxod_sum,
                d.opisanie,
                d.id_podotchet_litso AS podotchet_id,
                p.name AS podotchet_name,
                p.rayon AS podotchet_rayon,
                u.login,
                u.fio,
                u.id AS user_id,
                op.schet AS provodki_schet,
                op.sub_schet AS provodki_sub_schet,
                'kassa_rasxod' AS type
            FROM kassa_rasxod_child ch
            JOIN kassa_rasxod AS d ON ch.kassa_rasxod_id = d.id
            JOIN spravochnik_podotchet_litso AS p ON p.id = d.id_podotchet_litso 
            JOIN users u ON d.user_id = u.id
            JOIN regions r ON u.region_id = r.id
            JOIN spravochnik_operatsii AS op ON op.id = ch.spravochnik_operatsii_id
            WHERE r.id = $1 
                AND d.main_schet_id = $2 
                AND d.isdeleted = false
                AND d.doc_date BETWEEN $3 AND $4
                AND op.schet = $5
                ${podotchet_filter}
                ${search_filter}
                AND p.id IS NOT NULL

            UNION ALL 

            SELECT  
                d.id, 
                d.doc_num,
                TO_CHAR(d.doc_date, 'YYYY-MM-DD') AS doc_date,
                0::FLOAT AS prixod_sum,
                ch.summa::FLOAT AS rasxod_sum,
                d.opisanie,
                p.id AS podotchet_id,
                p.name AS podotchet_name,
                p.rayon AS podotchet_rayon,
                u.login,
                u.fio,
                u.id AS user_id,
                s_p.schet AS provodki_schet,
                s_p.sub_schet AS provodki_sub_schet,
                'avans' AS type
            FROM avans_otchetlar_jur4_child ch
            JOIN avans_otchetlar_jur4 AS d ON ch.avans_otchetlar_jur4_id = d.id
            JOIN spravochnik_podotchet_litso AS p ON p.id = d.spravochnik_podotchet_litso_id 
            JOIN users u ON d.user_id = u.id
            JOIN regions r ON u.region_id = r.id
            JOIN spravochnik_operatsii AS op ON op.id = d.spravochnik_operatsii_own_id
            JOIN spravochnik_operatsii AS s_p ON s_p.id = ch.spravochnik_operatsii_id
            WHERE r.id = $1 
                AND d.main_schet_id = $2 
                AND d.isdeleted = false  
                AND d.doc_date BETWEEN $3 AND $4
                AND op.schet = $5
                ${podotchet_filter}
                ${search_filter}
                AND p.id IS NOT NULL

            ORDER BY doc_date 
            OFFSET $6 LIMIT $7
        `;
        const result = await db.query(query, params);
        return result;
    }

    static async getSummaMonitoring(params, date, dates, podotcbet_id, main_schet_id, budjet_id, operatsii, search) {
        let search_filter = ``;
        let main_schet_filter = ``
        let budjet_filter = ``
        let podotchet_filter = ``;
        let operatsii_filter = ``;
        let date_filter = ``;

        if (date) {
            params.push(date.date);
            date_filter = `AND d.doc_date ${date.operator} $${params.length}`;
        }

        if (dates) {
            params.push(dates[0], dates[1]);
            date_filter = `AND d.doc_date BETWEEN $${params.length - 1} AND $${params.length}`;
        }

        if (podotcbet_id) {
            params.push(podotcbet_id);
            podotchet_filter = `AND p.id = $${params.length}`;
        }

        if (main_schet_id) {
            params.push(main_schet_id);
            main_schet_filter = `AND m.id = $${params.length}`;
        }

        if (budjet_id) {
            params.push(budjet_id);
            budjet_filter = `AND m.spravochnik_budjet_name_id = $${params.length}`;
        }

        if (operatsii) {
            params.push(operatsii);
            operatsii_filter = `AND op.schet = $${params.length}`;
        }

        if (search) {
            search_filter = `AND (
                d.doc_num = $${params.length} OR 
                p.name ILIKE '%' || $${params.length} || '%'
            )`;
        }

        const query = `--sql
            WITH 
                bank_rasxod AS (
                    SELECT 
                        COALESCE(SUM(ch.summa), 0)::FLOAT AS prixod_sum
                    FROM bank_rasxod_child ch
                    JOIN bank_rasxod AS d ON ch.id_bank_rasxod = d.id
                    LEFT JOIN spravochnik_podotchet_litso AS p ON p.id = ch.id_spravochnik_podotchet_litso 
                    JOIN users u ON d.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    JOIN spravochnik_operatsii AS op ON op.id = ch.spravochnik_operatsii_id
                    JOIN main_schet AS m ON m.id = d.main_schet_id
                    WHERE r.id = $1  
                        AND d.isdeleted = false 
                        ${date_filter}
                        ${podotchet_filter}
                        AND p.id IS NOT NULL
                        ${main_schet_filter}
                        ${budjet_filter}
                        ${operatsii_filter}
                        ${search_filter}
                ),
                bank_prixod AS (
                    SELECT 
                        COALESCE(SUM(ch.summa), 0)::FLOAT AS rasxod_sum
                    FROM bank_prixod_child ch
                    JOIN bank_prixod AS d ON ch.id_bank_prixod = d.id
                    LEFT JOIN spravochnik_podotchet_litso AS p ON p.id = ch.id_spravochnik_podotchet_litso 
                    JOIN users u ON d.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    JOIN spravochnik_operatsii AS op ON op.id = ch.spravochnik_operatsii_id
                    JOIN main_schet AS m ON m.id = d.main_schet_id
                    WHERE r.id = $1  
                        AND d.isdeleted = false 
                        ${date_filter}
                        ${podotchet_filter}
                        AND p.id IS NOT NULL
                        ${main_schet_filter}
                        ${budjet_filter}
                        ${operatsii_filter}
                        ${search_filter}
                ),
                kassa_prixod AS (
                    SELECT 
                        COALESCE(SUM(ch.summa), 0)::FLOAT AS rasxod_sum
                    FROM kassa_prixod_child ch
                    JOIN kassa_prixod AS d ON ch.kassa_prixod_id = d.id
                    JOIN spravochnik_podotchet_litso AS p ON p.id = d.id_podotchet_litso 
                    JOIN users u ON d.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    JOIN spravochnik_operatsii AS op ON op.id = ch.spravochnik_operatsii_id
                    JOIN main_schet AS m ON m.id = d.main_schet_id
                    WHERE r.id = $1  
                        AND d.isdeleted = false 
                        ${date_filter}
                        ${podotchet_filter}
                        AND p.id IS NOT NULL
                        ${main_schet_filter}
                        ${budjet_filter}
                        ${operatsii_filter}
                        ${search_filter}
                ),
                kassa_rasxod AS (
                    SELECT 
                        COALESCE(SUM(ch.summa), 0)::FLOAT AS prixod_sum
                    FROM kassa_rasxod_child ch
                    JOIN kassa_rasxod AS d ON ch.kassa_rasxod_id = d.id
                    JOIN spravochnik_podotchet_litso AS p ON p.id = d.id_podotchet_litso 
                    JOIN users u ON d.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    JOIN spravochnik_operatsii AS op ON op.id = ch.spravochnik_operatsii_id
                    JOIN main_schet AS m ON m.id = d.main_schet_id
                    WHERE r.id = $1  
                        AND d.isdeleted = false
                        ${date_filter}
                        ${podotchet_filter}
                        AND p.id IS NOT NULL
                        ${main_schet_filter}
                        ${budjet_filter}
                        ${operatsii_filter}
                        ${search_filter}
                ),
                avans_otchet AS (
                    SELECT 
                        COALESCE(SUM(ch.summa), 0)::FLOAT AS rasxod_sum
                    FROM avans_otchetlar_jur4_child ch
                    JOIN avans_otchetlar_jur4 AS d ON ch.avans_otchetlar_jur4_id = d.id
                    JOIN spravochnik_podotchet_litso AS p ON p.id = d.spravochnik_podotchet_litso_id 
                    JOIN users u ON d.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    JOIN spravochnik_operatsii AS op ON op.id = d.spravochnik_operatsii_own_id
                    JOIN main_schet AS m ON m.id = d.main_schet_id
                    WHERE r.id = $1  
                        AND d.isdeleted = false 
                        ${date_filter}
                        ${podotchet_filter}
                        AND p.id IS NOT NULL
                        ${main_schet_filter}
                        ${budjet_filter}
                        ${operatsii_filter}
                        ${search_filter}
                )
            SELECT 
                (bank_rasxod.prixod_sum + kassa_rasxod.prixod_sum) AS prixod_sum,
                (bank_prixod.rasxod_sum + kassa_prixod.rasxod_sum + avans_otchet.rasxod_sum) AS rasxod_sum,
                bank_rasxod.prixod_sum AS bank_rasxod_sum,
                kassa_rasxod.prixod_sum AS kassa_rasxod_sum,
                bank_prixod.rasxod_sum AS bank_prixod_sum,
                kassa_prixod.rasxod_sum AS kassa_prixod_sum,
                avans_otchet.rasxod_sum AS avans_otchet_sum,
                (bank_rasxod.prixod_sum + kassa_rasxod.prixod_sum) - 
                (bank_prixod.rasxod_sum + kassa_prixod.rasxod_sum + avans_otchet.rasxod_sum) AS summa
            FROM bank_rasxod
            CROSS JOIN bank_prixod
            CROSS JOIN kassa_prixod
            CROSS JOIN kassa_rasxod
            CROSS JOIN avans_otchet
        `;
        const result = await db.query(query, params);
        return result[0];
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
                        COUNT(ch.id)::INT AS doc_count
                    FROM bank_rasxod_child ch
                    JOIN bank_rasxod AS d ON ch.id_bank_rasxod = d.id
                    LEFT JOIN spravochnik_podotchet_litso AS p ON p.id = ch.id_spravochnik_podotchet_litso 
                    JOIN users u ON d.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    JOIN spravochnik_operatsii AS op ON op.id = ch.spravochnik_operatsii_id
                    WHERE r.id = $1 
                        AND d.main_schet_id = $2 
                        AND d.isdeleted = false 
                        AND d.doc_date BETWEEN $3 AND $4
                        AND op.schet = $5
                        ${podotchet_filter}
                        AND p.id IS NOT NULL
                ),
                bank_prixod AS (
                    SELECT 
                        COUNT(ch.id)::INT AS doc_count
                    FROM bank_prixod_child ch
                    JOIN bank_prixod AS d ON ch.id_bank_prixod = d.id
                    LEFT JOIN spravochnik_podotchet_litso AS p ON p.id = ch.id_spravochnik_podotchet_litso 
                    JOIN users u ON d.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    JOIN spravochnik_operatsii AS op ON op.id = ch.spravochnik_operatsii_id
                    WHERE r.id = $1 
                        AND d.main_schet_id = $2 
                        AND d.isdeleted = false 
                        AND d.doc_date BETWEEN $3 AND $4
                        AND op.schet = $5
                        ${podotchet_filter}
                        AND p.id IS NOT NULL
                ),
                kassa_prixod AS (
                    SELECT 
                        COUNT(ch.id)::INT AS doc_count
                    FROM kassa_prixod_child ch
                    JOIN kassa_prixod AS d ON ch.kassa_prixod_id = d.id
                    JOIN spravochnik_podotchet_litso AS p ON p.id = d.id_podotchet_litso 
                    JOIN users u ON d.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    JOIN spravochnik_operatsii AS op ON op.id = ch.spravochnik_operatsii_id
                    WHERE r.id = $1 
                        AND d.main_schet_id = $2 
                        AND d.isdeleted = false 
                        AND d.doc_date BETWEEN $3 AND $4
                        AND op.schet = $5
                        ${podotchet_filter}
                        AND p.id IS NOT NULL
                ),
                kassa_rasxod AS (
                    SELECT 
                        COUNT(ch.id)::INT AS doc_count
                    FROM kassa_rasxod_child ch
                    JOIN kassa_rasxod AS d ON ch.kassa_rasxod_id = d.id
                    JOIN spravochnik_podotchet_litso AS p ON p.id = d.id_podotchet_litso 
                    JOIN users u ON d.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    JOIN spravochnik_operatsii AS op ON op.id = ch.spravochnik_operatsii_id
                    WHERE r.id = $1 
                        AND d.main_schet_id = $2 
                        AND d.isdeleted = false
                        AND d.doc_date BETWEEN $3 AND $4
                        AND op.schet = $5
                        ${podotchet_filter}
                        AND p.id IS NOT NULL
                ),
                avans_otchet AS (
                    SELECT 
                        COUNT(ch.id)::INT AS doc_count
                    FROM avans_otchetlar_jur4_child ch
                    JOIN avans_otchetlar_jur4 AS d ON ch.avans_otchetlar_jur4_id = d.id
                    JOIN spravochnik_podotchet_litso AS p ON p.id = d.spravochnik_podotchet_litso_id 
                    JOIN users u ON d.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    JOIN spravochnik_operatsii AS op ON op.id = d.spravochnik_operatsii_own_id
                    JOIN spravochnik_operatsii AS s_p ON s_p.id = ch.spravochnik_operatsii_id
                    WHERE r.id = $1 
                        AND d.main_schet_id = $2 
                        AND d.isdeleted = false 
                        AND d.doc_date BETWEEN $3 AND $4
                        AND op.schet = $5
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
                op.sub_schet,
                COALESCE(SUM(kpch.summa), 0)::FLOAT AS summa,
                'kassa_prixod' AS type
            FROM kassa_prixod_child AS kpch
            JOIN kassa_prixod AS kp ON kp.id = kpch.kassa_prixod_id 
            JOIN spravochnik_operatsii AS op ON op.id = kpch.spravochnik_operatsii_id
            JOIN users AS u ON kp.user_id = u.id
            JOIN main_schet AS m ON m.id = kp.main_schet_id
            JOIN regions AS r ON r.id = u.region_id
            WHERE kp.isdeleted = false
                AND r.id = $1
                AND kp.main_schet_id = $2
                AND op.schet = $3
                AND kp.doc_date BETWEEN $4 AND $5
            GROUP BY m.jur1_schet, op.sub_schet
            UNION ALL
            SELECT 
                m.jur2_schet AS schet, 
                op.sub_schet,
                COALESCE(SUM(b.summa), 0)::FLOAT AS summa,
                'bank_prixod' AS type
            FROM bank_prixod_child AS b
            JOIN bank_prixod AS b_d ON b_d.id = b.id_bank_prixod
            JOIN spravochnik_operatsii AS op ON op.id = b.spravochnik_operatsii_id
            JOIN users AS u ON b_d.user_id = u.id
            JOIN regions AS r ON r.id = u.region_id
            JOIN main_schet AS m ON m.id = b_d.main_schet_id
            WHERE b_d.isdeleted = false
                AND r.id = $1
                AND m.id = $2
                AND op.schet = $3
                AND b_d.doc_date BETWEEN $4 AND $5
            GROUP BY m.jur2_schet, op.sub_schet
            UNION ALL
            SELECT 
                op.schet, 
                op.sub_schet,
                COALESCE(SUM(ach.summa), 0)::FLOAT AS summa,
                'avans' AS type
            FROM avans_otchetlar_jur4_child AS ach
            JOIN avans_otchetlar_jur4 AS a ON a.id = ach.avans_otchetlar_jur4_id 
            JOIN spravochnik_operatsii AS s_o_p ON s_o_p.id = a.spravochnik_operatsii_own_id
            JOIN spravochnik_operatsii AS op ON op.id = ach.spravochnik_operatsii_id
            JOIN users AS u ON a.user_id = u.id
            JOIN regions AS r ON r.id = u.region_id
            WHERE a.isdeleted = false
                AND r.id = $1
                AND a.main_schet_id = $2
                AND s_o_p.schet = $3
                AND a.doc_date BETWEEN $4 AND $5
            GROUP BY op.schet, op.sub_schet
        `;
        const result = await db.query(query, params);
        return result;
    }
}
