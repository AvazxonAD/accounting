const { db } = require("@db/index");
const { sqlFilter } = require("@helper/functions");

exports.Monitoring152DB = class {
  static async monitoring(
    params,
    organ_id = null,
    search = null,
    order_by = "doc_date",
    order_type = "DESC"
  ) {
    let organ_filter = "";
    let search_filter = ``;
    let order = ``;

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

    order = `ORDER BY combined_${order_by} ${order_type}`;

    const query = `--sql
            SELECT
                d.id,
                d.doc_num,
                TO_CHAR(d.doc_date, 'YYYY-MM-DD') AS                    doc_date,
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
                'bank_rasxod' AS type,
                d.doc_date AS                                                   combined_doc_date,
                d.id AS                                                         combined_id,
                d.doc_num AS                                                    combined_doc_num
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
                'show_service' AS type,
                d.doc_date AS                                                   combined_doc_date,
                d.id AS                                                         combined_id,
                d.doc_num AS                                                    combined_doc_num
            FROM kursatilgan_hizmatlar_jur152_child AS ch
            JOIN kursatilgan_hizmatlar_jur152 AS d ON d.id = ch.kursatilgan_hizmatlar_jur152_id
            JOIN users AS u ON d.user_id = u.id
            JOIN regions AS r ON r.id = u.region_id
            LEFT JOIN shartnomalar_organization AS sh_o ON sh_o.id = d.shartnomalar_organization_id
            LEFT JOIN smeta AS s ON sh_o.smeta_id = s.id 
            JOIN spravochnik_organization AS so ON so.id = d.id_spravochnik_organization
            JOIN jur_schets AS own ON own.id = d.schet_id
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
                'bank_prixod' AS type,
                d.doc_date AS                                                   combined_doc_date,
                d.id AS                                                         combined_id,
                d.doc_num AS                                                    combined_doc_num
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
                TO_CHAR(d.doc_date, 'YYYY-MM-DD') AS                    doc_date,
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
                'kassa_rasxod' AS type,
                d.doc_date AS                                                   combined_doc_date,
                d.id AS                                                         combined_id,
                d.doc_num AS                                                    combined_doc_num
            FROM kassa_rasxod_child ch
            JOIN kassa_rasxod AS d ON ch.kassa_rasxod_id = d.id
            JOIN users AS u ON u.id = d.user_id
            JOIN regions AS r ON r.id = u.region_id
            LEFT JOIN shartnomalar_organization AS sh_o ON sh_o.id = d.contract_id
            LEFT JOIN smeta AS s ON sh_o.smeta_id = s.id 
            JOIN spravochnik_organization AS so ON so.id = d.organ_id
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
                op.schet AS provodki_schet, 
                op.sub_schet AS provodki_sub_schet,
                'kassa_prixod' AS type,
                d.doc_date AS                                                   combined_doc_date,
                d.id AS                                                         combined_id,
                d.doc_num AS                                                    combined_doc_num
            FROM kassa_prixod_child ch
            JOIN kassa_prixod AS d ON ch.kassa_prixod_id = d.id
            JOIN users AS u ON u.id = d.user_id
            JOIN regions AS r ON r.id = u.region_id 
            LEFT JOIN shartnomalar_organization AS sh_o ON sh_o.id = d.contract_id
            LEFT JOIN smeta AS s ON sh_o.smeta_id = s.id
            JOIN spravochnik_organization AS so ON so.id = d.organ_id
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
                'jur7_prixod' AS type,
                d.doc_date AS                                                   combined_doc_date,
                d.id AS                                                         combined_id,
                d.doc_num AS                                                    combined_doc_num
            FROM document_prixod_jur7_child AS ch
            JOIN document_prixod_jur7 AS d ON ch.document_prixod_jur7_id = d.id
            JOIN users AS u ON u.id = d.user_id
            JOIN regions AS r ON r.id = u.region_id 
            LEFT JOIN shartnomalar_organization AS sh_o ON sh_o.id = d.id_shartnomalar_organization
            LEFT JOIN smeta AS s ON sh_o.smeta_id = s.id
            JOIN spravochnik_organization AS so ON so.id = d.kimdan_id
            WHERE d.isdeleted = false
                AND r.id = $1 
                AND ch.kredit_schet = $3
                AND d.doc_date BETWEEN $4 AND $5
                AND ch.isdeleted = false
                ${organ_filter}
                ${search_filter}    
            
            ${order}

            OFFSET $6 LIMIT $7
        `;

    const data = await db.query(query, params);

    return data;
  }

  static async daysReport(params) {
    const query = `--sql
            WITH
                prixod AS (
                    SELECT
                        op.schet,
                        op.sub_schet,
                        ch.summa::FLOAT,
                        d.doc_num,
                        d.doc_date,
                        so.name,
                        so.inn,
                        oa.raschet_schet AS             account_number,
                        c.doc_num AS                    contract_doc_num,
                        c.doc_date AS                   contract_doc_date,
                        d.opisanie AS                   comment
                    FROM bank_rasxod_child ch
                    JOIN bank_rasxod AS d ON d.id = ch.id_bank_rasxod
                    JOIN users AS u ON u.id = d.user_id
                    JOIN regions AS r ON r.id = u.region_id
                    JOIN spravochnik_operatsii op ON ch.spravochnik_operatsii_id = op.id
                    JOIN spravochnik_organization so ON so.id = d.id_spravochnik_organization
                    LEFT JOIN organization_by_raschet_schet oa ON oa.id = d.organization_by_raschet_schet_id
                    LEFT JOIN shartnomalar_organization c ON c.id = d.id_shartnomalar_organization
                    WHERE d.isdeleted = false
                        AND ch.isdeleted = false
                        AND d.main_schet_id = $1
                        AND d.doc_date BETWEEN $2 AND $3
                        AND r.id = $4
                        AND op.schet = $5
                    
                    UNION ALL
                    
                    SELECT
                        op.schet,
                        op.sub_schet,
                        ch.summa::FLOAT,
                        d.doc_num,
                        d.doc_date,
                        so.name,
                        so.inn,
                        oa.raschet_schet AS             account_number,
                        c.doc_num AS                    contract_doc_num,
                        c.doc_date AS                   contract_doc_date,
                        d.opisanie AS                   comment
                    FROM kassa_rasxod_child ch
                    JOIN kassa_rasxod AS d ON d.id = ch.kassa_rasxod_id
                    JOIN users AS u ON u.id = d.user_id
                    JOIN regions AS r ON r.id = u.region_id
                    JOIN spravochnik_operatsii op ON ch.spravochnik_operatsii_id = op.id
                    JOIN spravochnik_organization so ON so.id = d.organ_id
                    LEFT JOIN organization_by_raschet_schet oa ON oa.id = d.organ_account_id
                    LEFT JOIN shartnomalar_organization c ON c.id = d.contract_id
                    WHERE d.isdeleted = false
                        AND ch.isdeleted = false
                        AND d.main_schet_id = $1
                        AND d.doc_date BETWEEN $2 AND $3
                        AND r.id = $4
                        AND op.schet = $5
                ),
                rasxod AS (
                    SELECT
                        op.schet,
                        op.sub_schet,
                        ch.summa::FLOAT,
                        d.doc_num,
                        d.doc_date,
                        so.name,
                        so.inn,
                        oa.raschet_schet AS             account_number,
                        c.doc_num AS                    contract_doc_num,
                        c.doc_date AS                   contract_doc_date,
                        d.opisanie AS                   comment
                    FROM bank_prixod_child ch
                    JOIN bank_prixod AS d ON d.id = ch.id_bank_prixod
                    JOIN users AS u ON u.id = d.user_id
                    JOIN regions AS r ON r.id = u.region_id
                    JOIN spravochnik_operatsii op ON ch.spravochnik_operatsii_id = op.id
                    JOIN spravochnik_organization so ON so.id = d.id_spravochnik_organization
                    LEFT JOIN organization_by_raschet_schet oa ON oa.id = d.organization_by_raschet_schet_id
                    LEFT JOIN shartnomalar_organization c ON c.id = d.id_shartnomalar_organization
                    WHERE d.isdeleted = false
                        AND ch.isdeleted = false
                        AND d.main_schet_id = $1
                        AND d.doc_date BETWEEN $2 AND $3
                        AND r.id = $4
                        AND op.schet = $5
                    
                    UNION ALL
                    
                    SELECT
                        op.schet,
                        op.sub_schet,
                        ch.summa::FLOAT,
                        d.doc_num,
                        d.doc_date,
                        so.name,
                        so.inn,
                        oa.raschet_schet AS             account_number,
                        c.doc_num AS                    contract_doc_num,
                        c.doc_date AS                   contract_doc_date,
                        d.opisanie AS                   comment
                    FROM kursatilgan_hizmatlar_jur152_child AS ch
                    JOIN kursatilgan_hizmatlar_jur152 AS d ON d.id = ch.kursatilgan_hizmatlar_jur152_id
                    JOIN users AS u ON d.user_id = u.id
                    JOIN regions AS r ON r.id = u.region_id
                    LEFT JOIN shartnomalar_organization AS sh_o ON sh_o.id = d.shartnomalar_organization_id
                    LEFT JOIN organization_by_raschet_schet oa ON oa.id = d.organization_by_raschet_schet_id
                    JOIN spravochnik_organization AS so ON so.id = d.id_spravochnik_organization
                    JOIN jur_schets AS own ON own.id = d.schet_id
                    JOIN spravochnik_operatsii AS op ON op.id = ch.spravochnik_operatsii_id
                    LEFT JOIN shartnomalar_organization c ON c.id = d.shartnomalar_organization_id
                    WHERE d.isdeleted = false
                        AND ch.isdeleted = false
                        AND d.main_schet_id = $1
                        AND d.doc_date BETWEEN $2 AND $3
                        AND r.id = $4
                        AND own.schet = $5

                    UNION ALL
                    
                    SELECT
                        op.schet,
                        op.sub_schet,
                        ch.summa::FLOAT,
                        d.doc_num,
                        d.doc_date,
                        so.name,
                        so.inn,
                        oa.raschet_schet AS             account_number,
                        c.doc_num AS                    contract_doc_num,
                        c.doc_date AS                   contract_doc_date,
                        d.opisanie AS                   comment
                    FROM kassa_prixod_child ch
                    JOIN kassa_prixod AS d ON ch.kassa_prixod_id = d.id
                    JOIN users AS u ON u.id = d.user_id
                    JOIN regions AS r ON r.id = u.region_id
                    JOIN spravochnik_operatsii op ON ch.spravochnik_operatsii_id = op.id
                    JOIN spravochnik_organization so ON so.id = d.organ_id
                    LEFT JOIN organization_by_raschet_schet oa ON oa.id = d.organ_account_id
                    LEFT JOIN shartnomalar_organization c ON c.id = d.contract_id
                    WHERE d.isdeleted = false
                        AND ch.isdeleted = false
                        AND d.main_schet_id = $1
                        AND d.doc_date BETWEEN $2 AND $3
                        AND r.id = $4
                        AND op.schet = $5

                    UNION ALL
                    
                    SELECT
                        ch.kredit_schet AS schet,
                        ch.kredit_sub_schet AS sub_schet,
                        ch.summa::FLOAT,
                        d.doc_num,
                        d.doc_date,
                        so.name,
                        so.inn,
                        oa.raschet_schet AS             account_number,
                        c.doc_num AS                    contract_doc_num,
                        c.doc_date AS                   contract_doc_date,
                        d.opisanie AS                   comment
                    FROM document_prixod_jur7_child ch
                    JOIN document_prixod_jur7 AS d ON ch.document_prixod_jur7_id = d.id
                    JOIN users AS u ON u.id = d.user_id
                    JOIN regions AS r ON r.id = u.region_id
                    JOIN spravochnik_organization so ON so.id = d.kimdan_id
                    LEFT JOIN organization_by_raschet_schet oa ON oa.id = d.organization_by_raschet_schet_id
                    LEFT JOIN shartnomalar_organization c ON c.id = d.id_shartnomalar_organization
                    WHERE d.isdeleted = false
                        AND ch.isdeleted = false
                        AND d.main_schet_id = $1
                        AND d.doc_date BETWEEN $2 AND $3
                        AND r.id = $4
                        AND ch.kredit_schet = $5
                )
            SELECT
                (SELECT COALESCE(JSON_AGG(ROW_TO_JSON(prixod)), '[]'::JSON) FROM prixod) AS prixods,
                (SELECT COALESCE(JSON_AGG(ROW_TO_JSON(rasxod)), '[]'::JSON) FROM rasxod) AS rasxods;
        `;

    const result = await db.query(query, params);

    return result[0];
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
                SELECT
                    COALESCE(COUNT(*)::INTEGER, 0) AS total_count
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
                    ${organ_filter}
                    ${search_filter}
            ),

            kassa_prixod_count AS (
                SELECT 
                    COALESCE(COUNT(*)::INTEGER, 0) AS total_count
                FROM kassa_prixod_child ch
                JOIN kassa_prixod AS d ON ch.kassa_prixod_id = d.id
                JOIN spravochnik_operatsii AS op ON op.id = ch.spravochnik_operatsii_id
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
            ),

            kassa_rasxod_count AS (
                SELECT 
                    COALESCE(COUNT(*)::INTEGER, 0) AS total_count
                FROM kassa_rasxod_child ch
                JOIN kassa_rasxod AS d ON ch.kassa_rasxod_id = d.id
                JOIN spravochnik_operatsii AS op ON op.id = ch.spravochnik_operatsii_id
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
            ),
            
            kursatilgan_hizmatlar_jur152_count AS (
                SELECT COALESCE(COUNT(*)::INTEGER, 0) AS total_count
                FROM kursatilgan_hizmatlar_jur152_child AS ch
                JOIN kursatilgan_hizmatlar_jur152 AS d ON d.id = ch.kursatilgan_hizmatlar_jur152_id 
                JOIN users AS u ON d.user_id = u.id
                JOIN regions AS r ON r.id = u.region_id
                JOIN spravochnik_organization AS so ON so.id = d.id_spravochnik_organization
                JOIN jur_schets AS own ON own.id = d.schet_id
                WHERE d.isdeleted = false 
                    AND r.id = $1
                    AND d.main_schet_id = $2
                    AND own.schet = $3
                    AND d.doc_date BETWEEN $4 AND $5
                    AND ch.isdeleted = false
                    ${organ_filter}
                    ${search_filter}
            ),

            bank_rasxod_count AS (
                SELECT COALESCE(COUNT(*)::INTEGER, 0) AS total_count
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
                    AND d.doc_date BETWEEN $4 AND $5
                    AND ch.isdeleted = false
                    ${organ_filter}
                    ${search_filter}
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
                    ${search_filter}
            )
            
            SELECT SUM(total_count)::INTEGER AS total
            FROM (
                SELECT total_count FROM bank_prixod_count
                UNION ALL
                SELECT total_count FROM kursatilgan_hizmatlar_jur152_count
                UNION ALL
                SELECT total_count FROM bank_rasxod_count
                UNION ALL 
                SELECT total_count FROM jur7_prixod_count
                UNION ALL 
                SELECT total_count FROM kassa_prixod_count
                UNION ALL 
                SELECT total_count FROM kassa_rasxod_count
            ) AS total_count        
        `;

    const result = await db.query(query, params);

    return result[0].total;
  }

  static async getSumma(
    params,
    organ_id = null,
    search = null,
    from = null,
    one_from = null,
    one_to = null
  ) {
    let organ_filter = "";
    let search_filter = ``;
    let internal_filter = `BETWEEN $4 AND $5`;

    if (from) {
      internal_filter = ` >= $4 AND d.doc_date < $5`;
    }

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

    if (one_from) {
      internal_filter = ` < $4 `;
    }

    if (one_to) {
      internal_filter = ` <= $4`;
    }

    const query = `--sql
            WITH 
            kursatilgan_hizmatlar_jur152_sum AS (
                SELECT COALESCE(SUM(ch.summa), 0)::FLOAT AS summa
                FROM kursatilgan_hizmatlar_jur152_child AS ch
                JOIN kursatilgan_hizmatlar_jur152 AS d ON d.id = ch.kursatilgan_hizmatlar_jur152_id 
                JOIN users AS u ON d.user_id = u.id
                JOIN regions AS r ON r.id = u.region_id
                JOIN spravochnik_organization AS so ON so.id = d.id_spravochnik_organization
                JOIN jur_schets AS own ON own.id = d.schet_id
                WHERE d.isdeleted = false
                    AND r.id = $1
                    AND d.main_schet_id = $2
                    AND ch.isdeleted = false
                    AND own.schet = $3
                    AND d.doc_date ${internal_filter}
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
                    AND ch.isdeleted = false
                    AND d.doc_date ${internal_filter}
                    ${organ_filter}
                    ${search_filter}
            ),

            kassa_rasxod_sum AS (
                SELECT 
                    COALESCE(SUM(ch.summa), 0)::FLOAT AS summa
                FROM kassa_rasxod_child ch
                JOIN kassa_rasxod AS d ON ch.kassa_rasxod_id = d.id
                JOIN spravochnik_operatsii AS op ON op.id = ch.spravochnik_operatsii_id
                JOIN users AS u ON u.id = d.user_id
                JOIN regions AS r ON r.id = u.region_id
                JOIN spravochnik_organization AS so ON so.id = d.organ_id
                WHERE d.isdeleted = false
                    AND r.id = $1
                    AND d.main_schet_id = $2
                    AND op.schet = $3
                    AND ch.isdeleted = false
                    AND d.doc_date ${internal_filter}
                    ${organ_filter}
                    ${search_filter}
            ),

            kassa_prixod_sum AS (
                SELECT 
                    COALESCE(SUM(ch.summa), 0)::FLOAT AS summa
                FROM kassa_prixod_child AS ch
                JOIN kassa_prixod AS d ON ch.kassa_prixod_id = d.id
                JOIN spravochnik_operatsii AS op ON op.id = ch.spravochnik_operatsii_id
                JOIN users AS u ON u.id = d.user_id
                JOIN regions AS r ON r.id = u.region_id
                JOIN spravochnik_organization AS so ON so.id = d.organ_id
                WHERE d.isdeleted = false
                    AND r.id = $1
                    AND d.main_schet_id = $2
                    AND op.schet = $3
                    AND ch.isdeleted = false
                    AND d.doc_date ${internal_filter}
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
                    AND ch.isdeleted = false
                    AND d.doc_date ${internal_filter}
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
                    AND ch.isdeleted = false
                    AND d.doc_date ${internal_filter}
                    ${organ_filter}
                    ${search_filter}
            )
            SELECT 
                (
                    (bank_rasxod_sum.summa + kassa_rasxod_sum.summa) - 
                    (kursatilgan_hizmatlar_jur152_sum.summa + bank_prixod_sum.summa + kassa_prixod_sum.summa + jur7_prixod_sum.summa)
                ) AS summa,
                (bank_rasxod_sum.summa + kassa_rasxod_sum.summa) AS prixod_sum,
                (kursatilgan_hizmatlar_jur152_sum.summa + bank_prixod_sum.summa + kassa_prixod_sum.summa + jur7_prixod_sum.summa) AS rasxod_sum,
                bank_rasxod_sum.summa AS bank_rasxod_sum_prixod,
                kassa_rasxod_sum.summa AS kassa_rasxod_sum_prixod,
                bank_rasxod_sum.summa AS bank_rasxod_sum_prixod,
                kursatilgan_hizmatlar_jur152_sum.summa AS kursatilgan_hizmatlar_jur152_sum_rasxod,
                bank_prixod_sum.summa AS bank_prixod_sum_rasxod,
                kassa_prixod_sum.summa AS kassa_prixod_sum_rasxod,
                jur7_prixod_sum.summa AS jur7_prixod_sum_rasxod
            FROM kursatilgan_hizmatlar_jur152_sum, 
                bank_rasxod_sum, 
                kassa_rasxod_sum, 
                bank_prixod_sum, 
                kassa_prixod_sum, 
                jur7_prixod_sum
        `;

    const result = await db.query(query, params);

    return result[0];
  }

  static async capData(params) {
    const query = `--sql
        SELECT 
            COALESCE(SUM(ch.summa), 0)::FLOAT AS summa,
            op.schet AS schet,
            op.sub_schet
        FROM kursatilgan_hizmatlar_jur152_child AS ch
        JOIN kursatilgan_hizmatlar_jur152 AS d ON d.id = ch.kursatilgan_hizmatlar_jur152_id 
        JOIN spravochnik_operatsii AS op ON op.id = ch.spravochnik_operatsii_id
        JOIN users AS u ON d.user_id = u.id
        JOIN regions AS r ON r.id = u.region_id
        JOIN jur_schets AS own ON own.id = d.schet_id
        WHERE d.isdeleted = false
            AND ch.isdeleted = false
            AND d.main_schet_id = $1
            AND d.doc_date BETWEEN $2 AND $3
            AND r.id = $4
            AND own.schet = $5
        GROUP BY op.schet,
             own.schet,
             op.sub_schet
        
        UNION ALL
        
        SELECT 
            COALESCE(SUM(ch.summa), 0)::FLOAT AS summa,
            m.jur2_schet AS debet_schet,
            '0' AS sub_schet
        FROM bank_prixod_child AS ch
        JOIN bank_prixod AS d ON d.id = ch.id_bank_prixod 
        JOIN main_schet AS m ON m.id = d.main_schet_id
        JOIN spravochnik_operatsii AS op ON op.id = ch.spravochnik_operatsii_id
        JOIN users AS u ON d.user_id = u.id
        JOIN regions AS r ON r.id = u.region_id
        WHERE d.isdeleted = false
            AND ch.isdeleted = false
            AND d.main_schet_id = $1
            AND d.doc_date BETWEEN $2 AND $3
            AND r.id = $4
            AND op.schet = $5
        GROUP BY op.schet,
            m.jur2_schet

        UNION ALL
        
        SELECT 
            COALESCE(SUM(ch.summa), 0)::FLOAT AS summa,
            m.jur1_schet AS debet_schet,
            '0' AS sub_schet
        FROM kassa_prixod_child AS ch
        JOIN kassa_prixod AS d ON d.id = ch.kassa_prixod_id 
        JOIN main_schet AS m ON m.id = d.main_schet_id
        JOIN spravochnik_operatsii AS op ON op.id = ch.spravochnik_operatsii_id
        JOIN users AS u ON d.user_id = u.id
        JOIN regions AS r ON r.id = u.region_id
        WHERE d.isdeleted = false
            AND ch.isdeleted = false
            AND d.main_schet_id = $1
            AND d.doc_date BETWEEN $2 AND $3
            AND r.id = $4
            AND op.schet = $5
        GROUP BY op.schet,
            m.jur1_schet
        
        UNION ALL
        
        SELECT 
            COALESCE(SUM(ch.summa_s_nds), 0)::FLOAT AS summa,
            ch.debet_schet,
            ch.debet_sub_schet AS sub_schet
        FROM document_prixod_jur7_child AS ch
        JOIN document_prixod_jur7 AS d ON d.id = ch.document_prixod_jur7_id 
        JOIN users AS u ON d.user_id = u.id
        JOIN regions AS r ON r.id = u.region_id
        WHERE d.isdeleted = false
            AND ch.isdeleted = false
            AND d.doc_date BETWEEN $2 AND $3
            AND r.id = $4
            AND ch.kredit_schet = $5
        GROUP BY ch.kredit_schet,
            ch.debet_schet,
            ch.debet_sub_schet
      `;

    const result = await db.query(query, params);

    return result;
  }

  // old
  static async getPrixodRasxod(params) {
    const query = `--sql
            WITH 
                kursatilgan_hizmatlar_sum AS (
                    SELECT COALESCE(SUM(ch.summa), 0)::FLOAT AS summa
                    FROM kursatilgan_hizmatlar_jur152_child AS ch
                    JOIN kursatilgan_hizmatlar_jur152 AS d ON d.id = ch.kursatilgan_hizmatlar_jur152_id 
                    JOIN main_schet AS m_sch ON  m_sch.id = d.main_schet_id
                    WHERE d.isdeleted = false
                      AND d.doc_date <= $2
                      AND d.id_spravochnik_organization = $3
                      AND m_sch.spravochnik_budjet_name_id = $4
                ),
                kursatilgan_hizmatlar_jur152_sum AS (
                    SELECT COALESCE(SUM(d.summa), 0)::FLOAT AS summa
                    FROM kursatilgan_hizmatlar_jur152_child AS ch
                    JOIN kursatilgan_hizmatlar_jur152 AS d ON d.id = ch.kursatilgan_hizmatlar_jur152_id 
                    JOIN spravochnik_organization AS so ON so.id = d.id_spravochnik_organization
                    JOIN main_schet AS m_sch ON  m_sch.id = d.main_schet_id
                    WHERE d.isdeleted = false
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
                        - (kursatilgan_hizmatlar_jur152_sum.summa + bank_prixod.summa + jur7_prixod.summa)
                    ) AS summa,
                    (kursatilgan_hizmatlar_sum.summa + bank_rasxod.summa) AS prixod_sum,
                    (kursatilgan_hizmatlar_jur152_sum.summa + bank_prixod.summa + jur7_prixod.summa) AS rasxod_sum,
                    kursatilgan_hizmatlar_sum.summa AS kursatilgan_hizmatlar_sum,
                    bank_rasxod.summa AS bank_rasxod_sum,
                    kursatilgan_hizmatlar_jur152_sum.summa AS kursatilgan_hizmatlar_jur152_sum,
                    bank_prixod.summa AS bank_prixod_sum,
                    jur7_prixod.summa AS jur7_prixod_sum
                FROM kursatilgan_hizmatlar_sum, kursatilgan_hizmatlar_jur152_sum, bank_rasxod, bank_prixod, jur7_prixod
        `;
    const data = await db.query(query, params);
    return data[0];
  }

  static async getSummaConsolidated(params, operator, contract) {
    let index_contract = 0;
    if (contract) {
      params.push(contract);
      index_contract = params.length;
    }

    const query = `--sql
            WITH 
            kursatilgan_hizmatlar_jur152_sum AS (
                SELECT COALESCE(SUM(ch.summa), 0)::FLOAT AS summa
                FROM kursatilgan_hizmatlar_jur152_child AS ch
                JOIN kursatilgan_hizmatlar_jur152 AS d ON d.id = ch.kursatilgan_hizmatlar_jur152_id 
                JOIN jur_schets AS own ON own.id = d.schet_id
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
                    (bank_rasxod_sum.summa) - (kursatilgan_hizmatlar_jur152_sum.summa + bank_prixod_sum.summa + jur7_prixod_sum.summa)
                ) AS summa
            FROM kursatilgan_hizmatlar_jur152_sum, bank_rasxod_sum, bank_prixod_sum, jur7_prixod_sum
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
            FROM kursatilgan_hizmatlar_jur152_child AS ch
            JOIN kursatilgan_hizmatlar_jur152 AS d ON d.id = ch.kursatilgan_hizmatlar_jur152_id 
            JOIN spravochnik_operatsii AS op ON op.id = ch.spravochnik_operatsii_id
            JOIN users AS u ON d.user_id = u.id
            JOIN regions AS r ON r.id = u.region_id
            WHERE d.isdeleted = false
                AND r.id = $1
                AND d.main_schet_id = $2
                AND d.doc_date BETWEEN $3 AND $4
                AND d.id_spravochnik_organization = $5
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
                FROM kursatilgan_hizmatlar_jur152_child AS ch
                JOIN kursatilgan_hizmatlar_jur152 AS d ON d.id = ch.kursatilgan_hizmatlar_jur152_id
                JOIN spravochnik_operatsii AS op ON op.id = ch.spravochnik_operatsii_id
                JOIN users AS u ON d.user_id = u.id
                JOIN regions AS r ON r.id = u.region_id
                WHERE d.isdeleted = false
                    AND r.id = $1
                    AND d.main_schet_id = $2
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

  static async prixodReport(params, organ_id, search) {
    const conditions = [];

    if (organ_id) {
      params.push(organ_id);
      conditions.push(`so.id = $${params.length}`);
    }

    if (search) {
      params.push(search);
      conditions.push(`
        AND (
            d.doc_num = $${params.length} OR 
            so.name ILIKE '%' || $${params.length} || '%' OR 
            so.inn ILIKE '%' || $${params.length} || '%'
        )`);
    }

    const where = conditions.length ? `AND ${conditions.join("AND")}` : "";

    const query = `--sql
            SELECT 
                op.schet,
                op.sub_schet,
                ch.summa::FLOAT,
                d.doc_num,
                d.doc_date,
                so.name,
                so.inn,
                oa.raschet_schet AS             account_number,
                c.doc_num AS                    contract_doc_num,
                c.doc_date AS                   contract_doc_date,
                d.opisanie AS                   comment
            FROM kursatilgan_hizmatlar_jur152_child AS ch
            JOIN kursatilgan_hizmatlar_jur152 AS d ON d.id = ch.kursatilgan_hizmatlar_jur152_id 
            JOIN users AS u ON d.user_id = u.id
            JOIN regions AS r ON r.id = u.region_id
            LEFT JOIN shartnomalar_organization AS c ON c.id = d.shartnomalar_organization_id
            JOIN spravochnik_organization AS so ON so.id = d.id_spravochnik_organization
            LEFT JOIN organization_by_raschet_schet oa ON oa.id = d.organization_by_raschet_schet_id
            JOIN spravochnik_operatsii AS op ON op.id = ch.spravochnik_operatsii_id
            JOIN jur_schets AS own ON own.id = d.schet_id
            WHERE d.isdeleted = false
                AND r.id = $1
                AND d.main_schet_id = $2
                AND d.doc_date BETWEEN $3 AND $4
                AND ch.isdeleted = false
                AND own.schet = $5
                ${where}
        `;

    const result = await db.query(query, params);

    return result;
  }
};
