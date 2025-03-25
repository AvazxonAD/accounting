const { TypeOperatsiiDB } = require('./db');

exports.TypeOperatsiiService = class {
    static async getById(data) {
        const result = await TypeOperatsiiDB.getById([data.region_id, data.id], data.isdeleted);
        
        return result;
    }
}