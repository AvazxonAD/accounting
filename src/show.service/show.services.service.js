const pool = require('../config/db')
const { tashkentTime } = require('../utils/date.function')
const ErrorResponse = require('../utils/errorResponse')
const createShowServiceService = async (data) => {
    try {
        const result = await pool.query(
            `
                INSERT INTO kursatilgan_hizmatlar_jur152(
                    user_id,
                    spravochnik_operatsii_own_id,
                    doc_num,
                    doc_date,
                    summa,
                    opisanie,
                    id_spravochnik_organization,
                    shartnomalar_organization_id,
                    main_schet_id,
                    created_at,
                    updated_at
                )
                VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
                RETURNING *
            `, [
            data.user_id,
            data.spravochnik_operatsii_own_id,
            data.doc_num,
            data.doc_date,
            data.summa,
            data.opisanie,
            data.id_spravochnik_organization,
            data.shartnomalar_organization_id,
            data.main_schet_id,
            tashkentTime(),
            tashkentTime()
        ])
        return result.rows[0]
    } catch (error) {
        throw new ErrorResponse(`show services createRegionService function:  ${error.message}`)
    }
}

const createShowServiceChildService = async (data) => {
    try {
        const child = await pool.query(
            `
                INSERT INTO kursatilgan_hizmatlar_jur152_child(
                    user_id,
                    spravochnik_operatsii_id,
                    spravochnik_operatsii_own_id,
                    summa,
                    id_spravochnik_podrazdelenie,
                    id_spravochnik_sostav,
                    id_spravochnik_type_operatsii,
                    kursatilgan_hizmatlar_jur152_id,
                    main_schet_id,
                    created_at,
                    updated_at
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
                RETURNING *
            `, [
            data.user_id,
            data.spravochnik_operatsii_id,
            data.spravochnik_operatsii_own_id,
            data.summa,
            data.id_spravochnik_podrazdelenie,
            data.id_spravochnik_sostav,
            data.id_spravochnik_type_operatsii,
            data.kursatilgan_hizmatlar_jur152_id,
            data.main_schet_id,
            tashkentTime(),
            tashkentTime()
        ])
        return child.rows[0]
    } catch (error) {
        throw new ErrorResponse(error, error.statusCode)
    }
}

const getShowServiceService = async (region_id, main_schet_id, from, to, offset, limit) => {
    try {
        const { rows } = await pool.query(`
            WITH data AS (
                SELECT 
                    k_h_j.id,
                    k_h_j.doc_num,
                    k_h_j.doc_date,
                    TO_CHAR(k_h_j.doc_date, 'YYYY-MM-DD') AS doc_date,
                    k_h_j.id_spravochnik_organization,
                    s_o.name AS spravochnik_organization_name,
                    s_o.raschet_schet AS spravochnik_organization_raschet_schet,
                    s_o.inn AS spravochnik_organization_inn,
                    k_h_j.shartnomalar_organization_id,
                    sh_o.doc_num AS shartnomalar_organization_doc_num,
                    sh_o.doc_date AS shartnomalar_organization_doc_date,
                    k_h_j.summa::FLOAT,
                    k_h_j.opisanie,
                    k_h_j.spravochnik_operatsii_own_id,
                    (
                        SELECT ARRAY_AGG(row_to_json(k_h_j_ch))
                        FROM (
                                SELECT  
                                    k_h_j_ch.id,
                                    k_h_j_ch.kursatilgan_hizmatlar_jur152_id,
                                    k_h_j_ch.spravochnik_operatsii_id,
                                    k_h_j_ch.summa::FLOAT,
                                    k_h_j_ch.id_spravochnik_podrazdelenie,
                                    k_h_j_ch.id_spravochnik_sostav,
                                    k_h_j_ch.id_spravochnik_type_operatsii
                                FROM kursatilgan_hizmatlar_jur152_child AS k_h_j_ch
                                JOIN users AS u ON k_h_j_ch.user_id = u.id
                                JOIN regions AS r ON u.region_id = r.id
                                WHERE k_h_j_ch.kursatilgan_hizmatlar_jur152_id = k_h_j.id
                            ) AS k_h_j_ch
                    ) AS childs
                FROM kursatilgan_hizmatlar_jur152 AS k_h_j
                JOIN users AS u ON u.id = k_h_j.user_id
                JOIN regions AS r ON u.region_id = r.id
                JOIN spravochnik_organization AS s_o ON s_o.id = k_h_j.id_spravochnik_organization
                LEFT JOIN shartnomalar_organization AS sh_o ON sh_o.id = k_h_j.shartnomalar_organization_id
                WHERE r.id = $1 AND k_h_j.doc_date BETWEEN $2 AND $3 AND k_h_j.main_schet_id = $4 AND k_h_j.isdeleted = false ORDER BY k_h_j.doc_date
                OFFSET $5 LIMIT $6 
            )
            SELECT 
            ARRAY_AGG(row_to_json(data)) AS data,
            (SELECT COUNT(k_h_j.id) 
                FROM kursatilgan_hizmatlar_jur152 AS k_h_j
                JOIN users AS u ON u.id = k_h_j.user_id
                JOIN regions AS r ON u.region_id = r.id
                WHERE r.id = $1 AND k_h_j.doc_date BETWEEN $2 AND $3 AND k_h_j.main_schet_id = $4 AND k_h_j.isdeleted = false
            )::INTEGER AS total_count,
            (SELECT SUM(k_h_j.summa) 
                FROM kursatilgan_hizmatlar_jur152 AS k_h_j
                JOIN users AS u ON u.id = k_h_j.user_id
                JOIN regions AS r ON u.region_id = r.id
                WHERE r.id = $1 AND k_h_j.doc_date BETWEEN $2 AND $3 AND k_h_j.main_schet_id = $4 AND k_h_j.isdeleted = false
            )::FLOAT AS summa
            FROM data
        `, [region_id, from, to, main_schet_id, offset, limit])
        return {data: rows[0]?.data || [], total: rows[0]?.total_count || 0, summa: rows[0]?.summa || 0}
    } catch (error) {
        throw new ErrorResponse(error, error.statusCode)
    }
}

