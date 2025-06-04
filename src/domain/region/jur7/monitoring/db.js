const { db } = require("@db/index");
const { sqlFilter } = require(`@helper/functions`);

exports.Jur7MonitoringDB = class {
  static async monitoring(params, order_by, order_type, search = null) {
    let search_filter = ``;

    const order = `ORDER BY combined_${order_by} ${order_type}`;

    if (search) {
      params.push(`%${search}%`);
      search_filter = `AND (LOWER(d.doc_num) LIKE LOWER($${params.length}) OR LOWER(d.opisanie) LIKE LOWER($${params.length}))`;
    }

    const query = `--sql
      WITH data AS (
      SELECT
        d.id,
        d.doc_num,
        TO_CHAR(d.doc_date, 'YYYY-MM-DD') AS                          doc_date,
        d.opisanie,
        0::FLOAT AS                                                   summa_rasxod, 
        (
        SELECT
          COALESCE(SUM(ch.summa), 0)::FLOAT
        FROM document_prixod_jur7_child ch
        WHERE ch.document_prixod_jur7_id = d.id
          AND ch.isdeleted = false
        )::FLOAT AS summa_prixod,
        f.id AS                                                       from_id,
        f.name AS                                                     from_name,
        t.id AS                                                       to_id,
        t.fio AS                                                      to_name,
        u.id AS                                                       user_id,
        u.login,
        u.fio,
        COALESCE((
        SELECT
          JSON_AGG(
          JSON_BUILD_OBJECT(
            'kredit_schet', unique_schets.kredit_schet,
            'kredit_sub_schet', unique_schets.kredit_sub_schet,
            'debet_schet', unique_schets.debet_schet,
            'debet_sub_schet', unique_schets.debet_sub_schet
          )
          )
          FROM (
            SELECT DISTINCT
              ch.kredit_schet,
              ch.kredit_sub_schet,
              ch.debet_schet,
              ch.debet_sub_schet
            FROM document_prixod_jur7_child ch
            WHERE ch.document_prixod_jur7_id = d.id
              AND ch.isdeleted = false
          ) AS unique_schets
        ), '[]'::JSON) AS schets,
        'prixod' AS                                                   type,
        d.doc_date AS                                                 combined_doc_date,
        d.id AS                                                       combined_id,
        d.doc_num AS                                                  combined_doc_num
      FROM document_prixod_jur7 d
      JOIN spravochnik_organization AS f ON f.id = d.kimdan_id
      JOIN spravochnik_javobgar_shaxs_jur7 t ON t.id = d.kimga_id
      JOIN users AS u ON u.id = d.user_id
      JOIN regions AS r ON r.id = u.region_id
      WHERE d.isdeleted = false
        AND r.id = $1
        AND d.doc_date BETWEEN $2 AND $3
        AND d.main_schet_id = $4
        ${search_filter}
      
      UNION ALL 
      
      SELECT
        d.id,
        d.doc_num,
        TO_CHAR(d.doc_date, 'YYYY-MM-DD') AS                          doc_date,
        d.opisanie,
        (
        SELECT
          COALESCE(SUM(ch.summa), 0)::FLOAT
          FROM document_vnutr_peremesh_jur7_child ch
          WHERE ch.document_vnutr_peremesh_jur7_id = d.id
          AND ch.isdeleted = false
        )::FLOAT AS summa_rasxod,
        (
        SELECT
          COALESCE(SUM(ch.summa), 0)::FLOAT
          FROM document_vnutr_peremesh_jur7_child ch
          WHERE ch.document_vnutr_peremesh_jur7_id = d.id
          AND ch.isdeleted = false
        )::FLOAT summa_prixod,
        f.id AS                                                       from_id,
        f.fio AS                                                      from_name,
        t.id AS                                                       to_id,
        t.fio AS                                                      to_name,
        u.id AS                                                       user_id,
        u.login,
        u.fio,
        COALESCE((
          SELECT
            JSON_AGG(
              JSON_BUILD_OBJECT(
               'kredit_schet', unique_schets.kredit_schet,
            'kredit_sub_schet', unique_schets.kredit_sub_schet,
            'debet_schet', unique_schets.debet_schet,
            'debet_sub_schet', unique_schets.debet_sub_schet
              )
            )
          FROM (
            SELECT DISTINCT
              ch.kredit_schet,
              ch.kredit_sub_schet,
              ch.debet_schet,
              ch.debet_sub_schet
            FROM document_vnutr_peremesh_jur7_child ch
            WHERE ch.document_vnutr_peremesh_jur7_id = d.id
              AND ch.isdeleted = false
          ) AS unique_schets
        ), '[]'::JSON) AS schets,
        'internal' AS                                                 type,
        d.doc_date AS                                                 combined_doc_date,
        d.id AS                                                       combined_id,
        d.doc_num AS                                                  combined_doc_num
      FROM document_vnutr_peremesh_jur7 d
      JOIN spravochnik_javobgar_shaxs_jur7 f ON f.id = d.kimdan_id
      JOIN spravochnik_javobgar_shaxs_jur7 t ON t.id = d.kimga_id
      JOIN users AS u ON u.id = d.user_id
      JOIN regions AS r ON r.id = u.region_id
      WHERE d.isdeleted = false
        AND r.id = $1
        AND d.doc_date BETWEEN $2 AND $3
        AND d.main_schet_id = $4
        ${search_filter}
      
      UNION ALL

      SELECT
        d.id,
        d.doc_num,
        TO_CHAR(d.doc_date, 'YYYY-MM-DD') AS                          doc_date,
        d.opisanie,
        (
        SELECT
          COALESCE(SUM(ch.summa), 0)::FLOAT
          FROM document_rasxod_jur7_child ch
          WHERE ch.document_rasxod_jur7_id = d.id
          AND ch.isdeleted = false  
        )::FLOAT AS summa_rasxod,
        0::FLOAT AS                                                   summa_prixod,
        f.id AS                                                       from_id,
        f.fio AS                                                      from_name,
        null AS                                                       to_id,
        null AS                                                       to_name,
        u.id AS                                                       user_id,
        u.login,
        u.fio,
        COALESCE((
          SELECT
            JSON_AGG(
              JSON_BUILD_OBJECT(
                'kredit_schet', unique_schets.kredit_schet,
                'kredit_sub_schet', unique_schets.kredit_sub_schet,
                'debet_schet', unique_schets.debet_schet,
                'debet_sub_schet', unique_schets.debet_sub_schet
              )
            )
          FROM (
            SELECT DISTINCT
              ch.kredit_schet,
              ch.kredit_sub_schet,
              ch.debet_schet,
              ch.debet_sub_schet
            FROM document_rasxod_jur7_child ch
            WHERE ch.document_rasxod_jur7_id = d.id
              AND ch.isdeleted = false
          ) AS unique_schets
        ), '[]'::JSON) AS schets,
        'rasxod' AS                                                   type,
        d.doc_date AS                                                 combined_doc_date,
        d.id AS                                                       combined_id,
        d.doc_num AS                                                  combined_doc_num
      FROM document_rasxod_jur7 d
      JOIN spravochnik_javobgar_shaxs_jur7 f ON f.id = d.kimdan_id
      JOIN users AS u ON u.id = d.user_id
      JOIN regions AS r ON r.id = u.region_id
      WHERE d.isdeleted = false
        AND r.id = $1
        AND d.doc_date BETWEEN $2 AND $3
        AND d.main_schet_id = $4
        ${search_filter}

      ${order}

      OFFSET $5 LIMIT $6
      )
      
      SELECT 
      COALESCE(JSON_AGG(ROW_TO_JSON(data)), '[]'::JSON) AS data,
      (
        (
        SELECT
          COALESCE(COUNT(d.id), 0)::INTEGER
        FROM document_prixod_jur7 d
        JOIN spravochnik_organization AS f ON f.id = d.kimdan_id
        JOIN spravochnik_javobgar_shaxs_jur7 t ON t.id = d.kimga_id
        JOIN users AS u ON u.id = d.user_id
        JOIN regions AS r ON r.id = u.region_id
        WHERE d.isdeleted = false
          AND r.id = $1
          AND d.doc_date BETWEEN $2 AND $3
          AND d.main_schet_id = $4
          ${search_filter}
          
        ) +
        (
        SELECT
          COALESCE(COUNT(d.id), 0)::INTEGER
        FROM document_vnutr_peremesh_jur7 d
        JOIN spravochnik_javobgar_shaxs_jur7 f ON f.id = d.kimdan_id
        JOIN spravochnik_javobgar_shaxs_jur7 t ON t.id = d.kimga_id
        JOIN users AS u ON u.id = d.user_id
        JOIN regions AS r ON r.id = u.region_id
        WHERE d.isdeleted = false
          AND r.id = $1
          AND d.doc_date BETWEEN $2 AND $3
          AND d.main_schet_id = $4
          ${search_filter}
        ) +
        (
        SELECT
          COALESCE(COUNT(d.id), 0)::INTEGER
        FROM document_rasxod_jur7 d
        JOIN spravochnik_javobgar_shaxs_jur7 f ON f.id = d.kimdan_id
        JOIN users AS u ON u.id = d.user_id
        JOIN regions AS r ON r.id = u.region_id
        WHERE d.isdeleted = false
          AND r.id = $1
          AND d.doc_date BETWEEN $2 AND $3
          AND d.main_schet_id = $4
          ${search_filter}
        )
      )::INTEGER AS total,
      (
        (
        SELECT
          COALESCE(SUM(ch.summa_s_nds), 0)::FLOAT
        FROM document_prixod_jur7 d
        JOIN document_prixod_jur7_child ch ON d.id = ch.document_prixod_jur7_id
        JOIN spravochnik_organization AS f ON f.id = d.kimdan_id
        JOIN spravochnik_javobgar_shaxs_jur7 t ON t.id = d.kimga_id
        JOIN users AS u ON u.id = d.user_id
        JOIN regions AS r ON r.id = u.region_id
        WHERE d.isdeleted = false
          AND r.id = $1
          AND ch.isdeleted = false
          AND d.doc_date BETWEEN $2 AND $3
          AND d.main_schet_id = $4
          ${search_filter}
        ) +
        (
        SELECT
          COALESCE(SUM(ch.summa), 0)::FLOAT
        FROM document_vnutr_peremesh_jur7 d
        JOIN document_vnutr_peremesh_jur7_child ch ON d.id = ch.document_vnutr_peremesh_jur7_id
        JOIN spravochnik_javobgar_shaxs_jur7 f ON f.id = d.kimdan_id
        JOIN spravochnik_javobgar_shaxs_jur7 t ON t.id = d.kimga_id
        JOIN users AS u ON u.id = d.user_id
        JOIN regions AS r ON r.id = u.region_id
        WHERE d.isdeleted = false
          AND r.id = $1
          AND ch.isdeleted = false
          AND d.doc_date BETWEEN $2 AND $3
          AND d.main_schet_id = $4
          ${search_filter}
        )
      )::FLOAT AS prixod_sum,
      ( 
        (
        SELECT
          COALESCE(SUM(ch.summa), 0)::FLOAT
        FROM document_rasxod_jur7 d
        JOIN document_rasxod_jur7_child ch ON d.id = ch.document_rasxod_jur7_id
        JOIN spravochnik_javobgar_shaxs_jur7 f ON f.id = d.kimdan_id
        JOIN users AS u ON u.id = d.user_id
        JOIN regions AS r ON r.id = u.region_id
        WHERE d.isdeleted = false
          AND r.id = $1
          AND ch.isdeleted = false
          AND d.doc_date BETWEEN $2 AND $3
          AND d.main_schet_id = $4
          ${search_filter}
        ) +
        (
        SELECT
          COALESCE(SUM(ch.summa), 0)::FLOAT
        FROM document_vnutr_peremesh_jur7 d
        JOIN document_vnutr_peremesh_jur7_child ch ON d.id = ch.document_vnutr_peremesh_jur7_id
        JOIN spravochnik_javobgar_shaxs_jur7 f ON f.id = d.kimdan_id
        JOIN spravochnik_javobgar_shaxs_jur7 t ON t.id = d.kimga_id
        JOIN users AS u ON u.id = d.user_id
        JOIN regions AS r ON r.id = u.region_id
        WHERE d.isdeleted = false
          AND r.id = $1
          AND ch.isdeleted = false
          AND d.doc_date BETWEEN $2 AND $3
          AND d.main_schet_id = $4
          ${search_filter}
        )
      )::FLOAT AS rasxod_sum
      FROM data
    `;

    const result = await db.query(query, params);

    return result[0];
  }

  static async capData(params) {
    const query = `--sql
        SELECT 
            ch.debet_schet,
            ch.kredit_schet,
            ch.debet_sub_schet,
            COALESCE(SUM(ch.summa), 0)::FLOAT AS        summa  
        FROM document_rasxod_jur7_child ch
        JOIN document_rasxod_jur7 d ON d.id = ch.document_rasxod_jur7_id
        JOIN users AS u ON u.id = d.user_id
        JOIN regions AS r ON r.id = u.region_id
        WHERE r.id = $1 
            AND d.isdeleted = false 
            AND d.doc_date BETWEEN $2 AND $3
            AND d.main_schet_id = $4
            AND ch.isdeleted = false
        GROUP BY ch.debet_schet,
            ch.kredit_schet,
            ch.debet_sub_schet

        UNION ALL 

        SELECT 
            ch.debet_schet,
            ch.kredit_schet,
            ch.debet_sub_schet,
            COALESCE(SUM(ch.summa), 0)::FLOAT AS        summa  
        FROM document_vnutr_peremesh_jur7_child ch
        JOIN document_vnutr_peremesh_jur7 d ON d.id = ch.document_vnutr_peremesh_jur7_id
        JOIN users AS u ON u.id = d.user_id
        JOIN regions AS r ON r.id = u.region_id
        WHERE r.id = $1 
            AND d.isdeleted = false 
            AND d.doc_date BETWEEN $2 AND $3
            AND d.main_schet_id = $4
            AND ch.isdeleted = false
        GROUP BY ch.debet_schet,
            ch.kredit_schet,
            ch.debet_sub_schet
    `;

    const result = await db.query(query, params);

    return result;
  }

  static async capDataPrixods(params) {
    const query = `--sql
        SELECT 
            ch.debet_schet,
            ch.kredit_schet,
            COALESCE(SUM(ch.summa), 0)::FLOAT AS        summa  
        FROM document_prixod_jur7_child ch
        JOIN document_prixod_jur7 d ON d.id = ch.document_prixod_jur7_id
        JOIN users AS u ON u.id = d.user_id
        JOIN regions AS r ON r.id = u.region_id
        WHERE r.id = $1 
            AND d.isdeleted = false 
            AND d.doc_date BETWEEN $2 AND $3
            AND d.main_schet_id = $4
            AND ch.isdeleted = false
        GROUP BY ch.debet_schet,
            ch.kredit_schet
    `;

    const result = await db.query(query, params);

    return result;
  }

  static async reportBySchetsRasxods(params) {
    const query = `--sql
        SELECT 
            ch.debet_schet,
            ch.kredit_schet,
            COALESCE(SUM(ch.summa), 0)::FLOAT AS        summa  
        FROM document_rasxod_jur7_child ch
        JOIN document_rasxod_jur7 d ON d.id = ch.document_rasxod_jur7_id
        JOIN users AS u ON u.id = d.user_id
        JOIN regions AS r ON r.id = u.region_id
        WHERE r.id = $1 
            AND d.isdeleted = false 
            AND d.doc_date BETWEEN $2 AND $3
            AND d.main_schet_id = $4
            AND ch.isdeleted = false
        GROUP BY ch.debet_schet,
            ch.kredit_schet
    `;

    const result = await db.query(query, params);

    return result;
  }

  static async reportBySchetsInternals(params) {
    const query = `--sql
      SELECT 
          ch.debet_schet,
          ch.kredit_schet,
          COALESCE(SUM(ch.summa), 0)::FLOAT AS        summa  
      FROM document_vnutr_peremesh_jur7_child ch
      JOIN document_vnutr_peremesh_jur7 d ON d.id = ch.document_vnutr_peremesh_jur7_id
      JOIN users AS u ON u.id = d.user_id
      JOIN regions AS r ON r.id = u.region_id
      WHERE r.id = $1 
          AND d.isdeleted = false 
          AND d.doc_date BETWEEN $2 AND $3
          AND d.main_schet_id = $4
          AND ch.isdeleted = false
      GROUP BY ch.debet_schet,
          ch.kredit_schet
    `;

    const result = await db.query(query, params);

    return result;
  }

  static async reportBySchetsPrixods(params) {
    const query = `--sql
        SELECT 
            ch.debet_schet,
            ch.kredit_schet,
            COALESCE(SUM(ch.summa), 0)::FLOAT AS        summa  
        FROM document_prixod_jur7_child ch
        JOIN document_prixod_jur7 d ON d.id = ch.document_prixod_jur7_id
        JOIN users AS u ON u.id = d.user_id
        JOIN regions AS r ON r.id = u.region_id
        WHERE r.id = $1 
            AND d.isdeleted = false 
            AND d.doc_date BETWEEN $2 AND $3
            AND d.main_schet_id = $4
            AND ch.isdeleted = false
        GROUP BY ch.debet_schet,
            ch.kredit_schet
    `;

    const result = await db.query(query, params);

    return result;
  }

  static async getMaterial(params, responsible_id = null) {
    let resposnible_filter = ``;
    if (responsible_id) {
      params.push(responsible_id);
      resposnible_filter = `AND d.kimning_buynida = $${params.length}`;
    }

    const query = `--sql
            SELECT
              d.id::INTEGER AS                                    saldo_id,
              n.id::INTEGER AS                                    product_id,
              n.name AS                                  name,
              n.edin,
              d.debet_schet AS                           schet,
              j.fio,
              d.kimning_buynida::INTEGER,
              d.iznos,
              g.iznos_foiz,
              TO_CHAR(d.doc_date, 'DD-MM-YYYY') AS        doc_date,
              d.doc_num,
              d.prixod_id,
              JSON_BUILD_OBJECT(
                'sena', d.sena::FLOAT,
                'summa', d.summa::FLOAT,
                'iznos_summa', d.iznos_summa::FLOAT,
                'kol', d.kol::FLOAT
              ) AS                                        from
            FROM saldo_naimenovanie_jur7 d
            JOIN spravochnik_javobgar_shaxs_jur7 j ON j.id = d.kimning_buynida
            JOIN naimenovanie_tovarov_jur7 AS n ON n.id = d.naimenovanie_tovarov_jur7_id
            JOIN group_jur7 AS g ON n.group_jur7_id = g.id
            WHERE d.year = $1
              AND d.month = $2
              AND d.region_id = $3
              AND d.main_schet_id = $4
              ${resposnible_filter}
        `;

    const result = await db.query(query, params);

    return result;
  }

  static async getBySchetProducts(params) {
    const query = `--sql
        SELECT 
            n.id,
            TO_CHAR(d.doc_date, 'YYYY-MM-DD') AS doc_date, 
            n.id, 
            n.edin,
            n.name
        FROM saldo_naimenovanie_jur7  d
        JOIN users AS u ON u.id = d.user_id
        JOIN regions r ON r.id = u.region_id
        JOIN naimenovanie_tovarov_jur7 n ON n.id = d.naimenovanie_tovarov_jur7_id
        WHERE d.isdeleted = false 
            AND r.id = $1
            AND d.main_schet_id = $2
            AND d.debet_schet = $3
            AND d.kimning_buynida = $4
            AND d.year = $5
            AND d.month = $6
    `;

    const result = await db.query(query, params);
    return result;
  }

  static async getSummaReport(params, operator, responsible_id = null, product_id = null) {
    let internal_filter = ``;
    if (params.length === 3) {
      internal_filter = `${operator} $3`;
    }
    if (params.length === 4) {
      internal_filter = "BETWEEN $3 AND $4";
    }
    let index_responsible_id = null;
    if (responsible_id) {
      params.push(responsible_id);
      index_responsible_id = params.length;
    }
    let product_filter = ``;
    if (product_id) {
      product_filter = `AND ch.naimenovanie_tovarov_jur7_id = $${params.length + 1}`;
      params.push(product_id);
    }

    const query = `--sql
        WITH 
        jur7_prixodSum AS (
            SELECT COALESCE(SUM(ch.summa), 0::FLOAT) AS summa, COALESCE(SUM(ch.kol), 0)::FLOAT AS kol
            FROM document_prixod_jur7 d
            JOIN document_prixod_jur7_child ch ON ch.document_prixod_jur7_id = d.id
            WHERE d.main_schet_id = $1 AND
              ch.debet_schet = $2
              AND d.doc_date ${internal_filter}
              ${responsible_id ? sqlFilter("d.kimga_id", index_responsible_id) : ""} ${product_filter} 
        ),
        jur7_rasxodSum AS (
            SELECT COALESCE(SUM(ch.summa), 0)::FLOAT AS summa, COALESCE(SUM(ch.kol), 0)::FLOAT AS kol
            FROM document_rasxod_jur7 d
            JOIN document_rasxod_jur7_child ch ON ch.document_rasxod_jur7_id = d.id
            WHERE d.main_schet_id = $1
              AND  ch.kredit_schet = $2
              AND d.doc_date ${internal_filter}
              ${responsible_id ? sqlFilter("d.kimdan_id", index_responsible_id) : ""} ${product_filter}
        ),
        jur7_internal_rasxodSum AS (
            SELECT COALESCE(SUM(ch.summa), 0)::FLOAT AS summa, COALESCE(SUM(ch.kol), 0)::FLOAT AS kol
            FROM document_vnutr_peremesh_jur7 d
            JOIN document_vnutr_peremesh_jur7_child ch ON ch.document_vnutr_peremesh_jur7_id = d.id
            WHERE d.main_schet_id = $1
              AND  ch.kredit_schet = $2
              AND d.doc_date ${internal_filter}
              ${responsible_id ? sqlFilter("d.kimdan_id", index_responsible_id) : ""} ${product_filter}
        ),
        jur7_internal_PrixodSum AS (
            SELECT COALESCE(SUM(ch.summa), 0)::FLOAT AS summa, COALESCE(SUM(ch.kol), 0)::FLOAT AS kol
            FROM document_vnutr_peremesh_jur7 d
            JOIN document_vnutr_peremesh_jur7_child ch ON ch.document_vnutr_peremesh_jur7_id = d.id
            WHERE d.main_schet_id = $1
              AND  ch.debet_schet = $2
              AND d.doc_date ${internal_filter}
              ${responsible_id ? sqlFilter("d.kimga_id", index_responsible_id) : ""} ${product_filter}
        )
        SELECT 
            ((jur7_prixodSum.summa + jur7_internal_PrixodSum.summa) - (jur7_rasxodSum.summa + jur7_internal_rasxodSum.summa)) AS summa,
            ((jur7_prixodSum.kol + jur7_internal_PrixodSum.kol) - (jur7_rasxodSum.kol + jur7_internal_rasxodSum.kol)) AS kol,
            (jur7_prixodSum.summa + jur7_internal_PrixodSum.summa) AS prixod,
            (jur7_prixodSum.kol + jur7_internal_PrixodSum.kol) AS prixod_kol,
            (jur7_rasxodSum.summa + jur7_internal_rasxodSum.summa) AS rasxod,
            (jur7_rasxodSum.kol + jur7_internal_rasxodSum.kol) AS rasxod_kol
        FROM jur7_prixodSum, jur7_rasxodSum, jur7_internal_rasxodSum, jur7_internal_PrixodSum
    `;

    const result = await db.query(query, params);
    return result[0];
  }

  static async getSaldoDate(params, year = null) {
    let year_filter = ``;

    if (year) {
      params.push(year);
      year_filter = `AND year = $${params.length}`;
    }
    const query = `--sql
      SELECT
        DISTINCT
          year, month
      FROM saldo_naimenovanie_jur7
      WHERE region_id = $1
        AND isdeleted = false
        AND main_schet_id = $2
        AND main_schet_id = $3
        ${year_filter}

      ORDER BY year DESC, month DESC
    `;

    const result = await db.query(query, params);

    return result;
  }

  static async history(params, responsible_id = null) {
    let resposnible_filter = ``;

    if (responsible_id) {
      params.push(responsible_id);
      resposnible_filter = `AND jsh.id = $${params.length}`;
    }

    const query = `--sql
      SELECT
        ch.kol::FLOAT,
        ch.summa_s_nds::FLOAT AS                   summa,
        ch.iznos_summa::FLOAT,
        d.kimga_id AS                              responsible_id,
        'prixod' AS                                type,
        ch.naimenovanie_tovarov_jur7_id AS         product_id
      FROM document_prixod_jur7 d
      JOIN users AS u ON u.id = d.user_id
      JOIN regions AS r ON r.id = u.region_id
      JOIN document_prixod_jur7_child ch ON d.id = ch.document_prixod_jur7_id
      JOIN spravochnik_javobgar_shaxs_jur7 jsh ON jsh.id = d.kimga_id
      WHERE d.isdeleted = false
          AND ch.isdeleted = false
          AND d.doc_date BETWEEN $1 AND $2
          AND r.id = $3
          AND d.main_schet_id = $4
          ${resposnible_filter}
      
      UNION ALL 
      
      SELECT
        ch.kol::FLOAT,
        ch.summa::FLOAT,
        ch.iznos_summa::FLOAT,
        d.kimga_id AS                                 responsible_id,
        'prixod_internal' AS                          type,
        ch.naimenovanie_tovarov_jur7_id AS            product_id
      FROM document_vnutr_peremesh_jur7 d
      JOIN users AS u ON u.id = d.user_id
      JOIN regions AS r ON r.id = u.region_id
      JOIN document_vnutr_peremesh_jur7_child ch ON d.id = ch.document_vnutr_peremesh_jur7_id
      JOIN spravochnik_javobgar_shaxs_jur7 jsh ON jsh.id = d.kimga_id
      WHERE d.isdeleted = false
          AND ch.isdeleted = false
          AND d.doc_date BETWEEN $1 AND $2
          AND r.id = $3
          AND d.main_schet_id = $4
          ${resposnible_filter}
      
      UNION ALL

      SELECT
        ch.kol::FLOAT,
        ch.summa::FLOAT,
        ch.iznos_summa::FLOAT,
        d.kimdan_id AS                            responsible_id,
        'rasxod' AS                                type,
        ch.naimenovanie_tovarov_jur7_id AS         product_id
      FROM document_rasxod_jur7 d
      JOIN users AS u ON u.id = d.user_id
      JOIN regions AS r ON r.id = u.region_id
      JOIN document_rasxod_jur7_child ch ON d.id = ch.document_rasxod_jur7_id
      JOIN spravochnik_javobgar_shaxs_jur7 jsh ON jsh.id = d.kimdan_id
      WHERE d.isdeleted = false
          AND ch.isdeleted = false
          AND d.doc_date BETWEEN $1 AND $2
          AND r.id = $3
          AND d.main_schet_id = $4
          ${resposnible_filter}

      UNION ALL

      SELECT
        ch.kol::FLOAT,
        ch.summa::FLOAT,
        ch.iznos_summa::FLOAT,
        d.kimdan_id AS                             responsible_id,
        'rasxod_internal' AS                       type,
        ch.naimenovanie_tovarov_jur7_id AS         product_id
      FROM document_vnutr_peremesh_jur7 d
      JOIN users AS u ON u.id = d.user_id
      JOIN regions AS r ON r.id = u.region_id
      JOIN document_vnutr_peremesh_jur7_child ch ON d.id = ch.document_vnutr_peremesh_jur7_id
      JOIN spravochnik_javobgar_shaxs_jur7 jsh ON jsh.id = d.kimdan_id
      WHERE d.isdeleted = false
          AND ch.isdeleted = false
          AND d.doc_date BETWEEN $1 AND $2
          AND r.id = $3
          AND d.main_schet_id = $4
          ${resposnible_filter}
    `;

    const result = await db.query(query, params);

    return result;
  }

  static async getSummaBySchet(params, responsible_id = null) {
    let resposnible_filter = ``;

    if (responsible_id) {
      params.push(responsible_id);
      resposnible_filter = `AND jsh.id = $${params.length}`;
    }

    const query = `--sql
      WITH prixod AS (
        SELECT
        ch.summa_s_nds::FLOAT AS summa
      FROM document_prixod_jur7 d
      JOIN users AS u ON u.id = d.user_id
      JOIN regions AS r ON r.id = u.region_id
      JOIN document_prixod_jur7_child ch ON d.id = ch.document_prixod_jur7_id
      JOIN spravochnik_javobgar_shaxs_jur7 jsh ON jsh.id = d.kimga_id
      WHERE d.isdeleted = false
          AND ch.isdeleted = false
          AND EXTRACT(YEAR FROM d.doc_date) = $1
          AND EXTRACT(MONTH FROM d.doc_date) = ANY($2)
          AND r.id = $3
          AND d.main_schet_id = $4
          AND ch.debet_schet = $5
          ${resposnible_filter}
      ),

      internal_prixod AS (
        SELECT
          ch.summa::FLOAT
        FROM document_vnutr_peremesh_jur7 d
        JOIN users AS u ON u.id = d.user_id
        JOIN regions AS r ON r.id = u.region_id
        JOIN document_vnutr_peremesh_jur7_child ch ON d.id = ch.document_vnutr_peremesh_jur7_id
        JOIN spravochnik_javobgar_shaxs_jur7 jsh ON jsh.id = d.kimga_id
        WHERE d.isdeleted = false
            AND ch.isdeleted = false
            AND EXTRACT(YEAR FROM d.doc_date) = $1
            AND EXTRACT(MONTH FROM d.doc_date) = ANY($2)
            AND r.id = $3
            AND d.main_schet_id = $4
            AND ch.debet_schet = $5 
            ${resposnible_filter}
        ),
      rasxod_rasxod AS (
        SELECT
          ch.summa::FLOAT
        FROM document_rasxod_jur7 d
        JOIN users AS u ON u.id = d.user_id
        JOIN regions AS r ON r.id = u.region_id
        JOIN document_rasxod_jur7_child ch ON d.id = ch.document_rasxod_jur7_id
        JOIN spravochnik_javobgar_shaxs_jur7 jsh ON jsh.id = d.kimdan_id
        WHERE d.isdeleted = false
            AND ch.isdeleted = false
            AND EXTRACT(YEAR FROM d.doc_date) = $1
            AND EXTRACT(MONTH FROM d.doc_date) = ANY($2)
            AND r.id = $3
            AND d.main_schet_id = $4
            AND ch.kredit_schet = $5
            ${resposnible_filter}
      ),
      rasxod_prixod AS (
        SELECT
          ch.summa::FLOAT
        FROM document_rasxod_jur7 d
        JOIN users AS u ON u.id = d.user_id
        JOIN regions AS r ON r.id = u.region_id
        JOIN document_rasxod_jur7_child ch ON d.id = ch.document_rasxod_jur7_id
        JOIN spravochnik_javobgar_shaxs_jur7 jsh ON jsh.id = d.kimdan_id
        WHERE d.isdeleted = false
            AND ch.isdeleted = false
            AND EXTRACT(YEAR FROM d.doc_date) = $1
            AND EXTRACT(MONTH FROM d.doc_date) = ANY($2)
            AND r.id = $3
            AND d.main_schet_id = $4
            AND ch.debet_schet = $5
            ${resposnible_filter}
      ),
      internal_rasxod AS (
        SELECT
          ch.summa::FLOAT
        FROM document_vnutr_peremesh_jur7 d
        JOIN users AS u ON u.id = d.user_id
        JOIN regions AS r ON r.id = u.region_id
        JOIN document_vnutr_peremesh_jur7_child ch ON d.id = ch.document_vnutr_peremesh_jur7_id
        JOIN spravochnik_javobgar_shaxs_jur7 jsh ON jsh.id = d.kimdan_id
        WHERE d.isdeleted = false
            AND ch.isdeleted = false
            AND EXTRACT(YEAR FROM d.doc_date) = $1
            AND EXTRACT(MONTH FROM d.doc_date) = ANY($2)
            AND r.id = $3
            AND d.main_schet_id = $4
            AND ch.kredit_schet = $5
            ${resposnible_filter}
      )

      SELECT 
        (
          COALESCE((
            SELECT SUM(summa) FROM prixod
          ), 0) + COALESCE((
            SELECT SUM(summa) FROM internal_prixod
          ), 0) + COALESCE((
            SELECT SUM(summa) FROM rasxod_prixod
          ), 0) 
        )::FLOAT AS prixod,
        (
          COALESCE((
            SELECT SUM(summa) FROM rasxod_rasxod
          ), 0) + COALESCE((
            SELECT SUM(summa) FROM internal_rasxod
          ), 0)
        )::FLOAT rasxod
    `;

    const result = await db.query(query, params);

    return result[0];
  }

  static async uniqueSchets(params) {
    const query = `--sql
      SELECT d.schet
      FROM group_jur7 d
      WHERE d.isdeleted = false

      UNION

      SELECT ch.kredit_schet AS schet
      FROM document_prixod_jur7 d
      JOIN document_prixod_jur7_child ch ON d.id = ch.document_prixod_jur7_id 
      WHERE d.isdeleted = false
        AND ch.isdeleted = false

      UNION

      SELECT ch.debet_schet AS schet
      FROM document_prixod_jur7 d
      JOIN document_prixod_jur7_child ch ON d.id = ch.document_prixod_jur7_id 
      WHERE d.isdeleted = false
        AND ch.isdeleted = false

      UNION

      SELECT ch.debet_schet AS schet
      FROM document_rasxod_jur7 d
      JOIN document_rasxod_jur7_child ch ON d.id = ch.document_rasxod_jur7_id 
      WHERE d.isdeleted = false
        AND ch.isdeleted = false

      UNION 

      SELECT ch.kredit_schet AS schet
      FROM document_rasxod_jur7 d
      JOIN document_rasxod_jur7_child ch ON d.id = ch.document_rasxod_jur7_id 
      WHERE d.isdeleted = false
        AND ch.isdeleted = false

      UNION

      SELECT ch.debet_schet AS schet
      FROM document_vnutr_peremesh_jur7 d
      JOIN document_vnutr_peremesh_jur7_child ch ON d.id = ch.document_vnutr_peremesh_jur7_id 
      WHERE d.isdeleted = false
        AND ch.isdeleted = false

      UNION
      
      SELECT d.debet_schet AS schet
      FROM saldo_naimenovanie_jur7 d
      WHERE d.isdeleted = false

      UNION 

      SELECT ch.kredit_schet AS schet
      FROM document_vnutr_peremesh_jur7 d
      JOIN document_vnutr_peremesh_jur7_child ch ON d.id = ch.document_vnutr_peremesh_jur7_id 
      WHERE d.isdeleted = false
        AND ch.isdeleted = false
      
      ORDER BY schet
    `;

    const result = await db.query(query, params);

    return result;
  }

  static async getSchetSummaBySaldo(params) {
    const query = `--sql
      SELECT
        COALESCE(SUM(summa), 0)::FLOAT AS summa
      FROM saldo_naimenovanie_jur7
      WHERE  isdeleted = false
          AND year = $1
          AND month = $2
          AND region_id = $3
          AND main_schet_id = $4
          AND debet_schet = $5
          AND (type = 'saldo' OR type = 'import') 
    `;

    const result = await db.query(query, params);

    return result[0];
  }
};
