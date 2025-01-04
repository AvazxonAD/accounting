const { db } = require('../db/index')
const { returnParamsValues, } = require('../helper/functions')

exports.OxDB = class {
    static async createDoc(params, client) {
        const query = `--sql
            INSERT INTO ox_parent (
                user_id,
                budjet_id,
                month,
                year,
                created_at,
                updated_at
            ) 
            VALUES($1, $2, $3, $4, $5, $6) RETURNING *
        `;
        const result = await client.query(query, params)
        return result.rows[0];
    }

    static async updateDoc(params, client) {
        const query = `--sql
            UPDATE ox_parent 
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

    static async createDocChild(params, client) {
        const _values = returnParamsValues(params, 9)
        const query = `--sql
            INSERT INTO ox_child (
                smeta_grafik_id,
                parent_id,
                allocated_amount,
                by_smeta,
                kassa_rasxod,
                real_rasxod,
                remaining,
                created_at,
                updated_at
            ) 
            VALUES ${_values} RETURNING *
        `;
        const result = await client.query(query, params)
        return result.rows;
    }

    static async getDoc(params, year, month) {
        let year_filter = ``;
        let month_filter = ``;
        if (year) {
            year_filter = `AND d.year = $${params.length + 1}`;
            params.push(year)
        }
        if (month) {
            month_filter = `AND d.month = $${params.length + 1}`;
            params.push(month)
        }
        const query = `--sql
            SELECT 
                d.id::INTEGER,
                d.user_id,
                d.budjet_id,
                d.month,
                d.year,
                d.created_at,
                d.updated_at,
                d.accepted_time,
                d.status, 
                u.id AS user_id,
                u.login AS user_login,
                u_a.id AS user_id_accepted,
                u_a.login AS user_login_accepted
            FROM ox_parent AS d
            JOIN users AS u ON u.id = d.user_id
            LEFT JOIN users AS u_a ON u_a.id = d.user_id_accepted
            JOIN regions AS r ON r.id = u.region_id
            JOIN spravochnik_budjet_name AS b ON b.id = d.budjet_id
            WHERE r.id = $1 
                AND b.id = $2
                AND d.isdeleted = false
                ${year_filter} 
                ${month_filter}
        `;
        const result = await db.query(query, params)
        return result;
    }

    static async getDocChildsSum(params) {
        const query = `--sql
            SELECT
                COALESCE(SUM(allocated_amount), 0)::FLOAT AS allocated_amount,
                COALESCE(SUM(by_smeta), 0)::FLOAT AS by_smeta,
                COALESCE(SUM(kassa_rasxod), 0)::FLOAT AS kassa_rasxod,
                COALESCE(SUM(real_rasxod), 0)::FLOAT AS real_rasxod,
                COALESCE(SUM(remaining), 0)::FLOAT AS remaining
            FROM ox_child
            WHERE parent_id = $1 AND isdeleted = false 
        `;
        const result = await db.query(query, params)
        return result[0]
    }

    static async getDocChilds(params) {
        const query = `--sql
            SELECT 
                id::INTEGER,
                smeta_grafik_id,
                parent_id::INTEGER,
                allocated_amount::FLOAT,
                by_smeta::FLOAT,
                kassa_rasxod::FLOAT,
                real_rasxod::FLOAT,
                remaining::FLOAT,
                created_at,
                updated_at
            FROM ox_child
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
                d.month,
                d.year,
                d.created_at,
                d.updated_at,
                d.accepted_time,
                d.status, 
                u.id AS user_id,
                u.login AS user_login,
                u_a.id AS user_id_accepted,
                u_a.login AS user_login_accepted
            FROM ox_parent AS d
            JOIN users AS u ON u.id = d.user_id
            LEFT JOIN users AS u_a ON u_a.id = d.user_id_accepted
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

    static async deleteDocChilds(params, client) {
        const query = `DELETE FROM ox_child WHERE parent_id = $1`;
        await client.query(query, params);
    }

    static async deleteDoc(params, client) {
        await client.query(`UPDATE ox_parent SET isdeleted = true WHERE id = $1`, params)
        await client.query(`UPDATE ox_child SET isdeleted = true WHERE parent_id = $1`, params)
    }

    static async sendDoc(params) {
        const query = `--sql
            UPDATE ox_parent 
                SET 
                    status = $1,
                    updated_at = $2
            WHERE id = $3
        `;
        await db.query(query, params);
    }
}