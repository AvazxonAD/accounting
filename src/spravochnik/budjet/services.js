const { BudjetDB } = require('./db');

exports.BudjetService = class {
    static async getByIdBudjet(data) {
        const bdujet = await BudjetDB.getByIdBudjet([data.id]);
        return bdujet;
    }
}