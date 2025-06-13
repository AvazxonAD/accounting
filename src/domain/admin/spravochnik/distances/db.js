const { db } = require("@db/index");

exports.DistancesDB = class {
  static async create(params, client) {
    const query = `INSERT INTO distances(from_district_id, to_district_id, distance_km, created_at, updated_at) VALUES($1, $2, $3, $4, $5) RETURNING id`;

    const result = await client.query(query, params);

    return result.rows[0];
  }

  static async get(
    params,
    search = null,
    from_district_id = null,
    to_district_id = null
  ) {
    let search_filter = ``;
    let from_district_id_filter = "";
    let to_district_id_filter = "";

    if (search) {
      params.push(search);
      search_filter = `AND (fd.name ILIKE '%' || $${params.length} || '%' OR td.name ILIKE '%' || $${params.length} || '%' )`;
    }

    if (from_district_id) {
      params.push(from_district_id);
      from_district_id_filter = `AND fd.id = $${params.length}`;
    }

    if (to_district_id) {
      params.push(to_district_id);
      to_district_id_filter = `AND td.id = $${params.length}`;
    }

    const query = `--sql
      WITH data AS (
        SELECT 
          d.*,
          fd.name AS from,
          td.name AS to
        FROM distances AS d
        JOIN districts fd ON fd.id = d.from_district_id
        JOIN districts td ON td.id = d.to_district_id
        WHERE d.isdeleted = false
          ${search_filter}
          ${from_district_id_filter}
          ${to_district_id_filter}
        ORDER BY d.id
        OFFSET $1 LIMIT $2
      )
      SELECT 
        COALESCE(JSON_AGG(row_to_json(data)), '[]'::JSON) AS data,
        (
          SELECT 
            COALESCE(COUNT(d.id), 0)
          FROM distances AS d
          JOIN districts fd ON fd.id = d.from_district_id
          JOIN districts td ON td.id = d.to_district_id
          WHERE d.isdeleted = false
            ${search_filter}
            ${from_district_id_filter}
            ${to_district_id_filter}
        )::FLOAT AS total
      FROM data
    `;

    const result = await db.query(query, params);

    return result[0];
  }

  static async getByDistrictId(params) {
    const query = `--sql
        SELECT 
          *
        FROM distances AS d
        JOIN districts fd ON fd.id = d.from_district_id
        JOIN districts td ON td.id = d.to_district_id
        WHERE d.isdeleted = false
          AND d.from_district_id = $1
          AND d.to_district_id = $2
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
      UPDATE distances SET distance_km = $1, updated_at = $2  WHERE from_district_id = $3 AND to_district_id = $4 RETURNING id
    `;

    const result = await client.query(query, params);

    return result.rows[0];
  }

  static async getById(params, isdeleted = false) {
    const query = `--sql
      SELECT 
        d.*,
        fd.name AS from,
        td.name AS to
      FROM distances AS d
      JOIN districts fd ON fd.id = d.from_district_id
      JOIN districts td ON td.id = d.to_district_id
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
    const query = `UPDATE distances SET isdeleted = true WHERE  from_district_id = $1 AND to_district_id = $2`;

    await client.query(query, params);
  }
};
