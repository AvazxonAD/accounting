const { db } = require("@db/index");

exports.KassaMonitoringDB = class {
  static async get(params, search) {
    let search_filter = "";

    if (search) {
      params.push(search);
      search_filter = `AND d.doc_num = $${params.length}`;
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
                        SELECT JSON_AGG(row_to_json(ch))
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
                        SELECT JSON_AGG(row_to_json(ch))
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

                UNION ALL

                SELECT 
                    d.id, 
                    d.doc_num,
                    TO_CHAR(d.doc_date, 'YYYY-MM-DD') AS        doc_date,
                    0::FLOAT AS                                 prixod_sum,
                    d.rasxod_summa AS                           rasxod_sum,
                    null AS                                     id_podotchet_litso,
                    null AS                                     name,
                    d.opisanie,
                    d.doc_date AS                               combined_date,
                    u.login,
                    u.fio,
                    u.id AS user_id,
                    (
                        SELECT JSON_AGG(row_to_json(ch))
                        FROM (
                            SELECT 
                                op.schet AS provodki_schet,
                                op.sub_schet AS provodki_sub_schet
                            FROM kassa_saldo_child AS ch
                            JOIN spravochnik_operatsii AS op ON op.id = ch.operatsii_id
                            WHERE  ch.parent_id = d.id
                                AND ch.isdeleted = false  
                        ) AS ch
                    ) AS provodki_array
                FROM kassa_saldo d
                JOIN users u ON d.user_id = u.id
                JOIN regions r ON u.region_id = r.id
                WHERE r.id = $1
                  AND d.rasxod = true   
                  AND d.main_schet_id = $2
                  AND d.doc_date BETWEEN $3 AND $4 
                  AND d.isdeleted = false
                  ${search_filter}
                
                UNION ALL

                SELECT 
                    d.id, 
                    d.doc_num,
                    TO_CHAR(d.doc_date, 'YYYY-MM-DD') AS        doc_date,
                    d.prixod_summa AS                           prixod_sum,
                    0::FLOAT AS                                 rasxod_sum,
                    null AS                                     id_podotchet_litso,
                    null AS                                     name,
                    d.opisanie,
                    d.doc_date AS                               combined_date,
                    u.login,
                    u.fio,
                    u.id AS user_id,
                    (
                        SELECT JSON_AGG(row_to_json(ch))
                        FROM (
                            SELECT 
                                op.schet AS provodki_schet,
                                op.sub_schet AS provodki_sub_schet
                            FROM kassa_saldo_child AS ch
                            JOIN spravochnik_operatsii AS op ON op.id = ch.operatsii_id
                            WHERE  ch.parent_id = d.id
                                AND ch.isdeleted = false  
                        ) AS ch
                    ) AS provodki_array
                FROM kassa_saldo d
                JOIN users u ON d.user_id = u.id
                JOIN regions r ON u.region_id = r.id
                WHERE r.id = $1
                  AND d.prixod = true   
                  AND d.main_schet_id = $2
                  AND d.doc_date BETWEEN $3 AND $4 
                  AND d.isdeleted = false
                  ${search_filter}
                
                ORDER BY combined_date
                OFFSET $5 LIMIT $6
            ) 

            SELECT 
                COALESCE( JSON_AGG( row_to_json( data ) ), '[]'::JSON ) AS data,
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
                    ) + 
                    (
                        SELECT 
                            COALESCE(COUNT(d.id), 0) 
                        FROM kassa_saldo d
                        JOIN users u ON d.user_id = u.id
                        JOIN regions r ON u.region_id = r.id
                        WHERE r.id = $1 
                            AND d.main_schet_id = $2 
                            AND d.doc_date BETWEEN $3 AND $4 
                            AND d.isdeleted = false
                            ${search_filter}
                    )
                )::INTEGER AS total_count,
                (
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
                    ) + 
                    (
                        SELECT 
                            COALESCE(SUM(ch.summa), 0) 
                        FROM kassa_saldo d
                        JOIN kassa_saldo_child ch ON ch.parent_id = d.id
                        JOIN users u ON d.user_id = u.id
                        JOIN regions r ON u.region_id = r.id
                        WHERE r.id = $1 
                            AND d.rasxod = true
                            AND d.main_schet_id = $2 
                            AND d.doc_date BETWEEN $3 AND $4 
                            AND d.isdeleted = false
                            AND ch.isdeleted = false
                            ${search_filter}
                    )
                )::FLOAT AS rasxod_sum,
                (
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
                    ) + 
                    (
                        SELECT 
                            COALESCE(SUM(ch.summa), 0) 
                        FROM kassa_saldo d
                        JOIN kassa_saldo_child ch ON ch.parent_id = d.id
                        JOIN users u ON d.user_id = u.id
                        JOIN regions r ON u.region_id = r.id
                        WHERE r.id = $1 
                            AND d.prixod = true
                            AND d.main_schet_id = $2 
                            AND d.doc_date BETWEEN $3 AND $4 
                            AND d.isdeleted = false
                            AND ch.isdeleted = false
                            ${search_filter}
                    )
                ) AS prixod_sum
                        
            FROM data
        `;

    const result = await db.query(query, params);

    return result[0];
  }

  static async capData(params) {
    const query = `
        SELECT
            op.schet,
            op.sub_schet,
            COALESCE(SUM(ch.summa), 0)::FLOAT AS       summa
        FROM kassa_rasxod_child ch
        JOIN kassa_rasxod AS d ON d.id = ch.kassa_rasxod_id
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
                FROM kassa_prixod d
                JOIN kassa_prixod_child ch ON ch.kassa_prixod_id = d.id
                JOIN users u ON d.user_id = u.id
                JOIN regions r ON u.region_id = r.id
                WHERE r.id = $1 
                    AND d.main_schet_id = $2 
                    AND d.doc_date ${operator} $3 
                    AND d.isdeleted = false
                    AND ch.isdeleted = false
                    ${search_filter} 
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
                    ${search_filter} 
            ),

            rasxod_saldo AS (
                SELECT 
                    COALESCE(SUM(ch.summa), 0)::FLOAT AS summa
                FROM kassa_saldo d
                JOIN kassa_saldo_child ch ON ch.parent_id = d.id
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
                FROM kassa_saldo d
                JOIN kassa_saldo_child ch ON ch.parent_id = d.id
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
                        so.name AS                      fio,
                        so.rayon,
                        d.opisanie AS                   comment
                    FROM kassa_prixod_child ch
                    JOIN kassa_prixod AS d ON d.id = ch.kassa_prixod_id
                    JOIN users AS u ON u.id = d.user_id
                    JOIN regions AS r ON r.id = u.region_id
                    JOIN spravochnik_operatsii op ON ch.spravochnik_operatsii_id = op.id
                    LEFT JOIN spravochnik_podotchet_litso so ON so.id = d.id_podotchet_litso
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
                        so.name AS                      fio,
                        so.rayon,
                        d.opisanie AS                   comment
                    FROM kassa_rasxod_child ch
                    JOIN kassa_rasxod AS d ON d.id = ch.kassa_rasxod_id
                    JOIN users AS u ON u.id = d.user_id
                    JOIN regions AS r ON r.id = u.region_id
                    JOIN spravochnik_operatsii op ON ch.spravochnik_operatsii_id = op.id
                    LEFT JOIN spravochnik_podotchet_litso so ON so.id = d.id_podotchet_litso
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
