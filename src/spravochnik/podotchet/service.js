const { PodotchetDB } = require('./db');

exports.PodotchetService = class {
    static async getById(data) {
        const result = await PodotchetDB.getById([data.region_id, data.id], data.isdeleted);
        return result;
    }
}