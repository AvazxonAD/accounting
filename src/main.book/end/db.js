const { db } = require('../../db/index')
const { returnParamsValues, } = require('../../helper/functions')

exports.EndMainBookDB = class {
    static async createEnd(params, client) {
        const query = `--sql
            INSERT INTO main_book_end_parent (
                user_id,
                user_id_accepted,
                budjet_id,
                accepted_time,
                month,
                year,
                status,
                created_at,
                updated_at
            ) 
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *
        `;
        const result = await client.query(query, params)
        return result.rows[0];
    }

    static async updateEnd(params, client) {
        const query = `--sql
            UPDATE main_book_end_parent 
                SET 
                    month = $1,
                    year = $2,
                    updated_at = $3
            WHERE id = $4
            RETURNING *
        `;
        const result = await client.query(query, params)
        return result.rows[0];
    }

    static async createEndChild(params, client) {
        const _values = returnParamsValues(params, 7)
        const query = `--sql
            INSERT INTO main_book_end_child (
                spravochnik_main_book_schet_id,
                parent_id,
                type_document,
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

    static async getEnd(params, year, month) {
        let year_filter = ``;
        let month_filter = ``;
        if(year){
            year_filter = `AND d.year = $${params.length + 1}`;
            params.push(year)
        }
        if(month){
            month_filter = `AND d.month = $${params.length + 1}`;
            params.push(month)
        }
        const query = `--sql
            SELECT 
                d.id::INTEGER,
                d.month,
                d.year,
                b.id AS budjet_id,
                b.name,
                u.id AS user_id,
                u.login AS user_login,
                ua.id AS accepted_id,
                ua.login AS accepted_login,
                d.status,
                d.created_at,
                d.accepted_time
            FROM main_book_end_parent AS d
            JOIN users AS u ON u.id = d.user_id
            LEFT JOIN  users AS ua ON ua.id = d.user_id_accepted
            JOIN regions AS r ON r.id = u.region_id
            JOIN spravochnik_budjet_name AS b ON b.id = d.budjet_id
            WHERE r.id = $1 
                AND b.id = $2
                AND d.isdeleted = false 
                ${year_filter} ${month_filter}
        `;
        const result = await db.query(query, params)
        return result;
    }

    static async getEndChildsSum(params) {
        const query = `--sql
            SELECT 
                COALESCE(SUM(debet_sum), 0)::FLOAT AS debet_sum, 
                COALESCE(SUM(kredit_sum), 0)::FLOAT AS kredit_sum 
            FROM main_book_end_child
            WHERE parent_id = $1 AND isdeleted = false 
        `;
        const result = await db.query(query, params)
        return result[0]
    }

    static async getEndChilds(params) {
        const query = `--sql
            SELECT 
                COALESCE(SUM(ch.debet_sum), 0)::FLOAT AS debet_sum, 
                COALESCE(SUM(ch.kredit_sum), 0)::FLOAT AS kredit_sum
            FROM main_book_end_child AS ch
            WHERE parent_id = $1 
                AND ch.type_document = $2 
                AND ch.spravochnik_main_book_schet_id = $3 
                AND ch.isdeleted = false
        `;
        const result = await db.query(query, params)
        return result[0];
    }

    static async getByIdEnd(params, isdeleted) {
        const query = `--sql
            SELECT 
                d.id::INTEGER,
                d.user_id,
                d.user_id_accepted,
                d.budjet_id,
                d.accepted_time,
                d.month,
                d.year,
                d.status
            FROM main_book_end_parent AS d
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

    static async getTypeEndSumna(params){
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
                AND d.spravochnik_main_book_schet_id = $6 
        `;
        const result = await db.query(query, params);
        return result[0];

    }

    static async deleteEndChilds(params, client){
        const query = `DELETE FROM main_book_end_child WHERE parent_id = $1`;
        await client.query(query, params);
    }

    static async deleteEnd(params, client){
        await client.query(`UPDATE main_book_end_parent SET isdeleted = true WHERE id = $1`, params)
        await client.query(`UPDATE main_book_end_child SET isdeleted = true WHERE parent_id = $1`, params)
    }

    static async getInfo(params){
        const query = `--sql
            SELECT      
                JSON_BUILD_OBJECT(
                    'debet_sum', COALESCE(SUM(mbdch.debet_sum), 0)::FLOAT,
                    'kredit_sum', COALESCE(SUM(mbdch.kredit_sum), 0)::FLOAT
                ) AS summa
            FROM main_book_doc_child mbdch 
            LEFT JOIN main_book_doc_parent mbdp ON mbdp.id = mbdch.parent_id
            WHERE mbdp.year = $1 
                AND mbdp.month = $2
                AND mbdp.type_document = $3 
                AND mbdp.budjet_id = $4
                AND mbdp.isdeleted = false
                AND mbdch.spravochnik_main_book_schet_id = $5
        `;
        
        const result = await db.query(query, params);
        return result;
    }
}