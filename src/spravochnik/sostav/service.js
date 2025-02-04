const { SostavDB } = require('./db');

exports.SostavService = class {
    static async getById(data) {
        const result = await SostavDB.getById([data.region_id, data.id], data.isdeleted);
        
        return result;
    }
}