const { SaldoService } = require('./service')
const { ResponsibleService } = require('../spravochnik/responsible/service');
const { NaimenovanieService } = require('../spravochnik/naimenovanie/service')

exports.Controller = class {
  static async createSaldo(req, res) {
    const region_id = req.user.region_id;
    const user_id = req.user.id;
    const { year, month } = req.body;
    const { data: responsibles } = await ResponsibleService.getResponsible({ region_id })
    for (let responsible of responsibles) {
      responsible.docs = await SaldoService.getInfo({ region_id, kimning_buynida: responsible.id, year, month });
    }
    const result = await SaldoService.createSaldo({ user_id, year, month, responsibles, region_id })
    return res.success('Create successfully', 201, null, result);
  }

  static async getSaldo(req, res) {
    const region_id = req.user.region_id;
    const { kimning_buynida, year, month } = req.query;
    const responsible = await ResponsibleService.getByIdResponsible({ region_id, id: kimning_buynida });
    if (!responsible) {
      return res.error('Responsible not found', 404);
    }
    const data = await SaldoService.getSaldo({ region_id, kimning_buynida, year, month });
    return res.success('Get successfully', 200, null, data);
  }

  static async getSaldoForRasxod(req, res) {
    const region_id = req.user.region_id;
    const { kimning_buynida, to, product_id } = req.query;
    if (product_id) {
      const product = await NaimenovanieService.getByIdNaimenovanie({ region_id, id: product_id })
      if (!product) {
        return res.error('Product not found', 404);
      }
    }
    const responsible = await ResponsibleService.getByIdResponsible({ region_id, id: kimning_buynida });
    if (!responsible) {
      return res.error('Responsible not found', 404);
    }
    const data = await SaldoService.getSaldoForRasxod({ region_id, kimning_buynida, to, product_id });
    return res.success('Get successfully', 200, null, data);
  }
}