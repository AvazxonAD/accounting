const { db } = require("@db/index");

exports.KassaSaldoDB = class {
  static async getByMonth(params) {
    const query = `--sql
      SELECT 
            d.*,
            d.summa::FLOAT
        FROM kassa_saldo AS d
        JOIN users AS u ON d.user_id = u.id
        JOIN regions AS r ON u.region_id = r.id
        WHERE d.isdeleted = false
          AND d.main_schet_id = $1
          AND year = $2
          AND month = $3
          AND r.id = $4
    `;

    const result = await db.query(query, params);

    return result[0];
  }

  static async create(params) {
    const query = `--sql
        INSERT INTO kassa_saldo (
            summa,
            main_schet_id,
            year,
            month,
            user_id,
            budjet_id,
            created_at,
            updated_at
        ) 
        VALUES($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id
    `;

    const result = await db.query(query, params);

    return result[0];
  }

  static async get(params, main_schet_id = null, year = null, month = null) {
    let conditions = [];

    if (main_schet_id) {
      params.push(main_schet_id);
      conditions.push(` d.main_schet_id = $${params.length}`);
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
            d.summa::FLOAT
        FROM kassa_saldo AS d
        JOIN users AS u ON d.user_id = u.id
        JOIN regions AS r ON u.region_id = r.id
        WHERE d.isdeleted = false
          AND d.budjet_id = $1
          ${where}
    `;

    const result = await db.query(query, params);

    return result;
  }

  static async getById(params, isdeleted) {
    const query = `--sql
        SELECT 
            d.*,
            d.summa::FLOAT
        FROM kassa_saldo AS d
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

  static async update(params) {
    const query = `--sql
        UPDATE kassa_saldo SET 
            summa = $1,
            main_schet_id = $2,
            year = $3,
            month = $4,
            updated_at = $5
        WHERE id = $6
        RETURNING id
    `;

    const result = await db.query(query, params);

    return result[0];
  }

  static async delete(params) {
    const result = await db.query(
      `UPDATE kassa_saldo SET isdeleted = true WHERE id = $1 RETURNING id`,
      params
    );

    return result[0];
  }
};
