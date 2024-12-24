const { db } = require('../../db/index')
const { returnParamsValues, } = require('../../helper/functions')

exports.DocMainBookDB = class {
    static async createDoc(params) { 
        const _values = returnParamsValues(params, 10) 
        const query = `--sql
            INSERT INTO documents_glavniy_kniga (
                user_id,
                main_schet_id,
                spravochnik_operatsii_id,
                type_document,
                month,
                year,
                debet_sum, 
                kredit_sum,
                created_at,
                updated_at
            ) 
            VALUES ${_values} RETURNING *
        `;
        const result = await db.query(query, params)
        return result;
    }

    static async getDoc(params, offset, limit, type) {
        let offset_limit = ``;
        if((offset !== undefined || offset !== null) && limit){
            offset_limit = `OFFSET $${params.length + 1} LIMIT $${params.length + 2}`;
            params.push(offset, limit)
        }
        let type_filter = ``;
        if (type) {
            type_filter = `AND d.type_document ILIKE '%' || $${params.length + 1} || '%'`;
            params.push(type)
        }
        const query = `--sql
            WITH data AS (
                SELECT 
                    d.id,
                    d.user_id,
                    d.main_schet_id,
                    d.spravochnik_operatsii_id,
                    d.type_document,
                    d.month,
                    d.year,
                    d.debet_sum,
                    d.kredit_sum,
                    d.created_at,
                    d.updated_at
                FROM documents_glavniy_kniga AS d
                JOIN users AS u ON u.id = d.user_id
                JOIN regions AS r ON r.id = u.region_id
                JOIN main_schet AS m ON m.id = d.main_schet_id
                WHERE r.id = $1 
                    AND d.isdeleted = false 
                    AND d.year = $2  
                    AND d.month = $3  
                    AND m.spravochnik_budjet_name_id = $4
                ${type_filter}
                ${offset_limit}
            )
          SELECT 
            ARRAY_AGG(row_to_json(data)) AS data
          FROM data
        `;
        console.log(query)
        const result = await db.query(query, params)
        return result[0];
    }

    static async getByIdDoc(params, isdeleted) {
        let ignore = 'AND d.isdeleted = false';
        const query = `--sql
            SELECT 
                d.id,
                d.user_id,
                d.main_schet_id,
                d.spravochnik_operatsii_id,
                d.type_document,
                d.month,
                d.year,
                d.debet_sum, 
                d.kredit_sum,
                d.created_at,
                d.updated_at
            FROM documents_glavniy_kniga AS d
            JOIN spravochnik_javobgar_shaxs_jur7 AS s_j_sh_kimga ON s_j_sh_kimga.id = d.kimga_id 
            JOIN spravochnik_javobgar_shaxs_jur7 AS s_j_sh_kimdan ON s_j_sh_kimdan.id = d.kimdan_id 
            JOIN users AS u ON u.id = d.user_id
            JOIN regions AS r ON r.id = u.region_id
            JOIN main_schet AS m ON m.id = d.main_schet_id
            WHERE r.id = $1 
            AND d.id = $2 
            AND m.spravochnik_budjet_name_id = $3 ${isdeleted ? `` : ignore}
        `;
        const result = await db.query(query, params);
        return result[0];
    }

    static async updateDoc(params) {
        const query = `--sql
            UPDATE documents_glavniy_kniga SET 
                spravochnik_operatsii_id = $1,
                type_document = $2,
                month = $3,
                year = $4,
                debet_sum = $5, 
                kredit_sum = $6,
                created_at = $7,
                updated_at = $8  
            WHERE id = $9 RETURNING * 
        `;
        const result = await db.query(query, params);
        return result[0];
    }

    static async deleteDoc(params, client) {
        await client.query(`UPDATE documents_glavniy_kniga SET isdeleted = true WHERE id = $1`, params);
    }
}