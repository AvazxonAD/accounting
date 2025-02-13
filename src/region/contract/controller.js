const { BudjetService } = require('@budjet/service');
const { SmetaService } = require('@smeta/service');
const { OrganizationService } = require('@organization/service');
const { ContractService } = require('@contract/service');

exports.Controller = class {
  static async create(req, res) {
    const budjet_id = req.query.budjet_id;
    const { region_id, id: user_id } = req.user;

    const budjet = await BudjetService.getById({ id: budjet_id });
    if (!budjet) {
      return res.error(req.i18n.t('budjetNotFound'), 404);
    }

    const { grafiks, spravochnik_organization_id } = req.body;

    const organization = await OrganizationService.getById({ region_id, id: spravochnik_organization_id });
    if (!organization) {
      return res.error(req.i18n.t('organizationNotFound'), 404);
    }

    let summa = 0;

    for (let grafik of grafiks) {
      const smeta = await SmetaService.getById({ id: grafik.smeta_id });
      if (!smeta) {
        return res.error(req.i18n.t('smetaNotFound'));
      }

      grafik.itogo =
        grafik.oy_1 + grafik.oy_2 + grafik.oy_3 + grafik.oy_4 +
        grafik.oy_5 + grafik.oy_6 + grafik.oy_7 + grafik.oy_8 +
        grafik.oy_9 + grafik.oy_10 + grafik.oy_11 + grafik.oy_12
        ;

      summa += grafik.itogo;
    }


    const result = await ContractService.create({ ...req.body, budjet_id, summa, user_id });

    return res.success(req.i18n.t('createSuccess'), 200, null, result);
  }

  static async get(req, res) {
    const region_id = req.user.region_id;
    const { page, limit, budjet_id, organ_id, pudratchi_bool, search } = req.query;

    const budjet = await BudjetService.getById({ id: budjet_id });
    if (!budjet) {
      return res.error(req.i18n.t('budjetNotFound'), 404);
    }

    const offset = (page - 1) * limit;

    if (organ_id) {
      const organization = await OrganizationService.getById({ region_id, id: organ_id });
      if (!organization) {
        return res.error(req.i18n.t('organizationNotFound'), 404);
      }
    }

    const { data, total, summa, page_summa } = await ContractService.get({ region_id, budjet_id, offset, limit, organ_id, pudratchi_bool, search });

    const pageCount = Math.ceil(total / limit);
    const meta = {
      pageCount: pageCount,
      count: total,
      currentPage: page,
      nextPage: page >= pageCount ? null : page + 1,
      backPage: page === 1 ? null : page - 1,
      summa,
      page_summa
    };

    return res.success(req.i18n.t('getSuccess'), 200, meta, data);
  }

  static async getById(req, res) {
    const region_id = req.user.region_id;
    const budjet_id = req.query.budjet_id;
    const id = req.params.id;

    const budjet = await BudjetService.getById({ id: budjet_id });
    if (!budjet) {
      return res.error(req.i18n.t('budjetNotFound'), 404);
    }

    const result = await ContractService.getById({ region_id, budjet_id, id, isdeleted: true });
    if (!result) {
      return res.error(req.i18n.t('docNotFound'), 404);
    }

    return res.success(req.i18n.t('getSuccess'), 200, null, result);
  }

  static async update(req, res) {
    const budjet_id = req.query.budjet_id;
    const { region_id, id: user_id } = req.user;
    const id = req.params.id;

    const budjet = await BudjetService.getById({ id: budjet_id });
    if (!budjet) {
      return res.error(req.i18n.t('budjetNotFound'), 404);
    }

    const doc = await ContractService.getById({ region_id, budjet_id, id });
    if (!doc) {
      return res.error(req.i18n.t('docNotFound'), 404);
    }

    const { grafiks, spravochnik_organization_id } = req.body;

    const organization = await OrganizationService.getById({ region_id, id: spravochnik_organization_id });
    if (!organization) {
      return res.error(req.i18n.t('organizationNotFound'), 404);
    }

    let summa = 0;

    for (let grafik of grafiks) {
      const smeta = await SmetaService.getById({ id: grafik.smeta_id });
      if (!smeta) {
        return res.error(req.i18n.t('smetaNotFound'));
      }

      grafik.itogo =
        grafik.oy_1 + grafik.oy_2 + grafik.oy_3 + grafik.oy_4 +
        grafik.oy_5 + grafik.oy_6 + grafik.oy_7 + grafik.oy_8 +
        grafik.oy_9 + grafik.oy_10 + grafik.oy_11 + grafik.oy_12
        ;

      summa += grafik.itogo;
    }


    const result = await ContractService.update({ ...req.body, budjet_id, summa, user_id, id });

    return res.success(req.i18n.t('updateSuccess'), 200, null, result);

  }

  static async delete(req, res) {
    const region_id = req.user.region_id;
    const budjet_id = req.query.budjet_id;
    const id = req.params.id;

    const budjet = await BudjetService.getById({ id: budjet_id });
    if (!budjet) {
      return res.error(req.i18n.t('budjetNotFound'), 404);
    }

    const doc = await ContractService.getById({ region_id, budjet_id, id, isdeleted: true });
    if (!doc) {
      return res.error(req.i18n.t('docNotFound'), 404);
    }

    const result = await ContractService.delete({ id });

    return res.success(req.i18n.t('getSuccess'), 200, null, result);
  }
}