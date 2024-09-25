const pool = require("../../config/db");
const { handleServiceError } = require("../../middleware/service.handle");

const createBankPrixod = handleServiceError(async (object) => {
    const result = await pool.query(
        `
            INSERT INTO bank_prixod(
                doc_num, 
                doc_date, 
                summa, 
                provodki_boolean, 
                opisanie, 
                id_spravochnik_organization, 
                id_shartnomalar_organization, 
                main_schet_id, 
                user_id
            ) 
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) 
            RETURNING * 
            `,
        [
          object.doc_num,
          object.doc_date,
          object.summa,
          object.provodki_boolean,
          object.opisanie,
          object.id_spravochnik_organization,
          object.id_shartnomalar_organization,
          object.main_schet_id,
          object.user_id,
        ],
    );
    return result.rows[0]
})

const createBankPrixodChild = handleServiceError(async (object) => {
    const result = await pool.query(
      `
            INSERT INTO bank_prixod_child(
                spravochnik_operatsii_id,
                summa,
                id_spravochnik_podrazdelenie,
                id_spravochnik_sostav,
                id_spravochnik_type_operatsii,
                id_spravochnik_podotchet_litso,
                own_schet,
                own_subschet,
                main_schet_id,
                id_bank_prixod,
                user_id,
                spravochnik_operatsii_own_id
            ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
      [
        object.spravochnik_operatsii_id,
        object.summa,
        object.id_spravochnik_podrazdelenie,
        object.id_spravochnik_sostav,
        object.id_spravochnik_type_operatsii,
        object.id_spravochnik_podotchet_litso,
        object.jur2_schet,
        object.jur2_subschet,
        object.main_schet_id,
        object.bank_prixod_id,
        object.user_id,
        object.spravochnik_operatsii_own_id
      ],
    );
    return result.rows[0]
})

module.exports = {
    createBankPrixod,
    createBankPrixodChild
}