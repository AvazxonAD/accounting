const { db } = require('../../db/index')

exports.SmetaDB = class {
    static async getByIdSmeta(params, isdeleted) {
        let ignore = `AND isdeleted = false`
        const result = await db.query(`
            SELECT 
                id, 
                smeta_name, 
                smeta_number, 
                father_smeta_name 
            FROM smeta  
            WHERE id = $1 ${isdeleted ? '' : ignore}
        `, params);
        return result[0];
    }
}