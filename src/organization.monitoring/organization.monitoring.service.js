const pool = require("../config/db");
const ErrorResponse = require("../utils/errorResponse");


const getAllMonitoring = async (region_id, main_schet_id, offset, limit, from, to, spravochnik_organization_id) => {
    try {
        const filter = `sh_o.isdeleted = false AND r.id = $1 AND sh_o.main_schet_id = $2 AND sh_o.doc_date BETWEEN $3 AND $4 AND sh_o.spravochnik_organization_id = $7`
        const { rows } = await pool.query(
            `
                WITH data AS (
                    SELECT 
                        sh_o.id,
                        sh_o.spravochnik_organization_id,
                        sh_o.doc_num,
                        TO_CHAR(sh_o.doc_date, 'YYYY-MM-DD') AS doc_date,
                        sh_o.smeta_id,
                        sh_o.smeta2_id,
                        sh_o.opisanie,
                        sh_o.summa,
                        sh_o.pudratchi_bool,
                        smeta.smeta_number,
                        u.login,
                        u.fio,
                        u.id AS user_id,
                        (SELECT 
                            (SELECT ARRAY_AGG(row_to_json(operatsii))
                                FROM (SELECT 
                                        b_r_ch.id,
                                        b_r_ch.id_shartnomalar_organization AS shartnoma_id,
                                        b_r_ch.doc_num,
                                        b_r_ch.doc_date,
                                        b_r_ch.opisanie,
                                        0 AS summa_rasxod, 
                                        b_r_ch.summa AS summa_prixod,
                                        u.id AS user_id,
                                        u.login,
                                        u.fio,
                                        (SELECT ARRAY_AGG(s_o.schet || ' - ' || m_sch.jur2_schet)
                                            FROM bank_rasxod_child AS b_r_ch_ch
                                            JOIN spravochnik_operatsii AS s_o ON s_o.id = b_r_ch_ch.spravochnik_operatsii_id
                                            JOIN main_schet AS m_sch ON m_sch.id = b_r_ch_ch.main_schet_id
                                            WHERE b_r_ch_ch.id_bank_rasxod = b_r_ch.id
                                        ) AS schet_array
                                    FROM bank_rasxod b_r_ch
                                    JOIN users AS u ON u.id = b_r_ch.user_id 
                                    WHERE b_r_ch.isdeleted = false AND b_r_ch.id_spravochnik_organization = $7
                                    UNION ALL 
                                    SELECT 
                                        b_i_j3_ch.id,
                                        b_i_j3_ch.shartnomalar_organization_id AS shartnoma_id,
                                        b_i_j3_ch.doc_num,
                                        b_i_j3_ch.doc_date,
                                        b_i_j3_ch.opisanie,
                                        b_i_j3_ch.summa AS summa_rasxod,  
                                        0 AS summa_prixod,
                                        u.id AS user_id,
                                        u.login,
                                        u.fio,
                                        (SELECT ARRAY_AGG(s_o.schet|| ' - ' || s_own.schet)
                                            FROM bajarilgan_ishlar_jur3_child AS b_i_j3_ch_ch
                                            JOIN spravochnik_operatsii AS s_o ON s_o.id = b_i_j3_ch_ch.spravochnik_operatsii_id
                                            JOIN spravochnik_operatsii AS s_own ON s_own.id = b_i_j3_ch_ch.spravochnik_operatsii_id
                                            WHERE b_i_j3_ch_ch.bajarilgan_ishlar_jur3_id = b_i_j3_ch.id
                                        ) AS schet_array
                                    FROM bajarilgan_ishlar_jur3 AS b_i_j3_ch
                                    JOIN users AS u ON b_i_j3_ch.user_id = u.id
                                    WHERE b_i_j3_ch.isdeleted = false AND b_i_j3_ch.id_spravochnik_organization = $7
                                    UNION ALL 
                                    SELECT 
                                        b_p_ch.id,
                                        b_p_ch.id_shartnomalar_organization AS shartnoma_id,
                                        b_p_ch.doc_num,
                                        b_p_ch.doc_date,
                                        b_p_ch.opisanie,
                                        b_p_ch.summa AS summa_rasxod, 
                                        0 AS summa_prixod,
                                        u.id AS user_id,
                                        u.login,
                                        u.fio,
                                        (SELECT ARRAY_AGG(m_sch.jur2_schet || ' - ' || s_o.schet)
                                            FROM bank_prixod_child AS b_p_ch_ch
                                            JOIN spravochnik_operatsii AS s_o ON s_o.id = b_p_ch_ch.spravochnik_operatsii_id
                                            JOIN main_schet AS m_sch ON m_sch.id = b_p_ch_ch.main_schet_id
                                            WHERE b_p_ch_ch.id_bank_prixod = b_p_ch.id
                                        ) AS schet_array
                                    FROM bank_prixod AS b_p_ch
                                    JOIN users AS u ON u.id = b_p_ch.user_id
                                    WHERE b_p_ch.isdeleted = false AND b_p_ch.id_spravochnik_organization = $7
                                    UNION ALL
                                    SELECT 
                                        k_h_j152_ch.id,
                                        k_h_j152_ch.shartnomalar_organization_id AS shartnoma_id,
                                        k_h_j152_ch.doc_num,
                                        k_h_j152_ch.doc_date,
                                        k_h_j152_ch.opisanie,
                                        0 AS summa_rasxod, 
                                        k_h_j152_ch.summa AS summa_prixod,
                                        u.id AS user_id,
                                        u.login,
                                        u.fio,
                                        (SELECT ARRAY_AGG(s_own.schet || ' - ' || s_o.schet)
                                            FROM kursatilgan_hizmatlar_jur152_child AS k_h_j152_ch_ch
                                            JOIN spravochnik_operatsii AS s_o ON s_o.id = k_h_j152_ch_ch.spravochnik_operatsii_id
                                            JOIN spravochnik_operatsii AS s_own ON s_own.id = k_h_j152_ch_ch.spravochnik_operatsii_own_id
                                            WHERE k_h_j152_ch_ch.kursatilgan_hizmatlar_jur152_id = k_h_j152_ch.id
                                        ) AS schet_array
                                    FROM kursatilgan_hizmatlar_jur152 AS k_h_j152_ch
                                    JOIN users AS u ON u.id = k_h_j152_ch.user_id
                                    WHERE k_h_j152_ch.isdeleted = false AND k_h_j152_ch.id_spravochnik_organization = $7
                                ) AS operatsii
                            ) 
                        ) AS array
                    FROM shartnomalar_organization AS sh_o
                    JOIN users AS u ON sh_o.user_id = u.id
                    JOIN regions AS r ON u.region_id = r.id
                    JOIN smeta ON sh_o.smeta_id = smeta.id
                    WHERE ${filter}
                    ORDER BY sh_o.doc_date 
                    OFFSET $5 
                    LIMIT $6
                    ) 
                    SELECT 
                        ARRAY_AGG(row_to_json(data)) AS data,
                        COALESCE((SELECT COUNT(sh_o.id)
                            FROM shartnomalar_organization AS sh_o
                            JOIN users AS u ON sh_o.user_id = u.id
                            JOIN regions AS r ON u.region_id = r.id
                            JOIN smeta ON sh_o.smeta_id = smeta.id
                            WHERE ${filter}), 0)::INTEGER AS total_count,
                        (COALESCE((
                            SELECT SUM(k_h_j152.summa) 
                            FROM kursatilgan_hizmatlar_jur152 AS k_h_j152 
                            JOIN shartnomalar_organization AS sh_o 
                            ON sh_o.id = k_h_j152.shartnomalar_organization_id
                            WHERE k_h_j152.isdeleted = false 
                            AND sh_o.main_schet_id = $2 
                            AND sh_o.doc_date < $3 
                            AND sh_o.spravochnik_organization_id = $7
                        ), 0) + 
                        COALESCE((
                            SELECT SUM(b_r.summa) 
                            FROM bank_rasxod AS b_r
                            JOIN shartnomalar_organization AS sh_o 
                            ON sh_o.id = b_r.id_shartnomalar_organization
                            WHERE b_r.isdeleted = false 
                            AND sh_o.main_schet_id = $2 
                            AND sh_o.doc_date < $3 
                            AND sh_o.spravochnik_organization_id = $7
                        ), 0))::FLOAT AS summa_from_prixod,
                        (COALESCE((
                            SELECT SUM(b_i_j152.summa) 
                            FROM bajarilgan_ishlar_jur3 AS b_i_j152 
                            JOIN shartnomalar_organization AS sh_o 
                            ON sh_o.id = b_i_j152.shartnomalar_organization_id
                            WHERE b_i_j152.isdeleted = false 
                            AND sh_o.main_schet_id = $2 
                            AND sh_o.doc_date < $3 
                            AND sh_o.spravochnik_organization_id = $7
                        ), 0) + 
                        COALESCE((
                            SELECT SUM(b_p.summa) 
                            FROM bank_prixod AS b_p
                            JOIN shartnomalar_organization AS sh_o 
                            ON sh_o.id = b_p.id_shartnomalar_organization
                            WHERE b_p.isdeleted = false 
                            AND sh_o.main_schet_id = $2 
                            AND sh_o.doc_date < $3 
                            AND sh_o.spravochnik_organization_id = $7
                        ), 0))::FLOAT AS summa_from_rasxod,
                        (COALESCE((
                            SELECT SUM(k_h_j152.summa) 
                            FROM kursatilgan_hizmatlar_jur152 AS k_h_j152 
                            JOIN shartnomalar_organization AS sh_o 
                            ON sh_o.id = k_h_j152.shartnomalar_organization_id
                            WHERE k_h_j152.isdeleted = false 
                            AND sh_o.main_schet_id = $2 
                            AND sh_o.doc_date <= $4 
                            AND sh_o.spravochnik_organization_id = $7
                        ), 0) + 
                        COALESCE((
                            SELECT SUM(b_r.summa) 
                            FROM bank_rasxod AS b_r
                            JOIN shartnomalar_organization AS sh_o 
                            ON sh_o.id = b_r.id_shartnomalar_organization
                            WHERE b_r.isdeleted = false 
                            AND sh_o.main_schet_id = $2 
                            AND sh_o.doc_date <= $4 
                            AND sh_o.spravochnik_organization_id = $7
                        ), 0))::FLOAT AS summa_to_prixod,
                        (COALESCE((
                            SELECT SUM(b_i_j152.summa) 
                            FROM bajarilgan_ishlar_jur3 AS b_i_j152 
                            JOIN shartnomalar_organization AS sh_o 
                            ON sh_o.id = b_i_j152.shartnomalar_organization_id
                            WHERE b_i_j152.isdeleted = false 
                            AND sh_o.main_schet_id = $2 
                            AND sh_o.doc_date <= $4 
                            AND sh_o.spravochnik_organization_id = $7
                        ), 0) + 
                        COALESCE((
                            SELECT SUM(b_p.summa) 
                            FROM bank_prixod AS b_p
                            JOIN shartnomalar_organization AS sh_o 
                            ON sh_o.id = b_p.id_shartnomalar_organization
                            WHERE b_p.isdeleted = false 
                            AND sh_o.main_schet_id = $2 
                            AND sh_o.doc_date <= $4 
                            AND sh_o.spravochnik_organization_id = $7
                        ), 0))::FLOAT AS summa_to_rasxod
                    FROM data
            `, [region_id, main_schet_id, from, to, offset, limit, spravochnik_organization_id],
        );
        const data = rows[0].data?.map(obj => {
            let summa_prixod = 0;
            let summa_rasxod = 0;
            if (obj.array) {
                obj.array.forEach(item => {
                    summa_rasxod += item.summa_rasxod;
                    summa_prixod += item.summa_prixod;
                });
            } else {
                obj.array = []
            }
            obj.summa_rasxod = summa_rasxod;
            obj.summa_prixod = summa_prixod;
            return obj;
        });
        return {
            data: data || [],
            total: rows[0].total_count,
            summa_from_prixod: rows[0].summa_from_prixod,
            summa_from_rasxod: rows[0].summa_from_rasxod,
            summa_to_prixod: rows[0].summa_to_prixod,
            summa_to_rasxod: rows[0].summa_to_rasxod,
        };
    } catch (error) {
        throw new ErrorResponse(error, error.statusCode)
    }
}

