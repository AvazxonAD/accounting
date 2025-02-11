const { db } = require('../../db/index');

exports.GrafikDB = class {
    static async deleteGrafikByContractId(params, client) {
        const _db = client || db;

        const query = `UPDATE shartnoma_grafik SET isdeleted = true WHERE id_shartnomalar_organization = $1 AND isdeleted = false`;

        await _db.query(query, params);
    }

    static async create(params, client) {
        const _db = client || db;

        const query = `
            INSERT INTO shartnoma_grafik(
                id_shartnomalar_organization, 
                user_id, 
                budjet_id, 
                year, 
                oy_1,
                oy_2,
                oy_3,
                oy_4,
                oy_5,
                oy_6,
                oy_7,
                oy_8,
                oy_9,
                oy_10,
                oy_11,
                oy_12,
                yillik_oylik,
                smeta_id
            ) 
            
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18) 
            
            RETURNING id
        `;

        const result = await _db.query(query, params);

        const response = client ? result.rows[0] : result[0];

        return response;
    }

    static async getSummaByContractId(params, client) {
        const _db = client || db;

        const query = `
            SELECT 
                COALESCE(SUM(
                        (
                            oy_1 + oy_2 + oy_3 + oy_4 + oy_5 + oy_6 + oy_7 + oy_8 + oy_9 + oy_10 + oy_11 + oy_12
                        )
                ), 0)::FLOAT AS summa
            FROM shartnoma_grafik
            WHERE id_shartnomalar_organization = $1 
                AND isdeleted = false
        `;

        const result = await _db.query(query, params);

        const response = client ? result.rows[0] : result[0];

        return response;
    }

}