const { db } = require("@db/index");
const { sqlFilter } = require(`@helper/functions`);

exports.Jur7MonitoringDB = class {
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
            AND d.budjet_id = $4
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
            AND d.budjet_id = $4
            AND ch.isdeleted = false
        GROUP BY ch.debet_schet,
            ch.kredit_schet,
            ch.debet_sub_schet
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
              *,
              d.debet_schet AS                           schet,
              j.fio,
              JSON_BUILD_OBJECT(
                'sena', d.sena::FLOAT,
                'summa', d.summa::FLOAT,
                'iznos_summa', d.iznos_summa::FLOAT,
                'kol', d.kol::FLOAT
              ) AS                                        from
            FROM saldo_naimenovanie_jur7 d
            JOIN spravochnik_javobgar_shaxs_jur7 j ON j.id = d.kimning_buynida
            WHERE d.year = $1
              AND d.month = $2
              AND d.region_id = $3
              AND d.budjet_id = $4
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
            AND d.budjet_id = $2
            AND d.debet_schet = $3
            AND d.kimning_buynida = $4
            AND d.year = $5
            AND d.month = $6
    `;

    const result = await db.query(query, params);
    return result;
  }

  static async getSummaReport(
    params,
    operator,
    responsible_id = null,
    product_id = null
  ) {
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
            WHERE d.budjet_id = $1 AND
              ch.debet_schet = $2
              AND d.doc_date ${internal_filter}
              ${responsible_id ? sqlFilter("d.kimga_id", index_responsible_id) : ""} ${product_filter} 
        ),
        jur7_rasxodSum AS (
            SELECT COALESCE(SUM(ch.summa), 0)::FLOAT AS summa, COALESCE(SUM(ch.kol), 0)::FLOAT AS kol
            FROM document_rasxod_jur7 d
            JOIN document_rasxod_jur7_child ch ON ch.document_rasxod_jur7_id = d.id
            WHERE d.budjet_id = $1
              AND  ch.kredit_schet = $2
              AND d.doc_date ${internal_filter}
              ${responsible_id ? sqlFilter("d.kimdan_id", index_responsible_id) : ""} ${product_filter}
        ),
        jur7_internal_rasxodSum AS (
            SELECT COALESCE(SUM(ch.summa), 0)::FLOAT AS summa, COALESCE(SUM(ch.kol), 0)::FLOAT AS kol
            FROM document_vnutr_peremesh_jur7 d
            JOIN document_vnutr_peremesh_jur7_child ch ON ch.document_vnutr_peremesh_jur7_id = d.id
            WHERE d.budjet_id = $1
              AND  ch.kredit_schet = $2
              AND d.doc_date ${internal_filter}
              ${responsible_id ? sqlFilter("d.kimdan_id", index_responsible_id) : ""} ${product_filter}
        ),
        jur7_internal_PrixodSum AS (
            SELECT COALESCE(SUM(ch.summa), 0)::FLOAT AS summa, COALESCE(SUM(ch.kol), 0)::FLOAT AS kol
            FROM document_vnutr_peremesh_jur7 d
            JOIN document_vnutr_peremesh_jur7_child ch ON ch.document_vnutr_peremesh_jur7_id = d.id
            WHERE d.budjet_id = $1
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
        AND budjet_id = $2
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
      JOIN document_prixod_jur7_child ch ON d.id = ch.document_prixod_jur7_id
      JOIN spravochnik_javobgar_shaxs_jur7 jsh ON jsh.id = d.kimga_id
      WHERE d.isdeleted = false
          AND ch.isdeleted = false
          AND d.doc_date BETWEEN $1 AND $2
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
      JOIN document_vnutr_peremesh_jur7_child ch ON d.id = ch.document_vnutr_peremesh_jur7_id
      JOIN spravochnik_javobgar_shaxs_jur7 jsh ON jsh.id = d.kimga_id
      WHERE d.isdeleted = false
          AND ch.isdeleted = false
          AND d.doc_date BETWEEN $1 AND $2
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
      JOIN document_rasxod_jur7_child ch ON d.id = ch.document_rasxod_jur7_id
      JOIN spravochnik_javobgar_shaxs_jur7 jsh ON jsh.id = d.kimdan_id
      WHERE d.isdeleted = false
          AND ch.isdeleted = false
          AND d.doc_date BETWEEN $1 AND $2
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
      JOIN document_vnutr_peremesh_jur7_child ch ON d.id = ch.document_vnutr_peremesh_jur7_id
      JOIN spravochnik_javobgar_shaxs_jur7 jsh ON jsh.id = d.kimdan_id
      WHERE d.isdeleted = false
          AND ch.isdeleted = false
          AND d.doc_date BETWEEN $1 AND $2
          ${resposnible_filter}
    `;

    const result = await db.query(query, params);

    return result;
  }
};