const getAllMonitoringAll = async (region_id, main_schet_id, offset, limit, from, to) => {
    try {
        const { rows } = await pool.query(
            `
                WITH data AS (
                    SELECT 
                        sh_o.id,
                        sh_o.spravochnik_organization_id,
                        sh_o.doc_num,
                        TO_CHAR(sh_o.doc_date, 'YYYY-MM-DD') AS doc_date,
                        sh_o.smeta_id,
                        sh_o.smeta2_id,
                        sh_o.opisanie,
                        sh_o.summa,
                        sh_o.pudratchi_bool,
                        smeta.smeta_number,
                        u.login,
                        u.fio,
                        u.id AS user_id,
                        (SELECT 
                            (SELECT ARRAY_AGG(row_to_json(operatsii))
                                FROM (SELECT 
                                        b_r_ch.id,
                                        b_r_ch.id_shartnomalar_organization AS shartnoma_id,
                                        b_r_ch.doc_num,
                                        b_r_ch.doc_date,
                                        b_r_ch.opisanie,
                                        0 AS summa_rasxod, 
                                        b_r_ch.summa AS summa_prixod,
                                        u.id AS user_id,
                                        u.login,
                                        u.fio,
                                        (SELECT ARRAY_AGG(s_o.schet || ' - ' || m_sch.jur2_schet)
                                            FROM bank_rasxod_child AS b_r_ch_ch
                                            JOIN spravochnik_operatsii AS s_o ON s_o.id = b_r_ch_ch.spravochnik_operatsii_id
                                            JOIN main_schet AS m_sch ON m_sch.id = b_r_ch_ch.main_schet_id
                                            WHERE b_r_ch_ch.id_bank_rasxod = b_r_ch.id
                                        ) AS schet_array
                                    FROM bank_rasxod b_r_ch
                                    JOIN users AS u ON u.id = b_r_ch.user_id 
                                    WHERE b_r_ch.isdeleted = false AND b_r_ch.id_spravochnik_organization IS NOT NULL
                                    UNION ALL 
                                    SELECT 
                                        b_i_j3_ch.id,
                                        b_i_j3_ch.shartnomalar_organization_id AS shartnoma_id,
                                        b_i_j3_ch.doc_num,
                                        b_i_j3_ch.doc_date,
                                        b_i_j3_ch.opisanie,
                                        b_i_j3_ch.summa AS summa_rasxod,  
                                        0 AS summa_prixod,
                                        u.id AS user_id,
                                        u.login,
                                        u.fio,
                                        (SELECT ARRAY_AGG(s_o.schet|| ' - ' || s_own.schet)
                                            FROM bajarilgan_ishlar_jur3_child AS b_i_j3_ch_ch
                                            JOIN spravochnik_operatsii AS s_o ON s_o.id = b_i_j3_ch_ch.spravochnik_operatsii_id
                                            JOIN spravochnik_operatsii AS s_own ON s_own.id = b_i_j3_ch_ch.spravochnik_operatsii_id
                                            WHERE b_i_j3_ch_ch.bajarilgan_ishlar_jur3_id = b_i_j3_ch.id
                                        ) AS schet_array
                                    FROM bajarilgan_ishlar_jur3 AS b_i_j3_ch
                                    JOIN users AS u ON b_i_j3_ch.user_id = u.id
                                    WHERE b_i_j3_ch.isdeleted = false AND b_i_j3_ch.id_spravochnik_organization IS NOT NULL
                                    UNION ALL 
                                    SELECT 
                                        b_p_ch.id,
                                        b_p_ch.id_shartnomalar_organization AS shartnoma_id,
                                        b_p_ch.doc_num,
                                        b_p_ch.doc_date,
                                        b_p_ch.opisanie,
                                        b_p_ch.summa AS summa_rasxod, 
                                        0 AS summa_prixod,
                                        u.id AS user_id,
                                        u.login,
                                        u.fio,
                                        (SELECT ARRAY_AGG(m_sch.jur2_schet || ' - ' || s_o.schet)
                                            FROM bank_prixod_child AS b_p_ch_ch
                                            JOIN spravochnik_operatsii AS s_o ON s_o.id = b_p_ch_ch.spravochnik_operatsii_id
                                            JOIN main_schet AS m_sch ON m_sch.id = b_p_ch_ch.main_schet_id
                                            WHERE b_p_ch_ch.id_bank_prixod = b_p_ch.id
                                        ) AS schet_array
                                    FROM bank_prixod AS b_p_ch
                                    JOIN users AS u ON u.id = b_p_ch.user_id
                                    WHERE b_p_ch.isdeleted = false AND b_p_ch.id_spravochnik_organization IS NOT NULL
                                    UNION ALL
                                    SELECT 
                                        k_h_j152_ch.id,
                                        k_h_j152_ch.shartnomalar_organization_id AS shartnoma_id,
                                        k_h_j152_ch.doc_num,
                                        k_h_j152_ch.doc_date,
                                        k_h_j152_ch.opisanie,
                                        0 AS summa_rasxod, 
                                        k_h_j152_ch.summa AS summa_prixod,
                                        u.id AS user_id,
                                        u.login,
                                        u.fio,
                                        (SELECT ARRAY_AGG(s_own.schet || ' - ' || s_o.schet)
                                            FROM kursatilgan_hizmatlar_jur152_child AS k_h_j152_ch_ch
                                            JOIN spravochnik_operatsii AS s_o ON s_o.id = k_h_j152_ch_ch.spravochnik_operatsii_id
                                            JOIN spravochnik_operatsii AS s_own ON s_own.id = k_h_j152_ch_ch.spravochnik_operatsii_own_id
                                            WHERE k_h_j152_ch_ch.kursatilgan_hizmatlar_jur152_id = k_h_j152_ch.id
                                        ) AS schet_array
                                    FROM kursatilgan_hizmatlar_jur152 AS k_h_j152_ch
                                    JOIN users AS u ON u.id = k_h_j152_ch.user_id
                                    WHERE k_h_j152_ch.isdeleted = false AND k_h_j152_ch.id_spravochnik_organization IS NOT NULL
                                ) AS operatsii
                            ) 
                        ) AS array
                    FROM shartnomalar_organization AS sh_o
                    JOIN users AS u ON sh_o.user_id = u.id
                    JOIN regions AS r ON u.region_id = r.id
                    JOIN smeta ON sh_o.smeta_id = smeta.id
                    WHERE sh_o.isdeleted = false AND r.id = $1 AND sh_o.main_schet_id = $2 AND sh_o.doc_date BETWEEN $3 AND $4
                    ORDER BY sh_o.doc_date 
                    OFFSET $5 
                    LIMIT $6
                )
                SELECT 
                    ARRAY_AGG(ROW_TO_JSON(data)) AS data,
                    (
                        SELECT COALESCE(COUNT(sh_o.id), 0)
                        FROM shartnomalar_organization AS sh_o
                        JOIN users AS u ON sh_o.user_id = u.id
                        JOIN regions AS r ON u.region_id = r.id
                        JOIN smeta ON sh_o.smeta_id = smeta.id
                        WHERE sh_o.isdeleted = false AND r.id = $1 AND sh_o.main_schet_id = $2 AND sh_o.doc_date BETWEEN $3 AND $4
                    )::INTEGER AS total_count
                FROM data
            `, [region_id, main_schet_id, from, to, offset, limit],
        );
        return {
            data: rows[0]?.data || [],
            total: rows[0].total_count
        };
    } catch (error) {
        throw new ErrorResponse(error, error.statusCode)
    }
}

