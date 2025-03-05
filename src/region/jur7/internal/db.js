const { db } = require('@db/index');

exports.RasxodDB = class {
    static async create(params, client) {
        const query = `--sql
            INSERT INTO document_vnutr_peremesh_jur7 (
                user_id,
                doc_num,
                doc_date,
                j_o_num,
                opisanie,
                doverennost,
                summa,
                kimdan_id,
                kimdan_name,
                kimga_id,
                kimga_name,
                main_schet_id,
                created_at,
                updated_at
            ) 
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
            RETURNING *
        `
        const result = await client.query(query, params)
        return result.rows[0];
    }

    static async createChild(params, _values, client) {
        const query = `--sql
            INSERT INTO document_vnutr_peremesh_jur7_child (
                naimenovanie_tovarov_jur7_id,
                kol,
                sena,
                summa,
                debet_schet,
                debet_sub_schet,
                kredit_schet,
                kredit_sub_schet,
                data_pereotsenka,
                user_id,
                document_vnutr_peremesh_jur7_id,
                main_schet_id,
                iznos,
                iznos_summa,
                iznos_schet,
                iznos_sub_schet,
                iznos_start,
                created_at,
                updated_at
            ) 
            VALUES ${_values}
        `;

        await client.query(query, params);
    }

    static async get(params, search) {
        let search_filter = ``
        if (search) {
            params.push(search);
            search_filter = `AND (
                d.doc_num = $${params.length} OR 
                rj2.fio ILIKE '%' || $${params.length} || '%' OR
                rj.fio  ILIKE '%' || $${params.length} || '%'
            )`;
        }
        const query = `--sql
            WITH data AS (
                SELECT 
                    d.id, 
                    d.doc_num,
                    TO_CHAR(d.doc_date, 'YYYY-MM-DD') AS doc_date, 
                    d.opisanie, 
                    d.summa, 
                    rj.fio AS kimdan_name,
                    row_to_json(rj2) AS kimga
                FROM document_vnutr_peremesh_jur7 AS d
                JOIN spravochnik_javobgar_shaxs_jur7 AS rj2 ON rj2.id = d.kimga_id
                JOIN spravochnik_javobgar_shaxs_jur7 AS rj ON rj.id = d.kimdan_id 
                JOIN users AS u ON u.id = d.user_id
                JOIN regions AS r ON r.id = u.region_id
                WHERE r.id = $1 
                    AND d.isdeleted = false 
                    AND d.doc_date BETWEEN $2 AND $3 
                    ${search_filter}
                    AND d.main_schet_id = $4
                ORDER BY d.doc_date
                OFFSET $5 LIMIT $6
            )
            SELECT 
                COALESCE(COALESCE( JSON_AGG( row_to_json( data ) ), '[]'::JSON ), '[]'::JSON) AS data,
                (
                    SELECT 
                        COALESCE(SUM(d.summa), 0)
                    FROM document_vnutr_peremesh_jur7 AS d
                    JOIN users AS u ON u.id = d.user_id
                    JOIN regions AS r ON r.id = u.region_id  
                    JOIN spravochnik_javobgar_shaxs_jur7 AS rj2 ON rj2.id = d.kimga_id
                    JOIN spravochnik_javobgar_shaxs_jur7 AS rj ON rj.id = d.kimdan_id 
                    WHERE r.id = $1 
                        AND d.isdeleted = false 
                        AND d.doc_date BETWEEN $2 AND $3 
                        ${search_filter}
                        AND d.main_schet_id = $4
                )::FLOAT AS summa,
                (
                    SELECT 
                        COALESCE(COUNT(d.id), 0)
                    FROM document_vnutr_peremesh_jur7 AS d
                    JOIN users AS u ON u.id = d.user_id
                    JOIN regions AS r ON r.id = u.region_id  
                    JOIN spravochnik_javobgar_shaxs_jur7 AS rj2 ON rj2.id = d.kimga_id
                    JOIN spravochnik_javobgar_shaxs_jur7 AS rj ON rj.id = d.kimdan_id 
                    WHERE r.id = $1 
                        AND d.isdeleted = false 
                        AND d.doc_date BETWEEN $2 AND $3 
                        ${search_filter}
                        AND d.main_schet_id = $4
                )::INTEGER AS total
            FROM data
        `;
        const result = await db.query(query, params)
        return result[0];
    }

    static async getById(params, isdeleted) {
        let ignore = 'AND d.isdeleted = false';
        const query = `--sql
            SELECT 
                d.id, 
                d.doc_num,
                TO_CHAR(d.doc_date, 'YYYY-MM-DD') AS doc_date, 
                d.opisanie, 
                d.summa::FLOAT, 
                d.kimdan_name, 
                d.doverennost,
                d.kimdan_id,
                d.doverennost,
                d.j_o_num,
                (
                    SELECT JSON_AGG(row_to_json(ch))
                    FROM (
                        SELECT  
                            ch.*,
                            row_to_json(n) AS product,
                            row_to_json(g) AS group,
                            TO_CHAR(ch.data_pereotsenka, 'YYYY-MM-DD') AS data_pereotsenka
                        FROM document_vnutr_peremesh_jur7_child AS ch
                        JOIN naimenovanie_tovarov_jur7 n ON ch.naimenovanie_tovarov_jur7_id = n.id
                        JOIN group_jur7 g ON g.id = n.group_jur7_id
                        WHERE ch.document_vnutr_peremesh_jur7_id = d.id
                    ) AS ch
                ) AS childs,
                row_to_json(rj) AS kimdan,
                row_to_json(rj2) AS kimga
            FROM document_vnutr_peremesh_jur7 AS d
            JOIN users AS u ON u.id = d.user_id
            JOIN regions AS r ON r.id = u.region_id
            LEFT JOIN spravochnik_javobgar_shaxs_jur7 AS rj2 ON rj2.id = d.kimga_id
            JOIN spravochnik_javobgar_shaxs_jur7 AS rj ON rj.id = d.kimdan_id 
            WHERE r.id = $1 AND d.id = $2 AND d.main_schet_id = $3 ${isdeleted ? `` : ignore}
        `;
        const result = await db.query(query, params);
        return result[0];
    }

    static async update(params, client) {
        const query = `--sql
            UPDATE document_vnutr_peremesh_jur7 SET 
              doc_num = $1,
              doc_date = $2,
              j_o_num = $3,
              opisanie = $4, 
              doverennost = $5, 
              summa = $6, 
              kimdan_id = $7, 
              kimga_id = $8, 
              kimga_name = $9,  
              kimdan_name = $10,  
              updated_at = $11
            WHERE id = $12
            RETURNING * 
        `;

        const result = await client.query(query, params);

        return result.rows[0];
    }

    static async delete(params, client) {
        await client.query(`
            UPDATE document_vnutr_peremesh_jur7_child 
            SET isdeleted = true 
            WHERE document_vnutr_peremesh_jur7_id = $1
        `, params);

        const data = await client.query(`
            UPDATE document_vnutr_peremesh_jur7 
            SET isdeleted = true 
            WHERE id = $1
            RETURNING *
        `, params);

        return data.rows[0];
    }

    static async deleteRasxodChild(params, client) {
        const query1 = `
            UPDATE saldo_naimenovanie_jur7 
            SET isdeleted = true 
            WHERE prixod_id = $1
        `;

        const query2 = `
            UPDATE document_vnutr_peremesh_jur7_child 
            SET isdeleted = true 
            WHERE document_vnutr_peremesh_jur7_id = $1
        `;

        await client.query(query1, params);
        await client.query(query2, params);
    }
}