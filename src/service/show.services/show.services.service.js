const pool = require('../../config/db')
const { tashkentTime } = require('../../utils/date.function')
const createRegionService = async (data) => {
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
        console.log(`show services createRegionService function:  ${error}`)
        throw new Error(`show services createRegionService function:  ${error.message}`)
    }
}

const createChildService = async (data) => {
    try {
        await pool.query(
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
    } catch (error) {
        console.log(`show services createChildService function:  ${error}`)
        throw new Error(`show services createChildService function:  ${error.message}`)
    }
}


module.exports = {
    createRegionService,
    createChildService
}