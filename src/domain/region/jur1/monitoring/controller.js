const { KassaMonitoringService } = require("./service");
const { MainSchetService } = require("@main_schet/service");
const { RegionService } = require("@region/service");
const { ReportTitleService } = require("@report_title/service");
const { PodpisService } = require(`@podpis/service`);
const { BudjetService } = require(`@budjet/service`);
const { HelperFunctions } = require("@helper/functions");
const { REPORT_TYPE } = require("@helper/constants");
const { KassaSaldoService } = require(`@jur1_saldo/service`);

exports.Controller = class {
  static async reportBySchets(req, res) {
    const { from, to, main_schet_id, excel, report_title_id, budjet_id } = req.query;
    const region_id = req.user.region_id;

    const report_title = await ReportTitleService.getById({
      id: report_title_id,
    });
    if (!report_title) {
      return res.error(req.i18n.t("reportTitleNotFound"), 404);
    }

    const main_schet = await MainSchetService.getById({
      region_id,
      id: main_schet_id,
    });
    if (!main_schet) {
      return res.error(req.i18n.t("mainSchetNotFound"), 400);
    }

    const saldo = await KassaSaldoService.getByMonth({
      ...req.query,
      region_id,
    });
    if (!saldo) {
      return res.error(req.i18n.t("saldoNotFound"), 404);
    }

    const { summa_from, summa_to } = await KassaMonitoringService.get({
      ...req.query,
      region_id,
      offset: 0,
      limit: 100000000,
      saldo,
    });

    const data = await KassaMonitoringService.reportBySchets({
      region_id,
      main_schet_id,
      saldo,
      from,
      to,
    });

    if (excel === "true") {
      const podpis = await PodpisService.get({ region_id, type: "cap" });

      const { fileName, filePath } = await HelperFunctions.reportBySchetExcel({
        data,
        main_schet,
        from,
        to,
        podpis,
        file_name: "kassa",
        schet: main_schet.jur1_schet,
        order: 1,
        summa_from,
        summa_to,
        report_title,
      });

      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
      return res.sendFile(filePath);
    }

    return res.success(req.i18n.t("getSuccess"), 200, req.query, data);
  }

  static async get(req, res) {
    const region_id = req.user.region_id;
    const { page, limit, main_schet_id } = req.query;
    const offset = (page - 1) * limit;

    const main_schet = await MainSchetService.getById({
      region_id,
      id: main_schet_id,
    });
    if (!main_schet) {
      return res.error(req.i18n.t("mainSchetNotFound"), 400);
    }

    const saldo = await KassaSaldoService.getByMonth({
      ...req.query,
      region_id,
    });

    if (!saldo) {
      return res.error(req.i18n.t("saldoNotFound"), 404);
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
      page_total_sum,
    } = await KassaMonitoringService.get({
      ...req.query,
      region_id,
      offset,
      saldo,
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
      summa_from,
      summa_to,
      page_prixod_sum,
      page_rasxod_sum,
      page_total_sum,
    };

    return res.success(req.i18n.t("getSuccess"), 200, meta, data);
  }

  static async cap(req, res) {
    const { from, to, main_schet_id, excel, report_title_id, budjet_id } = req.query;
    const region_id = req.user.region_id;

    const report_title = await ReportTitleService.getById({
      id: report_title_id,
    });
    if (!report_title) {
      return res.error(req.i18n.t("reportTitleNotFound"), 404);
    }

    const main_schet = await MainSchetService.getById({
      region_id,
      id: main_schet_id,
    });
    if (!main_schet) {
      return res.error(req.i18n.t("mainSchetNotFound"), 400);
    }

    const saldo = await KassaSaldoService.getByMonth({
      ...req.query,
      region_id,
    });
    if (!saldo) {
      return res.error(req.i18n.t("saldoNotFound"), 404);
    }

    const { summa_from, summa_to } = await KassaMonitoringService.get({
      ...req.query,
      region_id,
      offset: 0,
      limit: 100000000,
      saldo,
    });

    const { rasxods, prixods } = await KassaMonitoringService.cap({
      region_id,
      main_schet_id,
      saldo,
      from,
      to,
    });

    if (excel === "true") {
      const region = await RegionService.getById({ id: region_id });

      const podpis = await PodpisService.get({ region_id, type: "cap" });

      const budjet = await BudjetService.getById({ id: budjet_id });
      if (!budjet) {
        return res.error(req.i18n.t("budjetNotFound"), 400);
      }

      const { fileName, filePath } = await HelperFunctions.capExcel({
        rasxods,
        prixods,
        main_schet,
        report_title,
        from,
        to,
        region,
        budjet,
        podpis,
        title: "КАССА ХИСОБОТИ",
        file_name: "kassa",
        schet: main_schet.jur1_schet,
        order: 1,
        summa_from,
        summa_to,
      });

      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
      return res.sendFile(filePath);
    }

    return res.success(req.i18n.t("getSuccess"), 200, req.query, data);
  }

  static async daysReport(req, res) {
    const { from, to, main_schet_id, budjet_id, report_title_id, excel } = req.query;
    const region_id = req.user.region_id;

    const main_schet = await MainSchetService.getById({
      region_id,
      id: main_schet_id,
    });
    if (!main_schet) {
      return res.error(req.i18n.t("mainSchetNotFound"), 400);
    }

    const data = await KassaMonitoringService.daysReport({
      region_id,
      main_schet_id,
      from,
      to,
    });

    if (excel) {
      const report_title = await ReportTitleService.getById({
        id: report_title_id,
      });
      if (!report_title) {
        return res.error(req.i18n.t("reportTitleNotFound"), 404);
      }

      const budjet = await BudjetService.getById({ id: budjet_id });
      if (!budjet) {
        return res.error(req.i18n.t(req.i18n.t("budjetNotFound")), 404);
      }

      const region = await RegionService.getById({ id: region_id });

      const podpis = await PodpisService.get({
        region_id,
        type: REPORT_TYPE.days_report,
      });

      const { fileName, filePath } = await HelperFunctions.daysReportPodotchetExcel({
        ...data,
        from,
        region,
        to,
        main_schet,
        report_title,
        region_id,
        title: "Касса кунлик ҳисоботи",
        file_name: "kassa",
        podpis,
        budjet,
        schet: main_schet.jur1_schet,
        order: 1,
      });

      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

      return res.sendFile(filePath);
    }

    return res.success(req.i18n.t("getSuccess"), 200, null, data);
  }

  static async prixodReport(req, res) {
    const { from, to, main_schet_id, budjet_id, report_title_id, excel } = req.query;
    const region_id = req.user.region_id;

    const main_schet = await MainSchetService.getById({
      region_id,
      id: main_schet_id,
    });
    if (!main_schet) {
      return res.error(req.i18n.t("mainSchetNotFound"), 400);
    }

    const saldo = await KassaSaldoService.getByMonth({
      ...req.query,
      region_id,
    });
    if (!saldo) {
      return res.error(req.i18n.t("saldoNotFound"), 404);
    }

    const data = await KassaMonitoringService.prixodReport({
      region_id,
      main_schet_id,
      from,
      to,
    });

    if (excel) {
      const report_title = await ReportTitleService.getById({
        id: report_title_id,
      });
      if (!report_title) {
        return res.error(req.i18n.t("reportTitleNotFound"), 404);
      }

      const budjet = await BudjetService.getById({ id: budjet_id });
      if (!budjet) {
        return res.error(req.i18n.t(req.i18n.t("budjetNotFound")), 404);
      }

      const region = await RegionService.getById({ id: region_id });

      const podpis = await PodpisService.get({
        region_id,
        type: REPORT_TYPE.days_report,
      });

      const { fileName, filePath } = await KassaMonitoringService.prixodReportExcel({
        ...data,
        from,
        region,
        to,
        main_schet,
        report_title,
        region_id,
        title: "Приход ҳисоботи",
        file_name: "kassa",
        podpis,
        budjet,
        schet: main_schet.jur1_schet,
        order: 1,
      });

      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

      return res.sendFile(filePath);
    }

    return res.success(req.i18n.t("getSuccess"), 200, null, data);
  }
};
