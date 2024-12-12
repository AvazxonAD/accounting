const { db } = require('../../db/index');
const { returnParamsValues, designParams} = require('../../helper/functions')

exports.IznosDB = class {
    static async createIznos(params, client) {
        const design_params = [
            "user_id",
            "inventar_num",
            "serial_num",
            "naimenovanie_tovarov_jur7_id",
            "kol",
            "sena",
            "iznos_start_date",
            "created_at",
            "updated_at"
        ];
        const all_values = designParams(params, design_params)
        const _values = returnParamsValues(all_values, 9);
        const query = `--sql
            INSERT INTO iznos_tovar_jur7(
                user_id,
                inventar_num,
                serial_num,
                naimenovanie_tovarov_jur7_id,
                kol,
                sena,
                iznos_start_date,
                created_at,
                updated_at
            )
            VALUES ${_values}
        `;
        const result = await client.query(query, all_values);
        return result.rows; 
    }

    static async getByTovarIdIznos(params) {
        const query = `--sql
            SELECT 
                i.naimenovanie_tovarov_jur7_id,
                i.kol,
                i.sena,
                i.iznos_start_date,
                n.name, 
                n.edin,
                n.inventar_num,
                n.serial_num
            FROM iznos_tovar_jur7 i 
            JOIN naimenovanie_tovarov_jur7 n ON n.id = i.naimenovanie_tovarov_jur7_id
            JOIN users u ON u.id = i.user_id
            JOIN regions r ON r.id = u.region_id
            WHERE r.id = $1 AND i.isdeleted = false AND i.naimenovanie_tovarov_jur7_id = $2
        `;
        const result = await db.query(query, params)
        return result;
    }
}