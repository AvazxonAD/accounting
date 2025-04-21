const { BudjetService } = require("@budjet/service");
const { ValidatorFunctions } = require(`@helper/database.validator`);
const { SmetaGrafikService } = require("./service");

exports.Controller = class {
  static async create(req, res) {
    const region_id = req.user.region_id;
    const user_id = req.user.id;
    const { smeta_id, spravochnik_budjet_name_id, main_schet_id, year } =
      req.body;

    await ValidatorFunctions.smeta({ smeta_id });

    await ValidatorFunctions.mainSchet({ region_id, main_schet_id });

    await ValidatorFunctions.budjet({
      budjet_id: spravochnik_budjet_name_id,
    });

    const check = await SmetaGrafikService.getByYear({
      region_id,
      smeta_id,
      spravochnik_budjet_name_id,
      year,
      main_schet_id,
    });
    if (check) {
      return res.error(req.i18n.t("docExists"), 409);
    }

    const result = await SmetaGrafikService.create({
      ...req.body,
      ...req.query,
      user_id,
    });

    return res.success(req.i18n.t("createSuccess"), 201, null, result);
  }
  static async get(req, res) {
    const region_id = req.user.region_id;
    const { page, limit, budjet_id, operator, year, search } = req.query;
    if (budjet_id) {
      const budjet = await BudjetService.getById({ id: budjet_id });
      if (!budjet) {
        return res.error(req.i18n.t("budjetNotFound"), 404);
      }
    }

    const offset = (page - 1) * limit;
    const {
      data,
      total,
      itogo,
      oy_1,
      oy_2,
      oy_3,
      oy_4,
      oy_5,
      oy_6,
      oy_7,
      oy_8,
      oy_9,
      oy_10,
      oy_11,
      oy_12,
    } = await SmetaGrafikService.get({
      ...req.query,
      region_id,
      offset,
      limit,
      budjet_id,
      operator,
      year,
    });

    const pageCount = Math.ceil(total / limit);

    const meta = {
      pageCount: pageCount,
      count: total,
      currentPage: page,
      nextPage: page >= pageCount ? null : page + 1,
      backPage: page === 1 ? null : page - 1,
      itogo,
      oy_1,
      oy_2,
      oy_3,
      oy_4,
      oy_5,
      oy_6,
      oy_7,
      oy_8,
      oy_9,
      oy_10,
      oy_11,
      oy_12,
    };

    return res.success(req.i18n.t("getSuccess"), 200, meta, data);
  }

  static async getById(req, res) {
    const region_id = req.user.region_id;
    const id = req.params.id;
    const { main_schet_id } = req.query;

    await ValidatorFunctions.mainSchet({ region_id, main_schet_id });

    const result = await SmetaGrafikService.getById({
      region_id,
      id,
      main_schet_id,
      isdeleted: true,
    });
    if (!result) {
      return res.error(req.i18n.t("smetaNotFound"), 404);
    }

    return res.success(req.i18n.t("getSuccess"), 200, null, result);
  }

  static async update(req, res) {
    const region_id = req.user.region_id;
    const id = req.params.id;
    const { smeta_id, spravochnik_budjet_name_id, main_schet_id, year } =
      req.body;

    await ValidatorFunctions.mainSchet({ region_id, main_schet_id });

    const old_data = await SmetaGrafikService.getById({
      region_id,
      id,
      main_schet_id,
    });
    if (!old_data) {
      return res.error(req.i18n.t("docNotFound"), 404);
    }

    if (old_data.year !== year) {
      const check = await SmetaGrafikService.getByYear({
        region_id,
        smeta_id,
        spravochnik_budjet_name_id,
        year,
        main_schet_id,
      });
      if (check) {
        return res.error(req.i18n.t("docExists"), 409);
      }
    }

    await ValidatorFunctions.smeta({ smeta_id });

    await ValidatorFunctions.budjet({
      budjet_id: spravochnik_budjet_name_id,
    });

    await ValidatorFunctions.mainSchet({ region_id, main_schet_id });

    const result = await SmetaGrafikService.update({ ...req.body, id });

    return res.success(req.i18n.t("updateSuccess"), 200, null, result);
  }

  static async deleteSmetGrafik(req, res) {
    const id = req.params.id;
    const region_id = req.user.region_id;
    const { main_schet_id } = req.query;

    await ValidatorFunctions.mainSchet({ region_id, main_schet_id });

    const smeta_grafik = await SmetaGrafikService.getById({
      region_id,
      id,
      main_schet_id,
    });
    if (!smeta_grafik) {
      return res.error(req.i18n.t("smetaNotFound"), 404);
    }

    const result = await SmetaGrafikService.delete({ id });

    return res.success(req.i18n.t("deleteSuccess"), 200, null, result);
  }
};
