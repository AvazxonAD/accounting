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

    static async getSaldo(params, kimning_buynida, year, month) {
        let year_filter = ``;
        let month_filter = ``;
        let filter = ``;
        if (year) {
            params.push(year)
            year_filter = `AND d.year = $${params.length}`;
        }
        if (month) {
            params.push(month)
            month_filter = `AND d.month = $${params.length}`;
        }
        if (kimning_buynida) {
            params.push(kimning_buynida);
            filter = `AND d.kimning_buynida = $${params.length}`;
        }
        const query = `--sql
            SELECT
                d.id::INTEGER, 
                d.user_id,
                d.naimenovanie_tovarov_jur7_id::INTEGER,
                d.kol::FLOAT,
                d.sena::FLOAT,
                d.summa::FLOAT,
                d.month,
                d.year,
                d.date_saldo,
                d.kimning_buynida,
                n.name AS naimenovanie_tovarov,
                n.edin,
                g.name AS group_name 
            FROM saldo_naimenovanie_jur7 AS d
            JOIN users AS u ON u.id = d.user_id
            JOIN regions AS r ON r.id = u.region_id
            JOIN naimenovanie_tovarov_jur7 AS n ON n.id = d.naimenovanie_tovarov_jur7_id 
            JOIN group_jur7 AS g ON g.id = n.group_jur7_id
            WHERE r.id = $1 
                AND d.isdeleted = false 
                ${filter}
                ${year_filter} 
                ${month_filter}
        `;
        const result = await db.query(query, params)
        return result;
    }

    static async getByIdSaldo(params) {
        const query = `--sql
            SELECT 
                s.naimenovanie_tovarov_jur7_id::INTEGER,
                n.name, 
                n.edin,
                n.group_jur7_id,
                n.inventar_num,
                n.serial_num,
                g.name AS group_jur7_name,
                n.spravochnik_budjet_name_id,
                b.name AS spravochnik_budjet_name,
                TO_CHAR(s.date_saldo, 'YYYY-MM-DD') AS date_saldo,
                s.year,
                s.month,
                s.kol::FLOAT AS kol,
                s.sena::FLOAT AS sena,
                s.summa::FLOAT AS summa
            FROM saldo_naimenovanie_jur7 AS s
            JOIN naimenovanie_tovarov_jur7 AS n ON n.id = s.naimenovanie_tovarov_jur7_id
            JOIN users AS u ON u.id = n.user_id
            JOIN regions AS r ON r.id = u.region_id
            JOIN group_jur7 AS g ON g.id = n.group_jur7_id
            JOIN spravochnik_budjet_name AS b ON b.id = n.spravochnik_budjet_name_id
            WHERE s.isdeleted = false 
                AND r.id = $1
                AND s.kimning_buynida = $2
                AND s.year = $3
                AND s.month = $4
        `;
        const result = await db.query(query, params);
        return result;
    }

    static async getSchetSummaBySchetId(params) {
        const query = `--sql
            SELECT 
                d.debet_sum::FLOAT,
                d.kredit_sum::FLOAT
            FROM saldo_naimenovanie_jur7 d
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
                    AND saldo_naimenovanie_jur7.year = $2
                    AND saldo_naimenovanie_jur7.month = $3
                    AND saldo_naimenovanie_jur7.budjet_id = $4
                    AND saldo_naimenovanie_jur7.isdeleted = false
            )
        `;
        const executor = client || db;
        await executor.query(query, params);
    }

    static async getInfo(params) {
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
                        AND EXTRACT(YEAR FROM d.doc_date) = $3
                        AND EXTRACT(MONTH FROM d.doc_date) < $4
                )::FLOAT AS prixod,
                (
                    SELECT COALESCE(SUM(d_ch.kol), 0)
                    FROM document_vnutr_peremesh_jur7 AS d
                    JOIN document_vnutr_peremesh_jur7_child AS d_ch ON d.id = d_ch.document_vnutr_peremesh_jur7_id
                    WHERE d_ch.naimenovanie_tovarov_jur7_id = n.id 
                        AND d.kimga_id = $2 
                        AND d.isdeleted = false
                        AND EXTRACT(YEAR FROM d.doc_date) = $3
                        AND EXTRACT(MONTH FROM d.doc_date) < $4
                )::FLOAT AS prixod_internal,
                (
                    SELECT COALESCE(SUM(d_ch.kol), 0)
                    FROM document_rasxod_jur7 AS d
                    JOIN document_rasxod_jur7_child AS d_ch ON d.id = d_ch.document_rasxod_jur7_id
                    WHERE d_ch.naimenovanie_tovarov_jur7_id = n.id 
                        AND d.kimdan_id = $2 
                        AND d.isdeleted = false
                        AND EXTRACT(YEAR FROM d.doc_date) = $3
                        AND EXTRACT(MONTH FROM d.doc_date) < $4
                )::FLOAT AS rasxod,
                (
                    SELECT COALESCE(SUM(d_ch.kol), 0)
                    FROM document_vnutr_peremesh_jur7 AS d
                    JOIN document_vnutr_peremesh_jur7_child AS d_ch ON d.id = d_ch.document_vnutr_peremesh_jur7_id
                    WHERE d_ch.naimenovanie_tovarov_jur7_id = n.id 
                        AND d.kimdan_id = $2
                        AND d.isdeleted = false
                        AND EXTRACT(YEAR FROM d.doc_date) = $3
                        AND EXTRACT(MONTH FROM d.doc_date) < $4
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
        `;
        const result = await db.query(query, params);
        return result;
    }
}