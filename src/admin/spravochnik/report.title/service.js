const { ReportTitleDB } = require('./db');
const { HelperFunctions } = require('@helper/functions');

exports.ReportTitleService = class {
    static async getByName(data) {
        const result = await ReportTitleDB.getByName([data.mfo, data.bank_name]);

        return result;
    }

    static async get(data) {
        const result = await ReportTitleDB.get([data.offset, data.limit], data.search);

        return result;
    }

    static async getByid(data) {
        const result = await ReportTitleDB.getById([data.id], data.isdeleted);

        return result;
    }

    static async create(data) {
        const result = await ReportTitleDB.create([
            data.name,
            HelperFunctions.tashkentTime(),
            HelperFunctions.tashkentTime()
        ]);

        return result;
    }

    static async update(data) {
        const result = await ReportTitleDB.update([
            data.name,
            HelperFunctions.tashkentTime(),
            data.id
        ]);

        return result;
    }

    static async delete(data) {
        const result = await ReportTitleDB.delete([data.id]);

        return result;
    }
}