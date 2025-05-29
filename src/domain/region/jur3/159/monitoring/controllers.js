const { Monitoring159Service } = require("./services");
const { MainSchetService } = require("@main_schet/service");
const { OrganizationService } = require("@organization/service");
const { BudjetService } = require("@budjet/service");
const { RegionService } = require("@region/service");
const { ReportTitleService } = require(`@report_title/service`);
const { PodpisService } = require(`@podpis/service`);
const { REPORT_TYPE } = require("@helper/constants");
const { Saldo159Service } = require(`@saldo_159/service`);
const { HelperFunctions } = require("@helper/functions");
const { LIMIT } = require("@helper/constants");

exports.Controller = class {
  static async reportBySchets(req, res) {
    const region_id = req.user.region_id;
    const { from, main_schet_id, report_title_id, excel, to, schet_id } =
      req.query;

    const main_schet = await MainSchetService.getById({
      region_id,
      id: main_schet_id,
    });

    const schet = main_schet?.jur3_schets_159.find(
      (item) => item.id === schet_id
    );
    if (!main_schet || !schet) {
      return res.error(req.i18n.t("mainSchetNotFound"), 404);
    }

    const saldo = await Saldo159Service.getByMonth({
      ...req.query,
      region_id,
    });
    if (!saldo) {
      return res.error(req.i18n.t("saldoNotFound"), 404);
    }

    const { summa_from, summa_to } = await Monitoring159Service.monitoring({
      ...req.query,
      offset: 0,
      limit: LIMIT,
      region_id,
      schet: schet.schet,
      saldo,
    });

    const data = await Monitoring159Service.reportBySchets({
      ...req.query,
      schet: schet.schet,
      region_id,
    });

    if (excel === "true") {
      const report_title = await ReportTitleService.getById({
        id: report_title_id,
      });
      if (!report_title) {
        return res.error(req.i18n.t(`reportTitleNotFound`), 404);
      }

      const podpis = await PodpisService.get({
        region_id,
        type: REPORT_TYPE.cap,
      });

      const { filePath, fileName } = await HelperFunctions.reportBySchetExcel({
        data,
        main_schet,
        from,
        to,
        podpis,
        file_name: "159",
        schet: schet.schet,
        order: 3,
        summa_from,
        summa_to,
        report_title,
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

    return res.success(req.i18n.t("getSuccess"), 200, data);
  }

  static async daysReport(req, res) {
    const region_id = req.user.region_id;
    const {
      main_schet_id,
      organ_id,
      schet_id,
      excel,
      budjet_id,
      from,
      to,
      report_title_id,
    } = req.query;

    const main_schet = await MainSchetService.getById({
      region_id,
      id: main_schet_id,
    });

    const schet = main_schet?.jur3_schets_159.find(
      (item) => item.id === Number(schet_id)
    );
    if (!main_schet || !schet) {
      return res.error(req.i18n.t(`mainSchetNotFound`), 400);
    }

    if (organ_id) {
      const organization = await OrganizationService.getById({
        region_id,
        id: organ_id,
        isdeleted: false,
      });
      if (!organization) {
        return res.error(req.i18n.t("organizationNotFound"), 404);
      }
    }

    const data = await Monitoring159Service.daysReport({
      ...req.query,
      region_id,
      organ_id,
      schet: schet.schet,
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
        region,
        from,
        to,
        main_schet,
        report_title,
        region_id,
        title:
          "Етказиб берувчи корхоналар билан дебитор-кредиторлик кунлик ҳисоботи",
        file_name: "159",
        podpis,
        budjet,
        schet: schet.schet,
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

    return res.success(req.i18n.t("getSuccess"), 200, data);
  }

  static async monitoring(req, res) {
    const region_id = req.user.region_id;
    const { query } = req;
    const { page, limit, organ_id, schet_id } = query;
    const offset = (query.page - 1) * limit;

    const main_schet = await MainSchetService.getById({
      region_id,
      id: query.main_schet_id,
    });

    const schet = main_schet?.jur3_schets_159.find(
      (item) => item.id === Number(schet_id)
    );
    if (!main_schet || !schet) {
      return res.error(req.i18n.t(`mainSchetNotFound`), 400);
    }

    if (organ_id) {
      const organization = await OrganizationService.getById({
        region_id,
        id: organ_id,
        isdeleted: false,
      });
      if (!organization) {
        return res.error(req.i18n.t("organizationNotFound"), 404);
      }
    }

    const saldo = await Saldo159Service.getByMonth({
      ...req.query,
      region_id,
    });
    if (!saldo) {
      return res.error(req.i18n.t("saldoNotFound"), 404);
    }

    const {
      data,
      summa_from,
      page_rasxod_sum,
      page_prixod_sum,
      summa_to,
      total,
      page_total_sum,
      prixod_sum,
      rasxod_sum,
      total_sum,
    } = await Monitoring159Service.monitoring({
      ...query,
      offset,
      region_id,
      organ_id,
      schet: schet.schet,
      saldo,
    });

    const pageCount = Math.ceil(total / limit);

    const meta = {
      pageCount: pageCount,
      count: total,
      currentPage: page,
      nextPage: page >= pageCount ? null : page + 1,
      backPage: page === 1 ? null : page - 1,
      page_prixod_sum,
      page_rasxod_sum,
      page_total_sum,
      summa_from: summa_from,
      summa_to: summa_to,
      prixod_sum,
      rasxod_sum,
      total_sum,
    };

    return res.success(req.i18n.t("getSuccess"), 200, meta, data);
  }

  static async cap(req, res) {
    const region_id = req.user.region_id;
    const {
      from,
      main_schet_id,
      budjet_id,
      report_title_id,
      excel,
      to,
      schet_id,
    } = req.query;

    const main_schet = await MainSchetService.getById({
      region_id,
      id: main_schet_id,
    });

    const schet = main_schet?.jur3_schets_159.find(
      (item) => item.id === schet_id
    );
    if (!main_schet || !schet) {
      return res.error(req.i18n.t("mainSchetNotFound"), 404);
    }

    const saldo = await Saldo159Service.getByMonth({
      ...req.query,
      region_id,
    });
    if (!saldo) {
      return res.error(req.i18n.t("saldoNotFound"), 404);
    }

    const { summa_from, summa_to } = await Monitoring159Service.monitoring({
      ...req.query,
      offset: 0,
      limit: LIMIT,
      region_id,
      schet: schet.schet,
      saldo,
    });

    const { rasxods, prixods } = await Monitoring159Service.cap({
      ...req.query,
      schet: schet.schet,
      region_id,
    });

    if (excel === "true") {
      const region = await RegionService.getById({ id: region_id });

      const budjet = await BudjetService.getById({ id: budjet_id });
      if (!budjet) {
        return res.error(req.i18n.t("budjetNotFound"), 404);
      }

      const report_title = await ReportTitleService.getById({
        id: report_title_id,
      });
      if (!report_title) {
        return res.error(req.i18n.t(`reportTitleNotFound`), 404);
      }

      const podpis = await PodpisService.get({
        region_id,
        type: REPORT_TYPE.cap,
      });

      const { filePath, fileName } = await HelperFunctions.jur3CapExcel({
        rasxods,
        prixods,
        summa_from,
        summa_to,
        main_schet,
        report_title,
        from,
        to,
        region,
        budjet,
        podpis,
        title: "ОРГАНИЗАТСИЯ ХИСОБОТИ",
        file_name: "organization",
        schet: schet.schet,
        order: 3,
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

    return res.success(req.i18n.t("getSuccess"), 200, { prixods, rasxods });
  }

  static async prixodRasxod(req, res) {
    const region_id = req.user.region_id;
    const { query } = req;

    const budjet = await BudjetService.getById({ id: query.budjet_id });
    if (!budjet) {
      return res.error(req.i18n.t("budjetNotFound"), 404);
    }

    const main_schet = await MainSchetService.getById({
      region_id,
      id: query.main_schet_id,
    });

    const schet = main_schet?.jur3_schets_159.find(
      (item) => item.id === query.schet_id
    );

    if (!main_schet || !schet) {
      return res.error(req.i18n.t("mainSchetNotFound"), 404);
    }

    const { year, month } = HelperFunctions.returnMonthAndYear({
      doc_date: req.query.to,
    });

    const saldo = await Saldo159Service.getByMonth({
      ...req.query,
      year,
      month,
      region_id,
    });
    if (!saldo) {
      return res.error(req.i18n.t("saldoNotFound"), 404);
    }

    const { data: organizations } = await OrganizationService.get({
      region_id,
      offset: 0,
      limit: 99999999,
    });

    const data = await Monitoring159Service.prixodRasxod({
      ...req.query,
      saldo,
      from: HelperFunctions.returnDate({ year, month }),
      schet: schet.schet,
      region_id,
      organizations,
    });

    if (query.excel === "true") {
      const filePath = await Monitoring159Service.prixodRasxodExcel({
        organ_name: main_schet.tashkilot_nomi,
        schet: schet.schet,
        organizations: data.organizations,
        to: query.to,
      });

      return res.download(filePath, (err) => {
        if (err) {
          res.error(err.message, err.statusCode);
        }
      });
    }
    return res.success(
      req.i18n.t("getSuccess"),
      200,
      { itogo_rasxod: data.itogo_rasxod, itogo_prixod: data.itogo_prixod },
      data.organizations
    );
  }

  // old
  static async prixodReport(req, res) {
    const region_id = req.user.region_id;
    const {
      main_schet_id,
      organ_id,
      excel,
      report_title_id,
      budjet_id,
      schet,
      from,
      to,
    } = req.query;

    const main_schet = await MainSchetService.getById({
      region_id,
      id: main_schet_id,
    });
    if (!main_schet) {
      return res.error(req.i18n.t("mainSchetNotFound"), 404);
    }

    if (organ_id) {
      const organization = await OrganizationService.getById({
        region_id,
        id: organ_id,
        isdeleted: false,
      });
      if (!organization) {
        res.error(req.i18n("organizationNotFound"), 404);
      }
    }

    const data = await Monitoring159Service.prixodReport({
      ...req.query,
      region_id,
    });

    if (excel === "true") {
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
        await Monitoring159Service.prixodReportExcel({
          ...data,
          from,
          region,
          to,
          main_schet,
          report_title,
          region_id,
          title: "Приход ҳисоботи",
          file_name: "jur3",
          podpis,
          budjet,
          schet: schet,
          order: 3,
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
