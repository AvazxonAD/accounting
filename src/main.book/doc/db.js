const { db } = require('../../db/index');
const { HelperFunctions } = require('../../helper/functions');

exports.DocMainBookDB = class {
    static async autoSumma(params, type_document, main_schet_id, budjet_id) {
        const filters = [];

        if (main_schet_id) {
            params.push(main_schet_id);
            filters.push(`m.id = $${params.length}`);
        }

        if (budjet_id) {
            params.push(budjet_id);
            filters.push(`b.id = $${params.length}`);
        }

        const metaWhere = HelperFunctions.filters(filters);

        const jur2 = `
            WITH prixod AS (
                SELECT 
                    COALESCE(SUM(ch.summa), 0)::FLOAT AS summa 
                FROM bank_prixod d
                JOIN users AS u ON u.id = d.user_id
                JOIN regions AS r ON r.id = u.region_id
                JOIN bank_prixod_child AS ch ON d.id = ch.id_bank_prixod 
                JOIN spravochnik_operatsii AS op ON op.id = ch.spravochnik_operatsii_id
                WHERE r.id = $1 
                    AND d.doc_date < $2
                    AND d.isdeleted = false
                    AND op.schet = $3
                    AND ch.isdeleted = false
                    AND d.isdeleted = false
                    ${metaWhere}
            ), 
            rasxod AS (
                SELECT 
                    COALESCE(SUM(ch.summa), 0)::FLOAT AS summa 
                FROM bank_rasxod d
                JOIN users AS u ON u.id = d.user_id
                JOIN regions AS r ON r.id = u.region_id
                JOIN bank_rasxod_child AS ch ON d.id = ch.id_bank_rasxod 
                JOIN spravochnik_operatsii AS op ON op.id = ch.spravochnik_operatsii_id
                WHERE r.id = $1 
                    AND d.doc_date < $2
                    AND d.isdeleted = false
                    AND op.schet = $3
                    AND ch.isdeleted = false
                    AND d.isdeleted = false
                    ${metaWhere}
            )
            SELECT 
                rasxod.summa AS rasxod_sum,
                prixod.summa AS prixod_sum
            FROM rasxod
            CROSS JOIN prixod;
        `;

        const jur1 = `
            WITH prixod AS (
                SELECT 
                    COALESCE(SUM(ch.summa), 0)::FLOAT AS summa 
                FROM kassa_prixod d
                JOIN users AS u ON u.id = d.user_id
                JOIN regions AS r ON r.id = u.region_id
                JOIN kassa_prixod_child AS ch ON d.id = ch.kassa_prixod_id 
                JOIN spravochnik_operatsii AS op ON op.id = ch.spravochnik_operatsii_id
                WHERE r.id = $1 
                    AND d.doc_date < $2
                    AND d.isdeleted = false
                    AND op.schet = $3
                    AND ch.isdeleted = false
                    AND d.isdeleted = false
                    ${metaWhere}
            ), 
            rasxod AS (
                SELECT 
                    COALESCE(SUM(ch.summa), 0)::FLOAT AS summa 
                FROM kassa_rasxod d
                JOIN users AS u ON u.id = d.user_id
                JOIN regions AS r ON r.id = u.region_id
                JOIN kassa_rasxod_child AS ch ON d.id = ch.kassa_rasxod_id 
                JOIN spravochnik_operatsii AS op ON op.id = ch.spravochnik_operatsii_id
                WHERE r.id = $1 
                    AND d.doc_date < $2
                    AND d.isdeleted = false
                    AND op.schet = $3
                    AND ch.isdeleted = false
                    AND d.isdeleted = false
                    ${metaWhere}
            )
            SELECT 
                rasxod.summa AS rasxod_sum,
                prixod.summa AS prixod_sum
            FROM rasxod
            CROSS JOIN prixod;
        `;

        const queries = { jur1, jur2 };

        const result = await db.query(queries[type_document], params);

        return result[0];
    }

    static async createDoc(params, client) {
        const query = `--sql
            INSERT INTO documents_glavniy_kniga (
                user_id,
                budjet_id,
                main_schet_id,
                spravochnik_main_book_schet_id,
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
                    SELECT ARRAY_AGG(row_to_json(child))
                    FROM (
                        SELECT 
                        spravochnik_main_book_schet_id,
                        debet_sum,
                        kredit_sum 
                        FROM documents_glavniy_kniga d
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
            FROM documents_glavniy_kniga d
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
            FROM documents_glavniy_kniga d
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
            UPDATE documents_glavniy_kniga
            SET isdeleted = true
            WHERE EXISTS (
                SELECT 1
                FROM users AS u
                JOIN regions AS r ON r.id = u.region_id
                WHERE u.id = documents_glavniy_kniga.user_id
                    AND r.id = $1
                    AND documents_glavniy_kniga.year = $2
                    AND documents_glavniy_kniga.month = $3
                    AND documents_glavniy_kniga.type_document = $4
                    AND documents_glavniy_kniga.budjet_id = $5
                    AND documents_glavniy_kniga.isdeleted = false
            )
        `;
        const executor = client || db;
        await executor.query(query, params);
    }

    static async getSummaBySchets(params, client) {
        const query = `--sql 
            SELECT 
                d.spravochnik_main_book_schet_id,
                COALESCE(SUM(d.debet_sum), 0) AS debet_sum,
                COALESCE(SUM(d.kredit_sum), 0) AS kredit_sum
            FROM documents_glavniy_kniga d
            JOIN users AS u ON u.id = d.user_id
            JOIN regions AS r ON r.id = u.region_id
            JOIN spravochnik_budjet_name AS b ON b.id = d.budjet_id
            WHERE r.id = $1 
                AND d.year = $2 
                AND d.month = $3 
                AND d.type_document != 'end'
                AND d.budjet_id = $4
                AND d.isdeleted = false
            GROUP BY d.spravochnik_main_book_schet_id
        `;
        const result = await client.query(query, params);
        return result.rows;
    }

    static async getBySchetSummaWithType(params) {
        const query = `--sql 
            SELECT 
                d.type_document,    
                d.spravochnik_main_book_schet_id,
                COALESCE(SUM(d.debet_sum), 0)::FLOAT AS debet_sum,
                COALESCE(SUM(d.kredit_sum), 0)::FLOAT AS kredit_sum
            FROM documents_glavniy_kniga d
            JOIN users AS u ON u.id = d.user_id
            JOIN regions AS r ON r.id = u.region_id
            JOIN spravochnik_budjet_name AS b ON b.id = d.budjet_id
            WHERE r.id = $1 
                AND d.year = $2 
                AND d.month = $3 
                AND d.budjet_id = $4
                AND d.isdeleted = false
                AND d.spravochnik_main_book_schet_id = $5
            GROUP BY d.spravochnik_main_book_schet_id, d.type_document
        `;
        const result = await db.query(query, params);
        return result;
    }

    static async getSchetSummaBySchetId(params) {
        const query = `--sql
            SELECT 
                d.debet_sum::FLOAT,
                d.kredit_sum::FLOAT
            FROM documents_glavniy_kniga d
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
}