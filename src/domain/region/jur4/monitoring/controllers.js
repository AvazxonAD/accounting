const { PodotchetDB } = require("@podotchet/db");
const { MainSchetDB } = require("@main_schet/db");
const { BudjetDB } = require("@budjet/db");
const ExcelJS = require("exceljs");
const { returnStringDate, HelperFunctions } = require("@helper/functions");
const path = require("path");
const { PodotchetMonitoringDB } = require("./db");
const { MainSchetService } = require("@main_schet/service");
const { PodotchetMonitoringService } = require("./service");
const { ReportTitleService } = require(`@report_title/service`);
const { BudjetService } = require(`@budjet/service`);
const { RegionService } = require("@region/service");
const { PodpisService } = require("@podpis/service");
const { Jur4SaldoService } = require(`@podotchet_saldo/service`);
const { PodotchetService } = require("@podotchet/service");
const { REPORT_TYPE, LIMIT } = require("@helper/constants");

exports.Controller = class {
  static async daysReport(req, res) {
    const {
      from,
      to,
      main_schet_id,
      budjet_id,
      report_title_id,
      schet_id,
      excel,
      podotchet_id,
    } = req.query;
    const region_id = req.user.region_id;

    const main_schet = await MainSchetService.getById({
      region_id,
      id: main_schet_id,
    });

    const schet = main_schet?.jur4_schets.find(
      (item) => item.id === Number(schet_id)
    );
    if (!main_schet || !schet) {
      return res.error(req.i18n.t(`mainSchetNotFound`), 400);
    }

    if (podotchet_id) {
      const podotchet = await PodotchetService.getById({
        region_id,
        id: podotchet_id,
      });
      if (!podotchet) {
        return res.error(req.i18n.t("podotchetNotFound"), 404);
      }
    }

    const data = await PodotchetMonitoringService.daysReport({
      ...req.query,
      region_id,
      schet: schet.schet,
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

      const { fileName, filePath } =
        await HelperFunctions.daysReportPodotchetExcel({
          ...data,
          from,
          region,
          to,
          main_schet,
          report_title,
          region_id,
          title: "Ҳисобдор шахс кунлик ҳисоботи",
          file_name: "podotchet",
          podpis,
          budjet,
          schet: main_schet.jur1_schet,
          order: 1,
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

  static async getMonitoring(req, res) {
    const { limit, page, main_schet_id, podotchet_id, schet_id } = req.query;
    const region_id = req.user.region_id;
    const offset = (page - 1) * limit;

    if (podotchet_id) {
      const podotchet = await PodotchetDB.getById([region_id, podotchet_id]);
      if (!podotchet) {
        return res.error(req.i18n.t(`podotchetNotFound`), 404);
      }
    }

    const main_schet = await MainSchetService.getById({
      region_id,
      id: main_schet_id,
    });

    const schet = main_schet?.jur4_schets.find(
      (item) => item.id === Number(schet_id)
    );
    if (!main_schet || !schet) {
      return res.error(req.i18n.t(`mainSchetNotFound`), 400);
    }

    const saldo = await Jur4SaldoService.getByMonth({
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
    } = await PodotchetMonitoringService.monitoring({
      ...req.query,
      offset,
      region_id,
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
      report_title_id,
      main_schet_id,
      excel,
      budjet_id,
      schet_id,
      from,
      to,
    } = req.query;

    const main_schet = await MainSchetService.getById({
      region_id,
      id: main_schet_id,
    });

    const schet = main_schet?.jur4_schets.find(
      (item) => item.id === Number(schet_id)
    );
    if (!main_schet || !schet) {
      return res.error(req.i18n.t(`mainSchetNotFound`), 404);
    }

    const saldo = await Jur4SaldoService.getByMonth({
      ...req.query,
      region_id,
    });
    if (!saldo) {
      return res.error(req.i18n.t("saldoNotFound"), 404);
    }

    const { summa_from, summa_to } =
      await PodotchetMonitoringService.monitoring({
        ...req.query,
        offset: 0,
        limit: LIMIT,
        region_id,
        schet: schet.schet,
        saldo,
      });

    const { rasxods, prixods } = await PodotchetMonitoringService.cap({
      ...req.query,
      region_id,
      schet: schet.schet,
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

      const podpis = await PodpisService.get({ region_id, type: "cap" });

      const { filePath, fileName } = await HelperFunctions.capExcel({
        main_schet,
        report_title,
        from,
        to,
        region,
        budjet,
        podpis,
        summa_from,
        summa_to,
        rasxods,
        prixods,
        title: "Podotchet Monitoring",
        file_name: "podotchet",
        schet: schet.schet,
        order: 4,
      });

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${fileName}"`
      );

      return res.download(filePath, (err) => {
        if (err) {
          res.error(err.message, err.statusCode);
        }
      });
    }
    return res.success(req.i18n.t("getSuccess"), 200, null, data);
  }

  static async reportBySchets(req, res) {
    const region_id = req.user.region_id;
    const { report_title_id, main_schet_id, excel, schet_id, from, to } =
      req.query;

    const main_schet = await MainSchetService.getById({
      region_id,
      id: main_schet_id,
    });

    const schet = main_schet?.jur4_schets.find(
      (item) => item.id === Number(schet_id)
    );
    if (!main_schet || !schet) {
      return res.error(req.i18n.t(`mainSchetNotFound`), 404);
    }

    const saldo = await Jur4SaldoService.getByMonth({
      ...req.query,
      region_id,
    });
    if (!saldo) {
      return res.error(req.i18n.t("saldoNotFound"), 404);
    }

    const { summa_from, summa_to } =
      await PodotchetMonitoringService.monitoring({
        ...req.query,
        offset: 0,
        limit: LIMIT,
        region_id,
        schet: schet.schet,
        saldo,
      });

    const data = await PodotchetMonitoringService.reportBySchets({
      ...req.query,
      region_id,
      schet: schet.schet,
    });

    if (excel === "true") {
      const report_title = await ReportTitleService.getById({
        id: report_title_id,
      });
      if (!report_title) {
        return res.error(req.i18n.t("reportTitleNotFound"), 404);
      }

      const podpis = await PodpisService.get({ region_id, type: "cap" });

      const { filePath, fileName } = await HelperFunctions.reportBySchetExcel({
        data,
        main_schet,
        from,
        to,
        podpis,
        file_name: "podotchet",
        schet: schet.schet,
        order: 4,
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

      return res.download(filePath, (err) => {
        if (err) {
          res.error(err.message, err.statusCode);
        }
      });
    }
    return res.success(req.i18n.t("getSuccess"), 200, null, data);
  }

  static async prixodRasxodPodotchet(req, res) {
    const region_id = req.user.region_id;
    const { to, budjet_id, excel, main_schet_id, schet_id } = req.query;

    const bujet = await BudjetDB.getById([budjet_id]);
    if (!bujet) {
      return res.error(req.i18n.t("budjetNotFound"), 404);
    }

    const main_schet = await MainSchetService.getById({
      region_id,
      id: main_schet_id,
    });

    const schet = main_schet?.jur4_schets.find(
      (item) => item.id === Number(schet_id)
    );
    if (!main_schet || !schet) {
      return res.error(req.i18n.t(`mainSchetNotFound`), 400);
    }

    const data = (await PodotchetDB.get([region_id, 0, 99999999])).data;

    const { year, month } = HelperFunctions.returnMonthAndYear({
      doc_date: to,
    });

    const saldo = await Jur4SaldoService.getByMonth({
      ...req.query,
      region_id,
      year,
      month,
    });
    if (!saldo) {
      return res.error(req.i18n.t("saldoNotFound"), 404);
    }

    const from = HelperFunctions.returnDate({ year, month });

    for (let podotchet of data) {
      const internal = await PodotchetMonitoringDB.getSumma(
        [region_id, schet.schet, main_schet_id, from, to],
        podotchet.id
      );

      const podotchet_saldo = saldo.childs.find(
        (item) => item.podotchet_id === podotchet.id
      );

      if (!podotchet_saldo) {
        podotchet.summa = internal.summa;
      } else {
        podotchet.summa = internal.summa + podotchet_saldo.summa;
      }
    }

    if (excel === "true") {
      const workbook = new ExcelJS.Workbook();
      const fileName = `prixod_rasxod_${new Date().getTime()}.xlsx`;
      const worksheet = workbook.addWorksheet("prixod rasxod");
      worksheet.pageSetup.margins.left = 0;
      worksheet.pageSetup.margins.header = 0;
      worksheet.pageSetup.margins.footer = 0;
      worksheet.pageSetup.margins.right = 0;
      worksheet.mergeCells("A1:E1");
      worksheet.getCell("A1").value =
        `Список Дебеторов / Кредиторов на ${returnStringDate(new Date(to))}`;
      worksheet.getCell("A2").value = "Подотчетное лицо";
      worksheet.getCell("B2").value = "Управление";
      worksheet.getCell("C2").value = "Дата";
      worksheet.getCell("D2").value = "Дебет";
      worksheet.getCell("E2").value = "Кредит";
      let row_number = 3;
      let itogo_prixod = 0;
      let itogo_rasxod = 0;
      for (let column of data) {
        if (column.summa === 0) continue;
        worksheet.getCell(`A${row_number}`).value = column.name;
        worksheet.getCell(`B${row_number}`).value = column.rayon;
        worksheet.getCell(`C${row_number}`).value = returnStringDate(
          new Date(to)
        );
        worksheet.getCell(`D${row_number}`).value =
          column.summa > 0 ? column.summa : 0;
        worksheet.getCell(`E${row_number}`).value =
          column.summa < 0 ? Math.abs(column.summa) : 0;
        itogo_prixod += column.summa > 0 ? column.summa : 0;
        itogo_rasxod += column.summa < 0 ? Math.abs(column.summa) : 0;
        const css_array = [
          `A${row_number}`,
          `B${row_number}`,
          `C${row_number}`,
          `D${row_number}`,
          `E${row_number}`,
        ];
        css_array.forEach((cell, index) => {
          let horizontal = "center";
          if (index === 0) horizontal = "left";
          if (index > 2) horizontal = "right";
          const column = worksheet.getCell(cell);
          column.numFmt = "#,##0.00";
          column.font = {
            size: 10,
            color: { argb: "FF000000" },
            name: "Times New Roman",
          };
          column.alignment = { vertical: "middle", horizontal };
          column.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFFFFFFF" },
          };
          column.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        });
        row_number++;
      }
      worksheet.mergeCells(`A${row_number}`, `C${row_number}`);
      worksheet.getCell(`A${row_number}`).value = "Итого";
      worksheet.getCell(`D${row_number}`).value = itogo_prixod;
      worksheet.getCell(`E${row_number}`).value = itogo_rasxod;
      const css_array = [
        "A1",
        "A2",
        "B2",
        "C2",
        "D2",
        "E2",
        `A${row_number}`,
        `D${row_number}`,
        `E${row_number}`,
      ];
      css_array.forEach((cell, index) => {
        const column = worksheet.getCell(cell);
        let size = 10;
        let horizontal = "center";
        if (index === 0) size = 13;
        if (index > 5) (column.numFmt = "#,##0.00"), (horizontal = "right");
        Object.assign(column, {
          font: {
            size,
            bold: true,
            color: { argb: "FF000000" },
            name: "Times New Roman",
          },
          alignment: { vertical: "middle", horizontal },
          fill: {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFFFFFFF" },
          },
          border: {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          },
        });
      });

      worksheet.getColumn(1).width = 30;
      worksheet.getColumn(2).width = 20;
      worksheet.getColumn(3).width = 15;
      worksheet.getColumn(4).width = 18;
      worksheet.getColumn(5).width = 18;
      worksheet.getRow(1).height = 35;
      worksheet.getRow(2).height = 20;

      const filePath = path.join(
        __dirname,
        "../../../../../public/exports/" + fileName
      );
      await workbook.xlsx.writeFile(filePath);

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
