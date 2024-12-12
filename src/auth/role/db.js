const { db } = require('../../db/index');

exports.RoleDB = class {
    static async getRole(client) {
        const query = `SELECT id, name FROM role WHERE isdeleted = false AND name != 'region-admin' AND name != 'super-admin' ORDER BY id`;
        let result;
        if (client) {
            result = await client.query(query)
            result = result.rows
        } else {
            result = await db.query(query)
        }
        return result;
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