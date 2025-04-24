const { MainSchetDB } = require("@main_schet/db");
const { Monitoring152DB } = require("./db");
const { OrganizationDB } = require("@organization/db");
const { RegionDB } = require("@region/db");
const { ContractDB } = require("@contract/db");
const { PodpisDB } = require("@podpis/db");
const { mkdir, access, constants } = require(`fs`).promises;
const {
  returnStringDate,
  returnStringSumma,
  returnExcelColumn,
  HelperFunctions,
} = require("@helper/functions");
const { REPORT_RASXOD_SCHET } = require("@helper/constants");
const ExcelJS = require("exceljs");
const path = require("path");
const fs = require(`fs`).promises;

exports.Monitoring152Service = class {
  static async aktSverka(data) {
    const itogo = {
      from: { prixod: 0, rasxod: 0 },
      internal: { prixod: 0, rasxod: 0 },
      to: { prixod: 0, rasxod: 0 },
    };

    const { data: docs } = await this.monitoring({
      ...data,
      from: data.from,
      to: data.to,
      offset: 0,
      limit: 9999999,
    });

    for (let organ of data.saldo.childs) {
      organ.internal = {
        prixod: 0,
        rasxod: 0,
      };

      for (let doc of docs) {
        if (organ.organization_id === doc.organ_id) {
          organ.internal.prixod += doc.summa_prixod;
          organ.internal.rasxod += doc.summa_rasxod;
        }
      }

      organ.to = {
        prixod: organ.prixod + organ.internal.prixod,
        rasxod: organ.rasxod + organ.internal.rasxod,
      };

      itogo.from.prixod += organ.prixod;
      itogo.from.rasxod += organ.rasxod;
      itogo.internal.prixod += organ.internal.prixod;
      itogo.internal.rasxod += organ.internal.rasxod;
      itogo.to.prixod += organ.to.prixod;
      itogo.to.rasxod += organ.to.rasxod;
    }

    const result = await data.saldo.childs.filter(
      (item) => item.to.prixod !== 0 || item.to.rasxod !== 0
    );

    return { data: result, itogo };
  }

  static async aktSverkaExcel(data) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("responsibles");

    worksheet.mergeCells(`A1`, `H1`);
    worksheet.getCell(`A1`).value = `___илова`;

    worksheet.mergeCells(`A2`, `H2`);
    worksheet.getCell(`A2`).value =
      `${data.region.name} нинг ўта муҳим ва тоифаланган объектларда ёнғин хавфсизлигини таъминлашни ташкил бўйича ${data.year} йил давомида кўрсатилган хизмат учун ҳисобланган ва тўланган маблағлар тўғрисида`;

    worksheet.mergeCells(`A3`, `H3`);
    worksheet.getCell(`A3`).value = `Малумотнома`;

    worksheet.getRow(4).values = [
      "Т/р",
      "Ташкилот номи",
      `Ой бошига дебитор карздорлик ${HelperFunctions.returnLocalDate(data.from)}`,
      `Ой бошига кредитор қарздорлик ${HelperFunctions.returnLocalDate(data.from)}`,
      "Ҳисобланди",
      "Молиялаштириш",
      `Ой охирига дебитор карздорлик ${HelperFunctions.returnLocalDate(data.to)}`,
      `Ой охирига кредитор қарздорлик ${HelperFunctions.returnLocalDate(data.to)}`,
    ];

    worksheet.columns = [
      { key: "index", width: 10 },
      { key: "name", width: 40 },
      { key: "from_prixod", width: 30 },
      { key: "from_rasxod", width: 30 },
      { key: "internal_prixod", width: 30 },
      { key: "internal_rasxod", width: 30 },
      { key: "to_prixod", width: 30 },
      { key: "to_rasxod", width: 30 },
    ];

    let column = 4;
    data.organizations.forEach((item, index) => {
      worksheet.addRow({
        index: index + 1,
        name: item.name,
        from_prixod: item.prixod,
        from_rasxod: item.rasxod,
        internal_prixod: item.internal.prixod,
        internal_rasxod: item.internal.rasxod,
        to_prixod: item.to.prixod,
        to_rasxod: item.to.rasxod,
      });
      column++;
    });

    worksheet.addRow({
      name: "Жами",
      from_prixod: data.itogo.from.prixod,
      from_rasxod: data.itogo.from.rasxod,
      internal_prixod: data.itogo.internal.prixod,
      internal_rasxod: data.itogo.internal.rasxod,
      to_prixod: data.itogo.to.prixod,
      to_rasxod: data.itogo.to.rasxod,
    });
    column++;

    let podpis_column = column + 4;

    for (let podpis of data.podpis) {
      worksheet.mergeCells(`A${podpis_column}`, `B${podpis_column}`);
      const positionCell = worksheet.getCell(`A${podpis_column}`);
      positionCell.value = podpis.position;
      positionCell.note = JSON.stringify({
        horizontal: "left",
      });

      worksheet.mergeCells(`D${podpis_column}`, `F${podpis_column}`);
      const fioCell = worksheet.getCell(`D${podpis_column}`);
      fioCell.value = podpis.fio;
      fioCell.note = JSON.stringify({
        horizontal: "left",
        height: 40,
      });
      podpis_column += 4;
    }

    worksheet.eachRow((row, rowNumber) => {
      let bold = false;
      let horizontal = "center";

      if (rowNumber === 1) {
        horizontal = `right`;
      }

      if (rowNumber < 5 || rowNumber === column) {
        worksheet.getRow(rowNumber).height = 40;
        bold = true;
      }

      row.eachCell((cell, columnNumber) => {
        let note = null;

        if (rowNumber > 4 && columnNumber > 2) {
          horizontal = `right`;
        }

        if (columnNumber > 1) {
          cell.numFmt = "#,##0.00";
        }

        if (cell.note) {
          note = JSON.parse(cell.note);
        }

        if (note?.horizontal) {
          horizontal = note.horizontal;
        }

        if (note?.height) {
          worksheet.getRow(rowNumber).height = note.height;
        }

        Object.assign(cell, {
          font: { size: 13, name: "Times New Roman", bold },
          alignment: {
            vertical: "middle",
            horizontal,
            wrapText: true,
          },
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

        if (cell.note) {
          cell.note = undefined;
        }
      });
    });

    const folder_path = path.join(
      __dirname,
      `../../../../../../public/exports`
    );

    try {
      await fs.access(folder_path, fs.constants.W_OK);
    } catch (error) {
      await fs.mkdir(folder_path);
    }

    const fileName = `akt_sverka.${new Date().getTime()}.xlsx`;

    const filePath = `${folder_path}/${fileName}`;

    await workbook.xlsx.writeFile(filePath);

    return { fileName, filePath };
  }

  static async getSumma(data) {
    const internal = await Monitoring152DB.getSumma([
      data.region_id,
      data.main_schet_id,
      data.schet,
      data.from,
      data.to,
    ]);

    return internal;
  }

  static async monitoring(data) {
    const docs = await Monitoring152DB.monitoring(
      [
        data.region_id,
        data.main_schet_id,
        data.schet,
        data.from,
        data.to,
        data.offset,
        data.limit,
      ],
      data.organ_id,
      data.search,
      data.order_by || "doc_date",
      data.order_type || "DESC"
    );

    const internal = await Monitoring152DB.getSumma(
      [data.region_id, data.main_schet_id, data.schet, data.from, data.to],
      data.organ_id,
      data.search
    );

    const from = HelperFunctions.returnDate({
      year: data.year,
      month: data.month,
    });

    const summa_from = await Monitoring152DB.getSumma(
      [data.region_id, data.main_schet_id, data.schet, from, data.from],
      data.organ_id,
      data.search,
      true
    );

    const summa_to = await Monitoring152DB.getSumma(
      [data.region_id, data.main_schet_id, data.schet, from, data.to],
      data.organ_id,
      data.search
    );

    const total = await Monitoring152DB.getTotal(
      [data.region_id, data.main_schet_id, data.schet, data.from, data.to],
      data.organ_id,
      data.search
    );

    let page_rasxod_sum = 0;
    let page_prixod_sum = 0;
    for (let item of docs) {
      page_prixod_sum += item.summa_prixod;
      page_rasxod_sum += item.summa_rasxod;
    }

    const saldo_summa = data.saldo?.summa || 0;

    return {
      data: docs,
      summa_from: saldo_summa + summa_from.summa,
      summa_to: saldo_summa + summa_to.summa,
      page_prixod_sum,
      page_rasxod_sum,
      page_total_sum: page_prixod_sum - page_rasxod_sum,
      total,
      total_sum: internal.summa,
      prixod_sum: internal.prixod_sum,
      rasxod_sum: internal.rasxod_sum,
    };
  }

  static async cap(data) {
    let result = await Monitoring152DB.capData([
      data.main_schet_id,
      data.from,
      data.to,
      data.region_id,
      data.schet,
    ]);

    result = result.reduce((acc, item) => {
      if (!acc[item.schet]) {
        acc[item.schet] = { summa: 0, items: [] };
      }
      acc[item.schet].summa += item.summa;
      acc[item.schet].items.push(item);
      return acc;
    }, {});

    result.summa = 0;

    for (let rasxod in result) {
      if (rasxod !== "summa") {
        result.summa += result[rasxod].summa;
      }
    }

    return result;
  }

  static async capExcel(data) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Hisobot");

    // main section
    worksheet.mergeCells("A1", "G1");
    worksheet.getCell("A1").value =
      `${data.region.name} Фавқулодда вазиятлар бошкармаси`;

    worksheet.mergeCells("A2", "C2");
    worksheet.getCell("A2").value =
      `${data.report_title.name}  №  ${data.order}`;

    worksheet.mergeCells("D2", "G2");
    worksheet.getCell("D2").value = data.budjet.name;

    worksheet.mergeCells("A3", "G3");
    worksheet.getCell("A3").value = `${data.title} Счёт-№ ${data.schet}`;

    worksheet.mergeCells("A4", "G4");
    worksheet.getCell("A4").value =
      `от ${HelperFunctions.returnStringDate(new Date(data.from))} до ${HelperFunctions.returnStringDate(new Date(data.to))}`;

    worksheet.mergeCells("A6", "C6");
    worksheet.getCell("A6").value = `Бош китобга тушадиган ёзувлар`;

    worksheet.getRow(7).values = [
      "Дебет",
      "Кредит",
      "Сумма",
      "",
      "Счет",
      "Субсчет",
      "Сумма",
    ];

    worksheet.columns = [
      { key: "prixod", width: 20 },
      { key: "rasxod", width: 20 },
      { key: "summa", width: 20 },
      { key: "ignore", width: 20 },
      { key: "r_prixod", width: 20 },
      { key: "r_rasxod", width: 20 },
      { key: "r_summa", width: 20 },
    ];

    let column = 8;

    // rasxod main
    for (let rasxod in data.rasxods) {
      if (rasxod !== "summa" && data.rasxods[rasxod].summa !== 0) {
        worksheet.addRow({
          prixod: rasxod,
          rasxod: data.schet,
          summa: data.rasxods[rasxod].summa,
        });
        column++;
      }
    }

    // itogo
    worksheet.mergeCells(`A${column}`, `B${column}`);
    const itogoCellTitle = worksheet.getCell(`A${column}`);
    itogoCellTitle.value = `Жами КТ:`;
    itogoCellTitle.note = JSON.stringify({
      bold: true,
      horizontal: "left",
    });

    worksheet.getCell(`C${column}`).value = data.rasxods.summa;
    column++;

    let rasxod_column = 8;
    // deep rasxod
    for (let rasxod in data.rasxods) {
      if (
        rasxod !== "summa" &&
        data.rasxods[rasxod].summa !== 0 &&
        rasxod === REPORT_RASXOD_SCHET[0]
      ) {
        // rasxod
        worksheet.mergeCells(`E6`, `G6`);
        const titleCelll = worksheet.getCell(`E6`);
        titleCelll.value = `${rasxod}-счёт суммаси расшифровкаси`;
        titleCelll.note = JSON.stringify({
          bold: true,
          horizontal: "center",
        });

        for (let item of data.rasxods[rasxod].items) {
          const r_prixodCell = worksheet.getCell(`E${rasxod_column}`);
          r_prixodCell.value = item.schet;
          r_prixodCell.note = JSON.stringify({
            horizontal: "center",
          });

          const r_rasxodCell = worksheet.getCell(`F${rasxod_column}`);
          r_rasxodCell.value = item.sub_schet;
          r_rasxodCell.note = JSON.stringify({
            horizontal: "center",
          });

          const r_summaCell = worksheet.getCell(`G${rasxod_column}`);
          r_summaCell.value = item.summa;
          r_summaCell.note = JSON.stringify({
            horizontal: "right",
          });

          rasxod_column++;
        }

        worksheet.mergeCells(`E${rasxod_column}`, `F${rasxod_column}`);
        const rasxodTitleCell = worksheet.getCell(`E${rasxod_column}`);
        rasxodTitleCell.value = `Кредит буйича жами:`;
        rasxodTitleCell.note = JSON.stringify({
          bold: true,
          horizontal: "left",
        });

        const rasxodCell = worksheet.getCell(`G${rasxod_column}`);
        rasxodCell.value = data.rasxods[rasxod].summa || 0;
        rasxodCell.note = JSON.stringify({
          bold: true,
          horizontal: "right",
        });
        rasxod_column += 2;
      }
    }

    let podpis_column = rasxod_column > column ? rasxod_column : column;
    podpis_column++;

    for (let podpis of data.podpis) {
      worksheet.mergeCells(`A${podpis_column}`, `B${podpis_column}`);
      const positionCell = worksheet.getCell(`A${podpis_column}`);
      positionCell.value = podpis.position;
      positionCell.note = JSON.stringify({
        horizontal: "left",
      });

      worksheet.mergeCells(`D${podpis_column}`, `F${podpis_column}`);
      const fioCell = worksheet.getCell(`D${podpis_column}`);
      fioCell.value = podpis.fio;
      fioCell.note = JSON.stringify({
        horizontal: "left",
        height: 30,
      });
      podpis_column += 4;
    }

    // css
    worksheet.eachRow((row, rowNumber) => {
      let bold = false;
      let horizontal = "center";
      let height = 20;
      let argb = "FFFFFFFF";

      if (rowNumber === 1) {
        height = 50;
      }

      if (rowNumber > 1 && rowNumber < 4) {
        height = 30;
      }

      if (rowNumber < 8) {
        bold = true;
      }

      worksheet.getRow(rowNumber).height = height;

      row.eachCell((cell, column) => {
        const cellData = cell.note ? JSON.parse(cell.note) : {};

        if (column === 3 && rowNumber > 6 && !cellData.horizontal) {
          horizontal = "right";
        }

        if (cellData.bold) {
          bold = true;
        } else if (
          !cellData.bold &&
          rowNumber > 7 &&
          column > 3 &&
          cell.value !== "Кредит буйича жами:"
        ) {
          bold = false;
        }

        if (cellData.horizontal) {
          horizontal = cellData.horizontal;
        }

        if (
          cell.value === "Модда" ||
          cell.value === "Статьяси" ||
          cell.value === "Сумма"
        ) {
          horizontal = "center";
          bold = true;
        }

        if (cellData.height) {
          worksheet.getRow(rowNumber).height = cellData.height;
        }

        Object.assign(cell, {
          numFmt: "#,##0.00",
          font: { size: 13, name: "Times New Roman", bold },
          alignment: {
            vertical: "middle",
            horizontal,
            wrapText: true,
          },
          fill: {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb },
          },

          border: {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          },
        });

        // clean note
        if (cell.note) {
          cell.note = undefined;
        }
      });
    });

    const fileName = `${data.file_name}_shapka_${new Date().getTime()}.xlsx`;
    const folder_path = path.join(
      __dirname,
      "../../../../../../public/exports"
    );

    try {
      await fs.access(folder_path, fs.constants.W_OK);
    } catch (error) {
      await fs.mkdir(folder_path);
    }

    const filePath = `${folder_path}/${fileName}`;

    await workbook.xlsx.writeFile(filePath);

    return { fileName, filePath };
  }

  static async daysReport(data) {
    const result = await Monitoring152DB.daysReport([
      data.main_schet_id,
      data.from,
      data.to,
      data.region_id,
      data.schet,
    ]);

    const summa_to = await Monitoring152DB.getSumma(
      [data.region_id, data.main_schet_id, data.schet, data.to],
      data.organ_id,
      null,
      null,
      null,
      true
    );

    const summa_from = await Monitoring152DB.getSumma(
      [data.region_id, data.main_schet_id, data.schet, data.from],
      data.organ_id,
      null,
      null,
      true,
      null
    );

    let rasxodSumma = 0;
    let prixodSumma = 0;

    for (let rasxod of result.rasxods) {
      rasxodSumma += rasxod.summa;
    }

    for (let prixod of result.prixods) {
      prixodSumma += prixod.summa;
    }

    result.rasxodSumma = rasxodSumma;
    result.prixodSumma = prixodSumma;

    return {
      ...result,
      summa_from: summa_from.summa,
      summa_to: summa_to.summa,
    };
  }

  // old

  static async prixodReport(data) {
    const docs = await Monitoring152DB.prixodReport(
      [data.region_id, data.main_schet_id, data.from, data.to, data.schet],
      data.organ_id,
      data.search
    );

    let prixod_summa = 0;
    for (let item of docs) {
      prixod_summa += item.summa;
    }

    return { docs, prixod_summa };
  }

  static async prixodRasxod(data, organizations) {
    let itogo_rasxod = 0;
    let itogo_prixod = 0;
    for (let item of organizations) {
      item.summa = await Monitoring152DB.getPrixodRasxod([
        data.schet,
        data.to,
        item.id,
        data.budjet_id,
      ]);
      itogo_rasxod += item.summa.rasxod_sum;
      itogo_prixod += item.prixod_sum;
    }
    return { organizations, itogo_rasxod, itogo_prixod };
  }

  static async prixodRasxodExcel(data) {
    const workbook = new ExcelJS.Workbook();
    const fileName = `organization_prixod_rasxod_${new Date().getTime()}.xlsx`;
    const worksheet = workbook.addWorksheet("organization prixod rasxod");
    worksheet.pageSetup.margins.left = 0;
    worksheet.pageSetup.margins.header = 0;
    worksheet.pageSetup.margins.footer = 0;
    worksheet.pageSetup.margins.right = 0;
    worksheet.mergeCells(`A1`, "D1");
    const title = worksheet.getCell(`A1`);

    title.value = `${data.organ_name} ${returnStringDate(new Date(data.to))} холатига  ${data.schet} счет бўйича дебитор-кредитор  карздорлик тугрисида маълумот `;
    const organ_nameCell = worksheet.getCell(`A2`);
    organ_nameCell.value = "Наименование организации";
    const prixodCell = worksheet.getCell(`B2`);
    prixodCell.value = `Дебит`;
    const rasxodCell = worksheet.getCell(`C2`);
    rasxodCell.value = "Кредит";
    const css_array = [title, organ_nameCell, prixodCell, rasxodCell];
    let itogo_rasxod = 0;
    let itogo_prixod = 0;
    let row_number = 3;
    for (let column of data.organizations) {
      if (column.summa.summa === 0) {
        continue;
      }
      const organ_nameCell = worksheet.getCell(`A${row_number}`);
      organ_nameCell.value = column.name;
      const prixodCell = worksheet.getCell(`B${row_number}`);
      prixodCell.value = column.summa.summa > 0 ? column.summa.summa : 0;
      itogo_prixod += prixodCell.value;
      const rasxodCell = worksheet.getCell(`C${row_number}`);
      rasxodCell.value =
        column.summa.summa < 0 ? Math.abs(column.summa.summa) : 0;
      itogo_rasxod += rasxodCell.value;
      const css_array = [organ_nameCell, prixodCell, rasxodCell];
      css_array.forEach((item, index) => {
        let horizontal = "center";
        let size = 10;
        if (index === 0) horizontal = "left";
        if (index === 1 || index === 2) horizontal = "right";
        Object.assign(item, {
          numFmt: "#,##0.00",
          font: { size, color: { argb: "FF000000" }, name: "Times New Roman" },
          alignment: { vertical: "middle", horizontal, wrapText: true },
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
      row_number++;
    }
    const itogoStr = worksheet.getCell(`A${row_number}`);
    itogoStr.value = "Итого";
    const prixod_itogoCell = worksheet.getCell(`B${row_number}`);
    prixod_itogoCell.value = itogo_prixod;
    const rasxod_itogoCell = worksheet.getCell(`C${row_number}`);
    rasxod_itogoCell.value = itogo_rasxod;
    css_array.push(itogoStr, prixod_itogoCell, rasxod_itogoCell);

    css_array.forEach((item, index) => {
      let fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFFFFFF" },
      };
      let border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
      let horizontal = "center";
      let size = 10;
      if (index === 0) (fill = null), (border = null), (size = 12);
      if (index === 1)
        (fill = null), (border = { bottom: { style: "thin" } }), (size = 12);
      if (index === 4) (fill = null), (border = null), (horizontal = "right");
      if (index > 4) horizontal = "right";
      Object.assign(item, {
        numFmt: "#,##0.00",
        font: {
          size,
          bold: true,
          color: { argb: "FF000000" },
          name: "Times New Roman",
        },
        alignment: { vertical: "middle", horizontal, wrapText: true },
        fill,
        border,
      });
    });
    worksheet.getColumn(1).width = 40;
    worksheet.getColumn(2).width = 20;
    worksheet.getColumn(3).width = 20;
    worksheet.getRow(1).height = 30;
    const filePath = path.join(
      __dirname,
      "../../../../../public/exports/" + fileName
    );
    await workbook.xlsx.writeFile(filePath);
    return filePath;
  }

  static async consolidated(data) {
    for (let organ of data.organizations) {
      const contract_id = data.contract ? organ.contract_id : null;
      organ.summa_from = await Monitoring152DB.getSummaConsolidated(
        [data.region_id, data.main_schet_id, data.schet, data.from, organ.id],
        "<",
        contract_id
      );
      organ.summa_bank_rasxod_prixod =
        await Monitoring152DB.getSummaPrixodConsolidated(
          [
            data.region_id,
            data.main_schet_id,
            data.schet,
            data.from,
            data.to,
            organ.id,
          ],
          contract_id
        );
      organ.summa_akt_rasxod = await Monitoring152DB.getSummaAktConsolidated(
        [data.region_id, data.main_schet_id, data.from, data.to, organ.id],
        contract_id
      );
      organ.summa_jur7_rasxod = await Monitoring152DB.getSummaJur7Consolidated(
        [
          data.region_id,
          data.main_schet_id,
          data.schet,
          data.from,
          data.to,
          organ.id,
        ],
        contract_id
      );
      organ.summa_bank_prixod_rasxod =
        await Monitoring152DB.getSummaBankPrixodConsolidated(
          [
            data.region_id,
            data.main_schet_id,
            data.schet,
            data.from,
            data.to,
            organ.id,
          ],
          contract_id
        );
      let itogo_rasxod = 0;
      organ.summa_akt_rasxod.forEach((item) => {
        itogo_rasxod += item.summa;
      });
      organ.summa_jur7_rasxod.forEach((item) => {
        itogo_rasxod += item.summa;
      });
      organ.summa_bank_prixod_rasxod.forEach((item) => {
        itogo_rasxod += item.summa;
      });
      organ.itogo_rasxod = {
        schet: "itogo_kredit",
        summa: itogo_rasxod,
      };
      organ.summa_to = await Monitoring152DB.getSummaConsolidated(
        [data.region_id, data.main_schet_id, data.schet, data.to, organ.id],
        "<=",
        contract_id
      );
      data.rasxodSchets = await Monitoring152DB.getRasxodSchets(
        [data.region_id, data.main_schet_id, data.schet, data.from, data.to],
        contract_id
      );
      data.rasxodSchets.push({ schet: "itogo_rasxod" });
    }
    return {
      organizations: data.organizations,
      rasxodSchets: data.rasxodSchets,
    };
  }

  static async consolidatedExcel(data) {
    const workbook = new ExcelJS.Workbook();
    const fileName = `consolidated_${new Date().getTime()}.xlsx`;
    const worksheet = workbook.addWorksheet("consolelidated");
    worksheet.mergeCells(`A1`, "C1");
    worksheet.getCell("A1").value = "Мемориал ордер N_3";
    worksheet.mergeCells(`A2`, "C2");
    worksheet.getCell("A2").value = `"Расчеты с дебеторами и кредиторами"`;
    worksheet.mergeCells(`A3`, "C3");
    worksheet.getCell("A3").value =
      `${returnStringDate(new Date(data.to))} холатига  ${data.schet}`;
    worksheet.mergeCells(`A4`, "A5");
    worksheet.mergeCells(`B4`, "C4");
    worksheet.getCell("B4").value = `Остаток к начало`;
    worksheet.getCell("D4").value = "Дебет";
    const endRasxodSchetsColumn = data.rasxodSchets.length + 4;
    worksheet.mergeCells(
      `E4`,
      `${returnExcelColumn([endRasxodSchetsColumn])}4`
    );
    worksheet.getCell("E4").value = "Кредит счета";
    worksheet.mergeCells(
      `${returnExcelColumn([endRasxodSchetsColumn + 1])}4`,
      `${returnExcelColumn([endRasxodSchetsColumn + 2])}4`
    );
    worksheet.getCell(
      `${returnExcelColumn([endRasxodSchetsColumn + 1])}4`
    ).value = "Остаток к конец";
    worksheet.getRow(5).values = [
      "Организатсия",
      "Дебет",
      "Кредит",
      "",
      ...data.rasxodSchets.map((item) => {
        if (item.schet === "itogo_rasxod") {
          return "итого кредит";
        } else {
          return item.schet;
        }
      }),
      "Дебет",
      "Кредит",
    ];
    worksheet.columns = [
      { key: "name" },
      { key: "prixod_from" },
      { key: "rasxod_from" },
      { key: `_prixod_${data.schet}` },
      ...data.rasxodSchets.map((item) => {
        return { key: `_rasxod_${item.schet}` };
      }),
      { key: "prixod_to" },
      { key: "rasxod_to" },
    ];
    for (let organ of data.organizations) {
      if (organ.summa_from.summa === 0 && organ.summa_to.summa === 0) {
        continue;
      }
      const values = data.rasxodSchets.reduce((acc, item) => {
        const schetKey = `_rasxod_${item.schet}`;
        const matchAkt = organ.summa_akt_rasxod.find(
          (i) => i.schet === item.schet
        );
        const matchBankPrixod = organ.summa_bank_prixod_rasxod.find(
          (i) => i.schet === item.schet
        );
        const matchJur7 = organ.summa_jur7_rasxod.find(
          (i) => i.schet === item.schet
        );
        if (
          !matchAkt &&
          !matchBankPrixod &&
          !matchJur7 &&
          item.schet !== "itogo_rasxod"
        ) {
          acc.push({ schet: schetKey, summa: "" });
        }
        if (matchAkt) acc.push({ schet: schetKey, summa: matchAkt.summa });
        if (matchBankPrixod)
          acc.push({ schet: schetKey, summa: matchBankPrixod.summa });
        if (matchJur7) acc.push({ schet: schetKey, summa: matchJur7.summa });
        if (item.schet === "itogo_rasxod") {
          acc.push({
            schet: schetKey,
            summa: organ.itogo_rasxod.summa,
          });
        }
        return acc;
      }, []);
      worksheet.addRow({
        name: organ.name,
        prixod_from: Math.max(organ.summa_from.summa, 0),
        rasxod_from: Math.max(-organ.summa_from.summa, 0),
        [`_prixod_${data.schet}`]:
          organ.summa_bank_rasxod_prixod[0]?.summa || "",
        ...values.reduce((acc, { schet, summa }) => {
          acc[schet] = summa;
          return acc;
        }, {}),
        prixod_to: Math.max(organ.summa_to.summa, 0),
        rasxod_to: Math.max(-organ.summa_to.summa, 0),
      });
    }
    worksheet.eachRow((row, rowNumber) => {
      let bold = false;
      if (rowNumber < 6) {
        worksheet.getRow(rowNumber).height = 30;
        bold = true;
      }
      row.eachCell((cell, columnNumber) => {
        if (columnNumber === 1) {
          worksheet.getColumn(columnNumber).width = 40;
        } else {
          worksheet.getColumn(columnNumber).width = 18;
        }
        Object.assign(cell, {
          numFmt: "#0.00",
          font: { size: 13, name: "Times New Roman", bold },
          alignment: {
            vertical: "middle",
            horizontal: "center",
            wrapText: true,
          },
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
    });
    const filePath = path.join(
      __dirname,
      "../../../../public/exports/" + fileName
    );
    await workbook.xlsx.writeFile(filePath);
    return { filePath, fileName };
  }

  static async prixodReportExcel(data) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Hisobot");

    worksheet.mergeCells("A1", "G1");
    worksheet.getCell("A1").value =
      `${data.region.name} Фавқулодда вазиятлар бошкармаси`;

    worksheet.mergeCells("A2", "C2");
    worksheet.getCell("A2").value =
      `${data.report_title.name}  №  ${data.order}`;

    worksheet.mergeCells("D2", "G2");
    worksheet.getCell("D2").value = data.budjet.name;

    worksheet.mergeCells("A3", "G3");
    worksheet.getCell("A3").value = `${data.title} Счёт-№ ${data.schet}`;

    worksheet.mergeCells("A4", "G4");
    worksheet.getCell("A4").value =
      `от ${HelperFunctions.returnStringDate(new Date(data.from))} до ${HelperFunctions.returnStringDate(new Date(data.to))}`;

    worksheet.getRow(8).values = [
      "Номер документ",
      "Номер санаси",
      "Организатион",
      "ИНН",
      "Хисоб рақам",
      "Приход",
      "Счет",
      "Субсчет",
      "Договор номер",
      "Договор санаси",
      "описание",
    ];

    worksheet.columns = [
      { key: "doc_num", width: 20 },
      { key: "doc_date", width: 20 },
      { key: "organ", width: 40 },
      { key: "inn", width: 20 },
      { key: "account_number", width: 30 },
      { key: "prixod", width: 30 },
      { key: "schet", width: 20 },
      { key: "sub_schet", width: 20 },
      { key: "contract_doc_num", width: 20 },
      { key: "contract_doc_date", width: 20 },
      { key: "comment", width: 60 },
    ];

    let column = 8;

    for (let doc of data.docs) {
      worksheet.addRow({
        doc_num: doc.doc_num,
        doc_date: HelperFunctions.returnLocalDate(new Date(doc.doc_date)),
        organ: doc.name,
        inn: doc.inn,
        account_number: doc.account_number || "",
        prixod: doc.summa,
        schet: doc.schet,
        sub_schet: doc.sub_schet,
        contract_doc_num: doc.contract_doc_num || "",
        contract_doc_date: doc.contract_doc_date
          ? HelperFunctions.returnLocalDate(new Date(doc.contract_doc_date))
          : "",
        comment: doc.comment || "",
      });
      column++;
    }

    column++;
    worksheet.mergeCells(`A${column}`, `E${column}`);
    const itogoTitleCell = worksheet.getCell(`A${column}`);
    itogoTitleCell.value = `ВСЕГО`;
    itogoTitleCell.note = JSON.stringify({
      bold: true,
      horizontal: "left",
    });

    const itogoPrixodCell = worksheet.getCell(`F${column}`);
    itogoPrixodCell.value = data.prixod_summa;
    itogoPrixodCell.note = JSON.stringify({
      bold: true,
    });
    column += 2;

    for (let podpis of data.podpis) {
      worksheet.mergeCells(`A${column}`, `B${column}`);
      const positionCell = worksheet.getCell(`A${column}`);
      positionCell.value = podpis.position;
      positionCell.note = JSON.stringify({
        horizontal: "left",
      });

      worksheet.mergeCells(`C${column}`, `D${column}`);
      const fioCell = worksheet.getCell(`C${column}`);
      fioCell.value = podpis.fio;
      fioCell.note = JSON.stringify({
        horizontal: "left",
        height: 30,
      });
      column += 4;
    }

    // css
    worksheet.eachRow((row, rowNumber) => {
      let bold = false;
      let horizontal = "center";
      let height = 25;
      let argb = "FFFFFFFF";

      if (rowNumber === 1) {
        height = 50;
      }

      if (rowNumber > 1 && rowNumber < 9) {
        height = 30;
      }

      if (rowNumber < 9) {
        bold = true;
      }

      if (rowNumber === 4) {
        horizontal = "left";
      }

      worksheet.getRow(rowNumber).height = height;

      row.eachCell((cell, column) => {
        const cellData = cell.note ? JSON.parse(cell.note) : {};

        if (column === 6 && rowNumber > 8 && !cellData.horizontal) {
          horizontal = "right";
        } else if (column > 6 && rowNumber > 8) {
          horizontal = "center";
        }

        if (cellData.bold) {
          bold = true;
        }

        if (cellData.horizontal) {
          horizontal = cellData.horizontal;
        }

        if (cellData.height) {
          worksheet.getRow(rowNumber).height = cellData.height;
        }

        Object.assign(cell, {
          numFmt: "#,##0.00",
          font: { size: 13, name: "Times New Roman", bold },
          alignment: {
            vertical: "middle",
            horizontal,
            wrapText: true,
          },
          fill: {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb },
          },

          border: {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          },
        });

        // clean note
        if (cell.note) {
          cell.note = undefined;
        }
      });
    });

    const fileName = `${data.file_name}_prixod_report_${new Date().getTime()}.xlsx`;
    const folder_path = path.join(__dirname, "../../../../../public/exports");

    try {
      await access(folder_path, constants.W_OK);
    } catch (error) {
      await mkdir(folder_path);
    }

    const filePath = `${folder_path}/${fileName}`;

    await workbook.xlsx.writeFile(filePath);

    return { fileName, filePath };
  }

  static async consolidatedByContractExcel(data) {
    const workbook = new ExcelJS.Workbook();
    const fileName = `consolidated_${new Date().getTime()}.xlsx`;
    const worksheet = workbook.addWorksheet("consolelidated");
    worksheet.mergeCells(`A1`, "C1");
    worksheet.getCell("A1").value = "Мемориал ордер N_3";
    worksheet.mergeCells(`A2`, "C2");
    worksheet.getCell("A2").value = `"Расчеты с дебеторами и кредиторами"`;
    worksheet.mergeCells(`A3`, "C3");
    worksheet.getCell("A3").value =
      `${returnStringDate(new Date(data.to))} холатига  ${data.schet}`;
    worksheet.mergeCells(`A4`, "A5");
    worksheet.mergeCells(`B4`, "C4");
    worksheet.getCell("B4").value = `Остаток к начало`;
    worksheet.mergeCells(`D4`, "E4");
    worksheet.getCell("D4").value = "Договор ";
    worksheet.getCell("F4").value = "Дебет";
    const endRasxodSchetsColumn = data.rasxodSchets.length + 6;
    worksheet.mergeCells(
      `G4`,
      `${returnExcelColumn([endRasxodSchetsColumn])}4`
    );
    worksheet.getCell("G4").value = "Кредит счета";
    worksheet.mergeCells(
      `${returnExcelColumn([endRasxodSchetsColumn + 1])}4`,
      `${returnExcelColumn([endRasxodSchetsColumn + 2])}4`
    );
    worksheet.getCell(
      `${returnExcelColumn([endRasxodSchetsColumn + 1])}4`
    ).value = "Остаток к конец";
    worksheet.getRow(5).values = [
      "Организатсия",
      "Номер",
      "Дата",
      "Дебет",
      "Кредит",
      data.schet,
      ...data.rasxodSchets.map((item) => {
        if (item.schet === "itogo_rasxod") {
          return "итого кредит";
        } else {
          return item.schet;
        }
      }),
      "Дебет",
      "Кредит",
    ];
    worksheet.columns = [
      { key: "name" },
      { key: "contract_number" },
      { key: "contract_date" },
      { key: "prixod_from" },
      { key: "rasxod_from" },
      { key: `_prixod_${data.schet}` },
      ...data.rasxodSchets.map((item) => {
        return { key: `_rasxod_${item.schet}` };
      }),
      { key: "prixod_to" },
      { key: "rasxod_to" },
    ];
    for (let organ of data.organizations) {
      if (organ.summa_from.summa === 0 && organ.summa_to.summa === 0) {
        continue;
      }
      const values = data.rasxodSchets.reduce((acc, item) => {
        const schetKey = `_rasxod_${item.schet}`;
        const matchAkt = organ.summa_akt_rasxod.find(
          (i) => i.schet === item.schet
        );
        const matchBankPrixod = organ.summa_bank_prixod_rasxod.find(
          (i) => i.schet === item.schet
        );
        const matchJur7 = organ.summa_jur7_rasxod.find(
          (i) => i.schet === item.schet
        );
        if (
          !matchAkt &&
          !matchBankPrixod &&
          !matchJur7 &&
          item.schet !== "itogo_rasxod"
        ) {
          acc.push({ schet: schetKey, summa: "" });
        }
        if (matchAkt) acc.push({ schet: schetKey, summa: matchAkt.summa });
        if (matchBankPrixod)
          acc.push({ schet: schetKey, summa: matchBankPrixod.summa });
        if (matchJur7) acc.push({ schet: schetKey, summa: matchJur7.summa });
        if (item.schet === "itogo_rasxod") {
          acc.push({
            schet: schetKey,
            summa: organ.itogo_rasxod.summa,
          });
        }
        return acc;
      }, []);
      worksheet.addRow({
        name: organ.name,
        contract_number: organ.doc_num,
        contract_date: organ.doc_date,
        prixod_from: Math.max(organ.summa_from.summa, 0),
        rasxod_from: Math.max(-organ.summa_from.summa, 0),
        [`_prixod_${data.schet}`]:
          organ.summa_bank_rasxod_prixod[0]?.summa || "",
        ...values.reduce((acc, { schet, summa }) => {
          acc[schet] = summa;
          return acc;
        }, {}),
        prixod_to: Math.max(organ.summa_to.summa, 0),
        rasxod_to: Math.max(-organ.summa_to.summa, 0),
      });
    }
    worksheet.eachRow((row, rowNumber) => {
      let bold = false;
      if (rowNumber < 6) {
        worksheet.getRow(rowNumber).height = 30;
        bold = true;
      }
      row.eachCell((cell, columnNumber) => {
        if (columnNumber === 1) {
          worksheet.getColumn(columnNumber).width = 40;
        } else {
          worksheet.getColumn(columnNumber).width = 18;
        }
        Object.assign(cell, {
          numFmt: "#0.00",
          font: { size: 13, name: "Times New Roman", bold },
          alignment: {
            vertical: "middle",
            horizontal: "center",
            wrapText: true,
          },
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
    });
    const filePath = path.join(
      __dirname,
      "../../../../public/exports/" + fileName
    );
    await workbook.xlsx.writeFile(filePath);
    return { filePath, fileName };
  }
};
