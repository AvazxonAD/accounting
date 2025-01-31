const { PodotchetDB } = require('./db');

exports.PodotchetService = class {
    static async getByIdPodotchet(data) {
        const result = await PodotchetDB.getByIdPodotchet([data.region_id, data.id], data.isdeleted);
        return result;
    }
}