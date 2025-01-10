const { NaimenovanieDB } = require('./db');

exports.NaimenovanieService = class {
    static async getByIdNaimenovanie(data) {
        const result = await NaimenovanieDB.getByIdNaimenovanie([data.region_id, data.id]);
        return result;
    }

    static async getNaimenovanie(data) {
        const result = await NaimenovanieDB.getNaimenovanie([data.region_id, data.offset, data.limit]);
        return result;
    }
}