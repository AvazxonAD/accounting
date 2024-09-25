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
                  user_id,
                  spravochnik_operatsii_own_id
              ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
        [
          object.spravochnik_operatsii_id,
          object.summa,
          object.id_spravochnik_podrazdelenie,
          object.id_spravochnik_sostav,
          object.id_spravochnik_type_operatsii,
          object.jur2_schet,
          object.jur2_subschet,
          object.main_schet_id,
          object.rasxod_id,
          object.user_id,
          object.spravochnik_operatsii_own_id
        ],
    );
})

const getByIdRasxod = handleServiceError(async (user_id, main_schet_id, id) => {
    const result = await pool.query(
        `SELECT * FROM bank_prixod WHERE id = $1 AND user_id = $2 AND main_schet_id = $3
        `,
        [id, user_id, main_schet_id],
    );
    return result.rows[0]
})

const updateRasxod = handleServiceError(async (object) => {
    await pool.query(
        `
            UPDATE bank_prixod SET 
                doc_num = $1, 
                doc_date = $2, 
                summa = $3, 
                provodki_boolean = $4, 
                opisanie = $5, 
                id_spravochnik_organization = $6, 
                id_shartnomalar_organization = $7
            WHERE id = $8
            `,
        [
          object.doc_num,
          object.doc_date,
          object.summa,
          object.provodki_boolean,
          object.opisanie,
          object.id_spravochnik_organization,
          object.id_shartnomalar_organization,
          object.id,
        ],
    );
})

const getAllBankRasxodDb = handleServiceError(async ( main_schet_id, region_id, offset, limit ) => {
    let result = await pool.query(
        `
            SELECT 
                id,
                doc_num, 
                doc_date, 
                summa, 
                opisanie, 
                id_spravochnik_organization, 
                id_shartnomalar_organization
            FROM bank_rasxod 
            WHERE main_schet_id = $1 AND user_id = $2 AND isdeleted = false
            OFFSET $3 
            LIMIT $4
    `,[main_schet_id, region_id, offset, limit]);
    return result.rows        
})

const getAllRasxodChildDb = handleServiceError(async (user_id, rasxod_id) => {
    const result = await pool.query(
        `
              SELECT  
                  bank_rasxod_child.id,
                  bank_rasxod_child.spravochnik_operatsii_id,
                  spravochnik_operatsii.name AS spravochnik_operatsii_name,
                  bank_rasxod_child.summa,
                  bank_rasxod_child.id_spravochnik_podrazdelenie,
                  spravochnik_podrazdelenie.name AS spravochnik_podrazdelenie_name,
                  bank_rasxod_child.id_spravochnik_sostav,
                  spravochnik_sostav.name AS spravochnik_sostav_name,
                  bank_rasxod_child.id_spravochnik_type_operatsii,
                  spravochnik_type_operatsii.name AS spravochnik_type_operatsii_name,
                  bank_rasxod_child.own_schet,
                  bank_rasxod_child.own_subschet
              FROM bank_rasxod_child 
              JOIN spravochnik_operatsii ON spravochnik_operatsii.id = bank_rasxod_child.spravochnik_operatsii_id
              JOIN spravochnik_podrazdelenie ON spravochnik_podrazdelenie.id = bank_rasxod_child.id_spravochnik_podrazdelenie
              JOIN spravochnik_sostav ON spravochnik_sostav.id = bank_rasxod_child.id_spravochnik_sostav
              JOIN spravochnik_type_operatsii ON spravochnik_type_operatsii.id = bank_rasxod_child.id_spravochnik_type_operatsii
              WHERE bank_rasxod_child.user_id = $1 AND bank_rasxod_child.isdeleted = false AND bank_rasxod_child.id_bank_rasxod = $2
          `,
        [user_id, rasxod_id],
    );
    return result.rows
})

module.exports = {
    createBankRasxodDb,
    createBankRasxodChild,
    getByIdRasxod,
    updateRasxod,
    getAllBankRasxodDb,
    getAllRasxodChildDb
}