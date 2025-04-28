const { RealCostService } = require("./service");
const { HelperFunctions, sum } = require(`@helper/functions`);
const { ValidatorFunctions } = require(`@helper/database.validator`);
const { SmetaService } = require("@smeta/service");
const { ContractService } = require(`@contract/service`);

exports.Controller = class {
  static async getDocs(req, res) {
    const { main_schet_id, smeta_id, month, type, grafik_id, year } = req.query;
    const { need_data } = req.body;
    const region_id = req.user.region_id;
    let docs = [];

    await ValidatorFunctions.mainSchet({ region_id, main_schet_id });

    const smeta = await SmetaService.getById({ id: smeta_id });
    if (!smeta) {
      return res.error(req.i18n.t("smetaNotFound"), 404);
    }

    const general_data = need_data.find((item) => item.smeta_id === smeta_id);

    const grafik_month = general_data?.by_month.find(
      (item) => item.id === grafik_id
    );

    const grafik_year = general_data?.by_year.find(
      (item) => item.id === grafik_id
    );

    if (
      (type === "contract_grafik_month" || type === "rasxod_month") &&
      !grafik_month
    ) {
      return res.error(req.i18n.t("validationError"), 400);
    }

    if (
      (type === "contract_grafik_year" || type === "rasxod_year") &&
      !grafik_year
    ) {
      return res.error(req.i18n.t("validationError"), 400);
    }

    if (type === "month_summa") {
      docs.push({ ...general_data, summa: general_data.month_summa });
    } else if (type === "year_summa") {
      docs.push({ ...general_data, summa: general_data.year_summa });
    } else if (type === "contract_grafik_month") {
      const summa = grafik[`oy_${month}`];

      docs.push({ ...grafik_month, summa });
    } else if (type === "contract_grafik_year") {
      let summa = 0;
      for (let i = 1; i <= month; i++) {
        summa += grafik[`oy_${i}`];
      }

      docs.push({ ...grafik_year, summa });
    } else if (type === "rasxod_month") {
      docs = await RealCostService.getRasxodDocs({
        main_schet_id,
        year,
        months: [month],
        contract_grafik_id: grafik_month.id,
        organ_id: grafik_month.spravochnik_organization_id,
        contract_id: grafik_month.id_shartnomalar_organization,
      });
    } else if (type === "rasxod_year") {
      docs = await RealCostService.getRasxodDocs({
        main_schet_id,
        year,
        months: [1, month],
        contract_grafik_id: grafik_year.id,
        organ_id: grafik_year.spravochnik_organization_id,
        contract_id: grafik_year.id_shartnomalar_organization,
      });
    } else if (type === "remaining_month") {
      docs.push({ ...grafik_month, summa: grafik_month.remaining_summa });
    } else if (type === "remaining_year") {
      docs.push({ ...grafik_year, summa: grafik_year.remaining_summa });
    }

    let summa = 0;
    for (let doc of docs) {
      summa += doc.summa;
    }

    return res.success(req.i18n.t("getSuccess"), 200, { summa }, docs);
  }

  static async create(req, res) {
    const user_id = req.user.id;
    const region_id = req.user.region_id;
    const { main_schet_id } = req.query;
    const { year, month, childs } = req.body;

    await ValidatorFunctions.mainSchet({ region_id, main_schet_id });
    const check = await RealCostService.getByMonth({
      region_id,
      main_schet_id,
      year,
      month,
    });

    if (check) {
      return res.error(req.i18n.t("docExists"), 409, { year, month });
    }

    const check_create = await RealCostService.checkCreateCount({
      region_id,
      main_schet_id,
    });

    if (check_create.length > 0) {
      const last_date = HelperFunctions.lastDate({ year, month });
      const check = await RealCostService.getByMonth({
        region_id,
        main_schet_id,
        year: last_date.year,
        month: last_date.month,
      });
      if (!check) {
        return res.error(req.i18n.t("yearMonthCreateError"), 400);
      }
    }

    const result = await RealCostService.create({
      main_schet_id,
      ...req.body,
      user_id,
    });

    return res.success(req.i18n.t("createSuccess"), 200, null, result);
  }

  static async getData(req, res) {
    const { main_schet_id } = req.query;
    const region_id = req.user.region_id;

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

    await ValidatorFunctions.mainSchet({ region_id, main_schet_id });

    const data = await RealCostService.getSmeta({ ...req.query, region_id });

    data.smetas = RealCostService.getMonthYearSumma({ ...data, ...req.query });

    data.smetas = await RealCostService.byMonth({
      ...data,
      ...req.query,
      region_id,
    });

    data.smetas = await RealCostService.byYear({
      ...data,
      ...req.query,
      region_id,
    });

    for (let smeta of data.smetas) {
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

    return res.success(req.i18n.t("getSuccess"), 200, meta, data.smetas);
  }

  static async get(req, res) {
    const region_id = req.user.region_id;
    const { page, limit, year, main_schet_id } = req.query;

    const offset = (page - 1) * limit;

    await ValidatorFunctions.mainSchet({ region_id, main_schet_id });

    const end = await RealCostService.getEnd({
      main_schet_id,
      region_id,
    });

    const { data, total } = await RealCostService.get({
      region_id,
      offset,
      limit,
      main_schet_id,
      year,
    });

    for (let doc of data) {
      if (end.id == doc.id) {
        doc.isdeleted = true;
      }
    }

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
    const { excel, main_schet_id } = req.query;
    const { id } = req.params;

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

    const data = await RealCostService.getById({
      region_id,
      id,
      main_schet_id,
      isdeleted: true,
    });

    if (!data) {
      return res.error(req.i18n.t("docNotFound"), 404);
    }

    await ValidatorFunctions.mainSchet({ region_id, main_schet_id });

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

    if (excel === "true") {
      const { file_path, file_name } = await RealCostService.getByIdExcel({
        ...data,
        ...req.query,
        meta,
      });

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${file_name}"`
      );

      return res.sendFile(file_path);
    }

    return res.success(req.i18n.t("getSuccess"), 200, meta, data);
  }

  static async update(req, res) {
    const region_id = req.user.region_id;
    const { id } = req.params;
    const user_id = req.user.id;
    const { year, month } = req.body;
    const { main_schet_id } = req.query;

    await ValidatorFunctions.mainSchet({ region_id, main_schet_id });

    const old_data = await RealCostService.getById({
      region_id,
      main_schet_id,
      id,
    });

    if (!old_data) {
      return res.error(req.i18n.t("docNotFound"), 404);
    }

    if (old_data.status === 3) {
      return res.error(req.i18n.t("docStatus"), 409);
    }

    if (old_data.year !== year || month !== old_data.month) {
      const check = await RealCostService.getByMonth({
        region_id,
        main_schet_id,
        year,
        month,
      });

      if (check) {
        return res.error(req.i18n.t("docExists"), 409, { year, month });
      }
    }

    const result = await RealCostService.update({
      ...req.body,
      old_data,
      region_id,
      main_schet_id,
      id,
      user_id,
    });

    return res.success(req.i18n.t("updateSuccess"), 200, null, result);
  }

  static async delete(req, res) {
    const region_id = req.user.region_id;
    const { id } = req.params;
    const { main_schet_id } = req.query;

    await ValidatorFunctions.mainSchet({ region_id, main_schet_id });

    const old_data = await RealCostService.getById({
      region_id,
      id,
      main_schet_id,
    });

    if (!old_data) {
      return res.error(req.i18n.t("docNotFound"), 404);
    }

    const end = await RealCostService.getEnd({
      main_schet_id,
      region_id,
    });

    if (end?.id !== id) {
      return res.error(req.i18n.t("validationError"), 400);
    }

    if (old_data.status === 3) {
      return res.error(req.i18n.t("docStatus"), 409);
    }

    await RealCostService.delete({ id, old_data });

    return res.success(req.i18n.t("deleteSuccess"), 200);
  }
};
