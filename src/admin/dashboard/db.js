const { db } = require('../../db/index');

exports.DashboardDB = class {
    static async getBudjet(params) {
        const query = `
            SELECT
                b.*,
                JSON_AGG(m) AS account_numbers    
            FROM spravochnik_budjet_name b
            JOIN main_schet m ON m.spravochnik_budjet_name_id = b.id
            WHERE isdeleted = b.false
        `;

        const result = await db.query(query, params);

        return result;
    }
}