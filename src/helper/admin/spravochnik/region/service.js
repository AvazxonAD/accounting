const { RegionDB } = require('./db');

exports.RegionService = class {
    static async getById(data) {
        const result = await RegionDB.getById([data.id], data.isdeleted);

        return result;
    }
}