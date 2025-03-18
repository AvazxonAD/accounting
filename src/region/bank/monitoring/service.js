const { BankMonitoringDB } = require("./db");
const {
  returnStringSumma,
  returnStringDate,
  HelperFunctions,
  returnSleshDate,
} = require("@helper/functions");
const { REPORT_RASXOD_SCHET } = require("@helper/constants");
const ExcelJS = require("exceljs");
const path = require("path");
const { mkdir, constants, access } = require("fs").promises;

exports.BankMonitoringService = class {
  static async get(data) {
    const result = await BankMonitoringDB.get(
      [
        data.region_id,
        data.main_schet_id,
        data.from,
        data.to,
        data.offset,
        data.limit,
      ],
      data.search
    );

    let page_prixod_sum = 0;
    let page_rasxod_sum = 0;
    for (let item of result.data) {
      page_prixod_sum += item.prixod_sum;
      page_rasxod_sum += item.rasxod_sum;
    }

    const summa_from = await BankMonitoringDB.getSumma(
      [data.region_id, data.main_schet_id, data.from],
      "<",
      data.search
    );

    const summa_to = await BankMonitoringDB.getSumma(
      [data.region_id, data.main_schet_id, data.to],
      "<=",
      data.search
    );

    return {
      summa_from,
      summa_to,
      data: result.data || [],
      total_count: result.total_count,
      page_prixod_sum,
      page_rasxod_sum,
      prixod_sum: result.prixod_sum,
      rasxod_sum: result.rasxod_sum,
      total_sum: result.prixod_sum - result.rasxod_sum,
      page_total_sum: page_prixod_sum - page_rasxod_sum,
    };
  }

  static async cap(data) {
    const result = await BankMonitoringDB.capData([
      data.main_schet_id,
      data.from,
      data.to,
      data.region_id,
    ]);

    result.prixods = result.prixods.reduce((acc, item) => {
      if (!acc[item.schet]) {
        acc[item.schet] = { summa: 0, items: [] };
      }
      acc[item.schet].summa += item.summa;
      acc[item.schet].items.push(item);
      return acc;
    }, {});

    result.rasxods = result.rasxods.reduce((acc, item) => {
      if (!acc[item.schet]) {
        acc[item.schet] = { summa: 0, items: [] };
      }
      acc[item.schet].summa += item.summa;
      acc[item.schet].items.push(item);
      return acc;
    }, {});

    let rasxodSumma = 0;
    let prixodSumma = 0;

    for (let rasxod in result.rasxods) {
      result.rasxods[rasxod].prixod = result.prixods[rasxod] || {};

      rasxodSumma += result.rasxods[rasxod].summa;
    }

    for (let prixod in result.prixods) {
      prixodSumma += result.prixods[prixod].summa;
    }

    result.rasxods.summa = rasxodSumma;
    result.prixods.summa = prixodSumma;

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
    worksheet.getCell("A2").value = `${data.report_title.name}  №  2`;

    worksheet.mergeCells("D2", "G2");
    worksheet.getCell("D2").value = data.budjet.name;

    worksheet.mergeCells("A3", "G3");
    worksheet.getCell("A3").value =
      `БАНК ХИСОБОТИ Счёт-№ ${data.main_schet.jur2_schet}`;

    worksheet.mergeCells("A4", "G4");
    worksheet.getCell("A4").value =
      `от ${returnStringDate(new Date(data.from))} до ${returnStringDate(new Date(data.to))}`;

    worksheet.getRow(6).values = [
      "Дебет",
      "Кредит",
      "Сумма",
      "",
      "Дебет",
      "Кредит",
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

    let column = 7;

    // prixod
    for (let prixod in data.prixods) {
      if (prixod !== "summa" && data.prixods[prixod].summa !== 0) {
        worksheet.addRow({
          prixod: data.main_schet.jur2_schet,
          rasxod: prixod,
          summa: data.prixods[prixod].summa,
        });
        column++;
      }
    }

    worksheet.mergeCells(`A${column}`, `B${column}`);
    const prixod = worksheet.getCell(`A${column}`);
    prixod.value = `Жами ДБ:`;
    prixod.note = JSON.stringify({
      bold: true,
      horizontal: "left",
    });

    worksheet.getCell(`C${column}`).value = data.prixods.summa;
    column++;

    // rasxod main
    for (let rasxod in data.rasxods) {
      if (rasxod !== "summa" && data.rasxods[rasxod].summa !== 0) {
        worksheet.addRow({
          prixod: rasxod,
          rasxod: data.main_schet.jur2_schet,
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

    worksheet.mergeCells(`A${column}`, `B${column}`);
    const internalCellTitle = worksheet.getCell(`A${column}`);
    internalCellTitle.value = `ЖАМИ оборот:`;
    internalCellTitle.note = JSON.stringify({
      bold: true,
      horizontal: "left",
    });

    worksheet.getCell(`C${column}`).value =
      data.prixods.summa - data.rasxods.summa;
    column += 2;

    let rasxod_column = 7;
    // deep rasxod
    for (let rasxod in data.rasxods) {
      if (
        rasxod !== "summa" &&
        data.rasxods[rasxod].summa !== 0 &&
        rasxod === REPORT_RASXOD_SCHET
      ) {
        // rasxod
        worksheet.mergeCells(`E5`, `G5`);
        const titleCelll = worksheet.getCell(`E5`);
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
        const prixodTitleCell = worksheet.getCell(`E${rasxod_column}`);
        prixodTitleCell.value = `Дебет буйича жами:`;
        prixodTitleCell.note = JSON.stringify({
          bold: true,
          horizontal: "left",
        });

        const rasxodCell = worksheet.getCell(`G${rasxod_column}`);
        rasxodCell.value = data.rasxods[rasxod].summa;
        rasxodCell.note = JSON.stringify({
          bold: true,
          horizontal: "right",
        });
        rasxod_column += 2;

        // prixod;
        const column1 = worksheet.getCell(`E${rasxod_column}`);
        column1.value = "Модда";
        column1.note = JSON.stringify({
          bold: true,
        });

        const column2 = worksheet.getCell(`F${rasxod_column}`);
        column2.value = "Статьяси";
        column2.note = JSON.stringify({
          bold: true,
        });

        const column3 = worksheet.getCell(`G${rasxod_column}`);
        column3.value = "Сумма";
        column3.note = JSON.stringify({
          bold: true,
        });
        rasxod_column++;

        if (data.rasxods[rasxod].prixod.items) {
          for (let item of data.rasxods[rasxod].prixod.items) {
            const column1 = worksheet.getCell(`E${rasxod_column}`);
            column1.value = item.schet;
            column1.note = JSON.stringify({
              horizontal: "center",
            });

            const column2 = worksheet.getCell(`F${rasxod_column}`);
            column2.value = item.sub_schet;
            column2.note = JSON.stringify({
              horizontal: "center",
            });

            const column3 = worksheet.getCell(`G${rasxod_column}`);
            column3.value = item.summa;
            column3.note = JSON.stringify({
              horizontal: "right",
            });
            rasxod_column++;
          }
        }

        worksheet.mergeCells(`E${rasxod_column}`, `F${rasxod_column}`);
        const rasxodTitleCell = worksheet.getCell(`E${rasxod_column}`);
        rasxodTitleCell.value = `Кредит буйича жами:`;
        rasxodTitleCell.note = JSON.stringify({
          bold: true,
          horizontal: "left",
        });

        const prixodCell = worksheet.getCell(`G${rasxod_column}`);
        prixodCell.value = data.rasxods[rasxod].prixod.summa || 0;
        prixodCell.note = JSON.stringify({
          bold: true,
          horizontal: "right",
        });
      }
    }

    let podpis_column = rasxod_column > column ? rasxod_column : column;
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

      if (rowNumber < 7) {
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

    const fileName = `bank_shapka_${new Date().getTime()}.xlsx`;
    const folder_path = path.join(__dirname, "../../../../public/exports");

    try {
      await access(folder_path, constants.W_OK);
    } catch (error) {
      await mkdir(folder_path);
    }

    const filePath = `${folder_path}/${fileName}`;

    await workbook.xlsx.writeFile(filePath);

    return { fileName, filePath };
  }

  static async daily(data) {
    const result = await BankMonitoringDB.daily([
      data.main_schet_id,
      data.from,
      data.to,
      data.region_id,
    ]);

    const balance_from = await BankMonitoringDB.dailySumma(
      [data.region_id, data.main_schet_id, data.from],
      "<"
    );

    const balance_to = await BankMonitoringDB.dailySumma(
      [data.region_id, data.main_schet_id, data.to],
      "<="
    );

    let prixod_summa = 0;
    let rasxod_summa = 0;

    for (let item of result) {
      prixod_summa += item.prixod_sum;
      rasxod_summa += item.rasxod_sum;
    }

    return {
      data: result,
      balance_from,
      balance_to,
      prixod_summa,
      rasxod_summa,
    };
  }

  static async dailyExcel(data) {
    const title = `Дневной отчет по ${data.report_title.name} №1. Счет: ${data.main_schet.jur1_schet}. Ҳисоб рақами: ${HelperFunctions.probelNumber(data.main_schet.account_number)}`;
    const dateBetween = `За период с ${returnStringDate(new Date(data.from))} по ${returnStringDate(new Date(data.to))}`;
    const workbook = new ExcelJS.Workbook();
    const fileName = `kundalik_hisobot_bank_${new Date().getTime()}.xlsx`;
    const worksheet = workbook.addWorksheet("Hisobot");

    worksheet.mergeCells("A1", "G1");
    const titleCell = worksheet.getCell("A1");
    Object.assign(titleCell, {
      value: title,
      font: {
        size: 10,
        bold: true,
        color: { argb: "FF000000" },
        name: "Times New Roman",
      },
      alignment: { vertical: "middle", horizontal: "left" },
    });

    worksheet.mergeCells("H1", "J1");
    const region = worksheet.getCell(`H1`);
    Object.assign(region, {
      value: data.region.name,
      font: { size: 10, color: { argb: "FF000000" }, name: "Times New Roman" },
      alignment: { vertical: "middle", horizontal: "center" },
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

    worksheet.mergeCells("A2", "G2");
    const dateCell = worksheet.getCell("A2");
    Object.assign(dateCell, {
      value: dateBetween,
      font: {
        size: 11,
        bold: true,
        color: { argb: "FF000000" },
        name: "Times New Roman",
      },
      alignment: { vertical: "middle", horizontal: "left" },
    });

    worksheet.mergeCells("A4", "G4");
    const balanceFromCell = worksheet.getCell("A4");
    balanceFromCell.value = `Остаток к началу дня: ${returnStringSumma(data.balance_from)}`;
    Object.assign(balanceFromCell, {
      font: {
        size: 11,
        bold: true,
        color: { argb: "FF000000" },
        name: "Times New Roman",
      },
      alignment: { vertical: "middle", horizontal: "left" },
    });

    const doc_num = worksheet.getCell("A5");
    const date = worksheet.getCell("B5");
    const comment = worksheet.getCell("C5");
    const schet = worksheet.getCell("D5");
    const prixod = worksheet.getCell("E5");
    const rasxod = worksheet.getCell("F5");
    date.value = `Дата`;
    comment.value = "Разъяснительный текст";
    doc_num.value = `№ док`;
    schet.value = `Счет`;
    prixod.value = "Приход";
    rasxod.value = "Расход";
    const headers = [date, comment, doc_num, schet, prixod, rasxod];
    headers.forEach((item) => {
      Object.assign(item, {
        font: { bold: true, size: 10, name: "Times New Roman" },
        alignment: { vertical: "middle", horizontal: "center", wrapText: true },
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
    let row_number = 5;
    for (let object of data.data) {
      object.docs.forEach((item) => {
        const doc_num = worksheet.getCell(`A${row_number + 1}`);
        const date = worksheet.getCell(`B${row_number + 1}`);
        const comment = worksheet.getCell(`C${row_number + 1}`);
        const schet = worksheet.getCell(`D${row_number + 1}`);
        const rasxod = worksheet.getCell(`F${row_number + 1}`);
        const prixod = worksheet.getCell(`E${row_number + 1}`);
        date.value = returnSleshDate(new Date(item.doc_date));
        comment.value = item.opisanie;
        doc_num.value = item.doc_num;
        schet.value = item.schet;
        prixod.value = item.prixod_sum;
        prixod.numFmt = "#,##0.00";
        rasxod.value = item.rasxod_sum;
        rasxod.numFmt = "#,##0.00";
        const array = [doc_num, date, comment, schet, rasxod, prixod];
        array.forEach((item, index) => {
          const alignment = { vertical: "middle" };
          if (index === 2) {
            alignment.horizontal = "left";
            alignment.wrapText = true;
          } else if (index === 4 || index === 5) {
            alignment.horizontal = "right";
          } else {
            alignment.horizontal = "center";
          }
          Object.assign(item, {
            alignment,
            font: { name: "Times New Roman" },
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
      });
      worksheet.mergeCells(`A${row_number + 1}`, `D${row_number + 1}`);
      const schet = worksheet.getCell(`A${row_number + 1}`);
      schet.value = `Итого по счету ${object.schet}`;
      const prixod_sum = worksheet.getCell(`E${row_number + 1}`);
      prixod_sum.value = object.prixod_sum;
      prixod_sum.numFmt = "#,##0.00";
      const rasxod_sum = worksheet.getCell(`F${row_number + 1}`);
      rasxod_sum.value = object.rasxod_sum;
      rasxod_sum.numFmt = "#,##0.00";
      const array = [schet, prixod_sum, rasxod_sum];
      array.forEach((item, index) => {
        let horizontal = `right`;
        if (index === 0) {
          horizontal = `left`;
        }
        Object.assign(item, {
          alignment: { vertical: "middle", horizontal },
          font: { name: "Times New Roman", bold: true, size: 9 },
        });
      });
      row_number++;
    }
    const itogo_prixod = worksheet.getCell(`E${row_number + 1}`);
    itogo_prixod.value = data.prixod_sum;
    const itogo_rasxod = worksheet.getCell(`F${row_number + 1}`);
    itogo_rasxod.value = data.rasxod_sum;
    const itogo_array = [itogo_prixod, itogo_rasxod];
    itogo_array.forEach((item) => {
      Object.assign(item, {
        numFmt: "#,##0.00",
        font: {
          size: 9,
          bold: true,
          color: { argb: "FF000000" },
          name: "Times New Roman",
        },
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
    worksheet.mergeCells(`A${row_number + 2}`, `H${row_number + 2}`);
    const balanceToCell = worksheet.getCell(`A${row_number + 2}`);
    balanceToCell.value = `Остаток концу дня: ${returnStringSumma(data.balance_to)}`;
    Object.assign(balanceToCell, {
      font: {
        size: 11,
        bold: true,
        color: { argb: "FF000000" },
        name: "Times New Roman",
      },
      alignment: { vertical: "middle", horizontal: "left" },
    });
    worksheet.getColumn(2).width = 10;
    worksheet.getColumn(3).width = 12;
    worksheet.getColumn(4).width = 10;
    worksheet.getColumn(5).width = 18;
    worksheet.getColumn(6).width = 18;
    worksheet.getColumn(7).width = 9;
    worksheet.getRow(1).height = 25;
    worksheet.getRow(2).height = 20;
    worksheet.getRow(5).height = 25;

    const folder_path = path.join(__dirname, "../../../../public/exports");

    try {
      await access(folder_path, constants.W_OK);
    } catch (error) {
      await mkdir(folder_path);
    }

    const filePath = `${folder_path}/${fileName}`;

    await workbook.xlsx.writeFile(filePath);

    return { fileName, filePath };
  }
};
