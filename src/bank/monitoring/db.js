const { db } = require('../../db/index');

exports.BankMonitoringDB = class {
    static async get(params) {
        const query = `
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
                    bp.doc_date AS combined_date,
                    u.login,
                    u.fio,
                    u.id AS user_id,
                    (
                        SELECT ARRAY_AGG(row_to_json(ch))
                        FROM (
                            SELECT 
                                s_o.schet AS provodki_schet,
                                s_o.sub_schet AS provodki_sub_schet
                            FROM bank_prixod_child AS ch
                            JOIN spravochnik_operatsii AS s_o ON s_o.id = ch.spravochnik_operatsii_id
                            WHERE  ch.id_bank_prixod = bp.id AND ch.isdeleted = false 
                        ) AS ch
                    ) AS provodki_array
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
                    br.doc_date AS combined_date,
                    u.login,
                    u.fio,
                    u.id AS user_id,
                    (
                        SELECT ARRAY_AGG(row_to_json(ch))
                        FROM (
                            SELECT 
                                s_o.schet AS provodki_schet,
                                s_o.sub_schet AS provodki_sub_schet
                            FROM bank_rasxod_child AS ch
                            JOIN spravochnik_operatsii AS s_o ON s_o.id = ch.spravochnik_operatsii_id
                            WHERE  ch.id_bank_rasxod = br.id AND ch.isdeleted = false 
                        ) AS ch
                    ) AS provodki_array
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
                (
                    (
                        SELECT 
                            COALESCE(COUNT(br.id), 0) 
                        FROM bank_rasxod br
                        JOIN users u ON br.user_id = u.id
                        JOIN regions r ON u.region_id = r.id
                        WHERE r.id = $1 
                            AND br.main_schet_id = $2 
                            AND br.isdeleted = false
                            AND br.doc_date BETWEEN $3 AND $4
                    ) +
                    (
                        SELECT 
                            COALESCE(COUNT(bp.id), 0)
                        FROM bank_prixod bp
                        JOIN users u ON bp.user_id = u.id
                        JOIN regions r ON u.region_id = r.id
                        WHERE r.id = $1  
                            AND bp.main_schet_id = $2 
                            AND bp.isdeleted = false
                            AND bp.doc_date BETWEEN $3 AND $4
                    )   
                )::INTEGER AS total_count,
                (
                    SELECT 
                        COALESCE(SUM(bp.summa), 0)
                    FROM bank_prixod bp
                    JOIN users u ON bp.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    WHERE r.id = $1 
                        AND bp.main_schet_id = $2 
                        AND bp.isdeleted = false
                        AND bp.doc_date BETWEEN $3 AND $4
                )::FLOAT AS prixod_sum,
                (
                    SELECT 
                        COALESCE(SUM(br.summa), 0)
                    FROM bank_rasxod br
                    JOIN users u ON br.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    WHERE r.id = $1 
                        AND br.main_schet_id = $2 
                        AND br.isdeleted = false
                        AND br.doc_date BETWEEN $3 AND $4
                )::FLOAT AS rasxod_sum,
                ARRAY_AGG(row_to_json(data)) AS data
            FROM data
        `;

        const result = await db.query(query, params);

        return { data: result[0].data || [], total_count: result[0].total_count };
    };

    static async getSumma(params, operator) {
        const query = `
            WITH prixod AS (
                SELECT 
                    COALESCE(SUM(bp.summa), 0)::FLOAT AS summa
                FROM bank_prixod bp
                JOIN users u ON bp.user_id = u.id
                JOIN regions r ON u.region_id = r.id
                WHERE r.id = $1 
                    AND bp.isdeleted = false
                    AND bp.main_schet_id = $2 
                    AND bp.doc_date ${operator} $3 
            ), 
            rasxod AS (
                SELECT 
                    COALESCE(SUM(br.summa), 0)::FLOAT AS summa
                FROM bank_rasxod br
                JOIN users u ON br.user_id = u.id
                JOIN regions r ON u.region_id = r.id
                WHERE r.id = $1 
                    AND br.isdeleted = false
                    AND br.main_schet_id = $2 
                    AND br.doc_date ${operator} $3 
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

    static async cap(params) {
        const qeury = `
            WITH data AS (
                SELECT 
                    s_o.schet, 
                    COALESCE(SUM(k_p_ch.summa), 0)::FLOAT AS prixod_sum, 
                    0 AS rasxod_sum 
                FROM bank_prixod bp
                JOIN users AS u ON u.id = bp.user_id
                JOIN regions AS r ON r.id = u.region_id
                JOIN bank_prixod_child AS k_p_ch ON bp.id = k_p_ch.id_bank_prixod 
                JOIN spravochnik_operatsii AS s_o ON s_o.id = k_p_ch.spravochnik_operatsii_id
                WHERE r.id = $1 
                    AND bp.main_schet_id = $2 
                    AND bp.doc_date BETWEEN $3 AND $4 
                    AND bp.isdeleted = false
                GROUP BY s_o.schet
                
                UNION ALL 
                
                SELECT 
                    s_o.schet, 
                    0 AS prixod_sum, 
                    SUM(k_r_ch.summa)::FLOAT AS rasxod_sum 
                FROM bank_rasxod br
                JOIN users AS u ON u.id = br.user_id
                JOIN regions AS r ON r.id = u.region_id
                JOIN bank_rasxod_child AS k_r_ch ON br.id = k_r_ch.id_bank_rasxod 
                JOIN spravochnik_operatsii AS s_o ON s_o.id = k_r_ch.spravochnik_operatsii_id
                WHERE r.id = $1 
                    AND br.main_schet_id = $2 
                    AND br.doc_date BETWEEN $3 AND $4 
                    AND br.isdeleted = false
                GROUP BY s_o.schet
            )
            SELECT 
                ARRAY_AGG(row_to_json(data)) AS data,
                (
                    (
                        SELECT
                            COALESCE(SUM(k_p_ch.summa), 0)
                        FROM bank_prixod bp
                        JOIN users AS u ON u.id = bp.user_id
                        JOIN regions AS r ON r.id = u.region_id
                        JOIN bank_prixod_child AS k_p_ch ON bp.id = k_p_ch.id_bank_prixod 
                        JOIN spravochnik_operatsii AS s_o ON s_o.id = k_p_ch.spravochnik_operatsii_id
                        WHERE r.id = $1 
                            AND bp.main_schet_id = $2 
                            AND bp.doc_date < $3 
                            AND bp.isdeleted = false
                    ) -
                    (
                        SELECT
                            COALESCE(SUM(k_r_ch.summa), 0) 
                        FROM bank_rasxod br
                        JOIN users AS u ON u.id = br.user_id
                        JOIN regions AS r ON r.id = u.region_id
                        JOIN bank_rasxod_child AS k_r_ch ON br.id = k_r_ch.id_bank_rasxod 
                        JOIN spravochnik_operatsii AS s_o ON s_o.id = k_r_ch.spravochnik_operatsii_id
                        WHERE r.id = $1 
                            AND br.main_schet_id = $2 
                            AND br.doc_date < $3 
                            AND br.isdeleted = false
                    )
                )::FLOAT AS balance_from,
                (
                    (
                        SELECT
                            COALESCE(SUM(k_p_ch.summa), 0)
                        FROM bank_prixod bp
                        JOIN users AS u ON u.id = bp.user_id
                        JOIN regions AS r ON r.id = u.region_id
                        JOIN bank_prixod_child AS k_p_ch ON bp.id = k_p_ch.id_bank_prixod 
                        JOIN spravochnik_operatsii AS s_o ON s_o.id = k_p_ch.spravochnik_operatsii_id
                        WHERE r.id = $1 
                            AND bp.main_schet_id = $2 
                            AND bp.doc_date <= $4 
                            AND bp.isdeleted = false
                    ) -
                    (
                        SELECT
                            COALESCE(SUM(k_r_ch.summa), 0) 
                        FROM bank_rasxod br
                        JOIN users AS u ON u.id = br.user_id
                        JOIN regions AS r ON r.id = u.region_id
                        JOIN bank_rasxod_child AS k_r_ch ON br.id = k_r_ch.id_bank_rasxod 
                        JOIN spravochnik_operatsii AS s_o ON s_o.id = k_r_ch.spravochnik_operatsii_id
                        WHERE r.id = $1 
                            AND br.main_schet_id = $2 
                            AND br.doc_date <= $4 
                            AND br.isdeleted = false
                    ) 
                )::FLOAT AS balance_to
            FROM data
        `;

        const result = await db.query(qeury, params);

        let prixod_sum = 0
        let rasxod_sum = 0
        result[0].data?.forEach(item => {
            prixod_sum += item.prixod_sum
            rasxod_sum += item.rasxod_sum
        })
        return { prixod_sum, rasxod_sum, data: result[0]?.data || [], balance_from: result[0].balance_from, balance_to: result[0]?.balance_to }
    }

    static async daily(params) {
        const query = `
            SELECT 
                s_o.schet,
                ARRAY_AGG(
                    json_build_object(
                        'doc_num', bp.doc_num, 
                        'doc_date', bp.doc_date,
                        'opisanie', bp.opisanie,
                        'schet', s_o.schet,
                        'prixod_sum', k_p_ch.summa,
                        'rasxod_sum', 0
                    )
                ) AS docs,
                COALESCE(SUM(k_p_ch.summa), 0) AS prixod_sum,
                0 AS rasxod_sum
            FROM spravochnik_operatsii AS s_o
            JOIN bank_prixod_child AS k_p_ch ON k_p_ch.spravochnik_operatsii_id = s_o.id
            JOIN bank_prixod AS bp ON bp.id = k_p_ch.id_bank_prixod
            JOIN users AS u ON u.id = bp.user_id
            JOIN regions AS r ON r.id = u.region_id 
            WHERE r.id = $4 AND bp.doc_date BETWEEN $2 AND $3 AND bp.main_schet_id = $1 AND bp.isdeleted = false
            GROUP BY s_o.schet
            
            UNION ALL 
            
            SELECT 
                s_o.schet,
                ARRAY_AGG(
                    json_build_object(
                        'doc_num', br.doc_num, 
                        'doc_date', br.doc_date,
                        'opisanie', br.opisanie,
                        'schet', s_o.schet,
                        'prixod_sum', 0,
                        'rasxod_sum', k_r_ch.summa
                    )
                ) AS docs,
                0 AS prixod_sum,
                COALESCE(SUM(k_r_ch.summa), 0) AS rasxod_sum
            FROM spravochnik_operatsii AS s_o
            JOIN bank_rasxod_child AS k_r_ch ON k_r_ch.spravochnik_operatsii_id = s_o.id
            JOIN bank_rasxod AS br ON br.id = k_r_ch.id_bank_rasxod
            JOIN users AS u ON u.id = br.user_id
            JOIN regions AS r ON r.id = u.region_id 
            WHERE r.id = $4 AND br.doc_date BETWEEN $2 AND $3 AND br.main_schet_id = $1 AND br.isdeleted = false
            GROUP BY s_o.schet
        `;

        const result = await db.query(query, params);

        return result;
    }

    static async dailySumma(params, operator) {
        const query = `
            WITH prixod AS (
                SELECT 
                    COALESCE(SUM(k_p_ch.summa), 0) AS summa
                FROM spravochnik_operatsii AS s_o
                JOIN bank_prixod_child AS k_p_ch ON k_p_ch.spravochnik_operatsii_id = s_o.id
                JOIN bank_prixod AS bp ON bp.id = k_p_ch.id_bank_prixod
                JOIN users AS u ON u.id = bp.user_id
                JOIN regions AS r ON r.id = u.region_id 
                WHERE r.id = $1 
                    AND bp.main_schet_id = $2 
                    AND bp.doc_date ${operator} $3 
                    AND bp.isdeleted = false
            ), 
            rasxod AS (
                SELECT 
                    COALESCE(SUM(k_r_ch.summa), 0) AS summa
                FROM spravochnik_operatsii AS s_o
                JOIN bank_rasxod_child AS k_r_ch ON k_r_ch.spravochnik_operatsii_id = s_o.id
                JOIN bank_rasxod AS br ON br.id = k_r_ch.id_bank_rasxod
                JOIN users AS u ON u.id = br.user_id
                JOIN regions AS r ON r.id = u.region_id 
                WHERE r.id = $1 
                    AND br.main_schet_id = $2 
                    AND br.doc_date ${operator} $3 
                    AND br.isdeleted = false
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
}