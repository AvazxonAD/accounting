const { db } = require('@db/index')

exports.RegionDB = class {
    static async getById(params, isdeleted) {
        const ignore = `AND isdeleted = false`
        const query = `SELECT id, name FROM regions WHERE id = $1 ${isdeleted ? '' : ignore}`
        const result = await db.query(query, params)
        return result[0]
    }

    static async getByNameRegion(params) {
        const query = `SELECT * FROM regions WHERE name = $1 AND isdeleted = false`;
        const result = await db.query(query, params)
        return result[0];
    }

    static async createRegion(params, client) {
        const query = `INSERT INTO regions(name, created_at, updated_at) VALUES($1, $2, $3) RETURNING *`
        const result = await client.query(query, params)
        return result.rows[0];
    }

    static async getRegion(params, search, client) {
        let search_filter = ``;
        if (search) {
            params.push(search);
            search_filter = `AND name LIKE '%' || $${params.length} || '%'`;
        }

        const query = `
            WITH data AS (
                SELECT 
                    id, name 
                FROM regions 
                WHERE isdeleted = false
                    ${search_filter} 
                ORDER BY name
                OFFSET $1 LIMIT $2
            )
            SELECT 
                COALESCE( JSON_AGG( row_to_json( data ) ), '[]'::JSON ) AS data,
                (
                    SELECT 
                        COALESCE( COUNT( id ), 0)
                    FROM regions 
                    WHERE isdeleted = false
                        ${search_filter}
                )::INTEGER AS total
            FROM data
        `;
        let result;
        if (client) {
            result = await client.query(query, params);
            result = result.rows
        } else {
            result = await db.query(query, params);
        }
        return result[0];
    }

    static async updateRegion(params) {
        const query = `UPDATE regions SET name = $1, updated_at = $2 WHERE id = $3 RETURNING *`;
        const result = await db.query(query, params);
        return result[0];
    }

    static async deleteRegion(params, client) {
        const query = `UPDATE regions SET isdeleted = true WHERE id = $1`;
        await client.query(query, params);
    }
}