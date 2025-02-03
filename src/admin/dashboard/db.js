const { db } = require('../../db/index');

exports.DashboardDB = class {
    static async getBudjet(params) {
        const query = `
            SELECT
                b.*,
                (   
                    SELECT JSON_AGG(m)
                    FROM main_schet m 
                    WHERE m.isdeleted = false 
                        AND m.spravochnik_budjet_name_id = b.id
                ) AS main_schets    
            FROM spravochnik_budjet_name b
            WHERE b.isdeleted = false;
        `;

        const result = await db.query(query, params);

        return result;
    }

    static async getKassSumma(params) {
        const query = `
            WITH kassa AS (
                SELECT 
                    COALESCE(SUM(p.summa), 0)::FLOAT - 
                    COALESCE(SUM(r.summa), 0)::FLOAT summa 
                FROM kassa_prixod p 
                FULL JOIN kassa_rasxod r ON p.main_schet_id = r.main_schet_id AND p.doc_date = r.doc_date
                WHERE p.main_schet_id = $1 AND p.doc_date <= $2 
            ),
            bank AS (
                SELECT 
                    COALESCE(SUM(p.summa), 0)::FLOAT - 
                    COALESCE(SUM(r.summa), 0)::FLOAT summa 
                FROM bank_prixod p 
                FULL JOIN bank_rasxod r ON p.main_schet_id = r.main_schet_id AND p.doc_date = r.doc_date
                WHERE p.main_schet_id = $1 AND p.doc_date <= $2
            )

            SELECT 
                kassa.summa AS kassa_summa,
                bank.summa AS bank_summa
            
            FROM bank, kassa
        `;

        const result = await db.query(query, params);

        return result[0];
    }

    static async getPodotchets(params) {
        const query = `
            SELECT 
                COALESCE(SUM(a.summa), 0)::FLOAT AS rasxod,   
                0 AS prixod,   
                s.id AS podotchet_id,  
                s.name AS spravochnik_podotchet_litso_name,
                s.rayon AS spravochnik_podotchet_litso_rayon
            FROM avans_otchetlar_jur4 AS a
            JOIN users AS u ON u.id = a.user_id
            JOIN regions AS r ON u.region_id = r.id
            JOIN spravochnik_podotchet_litso AS s ON s.id = a.spravochnik_podotchet_litso_id 
            WHERE a.main_schet_id = $1 AND a.doc_date <= $2
            GROUP BY s.id;
        `;

        const result = await db.query(query, params);

        return result;
    }
}