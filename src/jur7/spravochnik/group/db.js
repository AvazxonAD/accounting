const { db } = require('../../../db/index');

exports.GroupDB = class {
    static async create(params) {
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
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id
        `;
        const result = await db.query(query, params);
        return result;
    }

    static async get(params, search = null) {
        let search_filter = ``;
        if (search) {
            search_filter = `AND (
                    g.name ILIKE '%' || $${params.length + 1} || '%' OR 
                    g.provodka_subschet ILIKE '%' || $${params.length + 1} || '%' OR 
                    g.schet ILIKE '%' || $${params.length + 1} || '%' OR 
                    g.provodka_debet ILIKE '%' || $${params.length + 1} || '%' OR 
                    g.group_number ILIKE '%' || $${params.length + 1} || '%' OR 
                    g.provodka_kredit ILIKE '%' || $${params.length + 1} || '%'
                )
            `;
            params.push(search);
        }
        const query = `--sql
            WITH data AS (
                SELECT 
                    g.id, 
                    g.smeta_id,
                    g.name, 
                    g.schet, 
                    g.iznos_foiz, 
                    g.provodka_debet, 
                    g.group_number, 
                    g.provodka_kredit,
                    g.provodka_subschet,
                    g.roman_numeral,
                    g.pod_group,
                    s.smeta_name,
                    s.smeta_number
                FROM group_jur7 AS g
                LEFT JOIN smeta AS s ON s.id = g.smeta_id
                WHERE g.isdeleted = false ${search_filter}
                OFFSET $1 LIMIT $2
            )
            SELECT 
                ARRAY_AGG(row_to_json(data)) AS data,
                (
                    SELECT COALESCE(COUNT(g.id), 0)::INTEGER 
                    FROM group_jur7 AS g
                    WHERE g.isdeleted = false ${search_filter}
                ) AS total
            FROM data
        `;

        const result = await db.query(query, params);
        return result[0];
    }

    static async getById(params, isdeleted) {
        const ignore = 'AND g.isdeleted = false';
        const query = `--sql
            SELECT 
                g.id, 
                g.smeta_id,
                g.name, 
                g.schet, 
                g.iznos_foiz, 
                g.provodka_debet, 
                g.group_number, 
                g.provodka_kredit,
                g.provodka_subschet,
                g.roman_numeral,
                g.pod_group,
                s.smeta_name,
                s.smeta_number
            FROM group_jur7 AS g
            LEFT JOIN smeta AS s ON s.id = g.smeta_id
            WHERE g.id = $1 ${isdeleted ? `` : ignore}
        `;
        const result = await db.query(query, params);
        return result[0];
    }

    static async getByName(params) {
        const query = `--sql
            SELECT 
                g.id, 
                g.smeta_id,
                g.name, 
                g.schet, 
                g.iznos_foiz, 
                g.provodka_debet, 
                g.group_number, 
                g.provodka_kredit,
                g.provodka_subschet,
                g.roman_numeral,
                g.pod_group,
                s.smeta_name,
                s.smeta_number
            FROM group_jur7 AS g
            LEFT JOIN smeta AS s ON s.id = g.smeta_id
            WHERE g.name ILIKE '%' || $1 || '%' AND g.isdeleted = false
        `;
        const result = await db.query(query, params);
        return result[0];
    }

    static async getByNumberName(params) {
        const query = `--sql
            SELECT 
                g.id, 
                g.smeta_id,
                g.name, 
                g.schet, 
                g.iznos_foiz, 
                g.provodka_debet, 
                g.group_number, 
                g.provodka_kredit,
                g.provodka_subschet,
                g.roman_numeral,
                g.pod_group,
                s.smeta_name,
                s.smeta_number
            FROM group_jur7 AS g
            LEFT JOIN smeta AS s ON s.id = g.smeta_id
            WHERE g.group_number = $1 
                AND g.name ILIKE '%' || $2 || '%' 
                AND g.isdeleted = false
        `;
        const result = await db.query(query, params);
        return result[0];
    }

    static async update(params) {
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
            WHERE id = $12 AND isdeleted = false RETURNING id
        `;
        const result = await db.query(query, params);
        return result[0];
    }

    static async delete(params) {
        const query = `UPDATE group_jur7 SET isdeleted = true WHERE id = $1 AND isdeleted = false RETURNING id`;

        const data = await db.query(query, params);

        return data[0];
    }

    static async getWithPercent() {
        const query = `--sql
            SELECT
                g.id, 
                g.smeta_id,
                g.name, 
                g.schet, 
                g.iznos_foiz, 
                g.provodka_debet, 
                g.group_number, 
                g.provodka_kredit,
                g.provodka_subschet,
                g.roman_numeral,
                g.pod_group,
                s.smeta_name,
                s.smeta_number,
                COALESCE(p.pereotsenka_foiz, 0)
            FROM group_jur7 AS g
            LEFT JOIN smeta AS s ON s.id = g.smeta_id
            LEFT JOIN pereotsenka_jur7 p ON p.group_jur7_id = g.id
            WHERE g.isdeleted = false
        `;
        const data = await db.query(query)
        return data;
    }
};
