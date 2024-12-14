const { db } = require('../../db/index');

exports.AuthDB = class {
    static async getByLoginAuth(params) {
        const query = `SELECT users.* FROM users WHERE login = $1 AND isdeleted = false`;
        const result = await db.query(query, params)
        return result[0]
    }

    static async getByIdAuth(params, isdeleted = false) {
        const query = `--sql
            SELECT 
                u.id, 
                u.fio, 
                u.login,
                u.password, 
                u.region_id, 
                u.role_id, 
                r.name AS role_name,
                r_g.name AS region_name
            FROM users AS u
            LEFT JOIN regions AS r_g ON r_g.id = u.region_id
            JOIN role AS r ON r.id = u.role_id
            WHERE u.id = $1 ${!isdeleted ? 'AND u.isdeleted = false' : ''}
        `;
        const result = await db.query(query, params);
        return result[0];
    }

    static async updateAuth(params) {
        const query = `UPDATE users SET login = $1, password = $2, fio = $3, updated_at = $4 WHERE id = $5 RETURNING *`;
        const result = await db.query(query, params);
        return result;
    }
}
