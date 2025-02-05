const { SmetaDB } = require('./db');

exports.SmetaService = class {
    static async getById(data) {
        const result = await SmetaDB.getById([data.id], data.isdeleted);
    
        return result;
    }
}