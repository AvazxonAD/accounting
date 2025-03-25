const { db } = require("@db/index");
const { sqlFilter } = require("@helper/functions");

exports.OrganizationMonitoringDB = class {
  static async monitoring(params, organ_id, search) {
    let organ_filter = "";
    let search_filter = ``;

    if (organ_id) {
      params.push(organ_id);
      organ_filter = `AND so.id = $${params.length}`;
    }

    if (search) {
      params.push(search);
      search_filter = `AND (
                d.doc_num = $${params.length} OR 
                so.name ILIKE '%' || $${params.length} || '%' OR 
                so.inn ILIKE '%' || $${params.length} || '%'
            )`;
    }

    const query = `--sql
            SELECT
                d.id,
                d.doc_num,
                TO_CHAR(d.doc_date, 'YYYY-MM-DD') AS doc_date,
                d.opisanie,
                0::FLOAT AS summa_rasxod, 
                ch.summa::FLOAT AS summa_prixod,
                sh_o.id AS shartnoma_id,
                sh_o.doc_num AS shartnoma_doc_num,
                TO_CHAR(sh_o.doc_date, 'YYYY-MM-DD') AS shartnoma_doc_date,
                s.smeta_number,
                so.id AS organ_id,
                so.name AS organ_name,
                so.inn AS organ_inn,
                u.id AS user_id,
                u.login,
                u.fio,
                op.schet AS provodki_schet, 
                op.sub_schet AS provodki_sub_schet,
                'bank_rasxod' AS type
            FROM bank_rasxod_child ch
            JOIN bank_rasxod AS d ON ch.id_bank_rasxod = d.id
            JOIN users AS u ON u.id = d.user_id
            JOIN regions AS r ON r.id = u.region_id 
            LEFT JOIN shartnomalar_organization AS sh_o ON sh_o.id = d.id_shartnomalar_organization
            LEFT JOIN smeta AS s ON sh_o.smeta_id = s.id 
            JOIN spravochnik_organization AS so ON so.id = d.id_spravochnik_organization
            JOIN spravochnik_operatsii AS op ON op.id = ch.spravochnik_operatsii_id
            WHERE d.isdeleted = false
                AND r.id = $1 
                AND d.main_schet_id = $2
                AND op.schet = $3
                AND d.doc_date BETWEEN $4 AND $5
                AND ch.isdeleted = false
                ${organ_filter}
                ${search_filter}

            UNION ALL 

            SELECT
                d.id,
                d.doc_num,
                TO_CHAR(d.doc_date, 'YYYY-MM-DD') AS doc_date,
                d.opisanie,
                0::FLOAT AS summa_rasxod, 
                ch.summa::FLOAT AS summa_prixod,
                sh_o.id AS shartnoma_id,
                sh_o.doc_num AS shartnoma_doc_num,
                TO_CHAR(sh_o.doc_date, 'YYYY-MM-DD') AS shartnoma_doc_date,
                s.smeta_number,
                so.id AS organ_id,
                so.name AS organ_name,
                so.inn AS organ_inn,
                u.id AS user_id,
                u.login,
                u.fio,
                op.schet AS provodki_schet, 
                op.sub_schet AS provodki_sub_schet,
                'organ_saldo_prixod' AS type
            FROM organ_saldo_child ch
            JOIN organ_saldo AS d ON ch.parent_id = d.id
            JOIN users AS u ON u.id = d.user_id
            JOIN regions AS r ON r.id = u.region_id 
            LEFT JOIN shartnomalar_organization AS sh_o ON sh_o.id = d.contract_id
            LEFT JOIN smeta AS s ON sh_o.smeta_id = s.id 
            JOIN spravochnik_organization AS so ON so.id = d.organ_id
            JOIN spravochnik_operatsii AS op ON op.id = ch.operatsii_id
            WHERE d.isdeleted = false
                AND d.prixod = true
                AND r.id = $1 
                AND d.main_schet_id = $2
                AND op.schet = $3
                AND d.doc_date BETWEEN $4 AND $5
                AND ch.isdeleted = false
                ${organ_filter}
                ${search_filter}

            UNION ALL 
            
            SELECT
                d.id,
                d.doc_num,
                TO_CHAR(d.doc_date, 'YYYY-MM-DD') AS doc_date,
                d.opisanie,
                0::FLOAT AS summa_prixod, 
                ch.summa::FLOAT AS summa_rasxod,
                sh_o.id AS shartnoma_id,
                sh_o.doc_num AS shartnoma_doc_num,
                TO_CHAR(sh_o.doc_date, 'YYYY-MM-DD') AS shartnoma_doc_date,
                s.smeta_number,
                so.id AS organ_id,
                so.name AS organ_name,
                so.inn AS organ_inn,
                u.id AS user_id,
                u.login,
                u.fio,
                op.schet AS provodki_schet, 
                op.sub_schet AS provodki_sub_schet,
                'organ_saldo_rasxod' AS type
            FROM organ_saldo_child ch
            JOIN organ_saldo AS d ON ch.parent_id = d.id
            JOIN users AS u ON u.id = d.user_id
            JOIN regions AS r ON r.id = u.region_id 
            LEFT JOIN shartnomalar_organization AS sh_o ON sh_o.id = d.contract_id
            LEFT JOIN smeta AS s ON sh_o.smeta_id = s.id 
            JOIN spravochnik_organization AS so ON so.id = d.organ_id
            JOIN spravochnik_operatsii AS op ON op.id = ch.operatsii_id
            WHERE d.isdeleted = false
                AND d.rasxod = true
                AND r.id = $1 
                AND d.main_schet_id = $2
                AND op.schet = $3
                AND d.doc_date BETWEEN $4 AND $5
                AND ch.isdeleted = false
                ${organ_filter}
                ${search_filter}
            
            UNION ALL
        
            SELECT 
                d.id,
                d.doc_num,
                TO_CHAR(d.doc_date, 'YYYY-MM-DD') AS doc_date,
                d.opisanie,
                ch.summa::FLOAT AS summa_rasxod, 
                0::FLOAT AS summa_prixod,
                sh_o.id AS shartnoma_id,
                sh_o.doc_num AS shartnoma_doc_num,
                TO_CHAR(sh_o.doc_date, 'YYYY-MM-DD') AS shartnoma_doc_date,
                s.smeta_number,
                so.id AS organ_id,
                so.name AS organ_name,
                so.inn AS organ_inn,
                u.id AS user_id,
                u.login,
                u.fio,
                op.schet AS provodki_schet, 
                op.sub_schet AS provodki_sub_schet,
                'akt' AS type
            FROM bajarilgan_ishlar_jur3_child AS ch
            JOIN bajarilgan_ishlar_jur3 AS d ON d.id = ch.bajarilgan_ishlar_jur3_id
            JOIN users AS u ON d.user_id = u.id
            JOIN regions AS r ON r.id = u.region_id
            LEFT JOIN shartnomalar_organization AS sh_o ON sh_o.id = d.shartnomalar_organization_id
            LEFT JOIN smeta AS s ON sh_o.smeta_id = s.id 
            JOIN spravochnik_organization AS so ON so.id = d.id_spravochnik_organization
            JOIN spravochnik_operatsii AS own ON own.id = d.spravochnik_operatsii_own_id
            JOIN spravochnik_operatsii AS op ON op.id = ch.spravochnik_operatsii_id
            WHERE d.isdeleted = false 
                AND r.id = $1
                AND d.main_schet_id = $2
                AND own.schet = $3
                AND d.doc_date BETWEEN $4 AND $5
                AND ch.isdeleted = false
                ${organ_filter}
                ${search_filter}    
            
            UNION ALL
        
            SELECT 
                d.id,
                d.doc_num,
                TO_CHAR(d.doc_date, 'YYYY-MM-DD') AS doc_date,
                d.opisanie,
                0::FLOAT AS summa_rasxod, 
                ch.summa::FLOAT AS summa_prixod,
                sh_o.id AS shartnoma_id,
                sh_o.doc_num AS shartnoma_doc_num,
                TO_CHAR(sh_o.doc_date, 'YYYY-MM-DD') AS shartnoma_doc_date,
                s.smeta_number,
                so.id AS organ_id,
                so.name AS organ_name,
                so.inn AS organ_inn,
                u.id AS user_id,
                u.login,
                u.fio,
                op.schet AS provodki_schet, 
                op.sub_schet AS provodki_sub_schet,
                'show_service' AS type
            FROM kursatilgan_hizmatlar_jur152_child AS ch
            JOIN kursatilgan_hizmatlar_jur152 AS d ON d.id = ch.kursatilgan_hizmatlar_jur152_id 
            JOIN users AS u ON d.user_id = u.id
            JOIN regions AS r ON r.id = u.region_id
            LEFT JOIN shartnomalar_organization AS sh_o ON sh_o.id = d.shartnomalar_organization_id
            LEFT JOIN smeta AS s ON sh_o.smeta_id = s.id 
            JOIN spravochnik_organization AS so ON so.id = d.id_spravochnik_organization
            JOIN spravochnik_operatsii AS own ON own.id = d.spravochnik_operatsii_own_id
            JOIN spravochnik_operatsii AS op ON op.id = ch.spravochnik_operatsii_id
            WHERE d.isdeleted = false 
                AND r.id = $1
                AND d.main_schet_id = $2
                AND own.schet = $3
                AND d.doc_date BETWEEN $4 AND $5
                AND ch.isdeleted = false
                ${organ_filter}
                ${search_filter}     
            
            UNION ALL
        
            SELECT 
                d.id,
                d.doc_num,
                TO_CHAR(d.doc_date, 'YYYY-MM-DD') AS doc_date,
                d.opisanie,
                ch.summa::FLOAT AS summa_rasxod,
                0::FLOAT AS summa_prixod, 
                sh_o.id AS shartnoma_id,
                sh_o.doc_num AS shartnoma_doc_num,
                TO_CHAR(sh_o.doc_date, 'YYYY-MM-DD') AS shartnoma_doc_date,
                s.smeta_number,
                so.id AS organ_id,
                so.name AS organ_name,
                so.inn AS organ_inn,
                u.id AS user_id,
                u.login,
                u.fio,
                op.schet AS provodki_schet, 
                op.sub_schet AS provodki_sub_schet,
                'bank_prixod' AS type
            FROM bank_prixod_child ch
            JOIN bank_prixod AS d ON ch.id_bank_prixod = d.id
            JOIN users AS u ON u.id = d.user_id
            JOIN regions AS r ON r.id = u.region_id 
            LEFT JOIN shartnomalar_organization AS sh_o ON sh_o.id = d.id_shartnomalar_organization
            LEFT JOIN smeta AS s ON sh_o.smeta_id = s.id
            JOIN spravochnik_organization AS so ON so.id = d.id_spravochnik_organization
            JOIN spravochnik_operatsii AS op ON op.id = ch.spravochnik_operatsii_id
            WHERE d.isdeleted = false
                AND r.id = $1 
                AND d.main_schet_id = $2
                AND op.schet = $3
                AND d.doc_date BETWEEN $4 AND $5
                AND ch.isdeleted = false
                ${organ_filter}
                ${search_filter}    
            
            UNION ALL 
        
            SELECT 
                d.id,
                d.doc_num,
                TO_CHAR(d.doc_date, 'YYYY-MM-DD') AS doc_date,
                d.opisanie,
                ch.summa::FLOAT AS summa_rasxod,
                0::FLOAT AS summa_prixod, 
                sh_o.id AS shartnoma_id,
                sh_o.doc_num AS shartnoma_doc_num,
                TO_CHAR(sh_o.doc_date, 'YYYY-MM-DD') AS shartnoma_doc_date,
                s.smeta_number,
                so.id AS organ_id,
                so.name AS organ_name,
                so.inn AS organ_inn,
                u.id AS user_id,
                u.login,
                u.fio,
                ch.kredit_schet AS provodki_schet, 
                ch.kredit_sub_schet AS provodki_sub_schet,
                'jur7_prixod' AS type
            FROM document_prixod_jur7_child AS ch
            JOIN document_prixod_jur7 AS d ON ch.document_prixod_jur7_id = d.id
            JOIN users AS u ON u.id = d.user_id
            JOIN regions AS r ON r.id = u.region_id 
            LEFT JOIN shartnomalar_organization AS sh_o ON sh_o.id = d.id_shartnomalar_organization
            LEFT JOIN smeta AS s ON sh_o.smeta_id = s.id
            JOIN spravochnik_organization AS so ON so.id = d.kimdan_id
            WHERE d.isdeleted = false
                AND r.id = $1 
                AND d.main_schet_id = $2
                AND ch.kredit_schet = $3
                AND d.doc_date BETWEEN $4 AND $5
                AND ch.isdeleted = false
                ${organ_filter}
                ${search_filter}    
            
            ORDER BY doc_date 

            OFFSET $6 LIMIT $7
        `;

    const data = await db.query(query, params);

    return data;
  }

  static async getTotal(params, organ_id, search) {
    let organ_filter = "";
    let search_filter = ``;

    if (organ_id) {
      params.push(organ_id);
      organ_filter = `AND so.id = $${params.length}`;
    }

    if (search) {
      params.push(search);
      search_filter = `AND (
                d.doc_num = $${params.length} OR 
                so.name ILIKE '%' || $${params.length} || '%' OR 
                so.inn ILIKE '%' || $${params.length} || '%'
            )`;
    }

    const query = `--sql
            WITH bank_prixod_count AS (
                SELECT COALESCE(COUNT(*)::INTEGER, 0) AS total_count
                FROM bank_prixod_child ch
                JOIN bank_prixod AS d ON ch.id_bank_prixod = d.id
                JOIN spravochnik_operatsii AS op ON op.id = ch.spravochnik_operatsii_id
                JOIN users AS u ON u.id = d.user_id
                JOIN regions AS r ON r.id = u.region_id 
                JOIN spravochnik_organization AS so ON so.id = d.id_spravochnik_organization
                WHERE d.isdeleted = false
                    AND r.id = $1 
                    AND d.main_schet_id = $2
                    AND op.schet = $3
                    AND d.doc_date BETWEEN $4 AND $5
                    AND ch.isdeleted = false
                    ${search_filter}
            ),
            bajarilgan_ishlar_jur3_count AS (
                SELECT COALESCE(COUNT(*)::INTEGER, 0) AS total_count
                FROM bajarilgan_ishlar_jur3_child AS ch
                JOIN bajarilgan_ishlar_jur3 AS d ON d.id = ch.bajarilgan_ishlar_jur3_id 
                JOIN spravochnik_operatsii AS own ON own.id = d.spravochnik_operatsii_own_id
                JOIN users AS u ON d.user_id = u.id
                JOIN regions AS r ON r.id = u.region_id
                JOIN spravochnik_organization AS so ON so.id = d.id_spravochnik_organization
                WHERE d.isdeleted = false 
                    AND r.id = $1
                    AND d.main_schet_id = $2
                    AND own.schet = $3
                    AND d.doc_date BETWEEN $4 AND $5
                    AND ch.isdeleted = false
                    ${organ_filter}
                    ${search_filter}
            ),
            kursatilgan_hizmatlar_jur152_count AS (
                SELECT COALESCE(COUNT(*)::INTEGER, 0) AS total_count
                FROM kursatilgan_hizmatlar_jur152_child AS ch
                JOIN kursatilgan_hizmatlar_jur152 AS d ON d.id = ch.kursatilgan_hizmatlar_jur152_id 
                JOIN spravochnik_operatsii AS own ON own.id = d.spravochnik_operatsii_own_id
                JOIN users AS u ON d.user_id = u.id
                JOIN regions AS r ON r.id = u.region_id
                JOIN spravochnik_organization AS so ON so.id = d.id_spravochnik_organization
                WHERE d.isdeleted = false 
                    AND r.id = $1
                    AND d.main_schet_id = $2
                    AND own.schet = $3
                    AND d.doc_date BETWEEN $4 AND $5
                    AND ch.isdeleted = false
                    ${organ_filter}
            ),
            bank_rasxod_count AS (
                SELECT COALESCE(COUNT(*)::INTEGER, 0) AS total_count
                FROM bank_rasxod_child ch
                JOIN bank_rasxod AS d ON ch.id_bank_rasxod = d.id
                JOIN spravochnik_operatsii AS op ON op.id = ch.spravochnik_operatsii_id
                JOIN users AS u ON u.id = d.user_id
                JOIN regions AS r ON r.id = u.region_id \
                JOIN spravochnik_organization AS so ON so.id = d.id_spravochnik_organization
                WHERE d.isdeleted = false
                    AND r.id = $1 
                    AND d.main_schet_id = $2
                    AND op.schet = $3
                    AND d.doc_date BETWEEN $4 AND $5
                    AND ch.isdeleted = false
                    ${organ_filter}
            ),
            jur7_prixod_count AS (
                SELECT COALESCE(COUNT(ch.id), 0)::INTEGER AS total_count
                FROM document_prixod_jur7_child ch
                JOIN document_prixod_jur7 AS d ON ch.document_prixod_jur7_id = d.id
                JOIN users AS u ON u.id = d.user_id
                JOIN regions AS r ON r.id = u.region_id
                JOIN spravochnik_organization AS so ON so.id = d.kimdan_id
                WHERE d.isdeleted = false
                    AND r.id = $1
                    AND d.main_schet_id = $2
                    AND ch.kredit_schet = $3
                    AND d.doc_date BETWEEN $4 AND $5
                    AND ch.isdeleted = false
                    ${organ_filter}
            ),

            organ_saldo AS (
                SELECT COALESCE(COUNT(ch.id), 0)::INTEGER AS total_count
                FROM organ_saldo_child ch
                JOIN organ_saldo AS d ON ch.parent_id = d.id
                JOIN spravochnik_operatsii AS op ON op.id = ch.operatsii_id
                JOIN users AS u ON u.id = d.user_id
                JOIN regions AS r ON r.id = u.region_id
                JOIN spravochnik_organization AS so ON so.id = d.organ_id
                WHERE d.isdeleted = false
                    AND r.id = $1
                    AND d.main_schet_id = $2
                    AND op.schet = $3
                    AND d.doc_date BETWEEN $4 AND $5
                    AND ch.isdeleted = false
                    ${organ_filter}
                    ${search_filter}
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
                UNION ALL 
                SELECT total_count FROM jur7_prixod_count
                UNION ALL 
                SELECT total_count FROM organ_saldo
            ) AS total_count        
        `;
    const result = await db.query(query, params);
    return result[0].total;
  }

  static async getSumma(params, date, dates, organ_id, search) {
    let organ_filter = "";
    let search_filter = ``;
    let date_filter = ``;

    if (organ_id) {
      params.push(organ_id);
      organ_filter = `AND so.id = $${params.length}`;
    }

    if (search) {
      params.push(search);
      search_filter = `AND (
                d.doc_num = $${params.length} OR 
                so.name ILIKE '%' || $${params.length} || '%' OR 
                so.inn ILIKE '%' || $${params.length} || '%'
            )`;
    }

    if (date) {
      params.push(date.date);
      date_filter = `AND d.doc_date ${date.operator} $${params.length}`;
    }

    if (dates) {
      params.push(dates[0], dates[1]);
      date_filter = `AND d.doc_date BETWEEN $${params.length - 1} AND $${params.length}`;
    }

    const query = `--sql
            WITH 
            kursatilgan_hizmatlar_sum AS (
                SELECT COALESCE(SUM(ch.summa), 0)::FLOAT AS summa
                FROM kursatilgan_hizmatlar_jur152_child AS ch
                JOIN kursatilgan_hizmatlar_jur152 AS d ON d.id = ch.kursatilgan_hizmatlar_jur152_id
                JOIN spravochnik_operatsii AS own ON own.id = d.spravochnik_operatsii_own_id
                JOIN users AS u ON d.user_id = u.id
                JOIN regions AS r ON r.id = u.region_id
                JOIN spravochnik_organization AS so ON so.id = d.id_spravochnik_organization
                WHERE d.isdeleted = false
                    AND r.id = $1
                    AND d.main_schet_id = $2
                    AND own.schet = $3
                    ${date_filter}
                    AND ch.isdeleted = false
                    ${organ_filter}
                    ${search_filter}
            ),
            bajarilgan_ishlar_sum AS (
                SELECT COALESCE(SUM(ch.summa), 0)::FLOAT AS summa
                FROM bajarilgan_ishlar_jur3_child AS ch
                JOIN bajarilgan_ishlar_jur3 AS d ON d.id = ch.bajarilgan_ishlar_jur3_id 
                JOIN spravochnik_operatsii AS own ON own.id = d.spravochnik_operatsii_own_id
                JOIN users AS u ON d.user_id = u.id
                JOIN regions AS r ON r.id = u.region_id
                JOIN spravochnik_organization AS so ON so.id = d.id_spravochnik_organization
                WHERE d.isdeleted = false
                    AND r.id = $1
                    AND d.main_schet_id = $2
                    AND own.schet = $3
                    ${date_filter}
                    AND ch.isdeleted = false
                    ${organ_filter}
                    ${search_filter}
            ),
            bank_rasxod_sum AS (
                SELECT COALESCE(SUM(ch.summa), 0)::FLOAT AS summa
                FROM bank_rasxod_child ch
                JOIN bank_rasxod AS d ON ch.id_bank_rasxod = d.id
                JOIN spravochnik_operatsii AS op ON op.id = ch.spravochnik_operatsii_id
                JOIN users AS u ON u.id = d.user_id
                JOIN regions AS r ON r.id = u.region_id
                JOIN spravochnik_organization AS so ON so.id = d.id_spravochnik_organization
                WHERE d.isdeleted = false
                    AND r.id = $1
                    AND d.main_schet_id = $2
                    AND op.schet = $3
                    ${date_filter}
                    AND ch.isdeleted = false
                    ${organ_filter}
                    ${search_filter}
            ),
            
            organ_saldo_rasxod AS (
                SELECT COALESCE(SUM(ch.summa), 0)::FLOAT AS summa
                FROM organ_saldo_child ch
                JOIN organ_saldo AS d ON ch.parent_id = d.id
                JOIN spravochnik_operatsii AS op ON op.id = ch.operatsii_id
                JOIN users AS u ON u.id = d.user_id
                JOIN regions AS r ON r.id = u.region_id
                JOIN spravochnik_organization AS so ON so.id = d.organ_id
                WHERE d.isdeleted = false
                    AND d.rasxod = true
                    AND r.id = $1
                    AND d.main_schet_id = $2
                    AND op.schet = $3
                    ${date_filter}
                    AND ch.isdeleted = false
                    ${organ_filter}
                    ${search_filter}
            ),

            organ_saldo_prixod AS (
                SELECT COALESCE(SUM(ch.summa), 0)::FLOAT AS summa
                FROM organ_saldo_child ch
                JOIN organ_saldo AS d ON ch.parent_id = d.id
                JOIN spravochnik_operatsii AS op ON op.id = ch.operatsii_id
                JOIN users AS u ON u.id = d.user_id
                JOIN regions AS r ON r.id = u.region_id
                JOIN spravochnik_organization AS so ON so.id = d.organ_id
                WHERE d.isdeleted = false
                    AND d.prixod = true
                    AND r.id = $1
                    AND d.main_schet_id = $2
                    AND op.schet = $3
                    ${date_filter}
                    AND ch.isdeleted = false
                    ${organ_filter}
                    ${search_filter}
            ),
            
            bank_prixod_sum AS (
                SELECT COALESCE(SUM(ch.summa), 0)::FLOAT AS summa
                FROM bank_prixod_child AS ch
                JOIN bank_prixod AS d ON ch.id_bank_prixod = d.id
                JOIN spravochnik_operatsii AS op ON op.id = ch.spravochnik_operatsii_id
                JOIN users AS u ON u.id = d.user_id
                JOIN regions AS r ON r.id = u.region_id
                JOIN spravochnik_organization AS so ON so.id = d.id_spravochnik_organization
                WHERE d.isdeleted = false
                    AND r.id = $1
                    AND d.main_schet_id = $2
                    AND op.schet = $3
                    ${date_filter}
                    AND ch.isdeleted = false
                    ${organ_filter}
                    ${search_filter}
            ),
            jur7_prixod_sum AS (
                SELECT COALESCE(SUM(ch.summa), 0)::FLOAT AS summa
                FROM document_prixod_jur7_child ch
                JOIN document_prixod_jur7 AS d ON ch.document_prixod_jur7_id = d.id
                JOIN users AS u ON u.id = d.user_id
                JOIN regions AS r ON r.id = u.region_id
                JOIN spravochnik_organization AS so ON so.id = d.kimdan_id
                WHERE d.isdeleted = false
                    AND r.id = $1
                    AND d.main_schet_id = $2
                    AND ch.kredit_schet = $3
                    ${date_filter}
                    AND ch.isdeleted = false
                    ${organ_filter}
                    ${search_filter}
            )
            SELECT 
                (
                    (kursatilgan_hizmatlar_sum.summa + bank_rasxod_sum.summa + organ_saldo_prixod.summa) - 
                    (bajarilgan_ishlar_sum.summa + bank_prixod_sum.summa + jur7_prixod_sum.summa + organ_saldo_rasxod.summa)
                ) AS summa,
                ( kursatilgan_hizmatlar_sum.summa + bank_rasxod_sum.summa + organ_saldo_prixod.summa) AS prixod_sum,
                ( bajarilgan_ishlar_sum.summa + bank_prixod_sum.summa + jur7_prixod_sum.summa + organ_saldo_rasxod.summa) AS rasxod_sum,
                kursatilgan_hizmatlar_sum.summa AS kursatilgan_hizmatlar_sum_prixod,
                bank_rasxod_sum.summa AS bank_rasxod_sum_prixod,
                bajarilgan_ishlar_sum.summa AS bajarilgan_ishlar_sum_rasxod,
                bank_prixod_sum.summa AS bank_prixod_sum_rasxod,
                jur7_prixod_sum.summa AS jur7_prixod_sum_rasxod,
                organ_saldo_rasxod.summa AS organ_saldo_sum_rasxod,
                organ_saldo_prixod.summa AS organ_saldo_sum_prixod
            FROM kursatilgan_hizmatlar_sum, 
                bajarilgan_ishlar_sum, 
                bank_rasxod_sum, 
                bank_prixod_sum, 
                jur7_prixod_sum,
                organ_saldo_prixod,
                organ_saldo_rasxod
        `;

    const result = await db.query(query, params);

    return result[0];
  }

  static async getPrixodRasxod(params) {
    const query = `--sql
            WITH 
                kursatilgan_hizmatlar_sum AS (
                    SELECT COALESCE(SUM(ch.summa), 0)::FLOAT AS summa
                    FROM kursatilgan_hizmatlar_jur152_child AS ch
                    JOIN kursatilgan_hizmatlar_jur152 AS d ON d.id = ch.kursatilgan_hizmatlar_jur152_id 
                    JOIN spravochnik_operatsii AS op ON op.id = d.spravochnik_operatsii_own_id
                    JOIN main_schet AS m_sch ON  m_sch.id = d.main_schet_id
                    WHERE d.isdeleted = false
                      AND op.schet = $1
                      AND d.doc_date <= $2
                      AND d.id_spravochnik_organization = $3
                      AND m_sch.spravochnik_budjet_name_id = $4
                ),
                bajarilgan_ishlar_sum AS (
                    SELECT COALESCE(SUM(d.summa), 0)::FLOAT AS summa
                    FROM bajarilgan_ishlar_jur3_child AS ch
                    JOIN bajarilgan_ishlar_jur3 AS d ON d.id = ch.bajarilgan_ishlar_jur3_id 
                    JOIN spravochnik_organization AS so ON so.id = d.id_spravochnik_organization
                    JOIN spravochnik_operatsii AS op ON op.id = d.spravochnik_operatsii_own_id
                    JOIN main_schet AS m_sch ON  m_sch.id = d.main_schet_id
                    WHERE d.isdeleted = false
                      AND op.schet = $1
                      AND d.doc_date <= $2
                      AND d.id_spravochnik_organization = $3
                      AND m_sch.spravochnik_budjet_name_id = $4
                      ),
                bank_rasxod AS (
                    SELECT COALESCE(SUM(ch.summa), 0)::FLOAT AS summa
                    FROM bank_rasxod_child AS ch
                    JOIN bank_rasxod AS d ON ch.id_bank_rasxod = d.id
                    JOIN spravochnik_organization AS so ON so.id = d.id_spravochnik_organization
                    JOIN spravochnik_operatsii AS op ON op.id = ch.spravochnik_operatsii_id
                    JOIN main_schet AS m_sch ON  m_sch.id = d.main_schet_id
                    WHERE d.isdeleted = false
                      AND op.schet = $1
                      AND d.doc_date <= $2
                      AND d.id_spravochnik_organization = $3
                      AND m_sch.spravochnik_budjet_name_id = $4
                ),
                bank_prixod AS (
                    SELECT COALESCE( SUM(ch.summa), 0)::FLOAT AS summa
                    FROM bank_prixod_child AS ch
                    JOIN bank_prixod AS d ON ch.id_bank_prixod = d.id
                    JOIN spravochnik_organization AS so ON so.id = d.id_spravochnik_organization
                    JOIN spravochnik_operatsii AS op ON op.id = ch.spravochnik_operatsii_id
                    JOIN main_schet AS m_sch ON  m_sch.id = d.main_schet_id
                    WHERE d.isdeleted = false
                      AND op.schet = $1
                      AND d.doc_date <= $2
                      AND d.id_spravochnik_organization = $3
                      AND m_sch.spravochnik_budjet_name_id = $4
                ),
                jur7_prixod AS (
                    SELECT COALESCE(SUM(ch.summa), 0)::FLOAT AS summa
                    FROM document_prixod_jur7_child ch
                    JOIN document_prixod_jur7 AS d ON ch.document_prixod_jur7_id = d.id
                    JOIN main_schet AS m_sch ON m_sch.id = d.main_schet_id
                    WHERE d.isdeleted = false
                      AND ch.kredit_schet = $1
                      AND d.doc_date <= $2
                      AND d.kimdan_id = $3
                      AND m_sch.spravochnik_budjet_name_id = $4
                )
                SELECT 
                    (
                        (kursatilgan_hizmatlar_sum.summa + bank_rasxod.summa) 
                        - (bajarilgan_ishlar_sum.summa + bank_prixod.summa + jur7_prixod.summa)
                    ) AS summa,
                    (kursatilgan_hizmatlar_sum.summa + bank_rasxod.summa) AS prixod_sum,
                    (bajarilgan_ishlar_sum.summa + bank_prixod.summa + jur7_prixod.summa) AS rasxod_sum,
                    kursatilgan_hizmatlar_sum.summa AS kursatilgan_hizmatlar_sum,
                    bank_rasxod.summa AS bank_rasxod_sum,
                    bajarilgan_ishlar_sum.summa AS bajarilgan_ishlar_sum,
                    bank_prixod.summa AS bank_prixod_sum,
                    jur7_prixod.summa AS jur7_prixod_sum
                FROM kursatilgan_hizmatlar_sum, bajarilgan_ishlar_sum, bank_rasxod, bank_prixod, jur7_prixod
        `;
    const data = await db.query(query, params);
    return data[0];
  }

  static async capData(params) {
    const query = `--sql
            WITH
                kursatilgan_hizmatlar AS (
                    SELECT
                        COALESCE(SUM(ch.summa), 0)::FLOAT AS summa,
                        op.schet,
                        op.sub_schet
                    FROM kursatilgan_hizmatlar_jur152_child AS ch
                    JOIN kursatilgan_hizmatlar_jur152 AS d ON d.id = ch.kursatilgan_hizmatlar_jur152_id
                    JOIN spravochnik_operatsii AS own ON own.id = d.spravochnik_operatsii_own_id
                    JOIN spravochnik_operatsii AS op ON op.id = ch.spravochnik_operatsii_id
                    JOIN users AS u ON d.user_id = u.id
                    JOIN regions AS r ON r.id = u.region_id
                    JOIN spravochnik_organization AS so ON so.id = d.id_spravochnik_organization
                    WHERE d.isdeleted = false
                        AND ch.isdeleted = false
                        AND d.main_schet_id = $1
                        AND d.doc_date BETWEEN $2 AND $3
                        AND r.id = $4
                        AND own.schet = $5
                    GROUP BY op.schet,
                        op.sub_schet
                ),
                bajarilgan_ishlar AS (
                    SELECT 
                        COALESCE(SUM(ch.summa), 0)::FLOAT AS summa,
                        op.schet,
                        op.sub_schet
                    FROM bajarilgan_ishlar_jur3_child AS ch
                    JOIN bajarilgan_ishlar_jur3 AS d ON d.id = ch.bajarilgan_ishlar_jur3_id 
                    JOIN spravochnik_operatsii AS own ON own.id = d.spravochnik_operatsii_own_id
                    JOIN spravochnik_operatsii AS op ON op.id = ch.spravochnik_operatsii_id
                    JOIN users AS u ON d.user_id = u.id
                    JOIN regions AS r ON r.id = u.region_id
                    JOIN spravochnik_organization AS so ON so.id = d.id_spravochnik_organization
                    WHERE d.isdeleted = false
                        AND ch.isdeleted = false
                        AND d.main_schet_id = $1
                        AND d.doc_date BETWEEN $2 AND $3
                        AND r.id = $4
                        AND own.schet = $5
                    GROUP BY op.schet,
                        op.sub_schet
                ),
                bank_rasxod AS (
                    SELECT 
                        COALESCE(SUM(ch.summa), 0)::FLOAT AS summa,
                        op.schet,
                        op.sub_schet
                    FROM bank_rasxod_child ch
                    JOIN bank_rasxod AS d ON ch.id_bank_rasxod = d.id
                    JOIN spravochnik_operatsii AS op ON op.id = ch.spravochnik_operatsii_id
                    JOIN users AS u ON u.id = d.user_id
                    JOIN regions AS r ON r.id = u.region_id
                    JOIN spravochnik_organization AS so ON so.id = d.id_spravochnik_organization
                    WHERE d.isdeleted = false
                        AND ch.isdeleted = false
                        AND d.main_schet_id = $1
                        AND d.doc_date BETWEEN $2 AND $3
                        AND r.id = $4
                        AND op.schet = $5
                    GROUP BY op.schet,
                        op.sub_schet
                ),
                
                organ_saldo_rasxod AS (
                    SELECT 
                        COALESCE(SUM(ch.summa), 0)::FLOAT AS summa,
                        op.schet,
                        op.sub_schet
                    FROM organ_saldo_child ch
                    JOIN organ_saldo AS d ON ch.parent_id = d.id
                    JOIN spravochnik_operatsii AS op ON op.id = ch.operatsii_id
                    JOIN users AS u ON u.id = d.user_id
                    JOIN regions AS r ON r.id = u.region_id
                    JOIN spravochnik_organization AS so ON so.id = d.organ_id
                    WHERE d.isdeleted = false
                        AND d.rasxod = true
                        AND ch.isdeleted = false
                        AND d.main_schet_id = $1
                        AND d.doc_date BETWEEN $2 AND $3
                        AND r.id = $4
                        AND op.schet = $5
                    GROUP BY op.schet,
                        op.sub_schet
                ),

                organ_saldo_prixod AS (
                    SELECT 
                        COALESCE(SUM(ch.summa), 0)::FLOAT AS summa,
                        op.schet,
                        op.sub_schet
                    FROM organ_saldo_child ch
                    JOIN organ_saldo AS d ON ch.parent_id = d.id
                    JOIN spravochnik_operatsii AS op ON op.id = ch.operatsii_id
                    JOIN users AS u ON u.id = d.user_id
                    JOIN regions AS r ON r.id = u.region_id
                    JOIN spravochnik_organization AS so ON so.id = d.organ_id
                    WHERE d.isdeleted = false
                        AND d.prixod = true
                        AND ch.isdeleted = false
                        AND d.main_schet_id = $1
                        AND d.doc_date BETWEEN $2 AND $3
                        AND r.id = $4
                        AND op.schet = $5
                    GROUP BY op.schet,
                        op.sub_schet
                ),
                
                bank_prixod AS (
                    SELECT 
                        COALESCE(SUM(ch.summa), 0)::FLOAT AS summa,
                        op.schet,
                        op.sub_schet
                    FROM bank_prixod_child AS ch
                    JOIN bank_prixod AS d ON ch.id_bank_prixod = d.id
                    JOIN spravochnik_operatsii AS op ON op.id = ch.spravochnik_operatsii_id
                    JOIN users AS u ON u.id = d.user_id
                    JOIN regions AS r ON r.id = u.region_id
                    JOIN spravochnik_organization AS so ON so.id = d.id_spravochnik_organization
                    WHERE d.isdeleted = false
                        AND ch.isdeleted = false
                        AND d.main_schet_id = $1
                        AND d.doc_date BETWEEN $2 AND $3
                        AND r.id = $4
                        AND op.schet = $5
                    GROUP BY op.schet,
                        op.sub_schet
                ),
                jur7_prixod AS (
                    SELECT 
                        COALESCE(SUM(ch.summa), 0)::FLOAT AS summa,
                        op.schet,
                        op.sub_schet
                    FROM document_prixod_jur7_child ch
                    JOIN document_prixod_jur7 AS d ON ch.document_prixod_jur7_id = d.id
                    JOIN users AS u ON u.id = d.user_id
                    JOIN regions AS r ON r.id = u.region_id
                    JOIN spravochnik_organization AS so ON so.id = d.kimdan_id
                    JOIN spravochnik_operatsii op ON op.schet = ch.kredit_schet
                    WHERE d.isdeleted = false
                        AND ch.isdeleted = false
                        AND d.main_schet_id = $1
                        AND d.doc_date BETWEEN $2 AND $3
                        AND r.id = $4
                        AND op.schet = $5
                    GROUP BY op.schet,
                        op.sub_schet
                )
            SELECT 
                JSON_BUILD_OBJECT(
                    'prixods', (
                        SELECT COALESCE(JSON_AGG(ROW_TO_JSON(prixod)), '[]'::JSON)
                        FROM (
                            SELECT * FROM kursatilgan_hizmatlar
                            UNION ALL
                            SELECT * FROM bank_rasxod
                            UNION ALL
                            SELECT * FROM organ_saldo_prixod
                        ) prixod
                    ),

                    'rasxods', (
                        SELECT COALESCE(JSON_AGG(ROW_TO_JSON(rasxod)), '[]'::JSON)
                        FROM (
                            SELECT * FROM bajarilgan_ishlar
                            UNION ALL
                            SELECT * FROM bank_prixod
                            UNION ALL
                            SELECT * FROM jur7_prixod
                            UNION ALL
                            SELECT * FROM organ_saldo_rasxod
                        ) rasxod
                    )
                ) AS result;
        `;

    const result = await db.query(query, params);

    return result[0].result;
  }

  static async getSummaConsolidated(params, operator, contract) {
    let index_contract = 0;
    if (contract) {
      params.push(contract);
      index_contract = params.length;
    }

    const query = `--sql
            WITH 
            bajarilgan_ishlar_sum AS (
                SELECT COALESCE(SUM(ch.summa), 0)::FLOAT AS summa
                FROM bajarilgan_ishlar_jur3_child AS ch
                JOIN bajarilgan_ishlar_jur3 AS d ON d.id = ch.bajarilgan_ishlar_jur3_id 
                JOIN spravochnik_operatsii AS own ON own.id = d.spravochnik_operatsii_own_id
                JOIN users AS u ON d.user_id = u.id
                JOIN regions AS r ON r.id = u.region_id
                WHERE d.isdeleted = false
                    AND r.id = $1
                    AND d.main_schet_id = $2
                    AND own.schet = $3
                    AND d.doc_date ${operator} $4
                    AND d.id_spravochnik_organization = $5
                    ${contract ? sqlFilter("d.shartnomalar_organization_id", index_contract) : ""}
            ),
            bank_rasxod_sum AS (
                SELECT COALESCE(SUM(ch.summa), 0)::FLOAT AS summa
                FROM bank_rasxod_child ch
                JOIN bank_rasxod AS d ON ch.id_bank_rasxod = d.id
                JOIN spravochnik_operatsii AS op ON op.id = ch.spravochnik_operatsii_id
                JOIN users AS u ON u.id = d.user_id
                JOIN regions AS r ON r.id = u.region_id
                WHERE d.isdeleted = false
                    AND r.id = $1
                    AND d.main_schet_id = $2
                    AND op.schet = $3
                    AND d.doc_date ${operator} $4
                    AND d.id_spravochnik_organization = $5
                    ${contract ? sqlFilter("d.id_shartnomalar_organization", index_contract) : ""}
            ),
            bank_prixod_sum AS (
                SELECT COALESCE(SUM(ch.summa), 0)::FLOAT AS summa
                FROM bank_prixod_child AS ch
                JOIN bank_prixod AS d ON ch.id_bank_prixod = d.id
                JOIN spravochnik_operatsii AS op ON op.id = ch.spravochnik_operatsii_id
                JOIN users AS u ON u.id = d.user_id
                JOIN regions AS r ON r.id = u.region_id
                WHERE d.isdeleted = false
                    AND r.id = $1
                    AND d.main_schet_id = $2
                    AND op.schet = $3
                    AND d.doc_date ${operator} $4
                    AND d.id_spravochnik_organization = $5
                    ${contract ? sqlFilter("d.id_shartnomalar_organization", index_contract) : ""}
            ),
            jur7_prixod_sum AS (
                SELECT COALESCE(SUM(ch.summa), 0)::FLOAT AS summa
                FROM document_prixod_jur7_child ch
                JOIN document_prixod_jur7 AS d ON ch.document_prixod_jur7_id = d.id
                JOIN users AS u ON u.id = d.user_id
                JOIN regions AS r ON r.id = u.region_id
                WHERE d.isdeleted = false
                    AND r.id = $1
                    AND d.main_schet_id = $2
                    AND ch.kredit_schet = $3
                    AND d.doc_date ${operator} $4
                    AND d.kimdan_id = $5
                    ${contract ? sqlFilter("d.id_shartnomalar_organization", index_contract) : ""}
            )
            SELECT 
                (
                    (bank_rasxod_sum.summa) - (bajarilgan_ishlar_sum.summa + bank_prixod_sum.summa + jur7_prixod_sum.summa)
                ) AS summa
            FROM bajarilgan_ishlar_sum, bank_rasxod_sum, bank_prixod_sum, jur7_prixod_sum
        `;
    const result = await db.query(query, params);
    return result[0];
  }

  static async getSummaPrixodConsolidated(params, contract) {
    let index_contract = 0;
    if (contract) {
      params.push(contract);
      index_contract = params.length;
    }
    const query = `--sql
            SELECT 
                COALESCE(SUM(ch.summa), 0)::FLOAT AS summa,
                op.schet
            FROM bank_rasxod_child ch
            JOIN bank_rasxod AS d ON ch.id_bank_rasxod = d.id
            JOIN spravochnik_operatsii AS op ON op.id = ch.spravochnik_operatsii_id
            JOIN users AS u ON u.id = d.user_id
            JOIN regions AS r ON r.id = u.region_id
            WHERE d.isdeleted = false
                AND r.id = $1
                AND d.main_schet_id = $2
                AND op.schet = $3
                AND d.doc_date BETWEEN $4 AND $5
                AND d.id_spravochnik_organization = $6
                ${contract ? sqlFilter("d.id_shartnomalar_organization", index_contract) : ""}
            GROUP BY op.schet
        `;
    const result = await db.query(query, params);
    return result;
  }

  static async getSummaAktConsolidated(params, contract) {
    let index_contract = 0;
    if (contract) {
      params.push(contract);
      index_contract = params.length;
    }
    const query = `--sql
            SELECT 
                COALESCE(SUM(ch.summa), 0)::FLOAT AS summa,
                op.schet
            FROM bajarilgan_ishlar_jur3_child AS ch
            JOIN bajarilgan_ishlar_jur3 AS d ON d.id = ch.bajarilgan_ishlar_jur3_id 
            JOIN spravochnik_operatsii AS own ON own.id = d.spravochnik_operatsii_own_id
            JOIN spravochnik_operatsii AS op ON op.id = ch.spravochnik_operatsii_id
            JOIN users AS u ON d.user_id = u.id
            JOIN regions AS r ON r.id = u.region_id
            WHERE d.isdeleted = false
                AND r.id = $1
                AND d.main_schet_id = $2
                AND own.schet = $3
                AND d.doc_date BETWEEN $4 AND $5
                AND d.id_spravochnik_organization = $6
                ${contract ? sqlFilter("d.shartnomalar_organization_id", index_contract) : ""}
            GROUP BY op.schet
        `;
    const result = await db.query(query, params);
    return result;
  }

  static async getSummaJur7Consolidated(params, contract) {
    let index_contract = 0;
    if (contract) {
      params.push(contract);
      index_contract = params.length;
    }
    const query = `--sql
            SELECT 
                COALESCE(SUM(ch.summa), 0)::FLOAT AS summa,
                ch.debet_schet AS schet
            FROM document_prixod_jur7_child ch
            JOIN document_prixod_jur7 AS d ON ch.document_prixod_jur7_id = d.id
            JOIN users AS u ON u.id = d.user_id
            JOIN regions AS r ON r.id = u.region_id
            WHERE d.isdeleted = false
                AND r.id = $1
                AND d.main_schet_id = $2
                AND ch.kredit_schet = $3
                AND d.doc_date BETWEEN $4 AND $5
                AND d.kimdan_id = $6
                ${contract ? sqlFilter("d.id_shartnomalar_organization", index_contract) : ""}
            GROUP BY ch.debet_schet
        `;
    const result = await db.query(query, params);
    return result;
  }

  static async getSummaBankPrixodConsolidated(params, contract) {
    let index_contract = 0;
    if (contract) {
      params.push(contract);
      index_contract = params.length;
    }
    const query = `--sql
            SELECT 
                COALESCE(SUM(ch.summa), 0)::FLOAT AS summa,
                mch.jur2_schet AS schet
            FROM bank_prixod_child AS ch
            JOIN bank_prixod AS d ON ch.id_bank_prixod = d.id
            JOIN spravochnik_operatsii AS op ON op.id = ch.spravochnik_operatsii_id
            JOIN users AS u ON u.id = d.user_id
            JOIN regions AS r ON r.id = u.region_id
            JOIN main_schet AS mch ON mch.id = d.main_schet_id 
            WHERE d.isdeleted = false
                AND r.id = $1
                AND mch.id = $2
                AND op.schet = $3
                AND d.doc_date BETWEEN $4 AND $5
                AND d.id_spravochnik_organization = $6
                ${contract ? sqlFilter("d.id_shartnomalar_organization", index_contract) : ""}
            GROUP BY mch.jur2_schet       
        `;
    const result = await db.query(query, params);
    return result;
  }

  static async getRasxodSchets(params, contract) {
    let query = `--sql
            SELECT schet
            FROM (
                SELECT op.schet
                FROM bajarilgan_ishlar_jur3_child AS ch
                JOIN bajarilgan_ishlar_jur3 AS d ON d.id = ch.bajarilgan_ishlar_jur3_id
                JOIN spravochnik_operatsii AS own ON own.id = d.spravochnik_operatsii_own_id
                JOIN spravochnik_operatsii AS op ON op.id = ch.spravochnik_operatsii_id
                JOIN users AS u ON d.user_id = u.id
                JOIN regions AS r ON r.id = u.region_id
                WHERE d.isdeleted = false
                    AND r.id = $1
                    AND d.main_schet_id = $2
                    AND own.schet = $3
                    AND d.doc_date BETWEEN $4 AND $5
                    ${contract ? "AND d.shartnomalar_organization_id IS NOT NULL" : ""}
                UNION
                SELECT ch.debet_schet AS schet
                FROM document_prixod_jur7_child ch
                JOIN document_prixod_jur7 AS d ON ch.document_prixod_jur7_id = d.id
                JOIN users AS u ON u.id = d.user_id
                JOIN regions AS r ON r.id = u.region_id
                WHERE d.isdeleted = false
                    AND r.id = $1
                    AND d.main_schet_id = $2
                    AND ch.kredit_schet = $3
                    AND d.doc_date BETWEEN $4 AND $5
                    ${contract ? "AND d.id_shartnomalar_organization IS NOT NULL" : ""}
                UNION 
                SELECT 
                    mch.jur2_schet AS schet
                FROM bank_prixod_child AS ch
                JOIN bank_prixod AS d ON ch.id_bank_prixod = d.id
                JOIN spravochnik_operatsii AS op ON op.id = ch.spravochnik_operatsii_id
                JOIN users AS u ON u.id = d.user_id
                JOIN regions AS r ON r.id = u.region_id
                JOIN main_schet AS mch ON mch.id = d.main_schet_id 
                WHERE d.isdeleted = false
                    AND r.id = $1
                    AND mch.id = $2
                    AND op.schet = $3
                    AND d.doc_date BETWEEN $4 AND $5
                    ${contract ? "AND d.id_shartnomalar_organization IS NOT NULL" : ""}
            ) AS combined_schets
            GROUP BY schet
            HAVING COUNT(schet) = 1;        
        `;
    const result = await db.query(query, params);
    return result;
  }
};
