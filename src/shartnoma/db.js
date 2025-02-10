const { db } = require('../db/index')

exports.ContractDB = class {
    static async getById(params, isdeleted, budjet_id, organ_id) {
        const ignore = `AND sh_o.isdeleted = false`
        let budjet_filter = ``
        let organ_filter = ``
        if (budjet_id) {
            budjet_filter = `AND sh_o.budjet_id = $${params.length + 1}`
            params.push(budjet_id)
        }
        if (organ_id) {
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

    static async getContract(params, organ_id, pudratchi, search) {
        let search_filter = ``
        let filter_organization = ``
        let pudratchi_filter = ``
        if (organ_id) {
            params.push(organ_id)
            filter_organization = `AND sh_o.spravochnik_organization_id = $${params.length}`
        }
        if (pudratchi === 'true') {
            pudratchi_filter = `AND sh_o.pudratchi_bool = true`
        }
        if (pudratchi === 'false') {
            pudratchi_filter = `AND sh_o.pudratchi_bool = false`
        }
        if (search) {
            params.push(search)
            search_filter = `AND (sh_o.doc_num ILIKE '%' || $${params.length} || '%' OR sh_o.opisanie ILIKE '%' || $${params.length} || '%')`
        }
        const query = `--sql
            WITH 
                data AS (
                    SELECT 
                        sh_o.id,
                        sh_o.spravochnik_organization_id,
                        sh_o.doc_num,
                        TO_CHAR(sh_o.doc_date, 'YYYY-MM-DD') AS doc_date,
                        sh_o.smeta_id,
                        sh_o.smeta2_id,
                        sh_o.opisanie,
                        sh_o.summa,
                        sh_o.pudratchi_bool,
                        smeta.smeta_number,
                        sh_o.budjet_id,
                        sh_o.yillik_oylik
                    FROM shartnomalar_organization AS sh_o
                    JOIN users AS u ON sh_o.user_id = u.id
                    JOIN regions AS r ON u.region_id = r.id
                    JOIN smeta ON sh_o.smeta_id = smeta.id
                    WHERE sh_o.isdeleted = false ${filter_organization} ${pudratchi_filter} ${search_filter}
                        AND r.id = $1
                        AND sh_o.budjet_id = $2
                    ORDER BY sh_o.doc_date 
                    OFFSET $3 
                    LIMIT $4
                ) 
                SELECT 
                    ARRAY_AGG(row_to_json(data)) AS data,
                    (
                        SELECT COUNT(sh_o.id) 
                        FROM shartnomalar_organization AS sh_o
                        JOIN users AS u  ON sh_o.user_id = u.id
                        JOIN regions AS r ON u.region_id = r.id
                        WHERE sh_o.isdeleted = false ${filter_organization} ${pudratchi_filter} ${search_filter}
                            AND r.id = $1
                            AND sh_o.budjet_id = $2
                    )::INTEGER AS total_count
                FROM data
        `;
        const data = await db.query(query, params);
        return { data: data[0]?.data || [], total: data[0]?.total_count }
    }

    static async getContractByOrganizations(params, organ_id) {
        let organ_filter = ``;
        if(organ_id){
            params.push(organ_id);
            organ_filter = `AND so.id = $${params.length}`;
        }
        const query = `--sql
            SELECT 
                sh_o.id AS contract_id,
                sh_o.doc_num,
                TO_CHAR(sh_o.doc_date, 'YYYY-MM-DD') AS doc_date,
                so.id,
                so.name
            FROM shartnomalar_organization sh_o
            JOIN users u ON sh_o.user_id = u.id
            JOIN regions r ON u.region_id = r.id
            JOIN spravochnik_organization so ON so.id = sh_o.spravochnik_organization_id 
            WHERE sh_o.isdeleted = false 
                AND r.id = $1
                ${organ_filter}
        `;
        const result = await db.query(query, params);
        return result;
    }
}