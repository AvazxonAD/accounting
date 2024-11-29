const { db } = require('../../db/index')
const { designParams } = require('../../helper/functions')


exports.PrixodDB = class {
    static async createPrixod(params, client) {
        const query = `--sql
            INSERT INTO document_prixod_jur7 (
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
                id_shartnomalar_organization,
                created_at,
                updated_at
            ) 
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
            RETURNING * 
        `
        const result = await client.query(query, params)
        return result.rows[0];
    }

    static async createPrixodChild(params, client) {
        const values = params.map((_, index) => {
            return `
                ($${13 * index + 1}, 
                $${13 * index + 2}, 
                $${13 * index + 3}, 
                $${13 * index + 4}, 
                $${13 * index + 5}, 
                $${13 * index + 6}, 
                $${13 * index + 7}, 
                $${13 * index + 8}, 
                $${13 * index + 9}, 
                $${13 * index + 10}, 
                $${13 * index + 11}, 
                $${13 * index + 12}, 
                $${13 * index + 13})
            `
        })
        const _values = values.join(", ")
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
                "document_prixod_jur7_id",
                "created_at",
                "updated_at"
        ]
        const allValues = designParams(params, design_params)
        const query = `--sql
            INSERT INTO document_prixod_jur7_child (
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
                document_prixod_jur7_id,
                created_at,
                updated_at
            ) 
            VALUES ${_values} RETURNING *
        `;
        const result = await client.query(query, allValues)
        return result.rows;
    }

    static async getPrixod(params, search) {
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
              d_j.kimdan_name, 
              d_j.kimga_name
            FROM document_prixod_jur7 AS d_j
            JOIN users AS u ON u.id = d_j.user_id
            JOIN regions AS r ON r.id = u.region_id
            WHERE r.id = $1 
              AND d_j.isdeleted = false 
              AND d_j.doc_date BETWEEN $2 AND $3 ${search_filter}
            ORDER BY d_j.doc_date
            OFFSET $4 LIMIT $5
          )
          SELECT 
            ARRAY_AGG(row_to_json(data)) AS data,
            (
              SELECT COALESCE(SUM(d_j.summa), 0)
              FROM document_prixod_jur7 AS d_j
              JOIN users AS u ON u.id = d_j.user_id
              JOIN regions AS r ON r.id = u.region_id  
              WHERE r.id = $1 
                AND d_j.doc_date BETWEEN $2 AND $3 
                AND d_j.isdeleted = false ${search_filter}
            )::FLOAT AS summa,
            (
              SELECT COALESCE(COUNT(d_j.id), 0)
              FROM document_prixod_jur7 AS d_j
              JOIN users AS u ON u.id = d_j.user_id
              JOIN regions AS r ON r.id = u.region_id  
              WHERE r.id = $1 
                AND d_j.doc_date BETWEEN $2 AND $3 
                AND d_j.isdeleted = false ${search_filter}
            )::INTEGER AS total
          FROM data
        `;
        const result = await db.query(query, params)
        return result[0];
    }

    static async getByIdPrixod(params, isdeleted) {
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
                    FROM document_prixod_jur7_child AS d_j_ch
                    WHERE d_j_ch.document_prixod_jur7_id = d_j.id
                ) AS d_j_ch
                ) AS childs
            FROM document_prixod_jur7 AS d_j
            JOIN users AS u ON u.id = d_j.user_id
            JOIN regions AS r ON r.id = u.region_id
            WHERE r.id = $1 AND d_j.id = $2  ${isdeleted ? `` : ignore}
        `;
        const result = await db.query(query, params);
        return result[0];
    }

    static async updatePrixod(params) {
        const query = `--sql
            UPDATE document_prixod_jur7 SET 
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
              id_shartnomalar_organization = $11, 
              updated_at = $12
            WHERE id = $13 RETURNING * 
        `;
        const result = await db.query(query, params);
        return result[0];
    }

    static async deletePrixod(params, client) {
        await client.query(`UPDATE document_prixod_jur7_child SET isdeleted = true WHERE document_prixod_jur7_id = $1`, params);
        await client.query(`UPDATE document_prixod_jur7 SET isdeleted = true WHERE id = $1 AND isdeleted = false`, params);
    }

    static async deletePrixodChild(params, client) {
        const query = `DELETE FROM document_prixod_jur7_child WHERE document_prixod_jur7_id = $1 AND isdeleted = false`
        await client.query(query, params);
    }
}