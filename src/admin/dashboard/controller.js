const { DashboardService } = require('./service');

exports.Controller = class {
    static async getBudjet(req, res) {
        const result = await DashboardService.getBudjet({});

        return res.success(req.i18n.t('getSuccess'), 200, null, result);
    }    
}