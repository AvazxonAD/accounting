const { IznosDB } = require('./db');
const { db } = require('../../../db/index');
const { tashkentTime } = require('../../../helper/functions');

exports.IznosService = class {
    static async create(data) {
        await db.transaction(async client => {
            for (let product of data.products) {
                await IznosDB.createIznos([
                    data.user_id,
                    product.inventar_num,
                    product.serial_num,
                    product.id,
                    product.iznos_data.kol,
                    product.iznos_data.sena,
                    `${data.year}-${data.month}-01`,
                    product.iznos_data.responsible_id,
                    product.iznos_data.new_summa,
                    data.year,
                    data.month,
                    `${data.year}-${data.month}-01`,
                    data.budjet_id,
                    product.iznos_data.eski_iznos_summa + product.iznos_data.summa,
                    tashkentTime(),
                    tashkentTime()
                ], client);
            }
        })
    }

    static async getIznosDate(data) {
        const result = await IznosDB.getIznosDate([data.region_id]);

        return result;
    }

    static async getByIdIznos(data) {
        const iznos = await IznosDB.getByIdIznos([data.id]);
        return iznos;
    }

    static async updateIznos(data) {
        const result = await IznosDB.updateIznos([data.iznos_start_date, data.eski_iznos_summa, data.id]);
        return result;
    }

    static async get(data) {
        const result = await IznosDB.get([data.region_id, data.offset, data.limit], data.responsible_id, data.product_id, data.year, data.month, data.search);

        return { total_count: result.total_count, data: result.data };
    }

    static async getByProductId(data) {
        const result = await IznosDB.getByProductId([data.product_id], { year: data.year, month: data.month });

        return result;
    }
}