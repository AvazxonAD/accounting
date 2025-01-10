const { db } = require('../../db/index')

exports.BankRasxodDB = class {
    static async createBankRasxod(params, client){
        const query = `
            INSERT INTO bank_rasxod(
                doc_num, 
                doc_date, 
                summa, 
                opisanie, 
                id_spravochnik_organization, 
                id_shartnomalar_organization, 
                main_schet_id, 
                user_id,
                rukovoditel,
                glav_buxgalter,
                created_at,
                updated_at
            ) 
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
            RETURNING *
        `;
        const result = await client.query(query, params);
        return result;
    } 

    static async createBankRasxodChild(params, client) {
        
        const query = `
            INSERT INTO bank_rasxod_child(
                spravochnik_operatsii_id,
                summa,
                id_spravochnik_podrazdelenie,
                id_spravochnik_sostav,
                id_spravochnik_type_operatsii,
                main_schet_id,
                id_bank_rasxod,
                user_id,
                created_at,
                updated_at,
                main_zarplata_id,
                id_spravochnik_podotchet_litso
            ) VALUES () RETURNING *
        `
    }
}