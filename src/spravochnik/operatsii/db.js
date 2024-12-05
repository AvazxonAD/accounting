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
        return result;
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
}