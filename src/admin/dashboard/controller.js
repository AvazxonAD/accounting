const { DashboardService } = require('./service');

exports.Controller = class {
    static async getBudjet(req, res) {
        const result = await DashboardService.getBudjet({});

        return res.success(req.i18n.t('getSuccess'), 200, null, result);
    }

    static async get(req, res) {
        const { main_schet_id, to } = req.query;

        const result = await DashboardService.get({ main_schet_id, to });

        return res.success('get successfully', 200, null, result);
    }
}