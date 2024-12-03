const { db } = require('../../db/index')

exports.RoleDb = class {
    static async getRole() {
        const query = `SELECT id, name FROM role WHERE isdeleted = false AND name != $1 AND name != $2 ORDER BY name`;
        const result = db.query(query);
        return result;
    } 
}