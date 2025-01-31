const { KassaMonitoringService } = require('./service');
const { MainSchetService } = require('../../spravochnik/main.schet/services');


exports.Controller = class {
    static async get(req, res) {
        const region_id = req.user.region_id
        const { page, limit, main_schet_id, from, to } = req.query;
        const offset = (page - 1) * limit;

        const main_schet = await MainSchetService.getByIdMainScet({ region_id, id: main_schet_id });
        if (!main_schet) {
            return res.error(req.i18n.t('mainSchetNotFound'), 400)
        }

        const { total_count, data, summa_from, summa_to, prixod_sum, rasxod_sum } = await KassaMonitoringService.get({ region_id, main_schet_id, offset, limit, from, to });

        const pageCount = Math.ceil(total_count / limit);

        const meta = {
            pageCount: pageCount,
            count: total_count,
            currentPage: page,
            nextPage: page >= pageCount ? null : page + 1,
            backPage: page === 1 ? null : page - 1,
            prixod_sum,
            rasxod_sum,
            summa_from_object: summa_from,
            summa_to_object: summa_to,
            summa_from: summa_from.summa,
            summa_to: summa_to.summa
        };

        return res.success(req.i18n.t('getSuccess'), 200, meta, data);
    }
}