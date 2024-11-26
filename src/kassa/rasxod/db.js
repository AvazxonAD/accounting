const { db } = require('../../db/index')

exports.KassaRasxodDB = class {
    static async getByPodotchetIdKassaRasxod(params) {
        const query = `--sql
            SELECT 
                k_r.id, 
                k_r.doc_num,
                TO_CHAR(k_r.doc_date, 'YYYY-MM-DD') AS doc_date,
                k_r_ch.summa::FLOAT AS prixod_sum,
                0::FLOAT AS rasxod_sum,
                k_r.opisanie,
                k_r.id_podotchet_litso AS podotchet_litso_id,
                s_p_l.name AS podotchet_name,
                s_p_l.rayon AS podotchet_rayon,
                u.login,
                u.fio,
                u.id AS user_id,
                s_op.schet AS provodki_schet,
                s_op.sub_schet AS provodki_sub_schet
            FROM kassa_rasxod_child k_r_ch
            JOIN kassa_rasxod AS k_r ON k_r_ch.kassa_rasxod_id = k_r.id
            JOIN spravochnik_podotchet_litso AS s_p_l ON s_p_l.id = k_r.id_podotchet_litso 
            JOIN users u ON k_r.user_id = u.id
            JOIN regions r ON u.region_id = r.id
            JOIN spravochnik_operatsii AS s_op ON s_op.id = k_r_ch.spravochnik_operatsii_id
            WHERE r.id = $1 
                AND k_r.main_schet_id = $2 
                AND k_r.isdeleted = false
                AND k_r.doc_date BETWEEN $3 AND $4
                AND k_r.id_podotchet_litso = $5
                AND s_op.schet = $6
            OFFSET $7 LIMIT $8
        `;
        const result = await db.queyr(query, params)
        return result;
    }
    static async getByPodotchetIdTotalKassaRasxod(params){
        const query = `--sql
            SELECT COALESCE(COUNT(k_p_ch.id), 0) AS total
            FROM kassa_prixod_child k_p_ch
            JOIN kassa_prixod AS k_p ON k_p_ch.kassa_prixod_id = k_p.id
            JOIN spravochnik_podotchet_litso AS s_p_l ON s_p_l.id = k_p.id_podotchet_litso
            JOIN users u ON k_p.user_id = u.id
            JOIN regions r ON u.region_id = r.id
            JOIN spravochnik_operatsii AS s_op ON s_op.id = k_p_ch.spravochnik_operatsii_id
            WHERE r.id = $1 
                AND k_p.main_schet_id = $2
                AND k_p.isdeleted = false
                AND k_p.doc_date BETWEEN $3 AND $4
                AND k_p.id_podotchet_litso = $5
                AND s_op.schet = $6
        `;
        const result = await db.query(query, params)
        return result[0].total
    }
}