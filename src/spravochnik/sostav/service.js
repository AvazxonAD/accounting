const { SostavDB } = require('./db');

exports.SostavService = class {
    static async getByIdSostav(data) {
        const result = await SostavDB.getByIdSostav([data.region_id, data.id], data.isdeleted);
        
        return result;
    }
}