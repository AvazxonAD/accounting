const { db } = require('../../db/index');

exports.AdminDB = class {
    static async getAdmin(params, search) {
        let search_filter = ``;
        if(search){
            params.push(search);
            search_filter =  `AND (
                r_g.name ILIKE '%' || $${params.length} || '%' OR
                u.fio ILIKE '%' || $${params.length} || '%' OR
                u.login ILIKE '%' || $${params.length} || '%'
            )`;
        }
        const query = `--sql
            SELECT 
                u.id, 
                u.role_id, 
                u.region_id, 
                u.fio,
                u.login,
                r.name AS role_name,
                r_g.name AS region_name
            FROM users AS u
            JOIN role AS r ON r.id = u.role_id
            JOIN regions AS r_g ON r_g.id = u.region_id
            WHERE u.isdeleted = false 
                AND r.name = 'region-admin'
                ${search_filter}
        `;

        const result = await db.query(query, params);
        return result;
    }

    static async isExistsAdmin(params) {
        const query = `--sql
            SELECT 
                u.*
            FROM users AS u
            JOIN role AS r ON r.id = u.role_id
            WHERE u.isdeleted = false AND r.name = 'region-admin' AND u.region_id = $1
        `;
        const result = await db.query(query, params);
        return result[0]
    }

    static async createAdmin(params) {
        const query = `--sql
            INSERT INTO users(login, password, fio, role_id, region_id, created_at, updated_at) 
            VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *
        `;
        const result = await db.query(query, params);
        return result[0];
    }

    static async getByIdAdmin(params, isdeleted) {
        const ignore = `AND u.isdeleted = false`
        const query = `--sql
            SELECT 
                u.id, 
                u.fio, 
                u.login, 
                u.region_id, 
                u.role_id
            FROM users AS u
            WHERE u.id = $1 ${!isdeleted ? ignore : ''}
        `;
        const result = await db.query(query, params)
        return result[0];
    }

    static async updateAdmin(params) {
        const query = `--sql
            UPDATE users SET login = $1, password = $2, fio = $3, region_id = $4, updated_at = $5
            WHERE id = $6 RETURNING *
        `;
        const result = await db.query(query, params);
        return result[0];
    }

    static async deleteAdmin(params) {
        const query = `UPDATE users SET isdeleted = true WHERE id = $1`;
        await db.query(query, params);
    }
}