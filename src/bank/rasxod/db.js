const { db } = require('../../db/index')

exports.BankRasxodDB = class {
    static async createBankRasxod(params, client) {
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

    static async getByIdBankRaasxod(params, isdeleted) {
        const query = `--sql
            SELECT 
                b_r.id,
                b_r.doc_num, 
                TO_CHAR(b_r.doc_date, 'YYYY-MM-DD') AS doc_date, 
                b_r.summa::FLOAT, 
                b_r.opisanie, 
                b_r.id_spravochnik_organization, 
                b_r.id_shartnomalar_organization,
                b_r.rukovoditel,
                b_r.glav_buxgalter,
                (
                SELECT ARRAY_AGG(row_to_json(b_r_ch))
                FROM (
                    SELECT 
                        b_r_ch.id,
                        b_r_ch.spravochnik_operatsii_id,
                        s_o.name AS spravochnik_operatsii_name,
                        b_r_ch.summa,
                        b_r_ch.id_spravochnik_podrazdelenie,
                        s_p.name AS spravochnik_podrazdelenie_name,
                        b_r_ch.id_spravochnik_sostav,
                        s_s.name AS spravochnik_sostav_name,
                        b_r_ch.id_spravochnik_type_operatsii,
                        s_t_o.name AS spravochnik_type_operatsii_name,
                        b_r_ch.main_zarplata_id,
                        b_r_ch.id_spravochnik_podotchet_litso,
                        s_p_l.name AS spravochnik_podotchet_litso_name
                    FROM bank_rasxod_child AS b_r_ch
                    JOIN spravochnik_operatsii AS s_o ON s_o.id = b_r_ch.spravochnik_operatsii_id
                    LEFT JOIN spravochnik_podrazdelenie AS s_p ON s_p.id = b_r_ch.id_spravochnik_podrazdelenie
                    LEFT JOIN spravochnik_sostav AS s_s ON s_s.id = b_r_ch.id_spravochnik_sostav
                    LEFT JOIN spravochnik_type_operatsii AS s_t_o ON s_t_o.id = b_r_ch.id_spravochnik_type_operatsii
                    LEFT JOIN spravochnik_podotchet_litso AS s_p_l ON s_p_l.id = b_r_ch.id_spravochnik_podotchet_litso
                    WHERE b_r_ch.id_bank_rasxod = b_r.id 
                ) AS b_r_ch
                ) AS childs 
            FROM bank_rasxod AS b_r
            JOIN users AS u ON b_r.user_id = u.id
            JOIN regions AS r ON u.region_id = r.id
            WHERE b_r.main_schet_id = $1 
                AND r.id = $2 
                AND b_r.id = $3
                ${!isdeleted ? `AND b_r.isdeleted = false` : ''}
        `;
        const result = await db.query(query, params);
        return result[0];
    }

    static async paymentBankRasxod(params, client) {
        let extraQuery = '';
        if (params[0]) {
            extraQuery = `summa = tulanmagan_summa`;
        } else {
            extraQuery = `summa = 0`;
        }

        const queryParent = `--sql
            UPDATE bank_rasxod 
            SET tulangan_tulanmagan = $1, ${extraQuery}
            WHERE id = $2 AND isdeleted = false;`

        const queryChild = `--sql
            UPDATE bank_rasxod_child 
            SET tulangan_tulanmagan = $1, ${extraQuery}
            WHERE id_bank_rasxod = $2 AND isdeleted = false;
        `;

        await client.query(queryParent, params);
        await client.query(queryChild, params);
    }
}