const { db } = require('../../db/index')

exports.EndMainBookDB = class {
    static async createEnd(params, client) {
        const query = `--sql
            INSERT INTO zakonchit_glavniy_kniga (
                user_id,
                document_yaratilgan_vaqt,
                user_id_qabul_qilgan,
                document_qabul_qilingan_vaqt, 
                main_schet_id,
                spravochnik_operatsii_id,
                type_document,
                month,
                year, 
                debet_sum, 
                kredit_sum, 
                status,
                created_at,
                updated_at
            ) 
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *
        `;
        const result = await client.query(query, params)
        return result.rows[0];
    }

    static async getEnd(params) {
        const query = `--sql
            SELECT 
                DISTINCT 
                    d.month,
                    d.year,
                    d.user_id,
                    d.user_id_qabul_qilgan,
                    b.id AS budjet_id, 
                    b.name AS budjet_name,
                    d.status
            FROM zakonchit_glavniy_kniga AS d
            JOIN users AS u ON u.id = d.user_id
            JOIN regions AS r ON r.id = u.region_id
            JOIN main_schet AS m ON m.id = d.main_schet_id
            JOIN spravochnik_budjet_name AS b ON b.id = m.spravochnik_budjet_name_id
            WHERE r.id = $1 
                AND d.isdeleted = false 
                AND m.spravochnik_budjet_name_id = $2
        `;
        const result = await db.query(query, params)
        return result;
    }

    static async getEndAll(params) {
        const query = `--sql
            SELECT  
                d.id,
                d.user_id,
                d.document_yaratilgan_vaqt,
                d.user_id_qabul_qilgan,
                d.document_qabul_qilingan_vaqt, 
                d.main_schet_id,
                d.spravochnik_operatsii_id,
                d.type_document,
                d.month,
                d.year, 
                d.debet_sum, 
                d.kredit_sum, 
                d.status,
                d.created_at,
                d.updated_at
            FROM zakonchit_glavniy_kniga AS d
            JOIN users AS u ON u.id = d.user_id
            JOIN regions AS r ON r.id = u.region_id
            JOIN main_schet AS m ON m.id = d.main_schet_id
            JOIN spravochnik_budjet_name AS b ON b.id = m.spravochnik_budjet_name_id
            WHERE r.id = $1 
                AND d.isdeleted = false 
                AND m.spravochnik_budjet_name_id = $2
                AND d.year = $3
                AND d.month = $4
        `;
        const result = await db.query(query, params)
        return result;
    }

    static async deleteEnd(params, client) {
        await client.query(`UPDATE zakonchit_glavniy_kniga SET isdeleted = true WHERE id = $1`, params);
    }
}