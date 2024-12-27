const { db } = require('../../db/index')

exports.MainBookSchetDB = class {
    static async createMainBookSchet(params) {
        const query = `--sql
            INSERT INTO spravochnik_main_book_schet (
                name, 
                schet, 
                created_at, 
                updated_at
            ) 
            VALUES ($1, $2, $3, $4) 
            RETURNING *
        `
        const result = await db.query(query, params)
        return result;
    }
    static async getMainBookSchet(params, search = null) {
        let search_filter = ``;
        if(search){
            search_filter = `AND name ILIKE '%' || $${params.length + 1} || '%'`;
            params.push(search)
        }
        const query = `--sql
            WITH data AS (
                SELECT 
                    id,
                    name, 
                    schet, 
                    created_at, 
                    updated_at
                FROM spravochnik_main_book_schet
                WHERE isdeleted = false ${search_filter}
                OFFSET $1 LIMIT $2
            )
            SELECT 
                ARRAY_AGG(row_to_json(data)) AS data,
                (
                    SELECT COALESCE(COUNT(id), 0)::INTEGER 
                    FROM spravochnik_main_book_schet
                    WHERE isdeleted = false ${search_filter}
                ) AS total
            FROM data
        `
        const result = await db.query(query, params)
        return result[0];
    }
    static async getByIdMainBookSchet(params, isdeleted) {
        let ignore = 'AND isdeleted = false';
        const query = `--sql
            SELECT 
                id, 
                name,
                schet,
                created_at, 
                updated_at
            FROM spravochnik_main_book_schet
            WHERE id = $1 ${isdeleted ? `` : ignore}
        `;
        const result = await db.query(query, params)
        return result[0]
    }

    static async getByNameMainBookSchet(params) {
        const query = `--sql
            SELECT s_p_j7.*
            FROM spravochnik_main_book_schet AS s_p_j7
            WHERE schet = $1 AND isdeleted = false
        `
        const result = await db.query(query, params)
        return result[0]
    }

    static async updateMainBookSchet(params) {
        const query = `--sql
            UPDATE spravochnik_main_book_schet SET name = $1, schet = $2, updated_at = $3
            WHERE id = $4 AND isdeleted = false 
            RETURNING *
        `
        const result = await db.query(query, params)
        return result[0]
    }

    static async deleteMainBookSchet(params) {
        const query = `UPDATE spravochnik_main_book_schet SET isdeleted = true WHERE id = $1`
        await db.query(query, params)
    }

}