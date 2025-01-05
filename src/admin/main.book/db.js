const { db } = require('../../db/index')

exports.ReportMainBookDB = class {

    static async getReport(params, year, month) {
        let year_filter = ``;
        let month_filter = ``;
        if (year) {
            year_filter = `AND d.year = $${params.length + 1}`;
            params.push(year)
        }
        if (month) {
            month_filter = `AND d.month = $${params.length + 1}`;
            params.push(month)
        }
        const query = `--sql
            SELECT 
                DISTINCT 
                    d.month,
                    d.year,
                    b.id AS budjet_id,
                    b.name AS budjet_name,
                    d.user_id,
                    u.login AS user_login,
                    d.user_id_qabul_qilgan,
                    ua.login AS user_login_qabul_qilgan,
                    d.status,
                    r.id AS region_id,
                    r.name AS region_name,
                (
                    SELECT 
                        d.document_yaratilgan_vaqt
                    FROM zakonchit_glavniy_kniga AS d
                    JOIN users AS u ON u.id = d.user_id
                    LEFT JOIN  users AS ua ON ua.id = d.user_id_qabul_qilgan
                    JOIN regions AS r ON r.id = u.region_id
                    JOIN spravochnik_budjet_name AS b ON b.id = d.budjet_id
                    WHERE d.isdeleted = false 
                        ${year_filter} ${month_filter}
                    ORDER BY d.document_yaratilgan_vaqt DESC
                    LIMIT 1
                ) AS document_yaratilgan_vaqt,
                (
                    SELECT 
                        d.document_qabul_qilingan_vaqt
                    FROM zakonchit_glavniy_kniga AS d
                    JOIN users AS u ON u.id = d.user_id
                    LEFT JOIN  users AS ua ON ua.id = d.user_id_qabul_qilgan
                    JOIN regions AS r ON r.id = u.region_id
                    JOIN spravochnik_budjet_name AS b ON b.id = d.budjet_id
                    WHERE d.isdeleted = false 
                        ${year_filter} ${month_filter}
                    ORDER BY d.document_qabul_qilingan_vaqt DESC
                    LIMIT 1
                ) AS document_qabul_qilingan_vaqt
            FROM zakonchit_glavniy_kniga AS d
            JOIN users AS u ON u.id = d.user_id
            LEFT JOIN  users AS ua ON ua.id = d.user_id_qabul_qilgan
            JOIN regions AS r ON r.id = u.region_id
            JOIN spravochnik_budjet_name AS b ON b.id = d.budjet_id
            WHERE d.isdeleted = false 
                ${year_filter} ${month_filter}
        `;
        const result = await db.query(query, params)
        return result;
    }

    static async getByIdReport(params) {
        const query = `--sql
            SELECT 
                DISTINCT 
                    d.month,
                    d.year,
                    b.id AS budjet_id,
                    b.name AS budjet_name,
                    d.user_id,
                    u.login AS user_login,
                    d.user_id_qabul_qilgan,
                    ua.login AS user_login_qabul_qilgan,
                    d.status,
                (
                    SELECT 
                        d.document_yaratilgan_vaqt
                    FROM zakonchit_glavniy_kniga AS d
                    JOIN users AS u ON u.id = d.user_id
                    LEFT JOIN  users AS ua ON ua.id = d.user_id_qabul_qilgan
                    JOIN regions AS r ON r.id = u.region_id
                    JOIN spravochnik_budjet_name AS b ON b.id = d.budjet_id
                    WHERE r.id = $1 
                        AND b.id = $2
                        AND d.year = $3 
                        AND d.month = $4
                        AND d.isdeleted = false 
                    ORDER BY d.document_yaratilgan_vaqt DESC
                    LIMIT 1
                ) AS document_yaratilgan_vaqt,
                (
                    SELECT 
                        d.document_qabul_qilingan_vaqt
                    FROM zakonchit_glavniy_kniga AS d
                    JOIN users AS u ON u.id = d.user_id
                    LEFT JOIN  users AS ua ON ua.id = d.user_id_qabul_qilgan
                    JOIN regions AS r ON r.id = u.region_id
                    JOIN spravochnik_budjet_name AS b ON b.id = d.budjet_id
                    WHERE r.id = $1 
                        AND b.id = $2
                        AND d.year = $3 
                        AND d.month = $4
                        AND d.isdeleted = false 
                    ORDER BY d.document_qabul_qilingan_vaqt DESC
                    LIMIT 1
                ) AS document_qabul_qilingan_vaqt
            FROM zakonchit_glavniy_kniga AS d
            JOIN users AS u ON u.id = d.user_id
            LEFT JOIN  users AS ua ON ua.id = d.user_id_qabul_qilgan
            JOIN regions AS r ON r.id = u.region_id
            JOIN spravochnik_budjet_name AS b ON b.id = d.budjet_id
            WHERE r.id = $1 
                AND b.id = $2
                AND d.isdeleted = false 
                AND d.year = $3 
                AND d.month = $4
        `;
        const result = await db.query(query, params)
        return result[0];
    }
 
    static async getSchetSummaBySchetId(params) {
        const query = `--sql
            SELECT 
                d.debet_sum::FLOAT,
                d.kredit_sum::FLOAT
            FROM zakonchit_glavniy_kniga d
            JOIN users AS u ON u.id = d.user_id
            JOIN regions AS r ON r.id = u.region_id
            JOIN spravochnik_budjet_name AS b ON b.id = d.budjet_id
            WHERE r.id = $1 
                AND d.year = $2 
                AND d.month = $3 
                AND d.budjet_id = $4
                AND d.spravochnik_main_book_schet_id = $5
                AND d.type_document = $6
                AND d.isdeleted = false
        `;
        const result = await db.query(query, params);
        return result[0];
    }
  
    static async updateReport(params) {
        const query = `--sql
            UPDATE zakonchit_glavniy_kniga 
            SET  
                user_id_qabul_qilgan = $5,
                document_qabul_qilingan_vaqt = $6,
                status = $7
            WHERE EXISTS (
                SELECT 1
                FROM users AS u
                JOIN regions AS r ON r.id = u.region_id
                WHERE u.id = zakonchit_glavniy_kniga.user_id
                    AND r.id = $1
                    AND zakonchit_glavniy_kniga.year = $2
                    AND zakonchit_glavniy_kniga.month = $3
                    AND zakonchit_glavniy_kniga.budjet_id = $4
                    AND zakonchit_glavniy_kniga.isdeleted = false
            )
            RETURNING *
        `;
        const result = await db.query(query, params);
        return result;
    }
}