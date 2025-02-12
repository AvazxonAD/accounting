const { DashboardService } = require('./service');
const { MainSchetService } = require('@main_schet/service');
const { PodotchetService } = require('../spravochnik/podotchet/service')

exports.Controller = class {
    static async budjet(req, res) {
        const { main_schet_id, budjet_id } = req.query;
        const region_id = req.user.region_id;
        const budjets = await DashboardService.getBudjet({ main_schet_id, budjet_id, region_id });

        return res.success(req.i18n.t('getSuccess'), 200, req.query, budjets);
    }

    static async kassa(req, res) {
        const { main_schet_id, budjet_id, to } = req.query;
        const region_id = req.user.region_id;

        if (main_schet_id) {
            const main_schet = await MainSchetService.getById({ region_id, id: main_schet_id });
            if (!main_schet) {
                return res.error(req.i18n.t('mainSchetNotFound'), 404);
            }
        }

        const budjets = await DashboardService.getBudjet({ main_schet_id, budjet_id, region_id });

        const result = await DashboardService.kassa({ budjets, to });

        return res.success(req.i18n.t('getSuccess'), 200, req.query, result);
    }

    static async bank(req, res) {
        const { main_schet_id, budjet_id, to } = req.query;
        const region_id = req.user.region_id;

        if (main_schet_id) {
            const main_schet = await MainSchetService.getById({ region_id, id: main_schet_id });
            if (!main_schet) {
                return res.error(req.i18n.t('mainSchetNotFound'), 404);
            }
        }

        const budjets = await DashboardService.getBudjet({ main_schet_id, budjet_id, region_id });

        const result = await DashboardService.bank({ budjets, to });

        return res.success(req.i18n.t('getSuccess'), 200, req.query, result);
    }

    static async podotchet(req, res) {
        const { main_schet_id, budjet_id, to, page, limit } = req.query;
        const region_id = req.user.region_id;

        if (main_schet_id) {
            const main_schet = await MainSchetService.getById({ region_id, id: main_schet_id });
            if (!main_schet) {
                return res.error(req.i18n.t('mainSchetNotFound'), 404);
            }
        }

        const offset = (page - 1) * limit;

        const { data, total_count } = await PodotchetService.get({ region_id, offset, limit });

        const budjets = await DashboardService.getBudjet({ main_schet_id, budjet_id, region_id });

        const pageCount = Math.ceil(total_count / limit);
        const meta = {
            pageCount: pageCount,
            count: total_count,
            currentPage: page,
            nextPage: page >= pageCount ? null : page + 1,
            backPage: page === 1 ? null : page - 1
        }

        const result = await DashboardService.podotchet({ budjets, to, podotchets: data });

        return res.success(req.i18n.t('getSuccess'), 200, meta, result);
    }
}