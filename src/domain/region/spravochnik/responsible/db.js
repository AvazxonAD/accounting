const { db } = require("@db/index");

exports.ResponsibleDB = class {
  static async createResponsible(params, client) {
    const query = `--sql
            INSERT INTO spravochnik_javobgar_shaxs_jur7 (
                spravochnik_podrazdelenie_jur7_id, 
                fio, 
                user_id,
                budjet_id,
                created_at, 
                updated_at
            ) 
            VALUES ($1, $2, $3, $4, $5, $6) 
            RETURNING id
        `;

    const _db = client || db;

    const result = await _db.query(query, params);

    return result[0];
  }

  static async get(params, region_id = null, search = null, podraz_id = null) {
    let search_filter = ``;
    let podraz_filter = ``;
    let region_filter = ``;

    if (search) {
      search_filter = `AND s.fio ILIKE '%' || $${params.length + 1} || '%'`;
      params.push(search);
    }

    if (podraz_id) {
      params.push(podraz_id);
      podraz_filter = `AND sp.id = $${params.length}`;
    }

    if (region_id) {
      params.push(region_id);
      region_filter = `AND r.id = $${params.length}`;
    }

    const query = `--sql
            WITH data AS (
                SELECT 
                    s.id, 
                    s.fio,
                    s.spravochnik_podrazdelenie_jur7_id,
                    sp.name AS spravochnik_podrazdelenie_jur7_name,
                    u.id AS user_id,
                    u.login,
                    u.fio AS user_fio
                FROM spravochnik_javobgar_shaxs_jur7 AS s
                JOIN users AS u ON u.id = s.user_id
                JOIN regions AS r ON r.id = u.region_id
                JOIN spravochnik_podrazdelenie_jur7 AS sp ON sp.id = s.spravochnik_podrazdelenie_jur7_id  
                WHERE s.isdeleted = false
                    AND s.budjet_id = $1
                    ${search_filter} 
                    ${podraz_filter}
                    ${region_filter}
                ORDER BY s.fio
                OFFSET $2 LIMIT $3
            )
            SELECT 
                COALESCE( JSON_AGG( row_to_json( data ) ), '[]'::JSON ) AS data,
                (
                    SELECT COALESCE(COUNT(s.id), 0)::INTEGER 
                    FROM spravochnik_javobgar_shaxs_jur7 AS s
                    JOIN users AS u ON u.id = s.user_id
                    JOIN regions AS r ON r.id = u.region_id
                    WHERE s.isdeleted = false 
                        AND s.budjet_id = $1
                        ${search_filter}
                        ${region_filter}
                ) AS total
            FROM data
        `;

    const result = await db.query(query, params);
    return result[0];
  }

  static async getById(params, region_id, isdeleted) {
    let ignore = "AND s.isdeleted = false";
    let region_filter = ``;

    if (region_id) {
      params.push(region_id);
      region_filter = `AND r.id = $${params.length}`;
    }

    const query = `--sql
            SELECT 
                s.id, 
                s.fio,
                p.name AS spravochnik_podrazdelenie_jur7_name,
                s.spravochnik_podrazdelenie_jur7_id
            FROM spravochnik_javobgar_shaxs_jur7 AS s
            JOIN users AS u ON u.id = s.user_id
            JOIN regions AS r ON r.id = u.region_id
            JOIN spravochnik_podrazdelenie_jur7 AS p ON p.id = s.spravochnik_podrazdelenie_jur7_id  
            WHERE s.id = $1
                AND s.budjet_id = $2
                ${isdeleted ? `` : ignore}
                ${region_filter}
        `;
    const result = await db.query(query, params);
    return result[0];
  }

  static async getByFio(params) {
    const query = `--sql
            SELECT 
                s.id, 
                s.fio,
                p.name AS spravochnik_podrazdelenie_jur7_name,
                s.spravochnik_podrazdelenie_jur7_id
            FROM spravochnik_javobgar_shaxs_jur7 AS s
            JOIN users AS u ON u.id = s.user_id
            JOIN regions AS r ON r.id = u.region_id
            JOIN spravochnik_podrazdelenie_jur7 AS p ON p.id = s.spravochnik_podrazdelenie_jur7_id  
            WHERE  r.id = $1 
                AND s.fio = $2
                AND s.isdeleted = false
                AND s.budjet_id = $3
        `;

    const result = await db.query(query, params);

    return result[0];
  }

  static async updateResponsible(params) {
    const query = `--sql
            UPDATE spravochnik_javobgar_shaxs_jur7 
            SET fio = $1, updated_at = $2,  spravochnik_podrazdelenie_jur7_id = $3
            WHERE id = $4 AND isdeleted = false 
            RETURNING *
        `;
    const result = await db.query(query, params);
    return result[0];
  }
  static async deleteResponsible(params) {
    const query = `UPDATE spravochnik_javobgar_shaxs_jur7 SET isdeleted = true WHERE id = $1 AND isdeleted = false`;
    await db.query(query, params);
  }

  static async getResponsibleReport(params) {
    const query = `--sql
            SELECT 
                s.id, 
                s.fio,
                s.spravochnik_podrazdelenie_jur7_id,
                sp.name AS spravochnik_podrazdelenie_jur7_name
            FROM spravochnik_javobgar_shaxs_jur7 AS s
            JOIN users AS u ON u.id = s.user_id
            JOIN regions AS r ON r.id = u.region_id
            JOIN spravochnik_podrazdelenie_jur7 AS sp ON sp.id = s.spravochnik_podrazdelenie_jur7_id  
            WHERE s.isdeleted = false
              AND r.id = $1
              AND s.budjet_id = $2
        `;
    const result = await db.query(query, params);
    return result;
  }
};
