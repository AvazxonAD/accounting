const { db } = require('../../db/index');

exports.DashboardDB = class {
    static async getBudjet(params) {
        const query = `
            SELECT
                b.*,
                (   
                    SELECT JSON_AGG(m)
                    FROM main_schet m 
                    WHERE m.isdeleted = false AND m.spravochnik_budjet_name_id = b.id
                ) AS account_numbers    
            FROM spravochnik_budjet_name b
            WHERE b.isdeleted = false;
        `;

        const result = await db.query(query, params);

        return result;
    }
}