const { SaldoService } = require('./service')
const { ResponsibleService } = require('@responsible/service');
const { NaimenovanieService } = require('@product/service');
const { BudjetService } = require('@budjet/service');

exports.Controller = class {
  static async createSaldo(req, res) {
    const region_id = req.user.region_id;
    const user_id = req.user.id;
    const budjet_id = req.query.budjet_id;
    const { year, month } = req.body;

    const budjet = await BudjetService.getById({ id: budjet_id });
    if (!budjet) {
      return res.error(req.i18n.t('budjetNotFound'), 404);
    }

    const { data: responsibles } = await ResponsibleService.getResponsible({ region_id, offset: 0, limit: 9999 });
    const { data: products } = await NaimenovanieService.getNaimenovanie({ region_id, offset: 0, limit: 9999 });

    const info = await SaldoService.getInfo({ region_id, responsibles, products, year, month });

    await SaldoService.createSaldo({ user_id, year, month, info, region_id });

    return res.success('Create successfully', 201);
  }

  static async getSaldo(req, res) {
    const region_id = req.user.region_id;
    const { kimning_buynida, to, product_id } = req.query;

    let { data: responsibles } = await ResponsibleService.getResponsible({ region_id, offset: 0, limit: 9999, id: kimning_buynida });
    let { data: products } = await NaimenovanieService.getNaimenovanie({ region_id, offset: 0, limit: 9999, id: product_id });

    if (product_id) {
      const product = await NaimenovanieService.getById({ region_id, id: product_id })
      if (!product) {
        return res.error(req.i18n.t('productNotFound'));
      }
      products = products.filter(item => item.id === product_id);
    }

    if (kimning_buynida) {
      const responsible = await ResponsibleService.getById({ region_id, id: kimning_buynida });
      if (!responsible) {
        return res.error(req.i18n.t('responsibleNotFound'), 404);
      }
      responsibles = responsibles.filter(item => item.id === kimning_buynida);
    }

    const data = await SaldoService.getSaldo({ region_id, kimning_buynida, to, product_id, products, responsibles });

    return res.success(req.i18n.t('getSuccess'), 200, null, data);
  }
}