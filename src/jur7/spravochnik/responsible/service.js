const { ResponsibleDB } = require('./db')
exports.ResponsibleService = class {
    static async getByIdResponsible(data) {
        const result = await ResponsibleDB.getByIdResponsible([data.region_id, data.id], data.isdeleted);
        return result;
    }

    static async getResponsible(data) {
        const result = await ResponsibleDB.getResponsible([data.region_id, 0, 9999]);
        return result;
    }
}