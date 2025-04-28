const { BudjetService } = require("@budjet/service");
const { OdinoxService } = require("./service");
const { HelperFunctions } = require(`@helper/functions`);
const { ReportTitleService } = require(`@report_title/service`);
const { ValidatorFunctions } = require(`@helper/database.validator`);
const { SmetaService } = require("@smeta/service");

exports.Controller = class {
  static async getDocs(req, res) {
    const { sort_order, main_schet_id, smeta_id, month } = req.query;
    const { need_data } = req.body;
    const region_id = req.user.region_id;
    let docs = [];

    await ValidatorFunctions.mainSchet({ region_id, main_schet_id });

    const smeta = await SmetaService.getById({ id: smeta_id });
    if (!smeta) {
      return res.error(req.i18n.t("smetaNotFound"), 404);
    }

    if (sort_order === 0 || sort_order === 5) {
      docs.push(
        need_data[sort_order].sub_childs.find((item) => item.id === smeta_id)
      );
    } else if (sort_order === 1 || sort_order === 6) {
      const months = sort_order === 1 ? [month] : [1, month];

      const data = need_data[sort_order].sub_childs.find(
        (item) => item.id === smeta_id
      );

      docs = await OdinoxService.getSort1Docs({
        ...req.query,
        region_id,
        sub_schet: data.smeta_number,
        months,
      });
    } else if (sort_order === 2 || sort_order === 7) {
      const months = sort_order === 1 ? [month] : [1, month];

      const data = need_data[sort_order].sub_childs.find(
        (item) => item.id === smeta_id
      );

      docs = await OdinoxService.getSort2Docs({
        ...req.query,
        region_id,
        sub_schet: data.smeta_number,
        months,
      });
    } else if (sort_order === 3 || sort_order === 8) {
      const months = sort_order === 1 ? [month] : [1, month];

      const data = need_data[sort_order].sub_childs.find(
        (item) => item.id === smeta_id
      );

      docs = await OdinoxService.getSort3Docs({
        ...req.query,
        region_id,
        sub_schet: data.smeta_number,
        months,
      });
    } else if (sort_order === 4 || sort_order === 9) {
      const grafik_index = sort_order === 4 ? 0 : 5;
      const rasxod_index = sort_order === 4 ? 3 : 8;

      const grafik_data = need_data[grafik_index].sub_childs.find(
        (item) => item.id === smeta_id
      );

      const jur1_jur2_rasxod_data = need_data[rasxod_index].sub_childs.find(
        (item) => item.id === smeta_id
      );

      docs.push({
        grafik_data,
        jur1_jur2_rasxod_data,
        summa: grafik_data.summa - jur1_jur2_rasxod_data.summa,
      });
    }

    let summa = 0;
    for (let doc of docs) {
      summa += doc.summa;
    }

    return res.success(req.i18n.t("getSuccess"), 200, { summa }, docs);
  }

  static async update(req, res) {
    const region_id = req.user.region_id;
    const { id } = req.params;
    const user_id = req.user.id;
    const { main_schet_id } = req.query;

    await ValidatorFunctions.mainSchet({ region_id, main_schet_id });

    const old_data = await OdinoxService.getById({
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

    const { dates, doc } = await OdinoxService.update({
      ...req.body,
      old_data,
      region_id,
      main_schet_id,
      id,
      user_id,
    });

    return res.success(req.i18n.t("updateSuccess"), 200, { dates }, doc);
  }

  static async create(req, res) {
    const user_id = req.user.id;
    const region_id = req.user.region_id;
    const { main_schet_id } = req.query;
    const { year, month, childs } = req.body;

    await ValidatorFunctions.mainSchet({ region_id, main_schet_id });

    const check = await OdinoxService.getByMonth({
      region_id,
      main_schet_id,
      year,
      month,
    });

    if (check) {
      return res.error(req.i18n.t("docExists"), 409, { year, month });
    }

    const check_create = await OdinoxService.checkCreateCount({
      region_id,
      main_schet_id,
    });

    if (check_create.length > 0) {
      const last_date = HelperFunctions.lastDate({ year, month });
      const check = await OdinoxService.getByMonth({
        region_id,
        main_schet_id,
        year: last_date.year,
        month: last_date.month,
      });
      if (!check) {
        return res.error(req.i18n.t("yearMonthCreateError"), 400);
      }
    }

    for (let child of childs) {
      const check = await OdinoxService.getByIdType({ id: child.type_id });
      if (!check) {
        return res.error(req.i18n.t("validationError"), 400);
      }
    }

    const result = await OdinoxService.create({
      main_schet_id,
      ...req.body,
      user_id,
    });

    return res.success(req.i18n.t("createSuccess"), 200, null, result);
  }

  static async getSmeta(req, res) {
    const { main_schet_id } = req.query;
    const region_id = req.user.region_id;

    await ValidatorFunctions.mainSchet({ region_id, main_schet_id });

    const result = await OdinoxService.getSmeta({
      ...req.query,
      region_id,
    });

    return res.success(req.i18n.t("getSuccess"), 200, null, result);
  }

  static async getById(req, res) {
    const region_id = req.user.region_id;
    const { excel, report_title_id, main_schet_id } = req.query;
    const { id } = req.params;

    const data = await OdinoxService.getById({
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
      const report_title = await ReportTitleService.getById({
        id: report_title_id,
      });
      if (!report_title) {
        return res.error(req.i18n.t("reportTitleNotFound"), 404);
      }

      const { file_path, file_name } = await OdinoxService.getByIdExcel({
        ...data,
        report_title,
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

    const end = await OdinoxService.getEnd({
      main_schet_id,
      region_id,
    });

    const { data, total } = await OdinoxService.get({
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

    const data = await OdinoxService.getById({
      region_id,
      id,
      main_schet_id,
    });

    if (!data) {
      return res.error(req.i18n.t("docNotFound"), 404);
    }

    const end = await OdinoxService.getEnd({
      main_schet_id,
      region_id,
    });

    if (end?.id !== id) {
      return res.error(req.i18n.t("validationError"), 400);
    }

    if (data.status === 3) {
      return res.error(req.i18n.t("docStatus"), 409);
    }

    await OdinoxService.delete({ id });

    return res.success(req.i18n.t("deleteSuccess"), 200);
  }

  static async getOdinoxType(req, res) {
    const result = await OdinoxService.getOdinoxType();

    return res.success(req.i18n.t("getSuccess"), 200, null, result);
  }

  static async getData(req, res) {
    const { month, main_schet_id } = req.query;
    const region_id = req.user.region_id;

    await ValidatorFunctions.mainSchet({ region_id, main_schet_id });

    const types = await OdinoxService.getOdinoxType({});

    const smetas = await OdinoxService.getSmeta({ ...req.query, region_id });

    for (let type of types) {
      if (type.sort_order === 0) {
        type.sub_childs = OdinoxService.getJur0Data({
          smetas: JSON.parse(JSON.stringify(smetas)),
          ...req.query,
        });
      }

      if (type.sort_order === 1) {
        type.sub_childs = await OdinoxService.getJur1Data({
          smetas: JSON.parse(JSON.stringify(smetas)),
          ...req.query,
          region_id,
          months: [month],
        });
      }

      if (type.sort_order === 2) {
        type.sub_childs = await OdinoxService.getJur2Data({
          smetas: JSON.parse(JSON.stringify(smetas)),
          ...req.query,
          region_id,
          months: [month],
        });
      }

      if (type.sort_order === 3) {
        type.sub_childs = await OdinoxService.getJur3Data({
          smetas: JSON.parse(JSON.stringify(smetas)),
          ...req.query,
          region_id,
          months: [month],
        });
      }

      if (type.sort_order === 4) {
        type.sub_childs = await OdinoxService.getJur4Data({
          smetas: JSON.parse(JSON.stringify(smetas)),
          grafik: types.find((item) => item.sort_order === 0),
          jur3a_akt_avans: types.find((item) => item.sort_order === 3),
        });
      }

      if (type.sort_order === 5) {
        type.sub_childs = await OdinoxService.getJur0DataYear({
          ...req.query,
          smetas: JSON.parse(JSON.stringify(smetas)),
        });
      }

      if (type.sort_order === 6) {
        type.sub_childs = await OdinoxService.getJur1Data({
          smetas: JSON.parse(JSON.stringify(smetas)),
          ...req.query,
          region_id,
          months: [1, month],
        });
      }

      if (type.sort_order === 7) {
        type.sub_childs = await OdinoxService.getJur2Data({
          smetas: JSON.parse(JSON.stringify(smetas)),
          ...req.query,
          region_id,
          months: [1, month],
        });
      }

      if (type.sort_order === 8) {
        type.sub_childs = await OdinoxService.getJur3Data({
          smetas: JSON.parse(JSON.stringify(smetas)),
          ...req.query,
          region_id,
          months: [1, month],
        });
      }

      if (type.sort_order === 9) {
        type.sub_childs = await OdinoxService.getJur4Data({
          smetas: JSON.parse(JSON.stringify(smetas)),
          grafik: types.find((item) => item.sort_order === 5),
          jur3a_akt_avans: types.find((item) => item.sort_order === 8),
        });
      }

      type.summa = 0;
      type.sub_childs.forEach((item) => {
        type.summa += item.summa;
      });
    }

    return res.success(req.i18n.t("getSuccess"), 200, null, types);
  }
};
