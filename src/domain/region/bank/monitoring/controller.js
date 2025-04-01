const { BankMonitoringService } = require("./service");
const { MainSchetService } = require("@main_schet/service");
const { RegionService } = require("@region/service");
const { ReportTitleService } = require("@report_title/service");
const { BudjetService } = require("@budjet/service");
const { PodpisService } = require(`@podpis/service`);
const { HelperFunctions } = require(`@helper/functions`);
const { REPORT_TYPE } = require("@helper/constants");

exports.Controller = class {
  static async get(req, res) {
    const region_id = req.user.region_id;
    const { page, limit, main_schet_id, from, to, search } = req.query;
    const offset = (page - 1) * limit;

    const main_schet = await MainSchetService.getById({
      region_id,
      id: main_schet_id,
    });
    if (!main_schet) {
      return res.error(req.i18n.t("mainSchetNotFound"), 400);
    }

    const {
      total_count,
      data,
      summa_from,
      summa_to,
      prixod_sum,
      rasxod_sum,
      page_prixod_sum,
      page_rasxod_sum,
      total_sum,
      page_total_sum,
    } = await BankMonitoringService.get({
      region_id,
      main_schet_id,
      offset,
      limit,
      from,
      to,
      search,
    });

    const pageCount = Math.ceil(total_count / limit);

    const meta = {
      pageCount: pageCount,
      count: total_count,
      currentPage: page,
      nextPage: page >= pageCount ? null : page + 1,
      backPage: page === 1 ? null : page - 1,
      prixod_sum,
      rasxod_sum,
      total_sum,
      summa_from: summa_from.summa,
      summa_to: summa_to.summa,
      page_prixod_sum,
      page_rasxod_sum,
      total_sum,
      page_total_sum,
      summa_from_object: summa_from,
      summa_to_object: summa_to,
    };

    return res.success(req.i18n.t("getSuccess"), 200, meta, data);
  }

  static async cap(req, res) {
    const { from, to, main_schet_id, excel, report_title_id, budjet_id } =
      req.query;
    const region_id = req.user.region_id;

    const main_schet = await MainSchetService.getById({
      region_id,
      id: main_schet_id,
    });
    if (!main_schet) {
      return res.error(req.i18n.t("mainSchetNotFound"), 400);
    }

    const data = await BankMonitoringService.cap({
      region_id,
      main_schet_id,
      from,
      to,
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

      const { fileName, filePath } = await HelperFunctions.capExcel({
        rasxods: data,
        main_schet,
        report_title,
        from,
        to,
        region,
        budjet,
        podpis,
        title: "БАНК ХИСОБОТИ",
        file_name: "bank",
        schet: main_schet.jur2_schet,
        order: 2,
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

    return res.success(req.i18n.t("getSuccess"), 200, req.query, data);
  }

  static async daysReport(req, res) {
    const { from, to, main_schet_id, report_title_id, excel, budjet_id } =
      req.query;
    const region_id = req.user.region_id;

    const main_schet = await MainSchetService.getById({
      region_id,
      id: main_schet_id,
    });
    if (!main_schet) {
      return res.error(req.i18n.t("mainSchetNotFound"), 400);
    }

    const data = await BankMonitoringService.daysReport({
      region_id,
      main_schet_id,
      from,
      to,
    });

    if (excel) {
      const budjet = await BudjetService.getById({ id: budjet_id });
      if (!budjet) {
        return res.error(req.i18n.t("budjetNotFound"), 404);
      }

      const report_title = await ReportTitleService.getById({
        id: report_title_id,
      });
      if (!report_title) {
        return res.error(req.i18n.t("reportTitleNotFound"), 404);
      }

      const region = await RegionService.getById({ id: region_id });

      const podpis = await PodpisService.get({
        region_id,
        type: REPORT_TYPE.days_report,
      });

      const { fileName, filePath } = await HelperFunctions.daysReportExcel({
        ...data,
        from,
        region,
        from,
        to,
        main_schet,
        report_title,
        region_id,
        title: "Банк кунлик ҳисоботи",
        file_name: "bank",
        podpis,
        budjet,
        schet: main_schet.jur2_schet,
        order: 2,
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

    return res.success(req.i18n.t("getSuccess"), 200, null, data);
  }

  static async prixodReport(req, res) {
    const { from, to, main_schet_id, report_title_id, excel, budjet_id } =
      req.query;
    const region_id = req.user.region_id;

    const main_schet = await MainSchetService.getById({
      region_id,
      id: main_schet_id,
    });
    if (!main_schet) {
      return res.error(req.i18n.t("mainSchetNotFound"), 400);
    }

    const data = await BankMonitoringService.prixodReport({
      region_id,
      main_schet_id,
      from,
      to,
    });

    if (excel) {
      const budjet = await BudjetService.getById({ id: budjet_id });
      if (!budjet) {
        return res.error(req.i18n.t("budjetNotFound"), 404);
      }

      const report_title = await ReportTitleService.getById({
        id: report_title_id,
      });
      if (!report_title) {
        return res.error(req.i18n.t("reportTitleNotFound"), 404);
      }

      const region = await RegionService.getById({ id: region_id });

      const podpis = await PodpisService.get({
        region_id,
        type: REPORT_TYPE.days_report,
      });

      const { fileName, filePath } =
        await BankMonitoringService.prixodReportExcel({
          ...data,
          from,
          region,
          to,
          main_schet,
          report_title,
          region_id,
          title: "Приход ҳисоботи",
          file_name: "bank",
          podpis,
          budjet,
          schet: main_schet.jur2_schet,
          order: 2,
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

    return res.success(req.i18n.t("getSuccess"), 200, null, data);
  }
};
