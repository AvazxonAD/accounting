const { db } = require("@db/index");

exports.PodotchetDB = class {
  static async getById(params, isdeleted) {
    const ignore = `AND s.isdeleted = false`;
    const query = `--sql
            SELECT 
                s.id, 
                s.name, 
                s.rayon 
            FROM spravochnik_podotchet_litso AS s
            JOIN users ON s.user_id = users.id
            JOIN regions ON users.region_id = regions.id
            WHERE regions.id = $1 AND s.id = $2 ${isdeleted ? "" : ignore}
        `;
    const result = await db.query(query, params);
    return result[0];
  }

  static async get(params) {
    const query = `--sql
            WITH data AS (
                SELECT 
                    s.id, s.name, s.rayon
                FROM spravochnik_podotchet_litso AS s
                JOIN users AS u ON u.id = s.user_id
                JOIN regions AS r ON r.id = u.region_id
                WHERE r.id = $1 
                    AND s.isdeleted = false 
                ORDER BY s.name, s.rayon
                OFFSET $2 LIMIT $3
            )
            SELECT 
                COALESCE( JSON_AGG( row_to_json( data ) ), '[]'::JSON ) AS data,
                (
                    SELECT COALESCE(COUNT(s.id), 0)::FLOAT
                    FROM spravochnik_podotchet_litso AS s
                    JOIN users AS u ON u.id = s.user_id
                    JOIN regions AS r ON r.id = u.region_id
                    WHERE r.id = $1
                        AND s.isdeleted = false
                ) AS total_count
            FROM data
        `;
    const result = await db.query(query, params);
    return result[0];
  }
};
