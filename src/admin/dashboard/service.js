const { DashboardDB } = require('./db');

exports.DashboardService = class {
    static async getBudjet(data) {
        const result = await DashboardDB.getBudjet([]);

        return result;
    }
}