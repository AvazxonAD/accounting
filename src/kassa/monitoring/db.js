const { db } = require('../../db/index');

exports.KassaMonitoringDB = class {
    static async get(params, search) {
        let search_filter = '';
        
        if(search){
            params.push(search);
            search_filter = `AND (
                d.doc_num = $${params.length} OR 
                so.name ILIKE '%' || $${params.length} || '%' OR 
                so.inn ILIKE '%' || $${params.length} || '%'
            )`;
        }

        const query = `
            WITH data AS (
                SELECT 
                    d.id, 
                    d.doc_num,
                    TO_CHAR(d.doc_date, 'YYYY-MM-DD') AS doc_date,
                    (
                        SELECT 
                            COALESCE(SUM(ch.summa), 0.0)::FLOAT
                            FROM kassa_prixod_child AS ch
                            WHERE  ch.kassa_prixod_id = d.id
                                AND ch.isdeleted = false
                    ) AS prixod_sum,
                    0::FLOAT AS rasxod_sum,
                    d.id_podotchet_litso,
                    p.name AS spravochnik_podotchet_litso_name,
                    d.opisanie,
                    d.doc_date AS combined_date,
                    u.login,
                    u.fio,
                    u.id AS user_id,
                    (
                        SELECT ARRAY_AGG(row_to_json(ch))
                        FROM (
                            SELECT 
                                op.schet AS provodki_schet,
                                op.sub_schet AS provodki_sub_schet
                            FROM kassa_prixod_child AS ch
                            JOIN spravochnik_operatsii AS op ON op.id = ch.spravochnik_operatsii_id
                            WHERE  ch.kassa_prixod_id = d.id
                                AND ch.isdeleted = false
                        ) AS ch
                    ) AS provodki_array
                FROM kassa_prixod d
                JOIN users u ON d.user_id = u.id
                JOIN regions r ON u.region_id = r.id
                LEFT JOIN spravochnik_podotchet_litso p ON p.id = d.id_podotchet_litso
                WHERE r.id = $1 
                  AND d.main_schet_id = $2
                  AND d.doc_date BETWEEN $3 AND $4 
                  AND d.isdeleted = false
                  ${search_filter}

                UNION ALL

                SELECT 
                    d.id, 
                    d.doc_num,
                    TO_CHAR(d.doc_date, 'YYYY-MM-DD') AS doc_date,
                    0::FLOAT AS prixod_sum,
                    (
                        SELECT 
                            COALESCE(SUM(ch.summa), 0)::FLOAT
                        FROM kassa_rasxod_child AS ch
                        WHERE ch.kassa_rasxod_id = d.id
                            AND ch.isdeleted = false
                    ) AS rasxod_sum,
                    d.id_podotchet_litso,
                    p.name,
                    d.opisanie,
                    d.doc_date AS combined_date,
                    u.login,
                    u.fio,
                    u.id AS user_id,
                    (
                        SELECT ARRAY_AGG(row_to_json(ch))
                        FROM (
                            SELECT 
                                op.schet AS provodki_schet,
                                op.sub_schet AS provodki_sub_schet
                            FROM kassa_rasxod_child AS ch
                            JOIN spravochnik_operatsii AS op ON op.id = ch.spravochnik_operatsii_id
                            WHERE  ch.kassa_rasxod_id = d.id
                                AND ch.isdeleted = false  
                        ) AS ch
                    ) AS provodki_array
                FROM kassa_rasxod d
                JOIN users u ON d.user_id = u.id
                JOIN regions r ON u.region_id = r.id
                LEFT JOIN spravochnik_podotchet_litso p ON p.id = d.id_podotchet_litso
                WHERE r.id = $1 
                  AND d.main_schet_id = $2
                  AND d.doc_date BETWEEN $3 AND $4 
                  AND d.isdeleted = false
                  ${search_filter}
                
                ORDER BY combined_date
                OFFSET $5 LIMIT $6
            ) 
            SELECT 
                ARRAY_AGG(row_to_json(data)) AS data,
                ( 
                    (
                        SELECT 
                            COALESCE(COUNT(d.id), 0) 
                        FROM kassa_rasxod d
                        JOIN users u ON d.user_id = u.id
                        JOIN regions r ON u.region_id = r.id
                        LEFT JOIN spravochnik_podotchet_litso p ON p.id = d.id_podotchet_litso
                        WHERE r.id = $1 
                            AND d.main_schet_id = $2 
                            AND d.doc_date BETWEEN $3 AND $4 
                            AND d.isdeleted = false
                            ${search_filter}
                    ) +
                    (
                        SELECT 
                            COALESCE(COUNT(d.id), 0) 
                        FROM kassa_prixod d
                        JOIN users u ON d.user_id = u.id
                        JOIN regions r ON u.region_id = r.id
                        LEFT JOIN spravochnik_podotchet_litso p ON p.id = d.id_podotchet_litso
                        WHERE r.id = $1 
                            AND d.main_schet_id = $2 
                            AND d.doc_date BETWEEN $3 AND $4 
                            AND d.isdeleted = false
                            ${search_filter}
                    )
                )::INTEGER AS total_count,
                (
                    SELECT 
                        COALESCE(SUM(ch.summa), 0) 
                    FROM kassa_rasxod d
                    JOIN kassa_rasxod_child ch ON ch.kassa_rasxod_id = d.id
                    JOIN users u ON d.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    LEFT JOIN spravochnik_podotchet_litso p ON p.id = d.id_podotchet_litso
                    WHERE r.id = $1 
                        AND d.main_schet_id = $2 
                        AND d.doc_date BETWEEN $3 AND $4 
                        AND d.isdeleted = false
                        AND ch.isdeleted = false
                        ${search_filter}
                )::FLOAT AS rasxod,
                (
                    SELECT 
                        COALESCE(SUM(ch.summa), 0) 
                    FROM kassa_prixod d
                    JOIN kassa_prixod_child ch ON ch.kassa_prixod_id = d.id
                    JOIN users u ON d.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    LEFT JOIN spravochnik_podotchet_litso p ON p.id = d.id_podotchet_litso
                    WHERE r.id = $1 
                        AND d.main_schet_id = $2 
                        AND d.doc_date BETWEEN $3 AND $4 
                        AND d.isdeleted = false
                        AND ch.isdeleted = false
                        ${search_filter}
                )
                        
            FROM data
        `;

        const result = await db.query(query, params);

        return { data: result[0].data || [], total_count: result[0].total_count };
    };

    static async getSumma(params, operator) {
        const query = `
            WITH prixod AS (
                SELECT 
                    COALESCE(SUM(ch.summa), 0)::FLOAT AS summa
                FROM kassa_prixod d
                JOIN kassa_prixod_child ch ON ch.kassa_prixod_id = d.id
                JOIN users u ON d.user_id = u.id
                JOIN regions r ON u.region_id = r.id
                WHERE r.id = $1 
                    AND d.main_schet_id = $2 
                    AND d.doc_date ${operator} $3 
                    AND d.isdeleted = false
                    AND ch.isdeleted = false
            ), 
            rasxod AS (
                SELECT 
                    COALESCE(SUM(ch.summa), 0)::FLOAT AS summa
                FROM kassa_rasxod d
                JOIN kassa_rasxod_child ch ON ch.kassa_rasxod_id = d.id
                JOIN users u ON d.user_id = u.id
                JOIN regions r ON u.region_id = r.id
                WHERE r.id = $1 
                    AND d.main_schet_id = $2 
                    AND d.doc_date ${operator} $3 
                    AND d.isdeleted = false
                    AND ch.isdeleted = false
            )
            SELECT 
                prixod.summa AS prixod_summa,
                rasxod.summa AS rasxod_summa,
                (prixod.summa - rasxod.summa) AS summa
            FROM prixod, rasxod;
        `;

        const result = await db.query(query, params);

        return result[0];
    }

    static async daily(params) {
        const query = `
            SELECT 
                op.schet,
                ARRAY_AGG(
                    json_build_object(
                        'doc_num', d.doc_num, 
                        'doc_date', d.doc_date,
                        'spravochnik_podotchet_litso_name', s_p_l.name,
                        'opisanie', d.opisanie,
                        'schet', op.schet,
                        'prixod_sum', ch.summa,
                        'rasxod_sum', 0
                    )
                ) AS docs,
                COALESCE(SUM(ch.summa), 0) AS prixod_sum,
                0 AS rasxod_sum
            FROM spravochnik_operatsii AS op
            JOIN kassa_prixod_child AS ch ON ch.spravochnik_operatsii_id = op.id
            JOIN kassa_prixod AS d ON d.id = ch.kassa_prixod_id
            LEFT JOIN spravochnik_podotchet_litso AS s_p_l ON d.id_podotchet_litso = s_p_l.id
            JOIN users AS u ON u.id = d.user_id
            JOIN regions AS r ON r.id = u.region_id 
            WHERE r.id = $4 
                AND d.doc_date BETWEEN $2 AND $3 
                AND d.main_schet_id = $1 
                AND d.isdeleted = false
                AND ch.isdeleted = false

            GROUP BY op.schet
            
            UNION ALL 
            
            SELECT 
                op.schet,
                ARRAY_AGG(
                    json_build_object(
                        'doc_num', d.doc_num, 
                        'doc_date', d.doc_date,
                        'spravochnik_podotchet_litso_name', s_p_l.name,
                        'opisanie', d.opisanie,
                        'schet', op.schet,
                        'prixod_sum', 0,
                        'rasxod_sum', ch.summa
                    )
                ) AS docs,
                0 AS prixod_sum,
                COALESCE(SUM(ch.summa), 0) AS rasxod_sum
            FROM spravochnik_operatsii AS op
            JOIN kassa_rasxod_child AS ch ON ch.spravochnik_operatsii_id = op.id
            JOIN kassa_rasxod AS d ON d.id = ch.kassa_rasxod_id
            LEFT JOIN spravochnik_podotchet_litso AS s_p_l ON d.id_podotchet_litso = s_p_l.id
            JOIN users AS u ON u.id = d.user_id
            JOIN regions AS r ON r.id = u.region_id 
            WHERE r.id = $4 
                AND d.doc_date BETWEEN $2 AND $3 
                AND d.main_schet_id = $1 
                AND d.isdeleted = false
                AND ch.isdeleted = false
            GROUP BY op.schet
        `;

        const result = await db.query(query, params);

        return result;
    }

    static async dailySumma(params, operator) {
        const query = `
            WITH prixod AS (
                SELECT 
                    COALESCE(SUM(ch.summa), 0) AS summa
                FROM spravochnik_operatsii AS op
                JOIN kassa_prixod_child AS ch ON ch.spravochnik_operatsii_id = op.id
                JOIN kassa_prixod AS d ON d.id = ch.kassa_prixod_id
                JOIN users AS u ON u.id = d.user_id
                JOIN regions AS r ON r.id = u.region_id 
                WHERE r.id = $1 
                    AND d.main_schet_id = $2 
                    AND d.doc_date ${operator} $3 
                    AND d.isdeleted = false
                    AND ch.isdeleted = false
            ), 
            rasxod AS (
                SELECT 
                    COALESCE(SUM(ch.summa), 0) AS summa
                FROM spravochnik_operatsii AS op
                JOIN kassa_rasxod_child AS ch ON ch.spravochnik_operatsii_id = op.id
                JOIN kassa_rasxod AS d ON d.id = ch.kassa_rasxod_id
                JOIN users AS u ON u.id = d.user_id
                JOIN regions AS r ON r.id = u.region_id
                WHERE r.id = $1 
                    AND d.main_schet_id = $2 
                    AND d.doc_date ${operator} $3 
                    AND d.isdeleted = false
                    AND ch.isdeleted = false
            )
            SELECT 
                prixod.summa AS prixod_summa,
                rasxod.summa AS rasxod_summa,
                (prixod.summa - rasxod.summa) AS summa
            FROM prixod, rasxod
        `;

        const result = await db.query(query, params);

        return result[0].summa;
    }

    static async getSchets(params) {
        const query = `
            SELECT 
                DISTINCT schet 
            FROM (
                SELECT 
                    op.schet
                FROM kassa_prixod d
                JOIN users AS u ON u.id = d.user_id
                JOIN regions AS r ON r.id = u.region_id
                JOIN kassa_prixod_child AS ch ON d.id = ch.kassa_prixod_id 
                JOIN spravochnik_operatsii AS op ON op.id = ch.spravochnik_operatsii_id
                WHERE r.id = $1 
                    AND d.main_schet_id = $2 
                    AND d.doc_date BETWEEN $3 AND $4 
                    AND d.isdeleted = false
                    AND ch.isdeleted = false
                
                UNION ALL
            
                SELECT 
                    op.schet
                FROM kassa_rasxod d
                JOIN users AS u ON u.id = d.user_id
                JOIN regions AS r ON r.id = u.region_id
                JOIN kassa_rasxod_child AS ch ON d.id = ch.kassa_rasxod_id 
                JOIN spravochnik_operatsii AS op ON op.id = ch.spravochnik_operatsii_id
                WHERE r.id = $1 
                    AND d.main_schet_id = $2 
                    AND d.doc_date BETWEEN $3 AND $4 
                    AND d.isdeleted = false
                    AND ch.isdeleted = false
            )
        `;
        const result = await db.query(query, params);

        return result;
    }

    static async getSummaSchet(params) {
        const query = `
            WITH prixod AS (
                SELECT 
                    COALESCE(SUM(ch.summa), 0)::FLOAT AS summa 
                FROM kassa_prixod d
                JOIN users AS u ON u.id = d.user_id
                JOIN regions AS r ON r.id = u.region_id
                JOIN kassa_prixod_child AS ch ON d.id = ch.kassa_prixod_id 
                JOIN spravochnik_operatsii AS op ON op.id = ch.spravochnik_operatsii_id
                WHERE r.id = $1 
                    AND d.main_schet_id = $2 
                    AND d.doc_date BETWEEN $3 AND $4
                    AND d.isdeleted = false
                    AND op.schet = $5
                    AND ch.isdeleted = false
            ), 
            rasxod AS (
                SELECT 
                    COALESCE(SUM(ch.summa), 0)::FLOAT AS summa 
                FROM kassa_rasxod d
                JOIN users AS u ON u.id = d.user_id
                JOIN regions AS r ON r.id = u.region_id
                JOIN kassa_rasxod_child AS ch ON d.id = ch.kassa_rasxod_id 
                JOIN spravochnik_operatsii AS op ON op.id = ch.spravochnik_operatsii_id
                WHERE r.id = $1 
                    AND d.main_schet_id = $2 
                    AND d.doc_date BETWEEN $3 AND $4 
                    AND d.isdeleted = false
                    AND op.schet = $5
                    AND ch.isdeleted = false
            )
            SELECT 
                rasxod.summa AS rasxod_sum,
                prixod.summa AS prixod_sum
            FROM rasxod
            CROSS JOIN prixod;
        `;

        const result = await db.query(query, params);

        return result[0];
    }
}