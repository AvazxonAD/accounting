const { ReportService } = require('./service')
const { BudjetService } = require('../../admin/spravochnik/budjet/service');


exports.Controller = class {
  static async getReport(req, res) {
    const data = await ReportService.getReport({});
    return res.success(req.i18n.t('getSuccess'), 200, null, data);
  }

  static async getByIdReport(req, res) {
    const { budjet_id, year, month, region_id } = req.query;
    const budjet = await BudjetService.getById({ id: budjet_id });
    if (!budjet) {
      return res.error(req.i18n.t('budjetNotFound'), 404);
    }
    const doc = await ReportService.getByIdReport({ region_id, year, month, budjet_id })
    if (!doc) {
      return res.error(req.i18n.t('docNotFound'), 404);
    }
    return res.success(req.i18n.t('getSuccess'), 200, null, doc);
  }

  static async updateReport(req, res) {
    const { budjet_id, year, month, region_id } = req.query;
    const user_id = req.user.id;
    const budjet = await BudjetService.getById({ id: budjet_id });
    if (!budjet) {
      return res.error(req.i18n.t('budjetNotFound'), 404);
    }
    const doc = await ReportService.getByIdReport({ region_id, year, month, budjet_id })
    if (!doc) {
      return res.error(req.i18n.t('docNotFound'), 404);
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