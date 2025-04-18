const { BudjetService } = require("@budjet/service");
const { MainBookService } = require("./service");
const { HelperFunctions } = require(`@helper/functions`);
const { ReportTitleService } = require(`@report_title/service`);
const { SALDO_PASSWORD } = require(`@helper/constants`);
const { ValidatorFunctions } = require(`@helper/database.validator`);

exports.Controller = class {
  static async getDocs(req, res) {
    const { type_id, prixod, rasxod } = req.query;
    const region_id = req.user.region_id;
    let docs = [];

    if (prixod === "true" && rasxod === "true") {
      return res.error(req.i18n.t("validationError"), 400);
    }

    if (type_id === 1) {
      // jur1
      if (prixod === "true") {
        docs = await MainBookService.getJur1PrixodDocs({
          ...req.query,
          region_id,
        });
      } else if (rasxod === "true") {
        docs = await MainBookService.getJur1RasxodDocs({
          ...req.query,
          region_id,
        });
      }
    }

    // jur2
    if (type_id === 2) {
      if (prixod === "true") {
        docs = await MainBookService.getJur2PrixodDocs({
          ...req.query,
          region_id,
        });
      } else if (rasxod === "true") {
        docs = await MainBookService.getJur2RasxodDocs({
          ...req.query,
          region_id,
        });
      }
    }

    // jur3
    if (type_id === 3) {
      if (prixod === "true") {
        docs = await MainBookService.getJur1PrixodDocs({
          ...req.query,
          region_id,
        });
      } else if (rasxod === "true") {
        docs = await MainBookService.getJur1RasxodDocs({
          ...req.query,
          region_id,
        });
      }
    }

    // jur4
    if (type_id === 4) {
      if (prixod === "true") {
        docs = await MainBookService.getJur1PrixodDocs({
          ...req.query,
          region_id,
        });
      } else if (rasxod === "true") {
        docs = await MainBookService.getJur1RasxodDocs({
          ...req.query,
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
        docs = await MainBookService.getJur1PrixodDocs({
          ...req.query,
          region_id,
        });
      } else if (rasxod === "true") {
        docs = await MainBookService.getJur1RasxodDocs({
          ...req.query,
          region_id,
        });
      }
    }

    // jur8
    if (type_id === 8) {
      if (prixod === "true") {
        docs = await MainBookService.getJur1PrixodDocs({
          ...req.query,
          region_id,
        });
      } else if (rasxod === "true") {
        docs = await MainBookService.getJur1RasxodDocs({
          ...req.query,
          region_id,
        });
      }
    }

    return res.success(req.i18n.t("getSuccess"), 200, null, docs);
  }

  static async cleanData(req, res) {
    const region_id = req.user.region_id;
    const { main_schet_id, password } = req.query;

    await ValidatorFunctions.mainSchet({ region_id, main_schet_id });

    if (password !== SALDO_PASSWORD) {
      return res.error(req.i18n.t("validationError"), 400);
    }

    const { data } = await MainBookService.get({
      region_id,
      offset: 0,
      limit: 999999999,
      main_schet_id,
    });

    await MainBookService.cleanData({ data });

    return res.success(req.i18n.t("cleanSuccess"), 200);
  }

  static async getCheckFirst(req, res) {
    const region_id = req.user.region_id;
    const { main_schet_id } = req.query;

    await ValidatorFunctions.mainSchet({ region_id, main_schet_id });

    const result = await MainBookService.getCheckFirst({
      main_schet_id,
      region_id,
    });

    if (!result) {
      return res.error(req.i18n.t("docNotFound"), 404);
    }

    return res.success(req.i18n.t("getSuccess"), 200, null, result);
  }

  static async getUniqueSchets(req, res) {
    const { main_schet_id } = req.query;
    const region_id = req.user.region_id;

    await ValidatorFunctions.mainSchet({ region_id, main_schet_id });

    const result = await MainBookService.getUniqueSchets({
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

    const data = await MainBookService.getById({
      region_id,
      id,
    });

    if (!data) {
      return res.error(req.i18n.t("docNotFound"), 404);
    }

    const first = await MainBookService.getCheckFirst({
      main_schet_id,
      region_id,
    });

    if (first?.id === id) {
      return res.error(req.i18n.t("validationError"), 400);
    }

    if (data.status === 3) {
      return res.error(req.i18n.t("mainBookStatus"), 409);
    }

    const check = await MainBookService.checkLarge({
      region_id,
      year: data.year,
      month: data.month,
      main_schet_id,
    });

    if (check.length) {
      return res.error(req.i18n.t(`conflictError`), 400);
    }

    await MainBookService.delete({ id });

    return res.success(req.i18n.t("deleteSuccess"), 200);
  }

  static async getMainBookType(req, res) {
    const result = await MainBookService.getMainBookType();

    return res.success(req.i18n.t("getSuccess"), 200, null, result);
  }

  static async create(req, res) {
    const user_id = req.user.id;
    const region_id = req.user.region_id;
    const { main_schet_id } = req.query;
    const { year, month } = req.body;

    await ValidatorFunctions.mainSchet({ region_id, main_schet_id });

    const check = await MainBookService.get({
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

    const result = await MainBookService.create({
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

    const first = await MainBookService.getCheckFirst({
      main_schet_id,
      region_id,
    });

    const { data, total } = await MainBookService.get({
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

    const data = await MainBookService.getById({
      region_id,
      id,
      isdeleted: true,
    });

    if (!data) {
      return res.error(req.i18n.t("docNotFound"), 404);
    }

    await ValidatorFunctions.mainSchet({ region_id, main_schet_id });

    const first = await MainBookService.getCheckFirst({
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

      const { file_path, file_name } = await MainBookService.getByIdExcel({
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

    const last_date = HelperFunctions.lastDate({ year, month });

    const last_saldo = await MainBookService.getByMonth({
      region_id,
      main_schet_id,
      year: last_date.year,
      month: last_date.month,
    });

    if (!last_saldo) {
      return res.error(req.i18n.t("lastSaldoNotFound"), 400);
    }

    await ValidatorFunctions.mainSchet({ region_id, main_schet_id });

    const { schets, main_schets } = await MainBookService.getUniqueSchets({
      ...req.query,
      region_id,
    });

    const types = await MainBookService.getMainBookType({});

    const jur3AndJur4Schets = await MainBookService.getJurSchets({
      main_schet_id,
    });

    const date = HelperFunctions.getMonthStartEnd({ year, month });

    const from = `${date[0].getFullYear()}-${String(date[0].getMonth() + 1).padStart(2, "0")}-${String(date[0].getDate()).padStart(2, "0")}`;
    const to = `${date[1].getFullYear()}-${String(date[1].getMonth() + 1).padStart(2, "0")}-${String(date[1].getDate()).padStart(2, "0")}`;

    for (let type of types) {
      //from
      if (type.id === 0) {
        type = MainBookService.getJur0Data({
          schets: JSON.parse(JSON.stringify(schets)),
          types,
          last_saldo,
        });
      }

      // jurnal 1
      if (type.id === 1) {
        type.sub_childs = await MainBookService.getJur1Data({
          schets: JSON.parse(JSON.stringify(schets)),
          main_schet_id,
          from,
          to,
          region_id,
          main_schets: main_schets,
        });
      }

      // jurnal 2
      if (type.id === 2) {
        type.sub_childs = await MainBookService.getJur2Data({
          schets: JSON.parse(JSON.stringify(schets)),
          main_schet_id,
          from,
          to,
          region_id,
          main_schets: main_schets,
        });
      }

      // jurnal 3
      if (type.id === 3) {
        type.sub_childs = await MainBookService.getJur3Data({
          schets: JSON.parse(JSON.stringify(schets)),
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
        type.sub_childs = JSON.parse(JSON.stringify(schets));
      }

      // jurnal 4
      if (type.id === 4) {
        type.sub_childs = await MainBookService.getJur4Data({
          schets: JSON.parse(JSON.stringify(schets)),
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
        type.sub_childs = JSON.parse(JSON.stringify(schets));
      }

      // jurnal 7
      if (type.id === 7) {
        type.sub_childs = await MainBookService.getJur7Data({
          schets: JSON.parse(JSON.stringify(schets)),
          main_schet_id,
          from,
          to,
          region_id,
        });
      }

      // jurnal 8
      if (type.id === 8) {
        type.sub_childs = await MainBookService.getJur8Data({
          schets: JSON.parse(JSON.stringify(schets)),
          main_schet_id,
          year,
          month,
          region_id,
        });
      }

      // jurnal 9
      if (type.id === 9) {
        type = MainBookService.getJur9Data({
          schets: JSON.parse(JSON.stringify(schets)),
          types,
        });
      }

      // jurnal 10
      if (type.id === 10) {
        type = MainBookService.getJur10Data({
          schets: JSON.parse(JSON.stringify(schets)),
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

    const old_data = await MainBookService.getById({
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
      const check = await MainBookService.get({
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

    const { dates, doc } = await MainBookService.update({
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
