const { RealCostService } = require("./service");
const { HelperFunctions } = require(`@helper/functions`);
const { ReportTitleService } = require(`@report_title/service`);
const { ValidatorFunctions } = require(`@helper/database.validator`);

exports.Controller = class {
  static async create(req, res) {
    const user_id = req.user.id;
    const region_id = req.user.region_id;
    const { main_schet_id } = req.query;
    const { year, month, childs } = req.body;

    await ValidatorFunctions.mainSchet({ region_id, main_schet_id });
    // const check = await RealCostService.getByMonth({
    //   region_id,
    //   main_schet_id,
    //   year,
    //   month,
    // });

    // if (check) {
    //   return res.error(req.i18n.t("docExists"), 409, { year, month });
    // }

    // const check_create = await RealCostService.checkCreateCount({
    //   region_id,
    //   main_schet_id,
    // });

    // if (check_create.length > 0) {
    //   const last_date = HelperFunctions.lastDate({ year, month });
    //   const check = await RealCostService.getByMonth({
    //     region_id,
    //     main_schet_id,
    //     year: last_date.year,
    //     month: last_date.month,
    //   });
    //   if (!check) {
    //     return res.error(req.i18n.t("yearMonthCreateError"), 400);
    //   }
    // }

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

    return res.success(req.i18n.t("getSuccess"), 200, null, data.smetas);
  }

  // old

  static async update(req, res) {
    const region_id = req.user.region_id;
    const { id } = req.params;
    const user_id = req.user.id;
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

    const { dates, doc } = await RealCostService.update({
      ...req.body,
      old_data,
      region_id,
      main_schet_id,
      id,
      user_id,
    });

    return res.success(req.i18n.t("updateSuccess"), 200, { dates }, doc);
  }

  static async getSmeta(req, res) {
    const { main_schet_id } = req.query;
    const region_id = req.user.region_id;

    await ValidatorFunctions.mainSchet({ region_id, main_schet_id });

    const result = await RealCostService.getSmeta({
      ...req.query,
      region_id,
    });

    return res.success(req.i18n.t("getSuccess"), 200, null, result);
  }

  static async getById(req, res) {
    const region_id = req.user.region_id;
    const { excel, report_title_id, main_schet_id } = req.query;
    const { id } = req.params;

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

    for (let type of data.childs) {
      type.summa = 0;

      for (let child of type.sub_childs) {
        type.summa += child.summa;
      }
    }

    if (excel === "true") {
      const { file_path, file_name } = await RealCostService.getByIdExcel({
        ...data,
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

    return res.success(req.i18n.t("getSuccess"), 200, null, data);
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

  static async delete(req, res) {
    const region_id = req.user.region_id;
    const { id } = req.params;
    const { main_schet_id } = req.query;

    await ValidatorFunctions.mainSchet({ region_id, main_schet_id });

    const data = await RealCostService.getById({
      region_id,
      id,
      main_schet_id,
    });

    if (!data) {
      return res.error(req.i18n.t("docNotFound"), 404);
    }

    const end = await RealCostService.getEnd({
      main_schet_id,
      region_id,
    });

    if (end?.id !== id) {
      return res.error(req.i18n.t("validationError"), 400);
    }

    if (data.status === 3) {
      return res.error(req.i18n.t("docStatus"), 409);
    }

    await RealCostService.delete({ id });

    return res.success(req.i18n.t("deleteSuccess"), 200);
  }

  static async getOdinoxType(req, res) {
    const result = await RealCostService.getOdinoxType();

    return res.success(req.i18n.t("getSuccess"), 200, null, result);
  }
};
