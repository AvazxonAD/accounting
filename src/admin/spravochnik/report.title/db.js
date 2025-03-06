const { db } = require('@db/index')

exports.ReportTitleDB = class {
    static async create(params) {
        const query = `--sql
            INSERT INTO report_title (
                name, 
                created_at, 
                updated_at
            ) 
            VALUES ($1, $2, $3) 
            RETURNING *
        `
        const result = await db.query(query, params)
        return result;
    }

    static async get(params, search = null) {
        let search_filter = ``;
        if (search) {
            search_filter = `AND name ILIKE '%' || $${params.length + 1} || '%'`;
            params.push(search);
        }
        const query = `--sql
            WITH data AS (
                SELECT 
                    rt.*, 
                FROM report_title AS rt
                WHERE rt.isdeleted = false ${search_filter}
                OFFSET $1 LIMIT $2
            )
            SELECT 
                COALESCE( JSON_AGG( row_to_json( data ) ), '[]'::JSON ) AS data,
                (
                    SELECT COALESCE(COUNT(rt.id), 0)::INTEGER 
                    FROM report_title AS rt
                    WHERE rt.isdeleted = false ${search_filter}
                ) AS total
            FROM data
        `
        const result = await db.query(query, params)
        return result[0];
    }

    static async getById(params, isdeleted) {
        let ignore = 'AND rt.isdeleted = false';
        const query = `--sql
            SELECT 
                rt.* 
            FROM report_title AS rt
            WHERE rt.id = $1 ${isdeleted ? `` : ignore}
        `
        const result = await db.query(query, params)
        return result[0]
    }

    static async getByName(params) {
        const query = `--sql
            SELECT rt.*
            FROM report_title AS rt
            WHERE rt.name = $1
                AND rt.isdeleted = false
        `
        const result = await db.query(query, params)
        return result[0]
    }

    static async update(params) {
        const query = `--sql
            UPDATE report_title SET name = $1, updated_at = $2
            WHERE id = $3 
                AND isdeleted = false 
            RETURNING *
        `
        const result = await db.query(query, params)
        return result[0]
    }

    static async delete(params) {
        const query = `UPDATE report_title SET isdeleted = true WHERE id = $1 AND isdeleted = false RETURNING *`

        const data = await db.query(query, params);

        return data[0];
    }
}