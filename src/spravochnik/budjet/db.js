const { db } = require('../../db/index')

exports.BudjetDB = class {
    static async getById (params, isdeleted){
        let ignore = 'AND isdeleted = false';
        const result = await db.query(`SELECT id, name FROM spravochnik_budjet_name WHERE id = $1 ${isdeleted ? '' : ignore}`, params);
        return result[0]
    }
}