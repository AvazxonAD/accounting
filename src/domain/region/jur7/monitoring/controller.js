const { ResponsibleService } = require("@responsible/service");
const { RegionService } = require("@region/service");
const { BudjetService } = require("@budjet/service");
const { Jur7MonitoringService } = require("./service");
const { HelperFunctions } = require("@helper/functions");
const { ReportTitleService } = require("@report_title/service");
const { PodpisService } = require("@podpis/service");
const { ValidatorFunctions } = require("@helper/database.validator");
const { Jur7SaldoService } = require("@jur7_saldo/service");
const { LIMIT } = require("../../../../helper/constants");

exports.Controller = class {
  static async reportBySchets(req, res) {
    const { main_schet_id, month, excel, is_year } = req.query;
    const { region_id } = req.user;
    let months;

    if (is_year === "true") {
      months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    } else {
      months = [month];
    }
    const { from, to } = HelperFunctions.getFromTo(req.query);

    await ValidatorFunctions.mainSchet({ region_id, main_schet_id });

    const { schets, itogo } = await Jur7MonitoringService.reportBySchets({
      region_id,
      from,
      months,
      to,
      ...req.query,
    });

    if (excel === "true") {
      const region = await RegionService.getById({ id: region_id });

      const { fileName, filePath } = await Jur7MonitoringService.reportBySchetExcel({
        schets,
        region,
        itogo,
        ...req.query,
        to,
      });

      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

      return res.sendFile(filePath);
    }

    return res.success(req.i18n.t(`getSuccess`), 200, { itogo }, schets);
  }

  static async monitoring(req, res) {
    const { main_schet_id, page, limit } = req.query;
    const region_id = req.user.region_id;

    const offset = (page - 1) * limit;

    await ValidatorFunctions.mainSchet({ region_id, main_schet_id });

    const { total, data, prixod_sum, rasxod_sum, page_prixod_sum, page_rasxod_sum } =
      await Jur7MonitoringService.monitoring({
        ...req.query,
        region_id,
        offset,
      });

    const { from_summa, to_summa } = await Jur7SaldoService.getByProduct({
      ...req.query,
      region_id,
      offset,
    });

    const pageCount = Math.ceil(total / limit);
    const meta = {
      pageCount: pageCount,
      count: total,
      prixod_sum,
      rasxod_sum,
      page_prixod_sum,
      page_rasxod_sum,
      currentPage: page,
      nextPage: page >= pageCount ? null : page + 1,
      backPage: page === 1 ? null : page - 1,
      from_summa,
      to_summa,
    };

    return res.success(req.i18n.t("getSuccess"), 200, meta, data);
  }

  static async getSaldoDate(req, res) {
    const region_id = req.user.region_id;
    const { main_schet_id, year } = req.query;

    await ValidatorFunctions.mainSchet({ region_id, main_schet_id });

    const result = await Jur7MonitoringService.getSaldoDate({
      region_id,
      year,
      ...req.query,
    });

    return res.success(req.i18n.t("getSuccess"), 200, null, result);
  }

  static async materialReport(req, res) {
    const { month, main_schet_id, year, excel, iznos, responsible_id, to } = req.query;
    const region_id = req.user.region_id;

    await ValidatorFunctions.mainSchet({ region_id, main_schet_id });

    if (responsible_id) {
      const responsible = await ResponsibleService.getById({
        region_id,
        id: responsible_id,
      });
      if (!responsible) {
        return res.error(req.i18n.t("responsibleNotFound"), 404);
      }
    }

    const region = await RegionService.getById({ id: region_id });

    const data = await Jur7MonitoringService.getMaterial({
      ...req.query,
      region_id,
    });

    const resultMap = {};

    data.forEach((product) => {
      const responsibleId = product.kimning_buynida;
      const schet = product.schet;

      if (!resultMap[responsibleId]) {
        resultMap[responsibleId] = {
          responsible_id: responsibleId,
          fio: product.fio,
          products: [],
        };
      }

      const responsibleObj = resultMap[responsibleId];

      const checkProd = responsibleObj.products.find((item) => item.schet === schet);

      if (!checkProd) {
        responsibleObj.products.push({
          schet,
          products: [{ ...product }],
        });
      } else {
        checkProd.products.push(product);
      }
    });

    const result = Object.values(resultMap);

    const from = HelperFunctions.returnDate({ year, month });

    const history = await Jur7MonitoringService.history({
      year,
      region_id,
      main_schet_id,
      month,
      from,
      to,
      responsible_id,
    });

    const itogo = {
      from_kol: 0,
      from_summa: 0,
      from_iznos_summa: 0,
      prixod_iznos_summa: 0,
      rasxod_iznos_summa: 0,
      prixod_kol: 0,
      prixod_summa: 0,
      rasxod_kol: 0,
      rasxod_summa: 0,
      to_iznos_summa: 0,
      to_kol: 0,
      to_summa: 0,
      month_iznos: 0,
    };

    if (iznos === "true") {
      result.forEach((item) => {
        for (let schet of item.products) {
          schet.products = schet.products.filter((item) => item.iznos === true);
        }
      });
    }

    for (let responsible of result) {
      for (let schet of responsible.products) {
        schet.itogo = {
          from_kol: 0,
          from_summa: 0,
          from_iznos_summa: 0,
          prixod_iznos_summa: 0,
          rasxod_iznos_summa: 0,
          prixod_kol: 0,
          prixod_summa: 0,
          rasxod_kol: 0,
          rasxod_summa: 0,
          to_iznos_summa: 0,
          to_kol: 0,
          to_summa: 0,
          month_iznos: 0,
        };

        for (let product of schet.products) {
          product.internal = {
            kol: 0,
            summa: 0,
            iznos_summa: 0,
            sena: 0,
            prixod_kol: 0,
            rasxod_kol: 0,
            prixod_summa: 0,
            rasxod_summa: 0,
            prixod_iznos_summa: 0,
            rasxod_iznos_summa: 0,
          };

          const productData = history.filter(
            (item) => item.responsible_id == responsible.responsible_id && item.product_id == product.product_id
          );

          if (productData.length > 0) {
            productData.forEach((item) => {
              if (item.type === "prixod" || item.type === "prixod_internal") {
                product.internal.prixod_kol += item.kol;
                product.internal.prixod_summa += item.summa;
                product.internal.prixod_iznos_summa += item.iznos_summa;
              } else {
                product.internal.rasxod_kol += item.kol;
                product.internal.rasxod_summa += item.summa;
                product.internal.rasxod_iznos_summa += item.iznos_summa;
              }
            });
            product.internal.kol = product.internal.prixod_kol - product.internal.rasxod_kol;
            product.internal.summa = product.internal.prixod_summa - product.internal.rasxod_summa;
            product.internal.iznos_summa = product.internal.prixod_iznos_summa - product.internal.rasxod_iznos_summa;
          }

          product.to = {
            kol: product.from.kol + product.internal.kol,
            summa: product.from.summa + product.internal.summa,
            iznos_summa: product.from.iznos_summa + product.internal.iznos_summa,
          };

          if (product.to.kol !== 0) {
            product.to.sena = product.to.summa / product.to.kol;
          } else {
            product.to.sena = product.to.summa;
          }

          if (product.iznos) {
            const docDate = new Date(product.doc_date);
            const now = new Date(`${year}-${month}-01`);

            const diffInMs = now - docDate;
            const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

            if (diffInDays >= 30) {
              const month_iznos = product.to.summa * (product.iznos_foiz / 100);
              if (month_iznos + product.to.iznos_summa <= product.to.summa) {
                product.to.month_iznos = month_iznos;
              } else {
                product.to.month_iznos = month_iznos + product.to.iznos_summa - product.to.summa;
              }
            } else {
              product.to.month_iznos = 0;
            }

            product.to.iznos_summa += product.to.month_iznos;
          }

          // schet
          schet.itogo.from_kol += product.from.kol;
          schet.itogo.from_summa += product.from.summa;
          schet.itogo.from_iznos_summa += product.from.iznos_summa;

          schet.itogo.prixod_kol += product.internal.prixod_kol;
          schet.itogo.prixod_summa += product.internal.prixod_summa;
          schet.itogo.prixod_iznos_summa += product.internal.prixod_iznos_summa;

          schet.itogo.rasxod_kol += product.internal.rasxod_kol;
          schet.itogo.rasxod_summa += product.internal.rasxod_summa;
          schet.itogo.rasxod_iznos_summa += product.internal.rasxod_iznos_summa;

          schet.itogo.to_kol += product.to.kol;
          schet.itogo.to_summa += product.to.summa;
          schet.itogo.to_iznos_summa += product.to.iznos_summa;
          schet.itogo.month_iznos += product.to.month_iznos;
        }

        // general
        itogo.from_kol += schet.itogo.from_kol;
        itogo.from_summa += schet.itogo.from_summa;
        itogo.from_iznos_summa += schet.itogo.from_iznos_summa;

        itogo.prixod_kol += schet.itogo.prixod_kol;
        itogo.prixod_summa += schet.itogo.prixod_summa;
        itogo.prixod_iznos_summa += schet.itogo.prixod_iznos_summa;

        itogo.rasxod_kol += schet.itogo.rasxod_kol;
        itogo.rasxod_summa += schet.itogo.rasxod_summa;
        itogo.rasxod_iznos_summa += schet.itogo.rasxod_iznos_summa;

        itogo.to_kol += schet.itogo.to_kol;
        itogo.to_summa += schet.itogo.to_summa;
        itogo.to_iznos_summa += schet.itogo.to_iznos_summa;
        itogo.month_iznos += schet.itogo.month_iznos;
      }
    }

    for (let responsible of result) {
      responsible.products.sort((a, b) => {
        return parseInt(a.schet) - parseInt(b.schet);
      });
    }

    if (excel === "true") {
      const podpis = await PodpisService.get({
        region_id,
        type: "jur7_material",
      });

      let response;
      if (iznos === "true") {
        response = await Jur7MonitoringService.materialExcelWithIznos({
          responsibles: result,
          month,
          year,
          podpis,
          region,
          itogo,
        });
      } else {
        response = await Jur7MonitoringService.materialExcel({
          responsibles: result,
          month,
          year,
          podpis,
          region,
          itogo,
        });
      }

      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      res.setHeader("Content-Disposition", `attachment; filename="${response.fileName}"`);

      return res.sendFile(response.filePath);
    }

    return res.success(req.i18n.t("getSuccess"), 200, null, result);
  }

  static async act(req, res) {
    const { month, main_schet_id, year, excel, iznos, responsible_id } = req.query;
    const region_id = req.user.region_id;

    await ValidatorFunctions.mainSchet({ region_id, main_schet_id });

    if (responsible_id) {
      const responsible = await ResponsibleService.getById({
        region_id,
        id: responsible_id,
      });
      if (!responsible) {
        return res.error(req.i18n.t("responsibleNotFound"), 404);
      }
    }

    const data = await Jur7MonitoringService.getMaterial({
      ...req.query,
      region_id,
    });

    const resultMap = {};

    data.forEach((product) => {
      const responsibleId = product.kimning_buynida;
      const schet = product.schet;

      if (!resultMap[responsibleId]) {
        resultMap[responsibleId] = {
          responsible_id: responsibleId,
          fio: product.fio,
          products: [],
        };
      }

      const responsibleObj = resultMap[responsibleId];

      const checkProd = responsibleObj.products.find((item) => item.schet === schet);

      if (!checkProd) {
        responsibleObj.products.push({
          schet,
          products: [{ ...product }],
        });
      } else {
        checkProd.products.push(product);
      }
    });

    const result = Object.values(resultMap);

    const from = HelperFunctions.returnDate({ year, month });
    const to = HelperFunctions.returnDate({ year, month, end: true });
    const history = await Jur7MonitoringService.history({
      year,
      region_id,
      main_schet_id,
      month,
      from,
      to,
      responsible_id,
    });

    const itogo = {
      from_kol: 0,
      from_summa: 0,
      from_iznos_summa: 0,
      prixod_iznos_summa: 0,
      rasxod_iznos_summa: 0,
      prixod_kol: 0,
      prixod_summa: 0,
      rasxod_kol: 0,
      rasxod_summa: 0,
      to_iznos_summa: 0,
      to_kol: 0,
      to_summa: 0,
      month_iznos: 0,
    };

    if (iznos === "true") {
      result.forEach((item) => {
        for (let schet of item.products) {
          schet.products = schet.products.filter((item) => item.iznos === true);
        }
      });
    }

    for (let responsible of result) {
      for (let schet of responsible.products) {
        schet.itogo = {
          from_kol: 0,
          from_summa: 0,
          from_iznos_summa: 0,
          prixod_iznos_summa: 0,
          rasxod_iznos_summa: 0,
          prixod_kol: 0,
          prixod_summa: 0,
          rasxod_kol: 0,
          rasxod_summa: 0,
          to_iznos_summa: 0,
          to_kol: 0,
          to_summa: 0,
          month_iznos: 0,
        };

        for (let product of schet.products) {
          product.internal = {
            kol: 0,
            summa: 0,
            iznos_summa: 0,
            sena: 0,
            prixod_kol: 0,
            rasxod_kol: 0,
            prixod_summa: 0,
            rasxod_summa: 0,
            prixod_iznos_summa: 0,
            rasxod_iznos_summa: 0,
          };

          const productData = history.filter(
            (item) => item.responsible_id === responsible.responsible_id && item.product_id === product.product_id
          );

          if (productData.length > 0) {
            productData.forEach((item) => {
              if (item.type === "prixod" || item.type === "prixod_internal") {
                product.internal.prixod_kol += item.kol;
                product.internal.prixod_summa += item.summa;
                product.internal.prixod_iznos_summa += item.iznos_summa;
              } else {
                product.internal.rasxod_kol += item.kol;
                product.internal.rasxod_summa += item.summa;
                product.internal.rasxod_iznos_summa += item.iznos_summa;
              }
            });
            product.internal.kol = product.internal.prixod_kol - product.internal.rasxod_kol;
            product.internal.summa = product.internal.prixod_summa - product.internal.rasxod_summa;
            product.internal.iznos_summa = product.internal.prixod_iznos_summa - product.internal.rasxod_iznos_summa;
          }

          product.to = {
            kol: product.from.kol + product.internal.kol,
            summa: product.from.summa + product.internal.summa,
            iznos_summa: product.from.iznos_summa + product.internal.iznos_summa,
          };

          if (product.to.kol !== 0) {
            product.to.sena = product.to.summa / product.to.kol;
          } else {
            product.to.sena = product.to.summa;
          }

          if (product.iznos) {
            const docDate = new Date(product.doc_date);
            const now = new Date(`${year}-${month}-01`);

            const diffInMs = now - docDate;
            const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

            if (diffInDays >= 30) {
              const month_iznos = product.to.summa * (product.iznos_foiz / 100);
              if (month_iznos + product.to.iznos_summa < product.to.summa) {
                product.to.month_iznos = month_iznos;
              } else {
                product.to.month_iznos = month_iznos + product.to.iznos_summa - product.to.summa;
              }
            } else {
              product.to.month_iznos = 0;
            }

            product.to.iznos_summa += product.to.month_iznos;
          }

          // schet
          schet.itogo.from_kol += product.from.kol;
          schet.itogo.from_summa += product.from.summa;
          schet.itogo.from_iznos_summa += product.from.iznos_summa;

          schet.itogo.prixod_kol += product.internal.prixod_kol;
          schet.itogo.prixod_summa += product.internal.prixod_summa;
          schet.itogo.prixod_iznos_summa += product.internal.prixod_iznos_summa;

          schet.itogo.rasxod_kol += product.internal.rasxod_kol;
          schet.itogo.rasxod_summa += product.internal.rasxod_summa;
          schet.itogo.rasxod_iznos_summa += product.internal.rasxod_iznos_summa;

          schet.itogo.to_kol += product.to.kol;
          schet.itogo.to_summa += product.to.summa;
          schet.itogo.to_iznos_summa += product.to.iznos_summa;
          schet.itogo.month_iznos += product.to.month_iznos;
        }

        // general
        itogo.from_kol += schet.itogo.from_kol;
        itogo.from_summa += schet.itogo.from_summa;
        itogo.from_iznos_summa += schet.itogo.from_iznos_summa;

        itogo.prixod_kol += schet.itogo.prixod_kol;
        itogo.prixod_summa += schet.itogo.prixod_summa;
        itogo.prixod_iznos_summa += schet.itogo.prixod_iznos_summa;

        itogo.rasxod_kol += schet.itogo.rasxod_kol;
        itogo.rasxod_summa += schet.itogo.rasxod_summa;
        itogo.rasxod_iznos_summa += schet.itogo.rasxod_iznos_summa;

        itogo.to_kol += schet.itogo.to_kol;
        itogo.to_summa += schet.itogo.to_summa;
        itogo.to_iznos_summa += schet.itogo.to_iznos_summa;
        itogo.month_iznos += schet.itogo.month_iznos;
      }
    }

    for (let responsible of result) {
      responsible.products.sort((a, b) => {
        return parseInt(a.schet) - parseInt(b.schet);
      });
    }

    if (excel === "true") {
      const { fileName, filePath } = await Jur7MonitoringService.act({
        ...req.query,
        responsibles: result,
        month,
        year,
        itogo,
        to,
      });

      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

      return res.sendFile(filePath);
    }

    return res.success(req.i18n.t("getSuccess"), 200, null, result);
  }

  static async cap(req, res) {
    const region_id = req.user.region_id;
    const { year, budjet_id, month, main_schet_id, excel, report_title_id } = req.query;

    await ValidatorFunctions.mainSchet({ region_id, main_schet_id });

    const { rasxods, prixods } = await Jur7MonitoringService.cap({
      region_id,
      year,
      month,
      main_schet_id,
    });

    const { from_summa, to_summa } = await Jur7SaldoService.getByProduct({
      ...req.query,
      region_id,
      offset: 0,
      limit: LIMIT,
    });

    const date = HelperFunctions.getMonthStartEnd({ year, month });

    if (excel === "true") {
      const region = await RegionService.getById({ id: region_id });

      const budjet = await BudjetService.getById({ id: budjet_id });
      if (!budjet) {
        return res.error(req.i18n.t("budjetNotFound"), 400);
      }

      const report_title = await ReportTitleService.getById({
        id: report_title_id,
      });
      if (!report_title) {
        return res.error(req.i18n.t("reportTitleNotFound"), 404);
      }

      const podpis = await PodpisService.get({ region_id, type: "cap" });
      const { fileName, filePath } = await Jur7MonitoringService.capExcel({
        rasxods,
        prixods,
        summa_from: from_summa,
        summa_to: to_summa,
        report_title,
        from: date[0],
        to: date[1],
        region,
        budjet,
        podpis,
        rasxods,
        prixods,
        title: "МАТЕРИАЛ ОМБОРИ ХИСОБОТИ",
        file_name: "material",
        order: 7,
      });
      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
      return res.download(filePath);
    }
    return res.success(req.i18n.t("getSuccess"), 200, null, data);
  }

  static async reportBySchetsData(req, res) {
    const region_id = req.user.region_id;
    const { year, budjet_id, month, main_schet_id, excel, report_title_id, from, to } = req.query;

    await ValidatorFunctions.mainSchet({ region_id, main_schet_id });

    const data = await Jur7MonitoringService.reportBySchetsData({
      region_id,
      year,
      month,
      main_schet_id,
    });

    const { from_summa, to_summa } = await Jur7SaldoService.getByProduct({
      ...req.query,
      region_id,
      offset: 0,
      limit: LIMIT,
    });

    if (excel === "true") {
      const region = await RegionService.getById({ id: region_id });

      const budjet = await BudjetService.getById({ id: budjet_id });
      if (!budjet) {
        return res.error(req.i18n.t("budjetNotFound"), 400);
      }

      const report_title = await ReportTitleService.getById({
        id: report_title_id,
      });
      if (!report_title) {
        return res.error(req.i18n.t("reportTitleNotFound"), 404);
      }

      const podpis = await PodpisService.get({ region_id, type: "cap" });
      const { fileName, filePath } = await Jur7MonitoringService.reportBySchetExcelData({
        ...data,
        from,
        region,
        to,
        podpis,
        file_name: "jur7",
        order: 7,
        summa_from: from_summa,
        summa_to: to_summa,
        report_title,
      });
      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
      return res.download(filePath);
    }
    return res.success(req.i18n.t("getSuccess"), 200, null, data);
  }
};
