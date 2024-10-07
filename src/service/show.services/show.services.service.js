const pool = require('../../config/db')
const { tashkentTime } = require('../../utils/date.function')
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
        throw new Error(`show services createRegionService function:  ${error.message}`)
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
        throw new Error(error, error.statusCode)
    }
}

const getShowServiceService = async (region_id, main_schet_id, from, to, offset, limit) => {
    try {
        const result = await pool.query(`
            SELECT 
                k_h_j.id,
                k_h_j.doc_date,
                TO_CHAR(k_h_j.doc_date, 'YYYY-MM-DD') AS doc_date,
                k_h_j.id_spravochnik_organization,
                k_h_j.shartnomalar_organization_id,
                k_h_j.summa::FLOAT,
                k_h_j.opisanie
            FROM kursatilgan_hizmatlar_jur152 AS k_h_j
            JOIN users AS u ON u.id = k_h_j.user_id
            JOIN regions AS r ON u.region_id = r.id
            WHERE r.id = $1 AND k_h_j.doc_date BETWEEN $2 AND $3
        `, [region_id, from, to])
        return result.rows
    } catch (error) {
        throw new Error(error, error.statusCode)
    }
}


module.exports = {
    createShowServiceService,
    createShowServiceChildService,
    getShowServiceService
}