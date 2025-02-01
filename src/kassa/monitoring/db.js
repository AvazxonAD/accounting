const { db } = require('../../db/index');

exports.KassaMonitoringDB = class {
    static async get(params) {
        const query = `
            WITH data AS (
                SELECT 
                    kp.id, 
                    kp.doc_num,
                    TO_CHAR(kp.doc_date, 'YYYY-MM-DD') AS doc_date,
                    kp.summa::FLOAT AS prixod_sum,
                    0::FLOAT AS rasxod_sum,
                    kp.id_podotchet_litso,
                    spravochnik_podotchet_litso.name AS spravochnik_podotchet_litso_name,
                    kp.opisanie,
                    kp.doc_date AS combined_date,
                    u.login,
                    u.fio,
                    u.id AS user_id,
                    (
                        SELECT ARRAY_AGG(row_to_json(k_p_ch))
                        FROM (
                            SELECT 
                                s_o.schet AS provodki_schet,
                                s_o.sub_schet AS provodki_sub_schet
                            FROM kassa_prixod_child AS k_p_ch
                            JOIN spravochnik_operatsii AS s_o ON s_o.id = k_p_ch.spravochnik_operatsii_id
                            WHERE  k_p_ch.kassa_prixod_id = kp.id 
                        ) AS k_p_ch
                    ) AS provodki_array
                FROM kassa_prixod kp
                JOIN users u ON kp.user_id = u.id
                JOIN regions r ON u.region_id = r.id
                LEFT JOIN spravochnik_podotchet_litso ON spravochnik_podotchet_litso.id = kp.id_podotchet_litso
                WHERE r.id = $1 
                  AND kp.main_schet_id = $2
                  AND kp.doc_date BETWEEN $3 AND $4 
                  AND kp.isdeleted = false

                UNION ALL

                SELECT 
                    kr.id, 
                    kr.doc_num,
                    TO_CHAR(kr.doc_date, 'YYYY-MM-DD') AS doc_date,
                    0::FLOAT AS prixod_sum,
                    kr.summa::FLOAT AS rasxod_sum,
                    kr.id_podotchet_litso,
                    spravochnik_podotchet_litso.name,
                    kr.opisanie,
                    kr.doc_date AS combined_date,
                    u.login,
                    u.fio,
                    u.id AS user_id,
                    (
                        SELECT ARRAY_AGG(row_to_json(k_r_ch))
                        FROM (
                            SELECT 
                                s_o.schet AS provodki_schet,
                                s_o.sub_schet AS provodki_sub_schet
                            FROM kassa_rasxod_child AS k_r_ch
                            JOIN spravochnik_operatsii AS s_o ON s_o.id = k_r_ch.spravochnik_operatsii_id
                            WHERE  k_r_ch.kassa_rasxod_id = kr.id 
                        ) AS k_r_ch
                    ) AS provodki_array
                FROM kassa_rasxod kr
                JOIN users u ON kr.user_id = u.id
                JOIN regions r ON u.region_id = r.id
                LEFT JOIN spravochnik_podotchet_litso ON spravochnik_podotchet_litso.id = kr.id_podotchet_litso
                WHERE r.id = $1 
                  AND kr.main_schet_id = $2
                  AND kr.doc_date BETWEEN $3 AND $4 
                  AND kr.isdeleted = false
                
                  ORDER BY combined_date
                OFFSET $5 LIMIT $6
            ) 
            SELECT 
                ARRAY_AGG(row_to_json(data)) AS data,
                ( 
                    (
                        SELECT COALESCE(COUNT(kr.id), 0) 
                        FROM kassa_rasxod kr
                        JOIN users u ON kr.user_id = u.id
                        JOIN regions r ON u.region_id = r.id
                        WHERE r.id = $1 
                            AND kr.main_schet_id = $2 
                            AND kr.doc_date BETWEEN $3 AND $4 
                            AND kr.isdeleted = false
                    ) +
                    (
                        SELECT COALESCE(COUNT(p.id), 0) 
                        FROM kassa_prixod p
                        JOIN users u ON p.user_id = u.id
                        JOIN regions r ON u.region_id = r.id
                        WHERE r.id = $1 
                            AND p.main_schet_id = $2 
                            AND p.doc_date BETWEEN $3 AND $4 
                            AND p.isdeleted = false
                    )
                )::INTEGER AS total_count
            FROM data
        `;

        const result = await db.query(query, params);

        return { data: result[0].data || [], total_count: result[0].total_count };
    };

    static async getSumma(params, operator) {
        const query = `
            WITH prixod AS (
                SELECT 
                    COALESCE(SUM(kp.summa), 0)::FLOAT AS summa
                FROM kassa_prixod kp
                JOIN users u ON kp.user_id = u.id
                JOIN regions r ON u.region_id = r.id
                WHERE r.id = $1 
                    AND kp.main_schet_id = $2 
                    AND kp.doc_date ${operator} $3 
                    AND kp.isdeleted = false
            ), 
            rasxod AS (
                SELECT 
                    COALESCE(SUM(kr.summa), 0)::FLOAT AS summa
                FROM kassa_rasxod kr
                JOIN users u ON kr.user_id = u.id
                JOIN regions r ON u.region_id = r.id
                WHERE r.id = $1 
                    AND kr.main_schet_id = $2 
                    AND kr.doc_date ${operator} $3 
                    AND kr.isdeleted = false
            )
            SELECT 
                prixod.summa AS prixod_summa,
                rasxod.summa AS rasxod_summa,
                (prixod.summa - rasxod.summa) AS summa
            FROM prixod, rasxod;
        `;

        const result = await db.query(query, params);

        return result[0];
    }

    static async cap(params) {
        const qeury = `
            WITH data AS (
                SELECT s_o.schet, COALESCE(SUM(k_p_ch.summa), 0)::FLOAT AS prixod_sum, 0 AS rasxod_sum 
                FROM kassa_prixod k_p
                JOIN users AS u ON u.id = k_p.user_id
                JOIN regions AS r ON r.id = u.region_id
                JOIN kassa_prixod_child AS k_p_ch ON k_p.id = k_p_ch.kassa_prixod_id 
                JOIN spravochnik_operatsii AS s_o ON s_o.id = k_p_ch.spravochnik_operatsii_id
                WHERE r.id = $1 AND k_p.main_schet_id = $2 AND k_p.doc_date BETWEEN $3 AND $4 AND k_p.isdeleted = false
                GROUP BY s_o.schet
                UNION ALL 
                SELECT s_o.schet, 0 AS prixod_sum, SUM(k_r_ch.summa)::FLOAT AS rasxod_sum 
                FROM kassa_rasxod k_r
                JOIN users AS u ON u.id = k_r.user_id
                JOIN regions AS r ON r.id = u.region_id
                JOIN kassa_rasxod_child AS k_r_ch ON k_r.id = k_r_ch.kassa_rasxod_id 
                JOIN spravochnik_operatsii AS s_o ON s_o.id = k_r_ch.spravochnik_operatsii_id
                WHERE r.id = $1 AND k_r.main_schet_id = $2 AND k_r.doc_date BETWEEN $3 AND $4 AND k_r.isdeleted = false
                GROUP BY s_o.schet
            )
            SELECT 
                ARRAY_AGG(row_to_json(data)) AS data,
                (
                    COALESCE((SELECT SUM(k_p_ch.summa)
                    FROM kassa_prixod k_p
                    JOIN users AS u ON u.id = k_p.user_id
                    JOIN regions AS r ON r.id = u.region_id
                    JOIN kassa_prixod_child AS k_p_ch ON k_p.id = k_p_ch.kassa_prixod_id 
                    JOIN spravochnik_operatsii AS s_o ON s_o.id = k_p_ch.spravochnik_operatsii_id
                    WHERE r.id = $1 AND k_p.main_schet_id = $2 AND k_p.doc_date < $3 AND k_p.isdeleted = false), 0) -
                    COALESCE((SELECT SUM(k_r_ch.summa) 
                    FROM kassa_rasxod k_r
                    JOIN users AS u ON u.id = k_r.user_id
                    JOIN regions AS r ON r.id = u.region_id
                    JOIN kassa_rasxod_child AS k_r_ch ON k_r.id = k_r_ch.kassa_rasxod_id 
                    JOIN spravochnik_operatsii AS s_o ON s_o.id = k_r_ch.spravochnik_operatsii_id
                    WHERE r.id = $1 AND k_r.main_schet_id = $2 AND k_r.doc_date < $3 AND k_r.isdeleted = false), 0) 
                )::FLOAT AS balance_from,
                (
                    COALESCE((SELECT SUM(k_p_ch.summa) 
                    FROM kassa_prixod k_p
                    JOIN users AS u ON u.id = k_p.user_id
                    JOIN regions AS r ON r.id = u.region_id
                    JOIN kassa_prixod_child AS k_p_ch ON k_p.id = k_p_ch.kassa_prixod_id 
                    JOIN spravochnik_operatsii AS s_o ON s_o.id = k_p_ch.spravochnik_operatsii_id
                    WHERE r.id = $1 AND k_p.main_schet_id = $2 AND k_p.doc_date <= $4 AND k_p.isdeleted = false), 0) -
                    COALESCE((SELECT SUM(k_r_ch.summa)
                    FROM kassa_rasxod k_r
                    JOIN users AS u ON u.id = k_r.user_id
                    JOIN regions AS r ON r.id = u.region_id
                    JOIN kassa_rasxod_child AS k_r_ch ON k_r.id = k_r_ch.kassa_rasxod_id 
                    JOIN spravochnik_operatsii AS s_o ON s_o.id = k_r_ch.spravochnik_operatsii_id
                    WHERE r.id = $1 AND k_r.main_schet_id = $2 AND k_r.doc_date <= $4 AND k_r.isdeleted = false), 0) 
                )::FLOAT AS balance_to
            FROM data
        `;

        const result = await db.query(qeury, params);

        let prixod_sum = 0
        let rasxod_sum = 0
        result[0].data?.forEach(item => {
            prixod_sum += item.prixod_sum
            rasxod_sum += item.rasxod_sum
        })
        return { prixod_sum, rasxod_sum, data: result[0]?.data || [], balance_from: result[0].balance_from, balance_to: result[0]?.balance_to }
    }
}