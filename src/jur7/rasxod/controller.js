const { RasxodDB } = require('./db');
const { checkTovarId } = require('../../helper/functions');
const { ResponsibleService } = require('../spravochnik/responsible/service')
const { NaimenovanieDB } = require('../spravochnik/naimenovanie/db')
const { NaimenovanieService } = require('../spravochnik/naimenovanie/service')
const { MainSchetService } = require('../../spravochnik/main.schet/service')
const { Jur7RsxodService } = require('./service')
const { Jur7MonitoringService } = require('../monitoring/service');

exports.Controller = class {
  static async createRasxod(req, res) {
    const region_id = req.user.region_id;
    const user_id = req.user.id;
    const main_schet_id = req.query.main_schet_id;
    const { doc_date, kimdan_id, childs } = req.body;

    const main_schet = await MainSchetService.getById({ region_id, id: main_schet_id });
    if (!main_schet) {
      return res.error(req.i18n.t('mainSchetNotFound'), 404);
    }

    const responsible = await ResponsibleService.getByIdResponsible({ region_id, id: kimdan_id });
    if (!responsible) {
      return res.error(req.i18n.t('responsibleNotFound', 404));
    }

    for (let child of childs) {
      const product = await NaimenovanieService.getByIdNaimenovanie({ region_id, id: child.naimenovanie_tovarov_jur7_id })
      if (!product) {
        return res.error(req.i18n.t('productNotFound'), 404);
      }

      const { products } = await Jur7MonitoringService.getSaldo({
        responsible_id: kimdan_id,
        to: doc_date,
        product_id: child.naimenovanie_tovarov_jur7_id,
        offset: 0,
        limit: 1
      });

      if (!products[0] || products[0].kol < child.kol) {
        return res.error(req.i18n.t('kolError'), 400);
      }

      child.summa = child.sena * child.kol;
    }

    const testTovarId = checkTovarId(childs)

    if (testTovarId) {
      return res.error(req.i18n.t('productIdError'), 400);
    }

    const result = await Jur7RsxodService.createRasxod({ ...req.body, main_schet_id, user_id });

    return res.success(req.i18n.t('createSuccess'), 200, null, result);
  }

  static async getByIdRasxod(req, res) {
    const region_id = req.user.region_id
    const id = req.params.id
    const main_schet_id = req.query.main_schet_id;

    const main_schet = await MainSchetService.getById({ region_id, id: main_schet_id });
    if (!main_schet) {
      return res.error(req.i18n.t('mainSchetNotFound'), 404);
    }

    const data = await Jur7RsxodService.getByIdRasxod({ region_id, id, main_schet_id, isdeleted: true });
    if (!data) {
      return res.error(req.i18n.t('docNotFound'), 404);
    };

    return res.success('Doc successfully get', 200, null, data);
  }

  static async updateRasxod(req, res) {
    const region_id = req.user.region_id;
    const id = req.params.id;
    const user_id = req.user.id;
    const main_schet_id = req.query.main_schet_id;
    const { doc_date, kimdan_id, childs } = req.body;

    const main_schet = await MainSchetService.getById({ region_id, id: main_schet_id });
    if (!main_schet) {
      return res.error(req.i18n.t('mainSchetNotFound'), 404);
    }

    const oldData = await Jur7RsxodService.getByIdRasxod({ region_id, id, main_schet_id, isdeleted: true });
    if (!oldData) {
      return res.error(req.i18n.t('docNotFound'), 404);
    };

    const responsible = await ResponsibleService.getByIdResponsible({ region_id, id: kimdan_id });
    if (!responsible) {
      return res.error(req.i18n.t('responsibleNotFound', 404));
    }
    for (let child of childs) {
      const product = await NaimenovanieDB.getByIdNaimenovanie([region_id, child.naimenovanie_tovarov_jur7_id])
      if (!product) {
        return res.error(req.i18n.t('productNotFound'));
      }

      const { products } = await Jur7MonitoringService.getSaldo({
        responsible_id: kimdan_id,
        to: doc_date,
        product_id: child.naimenovanie_tovarov_jur7_id,
        offset: 0,
        limit: 1
      });

      if (!products[0] || products[0].kol < child.kol) {
        return res.error(req.i18n.t('kolError'), 404);
      }

      child.summa = child.sena * child.kol;
    }

    const testTovarId = checkTovarId(childs)

    if (testTovarId) {
      return res.error(req.i18n.t('productIdError'), 400);
    }

    const result = await Jur7RsxodService.updateRasxod({ ...req.body, user_id, main_schet_id, id });

    return res.success(req.i18n.t('updateSuccess'), 200, null, result);
  }

  static async deleteRasxod(req, res) {
    const region_id = req.user.region_id
    const id = req.params.id
    const main_schet_id = req.query.main_schet_id;

    const main_schet = await MainSchetService.getById({ region_id, id: main_schet_id });
    if (!main_schet) {
      return res.error(req.i18n.t('mainSchetNotFound'), 404);
    }

    const rasxod_doc = await RasxodDB.getByIdRasxod([region_id, id, main_schet_id])
    if (!rasxod_doc) {
      return res.error(req.i18n.t('docNotFound'), 404);
    }

    await Jur7RsxodService.deleteRasxod({ id });

    return res.error(req.i18n.t('deleteSuccess'), 200, null, { id })
  }

  static async getRasxod(req, res) {
    const region_id = req.user.region_id;
    const { page, limit, search, from, to, main_schet_id } = req.query;
    const main_schet = await MainSchetService.getById({ region_id, id: main_schet_id });
    if (!main_schet) {
      return res.error(req.i18n.t('mainSchetNotFound'), 404);
    }
    const offset = (page - 1) * limit;

    const { data, total } = await Jur7RsxodService.getRasxod({ region_id, from, to, main_schet_id, offset, limit, search });

    const pageCount = Math.ceil(total / limit);

    const meta = {
      pageCount: pageCount,
      count: total,
      currentPage: page,
      nextPage: page >= pageCount ? null : page + 1,
      backPage: page === 1 ? null : page - 1
    }

    return res.success(req.i18n.t('getSuccess'), 200, meta, data);
  }
}