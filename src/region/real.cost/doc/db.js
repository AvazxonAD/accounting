const { db } = require('@db/index')
const { returnParamsValues } = require('@helper/functions')

exports.DocRealCost = class {
    static async createDoc(params, client) {
        const query = `--sql
            INSERT INTO documents_haqiqiy_harajat (
                user_id,
                budjet_id,
                main_schet_id,
                smeta_grafik_id,
                type_document,
                month,
                year,
                debet_sum,
                kredit_sum,
                created_at,
                updated_at
            ) 
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *
        `;
        const result = await client.query(query, params)
        return result.rows[0];
    }

    static async getByIdDoc(params) {
        const query = `--sql
            SELECT 
                d.type_document,
                d.month,
                d.year,
                (
                    SELECT JSON_AGG(row_to_json(child))
                    FROM (
                        SELECT 
                        smeta_grafik_id,
                        debet_sum,
                        kredit_sum 
                        FROM documents_haqiqiy_harajat d
                        JOIN users AS u ON u.id = d.user_id
                        JOIN regions AS r ON r.id = u.region_id
                        JOIN spravochnik_budjet_name AS b ON b.id = d.budjet_id
                        WHERE r.id = $1 
                            AND d.year = $2 
                            AND d.month = $3 
                            AND d.type_document = $4
                            AND d.budjet_id = $5
                            AND d.isdeleted = false
                    ) AS child
                ) AS childs
            FROM documents_haqiqiy_harajat d
            JOIN users AS u ON u.id = d.user_id
            JOIN regions AS r ON r.id = u.region_id
            JOIN spravochnik_budjet_name AS b ON b.id = d.budjet_id
            WHERE r.id = $1 
                AND d.year = $2 
                AND d.month = $3 
                AND d.type_document = $4
                AND d.budjet_id = $5
                AND d.isdeleted = false
        `;
        const result = await db.query(query, params);
        return result[0];
    }

    static async getDoc(params, year, month, type_document) {
        let year_filter = ``;
        let month_filter = ``;
        let type_document_filter = ``;
        if (year) {
            year_filter = `AND d.year = $${params.length + 1}`;
            params.push(year)
        }
        if (month) {
            month_filter = `AND d.month = $${params.length + 1}`;
            params.push(month)
        }
        if (type_document) {
            type_document_filter = `AND d.type_document = $${params.length + 1}`;
            params.push(type_document)
        }
        const query = `--sql
            SELECT 
                d.type_document,
                d.month,
                d.year,
                COALESCE(SUM(d.debet_sum), 0)::FLOAT AS debet_sum,
                COALESCE(SUM(d.kredit_sum), 0)::FLOAT AS kredit_sum
            FROM documents_haqiqiy_harajat d
            JOIN users AS u ON u.id = d.user_id
            JOIN regions AS r ON r.id = u.region_id
            JOIN spravochnik_budjet_name AS b ON b.id = d.budjet_id
            WHERE r.id = $1 
                AND b.id = $2
                AND d.isdeleted = false 
                ${year_filter}
                ${month_filter}
                ${type_document_filter}
            GROUP BY d.type_document, d.month, d.year
        `;
        const result = await db.query(query, params)
        return result;
    }

    static async deleteDoc(params, client) {
        const query = `--sql
            UPDATE documents_haqiqiy_harajat
            SET isdeleted = true
            WHERE EXISTS (
                SELECT 1
                FROM users AS u
                JOIN regions AS r ON r.id = u.region_id
                WHERE u.id = documents_haqiqiy_harajat.user_id
                    AND r.id = $1
                    AND documents_haqiqiy_harajat.year = $2
                    AND documents_haqiqiy_harajat.month = $3
                    AND documents_haqiqiy_harajat.type_document = $4
                    AND documents_haqiqiy_harajat.budjet_id = $5
                    AND documents_haqiqiy_harajat.isdeleted = false
            )
        `;
        const executor = client || db;
        await executor.query(query, params);
    }

    static async getSummaByGrafiks(params, client) {
        const query = `--sql 
            SELECT 
                d.smeta_grafik_id,
                COALESCE(SUM(d.debet_sum), 0) AS debet_sum,
                COALESCE(SUM(d.kredit_sum), 0) AS kredit_sum
            FROM documents_haqiqiy_harajat d
            JOIN users AS u ON u.id = d.user_id
            JOIN regions AS r ON r.id = u.region_id
            JOIN spravochnik_budjet_name AS b ON b.id = d.budjet_id
            WHERE r.id = $1 
                AND d.year = $2 
                AND d.month = $3 
                AND d.type_document != 'end'
                AND d.budjet_id = $4
                AND d.isdeleted = false
            GROUP BY d.smeta_grafik_id
        `;
        const result = await client.query(query, params);
        return result.rows;
    }

    static async getBySummaGrafikWithType(params) {
        const query = `--sql 
            SELECT 
                d.type_document,    
                d.smeta_grafik_id,
                COALESCE(SUM(d.debet_sum), 0)::FLOAT AS debet_sum,
                COALESCE(SUM(d.kredit_sum), 0)::FLOAT AS kredit_sum
            FROM documents_haqiqiy_harajat d
            JOIN users AS u ON u.id = d.user_id
            JOIN regions AS r ON r.id = u.region_id
            JOIN spravochnik_budjet_name AS b ON b.id = d.budjet_id
            WHERE r.id = $1 
                AND d.year = $2 
                AND d.month = $3 
                AND d.budjet_id = $4
                AND d.isdeleted = false
                AND d.smeta_grafik_id = $5
            GROUP BY d.smeta_grafik_id, d.type_document
        `;
        const result = await db.query(query, params);
        return result;
    }

    static async getSummaByGrafikId(params) {
        const query = `--sql
            SELECT 
                d.debet_sum::FLOAT,
                d.kredit_sum::FLOAT
            FROM documents_haqiqiy_harajat d
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
}