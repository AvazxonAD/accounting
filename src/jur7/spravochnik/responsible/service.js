const { ResponsibleDB } = require('./db');
const { tashkentTime } = require('../../../helper/functions');

exports.ResponsibleService = class {
    static async getByIdResponsible(data) {
        const result = await ResponsibleDB.getByIdResponsible([data.region_id, data.id], data.isdeleted);
        return result;
    }

    static async getResponsible(data) {
        const result = await ResponsibleDB.getResponsible([data.region_id, 0, 9999]);
        return result;
    }

    static async createResponsible(data) {
        const result = await ResponsibleDB.createResponsible([
            data.poraz_id,
            data.fio,
            data.user_id,
            tashkentTime(),
            tashkentTime()
        ]);

        return result;
    }
}