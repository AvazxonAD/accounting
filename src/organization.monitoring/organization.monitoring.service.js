const pool = require("../config/db");
const ErrorResponse = require("../utils/errorResponse");


const aktSverkaService = async (region_id, shartnoma_id, from, to, organization_id) => {
    try {
        let shartnoma_filter = ``
        const params = [region_id, organization_id, from, to]
        if (shartnoma_id) {
            shartnoma_filter = `AND sh_o.id = $${params.length + 1}`
            params.push(shartnoma_id)
        };
        const filter = `sh_o.isdeleted = false AND r.id = $1 AND sh_o.spravochnik_organization_id = $2 ${shartnoma_filter}`;
        const { rows } = await pool.query(`--sql
                SELECT 
                    sh_o.id,
                    sh_o.doc_num,
                    TO_CHAR(sh_o.doc_date, 'YYYY-MM-DD') AS doc_date,
                    sh_o.opisanie,
                    o.name AS organization_name,
                    (SELECT 
                        (SELECT ARRAY_AGG(row_to_json(operatsii))
                            FROM (SELECT 
                                    b_r_ch.id,
                                    b_r_ch.id_shartnomalar_organization AS shartnoma_id,
                                    b_r_ch.doc_num,
                                    b_r_ch.doc_date,
                                    b_r_ch.opisanie,
                                    0 AS summa_rasxod, 
                                    b_r_ch.summa AS summa_prixod 
                                FROM bank_rasxod b_r_ch
                                JOIN users AS u ON u.id = b_r_ch.user_id 
                                WHERE b_r_ch.isdeleted = false AND b_r_ch.id_shartnomalar_organization = sh_o.id AND b_r_ch.doc_date BETWEEN $3 AND $4
                                UNION ALL 
                                SELECT 
                                    b_i_j3_ch.id,
                                    b_i_j3_ch.shartnomalar_organization_id AS shartnoma_id,
                                    b_i_j3_ch.doc_num,
                                    b_i_j3_ch.doc_date,
                                    b_i_j3_ch.opisanie,
                                    b_i_j3_ch.summa AS summa_rasxod,  
                                    0 AS summa_prixod 
                                FROM bajarilgan_ishlar_jur3 AS b_i_j3_ch
                                JOIN users AS u ON b_i_j3_ch.user_id = u.id
                                WHERE b_i_j3_ch.isdeleted = false AND b_i_j3_ch.shartnomalar_organization_id = sh_o.id AND b_i_j3_ch.doc_date BETWEEN $3 AND $4
                                UNION ALL 
                                SELECT 
                                    b_p_ch.id,
                                    b_p_ch.id_shartnomalar_organization AS shartnoma_id,
                                    b_p_ch.doc_num,
                                    b_p_ch.doc_date,
                                    b_p_ch.opisanie,
                                    b_p_ch.summa AS summa_rasxod, 
                                    0 AS summa_prixod
                                FROM bank_prixod AS b_p_ch
                                JOIN users AS u ON u.id = b_p_ch.user_id
                                WHERE b_p_ch.isdeleted = false AND  b_p_ch.id_shartnomalar_organization = sh_o.id AND b_p_ch.doc_date BETWEEN $3 AND $4
                                UNION ALL
                                SELECT 
                                    k_h_j152.id, -- O'zgartirilgan qism
                                    k_h_j152.shartnomalar_organization_id AS shartnoma_id,
                                    k_h_j152.doc_num,
                                    k_h_j152.doc_date,
                                    k_h_j152.opisanie,
                                    0 AS summa_rasxod, 
                                    k_h_j152.summa AS summa_prixod 
                                FROM kursatilgan_hizmatlar_jur152 AS k_h_j152
                                WHERE k_h_j152.isdeleted = false AND k_h_j152.shartnomalar_organization_id = sh_o.id AND k_h_j152.doc_date BETWEEN $3 AND $4
                            ) AS operatsii
                        ) 
                    ) AS array,
                    (
                        COALESCE((SELECT SUM(k_h_j152.summa) 
                            FROM kursatilgan_hizmatlar_jur152 AS k_h_j152 
                            JOIN shartnomalar_organization AS sh_o 
                            ON sh_o.id = k_h_j152.shartnomalar_organization_id
                            WHERE k_h_j152.isdeleted = false AND ${filter} AND k_h_j152.doc_date BETWEEN $3 AND $4), 0) + 
                        COALESCE((SELECT SUM(b_r.summa) 
                            FROM bank_rasxod AS b_r
                            JOIN shartnomalar_organization AS sh_o 
                            ON sh_o.id = b_r.id_shartnomalar_organization
                            WHERE b_r.isdeleted = false AND ${filter} AND b_r.doc_date BETWEEN $3 AND $4), 0)
                    )::FLOAT AS summa_prixod,
                    (
                        COALESCE((SELECT SUM(b_i_j152.summa) 
                            FROM bajarilgan_ishlar_jur3 AS b_i_j152 
                            JOIN shartnomalar_organization AS sh_o 
                            ON sh_o.id = b_i_j152.shartnomalar_organization_id
                            WHERE b_i_j152.isdeleted = false AND ${filter} AND b_i_j152.doc_date BETWEEN $3 AND $4), 0) + 
                        COALESCE((SELECT SUM(b_p.summa) 
                            FROM bank_prixod AS b_p
                            JOIN shartnomalar_organization AS sh_o 
                            ON sh_o.id = b_p.id_shartnomalar_organization
                            WHERE b_p.isdeleted = false AND ${filter} AND b_p.doc_date BETWEEN $3 AND $4), 0)
                    )::FLOAT AS summa_rasxod,
                    (
                        (
                            COALESCE((SELECT SUM(k_h_j152.summa) 
                                FROM kursatilgan_hizmatlar_jur152 AS k_h_j152 
                                JOIN shartnomalar_organization AS sh_o 
                                ON sh_o.id = k_h_j152.shartnomalar_organization_id
                                WHERE k_h_j152.isdeleted = false AND ${filter} AND k_h_j152.doc_date <= $3), 0) + 
                            COALESCE((SELECT SUM(b_r.summa) 
                                FROM bank_rasxod AS b_r
                                JOIN shartnomalar_organization AS sh_o 
                                ON sh_o.id = b_r.id_shartnomalar_organization
                                WHERE b_r.isdeleted = false AND ${filter} AND b_r.doc_date <= $3), 0)
                        ) - 
                        (
                            COALESCE((SELECT SUM(b_i_j152.summa) 
                                FROM bajarilgan_ishlar_jur3 AS b_i_j152 
                                JOIN shartnomalar_organization AS sh_o 
                                ON sh_o.id = b_i_j152.shartnomalar_organization_id
                                WHERE b_i_j152.isdeleted = false AND ${filter} AND b_i_j152.doc_date <= $3), 0) + 
                            COALESCE((SELECT SUM(b_p.summa) 
                                FROM bank_prixod AS b_p
                                JOIN shartnomalar_organization AS sh_o 
                                ON sh_o.id = b_p.id_shartnomalar_organization
                                WHERE b_p.isdeleted = false AND ${filter} AND b_p.doc_date <= $3), 0)
                        )
                    )::FLOAT AS summa_from,
                    (
                        (
                            COALESCE((SELECT SUM(k_h_j152.summa) 
                                FROM kursatilgan_hizmatlar_jur152 AS k_h_j152 
                                JOIN shartnomalar_organization AS sh_o 
                                ON sh_o.id = k_h_j152.shartnomalar_organization_id
                                WHERE k_h_j152.isdeleted = false AND ${filter} AND k_h_j152.doc_date <= $4), 0) + 
                            COALESCE((SELECT SUM(b_r.summa) 
                                FROM bank_rasxod AS b_r
                                JOIN shartnomalar_organization AS sh_o 
                                ON sh_o.id = b_r.id_shartnomalar_organization
                                WHERE b_r.isdeleted = false AND ${filter} AND b_r.doc_date <= $4), 0)
                        ) - 
                        (
                            COALESCE((SELECT SUM(b_i_j152.summa) 
                                FROM bajarilgan_ishlar_jur3 AS b_i_j152 
                                JOIN shartnomalar_organization AS sh_o 
                                ON sh_o.id = b_i_j152.shartnomalar_organization_id
                                WHERE b_i_j152.isdeleted = false AND ${filter} AND b_i_j152.doc_date <= $4), 0) + 
                            COALESCE((SELECT SUM(b_p.summa) 
                                FROM bank_prixod AS b_p
                                JOIN shartnomalar_organization AS sh_o 
                                ON sh_o.id = b_p.id_shartnomalar_organization
                                WHERE b_p.isdeleted = false AND ${filter} AND b_p.doc_date <= $4), 0)
                        )
                    )::FLOAT AS summa_to
                FROM shartnomalar_organization AS sh_o
                JOIN spravochnik_organization AS o ON o.id = sh_o.spravochnik_organization_id
                JOIN users AS u ON sh_o.user_id = u.id
                JOIN regions AS r ON u.region_id = r.id
                WHERE ${filter}
        `, params);
        const data = rows[0]
        return data
    } catch (error) {
        throw new ErrorResponse(error, error.statusCode)
    }
}

