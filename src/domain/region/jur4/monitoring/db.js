const { db } = require("@db/index");

exports.PodotchetMonitoringDB = class {
  static async getMonitoring(
    params,
    podotcbet_id,
    search,
    order_by,
    order_type
  ) {
    const conditions = [];

    if (podotcbet_id) {
      params.push(podotcbet_id);
      conditions.push(`p.id = $${params.length}`);
    }

    if (search) {
      params.push(search);
      conditions.push(`(
                d.doc_num = $${params.length} OR 
                p.name ILIKE '%' || $${params.length} || '%'
            )`);
    }

    const where = conditions.length ? `AND ${conditions.join(` AND `)}` : ``;
    const order = `ORDER BY combined_${order_by} ${order_type}`;

    const query = `--sql
            SELECT 
                d.id, 
                d.doc_num,
                TO_CHAR(d.doc_date, 'YYYY-MM-DD') AS doc_date,
                ch.summa::FLOAT AS prixod_sum,
                0::FLOAT AS rasxod_sum,
                d.opisanie,
                ch.id_spravochnik_podotchet_litso AS podotchet_id,
                p.name AS podotchet_name,
                p.rayon AS podotchet_rayon,
                u.login,
                u.fio,
                u.id AS user_id,
                op.schet AS provodki_schet,
                op.sub_schet AS provodki_sub_schet,
                'bank_rasxod' AS type,
                d.doc_date AS                                                   combined_doc_date,
                d.id AS                                                         combined_id,
                d.doc_num AS                                                    combined_doc_num
            FROM bank_rasxod_child ch
            JOIN bank_rasxod AS d ON ch.id_bank_rasxod = d.id
            LEFT JOIN spravochnik_podotchet_litso AS p ON p.id = ch.id_spravochnik_podotchet_litso 
            JOIN users u ON d.user_id = u.id
            JOIN regions r ON u.region_id = r.id
            JOIN spravochnik_operatsii AS op ON op.id = ch.spravochnik_operatsii_id
            WHERE r.id = $1 
                AND d.main_schet_id = $2 
                AND d.isdeleted = false  
                AND d.doc_date BETWEEN $3 AND $4
                AND op.schet = $5
                AND p.id IS NOT NULL
                ${where}

            UNION ALL
            
            SELECT 
                d.id, 
                d.doc_num,
                TO_CHAR(d.doc_date, 'YYYY-MM-DD') AS doc_date,
                0::FLOAT AS prixod_sum,
                ch.summa::FLOAT AS rasxod_sum,
                d.opisanie,
                ch.id_spravochnik_podotchet_litso AS podotchet_id,
                p.name AS podotchet_name,
                p.rayon AS podotchet_rayon,
                u.login,
                u.fio,
                u.id AS user_id,
                op.schet AS provodki_schet,
                op.sub_schet AS provodki_sub_schet,
                'bank_prixod' AS type,
                d.doc_date AS                                                   combined_doc_date,
                d.id AS                                                         combined_id,
                d.doc_num AS                                                    combined_doc_num
            FROM bank_prixod_child ch
            JOIN bank_prixod AS d ON ch.id_bank_prixod = d.id
            LEFT JOIN spravochnik_podotchet_litso AS p ON p.id = ch.id_spravochnik_podotchet_litso 
            JOIN users u ON d.user_id = u.id
            JOIN regions r ON u.region_id = r.id
            JOIN spravochnik_operatsii AS op ON op.id = ch.spravochnik_operatsii_id
            WHERE r.id = $1 
                AND d.main_schet_id = $2 
                AND d.isdeleted = false   
                AND d.doc_date BETWEEN $3 AND $4
                AND op.schet = $5
                AND p.id IS NOT NULL
                ${where}

            UNION ALL 
        
            SELECT 
                d.id, 
                d.doc_num,
                TO_CHAR(d.doc_date, 'YYYY-MM-DD') AS doc_date,
                0::FLOAT AS prixod_sum,
                ch.summa::FLOAT AS rasxod_sum,
                d.opisanie,
                d.id_podotchet_litso AS podotchet_id,
                p.name AS podotchet_name,
                p.rayon AS podotchet_rayon,
                u.login,
                u.fio,
                u.id AS user_id,
                op.schet AS provodki_schet,
                op.sub_schet AS provodki_sub_schet,
                'kassa_prixod' AS type,
                d.doc_date AS                                                   combined_doc_date,
                d.id AS                                                         combined_id,
                d.doc_num AS                                                    combined_doc_num
            FROM kassa_prixod_child ch
            JOIN kassa_prixod AS d ON ch.kassa_prixod_id = d.id
            JOIN spravochnik_podotchet_litso AS p ON p.id = d.id_podotchet_litso 
            JOIN users u ON d.user_id = u.id
            JOIN regions r ON u.region_id = r.id
            JOIN spravochnik_operatsii AS op ON op.id = ch.spravochnik_operatsii_id
            WHERE r.id = $1 AND d.main_schet_id = $2 
                AND d.isdeleted = false  
                AND d.doc_date BETWEEN $3 AND $4
                AND op.schet = $5
                AND p.id IS NOT NULL
                ${where}

            UNION ALL
            
            SELECT 
                d.id, 
                d.doc_num,
                TO_CHAR(d.doc_date, 'YYYY-MM-DD') AS doc_date,
                ch.summa::FLOAT AS prixod_sum,
                0::FLOAT AS rasxod_sum,
                d.opisanie,
                d.id_podotchet_litso AS podotchet_id,
                p.name AS podotchet_name,
                p.rayon AS podotchet_rayon,
                u.login,
                u.fio,
                u.id AS user_id,
                op.schet AS provodki_schet,
                op.sub_schet AS provodki_sub_schet,
                'kassa_rasxod' AS type,
                d.doc_date AS                                                   combined_doc_date,
                d.id AS                                                         combined_id,
                d.doc_num AS                                                    combined_doc_num
            FROM kassa_rasxod_child ch
            JOIN kassa_rasxod AS d ON ch.kassa_rasxod_id = d.id
            JOIN spravochnik_podotchet_litso AS p ON p.id = d.id_podotchet_litso 
            JOIN users u ON d.user_id = u.id
            JOIN regions r ON u.region_id = r.id
            JOIN spravochnik_operatsii AS op ON op.id = ch.spravochnik_operatsii_id
            WHERE r.id = $1 
                AND d.main_schet_id = $2 
                AND d.isdeleted = false
                AND d.doc_date BETWEEN $3 AND $4
                AND op.schet = $5
                AND p.id IS NOT NULL
                ${where}

            UNION ALL 

            SELECT  
                d.id, 
                d.doc_num,
                TO_CHAR(d.doc_date, 'YYYY-MM-DD') AS doc_date,
                0::FLOAT AS prixod_sum,
                ch.summa::FLOAT AS rasxod_sum,
                d.opisanie,
                p.id AS podotchet_id,
                p.name AS podotchet_name,
                p.rayon AS podotchet_rayon,
                u.login,
                u.fio,
                u.id AS user_id,
                op.schet AS provodki_schet,
                op.sub_schet AS provodki_sub_schet,
                'avans' AS type,
                d.doc_date AS                                                   combined_doc_date,
                d.id AS                                                         combined_id,
                d.doc_num AS                                                    combined_doc_num
            FROM avans_otchetlar_jur4_child ch
            JOIN avans_otchetlar_jur4 AS d ON ch.avans_otchetlar_jur4_id = d.id
            JOIN spravochnik_podotchet_litso AS p ON p.id = d.spravochnik_podotchet_litso_id 
            JOIN users u ON d.user_id = u.id
            JOIN regions r ON u.region_id = r.id
            JOIN spravochnik_operatsii AS op ON op.id = ch.spravochnik_operatsii_id
            JOIN jur_schets AS own ON own.id = d.schet_id
            WHERE r.id = $1 
                AND d.main_schet_id = $2 
                AND d.isdeleted = false  
                AND d.doc_date BETWEEN $3 AND $4
                AND p.id IS NOT NULL
                AND own.schet = $5
                ${where}

            ${order} 

            OFFSET $6 LIMIT $7
        `;

    const result = await db.query(query, params);

    return result;
  }

  static async getSumma(params, podotcbet_id = null, search = null) {
    const conditions = [];

    if (podotcbet_id) {
      params.push(podotcbet_id);
      conditions.push(`p.id = $${params.length}`);
    }

    if (search) {
      params.push(search);
      conditions.push(`(
                d.doc_num = $${params.length} OR 
                p.name ILIKE '%' || $${params.length} || '%'
            )`);
    }

    const where = conditions.length ? `AND ${conditions.join(` AND `)}` : ``;

    const query = `--sql
        WITH 
            bank_rasxod AS (
                SELECT 
                    COALESCE(SUM(ch.summa), 0)::FLOAT AS prixod_sum
                FROM bank_rasxod_child ch
                JOIN bank_rasxod AS d ON ch.id_bank_rasxod = d.id
                LEFT JOIN spravochnik_podotchet_litso AS p ON p.id = ch.id_spravochnik_podotchet_litso 
                JOIN users u ON d.user_id = u.id
                JOIN regions r ON u.region_id = r.id
                JOIN spravochnik_operatsii AS op ON op.id = ch.spravochnik_operatsii_id
                JOIN main_schet AS m ON m.id = d.main_schet_id
                WHERE r.id = $1  
                    AND d.isdeleted = false 
                    AND p.id IS NOT NULL
                    AND d.doc_date BETWEEN $2 AND $3
                    AND op.schet = $4
                    AND d.main_schet_id = $5
                    ${where}
            ),

            bank_prixod AS (
                SELECT 
                    COALESCE(SUM(ch.summa), 0)::FLOAT AS rasxod_sum
                FROM bank_prixod_child ch
                JOIN bank_prixod AS d ON ch.id_bank_prixod = d.id
                LEFT JOIN spravochnik_podotchet_litso AS p ON p.id = ch.id_spravochnik_podotchet_litso 
                JOIN users u ON d.user_id = u.id
                JOIN regions r ON u.region_id = r.id
                JOIN spravochnik_operatsii AS op ON op.id = ch.spravochnik_operatsii_id
                JOIN main_schet AS m ON m.id = d.main_schet_id
                WHERE r.id = $1  
                    AND d.isdeleted = false 
                    AND p.id IS NOT NULL
                    AND d.doc_date BETWEEN $2 AND $3
                    AND op.schet = $4
                    AND d.main_schet_id = $5
                    ${where}
            ),

            kassa_prixod AS (
                SELECT 
                    COALESCE(SUM(ch.summa), 0)::FLOAT AS rasxod_sum
                FROM kassa_prixod_child ch
                JOIN kassa_prixod AS d ON ch.kassa_prixod_id = d.id
                JOIN spravochnik_podotchet_litso AS p ON p.id = d.id_podotchet_litso 
                JOIN users u ON d.user_id = u.id
                JOIN regions r ON u.region_id = r.id
                JOIN spravochnik_operatsii AS op ON op.id = ch.spravochnik_operatsii_id
                JOIN main_schet AS m ON m.id = d.main_schet_id
                WHERE r.id = $1  
                    AND d.isdeleted = false 
                    AND p.id IS NOT NULL
                    AND d.doc_date BETWEEN $2 AND $3
                    AND op.schet = $4
                    AND d.main_schet_id = $5
                    ${where}
            ),

            kassa_rasxod AS (
                SELECT 
                    COALESCE(SUM(ch.summa), 0)::FLOAT AS prixod_sum
                FROM kassa_rasxod_child ch
                JOIN kassa_rasxod AS d ON ch.kassa_rasxod_id = d.id
                JOIN spravochnik_podotchet_litso AS p ON p.id = d.id_podotchet_litso 
                JOIN users u ON d.user_id = u.id
                JOIN regions r ON u.region_id = r.id
                JOIN spravochnik_operatsii AS op ON op.id = ch.spravochnik_operatsii_id
                JOIN main_schet AS m ON m.id = d.main_schet_id
                WHERE r.id = $1  
                    AND d.isdeleted = false
                    AND p.id IS NOT NULL
                    AND d.doc_date BETWEEN $2 AND $3
                    AND op.schet = $4
                    AND d.main_schet_id = $5
                    ${where}
            ),

            avans_otchet AS (
                SELECT 
                    COALESCE(SUM(ch.summa), 0)::FLOAT AS rasxod_sum
                FROM avans_otchetlar_jur4_child ch
                JOIN avans_otchetlar_jur4 AS d ON ch.avans_otchetlar_jur4_id = d.id
                JOIN spravochnik_podotchet_litso AS p ON p.id = d.spravochnik_podotchet_litso_id 
                JOIN users u ON d.user_id = u.id
                JOIN regions r ON u.region_id = r.id
                JOIN main_schet AS m ON m.id = d.main_schet_id
                JOIN spravochnik_operatsii AS op ON op.id = ch.spravochnik_operatsii_id
                JOIN jur_schets AS own ON own.id = d.schet_id
                WHERE r.id = $1  
                    AND d.isdeleted = false 
                    AND p.id IS NOT NULL
                    AND d.doc_date BETWEEN $2 AND $3
                    AND own.schet = $4
                    AND d.main_schet_id = $5
                    ${where}
            )
        SELECT 
            (bank_rasxod.prixod_sum + kassa_rasxod.prixod_sum ) AS prixod_sum,
            (bank_prixod.rasxod_sum + kassa_prixod.rasxod_sum + avans_otchet.rasxod_sum) AS rasxod_sum,
            bank_rasxod.prixod_sum AS bank_rasxod_sum,
            kassa_rasxod.prixod_sum AS kassa_rasxod_sum,
            bank_prixod.rasxod_sum AS bank_prixod_sum,
            kassa_prixod.rasxod_sum AS kassa_prixod_sum,
            avans_otchet.rasxod_sum AS avans_otchet_sum,
            (bank_rasxod.prixod_sum + kassa_rasxod.prixod_sum) - 
            (bank_prixod.rasxod_sum + kassa_prixod.rasxod_sum + avans_otchet.rasxod_sum) AS summa
        FROM bank_rasxod
        CROSS JOIN bank_prixod
        CROSS JOIN kassa_prixod
        CROSS JOIN kassa_rasxod
        CROSS JOIN avans_otchet
    `;

    const result = await db.query(query, params);

    return result[0];
  }

  static async getTotalMonitoring(params, podotcbet_id = null, search = null) {
    const conditions = [];

    if (podotcbet_id) {
      params.push(podotcbet_id);
      conditions.push(`p.id = $${params.length}`);
    }

    if (search) {
      params.push(search);
      conditions.push(`(
                d.doc_num = $${params.length} OR 
                p.name ILIKE '%' || $${params.length} || '%'
            )`);
    }

    const where = conditions.length ? `AND ${conditions.join(` AND `)}` : ``;

    const query = `--sql
            WITH 
                bank_rasxod AS (
                    SELECT 
                        COUNT(ch.id)::INT AS doc_count
                    FROM bank_rasxod_child ch
                    JOIN bank_rasxod AS d ON ch.id_bank_rasxod = d.id
                    LEFT JOIN spravochnik_podotchet_litso AS p ON p.id = ch.id_spravochnik_podotchet_litso 
                    JOIN users u ON d.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    JOIN spravochnik_operatsii AS op ON op.id = ch.spravochnik_operatsii_id
                    WHERE r.id = $1 
                        AND d.main_schet_id = $2 
                        AND d.isdeleted = false 
                        AND d.doc_date BETWEEN $3 AND $4
                        AND op.schet = $5
                        AND p.id IS NOT NULL
                        ${where}
                ),

                bank_prixod AS (
                    SELECT 
                        COUNT(ch.id)::INT AS doc_count
                    FROM bank_prixod_child ch
                    JOIN bank_prixod AS d ON ch.id_bank_prixod = d.id
                    LEFT JOIN spravochnik_podotchet_litso AS p ON p.id = ch.id_spravochnik_podotchet_litso 
                    JOIN users u ON d.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    JOIN spravochnik_operatsii AS op ON op.id = ch.spravochnik_operatsii_id
                    WHERE r.id = $1 
                        AND d.main_schet_id = $2 
                        AND d.isdeleted = false 
                        AND d.doc_date BETWEEN $3 AND $4
                        AND op.schet = $5
                        AND p.id IS NOT NULL
                        ${where}
                ),

                kassa_prixod AS (
                    SELECT 
                        COUNT(ch.id)::INT AS doc_count
                    FROM kassa_prixod_child ch
                    JOIN kassa_prixod AS d ON ch.kassa_prixod_id = d.id
                    JOIN spravochnik_podotchet_litso AS p ON p.id = d.id_podotchet_litso 
                    JOIN users u ON d.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    JOIN spravochnik_operatsii AS op ON op.id = ch.spravochnik_operatsii_id
                    WHERE r.id = $1 
                        AND d.main_schet_id = $2 
                        AND d.isdeleted = false 
                        AND d.doc_date BETWEEN $3 AND $4
                        AND op.schet = $5
                        AND p.id IS NOT NULL
                        ${where}
                ),

                kassa_rasxod AS (
                    SELECT 
                        COUNT(ch.id)::INT AS doc_count
                    FROM kassa_rasxod_child ch
                    JOIN kassa_rasxod AS d ON ch.kassa_rasxod_id = d.id
                    JOIN spravochnik_podotchet_litso AS p ON p.id = d.id_podotchet_litso 
                    JOIN users u ON d.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    JOIN spravochnik_operatsii AS op ON op.id = ch.spravochnik_operatsii_id
                    WHERE r.id = $1 
                        AND d.main_schet_id = $2 
                        AND d.isdeleted = false
                        AND d.doc_date BETWEEN $3 AND $4
                        AND op.schet = $5
                        AND p.id IS NOT NULL
                        ${where}
                ),

                avans_otchet AS (
                    SELECT 
                        COUNT(ch.id)::INT AS doc_count
                    FROM avans_otchetlar_jur4_child ch
                    JOIN avans_otchetlar_jur4 AS d ON ch.avans_otchetlar_jur4_id = d.id
                    JOIN spravochnik_podotchet_litso AS p ON p.id = d.spravochnik_podotchet_litso_id 
                    JOIN users u ON d.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    JOIN spravochnik_operatsii AS op ON op.id = ch.spravochnik_operatsii_id
                   JOIN jur_schets AS own ON own.id = d.schet_id
                    WHERE r.id = $1 
                        AND d.main_schet_id = $2 
                        AND d.isdeleted = false 
                        AND d.doc_date BETWEEN $3 AND $4
                        AND own.schet = $5
                        AND p.id IS NOT NULL
                        ${where}
                )
            SELECT 
                (bank_rasxod.doc_count + kassa_rasxod.doc_count + 
                 bank_prixod.doc_count + kassa_prixod.doc_count + 
                 avans_otchet.doc_count
                ) AS total_docs
            FROM bank_rasxod
            CROSS JOIN bank_prixod
            CROSS JOIN kassa_prixod
            CROSS JOIN kassa_rasxod
            CROSS JOIN avans_otchet
            CROSS JOIN podotchet_saldo
        `;
    const result = await db.query(query, params);
    return result[0].total_docs;
  }

  static async capData(params, podotcbet_id = null, search = null) {
    const conditions = [];

    if (podotcbet_id) {
      params.push(podotcbet_id);
      conditions.push(`p.id = $${params.length}`);
    }

    if (search) {
      params.push(search);
      conditions.push(`(
                d.doc_num = $${params.length} OR 
                p.name ILIKE '%' || $${params.length} || '%'
            )`);
    }

    const where = conditions.length ? `AND ${conditions.join(` AND `)}` : ``;

    const query = `--sql
        SELECT 
            COALESCE(SUM(ch.summa), 0)::FLOAT AS summa,
            op.schet,
            op.sub_schet
        FROM avans_otchetlar_jur4_child ch
        JOIN avans_otchetlar_jur4 AS d ON ch.avans_otchetlar_jur4_id = d.id
        JOIN users u ON d.user_id = u.id
        JOIN regions r ON u.region_id = r.id
        JOIN spravochnik_operatsii AS op ON op.id = ch.spravochnik_operatsii_id
        JOIN jur_schets AS own ON own.id = d.schet_id
        WHERE d.isdeleted = false
            AND ch.isdeleted = false
            AND d.main_schet_id = $1
            AND d.doc_date BETWEEN $2 AND $3
            AND r.id = $4
            AND own.schet = $5
            AND d.spravochnik_podotchet_litso_id IS NOT NULL
            ${where}
        GROUP BY op.schet,
            op.sub_schet

        UNION ALL
        
        SELECT 
            COALESCE(SUM(ch.summa), 0)::FLOAT AS summa,
            op.schet,
            op.sub_schet
        FROM bank_prixod_child ch
        JOIN bank_prixod AS d ON ch.id_bank_prixod = d.id
        LEFT JOIN spravochnik_podotchet_litso AS p ON p.id = ch.id_spravochnik_podotchet_litso 
        JOIN users u ON d.user_id = u.id
        JOIN regions r ON u.region_id = r.id
        JOIN spravochnik_operatsii AS op ON op.id = ch.spravochnik_operatsii_id
        JOIN main_schet AS m ON m.id = d.main_schet_id
        WHERE d.isdeleted = false
            AND ch.isdeleted = false
            AND d.main_schet_id = $1
            AND d.doc_date BETWEEN $2 AND $3
            AND r.id = $4
            AND op.schet = $5
            AND ch.id_spravochnik_podotchet_litso IS NOT NULL
            ${where}
        GROUP BY op.schet,
            op.sub_schet

            UNION ALL 

            SELECT 
                COALESCE(SUM(ch.summa), 0)::FLOAT AS summa,
                op.schet,
                op.sub_schet
            FROM kassa_prixod_child ch
            JOIN kassa_prixod AS d ON ch.kassa_prixod_id = d.id
            JOIN spravochnik_podotchet_litso AS p ON p.id = d.id_podotchet_litso 
            JOIN users u ON d.user_id = u.id
            JOIN regions r ON u.region_id = r.id
            JOIN spravochnik_operatsii AS op ON op.id = ch.spravochnik_operatsii_id
            JOIN main_schet AS m ON m.id = d.main_schet_id
            WHERE d.isdeleted = false
            AND ch.isdeleted = false
            AND d.main_schet_id = $1
            AND d.doc_date BETWEEN $2 AND $3
            AND r.id = $4
            AND op.schet = $5
            AND d.id_podotchet_litso IS NOT NULL
            ${where}
        GROUP BY op.schet,
            op.sub_schet
    `;

    const result = await db.query(query, params);

    return result;
  }
};
