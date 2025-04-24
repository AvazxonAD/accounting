const { db } = require("@db/index");

exports.KassaMonitoringDB = class {
  static async get(params, search = null, order_by, order_type) {
    let search_filter = "";
    let order = ``;

    if (search) {
      params.push(search);
      search_filter = `AND d.doc_num = $${params.length}`;
    }

    order = `ORDER BY combined_${order_by} ${order_type}`;

    const query = `--sql
        WITH data AS (
            SELECT 
                d.id,
                d.type,
                so.name AS organization_name,
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
                d.doc_date AS combined_doc_date,
                d.id AS                                                             combined_id,
                d.doc_num AS                                                        combined_doc_num, 
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
            LEFT JOIN spravochnik_organization AS so ON so.id = d.organ_id 
            WHERE r.id = $1 
                AND d.main_schet_id = $2
                AND d.doc_date BETWEEN $3 AND $4 
                AND d.isdeleted = false
                ${search_filter}

            UNION ALL

            SELECT 
                d.id, 
                d.type,
                so.name AS organization_name,
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
                d.doc_date AS combined_doc_date,
                d.id AS                                                             combined_id,
                d.doc_num AS                                                        combined_doc_num, 
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
            LEFT JOIN spravochnik_organization AS so ON so.id = d.organ_id 
            WHERE r.id = $1 
                AND d.main_schet_id = $2
                AND d.doc_date BETWEEN $3 AND $4 
                AND d.isdeleted = false
                ${search_filter}
            ${order}
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
                )
            )::INTEGER AS total_count 
        FROM data
    `;

    const result = await db.query(query, params);

    return result[0];
  }

  static async capData(params) {
    const query = `--sql
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

  static async getSumma(
    params,
    search,
    from = null,
    one_from = null,
    one_to = null
  ) {
    let search_filter = ``;
    let internal_filter = `BETWEEN $3 AND $4`;

    if (from) {
      internal_filter = ` >= $3 AND d.doc_date < $4`;
    }

    if (one_from) {
      internal_filter = `  < $3`;
    }

    if (one_to) {
      internal_filter = `  <= $3`;
    }

    if (search) {
      params.push(search);
      search_filter = ` AND d.doc_num = $${params.length}`;
    }

    const query = `--sql
            WITH prixod AS (
                SELECT 
                    COALESCE(SUM(ch.summa), 0)::FLOAT AS summa
                FROM kassa_prixod d
                JOIN kassa_prixod_child ch ON ch.kassa_prixod_id = d.id
                JOIN users u ON d.user_id = u.id
                JOIN regions r ON u.region_id = r.id
                WHERE r.id = $1 
                    AND d.main_schet_id = $2  
                    AND d.isdeleted = false
                    AND ch.isdeleted = false
                    AND d.doc_date ${internal_filter}
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
                    AND d.isdeleted = false
                    AND ch.isdeleted = false
                    ${search_filter} 
                    AND d.doc_date ${internal_filter}
            )

            SELECT 
                ( SELECT summa FROM prixod ) AS prixod_sum,
                ( SELECT summa FROM rasxod ) AS rasxod_sum,
                (
                    ( SELECT summa FROM prixod ) -
                    ( SELECT summa FROM rasxod )
                ) AS summa 
        `;

    const result = await db.query(query, params);

    return result[0];
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

  static async prixodReport(params) {
    const query = `
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
    `;

    const result = await db.query(query, params);

    return result;
  }
};
