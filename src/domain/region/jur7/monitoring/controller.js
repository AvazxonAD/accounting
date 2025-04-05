const { ResponsibleService } = require("@responsible/service");
const { RegionService } = require("@region/service");
const { BudjetService } = require("@budjet/service");
const { Jur7MonitoringService } = require("./service");
const { HelperFunctions } = require("@helper/functions");
const { ReportTitleService } = require("@report_title/service");
const { PodpisService } = require("@podpis/service");

exports.Controller = class {
  static async getSaldoDate(req, res) {
    const region_id = req.user.region_id;
    const { budjet_id, year } = req.query;

    const budjet = await BudjetService.getById({ id: budjet_id });
    if (!budjet) {
      return res.error(req.i18n.t("budjetNotFound"), 404);
    }

    const result = await Jur7MonitoringService.getSaldoDate({
      region_id,
      year,
      budjet_id,
    });

    return res.success(req.i18n.t("getSuccess"), 200, null, result);
  }

  static async materialReport(req, res) {
    const { month, year, budjet_id, excel } = req.query;
    const region_id = req.user.region_id;

    const budjet = await BudjetService.getById({ id: budjet_id });
    if (!budjet) {
      return res.error(req.i18n.t("budjetNotFound"), 404);
    }

    const region = await RegionService.getById({ id: region_id });

    const data = await Jur7MonitoringService.getMaterial({
      year,
      month,
      budjet_id,
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

      const checkProd = responsibleObj.products.find(
        (item) => item.schet === schet
      );

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

    return res.send("javob qaytdi");
    if (excel === "true") {
      const { fileName, filePath } = await Jur7MonitoringService.materialExcel({
        responsibles: result,
        month,
        year,
        region,
      });

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${fileName}"`
      );

      return res.sendFile(filePath);
    }

    return res.success(req.i18n.t("getSuccess"), 200, null, result);
  }

  static async cap(req, res) {
    const region_id = req.user.region_id;
    const { budjet_id, year, month, excel, report_title_id } = req.query;

    const budjet = await BudjetService.getById({ id: budjet_id });
    if (!budjet) {
      return res.error(req.i18n.t("budjetNotFound"), 404);
    }

    const data = await Jur7MonitoringService.cap({
      region_id,
      year,
      month,
      budjet_id,
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
        rasxods: data,
        report_title,
        from: date[0],
        to: date[1],
        region,
        budjet,
        podpis,
        title: "МАТЕРИАЛ ОМБОРИ ХИСОБОТИ",
        file_name: "material",
        order: 7,
      });
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${fileName}"`
      );
      return res.download(filePath);
    }
    return res.success(req.i18n.t("getSuccess"), 200, null, data);
  }
};
