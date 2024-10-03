const pool = require('../../config/db');
const { tashkentTime } = require('../../utils/date.function');

const createJurnal3 = async (data) => {
    try {
        const result = await pool.query(
            `
            INSERT INTO bajarilgan_ishlar_jur3(
                user_id,
                doc_num,
                doc_dat,
                summa,
                opisanie,
                id_spravochnik_organization,
                shartnomalar_organization_id,
                spravochnik_operatsii_own_id,
                main_schet_id,
                created_at,
                updated_at
            )
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            `,
            [
                data.user_id,
                data.doc_num,
                data.doc_dat,
                data.summa,
                data.opisanie,
                data.id_spravochnik_organization,
                data.shartnomalar_organization_id,
                data.spravochnik_operatsii_own_id,
                data.main_schet_id,
                tashkentTime(),
                tashkentTime()
            ]
        );
        return result.rows[0];
    } catch (error) {
        console.log(`Error on create jurnal3: ${error}`);
        throw new Error(`Error on create jurnal3: ${error.message}`);
    }
};

const createJurnal3Child = async (data) => {
    try {
        const result = await pool.query(
            `
            INSERT INTO bajarilgan_ishlar_jur3(
                user_id,
                spravochnik_operatsii_id,
                summa,
                id_spravochnik_podrazdelenie,
                id_spravochnik_sostav,
                id_spravochnik_type_operatsii,
                bajarilgan_ishlar_jur3_id,
                spravochnik_operatsii_own_id,
                main_schet_id,
                created_at,
                updated_at
            )
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            `,
            [
                data.user_id,
                data.spravochnik_operatsii_id,
                data.summa,
                data.id_spravochnik_podrazdelenie,
                data.id_spravochnik_sostav,
                data.id_spravochnik_type_operatsii,
                data.bajarilgan_ishlar_jur3_id,
                data.spravochnik_operatsii_own_id,
                data.main_schet_id,
                tashkentTime(),
                tashkentTime()
            ]
        );
        return result.rows[0];
    } catch (error) {
        console.log(`Error on create jurnal3 child: ${error}`);
        throw new Error(`Error on create jurnal3 child: ${error.message}`);
    }
};

module.exports = {
    createJurnal3,
    createJurnal3Child
}