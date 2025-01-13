const { IznosDB } = require('./db');

exports.IznosService = class {
    static async getByIdIznos(data) {
        const iznos = await IznosDB.getByIdIznos([data.id], data.isdeleted);
        return iznos;
    }

    static async updateIznos(data) {
        const result = await IznosDB.updateIznos([data.iznos_start_date, data.eski_iznos_summa, data.id]);
        return result[0];
    }
}