const { db } = require('@db/index');

exports.DashboardDB = class {
    static async getBudjet(params, budjet_id, main_schet_id) {
        let main_schet_filter = '';
        let budjet_filter = ``;

        if (main_schet_id) {
            params.push(main_schet_id);
            main_schet_filter = `AND m.id = $${params.length}`;
        }

        if (budjet_id) {
            params.push(budjet_id);
            budjet_filter = `AND b.id = $${params.length}`;
        }

        const query = `
            SELECT
                b.*,
                COALESCE(
                    (
                        SELECT JSON_AGG(m)
                        FROM main_schet m 
                        WHERE m.isdeleted = false 
                            AND m.spravochnik_budjet_name_id = b.id
                            ${main_schet_filter}
                    ), '[]'::json
                ) AS main_schets    
            FROM spravochnik_budjet_name b
            WHERE b.isdeleted = false
                ${budjet_filter}
        `;

        const result = await db.query(query, params);

        return result;
    }

    static async kassa(params) {
        const query = `
            SELECT 
                COALESCE(SUM(p.summa), 0)::FLOAT - 
                COALESCE(SUM(r.summa), 0)::FLOAT summa 
            FROM kassa_prixod p 
            FULL JOIN kassa_rasxod r ON p.main_schet_id = r.main_schet_id AND p.doc_date = r.doc_date
            WHERE p.main_schet_id = $1 AND p.doc_date <= $2
        `;

        const result = await db.query(query, params);

        return result[0];
    }

    static async bank(params) {
        const query = `
            SELECT
                COALESCE(SUM(p.summa), 0) :: FLOAT - 
                COALESCE(SUM(r.summa), 0) :: FLOAT summa
            FROM
                bank_prixod p FULL
                JOIN bank_rasxod r ON p.main_schet_id = r.main_schet_id
                AND p.doc_date = r.doc_date
            WHERE
                p.main_schet_id = $1
                AND p.doc_date <= $2
        `;

        const result = await db.query(query, params);

        return result[0];
    }

    static async podotchets(params) {
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
            WHERE a.main_schet_id = $1 
                AND a.doc_date <= $2
            GROUP BY s.id;
        `;

        const result = await db.query(query, params);

        return result;
    }
}