const { PodotchetDB } = require('./db');

exports.PodotchetService = class {
    static async getById(data) {
        const result = await PodotchetDB.getById([data.region_id, data.id], data.isdeleted);
        return result;
    }

    static async get(data) {
        const result = await PodotchetDB.get([data.region_id, data.offset, data.limit]);
        return result;
    }
}