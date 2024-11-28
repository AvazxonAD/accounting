const { db } = require('../../db/index')

exports.KassaPrixodDB = class {
    static async getByPodotchetIdKassaPrixod(params, offset, limit) {
        let offset_limit = ``
        if(offset && limit) {
            offset_limit = `OFFSET $7 LIMIT $8`
        }
        const query = `--sql
            SELECT 
                k_p.id, 
                k_p.doc_num,
                TO_CHAR(k_p.doc_date, 'YYYY-MM-DD') AS doc_date,
                0::FLOAT AS prixod_sum,
                k_p_ch.summa::FLOAT AS rasxod_sum,
                k_p.opisanie,
                k_p.id_podotchet_litso AS podotchet_litso_id,
                s_p_l.name AS podotchet_name,
                s_p_l.rayon AS podotchet_rayon,
                u.login,
                u.fio,
                u.id AS user_id,
                s_op.schet AS provodki_schet,
                s_op.sub_schet AS provodki_sub_schet,
                'kassa_prixod' AS type
            FROM kassa_prixod_child k_p_ch
            JOIN kassa_prixod AS k_p ON k_p_ch.kassa_prixod_id = k_p.id
            JOIN spravochnik_podotchet_litso AS s_p_l ON s_p_l.id = k_p.id_podotchet_litso 
            JOIN users u ON k_p.user_id = u.id
            JOIN regions r ON u.region_id = r.id
            JOIN spravochnik_operatsii AS s_op ON s_op.id = k_p_ch.spravochnik_operatsii_id
            WHERE r.id = $1 AND k_p.main_schet_id = $2 
                AND k_p.isdeleted = false  
                AND k_p.doc_date BETWEEN $3 AND $4
                AND k_p.id_podotchet_litso = $5
                AND s_op.schet = $6
            ORDER BY doc_date DESC ${offset_limit}
        `;
        const result = await db.query(query, params)
        return result;
    }

    static async getByPodotchetIdTotalKassaPrixod(params){
        const query = `--sql
            SELECT COALESCE(COUNT(k_p_ch.id), 0)::INTEGER AS total
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

    static async getByPodotchetIdSummaKassaPrixod(params) {
        const query = `--sql
            SELECT COALESCE(SUM(k_p_ch.summa), 0)::FLOAT AS summa
            FROM kassa_prixod_child k_p_ch
            JOIN kassa_prixod AS k_p ON k_p_ch.kassa_prixod_id = k_p.id
            JOIN spravochnik_podotchet_litso AS s_p_l ON s_p_l.id = k_p.id_podotchet_litso 
            JOIN users u ON k_p.user_id = u.id
            JOIN regions r ON u.region_id = r.id
            JOIN spravochnik_operatsii AS s_op ON s_op.id = k_p_ch.spravochnik_operatsii_id
            WHERE r.id = $1 
                AND k_p.main_schet_id = $2 
                AND k_p.isdeleted = false  
                AND k_p.doc_date <= $3
                AND k_p.id_podotchet_litso = $4
                AND s_op.schet = $5
        `;
        const result = await db.query(query, params)
        return result[0].summa;
    }

    static async getBySchetKassaPrixod(params) {
        const query = `--sql
            SELECT 
                k_p.id, 
                k_p.doc_num,
                TO_CHAR(k_p.doc_date, 'YYYY-MM-DD') AS doc_date,
                0::FLOAT AS prixod_sum,
                k_p_ch.summa::FLOAT AS rasxod_sum,
                k_p.opisanie,
                k_p.id_podotchet_litso AS podotchet_litso_id,
                s_p_l.name AS podotchet_name,
                s_p_l.rayon AS podotchet_rayon,
                u.login,
                u.fio,
                u.id AS user_id,
                s_op.schet AS provodki_schet,
                s_op.sub_schet AS provodki_sub_schet,
                'kassa_prixod' AS type
            FROM kassa_prixod_child k_p_ch
            JOIN kassa_prixod AS k_p ON k_p_ch.kassa_prixod_id = k_p.id
            JOIN spravochnik_podotchet_litso AS s_p_l ON s_p_l.id = k_p.id_podotchet_litso 
            JOIN users u ON k_p.user_id = u.id
            JOIN regions r ON u.region_id = r.id
            JOIN spravochnik_operatsii AS s_op ON s_op.id = k_p_ch.spravochnik_operatsii_id
            WHERE r.id = $1 AND k_p.main_schet_id = $2 
                AND k_p.isdeleted = false  
                AND k_p.doc_date BETWEEN $3 AND $4
                AND s_op.schet = $5
            OFFSET $6 LIMIT $7
        `;
        const result = await db.query(query, params)
        return result;
    }

    static async getBySchetTotalKassaPrixod(params){
        const query = `--sql
            SELECT COALESCE(COUNT(k_p_ch.id), 0)::INTEGER AS total
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
                AND s_op.schet = $5
        `;
        const result = await db.query(query, params)
        return result[0].total
    }

    static async getBySchetSummaKassaPrixod(params) {
        const query = `--sql
            SELECT COALESCE(SUM(k_p_ch.summa), 0)::FLOAT AS summa
            FROM kassa_prixod_child k_p_ch
            JOIN kassa_prixod AS k_p ON k_p_ch.kassa_prixod_id = k_p.id
            JOIN spravochnik_podotchet_litso AS s_p_l ON s_p_l.id = k_p.id_podotchet_litso 
            JOIN users u ON k_p.user_id = u.id
            JOIN regions r ON u.region_id = r.id
            JOIN spravochnik_operatsii AS s_op ON s_op.id = k_p_ch.spravochnik_operatsii_id
            WHERE r.id = $1 
                AND k_p.main_schet_id = $2 
                AND k_p.isdeleted = false  
                AND k_p.doc_date <= $3
                AND s_op.schet = $4
        `;
        const result = await db.query(query, params)
        return result[0].summa;
    }

    static async getByPodotchetIdAndBudjetSummaKassaPrixod(params, client) {
        const query = `--sql
            SELECT COALESCE(SUM(k_p_ch.summa), 0)::FLOAT AS summa
            FROM kassa_prixod_child k_p_ch
            JOIN kassa_prixod AS k_p ON k_p_ch.kassa_prixod_id = k_p.id
            JOIN spravochnik_podotchet_litso AS s_p_l ON s_p_l.id = k_p.id_podotchet_litso 
            JOIN users u ON k_p.user_id = u.id
            JOIN regions r ON u.region_id = r.id
            JOIN spravochnik_operatsii AS s_op ON s_op.id = k_p_ch.spravochnik_operatsii_id
            JOIN main_schet AS m_sch ON m_sch.id = k_p.main_schet_id  
            JOIN spravochnik_budjet_name AS s_b_n ON s_b_n.id = m_sch.spravochnik_budjet_name_id 
            WHERE r.id = $1 
                AND s_b_n.id = $2 
                AND k_p.isdeleted = false  
                AND k_p.doc_date <= $3
                AND k_p.id_podotchet_litso = $4
        `;
        const result = await client.query(query, params)
        return result.rows[0].summa;
    }
}