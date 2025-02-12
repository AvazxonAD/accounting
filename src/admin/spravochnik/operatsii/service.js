const { OperatsiiDB } = require('./db');

exports.OperatsiiService = class {
    static async getById(data) {
        const result = await OperatsiiDB.getById([data.id], data.type, data.isdeleted);
        return result;
    }

    static async get(data) {
        const result = await OperatsiiDB.get([]);
    }

    static async uniqueSchets(data) {
        const result = await OperatsiiDB.uniqueSchets([], data.type_schet);

        return result;
    }
}