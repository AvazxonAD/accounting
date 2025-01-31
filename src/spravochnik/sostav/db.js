const { db } = require('../../db/index');

exports.SostavDB = class {
    static async getByIdSostav(params, isdeleted) {
        const query = `--sql
            SELECT 
                s.id, 
                s.name, 
                s.rayon 
            FROM spravochnik_sostav AS s
            JOIN users AS u ON s.user_id = u.id
            JOIN regions AS r ON u.region_id = r.id    
            WHERE r.id = $1 AND s.id = $2  ${!isdeleted ? "AND s.isdeleted = false" : ''} 
        `;
        const result = await db.query(query, params);
        return result[0];
    }
}