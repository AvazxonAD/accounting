const { db } = require("@db/index");

exports.SmetaGrafikDB = class {
  static async createParent(params, client) {
    const query = `--sql
      INSERT INTO smeta_grafik_parent ( user_id, year, main_schet_id, order_number,command, created_at, updated_at ) VALUES (
          $1, $2, $3, $4, $5, $6, $7
      ) RETURNING * 
    `;

    const result = await client.query(query, params);

    return result.rows[0];
  }

  static async updateParent(params, client) {
    const query = `UPDATE smeta_grafik_parent  SET command = $1 WHERE id = $2 `;

    await client.query(query, params);
  }

  static async getEnd(params) {
    const query = `--sql
      SELECT
        s.*
      FROM smeta_grafik_parent s 
      JOIN users u ON u.id = s.user_id
      JOIN  regions r ON r.id = u.region_id  
      WHERE s.isdeleted = false
        AND r.id = $1
        AND s.year = $2
        AND s.main_schet_id = $3
      ORDER BY s.order_number DESC
      LIMIT 1
    `;

    const result = await db.query(query, params);

    return result[0];
  }

  static async create(params, client) {
    const query = `--sql
      INSERT INTO smeta_grafik (
          smeta_id, user_id, 
          itogo, oy_1, oy_2, oy_3, oy_4, oy_5, oy_6, 
          oy_7, oy_8, oy_9, oy_10, oy_11, oy_12, year, main_schet_id, parent_id, order_number, created_at, updated_at
      ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 
          $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21
      );
    `;

    await client.query(query, params);
  }

  static async getOrderNumber(params) {
    const query = `--sql
      SELECT
        order_number
      FROM smeta_grafik_parent
      WHERE year = $1
        AND isdeleted = false
        AND main_schet_id = $2
        AND order_number != 0
      ORDER BY id DESC 
      LIMIT 1
    `;

    const result = await db.query(query, params);

    return result[0]?.order_number + 1 || 1;
  }

  static async get(params, year = null) {
    let year_filter = ``;

    if (year) {
      params.push(year);
      year_filter = `AND s.year = $${params.length}`;
    }
    const query = `--sql
          WITH data AS 
            (
              SELECT
                s.*, 
                m.account_number,
                (
                  SELECT
                    COALESCE(SUM(sub.itogo), 0)
                  FROM smeta_grafik sub
                  WHERE sub.isdeleted = false
                    AND sub.parent_id = s.id
                )::FLOAT AS summa,
                users.login,
                users.fio
              FROM smeta_grafik_parent AS s
              JOIN users ON s.user_id = users.id
              JOIN regions ON regions.id = users.region_id  
              JOIN main_schet AS m ON m.id = s.main_schet_id
              WHERE s.isdeleted = false
                AND regions.id = $1
                AND s.main_schet_id = $2 
                ${year_filter}
              ORDER BY s.order_number
              OFFSET $3 LIMIT $4
            )
          SELECT
            COALESCE( JSON_AGG( row_to_json( data ) ), '[]'::JSON ) AS data,
            (
              SELECT 
                COALESCE(COUNT(s.id), 0) 
              FROM smeta_grafik_parent AS s 
              JOIN users  u ON s.user_id = u.id
              JOIN regions r ON r.id = u.region_id
              WHERE s.isdeleted = false 
                AND r.id = $1 
                AND s.main_schet_id = $2
                ${year_filter}
            )::INTEGER total_count
          FROM data
        `;
    const result = await db.query(query, params);

    return {
      data: result[0]?.data || [],
      total: result[0]?.total_count,
    };
  }

  static async getByOrderNumber(params) {
    const query = `--sql
      SELECT
        d.*,
        (
          SELECT JSON_AGG( row_to_json(s))
          FROM smeta_grafik s
          JOIN smeta ON smeta.id = s.smeta_id
          WHERE s.isdeleted = false AND s.parent_id = d.id
        ) AS smetas
      FROM smeta_grafik_parent AS d  
      JOIN users u ON d.user_id = u.id
      JOIN regions r ON u.region_id = r.id  
      WHERE d.isdeleted = false
        AND d.order_number = $1
        AND d.year = $2
        AND d.main_schet_id = $3
        AND r.id = $4
    `;

    const result = await db.query(query, params);

    return result[0];
  }

  static async getById(params, isdeleted) {
    const ignore = "AND d.isdeleted = false";
    const query = `--sql
           SELECT
              d.*,
              m.account_number,
              (
                SELECT
                  COALESCE(SUM(s.oy_1), 0)
                FROM smeta_grafik s
                JOIN smeta ON smeta.id = s.smeta_id
                WHERE s.isdeleted = false
                  AND s.parent_id = d.id
              )::FLOAT AS oy_1,
              (
                SELECT
                  COALESCE(SUM(s.oy_2), 0)
                FROM smeta_grafik s
                JOIN smeta ON smeta.id = s.smeta_id
                WHERE s.isdeleted = false
                  AND s.parent_id = d.id
              )::FLOAT AS oy_2,
              (
                SELECT
                  COALESCE(SUM(s.oy_3), 0)
                FROM smeta_grafik s
                JOIN smeta ON smeta.id = s.smeta_id
                WHERE s.isdeleted = false
                  AND s.parent_id = d.id
              )::FLOAT AS oy_3,
              (
                SELECT
                  COALESCE(SUM(s.oy_4), 0)
                FROM smeta_grafik s
                JOIN smeta ON smeta.id = s.smeta_id
                WHERE s.isdeleted = false
                  AND s.parent_id = d.id
              )::FLOAT AS oy_4,
              (
                SELECT
                  COALESCE(SUM(s.oy_5), 0)
                FROM smeta_grafik s
                JOIN smeta ON smeta.id = s.smeta_id
                WHERE s.isdeleted = false
                  AND s.parent_id = d.id
              )::FLOAT AS oy_5,
              (
                SELECT
                  COALESCE(SUM(s.oy_6), 0)
                FROM smeta_grafik s
                JOIN smeta ON smeta.id = s.smeta_id
                WHERE s.isdeleted = false
                  AND s.parent_id = d.id
              )::FLOAT AS oy_6,
              (
                SELECT
                  COALESCE(SUM(s.oy_7), 0)
                FROM smeta_grafik s
                JOIN smeta ON smeta.id = s.smeta_id
                WHERE s.isdeleted = false
                  AND s.parent_id = d.id
              )::FLOAT AS oy_7,
              (
                SELECT
                  COALESCE(SUM(s.oy_8), 0)
                FROM smeta_grafik s
                JOIN smeta ON smeta.id = s.smeta_id
                WHERE s.isdeleted = false
                  AND s.parent_id = d.id
              )::FLOAT AS oy_8, 
              (
                SELECT
                  COALESCE(SUM(s.oy_9), 0)
                FROM smeta_grafik s
                JOIN smeta ON smeta.id = s.smeta_id
                WHERE s.isdeleted = false
                  AND s.parent_id = d.id
              )::FLOAT AS oy_9, 
              (
                SELECT
                  COALESCE(SUM(s.oy_10), 0)
                FROM smeta_grafik s
                JOIN smeta ON smeta.id = s.smeta_id
                WHERE s.isdeleted = false
                  AND s.parent_id = d.id
              )::FLOAT AS oy_10, 
              (
                SELECT
                  COALESCE(SUM(s.oy_11), 0)
                FROM smeta_grafik s
                JOIN smeta ON smeta.id = s.smeta_id
                WHERE s.isdeleted = false
                  AND s.parent_id = d.id
              )::FLOAT AS oy_11,
              (
                SELECT
                  COALESCE(SUM(s.oy_12), 0)
                FROM smeta_grafik s
                JOIN smeta ON smeta.id = s.smeta_id
                WHERE s.isdeleted = false
                  AND s.parent_id = d.id
              )::FLOAT AS oy_12,
              (
                SELECT
                  COALESCE(SUM(s.itogo), 0)
                FROM smeta_grafik s
                JOIN smeta ON smeta.id = s.smeta_id
                WHERE s.isdeleted = false
                  AND s.parent_id = d.id
              )::FLOAT AS itogo,
              (
                SELECT JSON_AGG(
                  JSON_BUILD_OBJECT(
                    'id', s.id,
                    'smeta_id', s.smeta_id,
                    'smeta_name', smeta.smeta_name,
                    'smeta_number', smeta.smeta_number,
                    'itogo', s.itogo::FLOAT,
                    'oy_1', s.oy_1::FLOAT,
                    'oy_2', s.oy_2::FLOAT,
                    'oy_3', s.oy_3::FLOAT,
                    'oy_4', s.oy_4::FLOAT,
                    'oy_5', s.oy_5::FLOAT,
                    'oy_6', s.oy_6::FLOAT,
                    'oy_7', s.oy_7::FLOAT,
                    'oy_8', s.oy_8::FLOAT,
                    'oy_9', s.oy_9::FLOAT,
                    'oy_10', s.oy_10::FLOAT,
                    'oy_11', s.oy_11::FLOAT,
                    'oy_12', s.oy_12::FLOAT
                  )
                  ORDER BY smeta.smeta_number
                )
                FROM smeta_grafik s
                JOIN smeta ON smeta.id = s.smeta_id
                WHERE s.isdeleted = false
                  AND s.parent_id = d.id
              ) AS smetas 
            FROM smeta_grafik_parent AS d
            JOIN users u ON d.user_id = u.id
            JOIN regions r ON u.region_id = r.id  
            JOIN main_schet m ON m.id = d.main_schet_id
            WHERE r.id = $1
              AND d.id = $2
              AND m.id = $3
              ${isdeleted ? "" : ignore}
        `;

    const result = await db.query(query, params);

    return result[0];
  }

  static async updateMain(params, client) {
    const query = `--sql
            UPDATE smeta_grafik SET 
                itogo = $1, oy_1 = $2, oy_2 = $3, oy_3 = $4,
                oy_4 = $5, oy_5 = $6, oy_6 = $7, oy_7 = $8,
                oy_8 = $9, oy_9 = $10, oy_10 = $11, oy_11 = $12, oy_12 = $13, 
                updated_at = $14
            WHERE smeta_id = $15
              AND isdeleted = false
              AND parent_id = $16
        `;

    await client.query(query, params);
  }

  static async deleteMain(params, client) {
    const query = `--sql
            UPDATE smeta_grafik SET isdeleted = true 
            WHERE smeta_id = $1
              AND isdeleted = false
              AND parent_id = $2
        `;

    await client.query(query, params);
  }

  static async update(params, client) {
    const query = `--sql
            UPDATE smeta_grafik SET 
                itogo = $1, oy_1 = $2, oy_2 = $3, oy_3 = $4,
                oy_4 = $5, oy_5 = $6, oy_6 = $7, oy_7 = $8,
                oy_8 = $9, oy_9 = $10, oy_10 = $11, oy_11 = $12, oy_12 = $13, 
                smeta_id = $14, updated_at = $15
            WHERE id = $16
              AND isdeleted = false
            RETURNING id
        `;

    await client.query(query, params);
  }

  static async delete(params, client) {
    const query_parent = `UPDATE smeta_grafik_parent SET isdeleted = true WHERE id = $1`;
    const query_child = `UPDATE smeta_grafik SET isdeleted = true WHERE parent_id = $1`;

    await client.query(query_child, params);
    await client.query(query_parent, params);
  }

  static async deleteChild(params, client) {
    const query_child = `UPDATE smeta_grafik SET isdeleted = true WHERE id = $1`;

    await client.query(query_child, params);
  }
};
