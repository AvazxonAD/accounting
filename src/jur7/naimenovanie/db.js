const { db } = require('../../db/index')

exports.NaimenovanieDB = class {
    static async createNaimenovanie(params) {
        const query = `--sql
            INSERT INTO naimenovanie_tovarov_jur7 (
                user_id, 
                spravochnik_budjet_name_id, 
                name, 
                edin, 
                group_jur7_id, 
                created_at, 
                updated_at
            ) 
            VALUES ($1, $2, $3, $4, $5, $6, $7) 
            RETURNING *
        `
        const result = await db.query(query, params)
        return result;
    }
    static async getNaimenovanie(params, search = null) {
        let search_filter = ``
        if (search) {
            search_filter = `AND n_t_j7.name ILIKE '%' || $${params.length + 1} || '%'`;
            params.push(search)
        }
        const query = `--sql
            WITH data AS (
                SELECT 
                    n_t_j7.id, 
                    n_t_j7.name, 
                    n_t_j7.edin,
                    n_t_j7.group_jur7_id,
                    g_j7.name AS group_jur7_name,
                    n_t_j7.spravochnik_budjet_name_id,
                    s_b_n.name AS spravochnik_budjet_name
                FROM naimenovanie_tovarov_jur7 AS n_t_j7
                JOIN users AS u ON u.id = n_t_j7.user_id
                JOIN regions AS r ON r.id = u.region_id
                JOIN group_jur7 AS g_j7 ON g_j7.id = n_t_j7.group_jur7_id
                JOIN spravochnik_budjet_name AS s_b_n ON s_b_n.id = n_t_j7.spravochnik_budjet_name_id 
                WHERE n_t_j7.isdeleted = false AND r.id = $1 ${search_filter}
                OFFSET $2 LIMIT $3
            )
            SELECT 
                ARRAY_AGG(row_to_json(data)) AS data,
                (
                    SELECT COALESCE(COUNT(n_t_j7.id), 0)::INTEGER 
                    FROM naimenovanie_tovarov_jur7 AS n_t_j7
                    JOIN users AS u ON u.id = n_t_j7.user_id
                    JOIN regions AS r ON r.id = u.region_id
                    WHERE n_t_j7.isdeleted = false AND r.id = $1 ${search_filter}
                ) AS total_count
            FROM data
        `

        const result = await db.query(query, params)
        return result[0];
    }
    static async getByIdNaimenovanie(params, isdeleted) {
        let ignore = 'AND n_t_j7.isdeleted = false';
        const query = `--sql
            SELECT 
                n_t_j7.id, 
                n_t_j7.name, 
                n_t_j7.edin,
                g_j7.name AS group_jur7_name,
                n_t_j7.group_jur7_id,
                n_t_j7.spravochnik_budjet_name_id,
                s_b_n.name AS spravochnik_budjet_name
            FROM naimenovanie_tovarov_jur7 AS n_t_j7
            JOIN users AS u ON u.id = n_t_j7.user_id
            JOIN regions AS r ON r.id = u.region_id
            JOIN group_jur7 AS g_j7 ON g_j7.id = n_t_j7.group_jur7_id
            JOIN spravochnik_budjet_name AS s_b_n ON s_b_n.id = n_t_j7.spravochnik_budjet_name_id 
            WHERE r.id = $1 AND n_t_j7.id = $2  ${isdeleted ? `` : ignore}
        `
        const result = await db.query(query, params)
        return result[0]
    }
    static async updateNaimenovanie(params) {
        const query = `--sql
            UPDATE naimenovanie_tovarov_jur7 
            SET name = $1, edin = $2, spravochnik_budjet_name_id = $3, group_jur7_id = $4, updated_at = $5
            WHERE id = $6 AND isdeleted = false
            RETURNING *
        `
        const result = await db.query(query, params)
        return result[0]
    }
    static async deleteNaimenovanie(params) {
        const query = `UPDATE naimenovanie_tovarov_jur7 SET isdeleted = true WHERE id = $1 AND isdeleted = false`
        await db.query(query, params)
    }

}