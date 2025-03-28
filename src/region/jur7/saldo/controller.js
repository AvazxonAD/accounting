const { SaldoService } = require("./service");
const { ResponsibleService } = require("@responsible/service");
const { BudjetService } = require("@budjet/service");
const { MainSchetService } = require("@main_schet/service");
const { GroupService } = require("@group/service");
const { SaldoSchema } = require("./schema");
const { HelperFunctions } = require("@helper/functions");
const { CODE } = require("@helper/constants");
const { ProductService } = require("@product/service");
const { RegionService } = require("@region/service");

exports.Controller = class {
  static async reportByResponsible(req, res) {
    const region_id = req.user.region_id;
    const { responsible_id, iznos, to, group_id, excel } = req.query;

    const region = await RegionService.getById({ id: region_id });
    if (responsible_id) {
      const responsible = await ResponsibleService.getById({
        region_id,
        id: responsible_id,
      });
      if (!responsible) {
        return res.error(req.i18n.t("responsibleNotFound"), 404);
      }
    }

    const { data: products } = await SaldoService.getByProduct({
      region_id,
      to,
      offset: 0,
      limit: 999999,
      iznos,
      group_id,
      responsible_id,
    });

    const groupedProducts = products.reduce((acc, book) => {
      const { debet_schet, debet_sub_schet, fio, ...saldoInfo } = book;
      const key = `${debet_schet}_${debet_sub_schet}_${fio}`;

      if (!acc[key]) {
        acc[key] = {
          debet_schet,
          debet_sub_schet,
          fio,
          products: [],
        };
      }

      acc[key].products.push(saldoInfo);

      return acc;
    }, {});

    const result = Object.values(groupedProducts);

    if (excel === "true") {
      const { file_name, file_path } =
        await SaldoService.reportByResponsibleExcel({
          region,
          to,
          products: result,
          iznos,
        });

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${file_name}"`
      );
      return res.download(file_path);
    }

    return res.success(req.i18n.t("getSuccess"), 200, null, result);
  }

  static async getByProduct(req, res) {
    const region_id = req.user.region_id;
    const {
      responsible_id,
      page,
      search,
      product_id,
      limit,
      group_id,
      to,
      iznos,
      rasxod,
      budjet_id,
    } = req.query;

    const budjet = await MainSchetService.getById({ id: budjet_id });
    if (!budjet) {
      return res.error(req.i18n.t("budjetNotFound"), 404);
    }

    const offset = (page - 1) * limit;

    if (responsible_id) {
      const responsible = await ResponsibleService.getById({
        region_id,
        id: responsible_id,
      });
      if (!responsible) {
        return res.error(req.i18n.t("responsibleNotFound"), 404);
      }
    }

    if (group_id) {
      const check = await GroupService.getById({ id: group_id });
      if (!check) {
        return res.error(req.i18n.t("groupNotFound"), 404);
      }
    }

    if (product_id) {
      const check = await ProductService.getById({ region_id, id: product_id });
      if (!check) {
        return res.error(req.i18n.t("productNotFound"), 404);
      }
    }

    const { data, total } = await SaldoService.getByProduct({
      region_id,
      to,
      offset,
      limit,
      iznos,
      group_id,
      responsible_id,
      search,
      product_id,
      rasxod,
      budjet_id,
    });

    const pageCount = Math.ceil(total / limit);

    const meta = {
      pageCount: pageCount,
      count: total,
      currentPage: page,
      limit,
      nextPage: page >= pageCount ? null : page + 1,
      backPage: page === 1 ? null : page - 1,
    };

    return res.success(req.i18n.t("getSuccess"), 200, meta, data);
  }

  static async delete(req, res) {
    const { ids, year, month } = req.body;
    const region_id = req.user.region_id;

    for (let id of ids) {
      const check = await SaldoService.getById({ id: id.id, region_id });
      if (!check) {
        return res.error(req.i18n.t("saldoNotFound"), 404);
      }

      const check_doc = await SaldoService.checkDoc({
        product_id: check.naimenovanie_tovarov_jur7_id,
      });

      if (check_doc.length) {
        return res.error(req.i18n.t("saldoRasxodError"), 400, {
          code: CODE.DOCS_HAVE.code,
          docs: check_doc,
          saldo_id: id,
        });
      }
    }

    const dates = await SaldoService.delete({ ids, region_id, year, month });

    return res.success(req.i18n.t("deleteSuccess"), 200, dates);
  }

  static async deleteById(req, res) {
    const { id } = req.params;
    const region_id = req.user.region_id;

    const check = await SaldoService.getById({ id, region_id });
    if (!check) {
      return res.error(req.i18n.t("saldoNotFound"), 404);
    }

    const check_doc = await SaldoService.checkDoc({
      product_id: check.naimenovanie_tovarov_jur7_id,
    });
    if (check_doc.length) {
      return res.error(req.i18n.t("saldoRasxodError"), 400, check_doc);
    }

    const response = await SaldoService.deleteById({ id });

    return res.success(req.i18n.t("deleteSuccess"), 200, null, response);
  }

  static async updateIznosSumma(req, res) {
    const { id } = req.params;
    const region_id = req.user.region_id;

    const { iznos_summa } = req.body;

    const check = await SaldoService.getById({ id, region_id, iznos: true });
    if (!check) {
      return res.error(req.i18n.t("saldoNotFound"), 404);
    }

    const response = await SaldoService.updateIznosSumma({
      id,
      iznos_summa,
      doc: check,
    });

    return res.success(req.i18n.t("updateSuccess"), 200, null, response);
  }

  static async templateFile(req, res) {
    const { fileName, fileRes } =
      await HelperFunctions.returnTemplateFile("saldo.xlsx");

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
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
      });
      if (!responsible) {
        return res.error(req.i18n.t("responsibleNotFound"), 404);
      }
    }

    let { data: groups, total } = await GroupService.get({
      offset: 0,
      limit: 99999,
    });

    if (group_id) {
      groups = groups.filter((item) => item.id === group_id);
      total = 1;
    }

    groups = await SaldoService.getByGroup({
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

  static async import(req, res) {
    if (!req.file) {
      return res.error(req.i18n.t("fileError"), 400);
    }

    const user_id = req.user.id;
    const region_id = req.user.region_id;
    const { budjet_id } = req.query;

    const check = await SaldoService.getFirstSaldoDocs({ region_id });
    if (check) {
      return res.error(req.i18n.t("saldoImportAlreadyExists"), 400, {
        code: CODE.DOCS_HAVE.code,
        docs: check,
      });
    }

    const budjet = await MainSchetService.getById({ id: budjet_id });
    if (!budjet) {
      return res.error(req.i18n.t("budjetNotFound"), 404);
    }

    const { result: data, header } = await SaldoService.readFile({
      filePath: req.file.path,
    });

    if (!data.length) {
      return res.error(req.i18n.t("emptyFile"), 400);
    }

    for (let item of data) {
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
      item.doc_num = String(item.doc_num);

      if (item.doc_date) {
        const dates = String(item.doc_date).split("");
        const checkSlesh = dates.find((item) => item === "/");
        const checkDotNet = dates.find((item) => item === ".");
        if (checkDotNet) {
          const dates = String(item.doc_date).split(".");
          item.doc_date = `${dates[2]}-${dates[1]}-${dates[0]}`;
        } else if (checkSlesh) {
          const dates = String(item.doc_date).split("/");
          item.doc_date = `${dates[2]}-${dates[1]}-${dates[0]}`;
        } else {
          function excelSerialToDate(serial) {
            const utc_days = Math.floor(serial - 25569);
            const utc_value = utc_days * 86400;
            return new Date(utc_value * 1000);
          }

          item.doc_date = excelSerialToDate(item.doc_date);
        }
      } else {
        item.doc_date = new Date();
      }

      const { error, value } = SaldoSchema.importData(req.i18n).validate(item);
      if (error) {
        return res.error(error.details[0].message, 400, {
          code: CODE.EXCEL_IMPORT.code,
          doc: item,
          header,
        });
      }
    }

    const date_saldo = HelperFunctions.checkYearMonth(data);
    if (!date_saldo) {
      return res.error(req.i18n.t("differentSaldoDate"), 400);
    }

    for (let doc of data) {
      const responsible = await ResponsibleService.getById({
        region_id,
        id: doc.responsible_id,
      });
      if (!responsible) {
        return res.error(
          `${req.i18n.t("responsibleNotFound")} ID => ${doc.responsible_id}`,
          404
        );
      }

      const group = await GroupService.getById({ id: doc.group_jur7_id });
      if (!group) {
        return res.error(
          `${req.i18n.t("groupNotFound")} ID => ${doc.group_jur7_id}`,
          404
        );
      }

      doc.date_saldo = new Date(`${doc.year}-${doc.month}-01`);

      if (doc.iznos_start) {
        const dates = doc.iznos_start.split(".");
        doc.iznos_start = new Date(`${dates[2]}-${dates[1]}-${dates[0]}`);
      } else {
        doc.iznos_start = new Date();
      }

      doc.doc_num = doc.doc_num ? doc.doc_num : "saldo";

      doc.iznos = group.iznos_foiz > 0 ? true : false;
      doc.iznos_foiz = group.iznos_foiz;
      doc.iznos_schet = group.schet;
      doc.iznos_sub_schet = group.provodka_subschet;
      doc.group = group;

      // if (!doc.iznos && doc.eski_iznos_summa > 0) {
      //   return res.error(
      //     `${req.i18n.t("IznosSummaError")} ${doc.eski_iznos_summa}`,
      //     400,
      //     doc
      //   );
      // }
    }

    await SaldoService.importData({
      docs: data,
      budjet_id,
      budjet_id,
      user_id,
      region_id,
      date_saldo,
    });

    return res.success(req.i18n.t("importSuccess"), 201);
  }

  static async create(req, res) {
    const region_id = req.user.region_id;
    const user_id = req.user.id;
    const { budjet_id } = req.query;
    let { year, month } = JSON.parse(JSON.stringify(req.body));

    const budjet = await MainSchetService.getById({ id: budjet_id });
    if (!budjet) {
      return res.error(req.i18n.t("budjetNotFound"), 404);
    }

    let last_saldo;
    let last_date;
    let last_attempt = 0;

    while (last_attempt < 1000) {
      last_date = HelperFunctions.lastDate({ year, month });

      last_saldo = await SaldoService.getSaldoCheck({
        region_id,
        year: last_date.year,
        month: last_date.month,
      });

      if (last_saldo.length > 0) {
        break;
      }

      year = last_date.year;
      month = last_date.month;

      last_attempt++;
    }

    if (!last_saldo.length) {
      const check = await SaldoService.check({
        region_id,
        month: req.body.month,
        year: req.body.year,
      });

      if (check.result.length) {
        await SaldoService.deleteByYearMonth({
          region_id,
          month: req.body.month,
          year: req.body.year,
          type: "saldo",
        });

        await SaldoService.unblock({
          region_id,
          month: req.body.month,
          year: req.body.year,
        });

        return res.success(req.i18n.t("createSuccess"), 200);
      }

      return res.success(req.i18n.t("lastSaldoNotFound"), 400);
    }

    const dates = await SaldoService.create({
      region_id,
      user_id,
      ...req.body,
      last_saldo,
      last_date,
      budjet_id,
      budjet_id,
    });

    return res.success(req.i18n.t("createSuccess"), 200, {
      code: dates.length ? CODE.SALDO_CREATE.code : CODE.OK.code,
      dates,
    });
  }

  static async check(req, res) {
    const region_id = req.user.region_id;

    const { meta, result: response } = await SaldoService.check({
      region_id,
      ...req.query,
    });

    return res.success(req.i18n.t("getSuccess"), 200, meta, response);
  }

  static async getById(req, res) {
    const { id } = req.params;
    const region_id = req.user.region_id;

    const response = await SaldoService.getById({
      region_id,
      id,
      isdeleted: true,
    });

    return res.success(req.i18n.t("getSuccess"), 200, null, response);
  }
};
