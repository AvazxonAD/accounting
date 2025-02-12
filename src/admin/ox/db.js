const { db } = require('@db/index')

exports.ReportOx = class {

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
                    r.name AS region_name
            FROM zakonchit_1_ox_xisobot AS d
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

    static async getReportTime(params) {
        const query = `--sql
            SELECT 
                d.document_yaratilgan_vaqt,
                d.document_qabul_qilingan_vaqt
            FROM zakonchit_1_ox_xisobot AS d
            JOIN users AS u ON u.id = d.user_id
            JOIN regions AS r ON r.id = u.region_id
            WHERE r.id = $1 
                AND d.budjet_id = $2 
                AND d.year = $3
                AND d.month = $4
                AND d.isdeleted = false
            ORDER BY d.id DESC 
            LIMIT 1
        `;
        const result = await db.query(query, params)
        return result[0];
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
                        FROM zakonchit_1_ox_xisobot AS d
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
                        FROM zakonchit_1_ox_xisobot AS d
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
            FROM zakonchit_1_ox_xisobot AS d
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
                ajratilgan_mablag::FLOAT,
                tulangan_mablag_smeta_buyicha::FLOAT,
                kassa_rasxod::FLOAT,
                haqiqatda_harajatlar::FLOAT,
                qoldiq::FLOAT
            FROM zakonchit_1_ox_xisobot d
            JOIN users AS u ON u.id = d.user_id
            JOIN regions AS r ON r.id = u.region_id
            JOIN spravochnik_budjet_name AS b ON b.id = d.budjet_id
            WHERE r.id = $1 
                AND d.year = $2 
                AND d.month = $3 
                AND d.budjet_id = $4
                AND d.smeta_grafik_id = $5
                AND d.isdeleted = false
        `;
        const result = await db.query(query, params);
        return result[0];
    }
  
    static async updateReport(params) {
        const query = `--sql
            UPDATE zakonchit_1_ox_xisobot 
            SET  
                user_id_qabul_qilgan = $5,
                document_qabul_qilingan_vaqt = $6,
                status = $7
            WHERE EXISTS (
                SELECT 1
                FROM users AS u
                JOIN regions AS r ON r.id = u.region_id
                WHERE u.id = zakonchit_1_ox_xisobot.user_id
                    AND r.id = $1
                    AND zakonchit_1_ox_xisobot.year = $2
                    AND zakonchit_1_ox_xisobot.month = $3
                    AND zakonchit_1_ox_xisobot.budjet_id = $4
                    AND zakonchit_1_ox_xisobot.isdeleted = false
            )
            RETURNING *
        `;
        const result = await db.query(query, params);
        return result;
    }

    static async getByYearSumma(params) {
        const query = `--sql
            SELECT 
                COALESCE(SUM(ajratilgan_mablag), 0)::FLOAT AS ajratilgan_mablag,
                COALESCE(SUM(tulangan_mablag_smeta_buyicha), 0)::FLOAT AS tulangan_mablag_smeta_buyicha,
                COALESCE(SUM(kassa_rasxod), 0)::FLOAT AS kassa_rasxod,
                COALESCE(SUM(haqiqatda_harajatlar), 0)::FLOAT AS haqiqatda_harajatlar,
                COALESCE(SUM(qoldiq), 0)::FLOAT AS qoldiq
            FROM documents_1_ox_xisobot d
            JOIN users AS u ON u.id = d.user_id
            JOIN regions AS r ON r.id = u.region_id
            JOIN spravochnik_budjet_name AS b ON b.id = d.budjet_id
            WHERE r.id = $1 
                AND d.year = $2 
                AND d.month <= $3
                AND d.budjet_id = $4
                AND d.smeta_grafik_id = $5
                AND d.isdeleted = false
        `;
        const result = await db.query(query, params);
        return result[0];
    }
}