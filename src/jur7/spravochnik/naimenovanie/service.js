const { NaimenovanieDB } = require('./db');
const { tashkentTime } = require('../../../helper/functions')

exports.NaimenovanieService = class {
    static async getByIdNaimenovanie(data) {
        const result = await NaimenovanieDB.getByIdNaimenovanie([data.region_id, data.id]);
        return result;
    }

    static async getNaimenovanie(data) {
        const result = await NaimenovanieDB.getNaimenovanie([data.region_id, data.offset, data.limit]);
        return result;
    }

    static async createNaimenovanie(data) {
        const result = await NaimenovanieDB.createNaimenovanie([
            data.user_id,
            data.spravochnik_budjet_name_id,
            data.name,
            data.edin,
            data.group_jur7_id,
            data.inventar_num,
            data.serial_num,
            tashkentTime(),
            tashkentTime()
        ]);
        return result;
    }
}