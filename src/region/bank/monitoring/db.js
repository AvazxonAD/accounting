const { db } = require('@db/index');

exports.BankMonitoringDB = class {
    static async get(params, search = null) {
        let search_filter = ``;
        if (search) {
            params.push(search);
            search_filter = ` AND (
                d.doc_num = $${params.length} OR 
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
                            COALESCE(SUM(ch.summa), 0::NUMERIC)
                        FROM bank_prixod_child AS ch
                        WHERE  ch.id_bank_prixod = d.id 
                            AND ch.isdeleted = false
                    ) AS prixod_sum,
                    0 AS rasxod_sum,
                    d.id_spravochnik_organization,
                    so.name AS spravochnik_organization_name,
                    so.raschet_schet AS spravochnik_organization_raschet_schet,
                    so.inn AS spravochnik_organization_inn,
                    d.id_shartnomalar_organization,
                    so2.doc_num AS shartnomalar_doc_num,
                    TO_CHAR(so2.doc_date, 'YYYY-MM-DD') AS shartnomalar_doc_date,
                    d.opisanie,
                    d.doc_date AS combined_date,
                    u.login,
                    u.fio,
                    u.id AS user_id,
                    (
                        SELECT JSON_AGG(row_to_json(ch))
                        FROM (
                            SELECT 
                                s_o.schet AS provodki_schet,
                                s_o.sub_schet AS provodki_sub_schet
                            FROM bank_prixod_child AS ch
                            JOIN spravochnik_operatsii AS s_o ON s_o.id = ch.spravochnik_operatsii_id
                            WHERE  ch.id_bank_prixod = d.id AND ch.isdeleted = false 
                        ) AS ch
                    ) AS provodki_array,
                    'prixod' AS type
                FROM bank_prixod d
                JOIN users u ON d.user_id = u.id
                JOIN regions r ON u.region_id = r.id
                JOIN spravochnik_organization so ON d.id_spravochnik_organization = so.id
                LEFT JOIN shartnomalar_organization so2 ON d.id_shartnomalar_organization = so2.id
                WHERE r.id = $1 
                    AND d.main_schet_id = $2 
                    AND d.isdeleted = false 
                    AND d.doc_date BETWEEN $3 AND $4
                    ${search_filter}
                
                UNION ALL
                
                SELECT 
                    d.id, 
                    d.doc_num,
                    TO_CHAR(d.doc_date, 'YYYY-MM-DD') AS doc_date,
                    0 AS prixod_sum,
                    (
                        SELECT 
                            COALESCE(SUM(ch.summa), 0::NUMERIC)
                        FROM bank_rasxod_child AS ch
                        WHERE  ch.id_bank_rasxod = d.id AND ch.isdeleted = false
                    ) AS rasxod_sum,
                    d.id_spravochnik_organization,
                    so.name AS spravochnik_organization_name,
                    so.raschet_schet AS spravochnik_organization_raschet_schet,
                    so.inn AS spravochnik_organization_inn,
                    d.id_shartnomalar_organization,
                    so2.doc_num AS shartnomalar_doc_num,
                    TO_CHAR(so2.doc_date, 'YYYY-MM-DD') AS shartnomalar_doc_date,
                    d.opisanie,
                    d.doc_date AS combined_date,
                    u.login,
                    u.fio,
                    u.id AS user_id,
                    (
                        SELECT JSON_AGG(row_to_json(ch))
                        FROM (
                            SELECT 
                                s_o.schet AS provodki_schet,
                                s_o.sub_schet AS provodki_sub_schet
                            FROM bank_rasxod_child AS ch
                            JOIN spravochnik_operatsii AS s_o ON s_o.id = ch.spravochnik_operatsii_id
                            WHERE  ch.id_bank_rasxod = d.id AND ch.isdeleted = false 
                        ) AS ch
                    ) AS provodki_array,
                    'rasxod' AS type
                FROM bank_rasxod d
                JOIN users u ON d.user_id = u.id
                JOIN regions r ON u.region_id = r.id
                JOIN spravochnik_organization so ON d.id_spravochnik_organization = so.id
                LEFT JOIN shartnomalar_organization so2 ON d.id_shartnomalar_organization = so2.id
                WHERE r.id = $1 
                    AND d.main_schet_id = $2 
                    AND d.isdeleted = false
                    AND d.doc_date BETWEEN $3 AND $4
                    ${search_filter}
                    
                ORDER BY combined_date
                OFFSET $5 LIMIT $6
            )
            SELECT 
                (
                    (
                        SELECT 
                            COALESCE(COUNT(d.id), 0) 
                        FROM bank_rasxod d
                        JOIN users u ON d.user_id = u.id
                        JOIN regions r ON u.region_id = r.id
                        JOIN spravochnik_organization so ON d.id_spravochnik_organization = so.id
                        WHERE r.id = $1 
                            AND d.main_schet_id = $2 
                            AND d.isdeleted = false
                            AND d.doc_date BETWEEN $3 AND $4
                            ${search_filter}
                    ) +
                    (
                        SELECT 
                            COALESCE(COUNT(d.id), 0)
                        FROM bank_prixod d
                        JOIN users u ON d.user_id = u.id
                        JOIN regions r ON u.region_id = r.id
                        JOIN spravochnik_organization so ON d.id_spravochnik_organization = so.id
                        WHERE r.id = $1  
                            AND d.main_schet_id = $2 
                            AND d.isdeleted = false
                            AND d.doc_date BETWEEN $3 AND $4
                            ${search_filter}
                    )   
                )::INTEGER AS total_count,
                (
                    SELECT 
                        COALESCE(SUM(ch.summa), 0)
                    FROM bank_prixod d
                    JOIN bank_prixod_child ch ON ch.id_bank_prixod = d.id
                    JOIN users u ON d.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    JOIN spravochnik_organization so ON d.id_spravochnik_organization = so.id
                    WHERE r.id = $1 
                        AND d.main_schet_id = $2 
                        AND d.isdeleted = false
                        AND d.doc_date BETWEEN $3 AND $4
                        ${search_filter}
                        AND ch.isdeleted = false
                )::FLOAT AS prixod_sum,
                (
                    SELECT 
                        COALESCE(SUM(ch.summa), 0)
                    FROM bank_rasxod d
                    JOIN bank_rasxod_child ch ON ch.id_bank_rasxod = d.id
                    JOIN users u ON d.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    JOIN spravochnik_organization so ON d.id_spravochnik_organization = so.id
                    WHERE r.id = $1 
                        AND d.main_schet_id = $2 
                        AND d.isdeleted = false
                        AND d.doc_date BETWEEN $3 AND $4
                        ${search_filter}
                        AND ch.isdeleted = false
                )::FLOAT AS rasxod_sum,
                COALESCE( JSON_AGG( row_to_json( data ) ), '[]'::JSON ) AS data
            FROM data
        `;

        const result = await db.query(query, params);

        return result[0];
    };

    static async daily(params) {
        const query = `
            SELECT 
                s_o.schet,
                JSON_AGG(
                    json_build_object(
                        'doc_num', d.doc_num, 
                        'doc_date', d.doc_date,
                        'opisanie', d.opisanie,
                        'schet', s_o.schet,
                        'prixod_sum', ch.summa,
                        'rasxod_sum', 0
                    )
                ) AS docs,
                COALESCE(SUM(ch.summa), 0) AS prixod_sum,
                0 AS rasxod_sum
            FROM spravochnik_operatsii AS s_o
            JOIN bank_prixod_child AS ch ON ch.spravochnik_operatsii_id = s_o.id
            JOIN bank_prixod AS d ON d.id = ch.id_bank_prixod
            JOIN users AS u ON u.id = d.user_id
            JOIN regions AS r ON r.id = u.region_id 
            WHERE r.id = $4 
                AND d.doc_date BETWEEN $2 AND $3 
                AND d.main_schet_id = $1 
                AND d.isdeleted = false
                AND ch.isdeleted = false
            GROUP BY s_o.schet
            
            UNION ALL 
            
            SELECT 
                s_o.schet,
                JSON_AGG(
                    json_build_object(
                        'doc_num', d.doc_num, 
                        'doc_date', d.doc_date,
                        'opisanie', d.opisanie,
                        'schet', s_o.schet,
                        'prixod_sum', 0,
                        'rasxod_sum', ch.summa
                    )
                ) AS docs,
                0 AS prixod_sum,
                COALESCE(SUM(ch.summa), 0) AS rasxod_sum
            FROM spravochnik_operatsii AS s_o
            JOIN bank_rasxod_child AS ch ON ch.spravochnik_operatsii_id = s_o.id
            JOIN bank_rasxod AS d ON d.id = ch.id_bank_rasxod
            JOIN users AS u ON u.id = d.user_id
            JOIN regions AS r ON r.id = u.region_id 
            WHERE r.id = $4 
                AND d.doc_date BETWEEN $2 AND $3 
                AND d.main_schet_id = $1 
                AND d.isdeleted = false
                AND ch.isdeleted = false
            GROUP BY s_o.schet
        `;

        const result = await db.query(query, params);

        return result;
    }

    static async dailySumma(params, operator) {
        const query = `
            WITH prixod AS (
                SELECT 
                    COALESCE(SUM(ch.summa), 0) AS summa
                FROM spravochnik_operatsii AS s_o
                JOIN bank_prixod_child AS ch ON ch.spravochnik_operatsii_id = s_o.id
                JOIN bank_prixod AS d ON d.id = ch.id_bank_prixod
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
                FROM spravochnik_operatsii AS s_o
                JOIN bank_rasxod_child AS ch ON ch.spravochnik_operatsii_id = s_o.id
                JOIN bank_rasxod AS d ON d.id = ch.id_bank_rasxod
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

    static async getSumma(params, operator, search) {
        let search_filter = ``;
        if (search) {
            params.push(search);
            search_filter = ` AND (
                d.doc_num = $${params.length} OR 
                so.inn ILIKE '%' || $${params.length} || '%'
            )`;
        }

        const query = `
            WITH prixod AS (
                SELECT 
                    COALESCE(SUM(ch.summa), 0)::FLOAT AS summa
                FROM bank_prixod d
                JOIN bank_prixod_child ch ON ch.id_bank_prixod = d.id 
                JOIN users u ON d.user_id = u.id
                JOIN regions r ON u.region_id = r.id
                JOIN spravochnik_organization so ON d.id_spravochnik_organization = so.id
                WHERE r.id = $1 
                    AND d.isdeleted = false
                    AND ch.isdeleted = false
                    AND d.main_schet_id = $2 
                    AND d.doc_date ${operator} $3
                    ${search_filter} 
            ), 
            rasxod AS (
                SELECT 
                    COALESCE(SUM(ch.summa), 0)::FLOAT AS summa
                FROM bank_rasxod d
                JOIN bank_rasxod_child ch ON ch.id_bank_rasxod = d.id
                JOIN users u ON d.user_id = u.id
                JOIN regions r ON u.region_id = r.id
                JOIN spravochnik_organization so ON d.id_spravochnik_organization = so.id
                WHERE r.id = $1 
                    AND d.isdeleted = false
                    AND ch.isdeleted = false
                    AND d.main_schet_id = $2 
                    AND d.doc_date ${operator} $3
                    ${search_filter} 
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

    static async getSchets(params) {
        const query = `
            SELECT 
                DISTINCT schet 
            FROM (
                SELECT 
                    s_o.schet
                FROM bank_prixod d
                JOIN users AS u ON u.id = d.user_id
                JOIN regions AS r ON r.id = u.region_id
                JOIN bank_prixod_child AS ch ON d.id = ch.id_bank_prixod 
                JOIN spravochnik_operatsii AS s_o ON s_o.id = ch.spravochnik_operatsii_id
                WHERE r.id = $1 
                    AND d.main_schet_id = $2 
                    AND d.doc_date BETWEEN $3 AND $4 
                    AND d.isdeleted = false
                    AND ch.isdeleted = false
                
                UNION ALL
            
                SELECT 
                    s_o.schet
                FROM bank_rasxod d
                JOIN users AS u ON u.id = d.user_id
                JOIN regions AS r ON r.id = u.region_id
                JOIN bank_rasxod_child AS ch ON d.id = ch.id_bank_rasxod 
                JOIN spravochnik_operatsii AS s_o ON s_o.id = ch.spravochnik_operatsii_id
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
                FROM bank_prixod d
                JOIN users AS u ON u.id = d.user_id
                JOIN regions AS r ON r.id = u.region_id
                JOIN bank_prixod_child AS ch ON d.id = ch.id_bank_prixod 
                JOIN spravochnik_operatsii AS s_o ON s_o.id = ch.spravochnik_operatsii_id
                WHERE r.id = $1 
                    AND d.main_schet_id = $2 
                    AND d.doc_date BETWEEN $3 AND $4
                    AND d.isdeleted = false
                    AND s_o.schet = $5
                    AND ch.isdeleted = false
            ), 
            rasxod AS (
                SELECT 
                    COALESCE(SUM(ch.summa), 0)::FLOAT AS summa 
                FROM bank_rasxod d
                JOIN users AS u ON u.id = d.user_id
                JOIN regions AS r ON r.id = u.region_id
                JOIN bank_rasxod_child AS ch ON d.id = ch.id_bank_rasxod 
                JOIN spravochnik_operatsii AS s_o ON s_o.id = ch.spravochnik_operatsii_id
                WHERE r.id = $1 
                    AND d.main_schet_id = $2 
                    AND d.doc_date BETWEEN $3 AND $4 
                    AND d.isdeleted = false
                    AND s_o.schet = $5
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