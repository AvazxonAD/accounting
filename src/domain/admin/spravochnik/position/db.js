const { db } = require("@db/index");

exports.PositionsDB = class {
  static async create(params) {
    const query = `INSERT INTO positions(name, created_at, updated_at) VALUES($1, $2, $3) RETURNING id`;

    const result = await db.query(query, params);

    return result[0];
  }

  static async get(params, search = null) {
    let search_filter = ``;

    if (search) {
      params.push(search);
      search_filter = `AND name ILIKE '%' || $${params.length} || '%' `;
    }

    const query = `--sql
      WITH data AS (
        SELECT
          * 
        FROM positions
        WHERE isdeleted = false
          ${search_filter}
        ORDER BY id
        OFFSET $1 LIMIT $2
      )
      SELECT 
        COALESCE(JSON_AGG(row_to_json(data)), '[]'::JSON) AS data,
        (
          SELECT 
            COALESCE(COUNT(id), 0)
          FROM positions
          WHERE isdeleted = false
            ${search_filter}
        )::FLOAT AS total
      FROM data
    `;

    const result = await db.query(query, params);

    return result[0];
  }

  static async getByName(params) {
    const query = `--sql
        SELECT 
          *
        FROM positions
        WHERE isdeleted = false
          AND name = $1
    `;

    const result = await db.query(query, params);

    return result[0];
  }

  static async update(params) {
    const query = `--sql
      UPDATE positions SET name = $1, updated_at = $2  WHERE id = $3 RETURNING id
    `;

    const result = await db.query(query, params);

    return result[0];
  }

  static async getById(params, isdeleted = false) {
    const query = `--sql
      SELECT 
        *
      FROM positions 
      WHERE id = $1
        ${!isdeleted ? "AND isdeleted = false" : ""}
    `;

    const result = await db.query(query, params);

    return result[0];
  }

  static async delete(params) {
    const query = `UPDATE positions SET isdeleted = true WHERE id = $1`;

    await db.query(query, params);
  }
};
