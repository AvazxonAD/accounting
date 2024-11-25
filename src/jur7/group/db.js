const { db } = require('../../db/index')

exports.GroupDB = class {
    static async createGroup(params) {
        const query = `--sql
            INSERT INTO group_jur7 (
                pereotsenka_jur7_id, 
                user_id, 
                name, 
                schet, 
                iznos_foiz, 
                provodka_debet, 
                provodka_subschet, 
                provodka_kredit, 
                created_at, 
                updated_at
            ) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *
        `
        const result = await db.query(query, params)
        return result;
    }
    static async getGroup(params, search = null) {
        let search_filter = ``
        if(search){
            search_filter = `AND g_j7.name ILIKE '%' || $${params.length + 1} || '%'`;
            params.push(search)
        }
        const query = `--sql
            WITH data AS (
                SELECT 
                    g_j7.id, 
                    g_j7.pereotsenka_jur7_id,
                    g_j7.name, 
                    g_j7.schet, 
                    g_j7.iznos_foiz, 
                    g_j7.provodka_debet, 
                    g_j7.provodka_subschet, 
                    g_j7.provodka_kredit,
                    p_j7.name AS pereotsenka_jur7_name
                FROM group_jur7 AS g_j7
                JOIN users AS u ON u.id = g_j7.user_id
                JOIN regions AS r ON r.id = u.region_id
                JOIN pereotsenka_jur7 AS p_j7 ON p_j7.id = g_j7.pereotsenka_jur7_id
                WHERE g_j7.isdeleted = false AND r.id = $1 ${search_filter}
                OFFSET $2 LIMIT $3
            )
            SELECT 
                ARRAY_AGG(row_to_json(data)) AS data,
                (
                    SELECT COALESCE(COUNT(g_j7.id), 0)::INTEGER 
                    FROM group_jur7 AS g_j7
                    JOIN users AS u ON u.id = g_j7.user_id
                    JOIN regions AS r ON r.id = u.region_id
                    WHERE g_j7.isdeleted = false AND r.id = $1 ${search_filter}
                ) AS total
            FROM data
        `

        const result = await db.query(query, params)
        return result[0];
    }
    static async getByIdGroup(params, isdeleted) {
        let ignore = 'AND g_j7.isdeleted = false';
        const query = `--sql
            SELECT 
                g_j7.id, 
                g_j7.pereotsenka_jur7_id,
                g_j7.name, 
                g_j7.schet, 
                g_j7.iznos_foiz, 
                g_j7.provodka_debet, 
                g_j7.provodka_subschet, 
                g_j7.provodka_kredit,
                p_j7.name AS pereotsenka_jur7_name
            FROM group_jur7 AS g_j7
            JOIN users AS u ON u.id = g_j7.user_id
            JOIN regions AS r ON r.id = u.region_id
            JOIN pereotsenka_jur7 AS p_j7 ON p_j7.id = g_j7.pereotsenka_jur7_id
            WHERE r.id = $1 AND g_j7.id = $2  ${isdeleted ? `` : ignore}
        `
        const result = await db.query(query, params)
        return result[0]
    }
    static async updateGroup(params) {
        const query = `--sql
            UPDATE group_jur7
            SET 
                pereotsenka_jur7_id = $1,
                name = $2,
                schet = $3,
                iznos_foiz = $4,
                provodka_debet = $5,
                provodka_subschet = $6,
                provodka_kredit = $7,
                updated_at = $8
            WHERE id = $9 AND isdeleted = false RETURNING *
        `
        const result = await db.query(query, params)
        return result[0]
    }
    static async deleteGroup(params) {
        const query = `UPDATE group_jur7 SET isdeleted = true WHERE id = $1 AND isdeleted = false`
        await db.query(query, params)
    }

}