const { handleServiceError } = require("../../middleware/service.handle");
const pool = require('../../config/db')

const createJur3DB = handleServiceError(async (object) => {
    const result = await pool.query(
        `
            INSERT INTO bajarilgan_ishlar_jur3(
                doc_num, 
                doc_date, 
                opisanie, 
                summa, 
                id_spravochnik_organization, 
                shartnomalar_organization_id, 
                main_schet_id,
                user_id,
                spravochnik_operatsii_own_id
            ) 
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) 
            RETURNING *
            `,
        [
            object.doc_num,
            object.doc_date,
            object.opisanie,
            object.summa,
            object.id_spravochnik_organization,
            object.shartnomalar_organization_id,
            object.main_schet_id,
            object.user_id,
            object.spravochnik_operatsii_own_id
        ],
    );
    return result.rows[0]
})

const createJur3ChildDB = handleServiceError(async (object) => {
    await pool.query(
        `
              INSERT INTO bajarilgan_ishlar_jur3_child(
                  spravochnik_operatsii_id,
                  summa,
                  id_spravochnik_podrazdelenie,
                  id_spravochnik_sostav,
                  id_spravochnik_type_operatsii,
                  main_schet_id,
                  bajarilgan_ishlar_jur3_id,
                  user_id,
                  spravochnik_operatsii_own_id
              ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
            object.spravochnik_operatsii_id,
            object.summa,
            object.id_spravochnik_podrazdelenie,
            object.id_spravochnik_sostav,
            object.id_spravochnik_type_operatsii,
            object.main_schet_id,
            object.bajarilgan_ishlar_jur3_id,
            object.user_id,
            object.spravochnik_operatsii_own_id
        ]
    );
});

const getAllJur3Db = handleServiceError(async (region_id, main_schet_id) => {
    const results = await pool.query(
        ` 
            SELECT 
                bajarilgan_ishlar_jur3.id, 
                bajarilgan_ishlar_jur3.doc_num,
                bajarilgan_ishlar_jur3.doc_date, 
                bajarilgan_ishlar_jur3.opisanie, 
                bajarilgan_ishlar_jur3.summa, 
                bajarilgan_ishlar_jur3.id_spravochnik_organization, 
                bajarilgan_ishlar_jur3.shartnomalar_organization_id
            FROM bajarilgan_ishlar_jur3 
            JOIN users ON bajarilgan_ishlar_jur3.user_id = users.id
            JOIN regions ON users.region_id = bajarilgan_ishlar_jur3.id
            WHERE bajarilgan_ishlar_jur3.main_schet_id = $1 
                AND bajarilgan_ishlar_jur3.user_id = $2 
                AND bajarilgan_ishlar_jur3.isdeleted = false
        `,
        [main_schet_id, region_id],
    );

})

module.exports = {
    createJur3DB,
    createJur3ChildDB
}