const getByIdShowServiceService = async (region_id, main_schet_id, id, ignoreDeleted = false) => {
    try {
        let ignore = ``
        if (!ignoreDeleted) {
            ignore = ` AND k_h_j.isdeleted = false`;
        }
        const result = await pool.query(`
                SELECT 
                    k_h_j.id,
                    k_h_j.doc_num,
                    k_h_j.doc_date,
                    TO_CHAR(k_h_j.doc_date, 'YYYY-MM-DD') AS doc_date,
                    k_h_j.id_spravochnik_organization,
                    k_h_j.shartnomalar_organization_id,
                    k_h_j.summa::FLOAT,
                    k_h_j.opisanie,
                    k_h_j.spravochnik_operatsii_own_id,
                    (
                        SELECT ARRAY_AGG(row_to_json(k_h_j_ch))
                        FROM (
                                SELECT  
                                    k_h_j_ch.id,
                                    k_h_j_ch.kursatilgan_hizmatlar_jur152_id,
                                    k_h_j_ch.spravochnik_operatsii_id,
                                    k_h_j_ch.summa::FLOAT,
                                    k_h_j_ch.id_spravochnik_podrazdelenie,
                                    k_h_j_ch.id_spravochnik_sostav,
                                    k_h_j_ch.id_spravochnik_type_operatsii
                                FROM kursatilgan_hizmatlar_jur152_child AS k_h_j_ch
                                JOIN users AS u ON k_h_j_ch.user_id = u.id
                                JOIN regions AS r ON u.region_id = r.id
                                WHERE k_h_j_ch.kursatilgan_hizmatlar_jur152_id = k_h_j.id
                            ) AS k_h_j_ch
                    ) AS childs
                FROM kursatilgan_hizmatlar_jur152 AS k_h_j
                JOIN users AS u ON u.id = k_h_j.user_id
                JOIN regions AS r ON u.region_id = r.id
                WHERE r.id = $1 AND k_h_j.id = $2 AND k_h_j.main_schet_id = $3 ${ignore}
        `, [region_id, id, main_schet_id])
        if (!result.rows[0]) {
            throw new ErrorResponse(' show service not found', 404)
        }
        return result.rows[0];
    } catch (error) {
        throw new ErrorResponse(error, error.statusCode)
    }
}

const updateShowServiceService = async (data) => {
    const result = await pool.query(
        `
              UPDATE kursatilgan_hizmatlar_jur152
                  SET 
                      doc_num = $1, 
                      doc_date = $2, 
                      opisanie = $3, 
                      summa = $4, 
                      id_spravochnik_organization = $5, 
                      shartnomalar_organization_id = $6, 
                      spravochnik_operatsii_own_id = $7,
                      updated_at = $8
                  WHERE id = $9
                  RETURNING * 
          `,
        [
            data.doc_num,
            data.doc_date,
            data.opisanie,
            data.summa,
            data.id_spravochnik_organization,
            data.shartnomalar_organization_id,
            data.spravochnik_operatsii_own_id,
            tashkentTime(),
            data.id,
        ],
    );
    return result.rows[0]
}

const deleteShowServiceChildService = async (id) => {
    await pool.query(`DELETE FROM kursatilgan_hizmatlar_jur152_child WHERE kursatilgan_hizmatlar_jur152_id = $1`, [id]);
}

const deleteShowServiceService = async (id) => {
    await pool.query(`UPDATE kursatilgan_hizmatlar_jur152 SET  isdeleted = true WHERE id = $1`, [id]);
    await pool.query(`UPDATE kursatilgan_hizmatlar_jur152_child SET isdeleted = true WHERE kursatilgan_hizmatlar_jur152_id = $1`, [id]);
}

module.exports = {
    createShowServiceService,
    createShowServiceChildService,
    getShowServiceService,
    getByIdShowServiceService,
    updateShowServiceService,
    deleteShowServiceChildService,
    deleteShowServiceService
}