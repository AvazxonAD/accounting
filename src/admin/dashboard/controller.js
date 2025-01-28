const { DashboardService } = require('./service');

exports.Controller = class {
    static async getBudjet(req, res) {
        const result = await DashboardService.getBudjet({});

        return result;
    }
}