const { db } = require('@db/index');

exports.RoleDB = class {
    static async getRole(params, search, client) {
        let search_filter = ``;

        if (search) {
            params.push(search);
            search_filter = `AND name ILIKE '%' || $${params.length} || '%'`;
        }

        const query = `
            WITH data AS (
                SELECT 
                    id, name 
                FROM role 
                WHERE isdeleted = false 
                    AND name != 'region-admin' 
                    AND name != 'super-admin' 
                    ${search_filter}    
                ORDER BY id
                OFFSET $1 LIMIT $2
            )
            SELECT 
                JSON_AGG( row_to_json( data ) ) AS data,
                (
                    SELECT 
                        COALESCE( COUNT ( id ), 0)
                    FROM role 
                    WHERE isdeleted = false 
                        AND name != 'region-admin' 
                        AND name != 'super-admin' 
                        ${search_filter}    
                )::INTEGER AS total
            FROM data
        `;

        let result;
        if (client) {
            result = await client.query(query, params)
            result = result.rows
        } else {
            result = await db.query(query, params)
        }
        
        return result[0];
    }

    static async getByNameRole(params) {
        const query = `SELECT * FROM role WHERE name = $1 AND isdeleted = false`;
        const result = await db.query(query, params)
        return result[0];
    }

    static async createRole(params, client) {
        const query = `INSERT INTO role(name, created_at, updated_at) VALUES($1, $2, $3) RETURNING *`
        const result = await client.query(query, params)
        return result.rows[0];
    }

    static async getByIdRole(params, isdeleted) {
        const ignore = `AND isdeleted = false`
        const query = `SELECT id, name FROM role 
            WHERE isdeleted = false AND name != 'super-admin' AND name != 'region-admin' AND id = $1 ${!isdeleted ? ignore : ''} ORDER BY name
        `;
        const result = await db.query(query, params)
        return result[0];
    }

    static async updateRole(params) {
        const query = `UPDATE role SET name = $1, updated_at = $2 WHERE id = $3 RETURNING *`;
        const result = await db.query(query, params);
        return result[0];
    }

    static async deleteRole(params, client) {
        const query = `UPDATE role SET isdeleted = true WHERE id = $1 AND name != 'super-admin' AND name != 'region-admin'`;
        await client.query(query, params);
    }

    static async getAdminRole() {
        const query = `SELECT * FROM role WHERE name = 'region-admin'`
        const result = await db.query(query);
        return result[0];
    }
}