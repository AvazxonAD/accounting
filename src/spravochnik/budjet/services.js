const { BudjetDB } = require('./db');

exports.BudjetService = class {
    static async getByIdBudjet(id) {
        const bdujet = await BudjetDB.getByIdBudjet([id]);
        return bdujet;
    }
}