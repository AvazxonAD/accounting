const { db } = require('../../db/index')

exports.OrganizationDB = class {
    static async getByIdorganization(params, isdeleted) {
        const ignore = `AND s_o.isdeleted = false`
        let query = `--sql
            SELECT 
                s_o.id, 
                s_o.name, 
                s_o.bank_klient, 
                s_o.raschet_schet, 
                s_o.raschet_schet_gazna, 
                s_o.mfo, 
                s_o.inn, 
                s_o.okonx  
            FROM spravochnik_organization AS s_o 
            JOIN users ON s_o.user_id = users.id
            JOIN regions ON users.region_id = regions.id 
            WHERE regions.id = $1 AND s_o.id = $2 ${isdeleted ? '' : ignore}
        `;
        const result = await db.query(query, params)
        return result;
    }
}