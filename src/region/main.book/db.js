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

  static async createChild(params, client) {
    const query = `
            INSERT INTO main_book_child (
                schet,
                prixod,
                rasxod,
                user_id,
                parent_id,
                type,
                created_at,
                updated_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `;

    await client.query(query, params);
  }

  static async get(params) {
    const query = `
      WITH data AS (
        SELECT
          d.id,
          d.status,
          d.acsept_time,
          d.send_time,
          d.user_id,
          d.year,
          d.month,
          d.budjet_id
        FROM main_book d
        JOIN spravochnik_budjet_name b ON b.id = d.budjet_id
        JOIN users u ON u.id = d.user_id
        JOIN regions r ON r.id = u.region_id
        WHERE d.isdeleted = false
          AND r.id = $1
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
        ch.childs
      FROM main_book d
      JOIN spravochnik_budjet_name b ON b.id = d.budjet_id
      JOIN users u ON u.id = d.user_id
      JOIN regions r ON r.id = u.region_id
      LEFT JOIN LATERAL (
          SELECT 
              json_agg(
                  json_build_object(
                      'type', ch.type,
                      'sub_childs', (
                          SELECT json_agg(DISTINCT jsonb_build_object(
                              'id', subch.id,
                              'schet', subch.schet,
                              'prixod', subch.prixod,
                              'rasxod', subch.rasxod,
                              'parent_id', subch.parent_id
                          ))
                          FROM main_book_child subch
                          WHERE subch.type = ch.type
                            AND subch.parent_id = d.id
                            AND subch.isdeleted = false
                      )
                  )
              ) AS childs
          FROM main_book_child ch
          WHERE ch.isdeleted = false
            AND ch.parent_id = d.id
          GROUP BY ch.type
      ) ch ON TRUE
      WHERE r.id = $1
        AND d.id = $2
        ${!isdeleted ? "AND d.isdeleted = false" : ""}
    `;

    const result = await db.query(query, params);

    return result[0];
  }
};
