const { db } = require('../db/index');

exports.OrganizationMonitoringDB = class {
    static async getData(params) {
        const query = `--sql
            SELECT
                b_r.id,
                b_r.doc_num,
                b_r.doc_date,
                b_r.opisanie,
                0::FLOAT AS summa_rasxod, 
                b_r_ch.summa::FLOAT AS summa_prixod,
                sh_o.id AS shartnoma_id,
                sh_o.doc_num AS shartnoma_doc_num,
                TO_CHAR(sh_o.doc_date, 'YYYY-MM-DD') AS shartnoma_doc_date,
                s.smeta_number,
                s_o.id AS organ_id,
                s_o.name AS organ_name,
                s_o.inn AS organ_inn,
                u.id AS user_id,
                u.login,
                u.fio,
                s_op.schet AS provodki_schet, 
                s_op.sub_schet AS provodki_sub_schet
            FROM bank_rasxod_child b_r_ch
            JOIN bank_rasxod AS b_r ON b_r_ch.id_bank_rasxod = b_r.id
            JOIN users AS u ON u.id = b_r.user_id
            JOIN regions AS r ON r.id = u.region_id 
            LEFT JOIN shartnomalar_organization AS sh_o ON sh_o.id = b_r.id_shartnomalar_organization
            LEFT JOIN smeta AS s ON sh_o.smeta_id = s.id 
            JOIN spravochnik_organization AS s_o ON s_o.id = b_r.id_spravochnik_organization
            JOIN spravochnik_operatsii AS s_op ON s_op.id = b_r_ch.spravochnik_operatsii_id
            WHERE b_r.isdeleted = false
                AND r.id = $1 
                AND b_r.main_schet_id = $2
                AND s_op.schet = $3
                AND b_r.doc_date BETWEEN $4 AND $5

            UNION ALL

            SELECT 
                b_p.id,
                b_p.doc_num,
                b_p.doc_date,
                b_p.opisanie,
                b_p_ch.summa::FLOAT AS summa_rasxod,
                0::FLOAT AS summa_prixod, 
                sh_o.id AS shartnoma_id,
                sh_o.doc_num AS shartnoma_doc_num,
                TO_CHAR(sh_o.doc_date, 'YYYY-MM-DD') AS shartnoma_doc_date,
                s.smeta_number,
                s_o.id AS organ_id,
                s_o.name AS organ_name,
                s_o.inn AS organ_inn,
                u.id AS user_id,
                u.login,
                u.fio,
                s_op.schet AS provodki_schet, 
                s_op.sub_schet AS provodki_sub_schet
            FROM bank_prixod_child b_p_ch
            JOIN bank_prixod AS b_p ON b_p_ch.id_bank_prixod = b_p.id
            JOIN users AS u ON u.id = b_p.user_id
            JOIN regions AS r ON r.id = u.region_id 
            LEFT JOIN shartnomalar_organization AS sh_o ON sh_o.id = b_p.id_shartnomalar_organization
            LEFT JOIN smeta AS s ON sh_o.smeta_id = s.id
            JOIN spravochnik_organization AS s_o ON s_o.id = b_p.id_spravochnik_organization
            JOIN spravochnik_operatsii AS s_op ON s_op.id = b_p_ch.spravochnik_operatsii_id
            WHERE b_p.isdeleted = false
                AND r.id = $1 
                AND b_p.main_schet_id = $2
                AND s_op.schet = $3
                AND b_p.doc_date BETWEEN $4 AND $5

            ORDER BY doc_date 
            OFFSET $6 LIMIT $7
        `;
        const data = await db.query(query, params);
        return data;
    }

    static async getTotal(params) {
        const query = `--sql
            WITH bank_prixod_count AS (
                SELECT COALESCE(COUNT(*)::INTEGER, 0) AS total_count
                FROM bank_prixod_child b_p_ch
                JOIN bank_prixod AS b_p ON b_p_ch.id_bank_prixod = b_p.id
                JOIN spravochnik_operatsii AS s_op ON s_op.id = b_p_ch.spravochnik_operatsii_id
                JOIN spravochnik_organization AS s_o ON s_o.id = b_p.id_spravochnik_organization
                JOIN users AS u ON u.id = b_p.user_id
                JOIN regions AS r ON r.id = u.region_id 
                WHERE b_p.isdeleted = false
                    AND r.id = $1 
                    AND b_p.main_schet_id = $2
                    AND s_op.schet = $3
                    AND b_p.doc_date BETWEEN $4 AND $5
            ),
            bank_rasxod_count AS (
                SELECT COALESCE(COUNT(*)::INTEGER, 0) AS total_count
                FROM bank_rasxod_child b_r_ch
                JOIN bank_rasxod AS b_r ON b_r_ch.id_bank_rasxod = b_r.id
                JOIN spravochnik_operatsii AS s_op ON s_op.id = b_r_ch.spravochnik_operatsii_id
                JOIN users AS u ON u.id = b_r.user_id
                JOIN regions AS r ON r.id = u.region_id 
                WHERE b_r.isdeleted = false
                    AND r.id = $1 
                    AND b_r.main_schet_id = $2
                    AND s_op.schet = $3
                    AND b_r.doc_date BETWEEN $4 AND $5
            )
            SELECT SUM(total_count)::INTEGER AS total
            FROM (
                SELECT total_count FROM bank_prixod_count
                UNION ALL
                SELECT total_count FROM bank_rasxod_count
            ) AS total_count  
        `;
        const result = await db.query(query, params);
        return result[0].total
    }

    static async getSumma(params, operator) {
        const query = `--sql
            WITH 
            bank_rasxod_sum AS (
                SELECT COALESCE(SUM(b_r_ch.summa), 0)::FLOAT AS summa
                FROM bank_rasxod_child b_r_ch
                JOIN bank_rasxod AS b_r ON b_r_ch.id_bank_rasxod = b_r.id
                JOIN spravochnik_operatsii AS s_op ON s_op.id = b_r_ch.spravochnik_operatsii_id
                JOIN users AS u ON u.id = b_r.user_id
                JOIN regions AS r ON r.id = u.region_id
                WHERE b_r.isdeleted = false
                  AND r.id = $1
                  AND b_r.main_schet_id = $2
                  AND s_op.schet = $3
                  AND b_r.doc_date ${operator} $4
            ),
            bank_prixod_sum AS (
                SELECT COALESCE(SUM(b_p_ch.summa), 0)::FLOAT AS summa
                FROM bank_prixod_child AS b_p_ch
                JOIN bank_prixod AS b_p ON b_p_ch.id_bank_prixod = b_p.id
                JOIN spravochnik_operatsii AS s_op ON s_op.id = b_p_ch.spravochnik_operatsii_id
                JOIN users AS u ON u.id = b_p.user_id
                JOIN regions AS r ON r.id = u.region_id
                WHERE b_p.isdeleted = false
                  AND r.id = $1
                  AND b_p.main_schet_id = $2
                  AND s_op.schet = $3
                  AND b_p.doc_date ${operator} $4
            )
            SELECT 
                (bank_rasxod_sum.summa - bank_prixod_sum.summa) AS summa
            FROM bank_rasxod_sum, bank_prixod_sum
        `;
        const result = await db.query(query, params);
        return result[0].summa;
    }
    
    static async getByOrganIdData(params) {
        const query = `--sql
            SELECT
                b_r.id,
                b_r.doc_num,
                b_r.doc_date,
                b_r.opisanie,
                0::FLOAT AS summa_rasxod, 
                b_r_ch.summa::FLOAT AS summa_prixod,
                sh_o.id AS shartnoma_id,
                sh_o.doc_num AS shartnoma_doc_num,
                TO_CHAR(sh_o.doc_date, 'YYYY-MM-DD') AS shartnoma_doc_date,
                s.smeta_number,
                s_o.id AS organ_id,
                s_o.name AS organ_name,
                s_o.inn AS organ_inn,
                u.id AS user_id,
                u.login,
                u.fio,
                s_op.schet AS provodki_schet, 
                s_op.sub_schet AS provodki_sub_schet
            FROM bank_rasxod_child b_r_ch
            JOIN bank_rasxod AS b_r ON b_r_ch.id_bank_rasxod = b_r.id
            JOIN users AS u ON u.id = b_r.user_id
            JOIN regions AS r ON r.id = u.region_id 
            LEFT JOIN shartnomalar_organization AS sh_o ON sh_o.id = b_r.id_shartnomalar_organization
            LEFT JOIN smeta AS s ON sh_o.smeta_id = s.id 
            JOIN spravochnik_organization AS s_o ON s_o.id = b_r.id_spravochnik_organization
            JOIN spravochnik_operatsii AS s_op ON s_op.id = b_r_ch.spravochnik_operatsii_id
            WHERE b_r.isdeleted = false
                AND r.id = $1 
                AND b_r.main_schet_id = $2
                AND s_op.schet = $3
                AND b_r.doc_date BETWEEN $4 AND $5
                AND b_r.id_spravochnik_organization = $6

            UNION ALL

            SELECT 
                b_i_j3.id,
                b_i_j3.doc_num,
                b_i_j3.doc_date,
                b_i_j3.opisanie,
                b_i_j3_ch.summa::FLOAT AS summa_rasxod, 
                0::FLOAT AS summa_prixod,
                sh_o.id AS shartnoma_id,
                sh_o.doc_num AS shartnoma_doc_num,
                TO_CHAR(sh_o.doc_date, 'YYYY-MM-DD') AS shartnoma_doc_date,
                s.smeta_number,
                s_o.id AS organ_id,
                s_o.name AS organ_name,
                s_o.inn AS organ_inn,
                u.id AS user_id,
                u.login,
                u.fio,
                s_op.schet AS provodki_schet, 
                s_op.sub_schet AS provodki_sub_schet
            FROM bajarilgan_ishlar_jur3_child AS b_i_j3_ch
            JOIN bajarilgan_ishlar_jur3 AS b_i_j3 ON b_i_j3.id = b_i_j3_ch.bajarilgan_ishlar_jur3_id
            JOIN users AS u ON b_i_j3.user_id = u.id
            JOIN regions AS r ON r.id = u.region_id
            LEFT JOIN shartnomalar_organization AS sh_o ON sh_o.id = b_i_j3.shartnomalar_organization_id
            LEFT JOIN smeta AS s ON sh_o.smeta_id = s.id 
            JOIN spravochnik_organization AS s_o ON s_o.id = b_i_j3.id_spravochnik_organization
            JOIN spravochnik_operatsii AS s_o_p ON s_o_p.id = b_i_j3.spravochnik_operatsii_own_id
            JOIN spravochnik_operatsii AS s_op ON s_op.id = b_i_j3_ch.spravochnik_operatsii_id
            WHERE b_i_j3.isdeleted = false 
                AND r.id = $1
                AND b_i_j3.main_schet_id = $2
                AND s_o_p.schet = $3
                AND b_i_j3.doc_date BETWEEN $4 AND $5
                AND b_i_j3.id_spravochnik_organization = $6

            UNION ALL

            SELECT 
                k_h_j152.id,
                k_h_j152.doc_num,
                k_h_j152.doc_date,
                k_h_j152.opisanie,
                0::FLOAT AS summa_rasxod, 
                k_h_j152_ch.summa::FLOAT AS summa_prixod,
                sh_o.id AS shartnoma_id,
                sh_o.doc_num AS shartnoma_doc_num,
                TO_CHAR(sh_o.doc_date, 'YYYY-MM-DD') AS shartnoma_doc_date,
                s.smeta_number,
                s_o.id AS organ_id,
                s_o.name AS organ_name,
                s_o.inn AS organ_inn,
                u.id AS user_id,
                u.login,
                u.fio,
                s_op.schet AS provodki_schet, 
                s_op.sub_schet AS provodki_sub_schet
            FROM kursatilgan_hizmatlar_jur152_child AS k_h_j152_ch
            JOIN kursatilgan_hizmatlar_jur152 AS k_h_j152 ON k_h_j152.id = k_h_j152_ch.kursatilgan_hizmatlar_jur152_id 
            JOIN users AS u ON k_h_j152.user_id = u.id
            JOIN regions AS r ON r.id = u.region_id
            LEFT JOIN shartnomalar_organization AS sh_o ON sh_o.id = k_h_j152.shartnomalar_organization_id
            LEFT JOIN smeta AS s ON sh_o.smeta_id = s.id 
            JOIN spravochnik_organization AS s_o ON s_o.id = k_h_j152.id_spravochnik_organization
            JOIN spravochnik_operatsii AS s_o_p ON s_o_p.id = k_h_j152.spravochnik_operatsii_own_id
            JOIN spravochnik_operatsii AS s_op ON s_op.id = k_h_j152_ch.spravochnik_operatsii_id
            WHERE k_h_j152.isdeleted = false 
                AND r.id = $1
                AND k_h_j152.main_schet_id = $2
                AND s_o_p.schet = $3
                AND k_h_j152.doc_date BETWEEN $4 AND $5
                AND k_h_j152.id_spravochnik_organization = $6

            UNION ALL

            SELECT 
                b_p.id,
                b_p.doc_num,
                b_p.doc_date,
                b_p.opisanie,
                b_p_ch.summa::FLOAT AS summa_rasxod,
                0::FLOAT AS summa_prixod, 
                sh_o.id AS shartnoma_id,
                sh_o.doc_num AS shartnoma_doc_num,
                TO_CHAR(sh_o.doc_date, 'YYYY-MM-DD') AS shartnoma_doc_date,
                s.smeta_number,
                s_o.id AS organ_id,
                s_o.name AS organ_name,
                s_o.inn AS organ_inn,
                u.id AS user_id,
                u.login,
                u.fio,
                s_op.schet AS provodki_schet, 
                s_op.sub_schet AS provodki_sub_schet
            FROM bank_prixod_child b_p_ch
            JOIN bank_prixod AS b_p ON b_p_ch.id_bank_prixod = b_p.id
            JOIN users AS u ON u.id = b_p.user_id
            JOIN regions AS r ON r.id = u.region_id 
            LEFT JOIN shartnomalar_organization AS sh_o ON sh_o.id = b_p.id_shartnomalar_organization
            LEFT JOIN smeta AS s ON sh_o.smeta_id = s.id
            JOIN spravochnik_organization AS s_o ON s_o.id = b_p.id_spravochnik_organization
            JOIN spravochnik_operatsii AS s_op ON s_op.id = b_p_ch.spravochnik_operatsii_id
            WHERE b_p.isdeleted = false
                AND r.id = $1 
                AND b_p.main_schet_id = $2
                AND s_op.schet = $3
                AND b_p.doc_date BETWEEN $4 AND $5
                AND b_p.id_spravochnik_organization = $6

            ORDER BY doc_date 
            OFFSET $7 LIMIT $8
        `;
        const data = await db.query(query, params);
        return data;
    }

    static async getByOrganIdTotal(params) {
        const query = `--sql
            WITH bank_prixod_count AS (
                SELECT COALESCE(COUNT(*)::INTEGER, 0) AS total_count
                FROM bank_prixod_child b_p_ch
                JOIN bank_prixod AS b_p ON b_p_ch.id_bank_prixod = b_p.id
                JOIN spravochnik_operatsii AS s_op ON s_op.id = b_p_ch.spravochnik_operatsii_id
                JOIN spravochnik_organization AS s_o ON s_o.id = b_p.id_spravochnik_organization
                JOIN users AS u ON u.id = b_p.user_id
                JOIN regions AS r ON r.id = u.region_id 
                WHERE b_p.isdeleted = false
                    AND r.id = $1 
                    AND b_p.main_schet_id = $2
                    AND s_op.schet = $3
                    AND b_p.doc_date BETWEEN $4 AND $5
                    AND b_p.id_spravochnik_organization = $6
            ),
            bajarilgan_ishlar_jur3_count AS (
                SELECT COALESCE(COUNT(*)::INTEGER, 0) AS total_count
                FROM bajarilgan_ishlar_jur3_child AS b_i_j3_ch
                JOIN bajarilgan_ishlar_jur3 AS b_i_j3 ON b_i_j3.id = b_i_j3_ch.bajarilgan_ishlar_jur3_id 
                JOIN spravochnik_operatsii AS s_o_p ON s_o_p.id = b_i_j3.spravochnik_operatsii_own_id
                JOIN users AS u ON b_i_j3.user_id = u.id
                JOIN regions AS r ON r.id = u.region_id
                WHERE b_i_j3.isdeleted = false 
                    AND r.id = $1
                    AND b_i_j3.main_schet_id = $2
                    AND s_o_p.schet = $3
                    AND b_i_j3.doc_date BETWEEN $4 AND $5
                    AND b_i_j3.id_spravochnik_organization = $6
            ),
            kursatilgan_hizmatlar_jur152_count AS (
                SELECT COALESCE(COUNT(*)::INTEGER, 0) AS total_count
                FROM kursatilgan_hizmatlar_jur152_child AS k_h_152_ch
                JOIN kursatilgan_hizmatlar_jur152 AS k_h_152 ON k_h_152.id = k_h_152_ch.kursatilgan_hizmatlar_jur152_id 
                JOIN spravochnik_operatsii AS s_o_p ON s_o_p.id = k_h_152.spravochnik_operatsii_own_id
                JOIN users AS u ON k_h_152.user_id = u.id
                JOIN regions AS r ON r.id = u.region_id
                WHERE k_h_152.isdeleted = false 
                    AND r.id = $1
                    AND k_h_152.main_schet_id = $2
                    AND s_o_p.schet = $3
                    AND k_h_152.doc_date BETWEEN $4 AND $5
                    AND k_h_152.id_spravochnik_organization = $6
            ),
            bank_rasxod_count AS (
                SELECT COALESCE(COUNT(*)::INTEGER, 0) AS total_count
                FROM bank_rasxod_child b_r_ch
                JOIN bank_rasxod AS b_r ON b_r_ch.id_bank_rasxod = b_r.id
                JOIN spravochnik_operatsii AS s_op ON s_op.id = b_r_ch.spravochnik_operatsii_id
                JOIN users AS u ON u.id = b_r.user_id
                JOIN regions AS r ON r.id = u.region_id 
                WHERE b_r.isdeleted = false
                    AND r.id = $1 
                    AND b_r.main_schet_id = $2
                    AND s_op.schet = $3
                    AND b_r.doc_date BETWEEN $4 AND $5
                    AND b_r.id_spravochnik_organization = $6
            )
            SELECT SUM(total_count)::INTEGER AS total
            FROM (
                SELECT total_count FROM bank_prixod_count
                UNION ALL
                SELECT total_count FROM bajarilgan_ishlar_jur3_count
                UNION ALL
                SELECT total_count FROM kursatilgan_hizmatlar_jur152_count
                UNION ALL
                SELECT total_count FROM bank_rasxod_count
            ) AS total_count        
        `;
        const result = await db.query(query, params);
        return result[0].total
    }

    static async getByOrganIdSumma(params, operator) {
        const query = `--sql
            WITH 
            kursatilgan_hizmatlar_sum AS (
                SELECT COALESCE(SUM(k_h_j152_ch.summa), 0)::FLOAT AS summa
                FROM kursatilgan_hizmatlar_jur152_child AS k_h_j152_ch
                JOIN kursatilgan_hizmatlar_jur152 AS k_h_j152 ON k_h_j152.id = k_h_j152_ch.kursatilgan_hizmatlar_jur152_id
                JOIN spravochnik_operatsii AS s_o_p ON s_o_p.id = k_h_j152.spravochnik_operatsii_own_id
                JOIN users AS u ON k_h_j152.user_id = u.id
                JOIN regions AS r ON r.id = u.region_id
                WHERE k_h_j152.isdeleted = false
                  AND r.id = $1
                  AND k_h_j152.main_schet_id = $2
                  AND s_o_p.schet = $3
                  AND k_h_j152.doc_date ${operator} $4
                  AND k_h_j152.id_spravochnik_organization = $5
            ),
            bajarilgan_ishlar_sum AS (
                SELECT COALESCE(SUM(b_i_j3_ch.summa), 0)::FLOAT AS summa
                FROM bajarilgan_ishlar_jur3_child AS b_i_j3_ch
                JOIN bajarilgan_ishlar_jur3 AS b_i_j3 ON b_i_j3.id = b_i_j3_ch.bajarilgan_ishlar_jur3_id 
                JOIN spravochnik_operatsii AS s_o_p ON s_o_p.id = b_i_j3.spravochnik_operatsii_own_id
                JOIN users AS u ON b_i_j3.user_id = u.id
                JOIN regions AS r ON r.id = u.region_id
                WHERE b_i_j3.isdeleted = false
                  AND r.id = $1
                  AND b_i_j3.main_schet_id = $2
                  AND s_o_p.schet = $3
                  AND b_i_j3.doc_date ${operator} $4
                  AND b_i_j3.id_spravochnik_organization = $5
            ),
            bank_rasxod_sum AS (
                SELECT COALESCE(SUM(b_r_ch.summa), 0)::FLOAT AS summa
                FROM bank_rasxod_child b_r_ch
                JOIN bank_rasxod AS b_r ON b_r_ch.id_bank_rasxod = b_r.id
                JOIN spravochnik_operatsii AS s_op ON s_op.id = b_r_ch.spravochnik_operatsii_id
                JOIN users AS u ON u.id = b_r.user_id
                JOIN regions AS r ON r.id = u.region_id
                WHERE b_r.isdeleted = false
                  AND r.id = $1
                  AND b_r.main_schet_id = $2
                  AND s_op.schet = $3
                  AND b_r.doc_date ${operator} $4
                  AND b_r.id_spravochnik_organization = $5
            ),
            bank_prixod_sum AS (
                SELECT COALESCE(SUM(b_p_ch.summa), 0)::FLOAT AS summa
                FROM bank_prixod_child AS b_p_ch
                JOIN bank_prixod AS b_p ON b_p_ch.id_bank_prixod = b_p.id
                JOIN spravochnik_operatsii AS s_op ON s_op.id = b_p_ch.spravochnik_operatsii_id
                JOIN users AS u ON u.id = b_p.user_id
                JOIN regions AS r ON r.id = u.region_id
                WHERE b_p.isdeleted = false
                  AND r.id = $1
                  AND b_p.main_schet_id = $2
                  AND s_op.schet = $3
                  AND b_p.doc_date ${operator} $4
                  AND b_p.id_spravochnik_organization = $5
            )
            SELECT 
                (
                    (kursatilgan_hizmatlar_sum.summa + bank_rasxod_sum.summa) 
                    - (bajarilgan_ishlar_sum.summa + bank_prixod_sum.summa)
                ) AS summa
            FROM kursatilgan_hizmatlar_sum, bajarilgan_ishlar_sum, bank_rasxod_sum, bank_prixod_sum
        `;
        const result = await db.query(query, params);
        return result[0].summa;
    }
}