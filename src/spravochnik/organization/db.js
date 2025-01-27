const { db } = require('../../db/index');
const { returnParamsValues, designParams } = require('../../helper/functions');

exports.OrganizationDB = class {
    static async getByInnAndAccountNumber(params) {
        const query =  `
            SELECT 
                s_o.id, 
                s_o.name, 
                s_o.bank_klient, 
                s_o.raschet_schet, 
                s_o.raschet_schet_gazna, 
                s_o.mfo, 
                s_o.inn, 
                s_o.okonx,
                s_o.parent_id
            FROM spravochnik_organization AS s_o 
            JOIN users ON s_o.user_id = users.id
            JOIN regions ON users.region_id = regions.id
            WHERE regions.id = $1 
                AND s_o.inn = $2 
                AND s_o.raschet_schet = $3
                AND s_o.isdeleted = false
            LIMIT 1
        `;
        const result = await db.query(query, params);
        return result[0]
    }

    static async getByIdorganization(params, isdeleted) {
        const ignore = `AND s_o.isdeleted = false`
        let query = `--sql
            SELECT 
                s_o.id, 
                s_o.name, 
                s_o.bank_klient, 
                s_o.raschet_schet, 
                s_o.raschet_schet_gazna, 
                s_o.mfo, 
                s_o.inn, 
                s_o.okonx,
                s_o.parent_id
            FROM spravochnik_organization AS s_o 
            JOIN users ON s_o.user_id = users.id
            JOIN regions ON users.region_id = regions.id 
            WHERE regions.id = $1 AND s_o.id = $2 ${isdeleted ? '' : ignore}
        `;
        const result = await db.query(query, params)
        if (result[0]) {
            const child_query = `--sql
                SELECT 
                    s_o.id, 
                    s_o.name, 
                    s_o.bank_klient, 
                    s_o.raschet_schet, 
                    s_o.raschet_schet_gazna, 
                    s_o.mfo, 
                    s_o.inn, 
                    s_o.okonx,
                    s_o.parent_id
                FROM spravochnik_organization AS s_o 
                JOIN users ON s_o.user_id = users.id
                JOIN regions ON users.region_id = regions.id 
                WHERE regions.id = $1 AND s_o.parent_id = $2 AND s_o.isdeleted = false
            `;
            result[0].childs = await db.query(child_query, params);
        }
        return result[0];
    }

    static async getOrganizationDataAndTotal(params, search, organ_id) {
        let organ_filter = ``;
        let search_filter = ``
        if (search) {
            search_filter = `AND ( s_o.inn ILIKE '%' || $${params.length + 1} || '%' OR s_o.name ILIKE '%' || $${params.length + 1} || '%' )`;
            params.push(search);
        }
        if (organ_id) {
            params.push(organ_id);
            organ_filter = `AND s_o.id = $${params.length}`;
        }
        const query = `--sql
            WITH data AS (SELECT 
                  s_o.id, 
                  s_o.name, 
                  s_o.bank_klient, 
                  s_o.raschet_schet, 
                  s_o.raschet_schet_gazna, 
                  s_o.mfo, 
                  s_o.inn, 
                  s_o.okonx,
                  s_o.parent_id 
                FROM spravochnik_organization AS s_o  
                JOIN users AS u ON s_o.user_id = u.id
                JOIN regions AS r ON u.region_id = r.id 
                WHERE s_o.isdeleted = false 
                    AND r.id = $1 
                    ${search_filter}
                    ${organ_filter}
                OFFSET $2
                LIMIT $3
            )
            SELECT 
              ARRAY_AGG(row_to_json(data)) AS data,
              (SELECT COUNT(s_o.id)
                FROM spravochnik_organization AS s_o  
                JOIN users AS u ON s_o.user_id = u.id
                JOIN regions AS r ON u.region_id = r.id 
                WHERE s_o.isdeleted = false 
                    AND r.id = $1 
                    ${search_filter}
                    ${organ_filter}
                )::INTEGER AS total_count
            FROM data
        `;
        const result = await db.query(query, params);
        return { data: result[0]?.data || [], total: result[0]?.total_count || 0 };
    }

    static async getOrganization(params) {
        const query = `--sql
            SELECT organ.id, organ.name
            FROM spravochnik_organization AS organ
            JOIN users AS u ON u.id = organ.user_id
            JOIN regions AS r ON r.id = u.region_id
            WHERE r.id = $1 AND organ.isdeleted = false
        `;
        const result = await db.query(query, params)
        return result;
    }

    static async createOrganization(params) {
        const query = `--sql
           INSERT INTO spravochnik_organization(
                name, bank_klient, raschet_schet, raschet_schet_gazna, 
                mfo, inn, user_id, okonx, parent_id, created_at, updated_at 
            ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
            RETURNING *
        `;
        const result = await db.query(query, params);
        return result;
    }

    static async updateOrganization(params) {
        const query = `--sql
            UPDATE spravochnik_organization 
            SET name = $1, bank_klient = $2, raschet_schet = $3, 
                raschet_schet_gazna = $4, mfo = $5, inn = $6, okonx = $7, parent_id = $8
            WHERE id = $9 AND isdeleted = false RETURNING *
        `;
        const result = await db.query(query, params);
        return result;
    }

    static async deleteOrganization(params) {
        const query = `UPDATE spravochnik_organization SET isdeleted = true WHERE id = $1`;
        await db.query(query, params);
    }

    // static async createOrganization(params, array, client) {
    //     const query = `--sql
    //         INSERT INTO spravochnik_organization(
    //             name, bank_klient, raschet_schet, raschet_schet_gazna, 
    //             mfo, inn, user_id, okonx, created_at, updated_at 
    //         ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
    //         RETURNING *
    //     `;
    //     let result;
    //     if (!client) {
    //         result = await db.query(query, params);
    //     } else {
    //         result = await client.query(query)
    //     }
    //     if (array.length > 0) {
    //         array = array.map(item => {
    //             item.parent_id = result.rows[0].id;
    //             return item;
    //         })
    //         const _values = returnParamsValues(array);
    //         const design_params = [
    //             "name",
    //             "bank_klient",
    //             "raschet_schet",
    //             "raschet_schet_gazna",
    //             "mfo",
    //             "inn",
    //             "user_id",
    //             "okonx",
    //             "parent_id",
    //             "created_at",
    //             "updated_at"
    //         ]
    //         const query = `--sql
    //             INSERT INTO spravochnik_organization(
    //                 name, bank_klient, raschet_schet, raschet_schet_gazna, 
    //                 mfo, inn, user_id, okonx, parent_id, created_at, updated_at 
    //             )  ${_values}
    //             RETURNING *
    //         `;
    //         const allValues = designParams(params, design_params)
    //         const childs = await client.query(query, allValues)
    //         result.array = childs.rows;
    //     }
    //     return result;
    //}
}