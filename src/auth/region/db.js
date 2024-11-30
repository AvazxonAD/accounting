const { db } = require('../../db/index')

exports.RegionDB = class {
    static async getByIdRegion(params, isdeleted) {
        const ignore = `AND isdeleted = false`
        const query = `SELECT id, name FROM regions WHERE id = $1 ${isdeleted ? '' : ignore}`
        const result = await db.query(query, params)
        return result[0]
    }
}