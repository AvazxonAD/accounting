const { db } = require(`@db/index`);

exports.Jur8MonitoringDB = class {
  static async update(params, client) {
    const query = `--sql
      UPDATE jur8_monitoring
      SET
        year = $1,
        month = $2,
        updated_at = $3
      WHERE id = $4
      RETURNING id
    `;

    const result = await client.query(query, params);

    return result.rows[0];
  }

  static async deleteChild(params, client) {
    await client.query(
      `UPDATE jur8_monitoring_child SET isdeleted = true WHERE parent_id = $1`,
      params
    );
  }

  static async delete(params, client) {
    const queryChild = `UPDATE jur8_monitoring_child SET isdeleted = true WHERE parent_id = $1`;

    const queryParent = `UPDATE jur8_monitoring SET isdeleted = true WHERE id = $1 RETURNING id`;

    await client.query(queryChild, params);
    const result = await client.query(queryParent, params);

    return result.rows[0];
  }

  static async getById(params, isdeleted = null) {
    const query = `--sql
      SELECT
        d.*,
        (
          SELECT
            COALESCE(SUM(ch.summa))
          FROM jur8_monitoring_child ch
          WHERE parent_id = d.id
            AND isdeleted = false
        )::FLOAT AS summa
      FROM jur8_monitoring AS d
      JOIN users u ON u.id = d.user_id
      JOIN regions r ON r.id = u.region_id
      WHERE d.main_schet_id = $1
        AND r.id = $2
        AND d.id = $3
        ${!isdeleted ? "AND d.isdeleted = false" : ""}
    `;

    const result = await db.query(query, params);

    return result[0];
  }

  static async getChilds(params) {
    const query = `--sql
      SELECT
        ch.*,
        schet.schet,
        schet.name AS schet_name,
        TO_CHAR(ch.doc_date, 'YYYY-MM-DD') AS doc_date
      FROM jur8_monitoring_child ch
      JOIN region_prixod_schets sch ON sch.id = ch.schet_id
      JOIN prixod_schets schet ON schet.id = sch.schet_id 
      WHERE ch.parent_id = $1
        AND ch.isdeleted = false 
    `;

    const result = await db.query(query, params);

    return result;
  }

  static async getDoc(params, child_table_name) {
    let table_name = ``;
    let concat = ``;

    if (child_table_name === "kassa_prixod_child") {
      table_name = "kassa_prixod";
      concat = "kassa_prixod_id";
    } else if (child_table_name === "bank_prixod_child") {
      table_name = "bank_prixod";
      concat = "id_bank_prixod";
    } else if (child_table_name === "document_prixod_jur7_child") {
      table_name = "document_prixod_jur7";
      concat = "document_prixod_jur7_id";
    } else {
      table_name = "kursatilgan_hizmatlar_jur152";
      concat = "kursatilgan_hizmatlar_jur152_id";
    }

    const query = `--sql
      SELECT
        d.doc_num,
        d.doc_date,
        d.id AS document_id,
        d.opisanie
      FROM ${child_table_name} ch
      JOIN ${table_name} d ON d.id = ch.${concat}
      WHERE ch.id = $1
    `;

    const result = await db.query(query, params);

    return result[0];
  }

  static async get(params, year = null, month = null) {
    const conditions = [];

    if (year) {
      params.push(year);
      conditions.push(`d.year = $${params.length}`);
    }

    if (month) {
      params.push(month);
      conditions.push(`d.month = $${params.length}`);
    }

    const where = conditions.length ? `AND ${conditions.join(` AND `)}` : "";

    const query = `--sql
      WITH data AS (
        SELECT
          d.*,
          (
            SELECT
              COALESCE(SUM(ch.summa))
            FROM jur8_monitoring_child ch
            WHERE parent_id = d.id
              AND isdeleted = false
          )::FLOAT AS summa,
          u.login,
          u.fio
        FROM jur8_monitoring AS d
        JOIN users u ON u.id = d.user_id
        JOIN regions r ON r.id = u.region_id
        WHERE d.main_schet_id = $1
          AND d.isdeleted = false
          AND r.id = $2
          ${where}
        
        OFFSET $3 LIMIT $4
      )
      
      SELECT 
        COALESCE(JSON_AGG(ROW_TO_JSON(data)), '[]'::JSON) AS data,
        (
          SELECT
            COALESCE(COUNT(d.id), 0)
          FROM jur8_monitoring d
          JOIN users u ON u.id = d.user_id
          JOIN regions r ON r.id = u.region_id
          WHERE d.main_schet_id = $1
            AND d.isdeleted = false
            AND r.id = $2
            ${where}
        )::INTEGER AS total,

        (
          SELECT
            COALESCE(SUM(ch.summa), 0)
          FROM jur8_monitoring d
          JOIN jur8_monitoring_child ch ON ch.parent_id = d.id
          JOIN users u ON u.id = d.user_id
          JOIN regions r ON r.id = u.region_id
          WHERE d.main_schet_id = $1
            AND d.isdeleted = false
            AND r.id = $2
            ${where}
        )::FLOAT AS summa
      FROM data
    `;

    const result = await db.query(query, params);

    return result[0];
  }

  static async create(params, client) {
    const query = `--sql
      INSERT INTO jur8_monitoring (year, month, main_schet_id, user_id, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $5)
      RETURNING id
    `;

    const doc = await client.query(query, params);

    return doc.rows[0];
  }

  static async createChild(params, client) {
    const query = `--sql
      INSERT INTO jur8_monitoring_child (schet_id, parent_id, summa, type_doc, doc_id, rasxod_schet, doc_num, doc_date, schet, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $10)
    `;

    await client.query(query, params);
  }

  static async getPrixod(params) {
    const query = `--sql
      SELECT
        d.doc_num,
        TO_CHAR(d.doc_date, 'YYYY-MM-DD') AS doc_date,
        d.opisanie,
        ch.id AS doc_id,
        op.schet AS rasxod_schet,
        ch.summa::FLOAT,
        d.id AS document_id,
        'kassa_prixod_child' AS type_doc,
        m.jur1_schet AS schet
      FROM kassa_prixod d 
      JOIN kassa_prixod_child ch ON ch.kassa_prixod_id = d.id
      JOIN users u ON u.id = d.user_id
      JOIN regions r ON r.id = u.region_id
      JOIN main_schet m ON m.id = d.main_schet_id
      JOIN spravochnik_operatsii op ON op.id = ch.spravochnik_operatsii_id
      WHERE m.id = $1
        AND d.isdeleted = false
        AND d.doc_date BETWEEN $2 AND $3
        AND op.schet = ANY($4)
        AND r.id = $5
        AND m.isdeleted = false
      
      UNION ALL

      SELECT
        d.doc_num,
        TO_CHAR(d.doc_date, 'YYYY-MM-DD') AS doc_date,
        d.opisanie,
        ch.id AS doc_id,
        op.schet rasxod_schet,
        ch.summa::FLOAT,
        d.id AS document_id,
        'bank_prixod_child' AS type_doc,
        m.jur2_schet AS schet
      FROM bank_prixod d 
      JOIN bank_prixod_child ch ON ch.id_bank_prixod  = d.id
      JOIN users u ON u.id = d.user_id
      JOIN regions r ON r.id = u.region_id
      JOIN main_schet m ON m.id = d.main_schet_id
      JOIN spravochnik_operatsii op ON op.id = ch.spravochnik_operatsii_id
      WHERE m.id = $1
        AND d.isdeleted = false
        AND d.doc_date BETWEEN $2 AND $3
        AND op.schet = ANY($4)
        AND r.id = $5
        AND m.isdeleted = false

      UNION ALL
      
      SELECT
        d.doc_num,
        TO_CHAR(d.doc_date, 'YYYY-MM-DD') AS doc_date,
        d.opisanie,
        ch.id AS doc_id,
        ch.kredit_schet AS rasxod_schet,
        ch.summa_s_nds::FLOAT AS summa,
        d.id AS document_id,
        'document_prixod_jur7_child' AS type_doc,
        ch.debet_schet AS schet
      FROM document_prixod_jur7 d 
      JOIN document_prixod_jur7_child ch ON ch.document_prixod_jur7_id  = d.id
      JOIN users u ON u.id = d.user_id
      JOIN regions r ON r.id = u.region_id
      JOIN main_schet m ON m.id = d.main_schet_id
      WHERE m.id = $1
        AND d.isdeleted = false
        AND d.doc_date BETWEEN $2 AND $3
        AND ch.kredit_schet = ANY($4)
        AND r.id = $5
        AND m.isdeleted = false
        AND ch.isdeleted = false
    `;

    const result = await db.query(query, params);

    return result;
  }
};
