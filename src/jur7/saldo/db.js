const { db } = require('../../db/index')

exports.SaldoDB = class {
    static async createSaldo(params, client) {
        const query = `--sql
            INSERT INTO saldo_naimenovanie_jur7 (
                user_id,
                naimenovanie_tovarov_jur7_id,
                kol,
                sena,
                summa,
                month,
                year,
                date_saldo,
                kimning_buynida,
                created_at,
                updated_at
            )
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *
        `;
        const result = await client.query(query, params)
        return result.rows[0];
    }

    static async getSaldo(params, product_id) {
        let product_filter = ``;
        if (product_id) {
            params.push(product_id);
            product_filter = `AND n.id = $${params.length}`;
        }
        const query = `--sql
            SELECT
                d.id::INTEGER, 
                d.user_id,
                d.naimenovanie_tovarov_jur7_id::INTEGER,
                d.sena::FLOAT,
                JSON_BUILD_OBJECT(
                    'kol', d.kol::FLOAT,
                    'summa', d.summa::FLOAT
                ) AS from,
                d.month,
                d.year,
                d.date_saldo,
                d.kimning_buynida,
                n.name AS naimenovanie_tovarov,
                n.edin,
                g.id AS group_jur7_id, 
                g.name AS group_name
            FROM saldo_naimenovanie_jur7 AS d
            JOIN users AS u ON u.id = d.user_id
            JOIN regions AS r ON r.id = u.region_id
            JOIN naimenovanie_tovarov_jur7 AS n ON n.id = d.naimenovanie_tovarov_jur7_id
            JOIN group_jur7 AS g ON g.id = n.group_jur7_id
            WHERE r.id = $1 
                AND d.isdeleted = false 
                AND d.kimning_buynida = $2
                AND d.year = $3
                AND d.month = $4
                ${product_filter}
        `;
        const result = await db.query(query, params)
        return result;
    }

    static async deleteSaldo(params, client) {
        const query = `--sql
            UPDATE saldo_naimenovanie_jur7 
            SET isdeleted = true 
            WHERE EXISTS (
                SELECT 1
                FROM users AS u
                JOIN regions AS r ON r.id = u.region_id
                WHERE u.id = saldo_naimenovanie_jur7.user_id
                    AND r.id = $1
                    AND saldo_naimenovanie_jur7.month = $2
                    AND saldo_naimenovanie_jur7.year = $3
                    AND saldo_naimenovanie_jur7.isdeleted = false
            )
        `;
        const executor = client || db;
        await executor.query(query, params);
    }

    static async getInfo(params, operator, product_id = null) {
        let product_filter = ``;
        if (product_id) {
            params.push(product_id)
            product_filter = `AND n.id = $${params.length}`;
        }
        const query = `--sql
            SELECT 
                n.id::INTEGER AS naimenovanie_tovarov_jur7_id,
                n.name, 
                n.edin,
                n.group_jur7_id,
                n.inventar_num,
                n.serial_num,
                g.name AS group_jur7_name,
                n.spravochnik_budjet_name_id,
                b.name AS spravochnik_budjet_name,
                TO_CHAR(d.doc_date, 'YYYY-MM-DD') AS doc_date,
                EXTRACT(MONTH FROM d.doc_date) AS month,
                (d_ch.summa_s_nds / d_ch.kol)::FLOAT AS sena,
                (
                    SELECT COALESCE(SUM(d_ch.kol), 0)
                    FROM document_prixod_jur7 AS d
                    JOIN document_prixod_jur7_child AS d_ch ON d.id = d_ch.document_prixod_jur7_id
                    WHERE d_ch.naimenovanie_tovarov_jur7_id = n.id 
                        AND d.kimga_id = $2 
                        AND d.isdeleted = false
                        AND d.doc_date ${operator} $3
                )::FLOAT AS prixod,
                (
                    SELECT COALESCE(SUM(d_ch.kol), 0)
                    FROM document_vnutr_peremesh_jur7 AS d
                    JOIN document_vnutr_peremesh_jur7_child AS d_ch ON d.id = d_ch.document_vnutr_peremesh_jur7_id
                    WHERE d_ch.naimenovanie_tovarov_jur7_id = n.id 
                        AND d.kimga_id = $2 
                        AND d.isdeleted = false
                        AND d.doc_date ${operator} $3
                )::FLOAT AS prixod_internal,
                (
                    SELECT COALESCE(SUM(d_ch.kol), 0)
                    FROM document_rasxod_jur7 AS d
                    JOIN document_rasxod_jur7_child AS d_ch ON d.id = d_ch.document_rasxod_jur7_id
                    WHERE d_ch.naimenovanie_tovarov_jur7_id = n.id 
                        AND d.kimdan_id = $2 
                        AND d.isdeleted = false
                        AND d.doc_date ${operator} $3
                )::FLOAT AS rasxod,
                (
                    SELECT COALESCE(SUM(d_ch.kol), 0)
                    FROM document_vnutr_peremesh_jur7 AS d
                    JOIN document_vnutr_peremesh_jur7_child AS d_ch ON d.id = d_ch.document_vnutr_peremesh_jur7_id
                    WHERE d_ch.naimenovanie_tovarov_jur7_id = n.id 
                        AND d.kimdan_id = $2
                        AND d.isdeleted = false
                        AND d.doc_date ${operator} $3
                )::FLOAT AS rasxod_internal
            FROM naimenovanie_tovarov_jur7 AS n
            JOIN document_prixod_jur7_child AS d_ch ON d_ch.naimenovanie_tovarov_jur7_id = n.id
            JOIN document_prixod_jur7 AS d ON d_ch.document_prixod_jur7_id = d.id
            JOIN users AS u ON u.id = n.user_id
            JOIN regions AS r ON r.id = u.region_id
            JOIN group_jur7 AS g ON g.id = n.group_jur7_id
            JOIN spravochnik_budjet_name AS b ON b.id = n.spravochnik_budjet_name_id
            WHERE n.isdeleted = false 
                AND r.id = $1
                ${product_filter}
        `;
        const result = await db.query(query, params);
        return result;
    }

    static async getSumma(params, product_id) {
        const query = `--sql
            WITH prixod AS (
                SELECT 
                    COALESCE(SUM(d_ch.kol), 0) AS kol
                FROM document_prixod_jur7 AS d
                JOIN document_prixod_jur7_child AS d_ch ON d.id = d_ch.document_prixod_jur7_id
                WHERE d_ch.naimenovanie_tovarov_jur7_id = $1 
                    AND d.kimga_id = $2 
                    AND d.isdeleted = false
                    AND d.doc_date BETWEEN $3 AND $4
            ),
            prixod_internal AS (
                SELECT  
                    COALESCE(SUM(d_ch.kol), 0) AS kol
                FROM document_vnutr_peremesh_jur7 AS d
                JOIN document_vnutr_peremesh_jur7_child AS d_ch ON d.id = d_ch.document_vnutr_peremesh_jur7_id
                WHERE d_ch.naimenovanie_tovarov_jur7_id = $1 
                    AND d.kimga_id = $2 
                    AND d.isdeleted = false
                    AND d.doc_date BETWEEN $3 AND $4
            ),
            rasxod AS (
                SELECT  
                    COALESCE(SUM(d_ch.kol), 0) AS kol
                FROM document_rasxod_jur7 AS d
                JOIN document_rasxod_jur7_child AS d_ch ON d.id = d_ch.document_rasxod_jur7_id
                WHERE d_ch.naimenovanie_tovarov_jur7_id = $1 
                    AND d.kimdan_id = $2 
                    AND d.isdeleted = false
                    AND d.doc_date BETWEEN $3 AND $4
            ),
            rasxod_internal AS (
                SELECT  
                    COALESCE(SUM(d_ch.kol), 0) AS kol
                FROM document_vnutr_peremesh_jur7 AS d
                JOIN document_vnutr_peremesh_jur7_child AS d_ch ON d.id = d_ch.document_vnutr_peremesh_jur7_id
                WHERE d_ch.naimenovanie_tovarov_jur7_id = $1 
                    AND d.kimdan_id = $2
                    AND d.isdeleted = false
                    AND d.doc_date BETWEEN $3 AND $4
            )
            SELECT
                JSON_BUILD_OBJECT(
                    'kol', (prixod.kol + prixod_internal.kol)
                ) AS prixod,
                JSON_BUILD_OBJECT(
                    'kol', (rasxod.kol + rasxod_internal.kol)
                ) AS rasxod
            FROM prixod, prixod_internal, rasxod, rasxod_internal 
        `;
        const result = await db.query(query, params);
        return result[0];
    }
}