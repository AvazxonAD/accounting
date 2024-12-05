const { db } = require('../../db/index');

exports.TypeOperatsiiDB = class {
    static async getByIdTypeOperatsii(params, isdeleted) {
        const query = `--sql
            SELECT 
                s.id, 
                s.name, 
                s.rayon 
            FROM spravochnik_type_operatsii AS s
            JOIN users AS u ON s.user_id = u.id
            JOIN regions AS r ON u.region_id = r.id    
            WHERE s.id = $2  AND r.id = $1 ${!isdeleted ? "AND s.isdeleted = false" : ''} 
        `;
        const result = await db.query(query, params);
        return result;
    }
}