const { db } = require('../../db/index')
const { returnParamsValues, } = require('../../helper/functions')

exports.DocMainBookDB = class {
    static async createDoc(params, client) {
        const query = `--sql
            INSERT INTO main_book_doc_parent (
                user_id,
                budjet_id,
                type_document,
                month,
                year,
                created_at,
                updated_at
            ) 
            VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *
        `;
        const result = await client.query(query, params)
        return result.rows[0];
    }

    static async updateDoc(params, client) {
        const query = `--sql
            UPDATE main_book_doc_parent 
                SET 
                    type_document = $1,
                    month = $2,
                    year = $3,
                    updated_at = $4
            WHERE id = $5
            RETURNING *
        `;
        const result = await client.query(query, params)
        return result.rows[0];
    }

    static async createDocChild(params, client) {
        const _values = returnParamsValues(params, 6)
        const query = `--sql
            INSERT INTO main_book_doc_child (
                spravochnik_operatsii_id,
                parent_id,
                debet_sum, 
                kredit_sum,
                created_at,
                updated_at
            ) 
            VALUES ${_values} RETURNING *
        `;
        const result = await client.query(query, params)
        return result.rows;
    }

    static async getDoc(params, year, month, type) {
        let year_filter = ``;
        let month_filter = ``;
        let type_filter = ``;
        if(year){
            year_filter = `AND d.year = $${params.length + 1}`;
            params.push(year)
        }
        if(month){
            month_filter = `AND d.month = $${params.length + 1}`;
            params.push(month)
        }
        if(type){
            type_filter = `AND d.type_document = $${params.length + 1}`;
            params.push(type)
        }
        const query = `--sql
            SELECT 
                d.id::INTEGER,
                d.type_document,
                d.month,
                d.year
            FROM main_book_doc_parent AS d
            JOIN users AS u ON u.id = d.user_id
            JOIN regions AS r ON r.id = u.region_id
            JOIN spravochnik_budjet_name AS b ON b.id = d.budjet_id
            WHERE r.id = $1 
                AND b.id = $2
                AND d.isdeleted = false 
                ${year_filter} ${month_filter} ${type_filter}
        `;
        const result = await db.query(query, params)
        return result;
    }

    static async getDocChildsSum(params) {
        const query = `--sql
            SELECT 
                COALESCE(SUM(debet_sum), 0)::FLOAT AS debet_sum, 
                COALESCE(SUM(kredit_sum), 0)::FLOAT AS kredit_sum 
            FROM main_book_doc_child
            WHERE parent_id = $1 AND isdeleted = false 
        `;
        const result = await db.query(query, params)
        return result[0]
    }

    static async getDocChilds(params) {
        const query = `--sql
            SELECT 
                id::INTEGER,
                spravochnik_operatsii_id,
                parent_id::INTEGER,
                debet_sum::FLOAT, 
                kredit_sum::FLOAT,
                created_at,
                updated_at
            FROM main_book_doc_child
            WHERE parent_id = $1
        `;
        const result = await db.query(query, params)
        return result;
    }

    static async getByIdDoc(params, isdeleted) {
        const query = `--sql
            SELECT 
                d.id::INTEGER,
                d.user_id,
                d.budjet_id,
                d.type_document,
                d.month,
                d.year,
                d.created_at,
                d.updated_at
            FROM main_book_doc_parent AS d
            JOIN users AS u ON u.id = d.user_id
            JOIN regions AS r ON r.id = u.region_id
            JOIN spravochnik_budjet_name AS b ON b.id = d.budjet_id
            WHERE r.id = $1 
                AND b.id = $2
                AND d.id = $3
                ${!isdeleted ? 'AND d.isdeleted = false' : ''}
        `;
        const result = await db.query(query, params);
        return result[0];
    }

    static async deleteDoc(params, client) {
        await client.query(`UPDATE documents_glavniy_kniga SET isdeleted = true WHERE id = $1`, params);
    }

    static async getTypeDocSumna(params){
        const query = `--sql
            SELECT 
                COALESCE(SUM(d.debet_sum)::FLOAT, 0) AS debet_sum,
                COALESCE(SUM(d.kredit_sum)::FLOAT, 0) AS kredit_sum
            FROM documents_glavniy_kniga AS d
            JOIN users AS u ON u.id = d.user_id
            JOIN regions AS r ON r.id = u.region_id
            JOIN main_schet AS m ON m.id = d.main_schet_id
            WHERE r.id = $1 
                AND d.isdeleted = false 
                AND m.spravochnik_budjet_name_id = $2
                AND d.type_document = $3
                AND d.month = $4
                AND d.year = $5
                AND d.spravochnik_operatsii_id = $6 
        `;
        const result = await db.query(query, params);
        return result[0];

    }

    static async deleteDocChilds(params, client){
        const query = `DELETE FROM main_book_doc_child WHERE parent_id = $1`;
        await client.query(query, params);
    }

    static async deleteDoc(params, client){
        await client.query(`UPDATE main_book_doc_parent SET isdeleted = true WHERE id = $1`, params)
        await client.query(`UPDATE main_book_doc_child SET isdeleted = true WHERE parent_id = $1`, params)
    }
}