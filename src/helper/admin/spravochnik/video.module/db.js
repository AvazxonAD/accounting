const { db } = require("@db/index");

exports.VideoModuleDB = class {
  static async create(params) {
    const query = `--sql
        INSERT INTO video_module (
            name,
            created_at, 
            updated_at
        ) 
        VALUES ($1, $2, $3) 
        RETURNING id
    `;

    const result = await db.query(query, params);

    return result;
  }

  static async get(params, search = null) {
    let search_filter = ``;
    if (search) {
      search_filter = `AND d.name ILIKE '%' || $${params.length + 1}`;
      params.push(search);
    }

    const query = `--sql
        WITH data AS (
            SELECT 
                d.id, 
                d.name
            FROM video_module AS d
            WHERE d.isdeleted = false 
                ${search_filter}
            ORDER BY d.created_at DESC
            OFFSET $1 LIMIT $2
        )
        SELECT 
            COALESCE( JSON_AGG( row_to_json( data ) ), '[]'::JSON ) AS data,
            (
                SELECT COALESCE(COUNT(d.id), 0)::INTEGER 
                FROM video_module AS d
                WHERE d.isdeleted = false
                    ${search_filter}
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
            d.id, 
            d.name
        FROM video_module AS d
        WHERE d.id = $1
            ${isdeleted ? `` : ignore}
    `;

    const result = await db.query(query, params);

    return result[0];
  }

  static async getByName(params) {
    const query = `--sql
        SELECT d.*
        FROM video_module AS d
        WHERE d.name = $1
            AND d.isdeleted = false
    `;
    const result = await db.query(query, params);
    return result[0];
  }

  static async update(params) {
    const query = `--sql
        UPDATE video_module
        SET
            name = $1,
            updated_at = $2
        WHERE id = $3 
        RETURNING *
    `;

    const result = await db.query(query, params);

    return result[0];
  }

  static async delete(params) {
    const query = `UPDATE video_module SET isdeleted = true WHERE id = $1`;

    await db.query(query, params);
  }
};
