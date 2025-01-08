const { ResponsibleDB } = require('./db')
exports.ResponsibleService = class {
    static async getByIdResponsible(data) {
        const result = await ResponsibleDB.getByIdResponsible([data.region_id, data.id], data.isdeleted);
        return result;
    }
}