const { PodrazdelenieDB } = require('./db');

exports.PodrazdelenieService = class {
    static async getById(data) {
        const result = await PodrazdelenieDB.getByIdPodrazdelenie([data.id, data.region_id], data.isdeleted);
        
        return result;
    }
}