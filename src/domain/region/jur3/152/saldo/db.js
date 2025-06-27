const { db } = require("@db/index");

exports.Saldo152DB = class {
  static async create(params, client) {
    const query = `--sql
        INSERT INTO saldo_152 (
            main_schet_id,
            year,
            month,
            user_id,
            budjet_id,
            date_saldo,
            schet_id,
            created_at,
            updated_at
        ) 
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id
    `;

    const result = await client.query(query, params);

    return result.rows[0];
  }

  static async deleteByMonth(params, client) {
    await client.query(
      `--sql
      UPDATE
        saldo_152_child
      SET isdeleted = true
      WHERE id = ANY(
        SELECT
          ch.id
        FROM saldo_152_child ch
        JOIN saldo_152 d ON d.id = ch.parent_id
        WHERE d.year = $1
          AND d.month = $2
          AND d.main_schet_id = $3
          AND d.schet_id = $4
      )
    `,
      params
    );

    await client.query(
      `UPDATE saldo_152 SET isdeleted = true WHERE year = $1 AND month = $2 AND main_schet_id = $3 AND schet_id = $4`,
      params
    );
  }

  static async deleteChild(params, client) {
    await client.query(
      `--sql
      UPDATE
        saldo_152_child
      SET isdeleted = true
      WHERE parent_id = $1 
    `,
      params
    );
  }

  static async createChild(params, client) {
    const query = `--sql
        INSERT INTO saldo_152_child (
          organization_id,
          parent_id,
          prixod,
          rasxod,  
          created_at,
          updated_at
        ) 
        VALUES($1, $2, $3, $4, $5, $6)
        RETURNING id
    `;

    await client.query(query, params);
  }

  static async get(params, main_schet_id = null, year = null, month = null, schet_id = null) {
    let conditions = [];

    if (main_schet_id) {
      params.push(main_schet_id);
      conditions.push(` d.main_schet_id = $${params.length}`);
    }

    if (schet_id) {
      params.push(schet_id);
      conditions.push(` d.schet_id = $${params.length}`);
    }

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
        SELECT 
            d.*,
            false AS isdeleted,
            COALESCE( (
              SELECT
                JSON_AGG(ROW_TO_JSON(ch))
              FROM (
                SELECT
                  ch.*,
                  o.name
                FROM saldo_152_child ch
                JOIN spravochnik_organization o ON o.id = ch.organization_id
                WHERE ch.parent_id = d.id
                  AND ch.isdeleted = false          
              ) AS ch
            ), '[]'::JSON ) AS childs,
            m.account_number,
            op.schet,
            u.login,
            u.fio
        FROM saldo_152 AS d  
        JOIN main_schet m ON d.main_schet_id = m.id
        JOIN jur_schets op ON op.id = d.schet_id
        JOIN users AS u ON d.user_id = u.id
        JOIN regions AS r ON u.region_id = r.id
        WHERE d.isdeleted = false
          AND d.budjet_id = $1
          AND r.id = $2
          ${where}
        ORDER BY d.date_saldo DESC
    `;

    const result = await db.query(query, params);

    return result;
  }

  static async getById(params, isdeleted) {
    const query = `--sql
        SELECT 
            d.*,
            0 AS prixod,
            0 AS rasxod,
            COALESCE( (
              SELECT
                JSON_AGG(ROW_TO_JSON(ch))
              FROM (
                SELECT
                  ch.*,
                  o.name,
                  o.inn,
                  o.bank_klient,
                  o.mfo,
                (ch.prixod - ch.rasxod)::FLOAT AS summa
                FROM saldo_152_child ch
                JOIN spravochnik_organization o ON o.id = ch.organization_id
                WHERE ch.parent_id = d.id
                  AND ch.isdeleted = false          
              ) AS ch
            ), '[]'::JSON ) AS childs,
            m.account_number,
            op.schet
        FROM saldo_152 AS d
        JOIN users AS u ON d.user_id = u.id
        JOIN regions AS r ON u.region_id = r.id
        JOIN main_schet m ON d.main_schet_id = m.id
        JOIN jur_schets op ON op.id = d.schet_id
        WHERE r.id = $1 
            AND d.id = $2
            AND d.budjet_id = $3
            ${!isdeleted ? "AND d.isdeleted = false" : ""}
    `;

    const result = await db.query(query, params);

    return result[0];
  }

  static async getByMonth(params) {
    const query = `--sql
      SELECT 
          d.*,
          COALESCE( (
            SELECT
              JSON_AGG(ROW_TO_JSON(ch))
            FROM (
              SELECT
                ch.*,
                o.name,
                o.inn,
                o.bank_klient,
                o.mfo,
                (ch.prixod - ch.rasxod)::FLOAT AS summa
              FROM saldo_152_child ch
              JOIN spravochnik_organization o ON o.id = ch.organization_id
              WHERE ch.parent_id = d.id
                AND ch.isdeleted = false          
            ) AS ch
          ), '[]'::JSON ) AS childs,
          m.account_number,
          op.schet
        FROM saldo_152 AS d  
        JOIN users AS u ON d.user_id = u.id
        JOIN regions AS r ON u.region_id = r.id
        JOIN main_schet m ON d.main_schet_id = m.id
        JOIN jur_schets op ON op.id = d.schet_id
        WHERE d.isdeleted = false
          AND d.main_schet_id = $1
          AND year = $2
          AND month = $3
          AND r.id = $4
          AND d.schet_id = $5
    `;

    const result = await db.query(query, params);

    return result[0];
  }

  static async cleanData(params, client) {
    const queryParent = `UPDATE saldo_152 SET isdeleted = true WHERE main_schet_id = $1 AND schet_id = $2`;

    const queryChild = `--sql
      UPDATE
        saldo_152_child
      SET isdeleted = true
      WHERE id = ANY(
        SELECT
          ch.id
        FROM saldo_152_child ch
        JOIN saldo_152 d ON d.id = ch.parent_id
        WHERE d.main_schet_id = $1
          AND d.schet_id = $2
      )
    `;

    const queryDate = `UPDATE date_saldo_152 SET isdeleted = true WHERE main_schet_id = $1 AND schet_id = $2`;

    await client.query(queryParent, params);

    await client.query(queryChild, params);

    await client.query(queryDate, params);
  }

  static async getFirstSaldo(params) {
    const query = `--sql
      SELECT 
          d.*
      FROM saldo_152 d
      JOIN users AS u ON u.id = d.user_id
      JOIN regions AS r ON r.id = u.region_id
      WHERE r.id = $1
          AND d.main_schet_id = $2
          AND d.schet_id = $3
          AND d.isdeleted = false
      ORDER BY d.date_saldo ASC
      LIMIT 1
    `;

    const result = await db.query(query, params);

    return result[0];
  }

  static async getEndSaldo(params) {
    const query = `--sql
      SELECT 
          d.*
      FROM saldo_152 d
      JOIN users AS u ON u.id = d.user_id
      JOIN regions AS r ON r.id = u.region_id
      WHERE r.id = $1
          AND d.main_schet_id = $2
          AND d.schet_id = $3
          AND d.isdeleted = false
      ORDER BY d.date_saldo DESC
      LIMIT 1
    `;

    const result = await db.query(query, params);

    return result[0];
  }

  static async getSaldoDate(params, client) {
    const _db = client || db;
    const query = `--sql
      SELECT 
        DISTINCT d.year, d.month, d.id
      FROM saldo_152 d
      JOIN users AS u ON u.id = d.user_id
      JOIN regions AS r ON r.id = u.region_id
      WHERE r.id = $1
          AND d.date_saldo > $2
          AND d.main_schet_id = $3
          AND d.schet_id = $4
          AND d.isdeleted = false
      ORDER BY year, month
    `;

    const data = await _db.query(query, params);

    const response = client ? data.rows : data;

    return response;
  }

  static async createSaldoDate(params, client) {
    const query = `--sql
      INSERT INTO date_saldo_152(
          user_id, 
          year, 
          month,
          main_schet_id,
          schet_id,
          doc_id,
          budjet_id,
          created_at,
          updated_at
      ) 
      VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *
    `;

    const result = await client.query(query, params);

    return result.rows[0];
  }

  static async deleteSaldoDateByMonth(params, client) {
    await client.query(`UPDATE date_saldo_152 SET isdeleted = true WHERE doc_id = $1`, params);
  }

  static async getDateSaldo(params) {
    const query = `--sql
      SELECT 
        DISTINCT d.year, d.month, d.doc_id, d.main_schet_id, d.budjet_id, d.schet_id
      FROM date_saldo_152 d
      JOIN users AS u ON u.id = d.user_id
      JOIN regions AS r ON r.id = u.region_id
      WHERE r.id = $1
          AND d.main_schet_id = $2 
          AND d.schet_id = $3
          AND d.isdeleted = false
      ORDER BY year, month
    `;

    const result = await db.query(query, params);

    return result;
  }

  static async delete(params, client) {
    const queryParent = `UPDATE saldo_152 SET isdeleted = true WHERE id = $1 RETURNING id`;

    const result = await client.query(queryParent, params);

    return result.rows[0];
  }
};
