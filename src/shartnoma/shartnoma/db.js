const { db } = require('../../db/index')

exports.ContractDB = class {
    static async getByIdContract(params, isdeleted) {
        const ignore = `AND s_o.isdeleted = false`
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
            WHERE regions.id = $1
                AND sh_o.budjet_id = $2
                AND sh_o.id = $3 ${isdeleted ? '' : ignore}
        `;
        const result = await db.query(query, params)
        return result[0]
    }
}