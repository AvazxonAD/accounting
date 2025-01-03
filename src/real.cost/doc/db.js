const { db } = require('../../db/index')
const { returnParamsValues, } = require('../../helper/functions')

exports.RealCostDB = class {
    static async createDoc(params, client) {
        const query = `--sql
            INSERT INTO real_cost_doc_parent (
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
            UPDATE real_cost_doc_parent 
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
            INSERT INTO real_cost_doc_child (
                smeta_grafik_id,
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
            FROM real_cost_doc_parent AS d
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
            FROM real_cost_doc_child
            WHERE parent_id = $1 AND isdeleted = false 
        `;
        const result = await db.query(query, params)
        return result[0]
    }

    static async getDocChildSmetaSum(params) {
        const query = `--sql
            SELECT 
                ch.smeta_grafik_id,
                COALESCE(SUM(ch.debet_sum), 0)::FLOAT AS debet_sum, 
                COALESCE(SUM(ch.kredit_sum), 0)::FLOAT AS kredit_sum 
            FROM real_cost_doc_child ch
            JOIN real_cost_doc_parent p ON p.id = ch.parent_id
            JOIN users AS u ON u.id = p.user_id
            JOIN regions AS r ON r.id = u.region_id
            WHERE p.isdeleted = false 
                AND r.id = $1
                AND p.year = $2 
                AND p.month = $3
                AND p.budjet_id = $4
                AND p.type_document != $5
        `;
        const result = await db.query(query, params)
        return result;
    }

    static async getDocChilds(params) {
        const query = `--sql
            SELECT 
                id::INTEGER,
                smeta_grafik_id,
                parent_id::INTEGER,
                debet_sum::FLOAT, 
                kredit_sum::FLOAT,
                created_at,
                updated_at
            FROM real_cost_doc_child
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
            FROM real_cost_doc_parent AS d
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

    static async deleteDocChilds(params, client){
        const query = `DELETE FROM real_cost_doc_child WHERE parent_id = $1`;
        await client.query(query, params);
    }

    static async deleteDoc(params, client){
        await client.query(`UPDATE real_cost_doc_parent SET isdeleted = true WHERE id = $1`, params)
        await client.query(`UPDATE real_cost_doc_child SET isdeleted = true WHERE parent_id = $1`, params)
    }

    static async getOperatsiiSum(params, client) {
        const query = `--sql
            SELECT 
                ch.smeta_grafik_id,
                COALESCE(SUM(ch.debet_sum), 0)::FLOAT AS debet_sum, 
                COALESCE(SUM(ch.kredit_sum), 0)::FLOAT AS kredit_sum 
            FROM real_cost_doc_child AS ch
            JOIN real_cost_doc_parent AS d ON ch.parent_id = d.id
            JOIN users AS u ON u.id = d.user_id
            JOIN regions AS r ON r.id = u.region_id
            WHERE d.isdeleted = false
                AND r.id = $1
                AND d.year = $2 
                AND d.month = $3
                AND d.budjet_id = $4
            GROUP BY ch.smeta_grafik_id
        `;
        const result = await client.query(query, params);
        return result.rows;
    } 
}