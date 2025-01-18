const { db } = require('../../../db/index')

exports.NaimenovanieDB = class {
    static async createNaimenovanie(params, client) {
        const query = `--sql
            INSERT INTO naimenovanie_tovarov_jur7 (
                user_id, 
                spravochnik_budjet_name_id, 
                name, 
                edin, 
                group_jur7_id, 
                inventar_num,
                serial_num,
                created_at, 
                updated_at
            ) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
            RETURNING *
        `
        const result = await client.query(query, params);
        
        return result.rows[0];
    }

    static async getNaimenovanie(params, search = null) {
        let search_filter = ``
        if (search) {
            search_filter = `AND n_t_j7.name ILIKE '%' || $${params.length + 1} || '%'`;
            params.push(search)
        }
        const query = `--sql
            WITH data AS (
                SELECT 
                    n_t_j7.id, 
                    n_t_j7.name, 
                    n_t_j7.edin,
                    n_t_j7.group_jur7_id,
                    n_t_j7.spravochnik_budjet_name_id,
                    n_t_j7.inventar_num,
                    n_t_j7.serial_num,
                    g.id AS group_jur7_id,
                    g.name AS group_jur7_name,
                    g.iznos_foiz,
                    s_b_n.name AS spravochnik_budjet_name
                FROM naimenovanie_tovarov_jur7 AS n_t_j7
                JOIN users AS u ON u.id = n_t_j7.user_id
                JOIN regions AS r ON r.id = u.region_id
                JOIN group_jur7 AS g ON g.id = n_t_j7.group_jur7_id
                JOIN spravochnik_budjet_name AS s_b_n ON s_b_n.id = n_t_j7.spravochnik_budjet_name_id 
                WHERE n_t_j7.isdeleted = false AND r.id = $1 ${search_filter}
                OFFSET $2 LIMIT $3
            )
            SELECT 
                ARRAY_AGG(row_to_json(data)) AS data,
                (
                    SELECT COALESCE(COUNT(n_t_j7.id), 0)::INTEGER  
                    FROM naimenovanie_tovarov_jur7 AS n_t_j7
                    JOIN users AS u ON u.id = n_t_j7.user_id
                    JOIN regions AS r ON r.id = u.region_id
                    WHERE n_t_j7.isdeleted = false AND r.id = $1 ${search_filter}
                ) AS total
            FROM data
        `

        const result = await db.query(query, params)
        return result[0];
    }

    static async getByIdNaimenovanie(params, isdeleted) {
        let ignore = 'AND n_t_j7.isdeleted = false';
        const query = `--sql
            SELECT 
                n_t_j7.id, 
                n_t_j7.name, 
                n_t_j7.edin,
                g.id AS group_jur7_id,
                g.name AS group_jur7_name,
                g.iznos_foiz,
                n_t_j7.group_jur7_id,
                n_t_j7.spravochnik_budjet_name_id,
                n_t_j7.inventar_num,
                n_t_j7.serial_num,
                s_b_n.name AS spravochnik_budjet_name
            FROM naimenovanie_tovarov_jur7 AS n_t_j7
            JOIN users AS u ON u.id = n_t_j7.user_id
            JOIN regions AS r ON r.id = u.region_id
            LEFT JOIN group_jur7 AS g ON g.id = n_t_j7.group_jur7_id
            LEFT JOIN spravochnik_budjet_name AS s_b_n ON s_b_n.id = n_t_j7.spravochnik_budjet_name_id 
            WHERE r.id = $1 AND n_t_j7.id = $2  ${isdeleted ? `` : ignore}
        `
        const result = await db.query(query, params)
        return result[0]
    }

    static async updateNaimenovanie(params) {
        const query = `--sql
            UPDATE naimenovanie_tovarov_jur7 
            SET 
                name = $1, edin = $2, spravochnik_budjet_name_id = $3, 
                group_jur7_id = $4, inventar_num = $5, serial_num = $6, updated_at = $7
            WHERE id = $8 AND isdeleted = false
            RETURNING *
        `
        const result = await db.query(query, params)
        return result[0]
    }

    static async deleteNaimenovanie(params, client) {
        const query = `UPDATE naimenovanie_tovarov_jur7 SET isdeleted = true WHERE id = $1 AND isdeleted = false`
        await client.query(query, params)
    }

    static async getProductKol(params, search, tovar_id, client) {
        let tovar_filter = '';
        let search_filter = ''
        if (search) {
            search_filter = `AND n_t_j7.name ILIKE '%' || $${params.length + 1} || '%'`;
            params.push(search); 
        }
        if(tovar_id){
            tovar_filter = `AND n_t_j7.id = $${params.length + 1}`;
            params.push(tovar_id);
        }
        const query = `--sql
            WITH data AS (
                SELECT 
                    n_t_j7.name, 
                    n_t_j7.id::INTEGER, 
                    n_t_j7.edin,
                    n_t_j7.group_jur7_id,
                    n_t_j7.inventar_num,
                    n_t_j7.serial_num,
                    g_j7.name AS group_jur7_name,
                    n_t_j7.spravochnik_budjet_name_id,
                    s_b_n.name AS spravochnik_budjet_name,
                    TO_CHAR(d.doc_date, 'YYYY-MM-DD') AS doc_date,
                    (d_ch.summa_s_nds / d_ch.kol)::FLOAT AS sena,
                    (
                        SELECT COALESCE(SUM(d_ch.kol), 0)
                        FROM document_prixod_jur7 AS d
                        JOIN document_prixod_jur7_child AS d_ch ON d.id = d_ch.document_prixod_jur7_id
                        JOIN users AS u ON u.id = d.user_id 
                        JOIN regions AS r ON r.id = u.region_id
                        WHERE r.id = $1 AND d_ch.naimenovanie_tovarov_jur7_id = n_t_j7.id AND d.kimga_id = $2 AND d.isdeleted = false
                    )::FLOAT AS prixod1,
                    (
                        SELECT COALESCE(SUM(d_ch.kol), 0)
                        FROM document_vnutr_peremesh_jur7 AS d
                        JOIN document_vnutr_peremesh_jur7_child AS d_ch ON d.id = d_ch.document_vnutr_peremesh_jur7_id
                        JOIN users AS u ON u.id = d.user_id 
                        JOIN regions AS r ON r.id = u.region_id
                        WHERE r.id = $1 AND d_ch.naimenovanie_tovarov_jur7_id = n_t_j7.id AND d.kimga_id = $2 AND d.isdeleted = false
                    )::FLOAT AS prixod2,
                    (
                        SELECT COALESCE(SUM(d_ch.kol), 0)
                        FROM document_rasxod_jur7 AS d
                        JOIN document_rasxod_jur7_child AS d_ch ON d.id = d_ch.document_rasxod_jur7_id
                        JOIN users AS u ON u.id = d.user_id 
                        JOIN regions AS r ON r.id = u.region_id
                        WHERE r.id = $1 AND d_ch.naimenovanie_tovarov_jur7_id = n_t_j7.id AND d.kimdan_id = $2 AND d.isdeleted = false
                    )::FLOAT AS rasxod1,
                    (
                        SELECT COALESCE(SUM(d_ch.kol), 0)
                        FROM document_vnutr_peremesh_jur7 AS d
                        JOIN document_vnutr_peremesh_jur7_child AS d_ch ON d.id = d_ch.document_vnutr_peremesh_jur7_id
                        JOIN users AS u ON u.id = d.user_id 
                        JOIN regions AS r ON r.id = u.region_id
                        WHERE r.id = $1 AND d_ch.naimenovanie_tovarov_jur7_id = n_t_j7.id AND d.kimdan_id = $2 AND d.isdeleted = false
                    )::FLOAT AS rasxod2
                FROM naimenovanie_tovarov_jur7 AS n_t_j7
                JOIN document_prixod_jur7_child AS d_ch ON d_ch.naimenovanie_tovarov_jur7_id = n_t_j7.id
                JOIN document_prixod_jur7 AS d ON d_ch.document_prixod_jur7_id = d.id
                JOIN users AS u ON u.id = n_t_j7.user_id
                JOIN regions AS r ON r.id = u.region_id
                JOIN group_jur7 AS g_j7 ON g_j7.id = n_t_j7.group_jur7_id
                JOIN spravochnik_budjet_name AS s_b_n ON s_b_n.id = n_t_j7.spravochnik_budjet_name_id
                WHERE n_t_j7.isdeleted = false AND r.id = $1 ${tovar_filter} ${search_filter} 
            )
            SELECT *
            FROM (
                SELECT *, (prixod1 + prixod2 - rasxod1 - rasxod2)::FLOAT AS result
                FROM data
            ) AS subquery
        `;
        let data;
        if(client){
            data = await client.query(query, params);
            data = data.rows;
        } else {
            data = await db.query(query, params)
        }
        return data;
    }
}