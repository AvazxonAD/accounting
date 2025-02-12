const { db } = require('@db/index');

exports.FeaturesDB = class {
    static async getDocNum(tableName, params) {
        const main_schet_filter = tableName !== 'shartnomalar_organization' ? 'AND d.main_schet_id = $2' : '';
        params = tableName !== 'shartnomalar_organization' ? params : params.splice(1, 1);
        
        const query = `
            SELECT d.doc_num
            FROM ${tableName} d
            JOIN users u ON u.id = d.user_id
            JOIN regions r ON r.id = u.region_id
            WHERE r.id = $1
              ${main_schet_filter}
              AND d.doc_num ~ '^[0-9]+$'
              AND d.isdeleted = false
            ORDER BY CAST(d.doc_num AS DOUBLE PRECISION) DESC
            LIMIT 1
        `;

        const data = await db.query(query, params);
  
        return data[0] || { doc_num: 0 };
    }
};
