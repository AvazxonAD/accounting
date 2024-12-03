const { db } = require('../../db/index');

exports.RoleDB = class {
    static async getRole(client) {
        const query = `SELECT id, name FROM role WHERE isdeleted = false AND name != 'region-admin' AND name != 'super-admin' ORDER BY id`;
        let result;
        if(client){
            result = await client.query(query)
            result = result.rows
        } else {
            result = await db.query(query)
        }
        return result;
    }
}