const orderOrganizationService = async (region_id, schet, from, to) => {
    try {
        const main_data = await pool.query(`
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
                        WHERE s_organ.isdeleted = false AND r.id = $1 AND s_op.schet = $2 AND b_r.doc_date BETWEEN $3 AND $4 AND s_organ.id = s_o.id 
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
                        (SELECT 
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
                    ), '[]'::JSON) AS schet_array
            FROM data 
        `, [ region_id, schet, from, to ])
        return {data: main_data.rows[0]?.data || [], rasxod_schets: main_data.rows[0].schet_array}
    } catch(error) {
        throw new ErrorResponse(error, error.statusCode)
    } 
}

const aktSverkaService = async (region_id, main_schet_id, shartnoma_id, from, to) => {
    try {
        const filter = `sh_o.isdeleted = false AND r.id = $1 AND sh_o.main_schet_id = $2 AND sh_o.id = $3`;
        const { rows } = await pool.query(
            `
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
                                WHERE b_r_ch.isdeleted = false AND b_r_ch.id_shartnomalar_organization = sh_o.id AND b_r_ch.doc_date BETWEEN $4 AND $5
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
                                WHERE b_i_j3_ch.isdeleted = false AND b_i_j3_ch.shartnomalar_organization_id = sh_o.id AND b_i_j3_ch.doc_date BETWEEN $4 AND $5
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
                                WHERE b_p_ch.isdeleted = false AND  b_p_ch.id_shartnomalar_organization = sh_o.id AND b_p_ch.doc_date BETWEEN $4 AND $5
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
                                WHERE k_h_j152.isdeleted = false AND k_h_j152.shartnomalar_organization_id = sh_o.id AND k_h_j152.doc_date BETWEEN $4 AND $5
                            ) AS operatsii
                        ) 
                    ) AS array,
                    (
                        (COALESCE((SELECT SUM(k_h_j152.summa) 
                            FROM kursatilgan_hizmatlar_jur152 AS k_h_j152 
                            JOIN shartnomalar_organization AS sh_o 
                            ON sh_o.id = k_h_j152.shartnomalar_organization_id
                            WHERE k_h_j152.isdeleted = false AND ${filter} AND k_h_j152.doc_date < $4), 0) + 
                        COALESCE((SELECT SUM(b_r.summa) 
                            FROM bank_rasxod AS b_r
                            JOIN shartnomalar_organization AS sh_o 
                            ON sh_o.id = b_r.id_shartnomalar_organization
                            WHERE b_r.isdeleted = false AND ${filter} AND b_r.doc_date < $4), 0)) - 
                        (COALESCE((SELECT SUM(b_i_j152.summa) 
                            FROM bajarilgan_ishlar_jur3 AS b_i_j152 
                            JOIN shartnomalar_organization AS sh_o 
                            ON sh_o.id = b_i_j152.shartnomalar_organization_id
                            WHERE b_i_j152.isdeleted = false AND ${filter} AND b_i_j152.doc_date < $4), 0) + 
                        COALESCE((SELECT SUM(b_p.summa) 
                            FROM bank_prixod AS b_p
                            JOIN shartnomalar_organization AS sh_o 
                            ON sh_o.id = b_p.id_shartnomalar_organization
                            WHERE b_p.isdeleted = false AND ${filter} AND b_p.doc_date < $4), 0))
                    )::FLOAT AS summa_from,
                    (COALESCE((SELECT SUM(k_h_j152.summa) 
                        FROM kursatilgan_hizmatlar_jur152 AS k_h_j152 
                        JOIN shartnomalar_organization AS sh_o 
                        ON sh_o.id = k_h_j152.shartnomalar_organization_id
                        WHERE k_h_j152.isdeleted = false AND ${filter} AND k_h_j152.doc_date BETWEEN $4 AND $5), 0) + 
                    COALESCE((SELECT SUM(b_r.summa) 
                        FROM bank_rasxod AS b_r
                        JOIN shartnomalar_organization AS sh_o 
                        ON sh_o.id = b_r.id_shartnomalar_organization
                        WHERE b_r.isdeleted = false AND ${filter} AND b_r.doc_date BETWEEN $4 AND $5), 0))::FLOAT AS summa_prixod,
                    (COALESCE((SELECT SUM(b_i_j152.summa) 
                        FROM bajarilgan_ishlar_jur3 AS b_i_j152 
                        JOIN shartnomalar_organization AS sh_o 
                        ON sh_o.id = b_i_j152.shartnomalar_organization_id
                        WHERE b_i_j152.isdeleted = false AND ${filter} AND b_i_j152.doc_date BETWEEN $4 AND $5), 0) + 
                    COALESCE((SELECT SUM(b_p.summa) 
                        FROM bank_prixod AS b_p
                        JOIN shartnomalar_organization AS sh_o 
                        ON sh_o.id = b_p.id_shartnomalar_organization
                        WHERE b_p.isdeleted = false AND ${filter} AND b_p.doc_date BETWEEN $4 AND $5), 0))::FLOAT AS summa_rasxod,
                    (
                        (COALESCE((SELECT SUM(k_h_j152.summa) 
                            FROM kursatilgan_hizmatlar_jur152 AS k_h_j152 
                            JOIN shartnomalar_organization AS sh_o 
                            ON sh_o.id = k_h_j152.shartnomalar_organization_id
                            WHERE k_h_j152.isdeleted = false AND ${filter} AND k_h_j152.doc_date <= $5), 0) + 
                        COALESCE((SELECT SUM(b_r.summa) 
                            FROM bank_rasxod AS b_r
                            JOIN shartnomalar_organization AS sh_o 
                            ON sh_o.id = b_r.id_shartnomalar_organization
                            WHERE b_r.isdeleted = false AND ${filter} AND b_r.doc_date <= $5), 0)) - 
                        (COALESCE((SELECT SUM(b_i_j152.summa) 
                            FROM bajarilgan_ishlar_jur3 AS b_i_j152 
                            JOIN shartnomalar_organization AS sh_o 
                            ON sh_o.id = b_i_j152.shartnomalar_organization_id
                            WHERE b_i_j152.isdeleted = false AND ${filter} AND b_i_j152.doc_date <= $5), 0) + 
                        COALESCE((SELECT SUM(b_p.summa) 
                            FROM bank_prixod AS b_p
                            JOIN shartnomalar_organization AS sh_o 
                            ON sh_o.id = b_p.id_shartnomalar_organization
                            WHERE b_p.isdeleted = false AND ${filter} AND b_p.doc_date <= $5), 0))
                    )::FLOAT AS summa_to
                FROM shartnomalar_organization AS sh_o
                JOIN spravochnik_organization AS o ON o.id = sh_o.spravochnik_organization_id
                JOIN users AS u ON sh_o.user_id = u.id
                JOIN regions AS r ON u.region_id = r.id
                WHERE ${filter}
            `, [region_id, main_schet_id, shartnoma_id, from, to],
        );
        const data = rows[0]
        return data
    } catch (error) {
        throw new ErrorResponse(error, error.statusCode)
    }
}


module.exports = {
    getAllMonitoring,
    orderOrganizationService,
    aktSverkaService,
    getAllMonitoringAll
};
