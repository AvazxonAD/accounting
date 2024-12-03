
const { returnParamsValues } = require('../../helper/functions')

exports.AccessDB = class {
    static async createAccess(params, client) {
        const values = returnParamsValues(params, 4);
        const query = `INSERT INTO access (role_id, region_id, created_at, updated_at) VALUES ${values}`;
        const result = await client.query(query, params);
        return result;
    }

    static async deleteAccess(params, client) {
        const query = `UPDATE access SET isdeleted = true WHERE role_id = $1`;
        await client.query(query,  params)
    }
}