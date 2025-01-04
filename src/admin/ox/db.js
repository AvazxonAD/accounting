const { db } = require('../../db/index')

exports.OxDB = class {
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
                d.month,
                d.year,
                d.user_id_accepted,
                d.accepted_time,
                d.status, 
                u.id AS user_id,
                u.login AS user_login,
                u_a.id AS user_id_accepted,
                u_a.login AS user_login_accepted,
                r.id AS region_id, 
                r.name AS region_name,
                d.status
            FROM ox_parent AS d
            JOIN users AS u ON u.id = d.user_id
            LEFT JOIN users AS u_a ON u_a.id = d.user_id_accepted
            JOIN regions AS r ON r.id = u.region_id
            JOIN spravochnik_budjet_name AS b ON b.id = d.budjet_id
            WHERE d.isdeleted = false AND d.status > 0
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

    static async getByIdDoc(params) {
        const query = `--sql
            SELECT 
                d.id::INTEGER,
                d.month,
                d.year,
                d.user_id_accepted,
                d.accepted_time,
                d.status, 
                u.id AS user_id,
                u.login AS user_login,
                u_a.id AS user_id_accepted,
                u_a.login AS user_login_accepted,
                r.id AS region_id, 
                r.name AS region_name,
                d.status
            FROM ox_parent AS d
            JOIN users AS u ON u.id = d.user_id
            LEFT JOIN users AS u_a ON u_a.id = d.user_id_accepted
            JOIN regions AS r ON r.id = u.region_id
            JOIN spravochnik_budjet_name AS b ON b.id = d.budjet_id
            WHERE d.isdeleted = false AND d.status > 0 AND d.id = $1
        `;
        const result = await db.query(query, params);
        return result[0];
    }

    static async confirmDoc(params) {
        const query = `--sql
            UPDATE ox_parent 
                SET 
                    status = $1,
                    user_id_accepted = $2,
                    accepted_time = $3
            WHERE id = $4
        `;
        await db.query(query, params);
    }
}