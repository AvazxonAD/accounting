const { db } = require('../../db/index')

exports.PodotchetDB = class {
    static async getByIdPodotchet(params, isdeleted) {
        const ignore = `AND s_p_l.isdeleted = false`
        const query = `--sql
            SELECT 
                s_p_l.id, 
                s_p_l.name, 
                s_p_l.rayon 
            FROM spravochnik_podotchet_litso AS s_p_l
            JOIN users ON s_p_l.user_id = users.id
            JOIN regions ON users.region_id = regions.id
            WHERE regions.id = $1 AND s_p_l.id = $2 ${isdeleted ? '' : ignore}
        `;
        const result = await db.query(query, params);
        return result[0];
    }

    static async getPodotchet(params) {
        const query = `--sql
            SELECT s_p_l.id, s_p_l.name, s_p_l.rayon
            FROM spravochnik_podotchet_litso AS s_p_l
            JOIN users AS u ON u.id = s_p_l.user_id
            JOIN regions AS r ON r.id = u.region_id
            WHERE r.id = $1 AND s_p_l.isdeleted = false 
            ORDER BY s_p_l.name, s_p_l.rayon
        `;
        const result = await db.query(query, params)
        return result;
    }
}