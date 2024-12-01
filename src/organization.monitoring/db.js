const { db } = require('../db/index');
const { sqlFilter } = require('../helper/functions')

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

    static async getByContractIdData(params, contract_id) {
        let index_contract_id;
        if (contract_id) {
            index_contract_id = params.length + 1
            params.push(contract_id)
        }
        const query = `--sql
            SELECT 
                data.id,
                data.shartnoma_id,
                data.doc_num,
                data.doc_date,
                data.opisanie,
                data.summa_rasxod::FLOAT,
                data.summa_prixod::FLOAT,
                data.type,
                data.id_spravochnik_organization,
                data.isdeleted
            FROM (
                SELECT 
                    b_r.id,
                    b_r.id_shartnomalar_organization AS shartnoma_id,
                    b_r.doc_num,
                    b_r.doc_date,
                    b_r.opisanie,
                    0 AS summa_rasxod, 
                    b_r.summa AS summa_prixod,
                    'bank_rasxod' AS type,
                    b_r.id_spravochnik_organization,
                    b_r.isdeleted
                FROM bank_rasxod b_r
    
                UNION ALL 
    
                SELECT 
                    b_i_j3.id,
                    b_i_j3.shartnomalar_organization_id AS shartnoma_id,
                    b_i_j3.doc_num,
                    b_i_j3.doc_date,
                    b_i_j3.opisanie,
                    b_i_j3.summa AS summa_rasxod,  
                    0 AS summa_prixod,
                    'bajarilgan_ishlar_jur3' AS type,
                    b_i_j3.id_spravochnik_organization,
                    b_i_j3.isdeleted
                FROM bajarilgan_ishlar_jur3 AS b_i_j3
    
                UNION ALL 
    
                SELECT 
                    b_p.id,
                    b_p.id_shartnomalar_organization AS shartnoma_id,
                    b_p.doc_num,
                    b_p.doc_date,
                    b_p.opisanie,
                    b_p.summa AS summa_rasxod, 
                    0 AS summa_prixod,
                    'bank_prixod' AS type,
                    b_p.id_spravochnik_organization,
                    b_p.isdeleted
                FROM bank_prixod AS b_p 
    
                UNION ALL
    
                SELECT 
                    k_h.id,
                    k_h.shartnomalar_organization_id AS shartnoma_id,
                    k_h.doc_num,
                    k_h.doc_date,
                    k_h.opisanie,
                    0 AS summa_rasxod, 
                    k_h.summa AS summa_prixod,
                    'kursatilgan_hizmatlar_jur152' AS type,
                    k_h.id_spravochnik_organization,
                    k_h.isdeleted
                FROM kursatilgan_hizmatlar_jur152 AS k_h
            ) AS data
            WHERE data.doc_date BETWEEN $1 AND $2 
                AND data.isdeleted = false
                AND data.id_spravochnik_organization = $3
                ${contract_id ? sqlFilter('data.shartnoma_id', index_contract_id) : 'AND data.shartnoma_id IS NOT NULL'}
            ORDER BY data.doc_date
        `;
        const data = await db.query(query, params);
        return data;
    }

    static async getByContractIdSumma(params, operator, contract_id) {
        let index_contract_id;
        if (contract_id) {
            index_contract_id = params.length + 1;
            params.push(contract_id);
        }
        const query = `--sql
            WITH 
                kursatilgan_hizmatlar AS (
                    SELECT COALESCE(SUM(k_h_j152.summa), 0) AS summa
                    FROM kursatilgan_hizmatlar_jur152 AS k_h_j152
                    WHERE k_h_j152.isdeleted = false
                    AND k_h_j152.doc_date ${operator} $1
                    AND k_h_j152.id_spravochnik_organization = $2
                    ${contract_id ? sqlFilter('k_h_j152.shartnomalar_organization_id', index_contract_id) : 'AND k_h_j152.shartnomalar_organization_id IS NOT NULL'}
                ),
                bank_rasxod AS (
                    SELECT COALESCE(SUM(b_r.summa), 0) AS summa
                    FROM bank_rasxod AS b_r
                    JOIN shartnomalar_organization AS sh_o ON sh_o.id = b_r.id_shartnomalar_organization
                    WHERE b_r.isdeleted = false
                    AND b_r.doc_date ${operator} $1
                    AND b_r.id_spravochnik_organization = $2
                    ${contract_id ? sqlFilter('b_r.id_shartnomalar_organization', index_contract_id) : 'AND b_r.id_shartnomalar_organization IS NOT NULL'}
                ),
                bajarilgan_ishlar AS (
                    SELECT COALESCE(SUM(b_i_j152.summa), 0) AS summa
                    FROM bajarilgan_ishlar_jur3 AS b_i_j152
                    JOIN shartnomalar_organization AS sh_o ON sh_o.id = b_i_j152.shartnomalar_organization_id
                    WHERE b_i_j152.isdeleted = false
                    AND b_i_j152.doc_date ${operator} $1
                    AND b_i_j152.id_spravochnik_organization = $2
                    ${contract_id ? sqlFilter('b_i_j152.shartnomalar_organization_id', index_contract_id) : 'AND b_i_j152.shartnomalar_organization_id IS NOT NULL'}
                ),
                bank_prixod AS (
                    SELECT COALESCE(SUM(b_p.summa), 0) AS summa
                    FROM bank_prixod AS b_p
                    JOIN shartnomalar_organization AS sh_o ON sh_o.id = b_p.id_shartnomalar_organization
                    WHERE b_p.isdeleted = false
                    AND b_p.doc_date ${operator} $1
                    AND b_p.id_spravochnik_organization = $2
                    ${contract_id ? sqlFilter('b_p.id_shartnomalar_organization', index_contract_id) : 'AND b_p.id_shartnomalar_organization IS NOT NULL'}
                )
            SELECT 
                (k.summa + r.summa) - (i.summa + p.summa) ::FLOAT AS summa
            FROM 
                kursatilgan_hizmatlar k,
                bank_rasxod r,
                bajarilgan_ishlar i,
                bank_prixod p;
        `;
        const result = await db.query(query, params);
        return result[0].summa;
    }

    static async getPrixodRasxod(params) {
        const query = `--sql
            WITH 
                kursatilgan_hizmatlar_sum AS (
                    SELECT COALESCE(SUM(k_h_j152_ch.summa), 0)::FLOAT AS summa
                    FROM kursatilgan_hizmatlar_jur152_child AS k_h_j152_ch
                    JOIN kursatilgan_hizmatlar_jur152 AS k_h_j152 ON k_h_j152.id = k_h_j152_ch.kursatilgan_hizmatlar_jur152_id 
                    JOIN spravochnik_operatsii AS s_op ON s_op.id = k_h_j152.spravochnik_operatsii_own_id
                    JOIN main_schet AS m_sch ON  m_sch.id = k_h_j152.main_schet_id
                    WHERE k_h_j152.isdeleted = false
                      AND s_op.schet = $1
                      AND k_h_j152.doc_date <= $2
                      AND k_h_j152.id_spravochnik_organization = $3
                      AND m_sch.spravochnik_budjet_name_id = $4
                ),
                bajarilgan_ishlar_sum AS (
                    SELECT COALESCE(SUM(b_i_j3.summa), 0)::FLOAT AS summa
                    FROM bajarilgan_ishlar_jur3_child AS b_i_j3_ch
                    JOIN bajarilgan_ishlar_jur3 AS b_i_j3 ON b_i_j3.id = b_i_j3_ch.bajarilgan_ishlar_jur3_id 
                    JOIN spravochnik_organization AS s_o ON s_o.id = b_i_j3.id_spravochnik_organization
                    JOIN spravochnik_operatsii AS s_op ON s_op.id = b_i_j3.spravochnik_operatsii_own_id
                    JOIN main_schet AS m_sch ON  m_sch.id = b_i_j3.main_schet_id
                    WHERE b_i_j3.isdeleted = false
                      AND s_op.schet = $1
                      AND b_i_j3.doc_date <= $2
                      AND b_i_j3.id_spravochnik_organization = $3
                      AND m_sch.spravochnik_budjet_name_id = $4
                      ),
                bank_rasxod AS (
                    SELECT COALESCE(SUM(b_r_ch.summa), 0)::FLOAT AS summa
                    FROM bank_rasxod_child AS b_r_ch
                    JOIN bank_rasxod AS b_r ON b_r_ch.id_bank_rasxod = b_r.id
                    JOIN spravochnik_organization AS s_o ON s_o.id = b_r.id_spravochnik_organization
                    JOIN spravochnik_operatsii AS s_o_p ON s_o_p.id = b_r_ch.spravochnik_operatsii_id
                    JOIN main_schet AS m_sch ON  m_sch.id = b_r.main_schet_id
                    WHERE b_r.isdeleted = false
                      AND s_o_p.schet = $1
                      AND b_r.doc_date <= $2
                      AND b_r.id_spravochnik_organization = $3
                      AND m_sch.spravochnik_budjet_name_id = $4
                ),
                bank_prixod AS (
                    SELECT COALESCE( SUM(b_p_ch.summa), 0)::FLOAT AS summa
                    FROM bank_prixod_child AS b_p_ch
                    JOIN bank_prixod AS b_p ON b_p_ch.id_bank_prixod = b_p.id
                    JOIN spravochnik_organization AS s_o ON s_o.id = b_p.id_spravochnik_organization
                    JOIN spravochnik_operatsii AS s_o_p ON s_o_p.id = b_p_ch.spravochnik_operatsii_id
                    JOIN main_schet AS m_sch ON  m_sch.id = b_p.main_schet_id
                    WHERE b_p.isdeleted = false
                      AND s_o_p.schet = $1
                      AND b_p.doc_date <= $2
                      AND b_p.id_spravochnik_organization = $3
                      AND m_sch.spravochnik_budjet_name_id = $4
                )
                SELECT 
                    (
                        (kursatilgan_hizmatlar_sum.summa + bank_rasxod.summa) 
                        - (bajarilgan_ishlar_sum.summa + bank_prixod.summa)
                    ) AS summa
                FROM kursatilgan_hizmatlar_sum, bajarilgan_ishlar_sum, bank_rasxod, bank_prixod
        `;
        const data = await db.query(query, params)
        return data[0].summa;
    }
}