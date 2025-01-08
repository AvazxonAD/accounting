const { db } = require('../../../db/index')

exports.ResponsibleDB = class {
    static async createResponsible(params) {
        const query = `--sql
            INSERT INTO spravochnik_javobgar_shaxs_jur7 (
                spravochnik_podrazdelenie_jur7_id, 
                fio, 
                user_id, 
                created_at, 
                updated_at
            ) 
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING *
        `;
        const result = await db.query(query, params)
        return result;
    }
    static async getResponsible(params, search = null, podraz_id = null) {
        let search_filter = ``;
        let podraz_filter = ``;
        if(search){
            search_filter = `AND s_j_s_j7.fio ILIKE '%' || $${params.length + 1} || '%'`;
            params.push(search)
        }
        if(podraz_id){
            params.push(podraz_id);
            podraz_filter = `AND s_p_j7.id = $${params.length}`;
        }
        const query = `--sql
            WITH data AS (
                SELECT 
                    s_j_s_j7.id, 
                    s_j_s_j7.fio,
                    s_j_s_j7.spravochnik_podrazdelenie_jur7_id,
                    s_p_j7.name AS spravochnik_podrazdelenie_jur7_name
                FROM spravochnik_javobgar_shaxs_jur7 AS s_j_s_j7
                JOIN users AS u ON u.id = s_j_s_j7.user_id
                JOIN regions AS r ON r.id = u.region_id
                JOIN spravochnik_podrazdelenie_jur7 AS s_p_j7 ON s_p_j7.id = s_j_s_j7.spravochnik_podrazdelenie_jur7_id  
                WHERE s_j_s_j7.isdeleted = false 
                    AND r.id = $1 
                    ${search_filter} 
                    ${podraz_filter}
                OFFSET $2 LIMIT $3
            )
            SELECT 
                ARRAY_AGG(row_to_json(data)) AS data,
                (
                    SELECT COALESCE(COUNT(s_j_s_j7.id), 0)::INTEGER 
                    FROM spravochnik_javobgar_shaxs_jur7 AS s_j_s_j7
                    JOIN users AS u ON u.id = s_j_s_j7.user_id
                    JOIN regions AS r ON r.id = u.region_id
                    WHERE s_j_s_j7.isdeleted = false AND r.id = $1 ${search_filter}
                ) AS total
            FROM data
        `

        const result = await db.query(query, params)
        return result[0];
    }
    static async getByIdResponsible(params, isdeleted) {
        let ignore = 'AND s_j_s_j7.isdeleted = false';
        const query = `--sql
            SELECT 
                s_j_s_j7.id, 
                s_j_s_j7.fio,
                s_p_j7.name AS spravochnik_podrazdelenie_jur7_name,
                s_j_s_j7.spravochnik_podrazdelenie_jur7_id
            FROM spravochnik_javobgar_shaxs_jur7 AS s_j_s_j7
            JOIN users AS u ON u.id = s_j_s_j7.user_id
            JOIN regions AS r ON r.id = u.region_id
            JOIN spravochnik_podrazdelenie_jur7 AS s_p_j7 ON s_p_j7.id = s_j_s_j7.spravochnik_podrazdelenie_jur7_id  
            WHERE  r.id = $1 AND s_j_s_j7.id = $2 ${isdeleted ? `` : ignore}
        `
        const result = await db.query(query, params)
        return result[0]
    }
    static async updateResponsible(params) {
        const query = `--sql
            UPDATE spravochnik_javobgar_shaxs_jur7 
            SET fio = $1, updated_at = $2,  spravochnik_podrazdelenie_jur7_id = $3
            WHERE id = $4 AND isdeleted = false 
            RETURNING *
        `
        const result = await db.query(query, params)
        return result[0]
    }
    static async deleteResponsible(params) {
        const query = `UPDATE spravochnik_javobgar_shaxs_jur7 SET isdeleted = true WHERE id = $1 AND isdeleted = false`
        await db.query(query, params)
    }

    static async getResponsibleReport(params){
        const query = `--sql
            SELECT 
                s_j_s_j7.id, 
                s_j_s_j7.fio,
                s_j_s_j7.spravochnik_podrazdelenie_jur7_id,
                s_p_j7.name AS spravochnik_podrazdelenie_jur7_name
            FROM spravochnik_javobgar_shaxs_jur7 AS s_j_s_j7
            JOIN users AS u ON u.id = s_j_s_j7.user_id
            JOIN regions AS r ON r.id = u.region_id
            JOIN spravochnik_podrazdelenie_jur7 AS s_p_j7 ON s_p_j7.id = s_j_s_j7.spravochnik_podrazdelenie_jur7_id  
            WHERE s_j_s_j7.isdeleted = false AND r.id = $1
        `;
        const result = await db.query(query, params)
        return result;
    }
}