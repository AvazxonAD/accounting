const { db } = require('../../../db/index');

exports.GroupDB = class {
    static async createGroup(params) {
        const query = `--sql
            INSERT INTO group_jur7 (
                smeta_id, 
                name, 
                schet, 
                iznos_foiz, 
                provodka_debet, 
                group_number, 
                provodka_kredit, 
                provodka_subschet,
                roman_numeral,
                pod_group,
                created_at, 
                updated_at
            ) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *
        `;
        const result = await db.query(query, params);
        return result;
    }

    static async getGroup(params, search = null) {
        let search_filter = ``;
        if (search) {
            search_filter = `AND (
                    g_j7.name ILIKE '%' || $${params.length + 1} || '%' OR 
                    g_j7.provodka_subschet ILIKE '%' || $${params.length + 1} || '%' OR 
                    g_j7.schet ILIKE '%' || $${params.length + 1} || '%' OR 
                    g_j7.provodka_debet ILIKE '%' || $${params.length + 1} || '%' OR 
                    g_j7.group_number ILIKE '%' || $${params.length + 1} || '%' OR 
                    g_j7.provodka_kredit ILIKE '%' || $${params.length + 1} || '%'
                )
            `;
            params.push(search);
        }
        const query = `--sql
            WITH data AS (
                SELECT 
                    g_j7.id, 
                    g_j7.smeta_id,
                    g_j7.name, 
                    g_j7.schet, 
                    g_j7.iznos_foiz, 
                    g_j7.provodka_debet, 
                    g_j7.group_number, 
                    g_j7.provodka_kredit,
                    g_j7.provodka_subschet,
                    g_j7.roman_numeral,
                    g_j7.pod_group,
                    s.smeta_name,
                    s.smeta_number
                FROM group_jur7 AS g_j7
                LEFT JOIN smeta AS s ON s.id = g_j7.smeta_id
                WHERE g_j7.isdeleted = false ${search_filter}
                OFFSET $1 LIMIT $2
            )
            SELECT 
                ARRAY_AGG(row_to_json(data)) AS data,
                (
                    SELECT COALESCE(COUNT(g_j7.id), 0)::INTEGER 
                    FROM group_jur7 AS g_j7
                    WHERE g_j7.isdeleted = false ${search_filter}
                ) AS total
            FROM data
        `;

        const result = await db.query(query, params);
        return result[0];
    }

    static async getByIdGroup(params, isdeleted) {
        const ignore = 'AND g_j7.isdeleted = false';
        const query = `--sql
            SELECT 
                g_j7.id, 
                g_j7.smeta_id,
                g_j7.name, 
                g_j7.schet, 
                g_j7.iznos_foiz, 
                g_j7.provodka_debet, 
                g_j7.group_number, 
                g_j7.provodka_kredit,
                g_j7.provodka_subschet,
                g_j7.roman_numeral,
                g_j7.pod_group,
                s.smeta_name,
                s.smeta_number
            FROM group_jur7 AS g_j7
            LEFT JOIN smeta AS s ON s.id = g_j7.smeta_id
            WHERE g_j7.id = $1 ${isdeleted ? `` : ignore}
        `;
        const result = await db.query(query, params);
        return result[0];
    }

    static async getByNameGroup(params, isdeleted) {
        const ignore = 'AND g_j7.isdeleted = false';
        const query = `--sql
            SELECT 
                g_j7.id, 
                g_j7.smeta_id,
                g_j7.name, 
                g_j7.schet, 
                g_j7.iznos_foiz, 
                g_j7.provodka_debet, 
                g_j7.group_number, 
                g_j7.provodka_kredit,
                g_j7.provodka_subschet,
                g_j7.roman_numeral,
                g_j7.pod_group,
                s.smeta_name,
                s.smeta_number
            FROM group_jur7 AS g_j7
            LEFT JOIN smeta AS s ON s.id = g_j7.smeta_id
            WHERE g_j7.name ILIKE '%' || $1 || '%' ${isdeleted ? `` : ignore}
        `;
        const result = await db.query(query, params);
        return result[0];
    }

    static async updateGroup(params) {
        const query = `--sql
            UPDATE group_jur7
            SET 
                smeta_id = $1,
                name = $2,
                schet = $3,
                iznos_foiz = $4,
                provodka_debet = $5,
                group_number = $6,
                provodka_kredit = $7,
                provodka_subschet = $8,
                roman_numeral = $9,
                pod_group = $10,
                updated_at = $11
            WHERE id = $12 AND isdeleted = false RETURNING *
        `;
        const result = await db.query(query, params);
        return result[0];
    }

    static async deleteGroup(params) {
        const query = `UPDATE group_jur7 SET isdeleted = true WHERE id = $1 AND isdeleted = false`;
        await db.query(query, params);
    }

    static async getGroupWithPercent() {
        const query = `--sql
            SELECT
                g_j7.id, 
                g_j7.smeta_id,
                g_j7.name, 
                g_j7.schet, 
                g_j7.iznos_foiz, 
                g_j7.provodka_debet, 
                g_j7.group_number, 
                g_j7.provodka_kredit,
                g_j7.provodka_subschet,
                g_j7.roman_numeral,
                g_j7.pod_group,
                s.smeta_name,
                s.smeta_number
            FROM group_jur7 AS g_j7
            LEFT JOIN smeta AS s ON s.id = g_j7.smeta_id
            WHERE g_j7.isdeleted = false
        `;
        const data = await db.query(query)
        return data;
    }
};
