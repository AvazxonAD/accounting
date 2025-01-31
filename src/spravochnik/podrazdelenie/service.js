const { PodrazdelenieDB } = require('./db');

exports.PodrazdelenieService = class {
    static async getByIdPodraz(data) {
        const result = await PodrazdelenieDB.getByIdPodrazdelenie([data.id, data.region_id], data.isdeleted);
        
        return result;
    }
}