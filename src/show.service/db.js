const { db } = require('../db/index');
const { returnParamsValues, returnValues, designParams } = require('../helper/functions')

exports.ShowServiceDB = class {
    static async getByIdShowService(params, isdeleted) {
        const ignore = 'AND k_h_j.isdeleted = false'
        const query = `--sql
            SELECT 
                k_h_j.id,
                k_h_j.doc_num,
                k_h_j.doc_date,
                TO_CHAR(k_h_j.doc_date, 'YYYY-MM-DD') AS doc_date,
                k_h_j.id_spravochnik_organization,
                k_h_j.shartnomalar_organization_id,
                k_h_j.summa::FLOAT,
                k_h_j.opisanie,
                k_h_j.spravochnik_operatsii_own_id,
                (
                    SELECT ARRAY_AGG(row_to_json(k_h_j_ch))
                    FROM (
                            SELECT  
                                k_h_j_ch.id,
                                k_h_j_ch.kursatilgan_hizmatlar_jur152_id,
                                k_h_j_ch.spravochnik_operatsii_id,
                                k_h_j_ch.summa::FLOAT,
                                k_h_j_ch.id_spravochnik_podrazdelenie,
                                k_h_j_ch.id_spravochnik_sostav,
                                k_h_j_ch.id_spravochnik_type_operatsii
                            FROM kursatilgan_hizmatlar_jur152_child AS k_h_j_ch
                            JOIN users AS u ON k_h_j_ch.user_id = u.id
                            JOIN regions AS r ON u.region_id = r.id
                            WHERE k_h_j_ch.kursatilgan_hizmatlar_jur152_id = k_h_j.id
                        ) AS k_h_j_ch
                ) AS childs
            FROM kursatilgan_hizmatlar_jur152 AS k_h_j
            JOIN users AS u ON u.id = k_h_j.user_id
            JOIN regions AS r ON u.region_id = r.id
            WHERE r.id = $1 AND k_h_j.id = $2 AND k_h_j.main_schet_id = $3 ${!isdeleted ? ignore : ''}
        `;
        const result = await db.query(query, params);
        return result[0];
    }

    static async createShowService(params, client) {
        const query = `--sql
            INSERT INTO kursatilgan_hizmatlar_jur152(
                user_id,
                spravochnik_operatsii_own_id,
                doc_num,
                doc_date,
                summa,
                opisanie,
                id_spravochnik_organization,
                shartnomalar_organization_id,
                main_schet_id,
                created_at,
                updated_at
            )
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING *
        `;
        const result = await client.query(query, params);
        return result.rows[0];
    }

    static async createShowServiceChild(params, client) {
        const design_params = [
            "user_id",
            "spravochnik_operatsii_id",
            "spravochnik_operatsii_own_id",
            "summa",
            "id_spravochnik_podrazdelenie",
            "id_spravochnik_sostav",
            "id_spravochnik_type_operatsii",
            "kursatilgan_hizmatlar_jur152_id",
            "main_schet_id",
            "kol",
            "sena",
            "nds_foiz",
            "nds_summa",
            "summa_s_nds",
            "created_at",
            "updated_at"
        ];
        const _params = designParams(params, design_params);
        const _values = returnParamsValues(_params, 16)
        const query = `--sql
            INSERT INTO kursatilgan_hizmatlar_jur152_child(
                user_id,
                spravochnik_operatsii_id,
                spravochnik_operatsii_own_id,
                summa,
                id_spravochnik_podrazdelenie,
                id_spravochnik_sostav,
                id_spravochnik_type_operatsii,
                kursatilgan_hizmatlar_jur152_id,
                main_schet_id,
                kol,
                sena,
                nds_foiz,
                nds_summa,
                summa_s_nds,
                created_at,
                updated_at
            ) VALUES ${_values} RETURNING *
        `;
        const result = await client.query(query, _params)
        return result.rows;
    }
    static async getShowService(params) {
        const query = `--sql
            WITH data AS (
                SELECT 
                    k_h_j.id,
                    k_h_j.doc_num,
                    k_h_j.doc_date,
                    TO_CHAR(k_h_j.doc_date, 'YYYY-MM-DD') AS doc_date,
                    k_h_j.id_spravochnik_organization,
                    s_o.name AS spravochnik_organization_name,
                    s_o.raschet_schet AS spravochnik_organization_raschet_schet,
                    s_o.inn AS spravochnik_organization_inn,
                    k_h_j.shartnomalar_organization_id,
                    sh_o.doc_num AS shartnomalar_organization_doc_num,
                    sh_o.doc_date AS shartnomalar_organization_doc_date,
                    k_h_j.summa::FLOAT,
                    k_h_j.opisanie,
                    k_h_j.spravochnik_operatsii_own_id,
                    (
                        SELECT ARRAY_AGG(row_to_json(k_h_j_ch))
                        FROM (
                                SELECT  
                                    k_h_j_ch.id,
                                    k_h_j_ch.kursatilgan_hizmatlar_jur152_id,
                                    k_h_j_ch.spravochnik_operatsii_id,
                                    k_h_j_ch.summa::FLOAT,
                                    k_h_j_ch.id_spravochnik_podrazdelenie,
                                    k_h_j_ch.id_spravochnik_sostav,
                                    k_h_j_ch.id_spravochnik_type_operatsii
                                FROM kursatilgan_hizmatlar_jur152_child AS k_h_j_ch
                                JOIN users AS u ON k_h_j_ch.user_id = u.id
                                JOIN regions AS r ON u.region_id = r.id
                                WHERE k_h_j_ch.kursatilgan_hizmatlar_jur152_id = k_h_j.id
                            ) AS k_h_j_ch
                    ) AS childs
                FROM kursatilgan_hizmatlar_jur152 AS k_h_j
                JOIN users AS u ON u.id = k_h_j.user_id
                JOIN regions AS r ON u.region_id = r.id
                JOIN spravochnik_organization AS s_o ON s_o.id = k_h_j.id_spravochnik_organization
                LEFT JOIN shartnomalar_organization AS sh_o ON sh_o.id = k_h_j.shartnomalar_organization_id
                WHERE r.id = $1 AND k_h_j.doc_date BETWEEN $2 AND $3 AND k_h_j.main_schet_id = $4 AND k_h_j.isdeleted = false ORDER BY k_h_j.doc_date
                OFFSET $5 LIMIT $6 
            )
            SELECT 
            ARRAY_AGG(row_to_json(data)) AS data,
            (SELECT COUNT(k_h_j.id) 
                FROM kursatilgan_hizmatlar_jur152 AS k_h_j
                JOIN users AS u ON u.id = k_h_j.user_id
                JOIN regions AS r ON u.region_id = r.id
                WHERE r.id = $1 AND k_h_j.doc_date BETWEEN $2 AND $3 AND k_h_j.main_schet_id = $4 AND k_h_j.isdeleted = false
            )::INTEGER AS total_count,
            (SELECT SUM(k_h_j.summa) 
                FROM kursatilgan_hizmatlar_jur152 AS k_h_j
                JOIN users AS u ON u.id = k_h_j.user_id
                JOIN regions AS r ON u.region_id = r.id
                WHERE r.id = $1 AND k_h_j.doc_date BETWEEN $2 AND $3 AND k_h_j.main_schet_id = $4 AND k_h_j.isdeleted = false
            )::FLOAT AS summa
            FROM data
        `;
        const result = await db.query(query, params);
        return {data: result[0]?.data || [], total: result[0]?.total_count || 0, summa: result[0]?.summa || 0};
    }

    static async updateShowService(params, client) {
        const query = `--sql
            UPDATE kursatilgan_hizmatlar_jur152
            SET 
                doc_num = $1, 
                doc_date = $2, 
                opisanie = $3, 
                summa = $4, 
                id_spravochnik_organization = $5, 
                shartnomalar_organization_id = $6, 
                spravochnik_operatsii_own_id = $7,
                updated_at = $8
            WHERE id = $9
            RETURNING *
        `;
        const result = await client.query(query, params);
        return result.rows[0];
    }

    static async deleteShowServiceChild(params, client) {
        const query = `DELETE FROM kursatilgan_hizmatlar_jur152_child WHERE kursatilgan_hizmatlar_jur152_id = $1`;
        await client.query(query, params);
    }

    static async deleteShowService(params, client) {
        await client.query(`UPDATE kursatilgan_hizmatlar_jur152 SET  isdeleted = true WHERE id = $1`, params);
        await client.query(`UPDATE kursatilgan_hizmatlar_jur152_child SET isdeleted = true WHERE kursatilgan_hizmatlar_jur152_id = $1`, params);
    }
}