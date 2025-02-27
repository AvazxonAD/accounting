const { IznosDB } = require('./db');

exports.IznosService = class {
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
        const result = await IznosDB.get([data.region_id, data.offset, data.limit], data.responsible_id, data.product_id, data.year, data.month, data.search, data.internal);

        return { total_count: result.total_count, data: result.data };
    }

    static async getByProductId(data) {
        const result = await IznosDB.getByProductId([data.product_id], { year: data.year, month: data.month });

        return result;
    }
}