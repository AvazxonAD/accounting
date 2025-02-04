const { DashboardDB } = require('./db');

exports.DashboardService = class {
    static async getBudjet(data) {
        const result = await DashboardDB.getBudjet([data.region_id], data.budjet_id, data.main_schet_id);

        return result;
    }

    static async kassa(data) {
        for (let budjet of data.budjets) {
            for (let schet of budjet.main_schets) {
                schet.kassa = await DashboardDB.kassa([schet.id, data.to]);
            }
        }
        return data.budjets;
    }

    static async bank(data) {
        for (let budjet of data.budjets) {
            for (let schet of budjet.main_schets) {
                schet.bank = await DashboardDB.bank([schet.id, data.to]);
            }
        }
        return data.budjets;
    }

    static async podotchet(data) {
        for (let budjet of data.budjets) {
            for (let schet of budjet.main_schets) {
                schet.podotchets = await DashboardDB.podotchets([schet.id, data.to]);
            }
        }
        return data.budjets;
    }
}