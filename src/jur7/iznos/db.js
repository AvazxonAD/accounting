const { db } = require('../../db/index');

exports.IznosDB = class {
    static async createIznos(params, client) {
        const query = `--sql
            INSERT INTO iznos_tovar_jur7(
                user_id,
                inventar_num,
                serial_num,
                naimenovanie_tovarov_jur7_id,
                kol,
                sena,
                iznos_start_date,
                kimning_buynida,
                iznos_summa,
                year, 
                month,
                full_date,
                budjet_id,
                created_at,
                updated_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        `;
        await client.query(query, params);
    }

    static async getIznos(params, responsible_id, product_id, year, month, search) {
        const filters = [];
        if (responsible_id) {
            params.push(responsible_id);
            filters.push(`i.kimning_buynida = $${params.length}`);
        }
        if (product_id) {
            params.push(product_id);
            filters.push(`i.naimenovanie_tovarov_jur7_id = $${params.length}`);
        }
        if (year) {
            params.push(year);
            filters.push(`i.year = $${params.length}`);
        }
        if (month) {
            params.push(month);
            filters.push(`i.month = $${params.length}`);
        }
        if (search) {
            params.push(search);
            filters.push(`(
                n.name ILIKE '%' || $${params.length} || '%'
                OR s.fio ILIKE '%' || $${params.length} || '%'
            )`);
        }

        const whereClause = filters.length ? `AND ${filters.join(' AND ')}` : '';

        const query = `--sql
            WITH data AS (
                SELECT
                    i.id, i.naimenovanie_tovarov_jur7_id, i.kol, i.sena,
                    i.iznos_start_date, n.name, n.edin, n.inventar_num,
                    n.serial_num, i.eski_iznos_summa::FLOAT, i.iznos_summa::FLOAT,
                    i.kimning_buynida, i.month, i.year, s.fio, i.full_date
                FROM iznos_tovar_jur7 i
                JOIN naimenovanie_tovarov_jur7 n ON n.id = i.naimenovanie_tovarov_jur7_id
                JOIN spravochnik_javobgar_shaxs_jur7 s ON s.id = i.kimning_buynida
                JOIN users u ON u.id = i.user_id
                JOIN regions r ON r.id = u.region_id
                WHERE r.id = $1 AND i.isdeleted = false
                ${whereClause}
                ORDER BY i.id DESC
                OFFSET $2 LIMIT $3
            )
            SELECT 
                ARRAY_AGG(ROW_TO_JSON(data)) AS data,
                (
                    SELECT
                        COALESCE(COUNT(i.id), 0)::INTEGER AS count
                    FROM iznos_tovar_jur7 i
                    JOIN naimenovanie_tovarov_jur7 n ON n.id = i.naimenovanie_tovarov_jur7_id
                    JOIN spravochnik_javobgar_shaxs_jur7 s ON s.id = i.kimning_buynida
                    JOIN users u ON u.id = i.user_id
                    JOIN regions r ON r.id = u.region_id
                    WHERE r.id = $1 AND i.isdeleted = false ${whereClause}
                )
            FROM data
        `;
        const result = await db.query(query, params);
        return result[0];
    }


    static async deleteIznos(params, client) {
        const query = `--sql
            UPDATE iznos_tovar_jur7 
            SET isdeleted = true 
            WHERE kimning_buynida = $1 AND naimenovanie_tovarov_jur7_id = $2 AND year = $3 AND month = $4
        `;
        const result = await client.query(query, params);
        return result;
    }

    static async getByIdIznos(params, isdeleted) {
        const query = `
            SELECT * 
            FROM iznos_tovar_jur7
            WHERE id = $1 AND isdeleted = false
        `;
        const result = await db.query(query, params);
        return result[0];
    }

    static async updateIznos(params) {
        const query = `
            UPDATE iznos_tovar_jur7 SET iznos_start_date = $1, eski_iznos_summa = $2
            WHERE id = $3 AND isdeleted = false RETURNING id
        `;
        const result = await db.query(query, params);
        return result[0];
    }
}
