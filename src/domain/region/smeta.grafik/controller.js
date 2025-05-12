const { ValidatorFunctions } = require(`@helper/database.validator`);
const { SmetaGrafikService } = require("./service");
const { HelperFunctions } = require("@helper/functions");

exports.Controller = class {
  static async create(req, res) {
    const region_id = req.user.region_id;
    const user_id = req.user.id;
    const { main_schet_id } = req.query;
    const { smetas } = req.body;

    await ValidatorFunctions.mainSchet({ region_id, main_schet_id });

    const check = HelperFunctions.checkId(smetas, "smeta_id");
    if (!check) {
      return res.error(req.i18n.t("smetaId"), 400);
    }

    for (let smeta of smetas) {
      await ValidatorFunctions.smeta({ smeta_id: smeta.smeta_id });
    }

    const result = await SmetaGrafikService.create({
      ...req.body,
      ...req.query,
      region_id,
      user_id,
    });

    return res.success(req.i18n.t("createSuccess"), 201, null, result);
  }

  static async get(req, res) {
    const region_id = req.user.region_id;
    const { page, limit, main_schet_id } = req.query;

    await ValidatorFunctions.mainSchet({ region_id, main_schet_id });

    const offset = (page - 1) * limit;

    const { data, total } = await SmetaGrafikService.get({
      ...req.query,
      region_id,
      offset,
    });

    const pageCount = Math.ceil(total / limit);

    const meta = {
      pageCount: pageCount,
      count: total,
      currentPage: page,
      nextPage: page >= pageCount ? null : page + 1,
      backPage: page === 1 ? null : page - 1,
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
      ...req.query,
      isdeleted: true,
    });

    if (!result) {
      return res.error(req.i18n.t("grafikNotFound"), 404);
    }

    return res.success(req.i18n.t("getSuccess"), 200, null, result);
  }

  static async update(req, res) {
    const region_id = req.user.region_id;
    const user_id = req.user.id;
    const id = req.params.id;
    const { main_schet_id } = req.query;
    const { smetas } = req.body;

    await ValidatorFunctions.mainSchet({
      region_id,
      main_schet_id,
    });

    const old_data = await SmetaGrafikService.getById({
      region_id,
      id,
      main_schet_id,
    });
    if (!old_data) {
      return res.error(req.i18n.t("docNotFound"), 404);
    }

    const check = HelperFunctions.checkId(smetas, "smeta_id");
    if (!check) {
      return res.error(req.i18n.t("smetaId"), 400);
    }

    for (let smeta of smetas) {
      await ValidatorFunctions.smeta({ smeta_id: smeta.smeta_id });

      if (smeta.id) {
        const check = old_data.smetas.find((item) => item.id === smeta.id);
        if (!check) {
          return res.error(req.i18n.t("smetaNotFound"), 404);
        }
      }
    }

    const end = await SmetaGrafikService.getEnd({
      region_id,
      year: old_data.year,
      main_schet_id,
    });

    if (end.id !== id) {
      return res.error(req.i18n.t("validationError"), 400);
    }

    const result = await SmetaGrafikService.update({
      ...req.body,
      ...req.query,
      region_id,
      user_id,
      id,
      old_data,
    });

    return res.success(req.i18n.t("updateSuccess"), 200, null, result);
  }

  static async deleteSmetGrafik(req, res) {
    const id = req.params.id;
    const region_id = req.user.region_id;
    const { main_schet_id } = req.query;
    const user_id = req.user.id;

    await ValidatorFunctions.mainSchet({ region_id, main_schet_id });

    const smeta_grafik = await SmetaGrafikService.getById({
      region_id,
      id,
      main_schet_id,
    });
    if (!smeta_grafik) {
      return res.error(req.i18n.t("smetaNotFound"), 404);
    }

    const end = await SmetaGrafikService.getEnd({
      region_id,
      year: smeta_grafik.year,
      main_schet_id,
    });

    if (end.id !== id) {
      return res.error(req.i18n.t("validationError"), 400);
    }

    const result = await SmetaGrafikService.delete({
      id,
      ...req.query,
      old_data: smeta_grafik,
      region_id,
      user_id,
    });

    return res.success(req.i18n.t("deleteSuccess"), 200, null, result);
  }

  static async getByOrderNumber(req, res) {
    const region_id = req.user.region_id;
    const { main_schet_id } = req.query;

    await ValidatorFunctions.mainSchet({ region_id, main_schet_id });

    const data = await SmetaGrafikService.getByOrderNumber({
      ...req.query,
      region_id,
    });
    if (!data) {
      return res.error(req.i18n.t("smetaNotFound"), 404);
    }

    return res.success(req.i18n.t("deleteSuccess"), 200, null, data);
  }
};
