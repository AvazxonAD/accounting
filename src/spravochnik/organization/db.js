const { db } = require('../../db/index');

exports.OrganizationDB = class {
    static async getByInn(params) {
        const query = `
            SELECT 
                so.id, 
                so.name, 
                so.bank_klient, 
                so.raschet_schet, 
                so.raschet_schet_gazna, 
                so.mfo, 
                so.inn, 
                so.okonx,
                so.parent_id
            FROM spravochnik_organization AS so 
            JOIN users ON so.user_id = users.id
            JOIN regions ON users.region_id = regions.id
            WHERE regions.id = $1 
                AND so.inn = $2 
                AND so.isdeleted = false
            LIMIT 1
        `;
        const result = await db.query(query, params);
        return result[0]
    }

    static async getByName(params) {
        const query = `
            SELECT 
                so.id, 
                so.name, 
                so.bank_klient, 
                so.raschet_schet, 
                so.raschet_schet_gazna, 
                so.mfo, 
                so.inn, 
                so.okonx,
                so.parent_id
            FROM spravochnik_organization AS so 
            JOIN users ON so.user_id = users.id
            JOIN regions ON users.region_id = regions.id
            WHERE regions.id = $1 
                AND so.name = $2 
                AND so.isdeleted = false
            LIMIT 1
        `;
        const result = await db.query(query, params);
        return result[0]
    }

    static async getById(params, isdeleted) {
        const ignore = `AND so.isdeleted = false`
        let query = `--sql
            SELECT 
                so.id, 
                so.name, 
                so.bank_klient, 
                so.raschet_schet, 
                so.raschet_schet_gazna, 
                so.mfo, 
                so.inn, 
                so.okonx,
                so.parent_id,
                (
                    SELECT 
                        JSON_AGG(g)
                    FROM organization_by_raschet_schet_gazna g  
                    WHERE g.isdeleted = false
                        AND g.spravochnik_organization_id = so.id
                ) AS gazna,
                (
                    SELECT 
                        JSON_AGG(a)
                    FROM organization_by_raschet_schet a  
                    WHERE a.isdeleted = false
                        AND a.spravochnik_organization_id = so.id
                ) AS account_numbers
            FROM spravochnik_organization AS so 
            JOIN users ON so.user_id = users.id
            JOIN regions ON users.region_id = regions.id 
            WHERE regions.id = $1 
                AND so.id = $2 
                ${isdeleted ? '' : ignore}
        `;

        const result = await db.query(query, params)
        if (result[0]) {
            const child_query = `--sql
                SELECT 
                    so.id, 
                    so.name, 
                    so.bank_klient, 
                    so.raschet_schet, 
                    so.raschet_schet_gazna, 
                    so.mfo, 
                    so.inn, 
                    so.okonx,
                    so.parent_id,
                    (
                        SELECT 
                            JSON_AGG(g)
                        FROM organization_by_raschet_schet_gazna g  
                        WHERE g.isdeleted = false
                            AND g.spravochnik_organization_id = so.id
                    ) AS gazna,
                    (
                        SELECT 
                            JSON_AGG(a)
                        FROM organization_by_raschet_schet a  
                        WHERE a.isdeleted = false
                            AND a.spravochnik_organization_id = so.id
                    ) AS account_numbers
                FROM spravochnik_organization AS so 
                JOIN users ON so.user_id = users.id
                JOIN regions ON users.region_id = regions.id 
                WHERE regions.id = $1 AND so.parent_id = $2 AND so.isdeleted = false
            `;

            result[0].childs = await db.query(child_query, params);
        }
        return result[0];
    }

    static async get(params, search, organ_id) {
        let organ_filter = ``;
        let search_filter = ``
        if (search) {
            search_filter = `AND ( so.inn ILIKE '%' || $${params.length + 1} || '%' OR so.name ILIKE '%' || $${params.length + 1} || '%' )`;
            params.push(search);
        }
        if (organ_id) {
            params.push(organ_id);
            organ_filter = `AND so.id = $${params.length}`;
        }

        const query = `--sql
            WITH data AS (SELECT 
                  so.id, 
                  so.name, 
                  so.bank_klient, 
                  so.raschet_schet, 
                  so.raschet_schet_gazna, 
                  so.mfo, 
                  so.inn, 
                  so.okonx,
                  so.parent_id 
                FROM spravochnik_organization AS so  
                JOIN users AS u ON so.user_id = u.id
                JOIN regions AS r ON u.region_id = r.id 
                WHERE so.isdeleted = false 
                    AND r.id = $1 
                    ${search_filter}
                    ${organ_filter}
                OFFSET $2
                LIMIT $3
            )
            SELECT 
                ARRAY_AGG(row_to_json(data)) AS data,
                (
                        
                    SELECT COALESCE(COUNT(so.id), 0)
                    FROM spravochnik_organization AS so  
                    JOIN users AS u ON so.user_id = u.id
                    JOIN regions AS r ON u.region_id = r.id 
                    WHERE so.isdeleted = false 
                        AND r.id = $1 
                        ${search_filter}
                        ${organ_filter}
                )::INTEGER AS total_count
            FROM data
        `;

        const result = await db.query(query, params);

        return { data: result[0]?.data || [], total: result[0].total_count };
    }

    static async create(params, client) {
        const _db = client || db;

        const query = `--sql
           INSERT INTO spravochnik_organization(
                name, bank_klient, raschet_schet, raschet_schet_gazna, 
                mfo, inn, user_id, okonx, parent_id, created_at, updated_at 
            ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
            RETURNING id
        `;

        const result = await _db.query(query, params);

        const response = client ? result.rows[0] : result[0]
        
        return response
    }

    static async update(params) {
        const query = `--sql
            UPDATE spravochnik_organization 
            SET name = $1, bank_klient = $2, raschet_schet = $3, 
                raschet_schet_gazna = $4, mfo = $5, inn = $6, okonx = $7, parent_id = $8
            WHERE id = $9 AND isdeleted = false RETURNING id
        `;
        const result = await db.query(query, params);
        return result[0];
    }

    static async delete(params) {
        const query = `UPDATE spravochnik_organization SET isdeleted = true WHERE id = $1 RETURNING id`;
        const result = await db.query(query, params);

        return result[0];
    }
}