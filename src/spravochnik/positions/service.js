const { MainBookSchetDB } = require('./db');

exports.MainBookSchetService = class {
    static async get(data) {
        const result = await MainBookSchetDB.getMainBookSchet([data.offset, data.limit], data.search);

        return result;
    }
}