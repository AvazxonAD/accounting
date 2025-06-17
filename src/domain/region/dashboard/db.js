const { db } = require("@db/index");

exports.DashboardDB = class {
  static async getBudjet(params, budjet_id, main_schet_id) {
    let main_schet_filter = "";
    let budjet_filter = ``;

    if (main_schet_id) {
      params.push(main_schet_id);
      main_schet_filter = `AND m.id = $${params.length}`;
    }

    if (budjet_id) {
      params.push(budjet_id);
      budjet_filter = `AND b.id = $${params.length}`;
    }

    const query = `
        SELECT
            b.*,
            COALESCE(
                (
                    SELECT
                        JSON_AGG(
                            json_build_object(
                                'main_schet', row_to_json(m),
                                'id', m.id,
                                'user_id', m.user_id,  
                                'jur4_schets', (
                                    SELECT JSON_AGG(row_to_json(sch))
                                    FROM jur_schets sch
                                    WHERE sch.main_schet_id = m.id
                                        AND sch.isdeleted = false
                                        AND sch.type = 'jur4'
                                )
                            )
                        )
                    FROM main_schet m
                    JOIN users u ON u.id = m.user_id
                    JOIN regions r ON r.id = u.region_id
                    WHERE m.isdeleted = false
                        AND r.id = $1
                        AND m.spravochnik_budjet_name_id = b.id
                        ${main_schet_filter}
                ), '[]'::json
            ) AS main_schets
        FROM spravochnik_budjet_name b
        WHERE b.isdeleted = false
            ${budjet_filter}
    `;

    const result = await db.query(query, params);

    return result;
  }

  static async kassa(params) {
    const query = `--sql
        WITH 
            kassa_prixod AS (
                SELECT 
                    COALESCE(SUM(ch.summa), 0)::FLOAT AS prixod_sum
                FROM kassa_prixod p
                JOIN kassa_prixod_child ch ON ch.kassa_prixod_id = p.id
                WHERE p.main_schet_id = $1
                    AND ch.isdeleted = false
                    AND p.doc_date BETWEEN $2 AND $3
                    AND p.isdeleted = false
            ),
            kassa_rasxod AS (
                SELECT 
                    COALESCE(SUM(ch.summa), 0)::FLOAT AS rasxod_sum
                FROM kassa_rasxod r
                JOIN kassa_rasxod_child ch ON ch.kassa_rasxod_id = r.id
                WHERE r.main_schet_id = $1
                    AND ch.isdeleted = false
                    AND r.doc_date BETWEEN $2 AND $3
                    AND r.isdeleted = false
            )
        SELECT 
            kassa_prixod.prixod_sum,
            kassa_rasxod.rasxod_sum,
            (kassa_prixod.prixod_sum - kassa_rasxod.rasxod_sum)::FLOAT AS summa
        FROM kassa_prixod
        CROSS JOIN kassa_rasxod;
    `;

    const result = await db.query(query, params);

    return result[0];
  }

  static async bank(params) {
    const query = `--sql
        WITH 
            bank_prixod AS (
                SELECT 
                    COALESCE(SUM(ch.summa), 0)::FLOAT AS prixod_sum
                FROM bank_prixod p
                JOIN bank_prixod_child ch ON ch.id_bank_prixod = p.id
                WHERE p.main_schet_id = $1
                    AND p.doc_date BETWEEN $2 AND $3
                    AND ch.isdeleted = false
                    AND p.isdeleted = false
            ),
            bank_rasxod AS (
                SELECT 
                    COALESCE(SUM(ch.summa), 0)::FLOAT AS rasxod_sum
                FROM bank_rasxod r
                JOIN bank_rasxod_child ch ON ch.id_bank_rasxod = r.id
                WHERE r.main_schet_id = $1
                    AND r.doc_date BETWEEN $2 AND $3
                    AND ch.isdeleted = false
                    AND r.isdeleted = false
            )
        SELECT 
            bank_prixod.prixod_sum,
            bank_rasxod.rasxod_sum,
            (bank_prixod.prixod_sum - bank_rasxod.rasxod_sum)::FLOAT AS summa
        FROM bank_prixod
        CROSS JOIN bank_rasxod;
    `;

    const result = await db.query(query, params);

    return result[0];
  }

  static async podotchet(params) {
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
                    WHERE d.isdeleted = false
                        AND ch.isdeleted = false 
                        AND m.id = $1
                        AND d.doc_date BETWEEN $2 AND $3
                        AND p.id = $4
                        AND r.id = $5
                        AND op.schet = $6
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
                    WHERE d.isdeleted = false
                        AND ch.isdeleted = false 
                        AND m.id = $1
                        AND d.doc_date BETWEEN $2 AND $3
                        AND p.id = $4
                        AND r.id = $5
                        AND op.schet = $6
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
                    WHERE d.isdeleted = false
                        AND ch.isdeleted = false 
                        AND m.id = $1
                        AND d.doc_date BETWEEN $2 AND $3
                        AND p.id = $4
                        AND r.id = $5
                        AND op.schet = $6 
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
                    WHERE d.isdeleted = false
                        AND ch.isdeleted = false 
                        AND m.id = $1
                        AND d.doc_date BETWEEN $2 AND $3
                        AND p.id = $4
                        AND r.id = $5
                        AND op.schet = $6
                ),
                avans_otchet AS (
                    SELECT 
                        COALESCE(SUM(ch.summa), 0)::FLOAT AS rasxod_sum
                    FROM avans_otchetlar_jur4_child ch
                    JOIN avans_otchetlar_jur4 AS d ON ch.avans_otchetlar_jur4_id = d.id
                    JOIN spravochnik_podotchet_litso AS p ON p.id = d.spravochnik_podotchet_litso_id 
                    JOIN users u ON d.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    JOIN jur_schets AS j ON j.id = d.schet_id
                    JOIN main_schet AS m ON m.id = d.main_schet_id
                    WHERE d.isdeleted = false
                        AND ch.isdeleted = false 
                        AND m.id = $1
                        AND d.doc_date BETWEEN $2 AND $3
                        AND p.id = $4
                        AND r.id = $5
                        AND j.schet = $6
                ),
                work_trip AS (
                    SELECT 
                        COALESCE(SUM(ch.summa), 0)::FLOAT AS rasxod_sum
                    FROM work_trip_child ch
                    JOIN work_trip AS d ON ch.parent_id = d.id
                    JOIN spravochnik_podotchet_litso AS p ON p.id = d.worker_id 
                    JOIN users u ON d.user_id = u.id
                    JOIN regions r ON u.region_id = r.id
                    JOIN jur_schets AS j ON j.id = d.schet_id
                    JOIN main_schet AS m ON m.id = d.main_schet_id
                    WHERE d.isdeleted = false
                        AND ch.isdeleted = false 
                        AND m.id = $1
                        AND d.doc_date BETWEEN $2 AND $3
                        AND p.id = $4
                        AND r.id = $5
                        AND j.schet = $6
                )
            SELECT 
                (bank_rasxod.prixod_sum + kassa_rasxod.prixod_sum)::FLOAT AS prixod_sum, 
                (bank_prixod.rasxod_sum + kassa_prixod.rasxod_sum + avans_otchet.rasxod_sum)::FLOAT AS rasxod_sum,
                (bank_rasxod.prixod_sum + kassa_rasxod.prixod_sum)::FLOAT -
                (bank_prixod.rasxod_sum + kassa_prixod.rasxod_sum + avans_otchet.rasxod_sum)::FLOAT AS summa
            FROM bank_rasxod
            CROSS JOIN bank_prixod
            CROSS JOIN kassa_prixod
            CROSS JOIN kassa_rasxod
            CROSS JOIN avans_otchet
        `;

    const result = await db.query(query, params);

    return result[0];
  }
};