const organizationPrixodRasxodService = async (region_id, to, budjet_id, schet) => {
    try {
        const organizations = await pool.query(`--sql
            SELECT organ.id, organ.name 
            FROM spravochnik_organization AS organ
            JOIN users AS u ON u.id = organ.user_id
            JOIN regions AS r ON r.id = u.region_id
            WHERE r.id = $1 AND organ.isdeleted = false    
        `, [region_id])
        for (let organ of organizations.rows) {
            const summa_to = await pool.query(`--sql
                WITH 
                kursatilgan_hizmatlar_sum AS (
                    SELECT COALESCE(SUM(k_h_j152_ch.summa), 0)::FLOAT AS summa
                    FROM kursatilgan_hizmatlar_jur152_child AS k_h_j152_ch
                    JOIN kursatilgan_hizmatlar_jur152 AS k_h_j152 ON k_h_j152.id = k_h_j152_ch.kursatilgan_hizmatlar_jur152_id 
                    JOIN users AS u ON k_h_j152.user_id = u.id
                    JOIN regions AS r ON r.id = u.region_id
                    LEFT JOIN shartnomalar_organization AS sh_o ON sh_o.id = k_h_j152.shartnomalar_organization_id
                    LEFT JOIN smeta AS s ON sh_o.smeta_id = s.id
                    JOIN spravochnik_organization AS s_o ON s_o.id = k_h_j152.id_spravochnik_organization
                    JOIN spravochnik_operatsii AS s_o_p ON s_o_p.id = k_h_j152.spravochnik_operatsii_own_id
                    JOIN main_schet AS m_sch ON  m_sch.id = k_h_j152.main_schet_id
                    WHERE k_h_j152.isdeleted = false
                      AND r.id = $1
                      AND s_o_p.schet = $2
                      AND k_h_j152.doc_date <= $3
                      AND k_h_j152.id_spravochnik_organization = $4
                      AND m_sch.spravochnik_budjet_name_id = $5
                ),
                bajarilgan_ishlar_sum AS (
                    SELECT COALESCE(SUM(b_i_j3.summa), 0)::FLOAT AS summa
                    FROM bajarilgan_ishlar_jur3_child AS b_i_j3_ch
                    JOIN bajarilgan_ishlar_jur3 AS b_i_j3 ON b_i_j3.id = b_i_j3_ch.bajarilgan_ishlar_jur3_id 
                    JOIN users AS u ON b_i_j3.user_id = u.id
                    JOIN regions AS r ON r.id = u.region_id
                    LEFT JOIN shartnomalar_organization AS sh_o ON sh_o.id = b_i_j3.shartnomalar_organization_id
                    LEFT JOIN smeta AS s ON sh_o.smeta_id = s.id
                    JOIN spravochnik_organization AS s_o ON s_o.id = b_i_j3.id_spravochnik_organization
                    JOIN spravochnik_operatsii AS s_o_p ON s_o_p.id = b_i_j3.spravochnik_operatsii_own_id
                    JOIN main_schet AS m_sch ON  m_sch.id = b_i_j3.main_schet_id
                    WHERE b_i_j3.isdeleted = false
                      AND r.id = $1
                      AND s_o_p.schet = $2
                      AND b_i_j3.doc_date <= $3
                      AND b_i_j3.id_spravochnik_organization = $4
                      AND m_sch.spravochnik_budjet_name_id = $5
                      ),
                rasxod_sum AS (
                    SELECT COALESCE(SUM(b_r_ch.summa), 0)::FLOAT AS summa
                    FROM bank_rasxod b_r
                    JOIN users AS u ON u.id = b_r.user_id
                    JOIN regions AS r ON r.id = u.region_id
                    JOIN spravochnik_organization AS s_o ON s_o.id = b_r.id_spravochnik_organization
                    JOIN bank_rasxod_child AS b_r_ch ON b_r_ch.id_bank_rasxod = b_r.id
                    JOIN spravochnik_operatsii AS s_o_p ON s_o_p.id = b_r_ch.spravochnik_operatsii_id
                    JOIN main_schet AS m_sch ON  m_sch.id = b_r.main_schet_id
                    WHERE b_r.isdeleted = false
                      AND r.id = $1
                      AND s_o_p.schet = $2
                      AND b_r.doc_date <= $3
                      AND b_r.id_spravochnik_organization = $4
                      AND m_sch.spravochnik_budjet_name_id = $5
                ),
                prixod_sum AS (
                    SELECT COALESCE( SUM(b_p_ch.summa), 0)::FLOAT AS summa
                    FROM bank_prixod b_p
                    JOIN users AS u ON u.id = b_p.user_id
                    JOIN regions AS r ON r.id = u.region_id
                    JOIN spravochnik_organization AS s_o ON s_o.id = b_p.id_spravochnik_organization
                    JOIN bank_prixod_child AS b_p_ch ON b_p_ch.id_bank_prixod = b_p.id
                    JOIN spravochnik_operatsii AS s_o_p ON s_o_p.id = b_p_ch.spravochnik_operatsii_id
                    JOIN main_schet AS m_sch ON  m_sch.id = b_p.main_schet_id
                    WHERE b_p.isdeleted = false
                      AND r.id = $1
                      AND s_o_p.schet = $2
                      AND b_p.doc_date <= $3
                      AND b_p.id_spravochnik_organization = $4
                      AND m_sch.spravochnik_budjet_name_id = $5
                )
                SELECT 
                    (
                        (kursatilgan_hizmatlar_sum.summa + rasxod_sum.summa) 
                        - (bajarilgan_ishlar_sum.summa + prixod_sum.summa)
                    ) AS summa_to
                FROM kursatilgan_hizmatlar_sum, bajarilgan_ishlar_sum, rasxod_sum, prixod_sum
            `, [region_id, schet, to, organ.id, budjet_id]);
            organ.summa = summa_to.rows[0].summa_to
        }
        return { data: organizations.rows }
    } catch (error) {
        throw new ErrorResponse(error, error.statusCode)
    }
}


