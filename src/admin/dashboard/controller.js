const { DashboardService } = require('./service');


exports.Controller = class {
    static async kassa(req, res) {
        const { main_schet_id, budjet_id, to } = req.query;

        const budjets = await DashboardService.getBudjet({ main_schet_id, budjet_id });

        const result = await DashboardService.kassa({ budjets, to });

        return res.success(req.i18n.t('getSuccess'), 200, req.query, result);
    }

    static async bank(req, res) {
        const { main_schet_id, budjet_id, to } = req.query;

        const budjets = await DashboardService.getBudjet({ main_schet_id, budjet_id });

        const result = await DashboardService.bank({ budjets, to });

        return res.success(req.i18n.t('getSuccess'), 200, req.query, result);
    }

    static async podotchet(req, res) {
        const { main_schet_id, budjet_id, to } = req.query;

        const budjets = await DashboardService.getBudjet({ main_schet_id, budjet_id });

        const result = await DashboardService.podotchet({ budjets, to });

        return res.success(req.i18n.t('getSuccess'), 200, req.query, result);
    }
}