const { db } = require('../../db/index')

exports.PereotsenkaDB = class {
    static async createPereotsenka(params) {
        const query = `--sql
            INSERT INTO 
            pereotsenka_jur7 (name, group_jur7_id, pereotsenka_foiz, created_at, updated_at) 
            VALUES ($1, $2, $3, $4, $5) RETURNING *
        `;
        const result = await db.query(query, params);
        return result[0];
    }

    static async getBYNamePereotsenka(params) {
        const query = `SELECT * FROM pereotsenka_jur7 WHERE name = $1 AND isdeleted = false`;
        const result = await db.query(query, params);
        return result[0];
    }

    static async getPereotsenka(params, search) {
        let search_filter = ``;
        if (search) {
            search_filter = `AND name ILIKE '%' || $${params.length + 1} || '%'`;
            params.push(search);
        }
        const query = `--sql
            WITH data AS (
                SELECT id, name, group_jur7_id, pereotsenka_foiz, created_at, updated_at
                FROM pereotsenka_jur7 WHERE isdeleted = false ${search_filter}
                OFFSET $1 LIMIT $2
            )
            SELECT 
                ARRAY_AGG(row_to_json(data)) AS data,
                (SELECT COALESCE(COUNT(id), 0)::INTEGER FROM pereotsenka_jur7 WHERE isdeleted = false ${search_filter}) AS total
            FROM data
        `;
        const result = await db.query(query, params);
        return result[0];
    }

    static async getByIdPereotsenka(params, isdeleted = null) {
        const ignore = `AND isdeleted = false`;
        const query = `--sql
            SELECT 
                id, name, group_jur7_id, pereotsenka_foiz, created_at, updated_at
            FROM pereotsenka_jur7 WHERE id = $1 ${isdeleted ? '' : ignore}
        `;
        const result = await db.query(query, params);
        return result[0];
    }

    static async updatePereotsenka(params) {
        const query = `--sql
            UPDATE pereotsenka_jur7
            SET name = $1, group_jur7_id = $2, pereotsenka_foiz = $3, updated_at = $4
            WHERE id = $5 AND isdeleted = false RETURNING *
        `;
        const result = await db.query(query, params);
        return result[0];
    }

    static async deletePereotsenka(params) {
        const query = `UPDATE pereotsenka_jur7 SET isdeleted = true WHERE id = $1 AND isdeleted = false`;
        await db.query(query, params);
    }
};
