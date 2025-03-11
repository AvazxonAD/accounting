const { checkTovarId } = require('@helper/functions');
const { ResponsibleService } = require('@responsible/service');
const { ProductService } = require('@product/service');
const { MainSchetService } = require('@main_schet/service');
const { Jur7InternalService } = require('./service');
const { SaldoService } = require('@saldo/service');
const { GroupService } = require('@group/service');

exports.Controller = class {
  static async create(req, res) {
    const region_id = req.user.region_id;
    const user_id = req.user.id;
    const main_schet_id = req.query.main_schet_id;
    const { doc_date, kimdan_id, childs, kimga_id } = req.body;

    const main_schet = await MainSchetService.getById({ region_id, id: main_schet_id });
    if (!main_schet) {
      return res.error(req.i18n.t('mainSchetNotFound'), 404);
    }

    const responsible = await ResponsibleService.getById({ region_id, id: kimdan_id });
    if (!responsible) {
      return res.error(req.i18n.t('responsibleNotFound', 404));
    }

    const responsible2 = await ResponsibleService.getById({ region_id, id: kimga_id });
    if (!responsible2) {
      return res.error(req.i18n.t('responsibleNotFound'), 404);
    }

    const check_saldo = await SaldoService.check({ region_id, year: new Date(doc_date).getFullYear(), month: new Date(doc_date).getMonth() + 1 });
    if (!check_saldo) {
      return res.error(req.i18n.t('saldoNotFound'), 404);
    }

    for (let child of childs) {
      child.product = await ProductService.getById({ region_id, id: child.naimenovanie_tovarov_jur7_id });
      if (!child.product) {
        return res.error(req.i18n.t('productNotFound'), 404);
      }

      if ((!child.iznos && child.iznos_summa) || (child.iznos && !child.product.group.iznos_foiz) || (child.sena < child.iznos_summa)) {
        return res.error(req.i18n.t('IznosSummaError'), 400, child);
      }

      const { data: groups } = await GroupService.get({ offset: 0, limit: 1, id: child.product.group.id });
      if (!groups.length) {
        return res.error(req.i18n.t('groupNotFound'), 404);
      }

      const data = await SaldoService.getByGroup({ responsible_id: kimdan_id, region_id, groups, to: doc_date, product_id: child.naimenovanie_tovarov_jur7_id });
      if (!data[0]) {
        return res.error(req.i18n.t('kolError'), 400);
      } else if (!data[0].products[0] || data[0].products[0].to.kol < child.kol) {
        return res.error(req.i18n.t('kolError'), 400);
      }

      child.summa = child.sena * child.kol;
    }

    const testTovarId = checkTovarId(childs)

    if (testTovarId) {
      return res.error(req.i18n.t('productIdError'), 400);
    }

    const result = await Jur7InternalService.create({ ...req.body, main_schet_id, user_id, region_id });

    return res.success(req.i18n.t('createSuccess'), 200, result.dates, result.doc);
  }

  static async getById(req, res) {
    const region_id = req.user.region_id
    const id = req.params.id
    const main_schet_id = req.query.main_schet_id;

    const main_schet = await MainSchetService.getById({ region_id, id: main_schet_id });
    if (!main_schet) {
      return res.error(req.i18n.t('mainSchetNotFound'), 404);
    }

    const data = await Jur7InternalService.getById({ region_id, id, main_schet_id, isdeleted: true });
    if (!data) {
      return res.error(req.i18n.t('docNotFound'), 404);
    };

    return res.success('Doc successfully get', 200, null, data);
  }

  static async update(req, res) {
    const region_id = req.user.region_id;
    const id = req.params.id;
    const user_id = req.user.id;
    const main_schet_id = req.query.main_schet_id;
    const { doc_date, kimdan_id, childs } = req.body;

    const main_schet = await MainSchetService.getById({ region_id, id: main_schet_id });
    if (!main_schet) {
      return res.error(req.i18n.t('mainSchetNotFound'), 404);
    }

    const old_data = await Jur7InternalService.getById({ region_id, id, main_schet_id, isdeleted: true });
    if (!old_data) {
      return res.error(req.i18n.t('docNotFound'), 404);
    };

    const responsible = await ResponsibleService.getById({ region_id, id: kimdan_id });
    if (!responsible) {
      return res.error(req.i18n.t('responsibleNotFound', 404));
    }

    const check_saldo = await SaldoService.check({ region_id, year: new Date(doc_date).getFullYear(), month: new Date(doc_date).getMonth() + 1 });
    if (!check_saldo) {
      return res.error(req.i18n.t('saldoNotFound'), 404);
    }

    for (let child of childs) {
      child.product = await ProductService.getById({ region_id, id: child.naimenovanie_tovarov_jur7_id });
      if (!child.product) {
        return res.error(req.i18n.t('productNotFound'));
      }

      const old_kol = old_data.childs.find(item => item.naimenovanie_tovarov_jur7_id === child.naimenovanie_tovarov_jur7_id).kol || 0;

      if ((!child.iznos && child.iznos_summa) || (child.iznos && !child.product.group.iznos_foiz) || (child.sena < child.iznos_summa)) {
        return res.error(req.i18n.t('IznosSummaError'), 400, child);
      }

      const { data: groups } = await GroupService.get({ offset: 0, limit: 1, id: child.product.group.id });
      if (!groups.length) {
        return res.error(req.i18n.t('groupNotFound'), 404);
      }

      const data = await SaldoService.getByGroup({ responsible_id: kimdan_id, region_id, groups, to: doc_date, product_id: child.naimenovanie_tovarov_jur7_id });

      const kol = data[0]?.products[0] ? data[0].products[0].to.kol : 0;

      if (kol + old_kol < child.kol) {
        return res.error(req.i18n.t('kolError'), 400);
      }

      child.summa = child.sena * child.kol;
    }

    const testTovarId = checkTovarId(childs)

    if (testTovarId) {
      return res.error(req.i18n.t('productIdError'), 400);
    }

    const result = await Jur7InternalService.update({ ...req.body, user_id, main_schet_id, id, old_data, region_id });

    return res.success(req.i18n.t('updateSuccess'), 200, result.dates, result.doc);
  }

  static async delete(req, res) {
    const region_id = req.user.region_id
    const id = req.params.id
    const main_schet_id = req.query.main_schet_id;

    const main_schet = await MainSchetService.getById({ region_id, id: main_schet_id });
    if (!main_schet) {
      return res.error(req.i18n.t('mainSchetNotFound'), 404);
    }

    const old_data = await Jur7InternalService.getById({ region_id, id, main_schet_id });
    if (!old_data) {
      return res.error(req.i18n.t('docNotFound'), 404);
    };

    const result = await Jur7InternalService.delete({ id, region_id, old_data });

    return res.error(req.i18n.t('deleteSuccess'), 200, result.dates, result.doc);
  }

  static async get(req, res) {
    const region_id = req.user.region_id;
    const { page, limit, search, from, to, main_schet_id } = req.query;
    const main_schet = await MainSchetService.getById({ region_id, id: main_schet_id });
    if (!main_schet) {
      return res.error(req.i18n.t('mainSchetNotFound'), 404);
    }
    const offset = (page - 1) * limit;

    const { data, total } = await Jur7InternalService.get({ region_id, from, to, main_schet_id, offset, limit, search });

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