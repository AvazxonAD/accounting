const { handleServiceError } = require("../../middleware/service.handle");
const pool = require("../../config/db");

const createJur4DB = handleServiceError(async (object) => {
    const result = await pool.query(
        `
            INSERT INTO avans_otchetlar_jur4(
                doc_num, 
                doc_date, 
                opisanie, 
                summa,
                spravochnik_podotchet_litso_id, 
                main_schet_id, 
                user_id,
                spravochnik_operatsii_own_id,
                created_at
            ) 
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) 
            RETURNING *
            `,
        [
            object.doc_num,
            object.doc_date,
            object.opisanie,
            object.summa,
            object.spravochnik_podotchet_litso_id,
            object.main_schet_id,
            object.user_id,
            object.spravochnik_operatsii_own_id,
            new Date()
        ],
    );
    return result.rows[0]
})

const createJur4ChildDB = handleServiceError(async (object) => {
    await pool.query(
        `
              INSERT INTO avans_otchetlar_jur4_child(
                  spravochnik_operatsii_id,
                  summa,
                  id_spravochnik_podrazdelenie,
                  id_spravochnik_sostav,
                  id_spravochnik_type_operatsii,
                  main_schet_id,
                  avans_otchetlar_jur4_id,
                  user_id,
                  spravochnik_operatsii_own_id,
                  created_at
              ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          object.spravochnik_operatsii_id,
          object.summa,
          object.id_spravochnik_podrazdelenie,
          object.id_spravochnik_sostav,
          object.id_spravochnik_type_operatsii,
          object.main_schet_id,
          object.avans_otchetlar_jur4_id,
          object.user_id,
          object.spravochnik_operatsii_own_id,
          new Date()
        ],
    );
})

module.exports = {
    createJur4DB,
    createJur4ChildDB
}
