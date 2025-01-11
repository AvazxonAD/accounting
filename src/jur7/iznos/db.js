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
                created_at,
                updated_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        `;
        await client.query(query, params);
    }

    static async getByTovarIdIznos(params, responsible_id, product_id) {
        let responsible_filter = ``;
        let product_filter = ``;
        if (responsible_id) {
            params.push(responsible_id);
            responsible_filter = `AND i.kimning_buynida = $${params.length}`;
        }
        if (product_id) {
            params.push(product_id);
            product_filter = `AND i.naimenovanie_tovarov_jur7_id = $${params.length}`;
        }
        const query = `--sql
            SELECT 
                i.naimenovanie_tovarov_jur7_id,
                i.kol,
                i.sena,
                i.iznos_start_date,
                n.name, 
                n.edin,
                n.inventar_num,
                n.serial_num,
                i.eski_iznos_summa::FLOAT,
                i.iznos_summa::FLOAT,
                i.kimning_buynida
            FROM iznos_tovar_jur7 i 
            JOIN naimenovanie_tovarov_jur7 n ON n.id = i.naimenovanie_tovarov_jur7_id
            JOIN users u ON u.id = i.user_id
            JOIN regions r ON r.id = u.region_id
            WHERE r.id = $1
                AND i.isdeleted = false
                ${responsible_filter}
                ${product_filter} 
            ORDER BY i.id DESC
        `;
        const result = await db.query(query, params)
        return result;
    }
}