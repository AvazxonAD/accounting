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
                            d_ch.document_yaratilgan_vaqt
                        FROM zakonchit_haqiqiy_harajat AS d_ch
                        JOIN users AS u ON u.id = d_ch.user_id
                        JOIN regions AS r_ch ON r_ch.id = u.region_id
                        WHERE r_ch.id = r.id 
                            AND d_ch.budjet_id = b.id
                            AND d_ch.isdeleted = false 
                            AND d_ch.month = d.month
                            AND d_ch.year = d.year
                        ORDER BY d_ch.document_yaratilgan_vaqt DESC
                        LIMIT 1
                    ) AS document_yaratilgan_vaqt,
                    (
                        SELECT 
                            d_ch.document_qabul_qilingan_vaqt
                        FROM zakonchit_haqiqiy_harajat AS d_ch
                        JOIN users AS u ON u.id = d_ch.user_id
                        JOIN regions AS r_ch ON r_ch.id = u.region_id
                        WHERE r_ch.id = r.id 
                            AND d_ch.budjet_id = b.id
                            AND d_ch.isdeleted = false 
                            AND d_ch.month = d.month
                            AND d_ch.year = d.year
                        ORDER BY d_ch.document_qabul_qilingan_vaqt DESC
                        LIMIT 1
                    ) AS document_qabul_qilingan_vaqt
            FROM zakonchit_haqiqiy_harajat AS d
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
                        FROM zakonchit_haqiqiy_harajat AS d
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
                        FROM zakonchit_haqiqiy_harajat AS d
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
            FROM zakonchit_haqiqiy_harajat AS d
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
            FROM zakonchit_haqiqiy_harajat d
            JOIN users AS u ON u.id = d.user_id
            JOIN regions AS r ON r.id = u.region_id
            JOIN spravochnik_budjet_name AS b ON b.id = d.budjet_id
            WHERE r.id = $1 
                AND d.year = $2 
                AND d.month = $3 
                AND d.budjet_id = $4
                AND d.smeta_grafik_id = $5
                AND d.type_document = $6
                AND d.isdeleted = false
        `;
        const result = await db.query(query, params);
        return result[0];
    }

    static async updateReport(params) {
        const query = `--sql
            UPDATE zakonchit_haqiqiy_harajat 
            SET  
                user_id_qabul_qilgan = $5,
                document_qabul_qilingan_vaqt = $6,
                status = $7
            WHERE EXISTS (
                SELECT 1
                FROM users AS u
                JOIN regions AS r ON r.id = u.region_id
                WHERE u.id = zakonchit_haqiqiy_harajat.user_id
                    AND r.id = $1
                    AND zakonchit_haqiqiy_harajat.year = $2
                    AND zakonchit_haqiqiy_harajat.month = $3
                    AND zakonchit_haqiqiy_harajat.budjet_id = $4
                    AND zakonchit_haqiqiy_harajat.isdeleted = false
            )
            RETURNING *
        `;
        const result = await db.query(query, params);
        return result;
    }
}