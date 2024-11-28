const { db } = require('../../db/index')

exports.SmetaDB = class {
    static async createSmeta(params) {
        const query = `INSERT INTO smeta(smeta_name, smeta_number, father_smeta_name, group_number) VALUES($1, $2, $3, $4) RETURNING *`
        const result = await db.query(query, params);
        return result[0]
    }

    static async getSmeta(params, search, group_number) {
        let search_filter = ``;
        let group_number_filter = ``;
        if (search && !Number.isInteger(Number(search))) {
            search_filter = `AND smeta_name ILIKE '%' || $${params.length + 1} || '%'`
            params.push(search)
        }
        if (Number.isInteger(Number(search))) {
            search_filter = `AND smeta_number = $${params.length + 1}`
            search = Number(search)
            params.push(search)
        }
        if(group_number){
            group_number_filter = `AND group_number = $${params.length + 1}`
            params.push(group_number)
        }
        const query = `--sql
            WITH data AS (
            SELECT id, smeta_name, smeta_number, father_smeta_name, group_number FROM smeta  
            WHERE isdeleted = false ${search_filter} ${group_number_filter} OFFSET $1 LIMIT $2
            )
            SELECT 
            ARRAY_AGG(row_to_json(data)) AS data,
            (SELECT COUNT(id) FROM smeta WHERE isdeleted = false ${search_filter} ${group_number_filter})::INTEGER AS total_count
            FROM data
        `;
        const result = await db.query(query, params);
        return { data: result[0]?.data || [], total: result[0]?.total_count || 0 }
    }

    static async getByIdSmeta(params, isdeleted) {
        let ignore = `AND isdeleted = false`
        const query = `--sql
            SELECT 
                id, 
                smeta_name, 
                smeta_number, 
                father_smeta_name,
                group_number 
            FROM smeta  
            WHERE id = $1 ${isdeleted ? '' : ignore}
        `
        const result = await db.query(query, params);
        return result[0];
    }

    static async getByNameSmeta(params) {
        const query = `SELECT * FROM smeta WHERE smeta_name = $1 AND smeta_number = $2 AND isdeleted = false AND father_smeta_name = $3 AND group_number = $4`
        const result = await db.query(query, params);
        return result[0]
    }

    static async updateSmeta(params) {
        const query = `UPDATE  smeta SET smeta_name = $1, smeta_number = $2, father_smeta_name = $3, group_number = $4 WHERE  id = $5 RETURNING *`
        const result = await db.query(query, params);
        return result[0]
    }

    static async deleteSmeta(params) {
        const tables = await db.query(`SELECT conrelid::regclass AS name FROM  pg_constraint WHERE confrelid = 'smeta'::regclass`)
        for (let table of tables) {
            const test = await db.query(`SELECT * FROM ${table.name} WHERE smeta_id = $1 AND isdeleted = false`, params)
            if (test.length > 0) {
                throw new ErrorResponse('Cannot delete this data as it is linked to existing documents', 400)
            }
        }
        await db.query(`UPDATE smeta SET isdeleted = true WHERE id = $1`, params);
    }
}