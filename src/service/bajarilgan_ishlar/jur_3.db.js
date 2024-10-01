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
          object.user_id,
          main_schet.id,
          object.id,
          object.user_id,
          object.spravochnik_operatsii_own_id
        ],
    );
})


module.exports = {
    createJur3DB,
    createJur3ChildDB
}