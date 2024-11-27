const { db } = require('../../db/index')

exports.BankMfoDB = class {
    static async createBankMfo(params) {
        const query = `--sql
            INSERT INTO spravochnik_bank_mfo (
                mfo, 
                bank_name, 
                created_at, 
                updated_at
            ) 
            VALUES ($1, $2, $3, $4) 
            RETURNING *
        `
        const result = await db.query(query, params)
        return result;
    }

    static async getBankMfo(params, search = null) {
        let search_filter = ``;
        if (search) {
            search_filter = `AND s_b_m.mfo ILIKE '%' || $${params.length + 1} || '%' OR s_b_m.bank_name ILIKE '%' || $${params.length + 1} || '%'`;
            params.push(search);
        }
        const query = `--sql
            WITH data AS (
                SELECT 
                    s_b_m.id, 
                    s_b_m.mfo, 
                    s_b_m.bank_name
                FROM spravochnik_bank_mfo AS s_b_m
                WHERE s_b_m.isdeleted = false ${search_filter}
                OFFSET $1 LIMIT $2
            )
            SELECT 
                ARRAY_AGG(row_to_json(data)) AS data,
                (
                    SELECT COALESCE(COUNT(s_b_m.id), 0)::INTEGER 
                    FROM spravochnik_bank_mfo AS s_b_m
                    WHERE s_b_m.isdeleted = false ${search_filter}
                ) AS total
            FROM data
        `
        const result = await db.query(query, params)
        return result[0];
    }

    static async getByIdBankMfo(params, isdeleted) {
        let ignore = 'AND s_b_m.isdeleted = false';
        const query = `--sql
            SELECT 
                s_b_m.id, 
                s_b_m.mfo, 
                s_b_m.bank_name
            FROM spravochnik_bank_mfo AS s_b_m
            WHERE s_b_m.id = $1 ${isdeleted ? `` : ignore}
        `
        const result = await db.query(query, params)
        return result[0]
    }

    static async getByNameBankMfo(params) {
        const query = `--sql
            SELECT s_b_m.*
            FROM spravochnik_bank_mfo AS s_b_m
            WHERE s_b_m.mfo = $1 AND s_b_m.bank_name = $2 AND s_b_m.isdeleted = false
        `
        const result = await db.query(query, params)
        return result[0]
    }

    static async updateBankMfo(params) {
        const query = `--sql
            UPDATE spravochnik_bank_mfo SET mfo = $1, bank_name = $2, updated_at = $3
            WHERE id = $4 AND isdeleted = false 
            RETURNING *
        `
        const result = await db.query(query, params)
        return result[0]
    }

    static async deleteBankMfo(params) {
        const query = `UPDATE spravochnik_bank_mfo SET isdeleted = true WHERE id = $1 AND isdeleted = false`
        await db.query(query, params)
    }
}