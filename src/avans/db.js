const { db } = require('../db/index')

exports.AvansDB = class {
    static async getByPodotchetIdAvans(params) {
        const query = `--sql
            SELECT  
                a_tj4.id, 
                a_tj4.doc_num,
                TO_CHAR(a_tj4.doc_date, 'YYYY-MM-DD') AS doc_date,
                0::FLOAT AS prixod_sum,
                a_tj4_ch.summa::FLOAT AS rasxod_sum,
                a_tj4.opisanie,
                s_p_l.id AS podotchet_litso_id,
                s_p_l.name AS podotchet_name,
                s_p_l.rayon AS podotchet_rayon,
                u.login,
                u.fio,
                u.id AS user_id,
                s_p.schet AS provodki_schet,
                s_p.sub_schet AS provodki_sub_schet,
                'avans' AS type
            FROM avans_otchetlar_jur4_child a_tj4_ch
            JOIN avans_otchetlar_jur4 AS a_tj4 ON a_tj4_ch.avans_otchetlar_jur4_id = a_tj4.id
            JOIN spravochnik_podotchet_litso AS s_p_l ON s_p_l.id = a_tj4.spravochnik_podotchet_litso_id 
            JOIN users u ON a_tj4.user_id = u.id
            JOIN regions r ON u.region_id = r.id
            JOIN spravochnik_operatsii AS s_op ON s_op.id = a_tj4.spravochnik_operatsii_own_id
            JOIN spravochnik_operatsii AS s_p ON s_p.id = a_tj4_ch.spravochnik_operatsii_id
            WHERE r.id = $1 AND a_tj4.main_schet_id = $2 
                AND a_tj4.isdeleted = false  
                AND a_tj4.doc_date BETWEEN $3 AND $4
                AND s_p_l.id = $5
                AND s_op.schet = $6
            OFFSET $7 LIMIT $8
        `;
        const result = await db.query(query, params)
        return result;
    }

    static async getByPodotchetIdTotalAvans(params) {
        const query = `--sql
            SELECT COALESCE(COUNT(a_tj4_ch.id), 0)::INTEGER AS total
            FROM avans_otchetlar_jur4_child a_tj4_ch
            JOIN avans_otchetlar_jur4 AS a_tj4 ON a_tj4_ch.avans_otchetlar_jur4_id = a_tj4.id
            JOIN spravochnik_podotchet_litso AS s_p_l ON s_p_l.id = a_tj4.spravochnik_podotchet_litso_id
            JOIN users u ON a_tj4.user_id = u.id
            JOIN regions r ON u.region_id = r.id
            JOIN spravochnik_operatsii AS s_op ON s_op.id = a_tj4.spravochnik_operatsii_own_id
            WHERE r.id = $1 
                AND a_tj4.main_schet_id = $2
                AND a_tj4.isdeleted = false
                AND a_tj4.doc_date BETWEEN $3 AND $4
                AND s_p_l.id = $5
                AND s_op.schet = $6
        `;
        const result = await db.query(query, params)
        return result[0].total
    }

    static async getByPodotchetIdSummaAvans(params) {
        const query = `--sql
            SELECT COALESCE(SUM(a_tj4_ch.summa), 0)::FLOAT AS summa
            FROM avans_otchetlar_jur4_child a_tj4_ch
            JOIN avans_otchetlar_jur4 AS a_tj4 ON a_tj4_ch.avans_otchetlar_jur4_id = a_tj4.id
            JOIN spravochnik_podotchet_litso AS s_p_l ON s_p_l.id = a_tj4.spravochnik_podotchet_litso_id 
            JOIN users u ON a_tj4.user_id = u.id
            JOIN regions r ON u.region_id = r.id
            JOIN spravochnik_operatsii AS s_op ON s_op.id = a_tj4.spravochnik_operatsii_own_id
            WHERE r.id = $1 
                AND a_tj4.main_schet_id = $2 
                AND a_tj4.isdeleted = false  
                AND a_tj4.doc_date <= $3
                AND s_p_l.id = $4
                AND s_op.schet = $5
        `;
        const result = await db.query(query, params)
        return result[0].summa
    }
}