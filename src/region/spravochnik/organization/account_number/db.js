const { db } = require('@db/index');

exports.AccountNumberDB = class {
    static async getByAccountNumber(params) {
        const query = `
            SELECT 
                *
            FROM organization_by_raschet_schet a 
            WHERE a.raschet_schet = $1 
                AND a.isdeleted = false
                AND a.spravochnik_organization_id = $2
            LIMIT 1
        `;
        const data = await db.query(query, params);
        return data[0]
    }

    static async getById(params, organ_id, isdeleted) {
        let organ_filter = ``;

        if (organ_id) {
            params.push(organ_id);
            organ_filter = `AND a.spravochnik_organization_id = $${params.length}`;
        }

        const query = `--sql
            SELECT 
                row_to_json(a) AS account_number,
                row_to_json(so) AS organization
            FROM organization_by_raschet_schet a  
            JOIN spravochnik_organization so ON so.id = a.spravochnik_organization_id
            WHERE a.id = $1
                ${organ_filter} 
                ${!isdeleted ? 'AND a.isdeleted = false' : ''}
        `;

        const data = await db.query(query, params)

        return data[0];
    }

    static async get(params, search, organ_id) {
        let organ_filter = ``;
        let search_filter = ``

        if (search) {
            params.push(search);
            search_filter = `AND ( 
                a.raschet_schet ILIKE '%' || $${params.length} OR 
                so.inn ILIKE '%' || $${params.length} || '%' OR 
                so.name ILIKE '%' || $${params.length} || '%'
            )`;
        }

        if (organ_id) {
            params.push(organ_id);
            organ_filter = `AND so.id = $${params.length}`;
        }

        const query = `--sql
            WITH data AS (
                SELECT 
                    row_to_json(a) AS account_number,
                    row_to_json(so) AS organization
                FROM organization_by_raschet_schet a  
                JOIN spravochnik_organization so ON so.id = a.spravochnik_organization_id  
                JOIN users AS u ON so.user_id = u.id
                JOIN regions AS r ON u.region_id = r.id 
                WHERE a.isdeleted = false
                    AND r.id = $1 
                    ${search_filter}
                    ${organ_filter}
                OFFSET $2 LIMIT $3
            )
            SELECT 
                COALESCE( JSON_AGG( row_to_json( data ) ), '[]'::JSON ) AS data,
                (
                        
                    SELECT 
                        COALESCE(COUNT(a.id), 0)
                    FROM organization_by_raschet_schet a  
                    JOIN spravochnik_organization so ON so.id = a.spravochnik_organization_id 
                    JOIN users AS u ON so.user_id = u.id
                    JOIN regions AS r ON u.region_id = r.id 
                    WHERE a.isdeleted = false
                        AND r.id = $1 
                        ${search_filter}
                        ${organ_filter}
                )::INTEGER AS total_count
            FROM data
        `;

        const data = await db.query(query, params);

        return { data: data[0]?.data || [], total: data[0].total_count };
    }

    static async create(params, client) {
        const _db = client || db;

        const query = `--sql
           INSERT INTO organization_by_raschet_schet(
                spravochnik_organization_id, 
                raschet_schet, 
                created_at, updated_at 
            ) VALUES($1, $2, $3, $4) 
            RETURNING id
        `;

        const data = await _db.query(query, params);

        const response = client ? data.rows[0] : data[0];

        return response;
    }

    static async update(params, client) {
        const _db = client || db;

        const query = `--sql
            UPDATE organization_by_raschet_schet 
            SET 
                spravochnik_organization_id = $1, 
                raschet_schet = $2, 
                updated_at = $3 
            WHERE id = $4 
                AND isdeleted = false 
            RETURNING id
        `;

        const data = await _db.query(query, params);

        return data[0] || data.rows[0];
    }

    static async delete(params, client) {
        const _db = client || db;

        const query = `UPDATE organization_by_raschet_schet SET isdeleted = true WHERE id = $1 RETURNING id`;

        const data = await _db.query(query, params);

        return data[0] || data.rows[0];
    }
}