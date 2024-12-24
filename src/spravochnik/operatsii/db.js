const { db } = require('../../db/index');

exports.OperatsiiDB = class {
    static async getByIdOperatsii(params, type, isdeleted) {
        let type_filter = ``;
        if (type) {
            type_filter = `AND type_schet = $${params.length + 1}`;
            params.push(type)
        }
        const query = `--sql
            SELECT id, name, schet, sub_schet, type_schet, smeta_id 
            FROM spravochnik_operatsii 
            WHERE id = $1 ${type_filter} ${!isdeleted ? 'AND isdeleted = false' : ''}
        `;
        const result = await db.query(query, params);
        return result[0];
    }

    static async getOperatsiiByChildArray(params, type) {
        const ids = params.map((item) => item.spravochnik_operatsii_id);
        const placeHolders = ids.map((_, i) => `$${i + 2}`).join(', ');
        const values = [type, ...ids];
        const result = await db.query(`SELECT schet
            FROM spravochnik_operatsii 
            WHERE type_schet = $1 AND isdeleted = false AND id IN (${placeHolders})
        `, values);
        return result;
    }

    static async getByTypeOperatsii(params, schet = null, isdeleted = null){
        let schet_filter = ``;
        if(schet){
            schet_filter = `AND schet = $${params.length + 1}`
            params.push(schet);
        }
        const query = `SELECT schet FROM spravochnik_operatsii WHERE type_schet = $1 ${!isdeleted ? "AND isdeleted = false" : ""} ${schet_filter}`
        const result = await db.query(query, params);
        return result;
    }
}