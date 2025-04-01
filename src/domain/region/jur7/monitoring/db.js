const { db } = require("@db/index");

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

  static async getBySchetProducts(params) {
    const query = `--sql
        SELECT 
            n.id,
            TO_CHAR(d_j.doc_date, 'YYYY-MM-DD') AS doc_date, 
            n.id, 
            n.edin,
            n.name
        FROM document_prixod_jur7  d_j
        JOIN users AS u ON u.id = d_j.user_id
        JOIN regions r ON r.id = u.region_id
        JOIN document_prixod_jur7_child d_ch ON d_ch.document_prixod_jur7_id = d_j.id
        JOIN naimenovanie_tovarov_jur7 n ON n.id = d_ch.naimenovanie_tovarov_jur7_id
        WHERE d_j.isdeleted = false 
            AND r.id = $1
            AND d_j.budjet_id = $2
            AND d_ch.debet_schet = $3
            AND d_j.kimga_id = $4
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
      product_filter = `AND d_j_ch.naimenovanie_tovarov_jur7_id = $${params.length + 1}`;
      params.push(product_id);
    }

    const query = `--sql
        WITH 
        jur7_prixodSum AS (
            SELECT COALESCE(SUM(d_j_ch.summa), 0::FLOAT) AS summa, COALESCE(SUM(d_j_ch.kol), 0)::FLOAT AS kol
            FROM document_prixod_jur7 d_j
            JOIN document_prixod_jur7_child d_j_ch ON d_j_ch.document_prixod_jur7_id = d_j.id
            WHERE d_j.budjet_id = $1 AND  d_j_ch.debet_schet = $2 AND d_j.doc_date ${internal_filter}
            ${responsible_id ? sqlFilter("d_j.kimga_id", index_responsible_id) : ""} ${product_filter} 
        ),
        jur7_rasxodSum AS (
            SELECT COALESCE(SUM(d_j_ch.summa), 0)::FLOAT AS summa, COALESCE(SUM(d_j_ch.kol), 0)::FLOAT AS kol
            FROM document_rasxod_jur7 d_j
            JOIN document_rasxod_jur7_child d_j_ch ON d_j_ch.document_rasxod_jur7_id = d_j.id
            WHERE d_j.budjet_id = $1 AND  d_j_ch.kredit_schet = $2 AND d_j.doc_date ${internal_filter}
            ${responsible_id ? sqlFilter("d_j.kimdan_id", index_responsible_id) : ""} ${product_filter}
        ),
        jur7_internal_rasxodSum AS (
            SELECT COALESCE(SUM(d_j_ch.summa), 0)::FLOAT AS summa, COALESCE(SUM(d_j_ch.kol), 0)::FLOAT AS kol
            FROM document_vnutr_peremesh_jur7 d_j
            JOIN document_vnutr_peremesh_jur7_child d_j_ch ON d_j_ch.document_vnutr_peremesh_jur7_id = d_j.id
            WHERE d_j.budjet_id = $1 AND  d_j_ch.kredit_schet = $2 AND d_j.doc_date ${internal_filter}
            ${responsible_id ? sqlFilter("d_j.kimdan_id", index_responsible_id) : ""} ${product_filter}
        ),
        jur7_internal_PrixodSum AS (
            SELECT COALESCE(SUM(d_j_ch.summa), 0)::FLOAT AS summa, COALESCE(SUM(d_j_ch.kol), 0)::FLOAT AS kol
            FROM document_vnutr_peremesh_jur7 d_j
            JOIN document_vnutr_peremesh_jur7_child d_j_ch ON d_j_ch.document_vnutr_peremesh_jur7_id = d_j.id
            WHERE d_j.budjet_id = $1 AND  d_j_ch.debet_schet = $2 AND d_j.doc_date ${internal_filter}
            ${responsible_id ? sqlFilter("d_j.kimga_id", index_responsible_id) : ""} ${product_filter}
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
};
