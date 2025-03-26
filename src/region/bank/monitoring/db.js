const { db } = require("@db/index");

exports.BankMonitoringDB = class {
  static async get(params, search = null) {
    let search_filter = ``;
    if (search) {
      params.push(search);
      search_filter = ` AND d.doc_num = $${params.length}`;
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
                                so.schet AS provodki_schet,
                                so.sub_schet AS provodki_sub_schet
                            FROM bank_prixod_child AS ch
                            JOIN spravochnik_operatsii AS so ON so.id = ch.spravochnik_operatsii_id
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
                    TO_CHAR(d.doc_date, 'YYYY-MM-DD') AS                doc_date,
                    d.prixod_summa AS                                   prixod_sum,
                    0 AS                                                rasxod_sum,
                    null AS                                             id_spravochnik_organization,
                    null AS                                             spravochnik_organization_name,
                    null AS                                             spravochnik_organization_raschet_schet,
                    null AS                                             spravochnik_organization_inn,
                    null AS                                             id_shartnomalar_organization,
                    null AS                                             shartnomalar_doc_num,
                    null AS                                             shartnomalar_doc_date,
                    d.opisanie,
                    d.doc_date AS                                       combined_date,
                    u.login,
                    u.fio,
                    u.id AS                                             user_id,
                    (
                        SELECT JSON_AGG(row_to_json(ch))
                        FROM (
                            SELECT 
                                so.schet AS                             provodki_schet,
                                so.sub_schet AS                         provodki_sub_schet
                            FROM bank_saldo_child ch
                            JOIN spravochnik_operatsii AS so ON so.id = ch.operatsii_id
                            WHERE  ch.parent_id = d.id AND ch.isdeleted = false 
                        ) AS ch
                    ) AS provodki_array,
                    'bank_saldo_prixod' AS                              type
                FROM bank_saldo d
                JOIN users u ON d.user_id = u.id
                JOIN regions r ON u.region_id = r.id
                WHERE r.id = $1 
                    AND d.main_schet_id = $2 
                    AND d.isdeleted = false 
                    AND d.doc_date BETWEEN $3 AND $4
                    AND d.prixod = true
                    ${search_filter}
                
                UNION ALL

                SELECT 
                    d.id,
                    d.doc_num,
                    TO_CHAR(d.doc_date, 'YYYY-MM-DD') AS                doc_date,
                    0 AS                                                prixod_sum,
                    d.rasxod_summa AS                                   rasxod_sum,
                    null AS                                             id_spravochnik_organization,
                    null AS                                             spravochnik_organization_name,
                    null AS                                             spravochnik_organization_raschet_schet,
                    null AS                                             spravochnik_organization_inn,
                    null AS                                             id_shartnomalar_organization,
                    null AS                                             shartnomalar_doc_num,
                    null AS                                             shartnomalar_doc_date,
                    d.opisanie,
                    d.doc_date AS                                       combined_date,
                    u.login,
                    u.fio,
                    u.id AS                                             user_id,
                    (
                        SELECT JSON_AGG(row_to_json(ch))
                        FROM (
                            SELECT 
                                so.schet AS                             provodki_schet,
                                so.sub_schet AS                         provodki_sub_schet
                            FROM bank_saldo_child ch
                            JOIN spravochnik_operatsii AS so ON so.id = ch.operatsii_id
                            WHERE  ch.parent_id = d.id AND ch.isdeleted = false 
                        ) AS ch
                    ) AS provodki_array,
                    'bank_saldo_rasxod' AS                              type
                FROM bank_saldo d
                JOIN users u ON d.user_id = u.id
                JOIN regions r ON u.region_id = r.id
                WHERE r.id = $1 
                    AND d.main_schet_id = $2 
                    AND d.isdeleted = false 
                    AND d.doc_date BETWEEN $3 AND $4
                    AND d.rasxod = true
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
                                so.schet AS provodki_schet,
                                so.sub_schet AS provodki_sub_schet
                            FROM bank_rasxod_child AS ch
                            JOIN spravochnik_operatsii AS so ON so.id = ch.spravochnik_operatsii_id
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
                    ) +
                    (
                        SELECT 
                            COALESCE(COUNT(d.id), 0)
                        FROM bank_saldo d
                        JOIN users u ON d.user_id = u.id
                        JOIN regions r ON u.region_id = r.id
                        WHERE r.id = $1  
                            AND d.main_schet_id = $2 
                            AND d.isdeleted = false
                            AND d.doc_date BETWEEN $3 AND $4
                            ${search_filter}
                    ) 
                )::INTEGER AS total_count,
                (
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
                    ) + 
                    (
                        SELECT 
                            COALESCE(SUM(ch.summa), 0)
                        FROM bank_saldo d
                        JOIN bank_saldo_child ch ON ch.parent_id = d.id
                        JOIN users u ON d.user_id = u.id
                        JOIN regions r ON u.region_id = r.id
                        WHERE r.id = $1 
                            AND d.main_schet_id = $2 
                            AND d.isdeleted = false
                            AND d.doc_date BETWEEN $3 AND $4
                            ${search_filter}
                            AND ch.isdeleted = false
                            AND d.prixod = true
                    ) 
                )::FLOAT AS prixod_sum,
                (
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
                    ) + 
                    (
                        SELECT 
                            COALESCE(SUM(ch.summa), 0)
                        FROM bank_saldo d
                        JOIN bank_saldo_child ch ON ch.parent_id = d.id
                        JOIN users u ON d.user_id = u.id
                        JOIN regions r ON u.region_id = r.id
                        WHERE r.id = $1 
                            AND d.main_schet_id = $2 
                            AND d.isdeleted = false
                            AND d.doc_date BETWEEN $3 AND $4
                            ${search_filter}
                            AND ch.isdeleted = false
                            AND d.rasxod = true
                    ) 
                )::FLOAT AS rasxod_sum,
                COALESCE( JSON_AGG( row_to_json( data ) ), '[]'::JSON ) AS data
            FROM data
        `;

    const result = await db.query(query, params);

    return result[0];
  }

  static async getSumma(params, operator, search) {
    let search_filter = ``;
    if (search) {
      params.push(search);
      search_filter = ` AND d.doc_num = $${params.length}`;
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
            ),

            rasxod_saldo AS (
                SELECT 
                    COALESCE(SUM(ch.summa), 0)::FLOAT AS summa
                FROM bank_saldo d
                JOIN bank_saldo_child ch ON ch.parent_id = d.id
                JOIN users u ON d.user_id = u.id
                JOIN regions r ON u.region_id = r.id
                WHERE r.id = $1 
                    AND d.rasxod = true
                    AND d.isdeleted = false
                    AND ch.isdeleted = false
                    AND d.main_schet_id = $2 
                    AND d.doc_date ${operator} $3
                    ${search_filter} 
            ),
            
            prixod_saldo AS (
                SELECT 
                    COALESCE(SUM(ch.summa), 0)::FLOAT AS summa
                FROM bank_saldo d
                JOIN bank_saldo_child ch ON ch.parent_id = d.id
                JOIN users u ON d.user_id = u.id
                JOIN regions r ON u.region_id = r.id
                WHERE r.id = $1 
                    AND d.prixod = true
                    AND d.isdeleted = false
                    AND ch.isdeleted = false
                    AND d.main_schet_id = $2 
                    AND d.doc_date ${operator} $3
                    ${search_filter} 
            )

            SELECT 
                ( prixod.summa + prixod_saldo.summa ) AS prixod_summa,
                ( rasxod.summa + rasxod_saldo.summa ) AS rasxod_summa,
                ( ( prixod.summa + prixod_saldo.summa ) - ( rasxod.summa + rasxod_saldo.summa ) ) AS summa
            FROM prixod, rasxod, prixod_saldo, rasxod_saldo;
        `;

    const result = await db.query(query, params);

    return result[0];
  }

  static async capData(params) {
    const query = `
            WITH
                prixod AS (
                    SELECT
                        op.schet,
                        op.sub_schet,
                        COALESCE(SUM(ch.summa), 0) AS   summa,
                        'prixod' AS                     type    
                    FROM bank_prixod_child ch
                    JOIN bank_prixod AS d ON d.id = ch.id_bank_prixod
                    JOIN users AS u ON u.id = d.user_id
                    JOIN regions AS r ON r.id = u.region_id
                    JOIN spravochnik_operatsii op ON ch.spravochnik_operatsii_id = op.id
                    WHERE d.isdeleted = false
                        AND ch.isdeleted = false
                        AND d.main_schet_id = $1
                        AND d.doc_date BETWEEN $2 AND $3
                        AND r.id = $4
                    GROUP BY op.schet,
                        op.sub_schet
                ),

                rasxod AS (
                    SELECT
                        op.schet,
                        op.sub_schet,
                        COALESCE(SUM(ch.summa), 0) AS   summa,
                        'rasxod' AS                     type    
                    FROM bank_rasxod_child ch
                    JOIN bank_rasxod AS d ON d.id = ch.id_bank_rasxod
                    JOIN users AS u ON u.id = d.user_id
                    JOIN regions AS r ON r.id = u.region_id
                    JOIN spravochnik_operatsii op ON ch.spravochnik_operatsii_id = op.id
                    WHERE d.isdeleted = false
                        AND ch.isdeleted = false
                        AND d.main_schet_id = $1
                        AND d.doc_date BETWEEN $2 AND $3
                        AND r.id = $4
                    GROUP BY op.schet,
                        op.sub_schet
                ),

                rasxod_saldo AS (
                    SELECT
                        op.schet,
                        op.sub_schet,
                        COALESCE(SUM(ch.summa), 0) AS   summa,
                        'rasxod_saldo' AS               type    
                    FROM bank_saldo_child ch
                    JOIN bank_saldo AS d ON d.id = ch.parent_id
                    JOIN users AS u ON u.id = d.user_id
                    JOIN regions AS r ON r.id = u.region_id
                    JOIN spravochnik_operatsii op ON ch.operatsii_id = op.id
                    WHERE d.isdeleted = false
                        AND ch.isdeleted = false
                        AND d.rasxod = true
                        AND d.main_schet_id = $1
                        AND d.doc_date BETWEEN $2 AND $3
                        AND r.id = $4
                    GROUP BY op.schet,
                        op.sub_schet
                ),

                prixod_saldo AS (
                    SELECT
                        op.schet,
                        op.sub_schet,
                        COALESCE(SUM(ch.summa), 0) AS   summa,
                        'rasxod_saldo' AS               type    
                    FROM bank_saldo_child ch
                    JOIN bank_saldo AS d ON d.id = ch.parent_id
                    JOIN users AS u ON u.id = d.user_id
                    JOIN regions AS r ON r.id = u.region_id
                    JOIN spravochnik_operatsii op ON ch.operatsii_id = op.id
                    WHERE d.isdeleted = false
                        AND ch.isdeleted = false
                        AND d.prixod = true
                        AND d.main_schet_id = $1
                        AND d.doc_date BETWEEN $2 AND $3
                        AND r.id = $4
                    GROUP BY op.schet,
                        op.sub_schet
                )
            SELECT 
                JSON_BUILD_OBJECT(
                    'prixods', (
                        SELECT COALESCE(JSON_AGG(ROW_TO_JSON(prixod)), '[]'::JSON)
                        FROM (
                            SELECT * FROM prixod
                            UNION ALL
                            SELECT * FROM prixod_saldo
                        ) prixod
                    ),

                    'rasxods', (
                        SELECT COALESCE(JSON_AGG(ROW_TO_JSON(rasxod)), '[]'::JSON)
                        FROM (
                            SELECT * FROM rasxod
                            UNION ALL
                            SELECT * FROM rasxod_saldo
                        ) rasxod
                    )
                ) AS result;
        `;

    const result = await db.query(query, params);

    return result[0].result;
  }

  static async daysReport(params) {
    const query = `
            WITH
                prixod AS (
                    SELECT
                        op.schet,
                        op.sub_schet,
                        ch.summa::FLOAT,
                        d.doc_num,
                        d.doc_date,
                        so.name,
                        so.inn,
                        oa.raschet_schet AS             account_number,
                        c.doc_num AS                    contract_doc_num,
                        c.doc_date AS                   contract_doc_date,
                        d.opisanie AS                   comment
                    FROM bank_prixod_child ch
                    JOIN bank_prixod AS d ON d.id = ch.id_bank_prixod
                    JOIN users AS u ON u.id = d.user_id
                    JOIN regions AS r ON r.id = u.region_id
                    JOIN spravochnik_operatsii op ON ch.spravochnik_operatsii_id = op.id
                    JOIN spravochnik_organization so ON so.id = d.id_spravochnik_organization
                    LEFT JOIN organization_by_raschet_schet oa ON oa.id = d.organization_by_raschet_schet_id
                    LEFT JOIN shartnomalar_organization c ON c.id = d.id_shartnomalar_organization
                    WHERE d.isdeleted = false
                        AND ch.isdeleted = false
                        AND d.main_schet_id = $1
                        AND d.doc_date BETWEEN $2 AND $3
                        AND r.id = $4
                ),
                rasxod AS (
                    SELECT
                        op.schet,
                        op.sub_schet,
                        ch.summa::FLOAT,
                        d.doc_num,
                        d.doc_date,
                        so.name,
                        so.inn,
                        oa.raschet_schet AS             account_number,
                        c.doc_num AS                    contract_doc_num,
                        c.doc_date AS                   contract_doc_date,
                        d.opisanie AS                   comment
                    FROM bank_rasxod_child ch
                    JOIN bank_rasxod AS d ON d.id = ch.id_bank_rasxod
                    JOIN users AS u ON u.id = d.user_id
                    JOIN regions AS r ON r.id = u.region_id
                    JOIN spravochnik_operatsii op ON ch.spravochnik_operatsii_id = op.id
                    JOIN spravochnik_organization so ON so.id = d.id_spravochnik_organization
                    LEFT JOIN organization_by_raschet_schet oa ON oa.id = d.organization_by_raschet_schet_id
                    LEFT JOIN shartnomalar_organization c ON c.id = d.id_shartnomalar_organization
                    WHERE d.isdeleted = false
                        AND ch.isdeleted = false
                        AND d.main_schet_id = $1
                        AND d.doc_date BETWEEN $2 AND $3
                        AND r.id = $4
                )
            SELECT
                (SELECT COALESCE(JSON_AGG(ROW_TO_JSON(prixod)), '[]'::JSON) FROM prixod) AS prixods,
                (SELECT COALESCE(JSON_AGG(ROW_TO_JSON(rasxod)), '[]'::JSON) FROM rasxod) AS rasxods;
        `;

    const result = await db.query(query, params);

    return result[0];
  }
};
