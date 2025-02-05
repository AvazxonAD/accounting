const { BudjetDB } = require('./db');

exports.BudjetService = class {
    static async getById(data) {
        const bdujet = await BudjetDB.getById([data.id]);
        return bdujet;
    }
}