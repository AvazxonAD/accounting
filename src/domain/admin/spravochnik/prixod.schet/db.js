const { db } = require("@db/index");

exports.Jur8SchetsDB = class {
  static async create(params) {
    const query = `--sql
            INSERT INTO prixod_schets (
                schet, 
                name, 
                created_at, 
                updated_at
            ) 
            VALUES ($1, $2, $3, $4) 
            RETURNING id
        `;
    const result = await db.query(query, params);
    return result;
  }

  static async get(params, search = null) {
    let search_filter = ``;
    if (search) {
      search_filter = `AND (d.schet ILIKE '%' || $${params.length + 1} || '%' OR d.name ILIKE '%' || $${params.length + 1} || '%')`;
      params.push(search);
    }

    const query = `--sql
            WITH data AS (
                SELECT 
                    d.id, 
                    d.schet, 
                    d.name
                FROM prixod_schets AS d
                WHERE d.isdeleted = false 
                    ${search_filter}
                ORDER BY d.created_at DESC
                OFFSET $1 LIMIT $2
            )
            SELECT 
                COALESCE( JSON_AGG( row_to_json( data ) ), '[]'::JSON ) AS data,
                (
                    SELECT COALESCE(COUNT(d.id), 0)::INTEGER 
                    FROM prixod_schets AS d
                    WHERE d.isdeleted = false ${search_filter}
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
                d.schet, 
                d.name
            FROM prixod_schets AS d
            WHERE d.id = $1 ${isdeleted ? `` : ignore}
        `;
    const result = await db.query(query, params);
    return result[0];
  }

  static async getBySchet(params) {
    const query = `--sql
            SELECT d.*
            FROM prixod_schets AS d
            WHERE d.schet = $1 AND d.isdeleted = false
        `;
    const result = await db.query(query, params);
    return result[0];
  }

  static async update(params) {
    const query = `--sql
            UPDATE prixod_schets SET schet = $1, name = $2, updated_at = $3
            WHERE id = $4 AND isdeleted = false 
            RETURNING *
        `;
    const result = await db.query(query, params);
    return result[0];
  }

  static async delete(params) {
    const query = `UPDATE prixod_schets SET isdeleted = true WHERE id = $1 AND isdeleted = false`;
    await db.query(query, params);
  }
};
