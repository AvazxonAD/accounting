const { TypeOperatsiiDB } = require('./db');

exports.TypeOperatsiiService = class {
    static async getByIdTypeOperatsii(data) {
        const result = await TypeOperatsiiDB.getByIdTypeOperatsii([data.id, data.region_id]);
        
        return result;
    }
}