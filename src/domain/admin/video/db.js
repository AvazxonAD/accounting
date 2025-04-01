const { db } = require("@db/index");

exports.VideoDB = class {
  static async create(params) {
    const query = `--sql
        INSERT INTO video (
            name,
            file,
            module_id,
            sort_order,
            created_at, 
            updated_at
        ) 
        VALUES ($1, $2, $3, $4, $5, $6) 
        RETURNING id
    `;

    const result = await db.query(query, params);

    return result;
  }

  static async get(params, search = null, module_id = null) {
    const conditions = [];

    if (search) {
      params.push(search);
      conditions.push(`d.name ILIKE '%' || $${params.length + 1}`);
    }

    if (module_id) {
      params.push(module_id);
      conditions.push(`d.module_id = $${params.length}`);
    }

    const where = conditions.length ? `AND ${conditions.join(` AND `)}` : "";

    const query = `--sql
        WITH data AS (
            SELECT 
                d.*
            FROM video AS d
            WHERE d.isdeleted = false 
                ${where}
            ORDER BY d.sort_order DESC
            OFFSET $1 LIMIT $2
        )
        SELECT 
            COALESCE( JSON_AGG( row_to_json( data ) ), '[]'::JSON ) AS data,
            (
                SELECT COALESCE(COUNT(d.id), 0)::INTEGER 
                FROM video AS d
                WHERE d.isdeleted = false
                    ${where}
            ) AS total
        FROM data
    `;

    const result = await db.query(query, params);

    return result[0];
  }

  static async getById(params, isdeleted) {
    let ignore = "AND d.isdeleted = false";
    const query = `--sql
        SELECT 
            d.*
        FROM video AS d
        WHERE d.id = $1
            ${isdeleted ? `` : ignore}
    `;

    const result = await db.query(query, params);

    return result[0];
  }

  static async update(params) {
    const query = `--sql
        UPDATE video
        SET
            name = $1,
            file = $2,
            module_id = $3,
            sort_order = $4,
            updated_at = $5
        WHERE id = $6
        RETURNING *
    `;

    const result = await db.query(query, params);

    return result[0];
  }

  static async delete(params) {
    const query = `UPDATE video SET isdeleted = true WHERE id = $1`;

    await db.query(query, params);
  }
};
