const { ResponsibleDB } = require('./db');
const { tashkentTime } = require('../../../helper/functions');

exports.ResponsibleService = class {
    static async getById(data) {
        const result = await ResponsibleDB.getById([data.region_id, data.id], data.isdeleted);
        return result;
    }

    static async getResponsible(data) {
        const result = await ResponsibleDB.getResponsible([data.region_id, data.offset, data.limit]);
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