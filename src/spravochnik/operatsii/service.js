const { OperatsiiDB } = require('./db');

exports.OperatsiiService = class {
    static async getByIdOperatsii(data) {
        const result = await OperatsiiDB.getByIdOperatsii([data.id], data.type, data.isdeleted);
        return result;
    }

    static async get(data) {
        const result = await OperatsiiDB.get([]);
    }
}