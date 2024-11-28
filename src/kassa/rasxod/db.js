const { db } = require('../../db/index')

exports.KassaRasxodDB = class {
    static async getByPodotchetIdKassaRasxod(params, offset, limit) {
        let offset_limit = ``
        if(offset && limit) {
            offset_limit = `OFFSET $7 LIMIT $8`
        }
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
                s_op.sub_schet AS provodki_sub_schet,
                'kassa_rasxod' AS type
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
            ORDER BY doc_date DESC ${offset_limit}
        `;
        const result = await db.query(query, params)
        return result;
    }

    static async getByPodotchetIdTotalKassaRasxod(params){
        const query = `--sql
            SELECT COALESCE(COUNT(k_r_ch.id), 0)::INTEGER AS total
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
        `;
        const result = await db.query(query, params)
        return result[0].total
    }

    static async getByPodotchetIdSummaKassaRasxod(params) {
        const query = `--sql
            SELECT COALESCE(SUM(k_r_ch.summa), 0)::FLOAT AS summa
            FROM kassa_rasxod_child k_r_ch
            JOIN kassa_rasxod AS k_r ON k_r_ch.kassa_rasxod_id = k_r.id
            JOIN spravochnik_podotchet_litso AS s_p_l ON s_p_l.id = k_r.id_podotchet_litso 
            JOIN users u ON k_r.user_id = u.id
            JOIN regions r ON u.region_id = r.id
            JOIN spravochnik_operatsii AS s_op ON s_op.id = k_r_ch.spravochnik_operatsii_id
            WHERE r.id = $1 
                AND k_r.main_schet_id = $2 
                AND k_r.isdeleted = false
                AND k_r.doc_date <= $3
                AND k_r.id_podotchet_litso = $4
                AND s_op.schet = $5
        `;
        const result = await db.query(query, params)
        return result[0].summa
    }

    static async getBySchetKassaRasxod(params) {
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
                s_op.sub_schet AS provodki_sub_schet,
                'kassa_rasxod' AS type
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
                AND s_op.schet = $5
            OFFSET $6 LIMIT $7
        `;
        const result = await db.query(query, params)
        return result;
    }

    static async getBySchetTotalKassaRasxod(params){
        const query = `--sql
            SELECT COALESCE(COUNT(k_r_ch.id), 0)::INTEGER AS total
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
                AND s_op.schet = $5
        `;
        const result = await db.query(query, params)
        return result[0].total
    }

    static async getBySchetSummaKassaRasxod(params) {
        const query = `--sql
            SELECT COALESCE(SUM(k_r_ch.summa), 0)::FLOAT AS summa
            FROM kassa_rasxod_child k_r_ch
            JOIN kassa_rasxod AS k_r ON k_r_ch.kassa_rasxod_id = k_r.id
            JOIN spravochnik_podotchet_litso AS s_p_l ON s_p_l.id = k_r.id_podotchet_litso 
            JOIN users u ON k_r.user_id = u.id
            JOIN regions r ON u.region_id = r.id
            JOIN spravochnik_operatsii AS s_op ON s_op.id = k_r_ch.spravochnik_operatsii_id
            WHERE r.id = $1 
                AND k_r.main_schet_id = $2 
                AND k_r.isdeleted = false
                AND k_r.doc_date <= $3
                AND s_op.schet = $4
        `;
        const result = await db.query(query, params)
        return result[0].summa
    }

    static async getByPodotchetIdAndBudjetSummaKassaRasxod(params, client) {
        const query = `--sql
            SELECT COALESCE(SUM(k_r_ch.summa), 0)::FLOAT AS summa
            FROM kassa_rasxod_child k_r_ch
            JOIN kassa_rasxod AS k_r ON k_r_ch.kassa_rasxod_id = k_r.id
            JOIN spravochnik_podotchet_litso AS s_p_l ON s_p_l.id = k_r.id_podotchet_litso 
            JOIN users u ON k_r.user_id = u.id
            JOIN regions r ON u.region_id = r.id
            JOIN spravochnik_operatsii AS s_op ON s_op.id = k_r_ch.spravochnik_operatsii_id
            JOIN main_schet AS m_sch ON m_sch.id = k_r.main_schet_id  
            JOIN spravochnik_budjet_name AS s_b_n ON s_b_n.id = m_sch.spravochnik_budjet_name_id 
            WHERE r.id = $1 
                AND s_b_n.id = $2 
                AND k_r.isdeleted = false
                AND k_r.doc_date <= $3
                AND k_r.id_podotchet_litso = $4
        `;
        const result = await client.query(query, params)
        return result.rows[0].summa
    }
}