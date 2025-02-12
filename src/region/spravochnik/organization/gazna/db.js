const { db } = require('@db/index');

exports.GaznaDB = class {
    static async getByGazna(params) {
        const query = `
            SELECT 
                *
            FROM organization_by_raschet_schet_gazna g 
            WHERE g.raschet_schet_gazna = $1 
                AND g.isdeleted = false
                AND g.spravochnik_organization_id = $2
            LIMIT 1
        `;
        const result = await db.query(query, params);
        return result[0]
    }

    static async getById(params, organ_id, isdeleted) {
        let organ_filter = ``;

        if(organ_id){
            params.push(organ_id);
            organ_filter = `AND g.spravochnik_organization_id = $${params.length}`;
        }
        
        const query = `--sql
            SELECT 
                row_to_json(g) AS gazna,
                row_to_json(so) AS organization
            FROM organization_by_raschet_schet_gazna g  
            JOIN spravochnik_organization so ON so.id = g.spravochnik_organization_id
            WHERE g.id = $1
                ${organ_filter} 
                ${!isdeleted ? 'AND g.isdeleted = false' : ''}
        `;

        const result = await db.query(query, params)

        return result[0];
    }

    static async get(params, search, organ_id) {
        let organ_filter = ``;
        let search_filter = ``

        if (search) {
            params.push(search);
            search_filter = `AND ( 
                g.raschet_schet_gazna ILIKE '%' || $${params.length} OR 
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
                    row_to_json(g) AS gazna,
                    row_to_json(so) AS organization
                FROM organization_by_raschet_schet_gazna g  
                JOIN spravochnik_organization so ON so.id = g.spravochnik_organization_id  
                JOIN users AS u ON so.user_id = u.id
                JOIN regions AS r ON u.region_id = r.id 
                WHERE g.isdeleted = false
                    AND r.id = $1 
                    ${search_filter}
                    ${organ_filter}
                OFFSET $2 LIMIT $3
            )
            SELECT 
                ARRAY_AGG(row_to_json(data)) AS data,
                (
                        
                    SELECT 
                        COALESCE(COUNT(g.id), 0)
                    FROM organization_by_raschet_schet_gazna g  
                    JOIN spravochnik_organization so ON so.id = g.spravochnik_organization_id 
                    JOIN users AS u ON so.user_id = u.id
                    JOIN regions AS r ON u.region_id = r.id 
                    WHERE g.isdeleted = false
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
           INSERT INTO organization_by_raschet_schet_gazna(
                spravochnik_organization_id, 
                raschet_schet_gazna, 
                created_at, updated_at 
            ) VALUES($1, $2, $3, $4) 
            RETURNING id
        `;

        const result = await _db.query(query, params);

        const response = client ? result.rows[0] : result[0];

        return response;
    }

    static async update(params) {
        const query = `--sql
            UPDATE organization_by_raschet_schet_gazna 
            SET 
                spravochnik_organization_id = $1, 
                raschet_schet_gazna = $2, 
                updated_at = $3 
            WHERE id = $4 
                AND isdeleted = false 
            RETURNING id
        `;
        const result = await db.query(query, params);
        return result[0];
    }

    static async delete(params) {
        const query = `UPDATE organization_by_raschet_schet_gazna SET isdeleted = true WHERE id = $1 RETURNING id`;
        const result = await db.query(query, params);

        return result[0];
    }
}