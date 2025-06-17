const { db } = require("@db/index");

exports.DistancesDB = class {
  static async create(params, client) {
    const query = `INSERT INTO distances(from_region_id, to_region_id, distance_km, created_at, updated_at) VALUES($1, $2, $3, $4, $5) RETURNING id`;

    const result = await client.query(query, params);

    return result.rows[0];
  }

  static async get(params, search = null, from_region_id = null, to_region_id = null) {
    let search_filter = ``;
    let from_region_id_filter = "";
    let to_region_id_filter = "";

    if (search) {
      params.push(search);
      search_filter = `AND (fr.name ILIKE '%' || $${params.length} || '%' OR tr.name ILIKE '%' || $${params.length} || '%' )`;
    }

    if (from_region_id) {
      params.push(from_region_id);
      from_region_id_filter = `AND d.from_region_id = $${params.length}`;
    }

    if (to_region_id) {
      params.push(to_region_id);
      to_region_id_filter = `AND d.to_region_id = $${params.length}`;
    }

    const query = `--sql
      WITH data AS (
        SELECT 
          d.*,
          fr.name AS from,
          tr.name AS to
        FROM distances AS d
        JOIN _regions fr  ON fr.id = d.from_region_id
        JOIN  _regions tr ON tr.id = d.to_region_id
        WHERE d.isdeleted = false
          ${search_filter}
          ${from_region_id_filter}
          ${to_region_id_filter}
        ORDER BY d.id
        OFFSET $1 LIMIT $2
      )
      SELECT 
        COALESCE(JSON_AGG(row_to_json(data)), '[]'::JSON) AS data,
        (
          SELECT 
            COALESCE(COUNT(d.id), 0)
          FROM distances AS d
          JOIN _regions fr  ON fr.id = d.from_region_id
          JOIN  _regions tr ON tr.id = d.to_region_id
          WHERE d.isdeleted = false
            ${search_filter}
            ${from_region_id_filter}
            ${to_region_id_filter}
        )::FLOAT AS total
      FROM data
    `;

    const result = await db.query(query, params);

    return result[0];
  }

  static async getByRegionId(params) {
    const query = `--sql
        SELECT 
          d.*
        FROM distances AS d
        WHERE d.isdeleted = false
          AND d.from_region_id = $1
          AND d.to_region_id = $2
    `;

    const result = await db.query(query, params);

    return result[0];
  }

  static async update(params, client) {
    const query = `--sql
      UPDATE distances SET distance_km = $1, updated_at = $2  WHERE id = $3 RETURNING id
    `;

    const result = await client.query(query, params);

    return result.rows[0];
  }

  static async updateByDistrictId(params, client) {
    const query = `--sql
      UPDATE distances SET distance_km = $1, updated_at = $2  WHERE from_region_id = $3 AND to_region_id = $4 RETURNING id
    `;

    const result = await client.query(query, params);

    return result.rows[0];
  }

  static async getById(params, isdeleted = false) {
    const query = `--sql
      SELECT 
        d.*,
        fr.name AS from,
        tr.name AS to
      FROM distances AS d
      JOIN _regions fr  ON fr.id = d.from_region_id
      JOIN _regions tr ON tr.id = d.to_region_id
      WHERE d.id = $1
        ${!isdeleted ? "AND d.isdeleted = false" : ""}
    `;

    const result = await db.query(query, params);

    return result[0];
  }

  static async delete(params, client) {
    const query = `UPDATE distances SET isdeleted = true WHERE id = $1`;

    await client.query(query, params);
  }

  static async deleteByDistrictId(params, client) {
    const query = `UPDATE distances SET isdeleted = true WHERE  from_region_id = $1 AND to_region_id = $2`;

    await client.query(query, params);
  }
};
