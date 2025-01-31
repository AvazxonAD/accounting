const { KassaMonitoringDB } = require('./db');

exports.KassaMonitoringService = class {
    static async get(data) {
        const result = await KassaMonitoringDB.get([data.region_id, data.main_schet_id, data.from, data.to, data.offset, data.limit]);
        let prixod_sum = 0;
        let rasxod_sum = 0;
        for (let item of result.data) {
            prixod_sum += item.prixod_sum;
            rasxod_sum += item.rasxod_sum;
        }

        const summa_from = await KassaMonitoringDB.getSumma([data.region_id, data.main_schet_id, data.from], '<');

        const summa_to = await KassaMonitoringDB.getSumma([data.region_id, data.main_schet_id, data.to], '<=');

        return { 
            summa_from, 
            summa_to, 
            data: result.data || [], 
            total_count: result.total_count,
            prixod_sum, 
            rasxod_sum
        };
    }
}