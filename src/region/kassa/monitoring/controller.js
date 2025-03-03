const { KassaMonitoringService } = require('./service');
const { MainSchetService } = require('@main_schet/service');
const { RegionService } = require('@region/service');

exports.Controller = class {
    static async get(req, res) {
        const region_id = req.user.region_id
        const { page, limit, main_schet_id } = req.query;
        const offset = (page - 1) * limit;

        const main_schet = await MainSchetService.getById({ region_id, id: main_schet_id });
        if (!main_schet) {
            return res.error(req.i18n.t('mainSchetNotFound'), 400)
        }

        const {
            total_count, data, summa_from, summa_to,
            prixod_sum, rasxod_sum, page_prixod_sum,
            page_rasxod_sum, page_total_sum,
        } = await KassaMonitoringService.get({ ...req.query, region_id, offset, limit });

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
            summa_to: summa_to.summa,
            page_prixod_sum,
            page_rasxod_sum,
            page_total_sum
        };

        return res.success(req.i18n.t('getSuccess'), 200, meta, data);
    }

    static async cap(req, res) {
        const { from, to, main_schet_id, excel } = req.query;
        const region_id = req.user.region_id;
        const region = await RegionService.getById({ id: region_id });

        const main_schet = await MainSchetService.getById({ region_id, id: main_schet_id });
        if (!main_schet) {
            return res.error(req.i18n.t('mainSchetNotFound'), 400)
        }

        const data = await KassaMonitoringService.cap({ region_id, main_schet_id, from, to });

        const { fileName, filePath } = await KassaMonitoringService.capExcel({ ...data, main_schet, from, to, region });

        if (excel === 'true') {
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

            return res.sendFile(filePath);
        }

        return res.success(req.i18n.t('getSuccess'), 200, null, data);
    }

    static async daily(req, res) {
        const { from, to, main_schet_id } = req.query;
        const region_id = req.user.region_id;
        const region = await RegionService.getById({ id: region_id });

        const main_schet = await MainSchetService.getById({ region_id, id: main_schet_id });
        if (!main_schet) {
            return res.error(req.i18n.t('mainSchetNotFound'), 400)
        }

        const data = await KassaMonitoringService.daily({ region_id, main_schet_id, from, to });

        const { fileName, filePath } = await KassaMonitoringService.dailyExcel({ ...data, region, from, to, main_schet, region_id });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

        return res.sendFile(filePath);
    }
}