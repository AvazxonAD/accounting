const { db } = require('../../db/index')

exports.KassaPrixodDB = class {
    static async createPrixod(params, client) {
        const query = `
            INSERT INTO kassa_prixod(
                doc_num, 
                doc_date, 
                opisanie, 
                summa, 
                id_podotchet_litso,
                main_schet_id, 
                user_id,
                created_at,
                updated_at,
                main_zarplata_id
            ) 
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
            RETURNING id
        `;

        const result = await client.query(query, params);

        return result[0]
    }

    static async createPrixodChild(params, _values, client) {
        const query = `
            INSERT INTO kassa_prixod_child (
              spravochnik_operatsii_id,
              summa,
              id_spravochnik_podrazdelenie, 
              id_spravochnik_sostav, 
              id_spravochnik_type_operatsii,
              kassa_prixod_id,
              user_id, 
              main_schet_id, 
              created_at, 
              updated_at
          )
          VALUES ${_values}
        `;

        const result = await client.query(query, params);

        return result;
    }
}