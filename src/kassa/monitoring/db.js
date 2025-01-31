const {db} = require('../../db/index');

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

        return result[0];
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
}