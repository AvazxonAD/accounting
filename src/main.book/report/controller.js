const { ReportService } = require('./service')
const { BudjetService } = require('../../spravochnik/budjet/service');
const { MainSchetService } = require('../../spravochnik/main.schet/service')


exports.Controller = class {
  static async createReport(req, res) {
    const user_id = req.user.id;
    const region_id = req.user.region_id;
    const budjet_id = req.query.budjet_id;
    const main_schet_id = req.query.main_schet_id;
    const { month, year } = req.body;
    const budjet = await BudjetService.getById({ id: budjet_id });
    if (!budjet) {
      return res.error(req.i18n.t('budjetNotFound'), 404);
    }
    const main_schet = await MainSchetService.getById({ region_id, id: main_schet_id })
    if (!main_schet) {
      return res.error(req.i18n.t('mainSchetNotFound'), 404);
    }
    const doc = await ReportService.getByIdReport({ region_id, year, month, budjet_id });
    if (doc) {
      return res.error('This data already exist', 409)
    }
    const data = await ReportService.getInfo({
      region_id,
      year,
      month,
      budjet_id,
    })
    const result = await ReportService.createReport({ ...data, user_id, budjet_id, main_schet_id })
    return res.success('Create successfully', 201, null, result);
  }

  static async getReport(req, res) {
    const region_id = req.user.region_id;
    const { budjet_id, year, month } = req.query;
    const budjet = await BudjetService.getById({ id: budjet_id });
    if (!budjet) {
      return res.status(404).json({
        message: "budjet not found"
      })
    }
    const data = await ReportService.getReport({ region_id, budjet_id, year, month });
    return res.success(req.i18n.t('getSuccess'), 200, null, data);
  }

  static async getByIdReport(req, res) {
    const region_id = req.user.region_id
    const { budjet_id, year, month } = req.query;
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
    const region_id = req.user.region_id;
    const user_id = req.user.id;
    const { body, query } = req;
    const budjet = await BudjetService.getById({ id: query.budjet_id });
    if (!budjet) {
      return res.error(req.i18n.t('budjetNotFound'), 404);
    }
    const main_schet = await MainSchetService.getById({ region_id, id: query.main_schet_id })
    if (!main_schet) {
      return res.error(req.i18n.t('mainSchetNotFound'), 404);
    }
    const old_doc = await ReportService.getByIdReport({ region_id, year: query.year, month: query.month, budjet_id: query.budjet_id });
    if (!old_doc) {
      return res.error(req.i18n.t('docNotFound'), 404)
    }
    if (old_doc.status === 2) {
      return res.error("The confirmed document cannot be deleted", 400)
    }
    if (old_doc.year !== body.year || old_doc.month !== body.month) {
      const doc = await ReportService.getByIdReport({ region_id, year: body.year, month: body.month, budjet_id: query.budjet_id });
      if (doc) {
        return res.error('This data already exist', 409)
      }
    }
    const data = await ReportService.getInfo({
      region_id,
      year: body.year,
      month: body.month,
      budjet_id: query.budjet_id,
    })
    const result = await ReportService.updateReport({ ...data, user_id, region_id, query, body })
    return res.success('Update successfullly', 200, null, result);
  }

  static async deleteReport(req, res) {
    const region_id = req.user.region_id
    const { budjet_id, year, month } = req.query;
    const budjet = await BudjetService.getById({ id: budjet_id });
    if (!budjet) {
      return res.error(req.i18n.t('budjetNotFound'), 404);
    }
    const doc = await ReportService.getByIdReport({ region_id, year, month, budjet_id })
    if (!doc) {
      return res.error(req.i18n.t('docNotFound'), 404);
    }
    if (doc.status === 2) {
      return res.error("The confirmed document cannot be deleted", 400)
    }
    await ReportService.deleteReport({ region_id, year, month, budjet_id });
    return res.success('Delete successfully', 200);
  }

  static async getInfo(req, res) {
    const { year, month, budjet_id } = req.query;
    const region_id = req.user.region_id;
    const budjet = await BudjetService.getById({ id: budjet_id });
    if (!budjet) {
      return res.error(req.i18n.t('budjetNotFound'), 404);
    }
    const result = await ReportService.getInfo({
      region_id,
      year,
      month,
      budjet_id,
    })
    return res.success(req.i18n.t('getSuccess'), 200, null, result);
  }
}