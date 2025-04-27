const { RealCostService } = require("./service");

exports.Controller = class {
  static async get(req, res) {
    const { page, limit, year, main_schet_id, month } = req.query;

    const offset = (page - 1) * limit;

    const { data, total } = await RealCostService.get({
      offset,
      limit,
      main_schet_id,
      year,
      month,
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
    const { id } = req.params;

    const data = await RealCostService.getById({ id });

    if (!data) {
      return res.error(req.i18n.t("docNotFound"), 404);
    }

    const meta = {
      month_summa: 0,
      year_summa: 0,
      by_month: {
        rasxod_summa: 0,
        contract_grafik_summa: 0,
        remaining_summa: 0,
      },
      by_year: {
        rasxod_summa: 0,
        contract_grafik_summa: 0,
        remaining_summa: 0,
      },
    };

    for (let smeta of data.childs) {
      meta.year_summa += smeta.year_summa;
      meta.month_summa += smeta.month_summa;

      for (let child of smeta.by_month) {
        meta.by_month.rasxod_summa += child.rasxod_summa;
        meta.by_month.contract_grafik_summa += child.contract_grafik_summa;
        meta.by_month.remaining_summa += child.remaining_summa;
      }

      for (let child of smeta.by_year) {
        meta.by_year.rasxod_summa += child.rasxod_summa;
        meta.by_year.contract_grafik_summa += child.contract_grafik_summa;
        meta.by_year.remaining_summa += child.remaining_summa;
      }
    }

    return res.success(req.i18n.t("getSuccess"), 200, meta, data);
  }

  static async update(req, res) {
    const region_id = req.user.region_id;
    const { id } = req.params;
    const user_id = req.user.id;

    const old_data = await RealCostService.getById({
      region_id,
      id,
    });

    if (!old_data) {
      return res.error(req.i18n.t("docNotFound"), 404);
    }

    const result = await RealCostService.update({
      ...req.body,
      id,
      user_id,
    });

    return res.success(req.i18n.t("updateSuccess"), 200, null, result);
  }
};
