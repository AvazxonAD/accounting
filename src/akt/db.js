const { db } = require('../db/index');

exports.AktDB = class {
    static async get(params,  search = null) {
        let search_filter = ``;
        if (search) {
            params.push(search);
            search_filter = ` AND d.doc_num = $${params.length}`;
        }

        const query = `--sql
            WITH data AS (
                SELECT 
                    d.id, 
                    d.doc_num,
                    TO_CHAR(d.doc_date, 'YYYY-MM-DD') AS doc_date, 
                    d.opisanie, 
                    d.summa::FLOAT, 
                    d.id_spravochnik_organization,
                    s_o.name AS spravochnik_organization_name,
                    s_o.raschet_schet AS spravochnik_organization_raschet_schet,
                    s_o.inn AS spravochnik_organization_inn, 
                    d.shartnomalar_organization_id,
                    sh_o.doc_num AS shartnomalar_organization_doc_num,
                    TO_CHAR(sh_o.doc_date, 'YYYY-MM-DD') AS shartnomalar_organization_doc_date,
                    d.spravochnik_operatsii_own_id,
                    (
                        SELECT ARRAY_AGG(row_to_json(b_i_j_ch))
                        FROM (
                            SELECT 
                                s_o.schet AS provodki_schet,
                                s_o.sub_schet AS provodki_sub_schet
                            FROM bajarilgan_ishlar_jur3_child AS b_i_j_ch
                            JOIN spravochnik_operatsii AS s_o ON s_o.id = b_i_j_ch.spravochnik_operatsii_id
                            WHERE  b_i_j_ch.bajarilgan_ishlar_jur3_id = d.id 
                        ) AS b_i_j_ch
                    ) AS provodki_array
                FROM  bajarilgan_ishlar_jur3 AS d 
                JOIN users AS u ON d.user_id = u.id
                JOIN regions AS r ON u.region_id = r.id
                JOIN spravochnik_organization AS s_o ON s_o.id = d.id_spravochnik_organization
                LEFT JOIN shartnomalar_organization AS sh_o ON sh_o.id = d.shartnomalar_organization_id
                WHERE r.id = $1 
                    AND d.main_schet_id = $2 
                    AND d.isdeleted = false 
                    AND d.doc_date BETWEEN $3 AND $4
                    ${search_filter}
                ORDER BY d.doc_date 
                OFFSET $5 LIMIT $6
            )
            SELECT 
                ARRAY_AGG(ROW_TO_JSON(data)) AS data,
                (
                    SELECT 
                        COALESCE(COUNT(d.id), 0)::INTEGER
                    FROM bajarilgan_ishlar_jur3 AS d 
                    JOIN users AS u  ON d.user_id = u.id
                    JOIN regions AS r ON u.region_id = r.id
                    WHERE r.id = $1 
                        AND d.main_schet_id = $2 
                        AND d.isdeleted = false 
                        AND d.doc_date BETWEEN $3 AND $4
                        ${search_filter}
                ) AS total, 
                (
                    SELECT 
                        COALESCE(SUM(d.summa), 0)::FLOAT
                    FROM bajarilgan_ishlar_jur3 AS d 
                    JOIN users AS u  ON d.user_id = u.id
                    JOIN regions AS r ON u.region_id = r.id
                    WHERE r.id = $1 
                        AND d.main_schet_id = $2 
                        AND d.isdeleted = false
                        AND d.doc_date BETWEEN $3 AND $4
                        ${search_filter}
                ) AS summa
            FROM data
        `;

        const result = await db.query(query, params);

        return result[0];
    }

    static async create(params, client) {
        const query = `--sql 
            INSERT INTO bajarilgan_ishlar_jur3(
                doc_num, 
                doc_date, 
                opisanie, 
                summa, 
                id_spravochnik_organization, 
                shartnomalar_organization_id, 
                main_schet_id,
                user_id,
                spravochnik_operatsii_own_id,
                created_at,
                updated_at
            ) 
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
            RETURNING id
        `;
        const result = await client.query(query, params)
        return result.rows[0];
    }

    static async createChild(params, _values, client) {
        const query = `--sql
            INSERT INTO bajarilgan_ishlar_jur3_child(
                spravochnik_operatsii_id,
                summa,
                id_spravochnik_podrazdelenie,
                id_spravochnik_sostav,
                id_spravochnik_type_operatsii,
                main_schet_id,
                bajarilgan_ishlar_jur3_id,
                user_id,
                spravochnik_operatsii_own_id,
                kol,
                sena,
                nds_foiz,
                nds_summa,
                summa_s_nds,
                created_at,
                updated_at
            ) 
            VALUES ${_values}
        `;

        const result = await client.query(query, params);

        return result.rows;
    }

    static async getById(params, isdeleted) {
        const query = `--sql
            SELECT 
                d.id, 
                d.doc_num,
                TO_CHAR(d.doc_date, 'YYYY-MM-DD') AS doc_date, 
                d.opisanie, 
                d.summa::FLOAT, 
                d.id_spravochnik_organization,
                s_o.name AS spravochnik_organization_name,
                s_o.raschet_schet AS spravochnik_organization_raschet_schet,
                s_o.inn AS spravochnik_organization_inn, 
                d.shartnomalar_organization_id,
                sh_o.doc_num AS shartnomalar_organization_doc_num,
                TO_CHAR(sh_o.doc_date, 'YYYY-MM-DD') AS shartnomalar_organization_doc_date,
                d.spravochnik_operatsii_own_id,
                (
                    SELECT ARRAY_AGG(row_to_json(b_i_j_ch))
                    FROM (
                        SELECT  
                        b_i_j_ch.id,
                        b_i_j_ch.bajarilgan_ishlar_jur3_id,
                        b_i_j_ch.spravochnik_operatsii_id,
                        s_o.name AS spravochnik_operatsii_name,
                        b_i_j_ch.summa::FLOAT,
                        b_i_j_ch.id_spravochnik_podrazdelenie,
                        s_p.name AS spravochnik_podrazdelenie_name,
                        b_i_j_ch.id_spravochnik_sostav,
                        s_s.name AS spravochnik_sostav_name,
                        b_i_j_ch.id_spravochnik_type_operatsii,
                        s_t_o.name AS spravochnik_type_operatsii_name,
                        b_i_j_ch.kol,
                        b_i_j_ch.sena,
                        b_i_j_ch.nds_foiz,
                        b_i_j_ch.nds_summa,
                        b_i_j_ch.summa_s_nds
                        FROM bajarilgan_ishlar_jur3_child AS b_i_j_ch
                        JOIN users AS u ON b_i_j_ch.user_id = u.id
                        JOIN regions AS r ON u.region_id = r.id
                        JOIN spravochnik_operatsii AS s_o ON s_o.id = b_i_j_ch.spravochnik_operatsii_id
                        LEFT JOIN spravochnik_podrazdelenie AS s_p ON s_p.id = b_i_j_ch.id_spravochnik_podrazdelenie
                        LEFT JOIN spravochnik_sostav AS s_s ON s_s.id = b_i_j_ch.id_spravochnik_sostav
                        LEFT JOIN spravochnik_type_operatsii AS s_t_o ON s_t_o.id = b_i_j_ch.id_spravochnik_type_operatsii
                        WHERE b_i_j_ch.bajarilgan_ishlar_jur3_id = d.id
                    ) AS b_i_j_ch
                ) AS childs
            FROM  bajarilgan_ishlar_jur3 AS d 
            JOIN users AS u ON d.user_id = u.id
            JOIN regions AS r ON u.region_id = r.id
            JOIN spravochnik_organization AS s_o ON s_o.id = d.id_spravochnik_organization
            LEFT JOIN shartnomalar_organization AS sh_o ON sh_o.id = d.shartnomalar_organization_id
            WHERE r.id = $1 
                AND d.main_schet_id = $2 
                AND d.id = $3 
                ${!isdeleted ? 'AND d.isdeleted = false' : ''}   
        `;
        const data = await db.query(query, params);
        return data[0];
    }

    static async update(params, client) {
        const query = `--sql
            UPDATE bajarilgan_ishlar_jur3
            SET 
                doc_num = $1, 
                doc_date = $2, 
                opisanie = $3, 
                summa = $4, 
                id_spravochnik_organization = $5, 
                shartnomalar_organization_id = $6, 
                spravochnik_operatsii_own_id = $7,
                updated_at = $8
            WHERE id = $9 RETURNING id
        `;
        const result = await client.query(query, params);

        return result.rows[0];
    }

    static async deleteChild(params, client) {
        const query = `DELETE FROM bajarilgan_ishlar_jur3_child WHERE bajarilgan_ishlar_jur3_id = $1`
        await client.query(query, params)
    }

    static async delete(params, client) {
        await client.query(`UPDATE bajarilgan_ishlar_jur3_child SET isdeleted = true WHERE bajarilgan_ishlar_jur3_id = $1`, params);
        const result = await client.query(`UPDATE bajarilgan_ishlar_jur3 SET  isdeleted = true WHERE id = $1 RETURNING id`, params);

        return result.rows[0];
    }

    static async aktCap(params) {
        const query = `--sql
            SELECT s_o.schet, s.smeta_number, COALESCE(SUM(b_i_j3_ch.summa::FLOAT), 0) AS summa
            FROM bajarilgan_ishlar_jur3 AS d 
            JOIN bajarilgan_ishlar_jur3_child AS b_i_j3_ch ON b_i_j3_ch.bajarilgan_ishlar_jur3_id = d.id
            JOIN spravochnik_operatsii AS s_own ON s_own.id = d.spravochnik_operatsii_own_id
            JOIN spravochnik_operatsii AS s_o ON s_o.id = b_i_j3_ch.spravochnik_operatsii_id
            JOIN users AS u ON u.id = d.user_id
            JOIN regions AS r ON r.id = u.region_id
            JOIN smeta AS s ON s.id = s_o.smeta_id
            WHERE d.doc_date BETWEEN $1 AND $2 AND r.id = $3 AND s_own.schet = $4
            GROUP BY s_o.schet, s.smeta_number
        `;
        const data = db.query(query, params);
        return data;
    }

    static async getSchetAkt(params) {
        const query = `--sql
            SELECT DISTINCT s_o.schet 
            FROM bajarilgan_ishlar_jur3 AS d
            JOIN spravochnik_operatsii AS s_o  ON d.spravochnik_operatsii_own_id = s_o.id
            JOIN users AS u ON u.id = d.user_id
            JOIN regions AS r ON r.id = u.region_id
            WHERE  r.id = $1 AND d.isdeleted = false
        `;
        const data = await db.query(query, params)
        return data;
    }

    static async cap(params) {
        const query = `
            SELECT s_o.schet, s.smeta_number, COALESCE(SUM(b_i_j3_ch.summa::FLOAT), 0) AS summa
            FROM bajarilgan_ishlar_jur3 AS d 
            JOIN bajarilgan_ishlar_jur3_child AS b_i_j3_ch ON b_i_j3_ch.bajarilgan_ishlar_jur3_id = d.id
            JOIN spravochnik_operatsii AS s_own ON s_own.id = d.spravochnik_operatsii_own_id
            JOIN spravochnik_operatsii AS s_o ON s_o.id = b_i_j3_ch.spravochnik_operatsii_id
            JOIN users AS u ON u.id = d.user_id
            JOIN regions AS r ON r.id = u.region_id
            JOIN smeta AS s ON s.id = s_o.smeta_id
            WHERE d.doc_date BETWEEN $1 AND $2 
                AND r.id = $3 
                AND s_own.schet = $4 
                AND d.main_schet_id = $5

            GROUP BY s_o.schet, s.smeta_number
        `;
        const data = await db.query(query, params);
        return data;
    }

    static async getSchets(params) {
        const query = `
            SELECT DISTINCT s_o.schet 
            FROM bajarilgan_ishlar_jur3 AS d
            JOIN spravochnik_operatsii AS s_o  ON d.spravochnik_operatsii_own_id = s_o.id
            JOIN users AS u ON u.id = d.user_id
            JOIN regions AS r ON r.id = u.region_id
            WHERE  r.id = $1 
                AND d.isdeleted = false 
                AND d.main_schet_id = $2 
                AND d.doc_date BETWEEN $3 AND $4
        `;

        const schets = await db.query(query, params)

        return schets;
    }

}