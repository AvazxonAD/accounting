const { object } = require("joi");
const pool = require("../../config/db");
const { handleServiceError } = require("../../middleware/service.handle");

const createBankRasxodDb = handleServiceError(async (object) => {
    const result = await pool.query(
        `
            INSERT INTO bank_rasxod(
                doc_num, 
                doc_date, 
                summa, 
                opisanie, 
                id_spravochnik_organization, 
                id_shartnomalar_organization, 
                main_schet_id, 
                user_id
            ) 
            VALUES($1, $2, $3, $4, $5, $6, $7, $8) 
            RETURNING *
            `,
        [
          object.doc_num,
          object.doc_date,
          object.summa,
          object.opisanie,
          object.id_spravochnik_organization,
          object.id_shartnomalar_organization,
          object.main_schet_id,
          object.user_id
        ],
    );
    return result.rows[0]
})

const createBankRasxodChild = handleServiceError(async (object) => {
    await pool.query(
        `
              INSERT INTO bank_rasxod_child(
                  spravochnik_operatsii_id,
                  summa,
                  id_spravochnik_podrazdelenie,
                  id_spravochnik_sostav,
                  id_spravochnik_type_operatsii,
                  own_schet,
                  own_subschet,
                  main_schet_id,
                  id_bank_rasxod,
                  user_id
              ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
        [
          object.spravochnik_operatsii_id,
          object.summa,
          object.id_spravochnik_podrazdelenie,
          object.id_spravochnik_sostav,
          object.id_spravochnik_type_operatsii,
          object.jur2_schet,
          object.jur2_subschet,
          object.main_schet_id,
          rasxod.rows[0].id,
          object.user_id,
        ],
    );
})

module.exports = {
    createBankRasxodDb
}