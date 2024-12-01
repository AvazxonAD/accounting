const { db } = require('../../db/index');
const { sqlFilter } = require('../../helper/functions')

exports.PodpisDB = class {
    static async getPodpis(params, type) {
        let index_type;
        if(type){
            index_type = params.length + 1
            params.push(type)
        };
        const query = `--sql
            SELECT 
            s_p.id, s_p.type_document, s_p.numeric_poryadok, 
            s_p.doljnost_name, s_p.fio_name
          FROM spravochnik_podpis_dlya_doc AS s_p
          JOIN users AS u ON u.id = s_p.user_id
          JOIN regions AS r ON r.id = u.region_id
          WHERE r.id = $1 AND s_p.isdeleted = false ${type ? sqlFilter('s_p.type_document', index_type) : ''}
          ORDER BY s_p.type_document
        `;
        const result = await db.query(query, params);
        return result;
    }
}