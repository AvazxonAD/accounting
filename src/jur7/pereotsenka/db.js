const { db } = require('../../db/index')

exports.PereotsenkaDB = class {
    static async createPereotsenka (params) {
        const query = `--sql
            INSERT INTO 
            pereotsenka_jur7 (name, oy_1, oy_2, oy_3, oy_4, oy_5, oy_6, oy_7, oy_8, oy_9, oy_10, oy_11, oy_12, created_at, updated_at) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *
        `
        const result = await db.query(query, params)
        return result[0];
    } 

    static async getBYNamePereotsenka (params) {
        const query = `SELECT * FROM pereotsenka_jur7 WHERE name = $1 AND isdeleted = false`
        const result = await db.query(query, params)
        return result[0]
    }

    static async getPereotsenka (params, search) {
        let search_filter = ``
        if(search){
            search_filter = `AND name ILIKE '%' || $${params.length + 1} || '%'`;
            params.push(search)
        }
        const query = `--sql
            WITH data AS (
                SELECT id, name, oy_1, oy_2, oy_3, oy_4, oy_5, oy_6, oy_7, oy_8, oy_9, oy_10, oy_11, oy_12
                FROM pereotsenka_jur7 WHERE isdeleted = false ${search_filter}
                OFFSET $1 LIMIT $2
            )
            SELECT 
                ARRAY_AGG(row_to_json(data)) AS data,
                (SELECT COALESCE(COUNT(id), 0)::INTEGER FROM pereotsenka_jur7 WHERE isdeleted = false ${search_filter}) AS total
            FROM data
        `;
        const result = await db.query(query, params)
        return result[0];
    } 

    static async getByIdPereotsenka (params, isdeleted = null) {
        const ignore = `AND isdeleted = false`
        const query = `--sql
            SELECT 
                id, name, 
                oy_1::FLOAT, 
                oy_2::FLOAT, 
                oy_3::FLOAT, 
                oy_4::FLOAT, 
                oy_5::FLOAT, 
                oy_6::FLOAT, 
                oy_7::FLOAT, 
                oy_8::FLOAT, 
                oy_9::FLOAT, 
                oy_10::FLOAT, 
                oy_11::FLOAT, 
                oy_12::FLOAT 
            FROM pereotsenka_jur7 WHERE id = $1 ${isdeleted ? '' : ignore}
        `
        const result = await db.query(query, params)
        return result[0]
    }

    static async updatePereotsenka (params) {
        const query = `--sql
            UPDATE pereotsenka_jur7
            SET name = $1, oy_1 = $2, oy_2 = $3, oy_3 = $4, oy_4 = $5, oy_5 = $6, 
                oy_6 = $7, oy_7 = $8, oy_8 = $9, oy_9 = $10, oy_10 = $11, oy_11 = $12, 
                oy_12 = $13, updated_at = $14
            WHERE id = $15 AND isdeleted = false RETURNING *
        `
        const result = await db.query(query, params)
        return result[0];
    }
    
    static async deletePereotsenka (params) {
        const query = `UPDATE pereotsenka_jur7 SET isdeleted = true WHERE id = $1 AND isdeleted = false`
        await db.query(query, params)
    }
}