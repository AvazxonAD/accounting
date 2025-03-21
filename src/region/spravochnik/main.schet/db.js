const { db } = require("@db/index");
exports.MainSchetDB = class {
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

    const query = `
        WITH data AS (SELECT 
            main_schet.*, 
            spravochnik_budjet_name.name AS budjet_name,
            spravochnik_budjet_name.id AS spravochnik_budjet_name_id 
        FROM main_schet
        JOIN users ON main_schet.user_id = users.id
        JOIN regions ON users.region_id = regions.id
        JOIN spravochnik_budjet_name 
            ON spravochnik_budjet_name.id = main_schet.spravochnik_budjet_name_id
        WHERE main_schet.isdeleted = false AND regions.id = $1 ${where} OFFSET $2 LIMIT $3)
        SELECT 
            COALESCE( JSON_AGG( row_to_json( data ) ), '[]'::JSON ) AS data,
            (
                SELECT 
                    COALESCE(COUNT(m .id), 0)::INTEGER
                FROM main_schet m 
                JOIN users u ON m.user_id = u.id
                JOIN regions r ON u.region_id = r.id
                WHERE m.isdeleted = false
                    ${where}
                    AND r.id = $1
            )::INTEGER AS total_count
        FROM data
    `;
    const result = await pool.query(query, params);

    return {
      result: result.rows[0]?.data || [],
      total: result.rows[0]?.total_count || 0,
    };
  }
};
