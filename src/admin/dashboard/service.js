const { DashboardDB } = require('./db');

exports.DashboardService = class {
    static async getBudjet(data) {
        const result = await DashboardDB.getBudjet([]);

        return result;
    }

    static async get(data) {
        const kassa_bank = await DashboardDB.getKassSumma([data.main_schet_id, data.to]);

        const podotchets = await DashboardDB.getPodotchets([data.main_schet_id, data.to]);

        return { kassa_bank, podotchets };
    }2
}