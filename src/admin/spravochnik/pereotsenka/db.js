const { db } = require('@db/index')
const { designParams } = require('@helper/functions')

exports.PereotsenkaDB = class {
    static async createPereotsenka(params) {
        const values = params.map((_, index) => {
            return `
                ($${5 * index + 1}, 
                $${5 * index + 2}, 
                $${5 * index + 3}, 
                $${5 * index + 4}, 
                $${5 * index + 5})
            `
        })
        const _values = values.join(", ")
        const designKeys = ["name", "group_jur7_id", "pereotsenka_foiz", "created_at", "updated_at"]
        const allValues = designParams(params, designKeys)
        const query = `--sql
            INSERT INTO 
            pereotsenka_jur7 (name, group_jur7_id, pereotsenka_foiz, created_at, updated_at) 
            VALUES ${_values} RETURNING *
        `;
        const result = await db.query(query, allValues);
        return result;
    }

    static async getBYNamePereotsenka(params) {
        const query = `SELECT * FROM pereotsenka_jur7 WHERE name = $1 AND isdeleted = false`;
        const result = await db.query(query, params);
        return result[0];
    }

    static async getPereotsenka(params, search) {
        let search_filter = ``;
        let offset_limit = ``;
        if (params[0] && params[1]) {
            offset_limit = 'OFFSET $1 LIMIT $2'
        } else {
            params.splice(0, 2);
        }
        if (search) {
            search_filter = `AND p.name ILIKE '%' || $${params.length + 1} || '%'`;
            params.push(search);
        }
        const query = `--sql
            WITH data AS (
                SELECT p.id, p.name, p.group_jur7_id, p.pereotsenka_foiz, p.created_at, p.updated_at, g.name AS group_name
                FROM pereotsenka_jur7 AS p 
                LEFT JOIN group_jur7 AS g ON g.id = p.group_jur7_id
                WHERE p.isdeleted = false ${search_filter}
            )
            SELECT 
                ARRAY_AGG(row_to_json(data)) AS data,
                (SELECT COALESCE(COUNT(id), 0)::INTEGER FROM pereotsenka_jur7 AS p WHERE p.isdeleted = false ${search_filter}) AS total
            FROM data
        `;
        const result = await db.query(query, params);
        return result[0];
    }

    static async getByIdPereotsenka(params, isdeleted = null) {
        const ignore = `AND p.isdeleted = false`;
        const query = `--sql
            SELECT 
                p.id, p.name, p.group_jur7_id, p.pereotsenka_foiz, p.created_at, p.updated_at, g.name AS group_name
            FROM pereotsenka_jur7 AS p 
            LEFT JOIN group_jur7 AS g ON g.id = p.group_jur7_id 
            WHERE p.id = $1 ${isdeleted ? '' : ignore}
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

    static async getByGroupId(params) {
        const query = `
            SELECT pereotsenka_foiz::FLOAT
            FROM pereotsenka_jur7 
            WHERE isdeleted = false AND group_jur7_id = $1
            ORDER BY created_at DESC
        `;
        const data = await db.query(query, params)
        return data[0];
    }
};
