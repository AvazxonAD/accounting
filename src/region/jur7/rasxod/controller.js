const { checkTovarId } = require('@helper/functions');
const { ResponsibleService } = require('@responsible/service')
const { ProductService } = require('@product/service')
const { MainSchetService } = require('@main_schet/service')
const { Jur7RsxodService } = require('./service')
const { SaldoService } = require('@saldo/service');

exports.Controller = class {
  static async create(req, res) {
    const region_id = req.user.region_id;
    const user_id = req.user.id;
    const main_schet_id = req.query.main_schet_id;
    const { doc_date, kimdan_id, childs } = req.body;

    const main_schet = await MainSchetService.getById({ region_id, id: main_schet_id });
    if (!main_schet) {
      return res.error(req.i18n.t('mainSchetNotFound'), 404);
    }

    const responsible = await ResponsibleService.getById({ region_id, id: kimdan_id });
    if (!responsible) {
      return res.error(req.i18n.t('responsibleNotFound', 404));
    }

    for (let child of childs) {
      const product = await ProductService.getById({ region_id, id: child.naimenovanie_tovarov_jur7_id })
      if (!product) {
        return res.error(req.i18n.t('productNotFound'), 404);
      }

      const data = await SaldoService.getSaldo({
        responsibles: [{ id: kimdan_id }],
        products: [{ id: child.naimenovanie_tovarov_jur7_id }],
        to: doc_date
      });

      if (!data[0].products[0] || data[0].products[0].to.kol < child.kol) {
        return res.error(req.i18n.t('kolError'), 400);
      }

      child.summa = child.sena * child.kol;
    }

    const testTovarId = checkTovarId(childs)

    if (testTovarId) {
      return res.error(req.i18n.t('productIdError'), 400);
    }

    const result = await Jur7RsxodService.create({ ...req.body, main_schet_id, user_id });

    return res.success(req.i18n.t('createSuccess'), 200, null, result);
  }

  static async getById(req, res) {
    const region_id = req.user.region_id
    const id = req.params.id
    const main_schet_id = req.query.main_schet_id;

    const main_schet = await MainSchetService.getById({ region_id, id: main_schet_id });
    if (!main_schet) {
      return res.error(req.i18n.t('mainSchetNotFound'), 404);
    }

    const data = await Jur7RsxodService.getById({ region_id, id, main_schet_id, isdeleted: true });
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

    
    const oldData = await Jur7RsxodService.getById({ region_id, id, main_schet_id });
    if (!oldData) {
      return res.error(req.i18n.t('docNotFound'), 404);
    };

    const responsible = await ResponsibleService.getById({ region_id, id: kimdan_id });
    if (!responsible) {
      return res.error(req.i18n.t('responsibleNotFound', 404));
    }
    for (let child of childs) {
      const product = await ProductService.getById({ region_id, id: child.naimenovanie_tovarov_jur7_id })
      if (!product) {
        return res.error(req.i18n.t('productNotFound'), 404);
      }

      const old_kol = oldData.childs.find(item => item.naimenovanie_tovarov_jur7_id === child.naimenovanie_tovarov_jur7_id).kol || 0;

      const data = await SaldoService.getSaldo({
        responsibles: [{ id: kimdan_id }],
        products: [{ id: child.naimenovanie_tovarov_jur7_id }],
        to: doc_date
      });

      const kol = data[0].products[0] ? data[0].products[0].to.kol : 0;
      
      if (kol + old_kol < child.kol) {
        return res.error(req.i18n.t('kolError'), 400);
      }

      child.summa = child.sena * child.kol;
    }

    const testTovarId = checkTovarId(childs)

    if (testTovarId) {
      return res.error(req.i18n.t('productIdError'), 400);
    }

    const result = await Jur7RsxodService.update({ ...req.body, user_id, main_schet_id, id });

    return res.success(req.i18n.t('updateSuccess'), 200, null, result);
  }

  static async delete(req, res) {
    const region_id = req.user.region_id
    const id = req.params.id
    const main_schet_id = req.query.main_schet_id;

    const main_schet = await MainSchetService.getById({ region_id, id: main_schet_id });
    if (!main_schet) {
      return res.error(req.i18n.t('mainSchetNotFound'), 404);
    }

    const data = await Jur7RsxodService.getById({ region_id, id, main_schet_id });
    if (!data) {
      return res.error(req.i18n.t('docNotFound'), 404);
    };

    await Jur7RsxodService.delete({ id });

    return res.error(req.i18n.t('deleteSuccess'), 200, null, { id })
  }

  static async get(req, res) {
    const region_id = req.user.region_id;
    const { page, limit, search, from, to, main_schet_id } = req.query;
    const main_schet = await MainSchetService.getById({ region_id, id: main_schet_id });
    if (!main_schet) {
      return res.error(req.i18n.t('mainSchetNotFound'), 404);
    }
    const offset = (page - 1) * limit;

    const { data, total } = await Jur7RsxodService.get({ region_id, from, to, main_schet_id, offset, limit, search });

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