const orderOrganizationService = async (region_id, schet, from, to) => {
    try {
        const main_data = await pool.query(`--sql
            WITH data AS (
                SELECT
                    s_o.id AS organization_id,
                    s_o.name AS organization_name,
                    (
                        ( 
                            SELECT COALESCE(SUM(b_r_ch.summa), 0)::FLOAT
                            FROM bank_rasxod_child AS b_r_ch 
                            JOIN users AS u ON u.id = b_r_ch.user_id
                            JOIN regions AS r ON r.id = u.region_id
                            JOIN spravochnik_operatsii AS s_op ON s_op.id = b_r_ch.spravochnik_operatsii_id 
                            JOIN bank_rasxod AS b_r ON b_r.id = b_r_ch.id_bank_rasxod
                            WHERE r.id = $1 AND s_op.schet = $2 AND b_r.doc_date < $3 AND b_r.id_spravochnik_organization = s_o.id
                        ) - 
                        ( 
                            (SELECT COALESCE(SUM(b_p_ch.summa), 0)::FLOAT
                                FROM bank_prixod_child AS b_p_ch 
                                JOIN users AS u ON u.id = b_p_ch.user_id
                                JOIN regions AS r ON r.id = u.region_id
                                JOIN spravochnik_operatsii AS s_op ON s_op.id = b_p_ch.spravochnik_operatsii_id 
                                JOIN bank_prixod AS b_p ON b_p.id = b_p_ch.id_bank_prixod
                                WHERE r.id = $1 AND s_op.schet = $2 AND b_p.doc_date < $3 AND b_p.id_spravochnik_organization = s_o.id) + 
                            (SELECT COALESCE(SUM(b_i_j3.summa), 0)
                                FROM bajarilgan_ishlar_jur3 AS b_i_j3 
                                JOIN users AS u ON u.id = b_i_j3.user_id
                                JOIN regions AS r ON r.id = u.region_id
                                JOIN spravochnik_operatsii AS s_own_o ON s_own_o.id = b_i_j3.spravochnik_operatsii_own_id 
                                WHERE r.id = $1 AND s_own_o.schet = $2 AND b_i_j3.doc_date < $3 AND b_i_j3.id_spravochnik_organization = s_o.id
                            )
                        )
                    ) AS summa_from,
                    (
                        SELECT COALESCE(SUM(b_r_ch.summa), 0)::FLOAT
                        FROM spravochnik_organization AS s_organ
                        JOIN bank_rasxod AS b_r ON b_r.id_spravochnik_organization = s_organ.id
                        JOIN bank_rasxod_child AS b_r_ch ON b_r.id = b_r_ch.id_bank_rasxod
                        JOIN spravochnik_operatsii AS s_op ON s_op.id = b_r_ch.spravochnik_operatsii_id
                        JOIN users AS u ON u.id = s_organ.user_id
                        JOIN regions AS r ON r.id = u.region_id
                        WHERE s_organ.isdeleted = false AND r.id = $1 AND s_op.schet = $2 AND b_r.doc_date <= $3 AND s_organ.id = s_o.id 
                    ) AS prixod,
                    COALESCE((
                        SELECT JSON_AGG(ROW_TO_JSON(t)) AS rasxod_array
                        FROM (
                            SELECT 
                                child_s_o.schet AS schet,
                                COALESCE(SUM(b_i_j3_ch.summa), 0)::FLOAT AS summa
                            FROM spravochnik_organization AS s_organ
                            JOIN users AS u ON u.id = s_organ.user_id
                            JOIN regions AS r ON r.id = u.region_id
                            JOIN bajarilgan_ishlar_jur3 AS b_i_j3 ON b_i_j3.id_spravochnik_organization = s_organ.id
                            JOIN bajarilgan_ishlar_jur3_child AS b_i_j3_ch ON b_i_j3_ch.bajarilgan_ishlar_jur3_id = b_i_j3.id
                            JOIN spravochnik_operatsii AS s_own_o ON s_own_o.id = b_i_j3.spravochnik_operatsii_own_id
                            JOIN spravochnik_operatsii AS child_s_o ON child_s_o.id = b_i_j3_ch.spravochnik_operatsii_id
                            WHERE r.id = $1 AND s_own_o.schet = $2 AND b_i_j3.doc_date BETWEEN $3 AND $4 AND s_organ.id = s_o.id
                            GROUP BY child_s_o.schet

                            UNION ALL

                            SELECT 
                                m_schet.jur2_schet AS schet,
                                COALESCE(SUM(b_p_ch.summa), 0)::FLOAT AS summa
                            FROM bank_prixod_child AS b_p_ch 
                            JOIN users AS u ON u.id = b_p_ch.user_id
                            JOIN regions AS r ON r.id = u.region_id
                            JOIN spravochnik_operatsii AS s_op ON s_op.id = b_p_ch.spravochnik_operatsii_id 
                            JOIN bank_prixod AS b_p ON b_p.id = b_p_ch.id_bank_prixod
                            JOIN spravochnik_organization AS s_organ ON s_organ.id = b_p.id_spravochnik_organization
                            JOIN main_schet AS m_schet ON m_schet.id = b_p.main_schet_id 
                            WHERE r.id = $1 AND s_op.schet = $2 AND b_p.doc_date BETWEEN $3 AND $4 AND s_organ.id = s_o.id
                            GROUP BY m_schet.jur2_schet
                        ) t
                    ), '[]'::JSON) AS rasxod_array,
                    (
                        (   
                            SELECT 
                                COALESCE(SUM(b_i_j3_ch.summa), 0)::FLOAT
                            FROM spravochnik_organization AS s_organ
                            JOIN users AS u ON u.id = s_organ.user_id
                            JOIN regions AS r ON r.id = u.region_id
                            JOIN bajarilgan_ishlar_jur3 AS b_i_j3 ON b_i_j3.id_spravochnik_organization = s_organ.id
                            JOIN bajarilgan_ishlar_jur3_child AS b_i_j3_ch ON b_i_j3_ch.bajarilgan_ishlar_jur3_id = b_i_j3.id
                            JOIN spravochnik_operatsii AS s_own_o ON s_own_o.id = b_i_j3.spravochnik_operatsii_own_id
                            WHERE r.id = $1 AND s_own_o.schet = $2 AND b_i_j3.doc_date BETWEEN $3 AND $4 AND s_organ.id = s_o.id) +
                        (
                            SELECT 
                                COALESCE(SUM(b_p_ch.summa), 0)::FLOAT 
                            FROM bank_prixod_child AS b_p_ch 
                            JOIN users AS u ON u.id = b_p_ch.user_id
                            JOIN regions AS r ON r.id = u.region_id
                            JOIN spravochnik_operatsii AS s_op ON s_op.id = b_p_ch.spravochnik_operatsii_id 
                            JOIN bank_prixod AS b_p ON b_p.id = b_p_ch.id_bank_prixod
                            JOIN spravochnik_organization AS s_organ ON s_organ.id = b_p.id_spravochnik_organization
                            WHERE r.id = $1 AND s_op.schet = $2 AND b_p.doc_date BETWEEN $3 AND $4 AND s_organ.id = s_o.id
                        ) 
                    ) AS itogo_rasxod,
                    (
                        ( SELECT COALESCE(SUM(b_r_ch.summa), 0)::FLOAT
                            FROM bank_rasxod_child AS b_r_ch 
                            JOIN users AS u ON u.id = b_r_ch.user_id
                            JOIN regions AS r ON r.id = u.region_id
                            JOIN spravochnik_operatsii AS s_op ON s_op.id = b_r_ch.spravochnik_operatsii_id 
                            JOIN bank_rasxod AS b_r ON b_r.id = b_r_ch.id_bank_rasxod
                            WHERE r.id = $1 AND s_op.schet = $2 AND b_r.doc_date <= $4 AND b_r.id_spravochnik_organization = s_o.id
                        ) - 
                        ( 
                            (SELECT COALESCE(SUM(b_p_ch.summa), 0)::FLOAT
                                FROM bank_prixod_child AS b_p_ch 
                                JOIN users AS u ON u.id = b_p_ch.user_id
                                JOIN regions AS r ON r.id = u.region_id
                                JOIN spravochnik_operatsii AS s_op ON s_op.id = b_p_ch.spravochnik_operatsii_id 
                                JOIN bank_prixod AS b_p ON b_p.id = b_p_ch.id_bank_prixod
                                WHERE r.id = $1 AND s_op.schet = $2 AND b_p.doc_date <= $4 AND b_p.id_spravochnik_organization = s_o.id) + 
                            (SELECT COALESCE(SUM(b_i_j3.summa), 0)
                                FROM bajarilgan_ishlar_jur3 AS b_i_j3 
                                JOIN users AS u ON u.id = b_i_j3.user_id
                                JOIN regions AS r ON r.id = u.region_id
                                JOIN spravochnik_operatsii AS s_own_o ON s_own_o.id = b_i_j3.spravochnik_operatsii_own_id 
                                WHERE r.id = $1 AND s_own_o.schet = $2 AND b_i_j3.doc_date <= $4 AND b_i_j3.id_spravochnik_organization = s_o.id
                            )
                        )
                    ) AS summa_to
                FROM spravochnik_organization AS s_o
                JOIN users AS u ON u.id = s_o.user_id
                JOIN regions AS r ON r.id = u.region_id
                WHERE r.id = $1 AND s_o.isdeleted = false
                GROUP BY s_o.name, s_o.id
            )
            SELECT 
                ARRAY_AGG(row_to_json(data)) AS data,
                COALESCE((
                        SELECT JSON_AGG(JSON_BUILD_OBJECT('schet', schet)) AS schet_array
                        FROM (
                            SELECT DISTINCT s_o.schet
                            FROM bajarilgan_ishlar_jur3 AS b_i_j3 
                            JOIN users AS u ON u.id = b_i_j3.user_id
                            JOIN regions AS r ON r.id = u.region_id
                            JOIN spravochnik_operatsii AS s_own_o ON s_own_o.id = b_i_j3.spravochnik_operatsii_own_id 
                            JOIN bajarilgan_ishlar_jur3_child AS b_i_j3_ch ON b_i_j3_ch.bajarilgan_ishlar_jur3_id = b_i_j3.id
                            JOIN spravochnik_operatsii AS s_o ON s_o.id = b_i_j3_ch.spravochnik_operatsii_id  
                            WHERE r.id = $1 AND s_own_o.schet = $2 AND b_i_j3.doc_date BETWEEN $3 AND $4
                            ORDER BY s_o.schet
                        ) schet
                    ), '[]'::JSON) AS schet_array,
                (
                    (   
                        SELECT 
                            COALESCE(SUM(b_i_j3_ch.summa), 0)::FLOAT
                        FROM spravochnik_organization AS s_organ
                        JOIN users AS u ON u.id = s_organ.user_id
                        JOIN regions AS r ON r.id = u.region_id
                        JOIN bajarilgan_ishlar_jur3 AS b_i_j3 ON b_i_j3.id_spravochnik_organization = s_organ.id
                        JOIN bajarilgan_ishlar_jur3_child AS b_i_j3_ch ON b_i_j3_ch.bajarilgan_ishlar_jur3_id = b_i_j3.id
                        JOIN spravochnik_operatsii AS s_own_o ON s_own_o.id = b_i_j3.spravochnik_operatsii_own_id
                        WHERE r.id = $1 AND s_own_o.schet = $2 AND b_i_j3.doc_date BETWEEN $3 AND $4) +
                    (
                        SELECT 
                            COALESCE(SUM(b_p_ch.summa), 0)::FLOAT 
                        FROM bank_prixod_child AS b_p_ch 
                        JOIN users AS u ON u.id = b_p_ch.user_id
                        JOIN regions AS r ON r.id = u.region_id
                        JOIN spravochnik_operatsii AS s_op ON s_op.id = b_p_ch.spravochnik_operatsii_id 
                        JOIN bank_prixod AS b_p ON b_p.id = b_p_ch.id_bank_prixod
                        JOIN spravochnik_organization AS s_organ ON s_organ.id = b_p.id_spravochnik_organization
                        WHERE r.id = $1 AND s_op.schet = $2 AND b_p.doc_date BETWEEN $3 AND $4
                    ) 
                ) AS itogo_all_rasxod
            FROM data 
        `, [region_id, schet, from, to])
        return { data: main_data.rows[0]?.data || [], rasxod_schets: main_data.rows[0].schet_array, itogo_all_rasxod: main_data.rows[0].itogo_all_rasxod }
    } catch (error) {
        throw new ErrorResponse(error, error.statusCode)
    }
}

module.exports = {
    getMonitoringService,
    orderOrganizationService,
    aktSverkaService,
    organizationPrixodRasxodService,
    getByOrganizationMonitoringService
};