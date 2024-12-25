const { db } = require('../../db/index')
const { returnParamsValues, } = require('../../helper/functions')

exports.EndMainBookDB = class {

    static async updateEnd(params) {
        const query = `--sql
            UPDATE main_book_end_parent 
                SET     
                    status = $1,
                    user_id_accepted = $2,
                    accepted_time = $3
            WHERE id = $4
            RETURNING id
        `;
        const result = await db.query(query, params)
        return result[0];
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
                r.id AS region_id,
                r.name AS region_name
            FROM main_book_end_parent AS d
            JOIN users AS u ON u.id = d.user_id
            LEFT JOIN  users AS ua ON ua.id = d.user_id_accepted
            JOIN regions AS r ON r.id = u.region_id
            JOIN spravochnik_budjet_name AS b ON b.id = d.budjet_id
            WHERE d.isdeleted = false  ${year_filter} ${month_filter}
        `;
        const result = await db.query(query, params)
        return result;
    }

    static async getEndChilds(params) {
        const query = `--sql
            SELECT 
                ch.spravochnik_operatsii_id,
                so.name AS schet_name,
                so.schet AS schet,
                COALESCE(SUM(debet_sum), 0)::FLOAT AS debet_sum, 
                COALESCE(SUM(kredit_sum), 0)::FLOAT AS kredit_sum
            FROM main_book_end_child AS ch
            JOIN spravochnik_operatsii so ON so.id = ch.spravochnik_operatsii_id
            WHERE parent_id = $1 AND ch.type_document = $2
            GROUP BY ch.spravochnik_operatsii_id, so.name, so.schet
            ORDER BY ch.spravochnik_operatsii_id
        `;
        const result = await db.query(query, params)
        return result;
    }

    static async getByIdEnd(params) {
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
                AND d.id = $2
        `;
        const result = await db.query(query, params);
        return result[0];
    }
}