const { db } = require("@db/index");

exports.OdinoxDB = class {
  static async update(params) {
    const query = `
      UPDATE odinox
        SET
          status = $1,
          accept_time = $2,
          accept_user_id = $3
      WHERE id = $4
      RETURNING id 
    `;

    const result = await db.query(query, params);

    return result[0];
  }

  static async get(params, year = null, main_schet_id = null, month = null) {
    const conditions = [];

    if (year) {
      params.push(year);
      conditions.push(`AND d.year = $${params.length}`);
    }

    if (main_schet_id) {
      params.push(main_schet_id);
      conditions.push(`d.main_schet_id = $${params.length}`);
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
          d.accept_time,
          d.send_time,
          d.user_id,
          u.fio,
          u.login,
          d.year,
          d.month,
          d.main_schet_id,
          m.account_number,
          d.accept_user_id,
          ua.fio AS                 accept_user_fio,
          ua.login AS               accept_user_login,
          r.name AS                 region_name
        FROM odinox d
        JOIN main_schet m ON m.id = d.main_schet_id
        JOIN users u ON u.id = d.user_id
        LEFT JOIN users ua ON ua.id = d.accept_user_id
        JOIN regions r ON r.id = u.region_id
        WHERE d.isdeleted = false
          ${where_clause}
        OFFSET $1 LIMIT $2 
      )
      SELECT
        COALESCE(JSON_AGG(ROW_TO_JSON(data)), '[]'::JSON) AS data,
        (
          SELECT
            COALESCE(COUNT(d.id), 0)
          FROM odinox d
          JOIN users u ON u.id = d.user_id
          JOIN regions r ON r.id = u.region_id
          WHERE d.isdeleted = false
            ${where_clause}
        )::INTEGER AS total
      FROM data
    `;

    const result = await db.query(query, params);

    return result[0];
  }

  static async getById(params) {
    const query = `
      SELECT
        d.id,
        d.status,
        d.accept_time,
        d.send_time,
        d.user_id,
        d.year,
        d.month,
        d.main_schet_id,
        m.account_number,
        d.accept_user_id,
        ua.fio AS                 accept_user_fio,
        ua.login AS               accept_user_login,
        r.name AS                 region_name
      FROM odinox d
      JOIN main_schet m ON m.id = d.main_schet_id
      JOIN users u ON u.id = d.user_id
      LEFT JOIN users ua ON ua.id = d.accept_user_id
      JOIN regions r ON r.id = u.region_id
      WHERE d.id = $1
        AND d.isdeleted = false
    `;

    const result = await db.query(query, params);

    return result[0];
  }

  static async getByIdChild(params) {
    const query = `
      SELECT
        DISTINCT ON (t.id, t.name, t.sort_order)
        t.id AS             type_id,
        t.name AS           type_name,
        t.sort_order,
        (
          SELECT
            JSON_AGG(
              JSON_BUILD_OBJECT(
                'id', subch.id,
                'smeta_id', subch.smeta_id,
                'summa', subch.summa,
                'smeta_name', s.smeta_name,
                'smeta_number', s.smeta_number,
                'group_number', s.group_number
              )
            )
          FROM odinox_child subch
          JOIN smeta s ON s.id = subch.smeta_id
          WHERE subch.isdeleted = false
            AND subch.type_id = t.id
            AND subch.parent_id = $1
        ) AS sub_childs
      FROM odinox_child ch
      JOIN odinox_type t ON t.id = ch.type_id
      WHERE ch.isdeleted = false
        AND parent_id = $1
      ORDER BY t.sort_order
    `;

    const result = await db.query(query, params);

    return result;
  }
};
