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

    static async getDoc(params) {
        const query = `--sql
            SELECT 
                d.type_document,
                d.month,
                d.year,
                COALESCE(SUM(d.debet_sum)::FLOAT, 0) AS debet_sum,
                COALESCE(SUM(d.kredit_sum)::FLOAT, 0) AS kredit_sum
            FROM documents_glavniy_kniga AS d
            JOIN users AS u ON u.id = d.user_id
            JOIN regions AS r ON r.id = u.region_id
            JOIN main_schet AS m ON m.id = d.main_schet_id
            WHERE r.id = $1 
                AND d.isdeleted = false 
                AND m.spravochnik_budjet_name_id = $2
            GROUP BY d.type_document, d.month, d.year
        `;
        const result = await db.query(query, params)
        return result;
    }

    static async getByIdDoc(params) {
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
            JOIN users AS u ON u.id = d.user_id
            JOIN regions AS r ON r.id = u.region_id
            JOIN main_schet AS m ON m.id = d.main_schet_id
            WHERE r.id = $1 
                AND d.year = $2
                AND  d.month = $3
                AND d.type_document = $4
                AND m.spravochnik_budjet_name_id = $5
                AND d.isdeleted = false
        `;
        const result = await db.query(query, params);
        return result;
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
        await client.query(`UPDATE documents_glavniy_kniga SET isdeleted = true WHERE month = $1 AND year = $2 AND type_document = $3`, params);
    }

    static async dropDoc(params, client) {
        const query = `--sql
            UPDATE documents_glavniy_kniga SET isdeleted = true WHERE month = $1 AND year = $2 AND type_document = $3 
        `;
        await client.query(query, params);
    }
}