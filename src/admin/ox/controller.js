const { ReportService } = require('./service')
const { BudjetService } = require('../../spravochnik/budjet/services');
const { MainSchetService } = require('../../spravochnik/main.schet/services')


exports.Controller = class {
  static async getReport(req, res) {
    const data = await ReportService.getReport({});
    return res.success('Get successfully', 200, null, data);
  }

  static async getByIdReport(req, res) {
    const { budjet_id, year, month, region_id } = req.query;
    const budjet = await BudjetService.getByIdBudjet({ id: budjet_id });
    if (!budjet) {
      return res.error('Budjet not found', 404);
    }
    const doc = await ReportService.getByIdReport({ region_id, year, month, budjet_id })
    if (!doc) {
      return res.error('Doc not found', 404);
    }
    return res.success('Get successfully', 200, null, doc);
  }

  static async updateReport(req, res) {
    const { budjet_id, year, month, region_id } = req.query;
    const user_id = req.user.id;
    const budjet = await BudjetService.getByIdBudjet({ id: budjet_id });
    if (!budjet) {
      return res.error('Budjet not found', 404);
    }
    const doc = await ReportService.getByIdReport({ region_id, year, month, budjet_id })
    if (!doc) {
      return res.error('Doc not found', 404);
    }
    const result = await ReportService.updateReport({
      region_id,
      year,
      month,
      budjet_id,
      user_id_qabul_qilgan: user_id,
      status: req.body.status
    })
    return res.success('Update successfullly', 200, null, result);
  }
}