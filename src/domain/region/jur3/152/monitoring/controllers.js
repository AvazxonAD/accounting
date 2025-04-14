const { Monitoring152Service } = require("./services");
const { MainSchetService } = require("@main_schet/service");
const { OrganizationService } = require("@organization/service");
const { BudjetService } = require("@budjet/service");
const { ContractService } = require("@contract/service");
const { RegionDB } = require("@region/db");
const { MainSchetDB } = require("@main_schet/db");
const { OrganizationDB } = require("@organization/db");
const { Monitoring152DB } = require("./db");
const { RegionService } = require("@region/service");
const { ReportTitleService } = require(`@report_title/service`);
const { PodpisService } = require(`@podpis/service`);
const { REPORT_TYPE } = require("@helper/constants");
const { Saldo152Service } = require(`@saldo_152/service`);

exports.Controller = class {
  static async monitoring(req, res) {
    const region_id = req.user.region_id;
    const { query } = req;
    const { page, limit, organ_id, schet_id } = query;
    const offset = (query.page - 1) * limit;

    const main_schet = await MainSchetService.getById({
      region_id,
      id: query.main_schet_id,
    });

    const schet = main_schet?.jur3_schets_152.find(
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

    const saldo = await Saldo152Service.getByMonth({
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
    } = await Monitoring152Service.monitoring({
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

    const schet = main_schet?.jur3_schets_152.find(
      (item) => item.id === schet_id
    );
    if (!main_schet || !schet) {
      return res.error("Main shcet not found", 404);
    }

    const saldo = await Saldo152Service.getByMonth({
      ...req.query,
      region_id,
    });
    if (!saldo) {
      return res.error(req.i18n.t("saldoNotFound"), 404);
    }

    const data = await Monitoring152Service.cap({
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

      const { filePath, fileName } = await Monitoring152Service.capExcel({
        rasxods: data,
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

    return res.success(req.i18n.t("getSuccess"), 200, data);
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
      return res.error("main shcet not found", 404);
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

    const data = await Monitoring152Service.prixodReport({
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
        await Monitoring152Service.prixodReportExcel({
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
    if (!main_schet) {
      return res.error("main shcet not found", 404);
    }

    const { data: organizations } = await OrganizationService.get({
      region_id,
      offset: 0,
      limit: 99999999,
    });
    const data = await Monitoring152Service.prixodRasxod(query, organizations);

    if (query.excel === "true") {
      const filePath = await Monitoring152Service.prixodRasxodExcel({
        organ_name: main_schet.tashkilot_nomi,
        schet: query.schet,
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

  static async consolidated(req, res) {
    const region_id = req.user.region_id;
    const { query } = req;
    const main_schet = await MainSchetService.getById({
      region_id,
      id: query.main_schet_id,
    });
    if (!main_schet) {
      return res.error("main shcet not found", 404);
    }
    if (query.organ_id) {
      const organization = await OrganizationService.getById({
        region_id,
        id: query.organ_id,
      });
      if (!organization) {
        res.error(req.i18n("organizationNotFound"), 404);
      }
    }
    let data;
    let organizations;
    if (query.contract !== "true") {
      organizations = (
        await OrganizationService.get({
          region_id,
          offset: 0,
          limit: 99999999,
          organ_id: query.organ_id,
        })
      ).data;
    } else {
      organizations = await ContractService.getContractByOrganizations({
        region_id,
        organ_id: query.organ_id,
      });
    }
    data = await Monitoring152Service.consolidated({
      organizations,
      region_id,
      from: query.from,
      to: query.to,
      main_schet_id: query.main_schet_id,
      schet: schet,
      contract: query.contract === "true" ? true : false,
    });
    if (query.excel === "true") {
      let file;
      if (query.contract === "true") {
        file = await Monitoring152Service.consolidatedByContractExcel({
          organizations: data.organizations,
          rasxodSchets: data.rasxodSchets,
          to: query.to,
          schet: schet,
        });
      } else {
        file = await Monitoring152Service.consolidatedExcel({
          organizations: data.organizations,
          rasxodSchets: data.rasxodSchets,
          to: query.to,
          schet: schet,
        });
      }
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${file.fileName}"`
      );
      return res.download(file.filePath);
    }
    return res.success(
      req.i18n.t("getSuccess"),
      200,
      { rasxodSchets: data.rasxodSchets },
      data.organizations
    );
  }

  static async aktSverka(req, res) {
    const region_id = req.user.region_id;
    const { main_schet_id, contract_id, organ_id, to, from } = req.query;
    const region = await RegionDB.getById([region_id]);
    if (!region) {
      return res.status(404).json({
        message: "region not found",
      });
    }
    const main_schet = await MainSchetDB.getById([region_id, main_schet_id]);
    if (!main_schet) {
      return res.status(404).json({
        message: "main schet not found",
      });
    }
    const organization = await OrganizationDB.getById([region_id, organ_id]);
    if (!organization) {
      res.error(req.i18n("organizationNotFound"), 404);
    }
    if (contract_id) {
      const contract = await ContractDB.getById(
        [region_id, contract_id],
        true,
        main_schet.spravochnik_budjet_name_id,
        organ_id
      );
      if (!contract) {
        return res.status(404).json({
          message: "contract not found",
        });
      }
    }
    const data = await Monitoring152DB.ge([from, to, organ_id], contract_id);
    const summa_from = await Monitoring152DB.getByContractIdSumma(
      [from, organ_id],
      "<",
      contract_id
    );
    const summa_to = await Monitoring152DB.getByContractIdSumma(
      [to, organ_id],
      "<=",
      contract_id
    );
    const podpis = await PodpisDB.get([region_id], "akkt_sverka");
    let summa_rasxod = 0;
    let summa_prixod = 0;
    for (let item of data) {
      summa_rasxod += item.summa_rasxod;
      summa_prixod += item.summa_prixod;
    }
    const head = `Акт сверки взаимарасчетов`;
    const title = `Мы, нижеподписавшиеся Начальник ${main_schet.tashkilot_nomi} " OOO ${organization.name}" АЖ произвели сверку взаимных расчетов между ${main_schet.tashkilot_nomi} "${organization.name}" АЖ по состоянию на ${returnStringDate(new Date(to))}`;
    const workbook = new ExcelJS.Workbook();
    const fileName = `akt_sverki_${new Date().getTime()}.xlsx`;
    const worksheet = workbook.addWorksheet("Акт сверки");
    worksheet.pageSetup.margins.left = 0;
    worksheet.pageSetup.margins.header = 0;
    worksheet.pageSetup.margins.footer = 0;
    worksheet.mergeCells("A1", "K1");
    const headCell = worksheet.getCell("A1");
    Object.assign(headCell, {
      value: head,
      font: {
        size: 14,
        bold: true,
        color: { argb: "FF004080" },
        name: "Times New Roman",
      },
      alignment: { vertical: "middle", horizontal: "center" },
    });
    worksheet.mergeCells("A2", "K2");
    worksheet.mergeCells("A3", "C3");
    worksheet.mergeCells("D3", "G3");
    worksheet.mergeCells("H3", "K3");
    const titleCell = worksheet.getCell("A2");
    titleCell.value = title;
    const row1Cell = worksheet.getCell("A3");
    row1Cell.value = `Содержание записей`;
    const row2Cell = worksheet.getCell("D3");
    row2Cell.value = main_schet.tashkilot_nomi;
    const row3Cell = worksheet.getCell("H3");
    row3Cell.value = `${organization.name}`;
    worksheet.mergeCells("A4", "C4");
    const empty = worksheet.getCell("A4");
    empty.value = "";
    worksheet.mergeCells("D4", "E4");
    const debit1 = worksheet.getCell("D4");
    debit1.value = `Дебит`;
    worksheet.mergeCells("F4", "G4");
    const kridit1 = worksheet.getCell("F4");
    kridit1.value = "Кредит";
    worksheet.mergeCells("H4", "I4");
    const debit2 = worksheet.getCell("H4");
    debit2.value = `Дебит`;
    worksheet.mergeCells("J4", "K4");
    const kridit2 = worksheet.getCell("J4");
    kridit2.value = "Кредит";
    worksheet.mergeCells("A5", "C5");
    const empty2 = worksheet.getCell("A5");
    empty2.value = "Остаток к началу дня:";
    worksheet.mergeCells("D5", "E5");
    const debit1_2 = worksheet.getCell("D5");
    debit1_2.value = summa_from > 0 ? summa_from : 0;
    worksheet.mergeCells("F5", "G5");
    const kridit1_2 = worksheet.getCell("F5");
    kridit1_2.value = summa_from < 0 ? Math.abs(summa_from) : 0;
    worksheet.mergeCells("H5", "I5");
    const debit2_2 = worksheet.getCell("H5");
    debit2_2.value = summa_from < 0 ? Math.abs(summa_from) : 0;
    worksheet.mergeCells("J5", "K5");
    const kridit2_2 = worksheet.getCell("J5");
    kridit2_2.value = summa_from > 0 ? summa_from : 0;
    for (let item of data) {
      const row_number = worksheet.lastRow.number + 1;
      worksheet.mergeCells(`A${row_number}`, `C${row_number}`);
      const text = `${item.opisanie || "Описание"}`;
      const row1 = worksheet.getCell(`A${row_number}`);
      Object.assign(row1, {
        value: text,
        font: { size: 10, name: "Times New Roman" },
        alignment: { vertical: "middle", horizontal: "left", wrapText: true },
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
      const rowHeight = Math.ceil(text.length / 30) * 15;
      const row = worksheet.getRow(row_number);
      row.height = rowHeight;
      worksheet.mergeCells(`D${row_number}`, `E${row_number}`);
      const debit1 = worksheet.getCell(`D${row_number}`);
      debit1.value = item.summa_prixod;
      worksheet.mergeCells(`F${row_number}`, `G${row_number}`);
      const kridit1 = worksheet.getCell(`F${row_number}`);
      kridit1.value = item.summa_rasxod;
      worksheet.mergeCells(`H${row_number}`, `I${row_number}`);
      const debit2 = worksheet.getCell(`H${row_number}`);
      debit2.value = item.summa_rasxod;
      worksheet.mergeCells(`J${row_number}`, `K${row_number}`);
      const kridit2 = worksheet.getCell(`J${row_number}`);
      kridit2.value = item.summa_prixod;
      const summa_array = [debit1, debit2, kridit1, kridit2];
      summa_array.forEach((item) => {
        Object.assign(item, {
          numFmt: "#,##0.00",
          font: { size: 10, name: "Times New Roman" },
          alignment: { vertical: "middle", horizontal: "right" },
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
    }
    let row_number = worksheet.lastRow.number + 1;
    worksheet.mergeCells(`A${row_number}`, `C${row_number}`);
    const empty3 = worksheet.getCell(`A${row_number}`);
    empty3.value = `Итого`;
    worksheet.mergeCells(`D${row_number}`, `E${row_number}`);
    const debit3 = worksheet.getCell(`D${row_number}`);
    debit3.value = summa_prixod;
    worksheet.mergeCells(`F${row_number}`, `G${row_number}`);
    const kridit3 = worksheet.getCell(`F${row_number}`);
    kridit3.value = summa_rasxod;
    worksheet.mergeCells(`H${row_number}`, `I${row_number}`);
    const debit3_2 = worksheet.getCell(`H${row_number}`);
    debit3_2.value = summa_rasxod;
    worksheet.mergeCells(`J${row_number}`, `K${row_number}`);
    const kridit3_2 = worksheet.getCell(`J${row_number}`);
    kridit3_2.value = summa_prixod;
    row_number = row_number + 1;

    worksheet.mergeCells(`A${row_number}`, `C${row_number}`);
    const empty4 = worksheet.getCell(`A${row_number}`);
    empty4.value = `Остаток концу дня:`;
    worksheet.mergeCells(`D${row_number}`, `E${row_number}`);
    const debit4 = worksheet.getCell(`D${row_number}`);
    debit4.value = summa_to > 0 ? summa_to : 0;
    worksheet.mergeCells(`F${row_number}`, `G${row_number}`);
    const kridit4 = worksheet.getCell(`F${row_number}`);
    kridit4.value = summa_to < 0 ? Math.abs(summa_to) : 0;
    worksheet.mergeCells(`H${row_number}`, `I${row_number}`);
    const debit4_2 = worksheet.getCell(`H${row_number}`);
    debit4_2.value = summa_to < 0 ? Math.abs(summa_to) : 0;
    worksheet.mergeCells(`J${row_number}`, `K${row_number}`);
    const kridit4_2 = worksheet.getCell(`J${row_number}`);
    kridit4_2.value = summa_to > 0 ? summa_to : 0;
    row_number = row_number + 1;

    worksheet.mergeCells(`A${row_number}`, `K${row_number}`);
    const footer = worksheet.getCell(`A${row_number}`);
    footer.value = `Сальдо в пользу : ${podpis[0]?.fio_name || "podis"} ${returnStringSumma(summa_to)}`;
    worksheet.getRow(row_number).height = 40;
    row_number = row_number + 1;

    worksheet.mergeCells(`A${row_number}`, `D${row_number}`);
    const podotchet = worksheet.getCell(`A${row_number}`);
    podotchet.value = `Началник ${main_schet.tashkilot_nomi} ${podpis[0]?.fio_name || "podis"}`;
    worksheet.mergeCells(`G${row_number}`, `K${row_number}`);
    const organ = worksheet.getCell(`G${row_number}`);
    organ.value = `Руководитель "${organization.name}" АЖ`;
    worksheet.getRow(row_number).height = 30;
    row_number = row_number + 1;

    worksheet.mergeCells(`A${row_number}`, `D${row_number}`);
    const imzo1 = worksheet.getCell(`A${row_number}`);
    imzo1.value = ``;
    imzo1.border = { bottom: { style: "thin" } };
    worksheet.mergeCells(`G${row_number}`, `K${row_number}`);
    const imzo2 = worksheet.getCell(`G${row_number}`);
    imzo2.value = ``;
    imzo2.border = { bottom: { style: "thin" } };
    worksheet.getRow(row_number).height = 30;
    const array_headers = [
      footer,
      podotchet,
      organ,
      imzo1,
      imzo2,
      titleCell,
      row1Cell,
      row2Cell,
      row3Cell,
      empty,
      debit1,
      debit2,
      kridit1,
      kridit2,
      empty2,
      debit1_2,
      debit2_2,
      kridit1_2,
      kridit2_2,
      empty3,
      debit3,
      debit3_2,
      kridit3,
      kridit3_2,
      empty4,
      debit4,
      debit4_2,
      kridit4,
      kridit4_2,
    ];
    array_headers.forEach((item, index) => {
      let argb = "FF004080";
      let horizontal = `center`;
      if (index > 13) {
        argb = "000000";
        horizontal = "right";
      }
      Object.assign(item, {
        numFmt: `#,##0.00`,
        font: {
          size: 10,
          bold: true,
          color: { argb },
          name: "Times New Roman",
        },
        alignment: { vertical: "middle", horizontal, wrapText: true },
      });
      if (item.value !== "" && index > 5) {
        Object.assign(item, {
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
      }
    });
    const titleLength = title.length;
    worksheet.getRow(2).height =
      titleLength > 150 ? 60 : titleLength > 100 ? 50 : 40;
    worksheet.getRow(1).height = 25;
    worksheet.getRow(3).height = 35;
    worksheet.getRow(4).height = 25;
    worksheet.getColumn(4).width = 8;
    worksheet.getColumn(5).width = 8;
    worksheet.getColumn(6).width = 8;
    worksheet.getColumn(7).width = 8;
    worksheet.getColumn(8).width = 8;
    worksheet.getColumn(9).width = 8;
    worksheet.getColumn(10).width = 8;
    worksheet.getColumn(11).width = 8;
    const filePath = path.join(
      __dirname,
      "../../../public/exports/" + fileName
    );
    await workbook.xlsx.writeFile(filePath);
    return res.download(filePath, (err) => {
      if (err) throw new ErrorResponse(err, err.statusCode);
    });
  }
};
