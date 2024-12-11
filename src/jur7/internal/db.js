const { db } = require('../../db/index')
const { designParams } = require('../../helper/functions')

exports.InternalDB = class {
    static async createInternal(params, client) {
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

    static async createInternalChild(params, client) {
        const values = params.map((_, index) => {
            return `
                ($${14 * index + 1}, 
                $${14 * index + 2}, 
                $${14 * index + 3}, 
                $${14 * index + 4}, 
                $${14 * index + 5}, 
                $${14 * index + 6}, 
                $${14 * index + 7}, 
                $${14 * index + 8}, 
                $${14 * index + 9}, 
                $${14 * index + 10}, 
                $${14 * index + 11}, 
                $${14 * index + 12}, 
                $${14 * index + 13},
                $${14 * index + 14})
            `;
        })
        const design_params = [
            "naimenovanie_tovarov_jur7_id",
            "kol",
            "sena",
            "summa",
            "debet_schet",
            "debet_sub_schet",
            "kredit_schet",
            "kredit_sub_schet",
            "data_pereotsenka",
            "user_id",
            "document_vnutr_peremesh_jur7_id",
            "main_schet_id",
            "created_at",
            "updated_at"
        ]
        const _values = values.join(", ")
        const allValues = designParams(params, design_params)
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
                created_at,
                updated_at
            ) 
            VALUES ${_values} RETURNING *
        `;
        const result = await client.query(query, allValues)
        return result.rows;
    }

    static async getInternal(params, search) {
        let search_filter = ``
        if (search) {
            search_filter = `AND (
                d_j.doc_num ILIKE '%' || $${params.length + 1} || '%' OR 
                d_j.kimdan_name ILIKE '%' || $${params.length + 1} || '%' OR
                d_j.kimga_name  ILIKE '%' || $${params.length + 1} || '%'
            )`;
            params.push(search)
        }
        const query = `--sql
        WITH data AS (
            SELECT 
              d_j.id, 
              d_j.doc_num,
              TO_CHAR(d_j.doc_date, 'YYYY-MM-DD') AS doc_date, 
              d_j.opisanie, 
              d_j.summa, 
              s_j_sh_kimga.fio AS kimdan_name, 
              s_j_sh_kimga.fio AS kimga_name,
              d_j.main_schet_id
            FROM document_vnutr_peremesh_jur7 AS d_j
            JOIN spravochnik_javobgar_shaxs_jur7 AS s_j_sh_kimga ON s_j_sh_kimga.id = d_j.kimga_id 
            JOIN spravochnik_javobgar_shaxs_jur7 AS s_j_sh_kimdan ON s_j_sh_kimdan.id = d_j.kimdan_id 
            JOIN users AS u ON u.id = d_j.user_id
            JOIN regions AS r ON r.id = u.region_id
            WHERE r.id = $1 
              AND d_j.isdeleted = false 
              AND d_j.doc_date BETWEEN $2 AND $3 ${search_filter}
              AND d_j.main_schet_id = $4
            ORDER BY d_j.doc_date
            OFFSET $5 LIMIT $6
          )
          SELECT 
            ARRAY_AGG(row_to_json(data)) AS data,
            (
              SELECT COALESCE(SUM(d_j.summa), 0)
              FROM document_vnutr_peremesh_jur7 AS d_j
              JOIN users AS u ON u.id = d_j.user_id
              JOIN regions AS r ON r.id = u.region_id  
              WHERE r.id = $1 
                AND d_j.doc_date BETWEEN $2 AND $3 
                AND d_j.isdeleted = false ${search_filter}
                AND d_j.main_schet_id = $4
            )::FLOAT AS summa,
            (
              SELECT COALESCE(COUNT(d_j.id), 0)
              FROM document_vnutr_peremesh_jur7 AS d_j
              JOIN users AS u ON u.id = d_j.user_id
              JOIN regions AS r ON r.id = u.region_id  
              WHERE r.id = $1 
                AND d_j.doc_date BETWEEN $2 AND $3 
                AND d_j.isdeleted = false ${search_filter}
                AND d_j.main_schet_id = $4
            )::INTEGER AS total
          FROM data
        `;
        const result = await db.query(query, params)
        return result[0];
    }

    static async getByIdInternal(params, isdeleted) {
        let ignore = 'AND d_j.isdeleted = false';
        const query = `--sql
            SELECT 
                d_j.id, 
                d_j.doc_num,
                TO_CHAR(d_j.doc_date, 'YYYY-MM-DD') AS doc_date, 
                d_j.opisanie, 
                d_j.summa::FLOAT, 
                d_j.kimdan_name, 
                d_j.kimga_name, 
                d_j.doverennost,
                d_j.kimdan_id,
                d_j.kimga_id,
                d_j.doverennost,
                d_j.j_o_num,
                d_j.main_schet_id,
                (
                SELECT ARRAY_AGG(row_to_json(d_j_ch))
                FROM (
                    SELECT  
                        d_j_ch.id,
                        d_j_ch.naimenovanie_tovarov_jur7_id,
                        d_j_ch.kol,
                        d_j_ch.sena,
                        d_j_ch.summa,
                        d_j_ch.debet_schet,
                        d_j_ch.debet_sub_schet,
                        d_j_ch.kredit_schet,
                        d_j_ch.kredit_sub_schet,
                        TO_CHAR(d_j_ch.data_pereotsenka, 'YYYY-MM-DD') AS data_pereotsenka
                    FROM document_vnutr_peremesh_jur7_child AS d_j_ch
                    WHERE d_j_ch.document_vnutr_peremesh_jur7_id = d_j.id
                ) AS d_j_ch
                ) AS childs
            FROM document_vnutr_peremesh_jur7 AS d_j
            JOIN users AS u ON u.id = d_j.user_id
            JOIN regions AS r ON r.id = u.region_id
            WHERE r.id = $1 AND d_j.id = $2 AND d_j.main_schet_id = $3 ${isdeleted ? `` : ignore}
        `;
        const result = await db.query(query, params);
        return result[0];
    }

    static async updateInternal(params) {
        const query = `--sql
            UPDATE document_vnutr_peremesh_jur7 SET 
              doc_num = $1,
              doc_date = $2,
              j_o_num = $3,
              opisanie = $4, 
              doverennost = $5, 
              summa = $6, 
              kimdan_id = $7, 
              kimdan_name = $8, 
              kimga_id = $9, 
              kimga_name = $10, 
              updated_at = $11
            WHERE id = $12 RETURNING * 
        `;
        const result = await db.query(query, params);
        return result[0];
    }

    static async deleteInternal(params, client) {
        await client.query(`UPDATE document_vnutr_peremesh_jur7_child SET isdeleted = true WHERE document_vnutr_peremesh_jur7_id = $1`, params);
        await client.query(`UPDATE document_vnutr_peremesh_jur7 SET isdeleted = true WHERE id = $1 AND isdeleted = false`, params);
    }

    static async deleteInternalChild(params, client) {
        const query = `DELETE FROM document_vnutr_peremesh_jur7_child WHERE document_vnutr_peremesh_jur7_id = $1 AND isdeleted = false`
        await client.query(query, params);
    }
}