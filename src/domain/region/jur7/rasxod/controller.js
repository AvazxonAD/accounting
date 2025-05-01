const { checkTovarId } = require("@helper/functions");
const { ResponsibleService } = require("@responsible/service");
const { ProductService } = require("@product/service");
const { Jur7RsxodService } = require("./service");
const { SaldoService } = require("@jur7_saldo/service");
const { ValidatorFunctions } = require(`@helper/database.validator`);

exports.Controller = class {
  static async create(req, res) {
    const region_id = req.user.region_id;
    const user_id = req.user.id;
    const { main_schet_id } = req.query;
    const { doc_date, kimdan_id, childs } = req.body;

    await ValidatorFunctions.mainSchet({ main_schet_id, region_id });

    const responsible = await ResponsibleService.getById({
      region_id,
      id: kimdan_id,
    });
    if (!responsible) {
      return res.error(req.i18n.t("responsibleNotFound"), 404);
    }

    const check_saldo = await SaldoService.check({
      region_id,
      main_schet_id,
      year: new Date(doc_date).getFullYear(),
      month: new Date(doc_date).getMonth() + 1,
    });
    if (!check_saldo) {
      return res.error(req.i18n.t("saldoNotFound"), 404);
    }

    for (let child of childs) {
      const product = await ProductService.getById({
        region_id,
        id: child.naimenovanie_tovarov_jur7_id,
      });
      if (!product) {
        return res.error(req.i18n.t("productNotFound"), 404);
      }

      const { data } = await SaldoService.getByProduct({
        ...req.query,
        region_id,
        to: doc_date,
        page: 1,
        limit: 1,
        responsible_id: kimdan_id,
        product_id: child.naimenovanie_tovarov_jur7_id,
      });

      if (!data[0] || data[0].to.kol < child.kol) {
        return res.error(req.i18n.t("kolError"), 400);
      }

      child.summa = child.sena * child.kol;
    }

    const testTovarId = checkTovarId(childs);

    if (testTovarId) {
      return res.error(req.i18n.t("productIdError"), 400);
    }

    const result = await Jur7RsxodService.create({
      ...req.body,
      ...req.query,
      main_schet_id,
      user_id,
      region_id,
    });

    return res.success(
      req.i18n.t("createSuccess"),
      200,
      result.dates,
      result.doc
    );
  }

  static async getById(req, res) {
    const region_id = req.user.region_id;
    const id = req.params.id;
    const { main_schet_id } = req.query;

    await ValidatorFunctions.mainSchet({
      main_schet_id,
      region_id,
    });

    const data = await Jur7RsxodService.getById({
      region_id,
      id,
      main_schet_id,
      isdeleted: true,
    });
    if (!data) {
      return res.error(req.i18n.t("docNotFound"), 404);
    }

    return res.success("Doc successfully get", 200, null, data);
  }

  static async update(req, res) {
    const region_id = req.user.region_id;
    const id = req.params.id;
    const user_id = req.user.id;
    const { main_schet_id } = req.query;
    const { doc_date, kimdan_id, childs } = req.body;

    await ValidatorFunctions.mainSchet({
      main_schet_id,
      region_id,
    });

    const old_data = await Jur7RsxodService.getById({
      region_id,
      id,
      main_schet_id,
    });
    if (!old_data) {
      return res.error(req.i18n.t("docNotFound"), 404);
    }

    const responsible = await ResponsibleService.getById({
      region_id,
      id: kimdan_id,
    });
    if (!responsible) {
      return res.error(req.i18n.t("responsibleNotFound", 404));
    }

    const check_saldo = await SaldoService.check({
      region_id,
      main_schet_id,
      year: new Date(doc_date).getFullYear(),
      month: new Date(doc_date).getMonth() + 1,
    });
    if (!check_saldo) {
      return res.error(req.i18n.t("saldoNotFound"), 404);
    }

    for (let child of childs) {
      const product = await ProductService.getById({
        region_id,
        id: child.naimenovanie_tovarov_jur7_id,
      });
      if (!product) {
        return res.error(req.i18n.t("productNotFound"), 404);
      }

      const old_kol =
        old_data.childs.find(
          (item) =>
            item.naimenovanie_tovarov_jur7_id ===
            child.naimenovanie_tovarov_jur7_id
        )?.kol || 0;

      const { data } = await SaldoService.getByProduct({
        ...req.query,
        region_id,
        to: doc_date,
        page: 1,
        limit: 1,
        responsible_id: kimdan_id,
        product_id: child.naimenovanie_tovarov_jur7_id,
      });

      const kol = data[0] ? data[0].to.kol : 0;

      if (kol + old_kol < child.kol) {
        return res.error(req.i18n.t("kolError"), 400);
      }

      child.summa = child.sena * child.kol;
    }

    const testTovarId = checkTovarId(childs);

    if (testTovarId) {
      return res.error(req.i18n.t("productIdError"), 400);
    }

    const result = await Jur7RsxodService.update({
      ...req.body,
      ...req.query,
      user_id,
      id,
      old_data,
      region_id,
    });

    return res.success(
      req.i18n.t("updateSuccess"),
      200,
      result.dates,
      result.doc
    );
  }

  static async delete(req, res) {
    const region_id = req.user.region_id;
    const id = req.params.id;
    const main_schet_id = req.query.main_schet_id;

    await ValidatorFunctions.mainSchet({
      main_schet_id,
      region_id,
    });

    const data = await Jur7RsxodService.getById({
      region_id,
      id,
      main_schet_id,
    });
    if (!data) {
      return res.error(req.i18n.t("docNotFound"), 404);
    }

    const check_saldo = await SaldoService.check({
      region_id,
      main_schet_id,
      year: new Date(data.doc_date).getFullYear(),
      month: new Date(data.doc_date).getMonth() + 1,
    });
    if (!check_saldo) {
      return res.error(req.i18n.t("saldoNotFound"), 404);
    }

    const response = await Jur7RsxodService.delete({
      ...req.query,
      id,
      old_data: data,
      region_id,
    });

    return res.error(
      req.i18n.t("deleteSuccess"),
      200,
      response.dates,
      response.doc
    );
  }

  static async get(req, res) {
    const region_id = req.user.region_id;
    const { page, limit, main_schet_id } = req.query;

    await ValidatorFunctions.mainSchet({
      main_schet_id,
      region_id,
    });

    const offset = (page - 1) * limit;

    const { data, total, summa } = await Jur7RsxodService.get({
      region_id,
      offset,
      ...req.query,
    });

    const pageCount = Math.ceil(total / limit);

    const meta = {
      pageCount: pageCount,
      count: total,
      summa,
      currentPage: page,
      nextPage: page >= pageCount ? null : page + 1,
      backPage: page === 1 ? null : page - 1,
    };

    return res.success(req.i18n.t("getSuccess"), 200, meta, data);
  }
};
