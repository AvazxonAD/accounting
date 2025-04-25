const { BudjetService } = require("@budjet/service");
const { SmetaService } = require("@smeta/service");
const { OrganizationService } = require("@organization/service");
const { ContractService } = require("@contract/service");
const { HelperFunctions } = require("@helper/functions");
const { ValidatorFunctions } = require("@helper/database.validator");

exports.Controller = class {
  static async create(req, res) {
    const main_schet_id = req.query.main_schet_id;
    const { region_id, id: user_id } = req.user;

    await ValidatorFunctions.mainSchet({ region_id, main_schet_id });

    const { grafiks, spravochnik_organization_id } = req.body;

    const organization = await OrganizationService.getById({
      region_id,
      id: spravochnik_organization_id,
    });
    if (!organization) {
      return res.error(req.i18n.t("organizationNotFound"), 404);
    }

    let summa = 0;

    const check = HelperFunctions.checkId(grafiks, "smeta_id");
    if (!check) {
      return res.error(req.i18n.t("smetaId"), 400);
    }

    for (let grafik of grafiks) {
      const smeta = await SmetaService.getById({ id: grafik.smeta_id });
      if (!smeta) {
        return res.error(req.i18n.t("smetaNotFound"));
      }

      grafik.itogo =
        grafik.oy_1 +
        grafik.oy_2 +
        grafik.oy_3 +
        grafik.oy_4 +
        grafik.oy_5 +
        grafik.oy_6 +
        grafik.oy_7 +
        grafik.oy_8 +
        grafik.oy_9 +
        grafik.oy_10 +
        grafik.oy_11 +
        grafik.oy_12;

      summa += grafik.itogo;
    }

    const result = await ContractService.create({
      ...req.body,
      main_schet_id,
      summa,
      user_id,
    });

    return res.success(req.i18n.t("createSuccess"), 200, null, result);
  }

  static async get(req, res) {
    const region_id = req.user.region_id;
    const {
      page,
      limit,
      main_schet_id,
      organ_id,
      pudratchi_bool,
      search,
      order_by,
      order_type,
    } = req.query;

    await ValidatorFunctions.mainSchet({ region_id, main_schet_id });

    const offset = (page - 1) * limit;

    if (organ_id) {
      const organization = await OrganizationService.getById({
        region_id,
        id: organ_id,
      });
      if (!organization) {
        return res.error(req.i18n.t("organizationNotFound"), 404);
      }
    }

    const { data, total, summa, page_summa } = await ContractService.get({
      region_id,
      main_schet_id,
      offset,
      limit,
      organ_id,
      pudratchi_bool,
      search,
      order_by,
      order_type,
    });

    const pageCount = Math.ceil(total / limit);
    const meta = {
      pageCount: pageCount,
      count: total,
      currentPage: page,
      nextPage: page >= pageCount ? null : page + 1,
      backPage: page === 1 ? null : page - 1,
      summa,
      page_summa,
    };

    return res.success(req.i18n.t("getSuccess"), 200, meta, data);
  }

  static async getById(req, res) {
    const region_id = req.user.region_id;
    const main_schet_id = req.query.main_schet_id;
    const id = req.params.id;

    await ValidatorFunctions.mainSchet({ region_id, main_schet_id });

    const result = await ContractService.getById({
      region_id,
      main_schet_id,
      id,
      isdeleted: true,
    });
    if (!result) {
      return res.error(req.i18n.t("docNotFound"), 404);
    }

    return res.success(req.i18n.t("getSuccess"), 200, null, result);
  }

  static async update(req, res) {
    const main_schet_id = req.query.main_schet_id;
    const { region_id, id: user_id } = req.user;
    const id = req.params.id;

    await ValidatorFunctions.mainSchet({ region_id, main_schet_id });

    const doc = await ContractService.getById({ region_id, main_schet_id, id });
    if (!doc) {
      return res.error(req.i18n.t("docNotFound"), 404);
    }

    const { grafiks, spravochnik_organization_id } = req.body;

    const organization = await OrganizationService.getById({
      region_id,
      id: spravochnik_organization_id,
    });
    if (!organization) {
      return res.error(req.i18n.t("organizationNotFound"), 404);
    }

    for (let grafik of doc.grafiks) {
      const old_grafik = grafiks.find((item) => item.id === grafik.id);
      if (!old_grafik) {
        const check = await ContractService.checkGrafik({
          grafik_id: grafik.id,
        });

        if (check.length) {
          return res.error(req.i18n.t("grafikError"), 400, check);
        }
      }
    }

    let summa = 0;

    for (let grafik of grafiks) {
      if (grafik.id) {
        const check = doc.grafiks.find((item) => item.id === grafik.id);
        if (!check) {
          return res.error(req.i18n.t("grafikNotFound"), 404);
        }
      }

      const smeta = await SmetaService.getById({ id: grafik.smeta_id });
      if (!smeta) {
        return res.error(req.i18n.t("smetaNotFound"));
      }

      grafik.itogo =
        grafik.oy_1 +
        grafik.oy_2 +
        grafik.oy_3 +
        grafik.oy_4 +
        grafik.oy_5 +
        grafik.oy_6 +
        grafik.oy_7 +
        grafik.oy_8 +
        grafik.oy_9 +
        grafik.oy_10 +
        grafik.oy_11 +
        grafik.oy_12;

      summa += grafik.itogo;
    }

    const result = await ContractService.update({
      ...req.body,
      main_schet_id,
      summa,
      user_id,
      id,
      old_data: doc,
    });

    return res.success(req.i18n.t("updateSuccess"), 200, null, result);
  }

  static async delete(req, res) {
    const region_id = req.user.region_id;
    const main_schet_id = req.query.main_schet_id;
    const id = req.params.id;

    await ValidatorFunctions.mainSchet({ region_id, main_schet_id });

    const doc = await ContractService.getById({
      region_id,
      main_schet_id,
      id,
      isdeleted: true,
    });
    if (!doc) {
      return res.error(req.i18n.t("docNotFound"), 404);
    }

    const result = await ContractService.delete({ id });

    return res.success(req.i18n.t("getSuccess"), 200, null, result);
  }
};
