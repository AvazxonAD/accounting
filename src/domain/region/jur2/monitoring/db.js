const { db } = require("@db/index");

exports.BankMonitoringDB = class {
  static async get(params, search = null, order_by, order_type) {
    let search_filter = ``;
    let order = ``;

    if (search) {
      params.push(search);
      search_filter = ` AND d.doc_num = $${params.length}`;
    }

    order = `ORDER BY combined_${order_by} ${order_type}`;

    const query = `--sql
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
                    d.doc_date AS                                                   combined_doc_date,
                    d.id AS                                                         combined_id,
                    d.doc_num AS                                                    combined_doc_num,
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
                    d.doc_date AS                                                   combined_doc_date,
                    d.id AS                                                         combined_id,
                    d.doc_num AS                                                    combined_doc_num,
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
                    
                ${order}
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

                COALESCE( JSON_AGG( row_to_json( data ) ), '[]'::JSON ) AS data

            FROM data
        `;

    const result = await db.query(query, params);

    return result[0];
  }

  static async getSumma(params, search, from = null) {
    let search_filter = ``;
    let internal_filter = `BETWEEN $3 AND $4`;

    if (from) {
      internal_filter = ` >= $3 AND d.doc_date < $4`;
    }

    if (search) {
      params.push(search);
      search_filter = `AND d.doc_num = $${params.length}`;
    }

    const query = `--sql
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
                    AND d.doc_date ${internal_filter}
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
                    AND d.doc_date ${internal_filter}
                    ${search_filter} 
            )

            SELECT 
                prixod.summa AS prixod_sum,
                rasxod.summa  AS rasxod_sum,
                prixod.summa - rasxod.summa  AS summa
            FROM prixod, rasxod
        `;

    const result = await db.query(query, params);

    return result[0];
  }

  static async capData(params) {
    const query = `--sql
        SELECT
            op.schet,
            op.sub_schet,
            COALESCE(SUM(ch.summa), 0)::FLOAT AS   summa
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
    `;

    const result = await db.query(query, params);

    return result;
  }

  static async daysReport(params) {
    const query = `--sql
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

  static async prixodReport(params) {
    const query = `--sql
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
    `;

    const result = await db.query(query, params);

    return result;
  }
};
