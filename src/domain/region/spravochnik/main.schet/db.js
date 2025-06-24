const { db } = require("@db/index");
exports.MainSchetDB = class {
  static async checkSchet(params, column_name) {
    const query = `--sql
      SELECT
        m.*
      FROM main_schet m
      JOIN users u ON u.id = m.user_id 
      JOIN regions r ON r.id = u.region_id
      WHERE m.isdeleted = false
        AND m.spravochnik_budjet_name_id = $1
        AND r.id = $2
        AND m.${column_name} = $3
    `;

    const result = await db.query(query, params);

    return result[0];
  }

  static async getJurSchets(params) {
    const query = `
      SELECT
        sch.*
      FROM jur_schets sch
      JOIN main_schet m ON m.id = sch.main_schet_id
      JOIN users u ON u.id = m.user_id
      JOIN regions r ON r.id = u.region_id
      WHERE r.id = $1
        AND sch.isdeleted = false
    `;

    const result = await db.query(query, params);

    return result;
  }

  static async checkJurSchet(params) {
    const query = `--sql
      SELECT
        *
      FROM jur_schets
      WHERE main_schet_id = $1
        AND isdeleted = false
        AND type = $2
        AND schet = $3
    `;

    const result = await db.query(query, params);

    return result;
  }

  static async getById(params, isdeleted = null) {
    const ignore = `AND m.isdeleted = false`;
    const query = `--sql
            SELECT 
                m.*, 
                COALESCE(
                  (
                    SELECT JSON_AGG(row_to_json(j))
                    FROM jur_schets j
                    WHERE j.main_schet_id = m.id
                      AND j.isdeleted = false
                      AND j.type = '159'
                  )
                , '[]'::JSON) AS jur3_schets_159,
                COALESCE(
                  (
                    SELECT JSON_AGG(row_to_json(j))
                    FROM jur_schets j
                    WHERE j.main_schet_id = m.id
                      AND j.isdeleted = false
                      AND j.type = '152'
                  )
                , '[]'::JSON) AS jur3_schets_152,
                COALESCE(
                  (
                    SELECT JSON_AGG(row_to_json(j))
                    FROM jur_schets j
                    WHERE j.main_schet_id = m.id
                      AND j.isdeleted = false
                      AND j.type = 'jur4'
                  )
                , '[]'::JSON ) AS jur4_schets,
                b.name AS budjet_name
            FROM main_schet m
            JOIN users AS u ON m.user_id = u.id
            JOIN regions AS r ON u.region_id = r.id
            JOIN spravochnik_budjet_name AS b ON b.id = m.spravochnik_budjet_name_id
            WHERE r.id = $1
                AND m.id = $2 ${isdeleted ? "" : ignore}
        `;
    const result = await db.query(query, params);
    return result[0];
  }

  static async get(params, search) {
    const conditions = [];

    if (search) {
      params.push(search);
      conditions.push(`AND (
        main_schet.tashkilot_nomi ILIKE '%' || $${params.length} || '%' OR
        main_schet.tashkilot_inn ILIKE '%' || $${params.length} || '%' OR
        main_schet.account_name ILIKE '%' || $${params.length} || '%' OR
        main_schet.account_number ILIKE '%' || $${params.length} || '%' 
        )
    `);
    }

    const where = conditions.length ? conditions.join(" AND ") : "";

    const query = `--sql
        WITH data AS (
          SELECT
            m.*, 
            b.name AS                               budjet_name,
            b.id AS                                 spravochnik_budjet_name_id,
            COALESCE(
              (
                SELECT JSON_AGG(row_to_json(j))
                FROM jur_schets j
                WHERE j.main_schet_id = m.id
                  AND j.isdeleted = false
                  AND j.type = '159'
              )
            , '[]'::JSON) AS jur3_schets_159,
            COALESCE(
                  (
                    SELECT JSON_AGG(row_to_json(j))
                    FROM jur_schets j
                    WHERE j.main_schet_id = m.id
                      AND j.isdeleted = false
                      AND j.type = '152'
                  )
                , '[]'::JSON) AS jur3_schets_152,
            COALESCE(
              (
                SELECT JSON_AGG(row_to_json(j))
                FROM jur_schets j
                WHERE j.main_schet_id = m.id
                  AND j.isdeleted = false
                  AND j.type = 'jur4'
              )
            , '[]'::JSON ) AS jur4_schets,
            u.login,
            u.fio
          FROM main_schet m
          JOIN users u ON m.user_id = u.id
          JOIN regions r ON u.region_id = r.id
          JOIN spravochnik_budjet_name b ON b.id = m.spravochnik_budjet_name_id
          WHERE m.isdeleted = false
            AND r.id = $1
            AND b.id = $2
            ${where} 
          OFFSET $3 LIMIT $4
        )
        SELECT 
            COALESCE( JSON_AGG( row_to_json( data ) ), '[]'::JSON ) AS data,
            (
                SELECT 
                    COALESCE(COUNT(m .id), 0)::INTEGER
                FROM main_schet m 
                JOIN users u ON m.user_id = u.id
                JOIN regions r ON u.region_id = r.id
                JOIN spravochnik_budjet_name b ON b.id = m.spravochnik_budjet_name_id
                WHERE m.isdeleted = false
                    ${where}
                    AND r.id = $1
                    AND b.id = $2
            )::INTEGER AS total_count
        FROM data
    `;

    const result = await db.query(query, params);

    return result[0];
  }

  static async getByRegionId(params) {
    const query = `
      SELECT
        m.id,
        m.account_number, 
        m.jur1_schet, 
        m.jur2_schet, 
        b.name AS budjet_name,
        b.id AS budjet_id,
        COALESCE(
          (
            SELECT JSON_AGG(
              JSON_BUILD_OBJECT(
                'id', j.id,
                'schet', j.schet
              )
            )
            FROM jur_schets j
            WHERE j.main_schet_id = m.id
              AND j.isdeleted = false
              AND j.type = '159'
          )
        , '[]'::JSON) AS jur3_schets_159,
        COALESCE(
          (
            SELECT JSON_AGG(
              JSON_BUILD_OBJECT(
                'id', j.id,
                'schet', j.schet
              )
            )
            FROM jur_schets j
            WHERE j.main_schet_id = m.id
              AND j.isdeleted = false
              AND j.type = '152'
          )
        , '[]'::JSON) AS jur3_schets_152,
        COALESCE(
          (
            SELECT JSON_AGG(
              JSON_BUILD_OBJECT(
                'id', j.id,
                'schet', j.schet
              )
            )
            FROM jur_schets j
            WHERE j.main_schet_id = m.id
              AND j.isdeleted = false
              AND j.type = 'jur4'
          )
        , '[]'::JSON ) AS jur4_schets
      FROM main_schet m
      JOIN users u ON m.user_id = u.id
      JOIN regions r ON u.region_id = r.id
      JOIN spravochnik_budjet_name b ON b.id = m.spravochnik_budjet_name_id
      WHERE m.isdeleted = false
        AND r.id = $1
        AND b.isdeleted = false
    `;

    const result = await db.query(query, params);

    return result;
  }

  static async getByAccount(params) {
    const query = `--sql
      SELECT
        m.*
      FROM main_schet m 
      JOIN users u ON u.id = m.user_id
      JOIN regions r ON r.id = u.region_id
      WHERE m.account_number = $1
        AND m.isdeleted = false
        AND r.id = $2
    `;

    const result = await db.query(query, params);

    return result[0];
  }

  static async create(params, client) {
    const query = `--sql
      INSERT INTO main_schet(
        account_number,
        spravochnik_budjet_name_id,
        tashkilot_nomi,
        tashkilot_bank,
        tashkilot_mfo,
        tashkilot_inn,
        account_name,
        jur1_schet,
        jur2_schet,
        gazna_number,
        user_id
      ) 
      VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id
    `;

    const result = await client.query(query, params);

    return result.rows[0];
  }

  static async createSchet(params, client) {
    const query = `--sql
      INSERT INTO jur_schets(
        schet,
        type,
        main_schet_id,
        created_at,
        updated_at
      )
      VALUES($1, $2, $3, $4, $5)
    `;

    await client.query(query, params);
  }

  static async update(params, client) {
    const query = `--sql
      UPDATE  main_schet SET 
        account_number = $1, 
        spravochnik_budjet_name_id = $2, 
        tashkilot_nomi = $3, 
        tashkilot_bank = $4, 
        tashkilot_mfo = $5, 
        tashkilot_inn = $6, 
        account_name = $7, 
        jur1_schet = $8, 
        jur2_schet = $9, 
        gazna_number = $10
      WHERE id = $11 RETURNING id
    `;

    const result = await client.query(query, params);

    return result.rows[0];
  }

  static async deleteJurSchet(params, client) {
    const query = `UPDATE jur_schets SET isdeleted = true WHERE id = $1`;

    await client.query(query, params);
  }

  static async updateJurSchet(params, client) {
    const query = `UPDATE jur_schets SET schet = $1 WHERE id = $2`;

    await client.query(query, params);
  }

  static async delete(params, client) {
    const result = await client.query(
      `UPDATE main_schet SET isdeleted = true WHERE id = $1 RETURNING id`,
      params
    );

    await client.query(
      `UPDATE jur_schets SET isdeleted = true WHERE main_schet_id = $1`,
      params
    );

    return result.rows[0];
  }

  static async getByBudjet(params) {
    const query = `--sql
       SELECT 
          main_schet.id AS main_schet_id, 
          main_schet.account_number 
        FROM main_schet 
        JOIN users ON main_schet.user_id = users.id
        JOIN regions ON users.region_id = regions.id
        WHERE main_schet.spravochnik_budjet_name_id = $1 
          AND main_schet.isdeleted = false
          AND regions.id = $2
    `;

    const result = await db.query(query, params);

    return result;
  }
};
