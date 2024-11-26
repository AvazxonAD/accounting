const { db } = require('../../db/index')

exports.BankRasxodDB = class {
    static async getByPodotchetIdBankRasxod(params) {
        const query = `--sql
            SELECT 
                b_r.id, 
                b_r.doc_num,
                TO_CHAR(b_r.doc_date, 'YYYY-MM-DD') AS doc_date,
                b_r_ch.summa::FLOAT AS prixod_sum,
                0::FLOAT AS rasxod_sum,
                b_r.opisanie,
                b_r_ch.id_spravochnik_podotchet_litso AS podotchet_litso_id,
                s_p_l.name AS podotchet_name,
                s_p_l.rayon AS podotchet_rayon,
                u.login,
                u.fio,
                u.id AS user_id,
                s_op.schet AS provodki_schet,
                s_op.sub_schet AS provodki_sub_schet
            FROM bank_rasxod_child b_r_ch
            JOIN bank_rasxod AS b_r ON b_r_ch.id_bank_rasxod = b_r.id
            JOIN spravochnik_podotchet_litso AS s_p_l ON s_p_l.id = b_r_ch.id_spravochnik_podotchet_litso 
            JOIN users u ON b_r.user_id = u.id
            JOIN regions r ON u.region_id = r.id
            JOIN spravochnik_operatsii AS s_op ON s_op.id = b_r_ch.spravochnik_operatsii_id
            WHERE r.id = $1 
                AND b_r.main_schet_id = $2 
                AND b_r.isdeleted = false  
                AND b_r.doc_date BETWEEN $3 AND $4
                AND b_r_ch.id_spravochnik_podotchet_litso = $5
                AND s_op.schet = $6
            OFFSET $7 LIMIT $8
        `;
        const result = await db.queyr(query, params)
        return result;
    }
}