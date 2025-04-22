const { BudjetService } = require("@budjet/service");
const { OdinoxService } = require("./service");
const { HelperFunctions } = require(`@helper/functions`);
const { ReportTitleService } = require(`@report_title/service`);
const { SALDO_PASSWORD } = require(`@helper/constants`);
const { ValidatorFunctions } = require(`@helper/database.validator`);

exports.Controller = class {
  static async getDocs(req, res) {
    const { type_id, main_schet_id, prixod, rasxod } = req.query;
    const region_id = req.user.region_id;
    let docs = [];

    const jur3AndJur4Schets = await OdinoxService.getJurSchets({
      main_schet_id,
    });

    if (prixod === "true" && rasxod === "true") {
      return res.error(req.i18n.t("validationError"), 400);
    }

    if (type_id === 1) {
      // jur1
      if (prixod === "true") {
        docs = await OdinoxService.getJur1PrixodDocs({
          ...req.query,
          region_id,
        });
      } else if (rasxod === "true") {
        docs = await OdinoxService.getJur1RasxodDocs({
          ...req.query,
          region_id,
        });
      }
    }

    // jur2
    if (type_id === 2) {
      if (prixod === "true") {
        docs = await OdinoxService.getJur2PrixodDocs({
          ...req.query,
          region_id,
        });
      } else if (rasxod === "true") {
        docs = await OdinoxService.getJur2RasxodDocs({
          ...req.query,
          region_id,
        });
      }
    }

    // jur3
    if (type_id === 3) {
      if (prixod === "true") {
        docs = await OdinoxService.getJur3PrixodDocs({
          ...req.query,
          jur3AndJur4Schets,
          region_id,
        });
      } else if (rasxod === "true") {
        docs = await OdinoxService.getJur3RasxodDocs({
          ...req.query,
          region_id,
        });
      }
    }

    // jur3a
    if (type_id === 3.1) {
      docs = [];
    }

    // jur4
    if (type_id === 4) {
      if (prixod === "true") {
        docs = await OdinoxService.getJur4PrixodDocs({
          ...req.query,
          jur3AndJur4Schets,
          region_id,
        });
      } else if (rasxod === "true") {
        docs = await OdinoxService.getJur4RasxodDocs({
          ...req.query,
          jur3AndJur4Schets,
          region_id,
        });
      }
    }

    // jur5
    if (type_id === 5) {
      docs = [];
    }

    // jur7
    if (type_id === 7) {
      if (prixod === "true") {
        docs = await OdinoxService.getJur7PrixodDocs({
          ...req.query,
          region_id,
        });
      } else if (rasxod === "true") {
        docs = await OdinoxService.getJur7RasxodDocs({
          ...req.query,
          region_id,
        });
      }
    }

    // jur8
    if (type_id === 8) {
      if (prixod === "true") {
        docs = await OdinoxService.getJur8PrixodDocs({
          ...req.query,
          region_id,
        });
      } else if (rasxod === "true") {
        docs = await OdinoxService.getJur8RasxodDocs({
          ...req.query,
          region_id,
        });
      }
    }

    let summa = 0;
    for (let doc of docs) {
      summa += doc.summa;
    }

    return res.success(req.i18n.t("getSuccess"), 200, { summa }, docs);
  }

  static async cleanData(req, res) {
    const region_id = req.user.region_id;
    const { main_schet_id, password } = req.query;

    await ValidatorFunctions.mainSchet({ region_id, main_schet_id });

    if (password !== SALDO_PASSWORD) {
      return res.error(req.i18n.t("validationError"), 400);
    }

    const { data } = await OdinoxService.get({
      region_id,
      offset: 0,
      limit: 999999999,
      main_schet_id,
    });

    await OdinoxService.cleanData({ data });

    return res.success(req.i18n.t("cleanSuccess"), 200);
  }

  static async getCheckFirst(req, res) {
    const region_id = req.user.region_id;
    const { main_schet_id } = req.query;

    await ValidatorFunctions.mainSchet({ region_id, main_schet_id });

    const result = await OdinoxService.getCheckFirst({
      main_schet_id,
      region_id,
    });

    if (!result) {
      return res.error(req.i18n.t("docNotFound"), 404);
    }

    return res.success(req.i18n.t("getSuccess"), 200, null, result);
  }

  static async getSmeta(req, res) {
    const { main_schet_id } = req.query;
    const region_id = req.user.region_id;

    await ValidatorFunctions.mainSchet({ region_id, main_schet_id });

    const result = await OdinoxService.getSmeta({
      main_schet_id,
      region_id,
    });

    return res.success(req.i18n.t("getSuccess"), 200, null, result);
  }

  static async delete(req, res) {
    const region_id = req.user.region_id;
    const { id } = req.params;
    const { main_schet_id } = req.query;

    await ValidatorFunctions.mainSchet({ region_id, main_schet_id });

    const data = await OdinoxService.getById({
      region_id,
      id,
    });

    if (!data) {
      return res.error(req.i18n.t("docNotFound"), 404);
    }

    const end = await OdinoxService.getEndMainBook({
      main_schet_id,
      region_id,
    });

    if (end?.id !== id) {
      return res.error(req.i18n.t("deleteSaldo"), 400);
    }

    if (data.status === 3) {
      return res.error(req.i18n.t("mainBookStatus"), 409);
    }

    const check = await OdinoxService.checkLarge({
      region_id,
      year: data.year,
      month: data.month,
      main_schet_id,
    });

    if (check.length) {
      return res.error(req.i18n.t(`conflictError`), 400);
    }

    await OdinoxService.delete({ id });

    return res.success(req.i18n.t("deleteSuccess"), 200);
  }

  static async getOdinoxType(req, res) {
    const result = await OdinoxService.getOdinoxType();

    return res.success(req.i18n.t("getSuccess"), 200, null, result);
  }

  static async create(req, res) {
    const user_id = req.user.id;
    const region_id = req.user.region_id;
    const { main_schet_id } = req.query;
    const { year, month } = req.body;

    await ValidatorFunctions.mainSchet({ region_id, main_schet_id });

    const check = await OdinoxService.get({
      offset: 0,
      limit: 1,
      region_id,
      main_schet_id,
      year,
      month,
    });

    if (check.total) {
      return res.error(req.i18n.t("docExists"), 409, { year, month });
    }

    const result = await OdinoxService.create({
      main_schet_id,
      ...req.body,
      user_id,
    });

    return res.success(req.i18n.t("createSuccess"), 200, null, result);
  }

  static async get(req, res) {
    const region_id = req.user.region_id;
    const { page, limit, year, main_schet_id } = req.query;

    const offset = (page - 1) * limit;

    await ValidatorFunctions.mainSchet({ region_id, main_schet_id });

    const first = await OdinoxService.getCheckFirst({
      main_schet_id,
      region_id,
    });

    const end = await OdinoxService.getEndMainBook({
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
      if (doc.id === first?.id) {
        doc.first = true;
      } else {
        doc.first = false;
      }
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
    const { excel, report_title_id, main_schet_id } = req.query;
    const { id } = req.params;

    const data = await OdinoxService.getById({
      region_id,
      id,
      isdeleted: true,
    });

    if (!data) {
      return res.error(req.i18n.t("docNotFound"), 404);
    }

    await ValidatorFunctions.mainSchet({ region_id, main_schet_id });

    const first = await OdinoxService.getCheckFirst({
      main_schet_id,
      region_id,
    });

    if (data.id === first?.id) {
      data.first = true;
    } else {
      data.first = false;
    }

    for (let type of data.childs) {
      type.prixod = 0;
      type.rasxod = 0;

      for (let child of type.sub_childs) {
        type.prixod += child.prixod;
        type.rasxod += child.rasxod;
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

  static async getData(req, res) {
    const { year, month, main_schet_id } = req.query;
    const region_id = req.user.region_id;

    await ValidatorFunctions.mainSchet({ region_id, main_schet_id });

    const types = await OdinoxService.getOdinoxType({});

    const date = HelperFunctions.getMonthStartEnd({ year, month });

    const smetas = [];

    const from = `${date[0].getFullYear()}-${String(date[0].getMonth() + 1).padStart(2, "0")}-${String(date[0].getDate()).padStart(2, "0")}`;
    const to = `${date[1].getFullYear()}-${String(date[1].getMonth() + 1).padStart(2, "0")}-${String(date[1].getDate()).padStart(2, "0")}`;

    for (let type of types) {
      //from
      if (type.id === 0) {
        type = OdinoxService.getJur0Data({
          smetas: JSON.parse(JSON.stringify(smetas)),
          types,
          last_saldo,
        });
      }

      // jurnal 1
      if (type.id === 1) {
        type.sub_childs = await OdinoxService.getJur1Data({
          smetas: JSON.parse(JSON.stringify(smetas)),
          main_schet_id,
          from,
          to,
          region_id,
          main_schets: main_schets,
        });
      }

      // jurnal 2
      if (type.id === 2) {
        type.sub_childs = await OdinoxService.getJur2Data({
          smetas: JSON.parse(JSON.stringify(smetas)),
          main_schet_id,
          from,
          to,
          region_id,
          main_schets: main_schets,
        });
      }

      // jurnal 3
      if (type.id === 3) {
        type.sub_childs = await OdinoxService.getJur3Data({
          smetas: JSON.parse(JSON.stringify(smetas)),
          main_schet_id,
          from,
          to,
          region_id,
          main_schets: main_schets,
          jur3AndJur4Schets,
        });
      }

      // jur3a
      if (type.id === 11) {
        type.sub_childs = JSON.parse(JSON.stringify(smetas));
      }

      // jurnal 4
      if (type.id === 4) {
        type.sub_childs = await OdinoxService.getJur4Data({
          smetas: JSON.parse(JSON.stringify(smetas)),
          main_schet_id,
          from,
          to,
          region_id,
          main_schets: main_schets,
          jur3AndJur4Schets,
        });
      }

      // jurnal 5
      if (type.id === 5) {
        type.sub_childs = JSON.parse(JSON.stringify(smetas));
      }

      // jurnal 7
      if (type.id === 7) {
        type.sub_childs = await OdinoxService.getJur7Data({
          smetas: JSON.parse(JSON.stringify(smetas)),
          main_schet_id,
          from,
          to,
          region_id,
        });
      }

      // jurnal 8
      if (type.id === 8) {
        type.sub_childs = await OdinoxService.getJur8Data({
          smetas: JSON.parse(JSON.stringify(smetas)),
          main_schet_id,
          year,
          month,
          region_id,
        });
      }

      // jurnal 9
      if (type.id === 9) {
        type = OdinoxService.getJur9Data({
          smetas: JSON.parse(JSON.stringify(smetas)),
          types,
        });
      }

      // jurnal 10
      if (type.id === 10) {
        type = OdinoxService.getJur10Data({
          smetas: JSON.parse(JSON.stringify(smetas)),
          types,
        });
      }
    }

    for (let type of types) {
      type.prixod = 0;
      type.rasxod = 0;
      for (let child of type.sub_childs) {
        type.prixod += child.prixod;
        type.rasxod += child.rasxod;
      }
    }

    return res.success(req.i18n.t("getSuccess"), 200, null, types);
  }

  static async update(req, res) {
    const region_id = req.user.region_id;
    const { id } = req.params;
    const user_id = req.user.id;
    const { month, year } = req.body;
    const { main_schet_id } = req.query;

    await ValidatorFunctions.mainSchet({ region_id, main_schet_id });

    const old_data = await OdinoxService.getById({
      region_id,
      id,
    });

    if (!old_data) {
      return res.error(req.i18n.t("docNotFound"), 404);
    }

    if (old_data.status === 3) {
      return res.error(req.i18n.t("mainBookStatus"), 409);
    }

    if (old_data.month !== month || year !== old_data.year) {
      const check = await OdinoxService.get({
        offset: 0,
        limit: 1,
        region_id,
        main_schet_id,
        year,
        month,
      });

      if (check.total) {
        return res.error(req.i18n.t("docExists"), 409, { year, month });
      }
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
};
