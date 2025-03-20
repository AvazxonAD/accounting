const { db } = require("@db/index");

exports.MainBookDB = class {
  static async create(params, client) {
    const query = `
      INSERT INTO main_book (
          status,
          acsept_time,
          send_time,
          user_id,
          year,
          month,
          budjet_id,
          created_at,
          updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id
    `;

    const result = await client.query(query, params);

    return result.rows[0];
  }

  static async update(params, client) {
    const query = `
      UPDATE main_book
        SET
          status = $1,
          send_time = $2,
          year = $3,
          month = $4,
          updated_at = $5
      WHERE id = $6
      RETURNING id 
    `;

    const result = await client.query(query, params);

    return result.rows[0];
  }

  static async updateChild(params, client) {
    const query = `
      UPDATE main_book_child
        SET
          schet = $1,
          prixod = $2,
          rasxod = $3,
          updated_at = $4  
      WHERE id = $5
    `;

    await client.query(query, params);
  }

  static async deleteChild(params, client) {
    const query = `UPDATE main_book_child SET isdeleted = true WHERE id = $1`;

    await client.query(query, params);
  }

  static async createChild(params, client) {
    const query = `
            INSERT INTO main_book_child (
                schet,
                prixod,
                rasxod,
                user_id,
                parent_id,
                type_id,
                created_at,
                updated_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `;

    await client.query(query, params);
  }

  static async get(params, year = null, month = null) {
    const conditions = [];

    if (year) {
      params.push(year);
      conditions.push(`AND d.year = $${params.length}`);
    }

    if (month) {
      params.push(month);
      conditions.push(`d.month = $${params.length}`);
    }

    const where_clause = conditions.length ? conditions.join(" AND ") : "";

    const query = `
      WITH data AS (
        SELECT
          d.id,
          d.status,
          d.acsept_time,
          d.send_time,
          d.user_id,
          u.fio,
          u.login,
          d.year,
          d.month,
          d.budjet_id,
          b.name AS                 budjet_name,
          d.accept_user_id,
          ua.fio AS                 accept_user_fio,
          ua.login AS               accept_user_login
        FROM main_book d
        JOIN spravochnik_budjet_name b ON b.id = d.budjet_id
        JOIN users u ON u.id = d.user_id
        LEFT JOIN users ua ON ua.id = d.accept_user_id
        JOIN regions r ON r.id = u.region_id
        WHERE d.isdeleted = false
          AND r.id = $1
          ${where_clause}
        OFFSET $2 LIMIT $3 
      )
      SELECT
        COALESCE(JSON_AGG(ROW_TO_JSON(data)), '[]'::JSON) AS data,
        (
          SELECT
            COALESCE(COUNT(d.id), 0)
          FROM main_book d
          JOIN users u ON u.id = d.user_id
          JOIN regions r ON r.id = u.region_id
          WHERE d.isdeleted = false
            AND r.id = $1
            ${where_clause}
        )::INTEGER AS total
      FROM data
    `;

    const result = await db.query(query, params);

    return result[0];
  }

  static async getById(params, isdeleted = null) {
    const query = `
      SELECT
        d.id,
        d.status,
        d.acsept_time,
        d.send_time,
        d.user_id,
        d.year,
        d.month,
        d.budjet_id,
        b.name AS                 budjet_name,
        d.accept_user_id,
        ua.fio AS                 accept_user_fio,
        ua.login AS               accept_user_login
      FROM main_book d
      JOIN spravochnik_budjet_name b ON b.id = d.budjet_id
      JOIN users u ON u.id = d.user_id
      LEFT JOIN users ua ON ua.id = d.accept_user_id
      JOIN regions r ON r.id = u.region_id
      WHERE r.id = $1
        AND d.id = $2
        ${!isdeleted ? "AND d.isdeleted = false" : ""}
    `;

    const result = await db.query(query, params);

    return result[0];
  }

  static async getByIdChild(params) {
    const query = `
      SELECT
        t.id AS             type_id,
        t.name AS           type_name,
        (
          SELECT
            JSON_AGG(
              JSON_BUILD_OBJECT(
                'id', subch.id,
                'schet', subch.schet,
                'prixod', subch.prixod,
                'rasxod', subch.rasxod
              )
            )
          FROM main_book_child subch
          WHERE subch.isdeleted = false
            AND subch.type_id = t.id         
        ) AS sub_childs
      FROM main_book_child ch
      JOIN main_book_type t ON t.id = ch.type_id
      WHERE ch.isdeleted = false
        AND parent_id = $1
      ORDER BY t.id
    `;

    const result = await db.query(query, params);

    return result;
  }
};
