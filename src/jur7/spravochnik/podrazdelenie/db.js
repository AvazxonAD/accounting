const { db } = require('../../../db/index')

exports.PodrazdelenieDB = class {
    static async createPodrazdelenie(params) {
        const query = `--sql
            INSERT INTO spravochnik_podrazdelenie_jur7 (
                user_id, 
                name, 
                created_at, 
                updated_at
            ) 
            VALUES ($1, $2, $3, $4) 
            RETURNING id
        `
        const result = await db.query(query, params)
        return result[0];
    }
    static async getPodrazdelenie(params, search = null) {
        let search_filter = ``
        if(search){
            search_filter = `AND s_p_j7.name ILIKE '%' || $${params.length + 1} || '%'`;
            params.push(search)
        }
        const query = `--sql
            WITH data AS (
                SELECT 
                    s_p_j7.id, 
                    s_p_j7.name
                FROM spravochnik_podrazdelenie_jur7 AS s_p_j7
                JOIN users AS u ON u.id = s_p_j7.user_id
                JOIN regions AS r ON r.id = u.region_id
                WHERE s_p_j7.isdeleted = false AND r.id = $1 ${search_filter} 
                OFFSET $2 LIMIT $3
            )
            SELECT 
                ARRAY_AGG(row_to_json(data)) AS data,
                (
                    SELECT COALESCE(COUNT(s_p_j7.id), 0)::INTEGER 
                    FROM spravochnik_podrazdelenie_jur7 AS s_p_j7
                    JOIN users AS u ON u.id = s_p_j7.user_id
                    JOIN regions AS r ON r.id = u.region_id
                    WHERE s_p_j7.isdeleted = false AND r.id = $1 ${search_filter}
                ) AS total
            FROM data
        `;
        const result = await db.query(query, params)
        return result[0];
    }
    static async getByIdPodrazdelenie(params, isdeleted) {
        let ignore = 'AND s_p_j7.isdeleted = false';
        const query = `--sql
            SELECT 
                s_p_j7.id, 
                s_p_j7.name
            FROM spravochnik_podrazdelenie_jur7 AS s_p_j7
            JOIN users AS u ON u.id = s_p_j7.user_id
            JOIN regions AS r ON r.id = u.region_id
            WHERE r.id = $1 AND s_p_j7.id = $2  ${isdeleted ? `` : ignore}
        `
        const result = await db.query(query, params)
        return result[0]
    }

    static async getByNamePodrazdelenie(params) {
        const query = `--sql
            SELECT s_p_j7.*
            FROM spravochnik_podrazdelenie_jur7 AS s_p_j7
            JOIN users AS u ON u.id = s_p_j7.user_id
            JOIN regions AS r ON r.id = u.region_id
            WHERE r.id = $1 AND s_p_j7.name = $2  AND s_p_j7.isdeleted = false
        `
        const result = await db.query(query, params)
        return result[0]
    }

    static async updatePodrazdelenie(params) {
        const query = `--sql
            UPDATE spravochnik_podrazdelenie_jur7 SET name = $1, updated_at = $2
            WHERE id = $3 AND isdeleted = false 
            RETURNING *
        `
        const result = await db.query(query, params)
        return result[0]
    }

    static async deletePodrazdelenie(params) {
        const query = `UPDATE spravochnik_podrazdelenie_jur7 SET isdeleted = true WHERE id = $1 AND isdeleted = false`
        await db.query(query, params)
    }

}