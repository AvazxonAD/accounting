const { db } = require('../../db/index')

exports.BankRasxodDB = class {
    static async getByPodotchetIdBankRasxod(params, offset, limit) {
        let offset_limit = ``
        if(offset && limit) {
            offset_limit = `OFFSET $7 LIMIT $8`
        }
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
                s_op.sub_schet AS provodki_sub_schet,
                'bank_rasxod' AS type
            FROM bank_rasxod_child b_r_ch
            JOIN bank_rasxod AS b_r ON b_r_ch.id_bank_rasxod = b_r.id
            LEFT JOIN spravochnik_podotchet_litso AS s_p_l ON s_p_l.id = b_r_ch.id_spravochnik_podotchet_litso 
            JOIN users u ON b_r.user_id = u.id
            JOIN regions r ON u.region_id = r.id
            JOIN spravochnik_operatsii AS s_op ON s_op.id = b_r_ch.spravochnik_operatsii_id
            WHERE r.id = $1 
                AND b_r.main_schet_id = $2 
                AND b_r.isdeleted = false  
                AND b_r.doc_date BETWEEN $3 AND $4
                AND b_r_ch.id_spravochnik_podotchet_litso = $5
                AND s_op.schet = $6 
            ORDER BY doc_date DESC ${offset_limit}
        `;
        const result = await db.query(query, params)
        return result;
    }

    static async getByPodotchetIdTotalBankRasxod(params) {
        const query = `--sql
            SELECT COALESCE(COUNT(b_r_ch.id), 0)::INTEGER AS total
            FROM bank_rasxod_child b_r_ch
            JOIN bank_rasxod AS b_r ON b_r_ch.id_bank_rasxod = b_r.id
            LEFT JOIN spravochnik_podotchet_litso AS s_p_l ON s_p_l.id = b_r_ch.id_spravochnik_podotchet_litso
            JOIN users u ON b_r.user_id = u.id
            JOIN regions r ON u.region_id = r.id
            JOIN spravochnik_operatsii AS s_op ON s_op.id = b_r_ch.spravochnik_operatsii_id
            WHERE r.id = $1 
                AND b_r.main_schet_id = $2
                AND b_r.isdeleted = false
                AND b_r.doc_date BETWEEN $3 AND $4
                AND b_r_ch.id_spravochnik_podotchet_litso = $5
                AND s_op.schet = $6
        `;
        const result = await db.query(query, params)
        return result[0].total;
    }

    static async getByPodotchetIdSummaBankRasxod(params) {
        const query = `--sql
            SELECT COALESCE(SUM(b_r_ch.summa), 0)::FLOAT AS summa
            FROM bank_rasxod_child AS b_r_ch
            JOIN bank_rasxod AS b_r ON b_r_ch.id_bank_rasxod = b_r.id
            LEFT JOIN spravochnik_podotchet_litso AS s_p_l ON s_p_l.id = b_r_ch.id_spravochnik_podotchet_litso 
            JOIN users u ON b_r.user_id = u.id
            JOIN regions r ON u.region_id = r.id
            JOIN spravochnik_operatsii AS s_op ON s_op.id = b_r_ch.spravochnik_operatsii_id
            WHERE r.id = $1 
                AND b_r.main_schet_id = $2 
                AND b_r.isdeleted = false  
                AND b_r.doc_date <= $3
                AND b_r_ch.id_spravochnik_podotchet_litso = $4
                AND s_op.schet = $5
        `;
        const result = await db.query(query, params)
        return result[0].summa
    }

    static async getBySchetBankRasxod(params) {
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
                s_op.sub_schet AS provodki_sub_schet,
                'bank_rasxod' AS type
            FROM bank_rasxod_child b_r_ch
            JOIN bank_rasxod AS b_r ON b_r_ch.id_bank_rasxod = b_r.id
            LEFT JOIN spravochnik_podotchet_litso AS s_p_l ON s_p_l.id = b_r_ch.id_spravochnik_podotchet_litso 
            JOIN users u ON b_r.user_id = u.id
            JOIN regions r ON u.region_id = r.id
            JOIN spravochnik_operatsii AS s_op ON s_op.id = b_r_ch.spravochnik_operatsii_id
            WHERE r.id = $1 
                AND b_r.main_schet_id = $2 
                AND b_r.isdeleted = false  
                AND b_r.doc_date BETWEEN $3 AND $4
                AND s_op.schet = $5
            OFFSET $6 LIMIT $7
        `;
        const result = await db.query(query, params)
        return result;
    }

    static async getBySchetTotalBankRasxod(params) {
        const query = `--sql
            SELECT COALESCE(COUNT(b_r_ch.id), 0)::INTEGER AS total
            FROM bank_rasxod_child b_r_ch
            JOIN bank_rasxod AS b_r ON b_r_ch.id_bank_rasxod = b_r.id
            LEFT JOIN spravochnik_podotchet_litso AS s_p_l ON s_p_l.id = b_r_ch.id_spravochnik_podotchet_litso
            JOIN users u ON b_r.user_id = u.id
            JOIN regions r ON u.region_id = r.id
            JOIN spravochnik_operatsii AS s_op ON s_op.id = b_r_ch.spravochnik_operatsii_id
            WHERE r.id = $1 
                AND b_r.main_schet_id = $2
                AND b_r.isdeleted = false
                AND b_r.doc_date BETWEEN $3 AND $4
                AND s_op.schet = $5
        `;
        const result = await db.query(query, params)
        return result[0].total;
    }

    static async getBySchetSummaBankRasxod(params) {
        const query = `--sql
            SELECT COALESCE(SUM(b_r_ch.summa), 0)::FLOAT AS summa
            FROM bank_rasxod_child AS b_r_ch
            JOIN bank_rasxod AS b_r ON b_r_ch.id_bank_rasxod = b_r.id
            LEFT JOIN spravochnik_podotchet_litso AS s_p_l ON s_p_l.id = b_r_ch.id_spravochnik_podotchet_litso 
            JOIN users u ON b_r.user_id = u.id
            JOIN regions r ON u.region_id = r.id
            JOIN spravochnik_operatsii AS s_op ON s_op.id = b_r_ch.spravochnik_operatsii_id
            WHERE r.id = $1 
                AND b_r.main_schet_id = $2 
                AND b_r.isdeleted = false  
                AND b_r.doc_date <= $3
                AND s_op.schet = $4
        `;
        const result = await db.query(query, params)
        return result[0].summa
    }

    static async getByPodotchetIdAndBudjetSummaBankRasxod(params, client) {
        const query = `--sql
            SELECT COALESCE(SUM(b_r_ch.summa), 0)::FLOAT AS summa
            FROM bank_rasxod_child AS b_r_ch
            JOIN bank_rasxod AS b_r ON b_r_ch.id_bank_rasxod = b_r.id
            LEFT JOIN spravochnik_podotchet_litso AS s_p_l ON s_p_l.id = b_r_ch.id_spravochnik_podotchet_litso 
            JOIN users u ON b_r.user_id = u.id
            JOIN regions r ON u.region_id = r.id
            JOIN spravochnik_operatsii AS s_op ON s_op.id = b_r_ch.spravochnik_operatsii_id
            JOIN main_schet AS m_sch ON m_sch.id = b_r.main_schet_id  
            JOIN spravochnik_budjet_name AS s_b_n ON s_b_n.id = m_sch.spravochnik_budjet_name_id 
            WHERE r.id = $1 
                AND s_b_n.id = $2 
                AND b_r.isdeleted = false  
                AND b_r.doc_date <= $3
                AND b_r_ch.id_spravochnik_podotchet_litso = $4
        `;
        const result = await client.query(query, params)
        return result.rows[0].summa
    }

    static async getByOrganizationIdBankRasxod(params, client) {
        const query = `--sql
            SELECT
                b_r.id,
                b_r.doc_num,
                b_r.doc_date,
                b_r.opisanie,
                0::FLOAT AS summa_rasxod, 
                b_r_ch.summa::FLOAT AS summa_prixod,
                sh_o.id AS shartnoma_id,
                sh_o.doc_num AS shartnoma_doc_num,
                TO_CHAR(sh_o.doc_date, 'YYYY-MM-DD') AS shartnoma_doc_date,
                s.smeta_number,
                s_o.id AS organ_id,
                s_o.name AS organ_name,
                s_o.inn AS organ_inn,
                u.id AS user_id,
                u.login,
                u.fio,
                s_o_p.schet AS provodki_schet, 
                s_o_p.sub_schet AS provodki_sub_schet
            FROM bank_rasxod_child b_r_ch
            JOIN bank_rasxod AS b_r ON b_r_ch.id_bank_rasxod = b_r.id
            JOIN users AS u ON u.id = b_r.user_id
            JOIN regions AS r ON r.id = u.region_id 
            LEFT JOIN shartnomalar_organization AS sh_o ON sh_o.id = b_r.id_shartnomalar_organization
            LEFT JOIN smeta AS s ON sh_o.smeta_id = s.id 
            JOIN spravochnik_organization AS s_o ON s_o.id = b_r.id_spravochnik_organization
            JOIN spravochnik_operatsii AS s_o_p ON s_o_p.id = b_r_ch.spravochnik_operatsii_id
            WHERE b_r.isdeleted = false
                AND r.id = $1 
                AND b_r.main_schet_id = $2
                AND s_o_p.schet = $3
                AND b_r.doc_date BETWEEN $4 AND $5
                AND b_r.id_spravochnik_organization = $6 OFFSET $7 LIMIT $8 ORDER BY doc_date
        `;
        const result = await client.query(query, params)
        return result.rows;
    }
}