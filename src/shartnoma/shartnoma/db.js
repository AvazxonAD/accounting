const { db } = require('../../db/index')

exports.ContractDB = class {
    static async getByIdContract(params, isdeleted, budjet_id, organ_id) {
        const ignore = `AND sh_o.isdeleted = false`
        let budjet_filter = ``
        let organ_filter = ``
        if(budjet_id){
            budjet_filter = `AND sh_o.budjet_id = $${params.length + 1}`
            params.push(budjet_id)
        }
        if(organ_id){
            organ_filter = `AND s_o.id = $${params.length + 1}`
            params.push(organ_id)
        }
        let query = `--sql
            SELECT
                sh_o.id, 
                sh_o.spravochnik_organization_id,
                sh_o.doc_num,
                TO_CHAR(sh_o.doc_date, 'YYYY-MM-DD') AS doc_date,
                sh_o.smeta2_id,
                sh_o.smeta_id,
                sh_o.opisanie,
                sh_o.summa,
                sh_o.pudratchi_bool,
                sh_o.yillik_oylik
            FROM shartnomalar_organization AS sh_o
            JOIN users  ON sh_o.user_id = users.id
            JOIN regions ON users.region_id = regions.id
            JOIN spravochnik_organization AS s_o ON s_o.id = sh_o.spravochnik_organization_id
            WHERE regions.id = $1 AND sh_o.id = $2 ${isdeleted ? '' : ignore} ${budjet_filter} ${organ_filter}
        `;
        const result = await db.query(query, params)
        return result[0]
    }
}