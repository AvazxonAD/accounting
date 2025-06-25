const { db } = require("@db/index");

exports.RegionJur8SchetsDB = class {
  static async create(params) {
    const query = `--sql
            INSERT INTO region_prixod_schets (
                schet_id, 
                user_id, 
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
                    rd.*, 
                    d.schet, 
                    d.name,
                    u.login,
                    u.fio
                FROM region_prixod_schets AS rd
                JOIN prixod_schets AS d ON d.id = rd.schet_id
                JOIN users AS u ON u.id = rd.user_id
                JOIN regions AS r ON r.id = u.region_id
                WHERE rd.isdeleted = false 
                    ${search_filter}
                    AND r.id = $1
                ORDER BY rd.created_at DESC
                OFFSET $2 LIMIT $3
            )
            SELECT 
                COALESCE( JSON_AGG( row_to_json( data ) ), '[]'::JSON ) AS data,
                (
                    SELECT COALESCE(COUNT(rd.id), 0)::INTEGER 
                    FROM region_prixod_schets AS rd
                    JOIN prixod_schets AS d ON d.id = rd.schet_id
                    JOIN users AS u ON u.id = rd.user_id
                    JOIN regions AS r ON r.id = u.region_id
                    WHERE rd.isdeleted = false 
                        ${search_filter}
                        AND r.id = $1
                ) AS total
            FROM data
        `;
    const result = await db.query(query, params);
    return result[0];
  }

  static async getById(params, isdeleted) {
    let ignore = "AND rd.isdeleted = false";
    const query = `--sql
            SELECT 
                rd.*, 
                d.schet, 
                d.name
            FROM region_prixod_schets AS rd
            JOIN prixod_schets AS d ON d.id = rd.schet_id
            JOIN users AS u ON u.id = rd.user_id
            JOIN regions AS r ON r.id = u.region_id
            WHERE rd.id = $1
              AND r.id = $2
              ${isdeleted ? `` : ignore}
        `;
    const result = await db.query(query, params);
    return result[0];
  }

  static async getBySchetId(params) {
    const query = `--sql
            SELECT rd.*
            FROM region_prixod_schets AS rd
            JOIN users AS u ON u.id = rd.user_id
            JOIN regions AS r ON r.id = u.region_id
            WHERE rd.schet_id = $1
              AND rd.isdeleted = false
              AND r.id = $2
        `;
    const result = await db.query(query, params);
    return result[0];
  }

  static async update(params) {
    const query = `--sql
            UPDATE region_prixod_schets
            SET
              schet_id = $1,
              updated_at = $2
            WHERE id = $3 AND isdeleted = false 
            RETURNING *
        `;

    const result = await db.query(query, params);

    return result[0];
  }

  static async delete(params) {
    const query = `UPDATE region_prixod_schets SET isdeleted = true WHERE id = $1 AND isdeleted = false`;
    await db.query(query, params);
  }
};
