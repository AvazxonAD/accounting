const { db } = require('@db/index');

exports.OperatsiiDB = class {
    static async getById(params, type, budjet_id, isdeleted) {
        let type_filter = ``;
        let budjet_filter = ``;

        if (type) {
            type_filter = `AND type_schet = $${params.length + 1}`;
            params.push(type)
        }

        if (budjet_id) {
            params.push(budjet_id);
            budjet_filter = `AND budjet_id = $${params.length}`;
        }

        const query = `--sql
            SELECT id, name, schet, sub_schet, type_schet, smeta_id, budjet_id 
            FROM spravochnik_operatsii 
            WHERE id = $1
                AND budjet_id IS NOT NULL
                ${type_filter}
                ${budjet_filter} 
                ${!isdeleted ? 'AND isdeleted = false' : ''}
        `;
        const result = await db.query(query, params);
        return result[0];
    }

    static async getOperatsiiByChildArray(params, type) {
        const ids = params.map((item) => item.spravochnik_operatsii_id);
        const placeHolders = ids.map((_, i) => `$${i + 2}`).join(', ');
        const values = [type, ...ids];
        const result = await db.query(`SELECT schet
            FROM spravochnik_operatsii 
            WHERE type_schet = $1 AND isdeleted = false AND id IN (${placeHolders})
        `, values);
        return result;
    }

    static async getByTypeOperatsii(params, schet = null, isdeleted = null) {
        let schet_filter = ``;
        if (schet) {
            schet_filter = `AND schet = $${params.length + 1}`
            params.push(schet);
        }
        const query = `SELECT schet FROM spravochnik_operatsii WHERE type_schet = $1 ${!isdeleted ? "AND isdeleted = false" : ""} ${schet_filter}`
        const result = await db.query(query, params);
        return result;
    }

    static async get(params, offset, limit, search, type_schet) {
        let type_schet_filter = '';
        let search_filter = ``;
        let offset_limit = ``;
        if (search) {
            search_filter = `AND (
                schet = $${params.length + 1} OR 
                name ILIKE '%' || $${params.length + 1} || '%' OR
                sub_schet ILIKE '%' || $${params.length + 1} || '%'
                )
            `;
            params.push(search)
        }
        if (type_schet) {
            type_schet_filter = `AND type_schet = $${params.length + 1}`
            params.push(type_schet)
        };
        if ((offset !== undefined && offset !== null) && limit) {
            offset_limit = `OFFSET $${params.length + 1} LIMIT $${params.length + 2}`;
            params.push(offset, limit);
        };
        const query = `--sql
            WITH data AS (
                SELECT 
                    id, name, schet, sub_schet, 
                    type_schet, smeta_id
                FROM spravochnik_operatsii  
                WHERE isdeleted = false 
                    AND budjet_id IS NOT NULL
                    ${search_filter} 
                    ${type_schet_filter})
            SELECT 
                ARRAY_AGG(row_to_json(data)) AS data,
                (
                    SELECT COUNT(spravochnik_operatsii.id) 
                    FROM spravochnik_operatsii 
                    WHERE isdeleted = false 
                        AND budjet_id IS NOT NULL
                        ${search_filter} 
                        ${type_schet_filter}
                )::INTEGER AS total_count
            FROM data
        `;
        const result = await db.query(query, params);
        return result[0];
    }

    static async getOperatsiiJoinMainBook(params) {
        const query = `--sql
            SELECT 
                s.id, 
                ms.name, 
                s.schet, 
                s.sub_schet, 
                s.type_schet, 
                s.smeta_id
            FROM spravochnik_operatsii AS s 
            JOIN spravochnik_main_book_schet AS ms ON ms.schet = s.schet  
            WHERE s.isdeleted = false
        `;
        const result = await db.query(query, params);
        return result;
    }

    static async uniqueSchets(params, type_schet, budjet_id = null) {
        let type_schet_filter = ``;
        let budjet_filter = ``;

        if (type_schet) {
            params.push(type_schet)
            type_schet_filter = `AND type_schet ILIKE '%' || $${params.length} || '%'`;
        }

        if (budjet_id) {
            params.push(budjet_id);
            budjet_filter = `AND budjet_id = $${params.length}`;
        }

        const query = `
            SELECT 
                DISTINCT schet
            FROM spravochnik_operatsii 
            WHERE isdeleted = false
                ${type_schet_filter}
                ${budjet_filter}
        `;

        const result = await db.query(query, params);

        return result;
    }
}