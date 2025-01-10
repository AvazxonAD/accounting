const { db } = require('../../db/index')

exports.SaldoDB = class {
    static async getSena(params) {
        const query = `--sql
            SELECT 
                (d_ch.summa_s_nds / d_ch.kol)::FLOAT AS sena
            FROM document_prixod_jur7_child d_ch
            JOIN document_prixod_jur7 d ON d_ch.document_prixod_jur7_id = d.id
            WHERE d_ch.naimenovanie_tovarov_jur7_id = $1
            ORDER BY d_ch.id DESC 
            LIMIT 1
        `;
        const result = await db.query(query, params);
        return result[0]?.sena;
    }

    static async getKol(params) {
        const query = `--sql
            WITH prixod AS (
                SELECT
                    COALESCE(SUM(d_ch.kol), 0) AS kol
                FROM document_prixod_jur7 AS d
                JOIN document_prixod_jur7_child AS d_ch ON d.id = d_ch.document_prixod_jur7_id
                WHERE d_ch.naimenovanie_tovarov_jur7_id = $1
                    AND d.kimga_id = $2
                    AND d.isdeleted = false
                    AND d.doc_date < $3
            ),
            prixod_internal AS (
                SELECT
                    COALESCE(SUM(d_ch.kol), 0) AS kol
                FROM document_vnutr_peremesh_jur7 AS d
                JOIN document_vnutr_peremesh_jur7_child AS d_ch ON d.id = d_ch.document_vnutr_peremesh_jur7_id
                WHERE d_ch.naimenovanie_tovarov_jur7_id = $1
                    AND d.kimga_id = $2
                    AND d.isdeleted = false
                    AND d.doc_date < $3
            ),
            rasxod AS (
                SELECT
                    COALESCE(SUM(d_ch.kol), 0) AS kol
                FROM document_rasxod_jur7 AS d
                JOIN document_rasxod_jur7_child AS d_ch ON d.id = d_ch.document_rasxod_jur7_id
                WHERE d_ch.naimenovanie_tovarov_jur7_id = $1
                    AND d.kimdan_id = $2
                    AND d.isdeleted = false
                    AND d.doc_date < $3
            ),
            rasxod_internal AS (
                SELECT
                    COALESCE(SUM(d_ch.kol), 0) AS kol
                FROM document_vnutr_peremesh_jur7 AS d
                JOIN document_vnutr_peremesh_jur7_child AS d_ch ON d.id = d_ch.document_vnutr_peremesh_jur7_id
                WHERE d_ch.naimenovanie_tovarov_jur7_id = $1
                    AND d.kimdan_id = $2
                    AND d.isdeleted = false
                    AND d.doc_date < $3
            )
            SELECT
                ( (prixod.kol + prixod_internal.kol) - (rasxod.kol + rasxod_internal.kol) )::FLOAT AS kol
            FROM prixod
            JOIN prixod_internal ON true 
            JOIN rasxod ON true
            JOIN rasxod_internal ON true
        `;
        const result = await db.query(query, params);
        return result[0]?.kol;
    }

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

    static async getSaldo(params) {
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
                n.edin
            FROM saldo_naimenovanie_jur7 AS d
            JOIN users AS u ON u.id = d.user_id
            JOIN regions AS r ON r.id = u.region_id
            JOIN naimenovanie_tovarov_jur7 AS n ON n.id = d.naimenovanie_tovarov_jur7_id
            WHERE r.id = $1 
                AND d.isdeleted = false 
                AND d.kimning_buynida = $2
                AND d.year = $3
                AND d.month = $4
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

    static async getKolInternal(params) {
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
            ),
            date_prixod AS (
                SELECT 
                    TO_CHAR(d.doc_date, 'YYYY-MM-DD') AS prixod_doc_date
                FROM document_prixod_jur7 AS d
                JOIN document_prixod_jur7_child AS d_ch ON d.id = d_ch.document_prixod_jur7_id
                WHERE d_ch.naimenovanie_tovarov_jur7_id = $1 
            )
            SELECT
                JSON_BUILD_OBJECT(
                    'kol', (prixod.kol + prixod_internal.kol)
                ) AS prixod,
                JSON_BUILD_OBJECT(
                    'kol', (rasxod.kol + rasxod_internal.kol)
                ) AS rasxod,
                date_prixod.prixod_doc_date
            FROM prixod, prixod_internal, rasxod, rasxod_internal, date_prixod
        `;
        const result = await db.query(query, params);
        return result[0];
    }
}