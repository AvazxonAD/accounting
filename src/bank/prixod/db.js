const { db } = require('../../db/index')

exports.BankPrixodDB = class {
    static async getByPodotchetIdBankPrixod(params) {
        const query = `--sql
            SELECT 
                b_p.id, 
                b_p.doc_num,
                TO_CHAR(b_p.doc_date, 'YYYY-MM-DD') AS doc_date,
                0::FLOAT AS prixod_sum,
                b_p_ch.summa::FLOAT AS rasxod_sum,
                b_p.opisanie,
                b_p_ch.id_spravochnik_podotchet_litso AS podotchet_litso_id,
                s_p_l.name AS podotchet_name,
                s_p_l.rayon AS podotchet_rayon,
                u.login,
                u.fio,
                u.id AS user_id,
                s_op.schet AS provodki_schet,
                s_op.sub_schet AS provodki_sub_schet,
                'bank_prixod' AS type
            FROM bank_prixod_child b_p_ch
            JOIN bank_prixod AS b_p ON b_p_ch.id_bank_prixod = b_p.id
            JOIN spravochnik_podotchet_litso AS s_p_l ON s_p_l.id = b_p_ch.id_spravochnik_podotchet_litso 
            JOIN users u ON b_p.user_id = u.id
            JOIN regions r ON u.region_id = r.id
            JOIN spravochnik_operatsii AS s_op ON s_op.id = b_p_ch.spravochnik_operatsii_id
            WHERE r.id = $1 
                AND b_p.main_schet_id = $2 
                AND b_p.isdeleted = false   
                AND b_p.doc_date BETWEEN $3 AND $4
                AND b_p_ch.id_spravochnik_podotchet_litso = $5
                AND s_op.schet = $6
            ORDER BY doc_date DESC
            OFFSET $7 LIMIT $8
        `;
        const result = await db.query(query, params)
        return result;
    }

    static async getByPodotchetIdTotalBankPrixod(params) {
        const query = `--sql
            SELECT COALESCE(COUNT(b_p_ch.id), 0)::INTEGER AS total
            FROM bank_prixod_child b_p_ch
            JOIN bank_prixod AS b_p ON b_p_ch.id_bank_prixod = b_p.id
            JOIN spravochnik_podotchet_litso AS s_p_l ON s_p_l.id = b_p_ch.id_spravochnik_podotchet_litso
            JOIN users u ON b_p.user_id = u.id
            JOIN regions r ON u.region_id = r.id
            JOIN spravochnik_operatsii AS s_op ON s_op.id = b_p_ch.spravochnik_operatsii_id
            WHERE r.id = $1 
                AND b_p.main_schet_id = $2
                AND b_p.isdeleted = false
                AND b_p.doc_date BETWEEN $3 AND $4
                AND b_p_ch.id_spravochnik_podotchet_litso = $5
                AND s_op.schet = $6
        `;
        const result = await db.query(query, params)
        return result[0].total
    }

    static async getByPodotchetIdSummaBankPrixod(params) {
        const query = `--sql
            SELECT COALESCE(SUM(b_p_ch.summa), 0)::FLOAT AS summa
            FROM bank_prixod_child AS b_p_ch
            JOIN bank_prixod AS b_p ON b_p_ch.id_bank_prixod = b_p.id
            JOIN spravochnik_podotchet_litso AS s_p_l ON s_p_l.id = b_p_ch.id_spravochnik_podotchet_litso 
            JOIN users u ON b_p.user_id = u.id
            JOIN regions r ON u.region_id = r.id
            JOIN spravochnik_operatsii AS s_op ON s_op.id = b_p_ch.spravochnik_operatsii_id
            WHERE r.id = $1 
                AND b_p.main_schet_id = $2 
                AND b_p.isdeleted = false   
                AND b_p.doc_date <= $3
                AND b_p_ch.id_spravochnik_podotchet_litso = $4
                AND s_op.schet = $5
        `;
        const result = await db.query(query, params)
        return result[0].summa
    }

    static async getBySchetBankPrixod(params) {
        const query = `--sql
            SELECT 
                b_p.id, 
                b_p.doc_num,
                TO_CHAR(b_p.doc_date, 'YYYY-MM-DD') AS doc_date,
                0::FLOAT AS prixod_sum,
                b_p_ch.summa::FLOAT AS rasxod_sum,
                b_p.opisanie,
                b_p_ch.id_spravochnik_podotchet_litso AS podotchet_litso_id,
                s_p_l.name AS podotchet_name,
                s_p_l.rayon AS podotchet_rayon,
                u.login,
                u.fio,
                u.id AS user_id,
                s_op.schet AS provodki_schet,
                s_op.sub_schet AS provodki_sub_schet,
                'bank_prixod' AS type
            FROM bank_prixod_child b_p_ch
            JOIN bank_prixod AS b_p ON b_p_ch.id_bank_prixod = b_p.id
            JOIN spravochnik_podotchet_litso AS s_p_l ON s_p_l.id = b_p_ch.id_spravochnik_podotchet_litso 
            JOIN users u ON b_p.user_id = u.id
            JOIN regions r ON u.region_id = r.id
            JOIN spravochnik_operatsii AS s_op ON s_op.id = b_p_ch.spravochnik_operatsii_id
            WHERE r.id = $1 
                AND b_p.main_schet_id = $2 
                AND b_p.isdeleted = false   
                AND b_p.doc_date BETWEEN $3 AND $4
                AND s_op.schet = $5
            ORDER BY doc_date DESC
            OFFSET $6 LIMIT $7
        `;
        const result = await db.query(query, params)
        return result;
    }

    static async getBySchetTotalBankPrixod(params) {
        const query = `--sql
            SELECT COALESCE(COUNT(b_p_ch.id), 0)::INTEGER AS total
            FROM bank_prixod_child b_p_ch
            JOIN bank_prixod AS b_p ON b_p_ch.id_bank_prixod = b_p.id
            JOIN spravochnik_podotchet_litso AS s_p_l ON s_p_l.id = b_p_ch.id_spravochnik_podotchet_litso
            JOIN users u ON b_p.user_id = u.id
            JOIN regions r ON u.region_id = r.id
            JOIN spravochnik_operatsii AS s_op ON s_op.id = b_p_ch.spravochnik_operatsii_id
            WHERE r.id = $1 
                AND b_p.main_schet_id = $2
                AND b_p.isdeleted = false
                AND b_p.doc_date BETWEEN $3 AND $4
                AND s_op.schet = $5
        `;
        const result = await db.query(query, params)
        return result[0].total
    }

    static async getBySchetSummaBankPrixod(params) {
        const query = `--sql
            SELECT COALESCE(SUM(b_p_ch.summa), 0)::FLOAT AS summa
            FROM bank_prixod_child AS b_p_ch
            JOIN bank_prixod AS b_p ON b_p_ch.id_bank_prixod = b_p.id
            JOIN spravochnik_podotchet_litso AS s_p_l ON s_p_l.id = b_p_ch.id_spravochnik_podotchet_litso 
            JOIN users u ON b_p.user_id = u.id
            JOIN regions r ON u.region_id = r.id
            JOIN spravochnik_operatsii AS s_op ON s_op.id = b_p_ch.spravochnik_operatsii_id
            WHERE r.id = $1 
                AND b_p.main_schet_id = $2 
                AND b_p.isdeleted = false   
                AND b_p.doc_date <= $3
                AND s_op.schet = $4
        `;
        const result = await db.query(query, params)
        return result[0].summa
    }
}