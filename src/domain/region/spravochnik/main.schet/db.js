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

  static async getByIdMainSchet(params, isdeleted = null) {
    const ignore = `AND m_s.isdeleted = false`;
    const query = `--sql
            SELECT 
                m_s.id, 
                m_s.account_number, 
                m_s.spravochnik_budjet_name_id, 
                m_s.tashkilot_nomi, 
                m_s.tashkilot_bank, 
                m_s.tashkilot_mfo, 
                m_s.tashkilot_inn, 
                m_s.account_name, 
                m_s.jur1_schet, 
                m_s.jur1_subschet,
                m_s.jur2_schet, 
                m_s.jur2_subschet,
                m_s.jur3_schet,
                m_s.jur3_subschet, 
                m_s.jur4_schet,
                m_s.jur4_subschet, 
                s_b_n.name AS budjet_name
            FROM main_schet m_s
            JOIN users AS u ON m_s.user_id = u.id
            JOIN regions AS r ON u.region_id = r.id
            JOIN spravochnik_budjet_name AS s_b_n ON s_b_n.id = m_s.spravochnik_budjet_name_id
            WHERE r.id = $1
                AND m_s.id = $2 ${isdeleted ? "" : ignore}
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
                  AND j.type = 'jur3'
              )
            , '[]'::JSON) AS jur3_schets,
            COALESCE(
              (
                SELECT JSON_AGG(row_to_json(j))
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
};
