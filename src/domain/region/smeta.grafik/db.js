const { db } = require("@db/index");
const { HelperFunctions } = require(`@helper/functions`);

exports.SmetaGrafikDB = class {
  static async create(params, client) {
    const _db = client || db;

    const query = `--sql
            INSERT INTO smeta_grafik (
                smeta_id, spravochnik_budjet_name_id, user_id, 
                itogo, oy_1, oy_2, oy_3, oy_4, oy_5, oy_6, 
                oy_7, oy_8, oy_9, oy_10, oy_11, oy_12, year, main_schet_id, created_at, updated_at
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 
                $11, $12, $13, $14, $15, $16, $17, $18, $19, $20
            ) RETURNING *;
        `;

    const result = await _db.query(query, params);

    return result.rows[0] || result[0];
  }

  static async getOld(params, filter) {
    const conditions = [];

    if (filter.year) {
      params.push(filter.year);
      conditions.push(`s.year = $${params.length}`);
    }

    if (filter.smeta_id) {
      params.push(filter.smeta_id);
      conditions.push(`sg.smeta_id = $${params.length}`);
    }

    const where = HelperFunctions.where({ conditions });

    const query = `--sql
      WITH data AS (
        SELECT
          s.*, 
          s.itogo::FLOAT,
          s.oy_1::FLOAT,
          s.oy_2::FLOAT,
          s.oy_3::FLOAT,
          s.oy_4::FLOAT,
          s.oy_5::FLOAT,
          s.oy_6::FLOAT,
          s.oy_7::FLOAT,
          s.oy_8::FLOAT,
          s.oy_9::FLOAT,
          s.oy_10::FLOAT,
          s.oy_11::FLOAT,
          s.oy_12::FLOAT
        FROM smeta_grafik_old s
        JOIN smeta_grafik sg ON sg.id = s.smeta_grafik_id
        JOIN users u ON s.user_id = u.id
        JOIN regions r ON r.id = u.region_id  
        WHERE r.id = $1
          ${where}
        OFFSET $2 LIMIT $3
      )
      
      SELECT
         COALESCE(JSON_AGG(ROW_TO_JSON(data)), '[]'::JSON) AS data,
        (
          SELECT
            COALESCE(COUNT(s.id), 0) 
          FROM smeta_grafik_old s 
          JOIN users u ON s.user_id = u.id
          JOIN smeta_grafik sg ON sg.id = s.smeta_grafik_id
          JOIN regions r ON r.id = u.region_id  
          WHERE r.id = $1
            ${where}
        )::INTEGER AS total
      
      FROM data
    `;

    const result = await db.query(query, params);

    return result[0];
  }

  static async getBySortNumber(params) {
    const query = `--sql
      SELECT
        sort_order
      FROM smeta_grafik_old
      WHERE smeta_grafik_id = $1
      ORDER BY created_at DESC
      LIMIT 1
    `;

    const result = await db.query(query, params);

    return result[0]?.sort_order + 1 || 1;
  }

  static async createOld(params, client) {
    const query = `--sql
      INSERT INTO smeta_grafik_old (
        smeta_grafik_id,
        sort_order,
        user_id,
        smeta_name,
        smeta_number,
        budjet_name,
        itogo,
        oy_1,
        oy_2,
        oy_3,
        oy_4,
        oy_5,
        oy_6,
        oy_7,
        oy_8,
        oy_9,
        oy_10,
        oy_11,
        oy_12,
        account_number,
        year, 
        created_at,
        updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7,
        $8, $9, $10, $11, $12, $13, $14,
        $15, $16, $17, $18, $19, $20, $21, $22, $23
      )
    `;

    await client.query(query, params);
  }

  static async get(params, budjet_id, operator, year, search) {
    let budjet_filter = ``;
    let operator_filter = ``;
    let year_filter = ``;
    let search_filter = ``;
    if (search) {
      params.push(search);
      search_filter = `AND (smeta.smeta_number ILIKE '%' || $${params.length} || '%')`;
    }
    if (budjet_id) {
      budjet_filter = `AND s.spravochnik_budjet_name_id = $${params.length + 1}`;
      params.push(budjet_id);
    }
    if (operator) {
      operator_filter = `AND s.itogo ${operator} 0`;
    }
    if (year) {
      params.push(year);
      year_filter = `AND s.year = $${params.length}`;
    }
    const query = `--sql
          WITH data AS 
            (SELECT 
                s.*, 
                smeta.smeta_name,
                smeta.smeta_number,
                s.itogo::FLOAT,
                s.oy_1::FLOAT,
                s.oy_2::FLOAT,
                s.oy_3::FLOAT,
                s.oy_4::FLOAT,
                s.oy_5::FLOAT,
                s.oy_6::FLOAT,
                s.oy_7::FLOAT,
                s.oy_8::FLOAT,
                s.oy_9::FLOAT,
                s.oy_10::FLOAT,
                s.oy_11::FLOAT,
                s.oy_12::FLOAT,
                m.account_number
              FROM smeta_grafik AS s
              JOIN users ON s.user_id = users.id
              JOIN regions ON regions.id = users.region_id  
              LEFT JOIN spravochnik_budjet_name ON spravochnik_budjet_name.id = s.spravochnik_budjet_name_id
              JOIN smeta ON smeta.id = s.smeta_id
              JOIN main_schet AS m ON m.id = s.main_schet_id
              WHERE s.isdeleted = false
                AND regions.id = $1
                AND s.main_schet_id = $2
                ${budjet_filter} 
                ${operator_filter} 
                ${year_filter}
                ${search_filter}
              ORDER BY smeta.smeta_number
              OFFSET $3 LIMIT $4
            )
          SELECT
            COALESCE( JSON_AGG( row_to_json( data ) ), '[]'::JSON ) AS data,
            (SELECT COALESCE(COUNT(s.id), 0) FROM smeta_grafik AS s 
              JOIN users ON s.user_id = users.id
              JOIN regions ON regions.id = users.region_id
              JOIN smeta ON smeta.id = s.smeta_id
              WHERE s.isdeleted = false 
                AND regions.id = $1 
                AND s.main_schet_id = $2
                ${budjet_filter} 
                ${operator_filter} 
                ${year_filter}
                ${search_filter}
            )::INTEGER total_count,
            (SELECT COALESCE(SUM(s.itogo), 0) FROM smeta_grafik AS s
              JOIN users ON s.user_id = users.id
              JOIN regions ON regions.id = users.region_id
              JOIN smeta ON smeta.id = s.smeta_id
              WHERE s.isdeleted = false 
                AND regions.id = $1 
                AND s.main_schet_id = $2
                ${budjet_filter} 
                ${operator_filter} 
                ${year_filter}
                ${search_filter}
            )::FLOAT itogo,
            (SELECT COALESCE(SUM(s.oy_1), 0) FROM smeta_grafik AS s
              JOIN users ON s.user_id = users.id
              JOIN regions ON regions.id = users.region_id
              JOIN smeta ON smeta.id = s.smeta_id
              WHERE s.isdeleted = false 
                AND regions.id = $1 
                AND s.main_schet_id = $2
                ${budjet_filter} 
                ${operator_filter} 
                ${year_filter}
                ${search_filter}
            )::FLOAT oy_1,
            (SELECT COALESCE(SUM(s.oy_2), 0) FROM smeta_grafik AS s
              JOIN users ON s.user_id = users.id
              JOIN regions ON regions.id = users.region_id
              JOIN smeta ON smeta.id = s.smeta_id
              WHERE s.isdeleted = false 
                AND regions.id = $1 
                AND s.main_schet_id = $2
                ${budjet_filter} 
                ${operator_filter} 
                ${year_filter}
                ${search_filter}
            )::FLOAT oy_2,
            (SELECT COALESCE(SUM(s.oy_3), 0) FROM smeta_grafik AS s
              JOIN users ON s.user_id = users.id
              JOIN regions ON regions.id = users.region_id
              JOIN smeta ON smeta.id = s.smeta_id
              WHERE s.isdeleted = false 
                AND regions.id = $1 
                AND s.main_schet_id = $2
                ${budjet_filter} 
                ${operator_filter} 
                ${year_filter}
                ${search_filter}
            )::FLOAT oy_3,
            (SELECT COALESCE(SUM(s.oy_4), 0) FROM smeta_grafik AS s
              JOIN users ON s.user_id = users.id
              JOIN regions ON regions.id = users.region_id
              JOIN smeta ON smeta.id = s.smeta_id
              WHERE s.isdeleted = false 
                AND regions.id = $1 
                AND s.main_schet_id = $2
                ${budjet_filter} 
                ${operator_filter} 
                ${year_filter}
                ${search_filter}
            )::FLOAT oy_4,
            (SELECT COALESCE(SUM(s.oy_5), 0) FROM smeta_grafik AS s
              JOIN users ON s.user_id = users.id
              JOIN regions ON regions.id = users.region_id
              JOIN smeta ON smeta.id = s.smeta_id
              WHERE s.isdeleted = false 
                AND regions.id = $1 
                AND s.main_schet_id = $2
                ${budjet_filter} 
                ${operator_filter} 
                ${year_filter}
                ${search_filter}
            )::FLOAT oy_5,
            (SELECT COALESCE(SUM(s.oy_6), 0) FROM smeta_grafik AS s
              JOIN users ON s.user_id = users.id
              JOIN regions ON regions.id = users.region_id
              JOIN smeta ON smeta.id = s.smeta_id
              WHERE s.isdeleted = false 
                AND regions.id = $1 
                AND s.main_schet_id = $2
                ${budjet_filter} 
                ${operator_filter} 
                ${year_filter}
                ${search_filter}
            )::FLOAT oy_6,
            (SELECT COALESCE(SUM(s.oy_7), 0) FROM smeta_grafik AS s
              JOIN users ON s.user_id = users.id
              JOIN regions ON regions.id = users.region_id
              JOIN smeta ON smeta.id = s.smeta_id
              WHERE s.isdeleted = false 
                AND regions.id = $1 
                AND s.main_schet_id = $2
                ${budjet_filter} 
                ${operator_filter} 
                ${year_filter}
                ${search_filter}
            )::FLOAT oy_7,
            (SELECT COALESCE(SUM(s.oy_8), 0) FROM smeta_grafik AS s
              JOIN users ON s.user_id = users.id
              JOIN regions ON regions.id = users.region_id
              JOIN smeta ON smeta.id = s.smeta_id
              WHERE s.isdeleted = false 
                AND regions.id = $1 
                AND s.main_schet_id = $2
                ${budjet_filter} 
                ${operator_filter} 
                ${year_filter}
                ${search_filter}
            )::FLOAT oy_8,
            (SELECT COALESCE(SUM(s.oy_9), 0) FROM smeta_grafik AS s
              JOIN users ON s.user_id = users.id
              JOIN regions ON regions.id = users.region_id
              JOIN smeta ON smeta.id = s.smeta_id
              WHERE s.isdeleted = false 
                AND regions.id = $1 
                AND s.main_schet_id = $2
                ${budjet_filter} 
                ${operator_filter} 
                ${year_filter}
                ${search_filter}
            )::FLOAT oy_9,
            (SELECT COALESCE(SUM(s.oy_10), 0) FROM smeta_grafik AS s
              JOIN users ON s.user_id = users.id
              JOIN regions ON regions.id = users.region_id
              JOIN smeta ON smeta.id = s.smeta_id
              WHERE s.isdeleted = false 
                AND regions.id = $1 
                AND s.main_schet_id = $2
                ${budjet_filter} 
                ${operator_filter} 
                ${year_filter}
                ${search_filter}
            )::FLOAT oy_10,
            (SELECT COALESCE(SUM(s.oy_11), 0) FROM smeta_grafik AS s
              JOIN users ON s.user_id = users.id
              JOIN regions ON regions.id = users.region_id
              JOIN smeta ON smeta.id = s.smeta_id
              WHERE s.isdeleted = false 
                AND regions.id = $1 
                AND s.main_schet_id = $2
                ${budjet_filter} 
                ${operator_filter} 
                ${year_filter}
                ${search_filter}
            )::FLOAT oy_11,
            (SELECT COALESCE(SUM(s.oy_12), 0) FROM smeta_grafik AS s
              JOIN users ON s.user_id = users.id
              JOIN regions ON regions.id = users.region_id
              JOIN smeta ON smeta.id = s.smeta_id
              WHERE s.isdeleted = false 
                AND regions.id = $1 
                AND s.main_schet_id = $2
                ${budjet_filter} 
                ${operator_filter} 
                ${year_filter}
                ${search_filter}
            )::FLOAT oy_12
          FROM data
        `;
    const result = await db.query(query, params);

    return {
      data: result[0]?.data || [],
      total: result[0]?.total_count,
      itogo: result[0].itogo,
      oy_1: result[0].oy_1,
      oy_2: result[0].oy_2,
      oy_3: result[0].oy_3,
      oy_4: result[0].oy_4,
      oy_5: result[0].oy_5,
      oy_6: result[0].oy_6,
      oy_7: result[0].oy_7,
      oy_8: result[0].oy_8,
      oy_9: result[0].oy_9,
      oy_10: result[0].oy_10,
      oy_11: result[0].oy_11,
      oy_12: result[0].oy_12,
    };
  }

  static async getById(params, isdeleted) {
    const ignore = "AND s.isdeleted = false";
    const query = `--sql
            SELECT
                s.*, 
                smeta.smeta_name,
                smeta.smeta_number,
                s.itogo::FLOAT,
                s.oy_1::FLOAT,
                s.oy_2::FLOAT,
                s.oy_3::FLOAT,
                s.oy_4::FLOAT,
                s.oy_5::FLOAT,
                s.oy_6::FLOAT,
                s.oy_7::FLOAT,
                s.oy_8::FLOAT,
                s.oy_9::FLOAT,
                s.oy_10::FLOAT,
                s.oy_11::FLOAT,
                s.oy_12::FLOAT,
                m.account_number,
                b.name AS budjet_name
            FROM smeta_grafik AS s
            JOIN users ON s.user_id = users.id
            JOIN regions ON users.region_id = regions.id  
            JOIN smeta ON smeta.id = s.smeta_id
            JOIN main_schet m ON m.id = s.main_schet_id
            JOIN spravochnik_budjet_name b ON b.id = m.spravochnik_budjet_name_id
            WHERE regions.id = $1
              AND s.id = $2 ${isdeleted ? "" : ignore}
              AND main_schet_id = $3
        `;
    const result = await db.query(query, params);
    return result[0];
  }

  static async update(params, client) {
    const query = `--sql
            UPDATE smeta_grafik SET 
                itogo = $1, oy_1 = $2, oy_2 = $3, oy_3 = $4,
                oy_4 = $5, oy_5 = $6, oy_6 = $7, oy_7 = $8,
                oy_8 = $9, oy_9 = $10, oy_10 = $11, oy_11 = $12, oy_12 = $13, 
                smeta_id = $14, spravochnik_budjet_name_id = $15, year = $16, main_schet_id = $17, updated_at = $18
            WHERE id = $19
              AND isdeleted = false
            RETURNING id
        `;

    const result = await client.query(query, params);
    return result.rows[0];
  }

  static async delete(params) {
    const query = `UPDATE smeta_grafik SET isdeleted = true WHERE id = $1 RETURNING id`;

    const result = await db.query(query, params);

    return result;
  }

  static async getByYear(params) {
    const query = `--sql   
      SELECT
        s.*
      FROM smeta_grafik AS s
      JOIN users ON s.user_id = users.id
      JOIN regions ON users.region_id = regions.id
      WHERE regions.id = $1
        AND s.smeta_id = $2
        AND s.isdeleted = false
        AND s.year = $3
        AND s.main_schet_id = $4
    `;
    const result = await db.query(query, params);
    return result[0];
  }
};
