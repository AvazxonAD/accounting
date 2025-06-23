const { Jur7SaldoService } = require("./service");
const { ResponsibleService } = require("@responsible/service");
const { GroupService } = require("@group/service");
const { SaldoSchema } = require("./schema");
const { HelperFunctions } = require("@helper/functions");
const { ValidatorFunctions } = require(`@helper/database.validator`);
const { CODE, SALDO_PASSWORD } = require("@helper/constants");
const { MainSchetService } = require("@main_schet/service");
const ErrorResponse = require("@helper/error.response");
const { UnitService } = require("@unit/service");

exports.Controller = class {
  static async checkFirst(req, res) {
    const region_id = req.user.region_id;
    const { main_schet_id, year, month } = req.query;

    await ValidatorFunctions.mainSchet({
      main_schet_id,
      region_id,
    });

    const first = await Jur7SaldoService.getFirstSaldoDocs({
      region_id,
      main_schet_id,
    });
    const end = await Jur7SaldoService.getEndSaldo({
      region_id,
      main_schet_id,
    });

    if (first && end) {
      if (first.year !== end.year || first.month !== end.month) {
        return res.success(req.i18n.t("getSucccess"), 200, null, false);
      }
    }

    if (first) {
      if (first.year === Number(year) && first.month === Number(month)) {
        return res.success(req.i18n.t("getSucccess"), 200, null, true);
      } else {
        return res.success(req.i18n.t("getSucccess"), 200, null, false);
      }
    } else {
      return res.success(req.i18n.t("getSucccess"), 200, null, false);
    }
  }

  static async import(req, res) {
    if (!req.file) {
      return res.error(req.i18n.t("fileError"), 400);
    }

    const user_id = req.user.id;
    const region_id = req.user.region_id;
    const { budjet_id, main_schet_id } = req.query;

    // check first saldo
    const check = await Jur7SaldoService.getFirstSaldoDocs({
      region_id,
      main_schet_id,
    });
    if (check) {
      return res.error(req.i18n.t("saldoImportAlreadyExists"), 400, {
        code: CODE.DOCS_HAVE.code,
        docs: check,
      });
    }

    // check budjet
    await ValidatorFunctions.budjet({ budjet_id });

    // check main schet
    await ValidatorFunctions.mainSchet({
      main_schet_id,
      region_id,
    });

    // read file
    const { result: data, header } = await Jur7SaldoService.readFile({
      filePath: req.file.path,
    });
    if (!data.length) {
      return res.error(req.i18n.t("emptyFile"), 400);
    }

    // validation data
    for (let item of data) {
      const real_data = JSON.parse(JSON.stringify(item));

      item.responsible_id = Number(item.responsible_id);
      item.name = String(item.name);
      item.group_jur7_id = Number(item.group_jur7_id);
      item.edin = String(item.edin);
      item.inventar_num = item.inventar_num ? String(item.inventar_num) : null;
      item.serial_num = item.serial_num ? String(item.serial_num) : null;
      item.month = Number(item.month);
      item.year = Number(item.year);
      item.kol = Number(item.kol);
      item.summa = Number(item.summa);
      item.eski_iznos_summa = Number(item.eski_iznos_summa);
      item.doc_num = item.doc_num ? String(item.doc_num) : "saldo";

      if (item.kol === 0 && item.summa === 0 && item.eski_iznos_summa === 0) {
        return res.error(req.i18n.t("saldoSummaKolIznosError"), 400, {
          code: CODE.EXCEL_IMPORT.code,
          doc: real_data,
          header,
        });
      }

      if (item.doc_date) {
        item.doc_date = Jur7SaldoService.returnDocDate({
          doc_date: item.doc_date,
        });
      } else {
        item.doc_date = null;
      }

      const regex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;

      if (item.doc_date) {
        if (!regex.test(item.doc_date)) {
          return res.error(req.i18n.t("dateError"), 400, {
            code: CODE.EXCEL_IMPORT.code,
            doc: real_data,
            header,
          });
        }
      }

      const { error } = SaldoSchema.importData(req.i18n).validate(item);
      if (error) {
        return res.error(error.details[0].message, 400, {
          code: CODE.EXCEL_IMPORT.code,
          doc: real_data,
          header,
        });
      }
    }

    // check year and month different
    const date_saldo = HelperFunctions.checkYearMonth(data);
    if (!date_saldo) {
      return res.error(req.i18n.t("differentSaldoDate"), 400);
    }

    // check responsible and group
    let index = 5;
    for (let doc of data) {
      const responsible = await ResponsibleService.getById({
        region_id,
        id: doc.responsible_id,
        budjet_id: req.query.budjet_id,
      });
      if (!responsible) {
        return res.error(`${req.i18n.t("responsibleNotFound")} ID => ${doc.responsible_id} Qator: ${index}`, 404);
      }

      const group = await GroupService.getById({ id: doc.group_jur7_id });
      if (!group) {
        return res.error(`${req.i18n.t("groupNotFound")} ID => ${doc.group_jur7_id} Qator: ${index}`, 404);
      }

      const unit = await UnitService.getByNameSearch({
        name: doc.edin?.trim(),
      });
      if (!unit) {
        const new_unit = await UnitService.create({ name: doc.edin?.trim() });
        doc.unit_id = new_unit.id;
      } else {
        doc.unit_id = unit.id;
      }

      doc.date_saldo = new Date(`${doc.year}-${doc.month}-01`);

      if (group.iznos_foiz > 0) {
        doc.iznos_start = doc.doc_date;
      } else {
        doc.iznos_start = null;
      }

      doc.doc_num = doc.doc_num ? doc.doc_num : "saldo";

      doc.iznos = group.iznos_foiz > 0 ? true : false;
      doc.iznos_foiz = group.iznos_foiz;
      doc.iznos_schet = group.schet;
      doc.iznos_sub_schet = group.provodka_subschet;
      doc.group = group;
      index++;
    }

    await Jur7SaldoService.importData({
      ...req.query,
      docs: data,
      user_id,
      region_id,
      date_saldo,
    });

    return res.success(req.i18n.t("importSuccess"), 201);
  }

  static async createByGroup(req, res) {
    const user_id = req.user.id;
    const region_id = req.user.region_id;
    const { main_schet_id, year, month, budjet_id } = req.query;
    const { data } = req.body;

    const date_saldo = HelperFunctions.checkYearMonth([{ year, month }]);

    const first = await Jur7SaldoService.getFirstSaldoDocs({
      region_id,
      main_schet_id,
    });
    const end = await Jur7SaldoService.getEndSaldo({
      region_id,
      main_schet_id,
    });

    if (first && end) {
      if (first.year !== end.year || first.month !== end.month || first.year !== year || first.month !== month) {
        return res.error(req.i18n.t("firstEndSaldoError"), 400);
      }
    }

    await ValidatorFunctions.mainSchet({
      main_schet_id,
      region_id,
    });

    await ValidatorFunctions.budjet({ budjet_id });

    for (let doc of data) {
      const responsible = await ResponsibleService.getById({
        region_id,
        id: doc.responsible_id,
        budjet_id: req.query.budjet_id,
      });
      if (!responsible) {
        return res.error(`${req.i18n.t("responsibleNotFound")} ID => ${doc.responsible_id}`, 404);
      }

      const group = await GroupService.getById({ id: doc.group_jur7_id });
      if (!group) {
        return res.error(`${req.i18n.t("groupNotFound")} ID => ${doc.group_jur7_id}`, 404);
      }

      doc.date_saldo = new Date(`${doc.year}-${doc.month}-01`);

      if (doc.iznos_start && group.iznos_foiz > 0) {
        const dates = doc.iznos_start.split(".");
        doc.iznos_start = new Date(`${dates[2]}-${dates[1]}-${dates[0]}`);
      } else {
        doc.iznos_start = new Date();
      }

      doc.doc_num = doc.doc_num ? doc.doc_num : "saldo";

      doc.doc_date = doc.doc_date ? doc.doc_date : new Date();

      doc.iznos = group.iznos_foiz > 0 ? true : false;
      doc.iznos_foiz = group.iznos_foiz;
      doc.iznos_schet = group.schet;
      doc.iznos_sub_schet = group.provodka_subschet;
      doc.group = group;

      const unit = await UnitService.getById({ id: doc.unit_id });
      if (!unit) {
        throw new ErrorResponse("unitNotFound", 404);
      }

      if (doc.kol === 0 && doc.summa === 0 && doc.eski_iznos_summa === 0) {
        return res.error(req.i18n.t("saldoSummaKolIznosError"), 400);
      }
    }

    await Jur7SaldoService.importData({
      ...req.query,
      docs: data,
      user_id,
      region_id,
      date_saldo,
    });

    return res.success(req.i18n.t("createSuccess"), 201);
  }

  static async getByProduct(req, res) {
    const region_id = req.user.region_id;
    const { page, product_id, limit, group_id, budjet_id, main_schet_id } = req.query;

    let { kimning_buynida, responsible_id } = req.query;
    if (!responsible_id && kimning_buynida) {
      responsible_id = kimning_buynida;
    }

    await ValidatorFunctions.budjet({ budjet_id });

    await ValidatorFunctions.mainSchet({
      main_schet_id,
      region_id,
    });

    const offset = (page - 1) * limit;

    if (responsible_id) {
      await ValidatorFunctions.responsibleJur7({
        region_id,
        responsible_id,
        budjet_id: req.query.budjet_id,
      });
    }

    if (group_id) {
      await ValidatorFunctions.groupJur7({ group_id });
    }

    if (product_id) {
      await ValidatorFunctions.productJur7({
        region_id,
        product_id,
      });
    }

    const {
      data,
      total,
      from_summa,
      from_kol,
      internal_rasxod_summa,
      internal_rasxod_kol,
      internal_prixod_summa,
      internal_prixod_kol,
      to_summa,
      to_iznos_summa,
      to_kol,
      page_from_summa,
      page_from_kol,
      page_internal_rasxod_summa,
      page_internal_rasxod_kol,
      page_internal_prixod_summa,
      page_internal_prixod_kol,
      page_to_summa,
      page_to_iznos_summa,
      page_to_kol,
    } = await Jur7SaldoService.getByProduct({
      ...req.query,
      responsible_id,
      region_id,
      offset,
    });

    const end_saldo = await Jur7SaldoService.getEndSaldo({
      region_id,
      main_schet_id,
    });

    for (let saldo of data) {
      if (saldo.year === end_saldo.year && saldo.month === end_saldo.month && (saldo.type === "import" || saldo.type === "saldo")) {
        saldo.isdeleted = true;
      }
    }

    const pageCount = Math.ceil(total / limit);

    const meta = {
      pageCount: pageCount,
      count: total,
      currentPage: page,
      limit,
      nextPage: page >= pageCount ? null : page + 1,
      backPage: page === 1 ? null : page - 1,
      from_summa: Math.round(from_summa * 100) / 100,
      from_kol: Math.round(from_kol * 100) / 100,
      internal_rasxod_summa,
      internal_rasxod_kol,
      internal_prixod_summa,
      internal_prixod_kol,
      to_summa: Math.round(to_summa * 100) / 100,
      to_iznos_summa,
      to_kol: Math.round(to_kol * 100) / 100,
      page_from_summa,
      page_from_kol,
      page_internal_rasxod_summa,
      page_internal_rasxod_kol,
      page_internal_prixod_summa,
      page_internal_prixod_kol,
      page_to_summa,
      page_to_iznos_summa,
      page_to_kol,
    };

    return res.success(req.i18n.t("getSuccess"), 200, meta, data);
  }

  static async delete(req, res) {
    const { year, month } = req.body;
    const { budjet_id, main_schet_id } = req.query;
    const region_id = req.user.region_id;

    await ValidatorFunctions.budjet({ budjet_id });

    await ValidatorFunctions.mainSchet({
      region_id,
      main_schet_id,
    });

    const end_saldo = await Jur7SaldoService.getEndSaldo({
      region_id,
      main_schet_id,
    });

    if (!end_saldo) {
      throw new ErrorResponse("saldoNotFound", 400);
    }

    if (year !== end_saldo.year || month !== end_saldo.month) {
      throw new ErrorResponse("deleteSaldoError", 400);
    }

    const check_doc = await Jur7SaldoService.checkDoc({
      ...req.query,
      ...req.body,
      region_id,
    });

    if (check_doc.length) {
      throw new ErrorResponse("prixodCreateSaldo", 400);
    }

    await Jur7SaldoService.delete({
      ...req.query,
      ...req.body,
      region_id,
    });

    return res.success(req.i18n.t("deleteSuccess"), 200);
  }

  static async cleanData(req, res) {
    const { main_schet_id, password } = req.query;
    const region_id = req.user.region_id;

    if (password !== SALDO_PASSWORD) {
      return res.error(req.i18n.t("validationError"), 400);
    }

    await ValidatorFunctions.mainSchet({
      region_id,
      main_schet_id,
    });

    await Jur7SaldoService.cleanData({ main_schet_id, region_id });

    return res.success(req.i18n.t("deleteSuccess"), 200);
  }

  static async deleteById(req, res) {
    const { id } = req.params;
    const region_id = req.user.region_id;
    const { main_schet_id, year, month } = req.query;

    const main_schet = await MainSchetService.getById({
      region_id,
      id: main_schet_id,
    });
    if (!main_schet) {
      return res.error(req.i18n.t("mainSchetNotFound"), 400);
    }

    const first = await Jur7SaldoService.getFirstSaldoDocs({
      region_id,
      main_schet_id,
    });

    if (!first) {
      throw new ErrorResponse("saldoNotFound", 400);
    }

    if (year !== first.year || month !== first.month) {
      throw new ErrorResponse("firstSaldoError", 400);
    }

    const end = await Jur7SaldoService.getEndSaldo({
      region_id,
      main_schet_id,
    });

    if (end.year !== first.year || end.month !== first.month) {
      throw new ErrorResponse("firstSaldoError", 400);
    }

    const checkById = await Jur7SaldoService.getById({
      id,
      region_id,
      main_schet_id,
    });
    if (!checkById) {
      return res.error(req.i18n.t("saldoNotFound"), 404);
    }

    if (checkById.type === "prixod") {
      return res.error(req.i18n.t("saldoRasxodError"), 400, {
        code: CODE.DOCS_HAVE.code,
        saldo_id: id,
      });
    }

    const response = await Jur7SaldoService.deleteById({ id });

    return res.success(req.i18n.t("deleteSuccess"), 200, null, response);
  }

  static async templateFile(req, res) {
    const { fileName, fileRes } = await HelperFunctions.returnTemplateFile("saldo.xlsx");

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

    return res.send(fileRes);
  }

  static async get(req, res) {
    const region_id = req.user.region_id;
    const { kimning_buynida, page, limit, group_id } = req.query;

    const offset = (page - 1) * limit;

    if (kimning_buynida) {
      const responsible = await ResponsibleService.getById({
        region_id,
        id: kimning_buynida,
        budjet_id: req.query.budjet_id,
      });
      if (!responsible) {
        return res.error(req.i18n.t("responsibleNotFound"), 404);
      }
    }

    let { data: groups, total } = await GroupService.get({
      offset: 0,
      limit: 99999999,
    });

    if (group_id) {
      groups = groups.filter((item) => item.id === group_id);
      total = 1;
    }

    groups = await Jur7SaldoService.getByGroup({
      ...req.query,
      responsible_id: kimning_buynida,
      region_id,
      groups,
      offset,
    });

    groups = groups.filter((item) => item.products.length > 0);

    groups.sort((a, b) => b.products.length - a.products.length);

    const pageCount = Math.ceil(total / limit);

    const meta = {
      pageCount: pageCount,
      count: total,
      currentPage: page,
      nextPage: page >= pageCount ? null : page + 1,
      backPage: page === 1 ? null : page - 1,
    };

    return res.success(req.i18n.t("getSuccess"), 200, meta, groups);
  }

  static async create(req, res) {
    const region_id = req.user.region_id;
    const user_id = req.user.id;
    const { budjet_id, main_schet_id } = req.query;

    let year = JSON.parse(JSON.stringify(req.body.year));
    let month = JSON.parse(JSON.stringify(req.body.month));

    await ValidatorFunctions.budjet({ budjet_id });

    await ValidatorFunctions.mainSchet({ region_id, main_schet_id });

    const last_date = HelperFunctions.lastDate({ year, month });

    const last_saldo = await Jur7SaldoService.getSaldoCheck({
      region_id,
      main_schet_id,
      year: last_date.year,
      month: last_date.month,
    });

    if (!last_saldo.length) {
      throw new ErrorResponse("lastSaldoNotFound", 400);
    }

    const dates = await Jur7SaldoService.create({
      ...req.body,
      ...req.query,
      region_id,
      user_id,
      last_saldo,
      last_date,
    });

    return res.success(req.i18n.t("createSuccess"), 200, {
      code: dates.length ? CODE.SALDO_CREATE.code : CODE.OK.code,
      dates,
    });
  }

  static async check(req, res) {
    const region_id = req.user.region_id;

    const { meta, result: response } = await Jur7SaldoService.check({
      region_id,
      ...req.query,
    });

    if (!response.length) {
      throw new ErrorResponse("saldoNotFound", 404);
    }

    return res.success(req.i18n.t("getSuccess"), 200, meta, response);
  }

  static async getById(req, res) {
    const { id } = req.params;
    const region_id = req.user.region_id;
    const { main_schet_id } = req.query;

    const main_schet = await MainSchetService.getById({
      region_id,
      id: main_schet_id,
    });
    if (!main_schet) {
      return res.error(req.i18n.t("mainSchetNotFound"), 400);
    }

    const response = await Jur7SaldoService.getById({
      ...req.query,
      region_id,
      id,
      isdeleted: true,
    });

    return res.success(req.i18n.t("getSuccess"), 200, null, response);
  }

  static async updateIznosSumma(req, res) {
    const { id } = req.params;
    const region_id = req.user.region_id;

    const { iznos_summa } = req.body;

    const check = await Jur7SaldoService.getById({
      id,
      region_id,
      iznos: true,
    });
    if (!check) {
      return res.error(req.i18n.t("saldoNotFound"), 404);
    }

    const response = await Jur7SaldoService.updateIznosSumma({
      id,
      iznos_summa,
      doc: check,
    });

    return res.success(req.i18n.t("updateSuccess"), 200, null, response);
  }
};
