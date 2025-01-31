const { TypeOperatsiiDB } = require('./db');

exports.TypeOperatsiiService = class {
    static async getByIdTypeOperatsii(data) {
        const result = await TypeOperatsiiDB.getByIdTypeOperatsii([data.region_id, data.id], data.isdeleted);
        
        return result;
    }
}