const { SaldoService } = require('./service')
const { BudjetService } = require('../../spravochnik/budjet/services');
const { ResponsibleService } = require('../spravochnik/responsible/service');

exports.Controller = class {
  static async createSaldo(req, res) {
    const region_id = req.user.region_id;
    const user_id = req.user.id;
    const { year, month, kimning_buynida } = req.body;
    const responsible = await ResponsibleService.getByIdResponsible({ region_id, id: kimning_buynida })
    if (!responsible) {
      return res.error('responsible not found', 404);
    }
    const docs = await SaldoService.getSaldo({ region_id, kimning_buynida, year, month })
    if(docs.length){
      return res.error('This data already exists', 409);
    }
    const data = await SaldoService.getInfo({ region_id, kimning_buynida, year, month });
    const result = await SaldoService.createSaldo({ docs: data, user_id, year, month, kimning_buynida })
    return res.success('Create successfully', 201, null, result);
  }

  static async getSaldo(req, res) {
    const region_id = req.user.region_id;
    const { kimning_buynida, year, month } = req.query;
    const data = await SaldoService.getSaldo({ region_id, kimning_buynida, year, month });
    return res.success('Get successfully', 200, null, data);
  }

  static async getByIdSaldo(req, res) {
    const region_id = req.user.region_id;
    const { year, month, kimning_buynida } = req.query;
    const doc = await SaldoService.getByIdSaldo({ region_id, year, month, kimning_buynida })
    if (!doc.length) {
      return res.error('Doc not found', 404);
    }
    return res.success('Get successfully', 200, null, doc);
  }

  static async updateSaldo(req, res) {
    const region_id = req.user.region_id;
    const { query, body } = req;
    const doc = await SaldoService.getByIdSaldo({ region_id, year, month, kimning_buynida })
    if (!doc.length) {
      return res.error('Doc not found', 404);
    }

  }

  static async deleteSaldo(req, res) {
    const region_id = req.user.region_id
    const { budjet_id, year, month } = req.query;
    const budjet = await BudjetService.getByIdBudjet({ id: budjet_id });
    if (!budjet) {
      return res.error('Budjet not found', 404);
    }
    const doc = await SaldoService.getByIdSaldo({ region_id, year, month, budjet_id })
    if (!doc) {
      return res.error('Doc not found', 404);
    }
    if (doc.status === 2) {
      return res.error("The confirmed document cannot be deleted", 400)
    }
    await SaldoService.deleteSaldo({ region_id, year, month, budjet_id });
    return res.success('Delete successfully', 200);
  }

  static async getInfo(req, res) {
    const region_id = req.user.region_id;
    const { year, month, kimning_buynida } = req.query;
    const responsible = await ResponsibleService.getByIdResponsible({ region_id, id: kimning_buynida })
    if (!responsible) {
      return res.error('responsible not found', 404);
    }
    const result = await SaldoService.getInfo({ region_id, kimning_buynida, year, month });
    return res.success('Get successfully', 200, null, result);
  }
}