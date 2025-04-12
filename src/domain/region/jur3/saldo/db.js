const { db } = require("@db/index");

exports.Jur3SaldoDB = class {
  static async getFirstSaldo(params) {
    const query = `--sql
      SELECT 
          d.*
      FROM jur3_saldo d
      JOIN users AS u ON u.id = d.user_id
      JOIN regions AS r ON r.id = u.region_id
      WHERE r.id = $1
          AND d.main_schet_id = $2
          AND d.schet_id = $3
          AND d.isdeleted = false
      ORDER BY d.created_at ASC
      LIMIT 1
    `;

    const result = await db.query(query, params);

    return result[0];
  }

  static async cleanData(params, client) {
    const queryParent = `UPDATE jur3_saldo SET isdeleted = true WHERE main_schet_id = $1 AND schet_id = $2`;
    const queryChild = `UPDATE date_saldo_jur3 SET isdeleted = true WHERE main_schet_id = $1 AND schet_id = $2`;

    await client.query(queryParent, params);
    await client.query(queryChild, params);
  }

  static async getDateSaldo(params) {
    const query = `--sql
      SELECT 
        DISTINCT d.year, d.month
      FROM date_saldo_jur3 d
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

  static async createSaldoDate(params, client) {
    const query = `--sql
      INSERT INTO date_saldo_jur3(
          user_id, 
          year, 
          month,
          main_schet_id,
          schet_id,
          created_at,
          updated_at
      ) 
      VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *
    `;

    const result = await client.query(query, params);

    return result.rows[0];
  }

  static async getSaldoDate(params, client) {
    const _db = client || db;
    const query = `--sql
      SELECT 
        DISTINCT d.year, d.month
      FROM jur3_saldo d
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

  static async getByMonth(params) {
    const query = `--sql
      SELECT 
            d.*,
            d.summa::FLOAT
        FROM jur3_saldo AS d
        JOIN users AS u ON d.user_id = u.id
        JOIN regions AS r ON u.region_id = r.id
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

  static async create(params, client) {
    const _db = client || db;

    const query = `--sql
        INSERT INTO jur3_saldo (
            summa,
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
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING id
    `;

    const result = await _db.query(query, params);

    return result[0] || result.rows[0];
  }

  static async get(
    params,
    main_schet_id = null,
    year = null,
    month = null,
    schet_id = null
  ) {
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
            d.summa::FLOAT,
            m.account_number,
            op.schet
        FROM jur3_saldo AS d  
        JOIN main_schet m ON d.main_schet_id = m.id
        JOIN jur_schets op ON op.id = d.schet_id
        JOIN users AS u ON d.user_id = u.id
        JOIN regions AS r ON u.region_id = r.id
        WHERE d.isdeleted = false
          AND d.budjet_id = $1
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
            d.summa::FLOAT
        FROM jur3_saldo AS d
        JOIN users AS u ON d.user_id = u.id
        JOIN regions AS r ON u.region_id = r.id
        WHERE r.id = $1 
            AND d.id = $2
            AND d.budjet_id = $3
            ${!isdeleted ? "AND d.isdeleted = false" : ""}
    `;

    const result = await db.query(query, params);

    return result[0];
  }

  static async update(params, client) {
    const _db = client || db;

    const query = `--sql
        UPDATE jur3_saldo SET 
            summa = $1,
            updated_at = $2
        WHERE id = $3
        RETURNING id
    `;

    const result = await _db.query(query, params);

    return result[0] || result.rows[0];
  }

  static async delete(params) {
    const result = await db.query(
      `UPDATE jur3_saldo SET isdeleted = true WHERE id = $1 RETURNING id`,
      params
    );

    return result[0];
  }

  static async deleteByMonth(params, client) {
    await client.query(
      `UPDATE jur3_saldo SET isdeleted = true WHERE year = $1 AND month = $2 AND main_schet_id = $3 AND schet_id = $4`,
      params
    );
  }

  static async deleteSaldoDateByMonth(params, client) {
    await client.query(
      `UPDATE date_saldo_jur3 SET isdeleted = true WHERE year = $1 AND month = $2 AND main_schet_id = $3 AND schet_id = $4`,
      params
    );
  }
};
