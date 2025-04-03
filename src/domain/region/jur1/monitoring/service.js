const { KassaMonitoringDB } = require("./db");
const ExcelJS = require("exceljs");
const fs = require("fs").promises;
const path = require("path");
const { HelperFunctions } = require("@helper/functions");

exports.KassaMonitoringService = class {
  static async getSumma(data) {
    const summa = await KassaMonitoringDB.getSumma(
      [data.region_id, data.main_schet_id],
      null,
      null,
      { from: data.from, to: data.to }
    );

    return summa;
  }

  static async get(data) {
    const result = await KassaMonitoringDB.get(
      [
        data.region_id,
        data.main_schet_id,
        data.from,
        data.to,
        data.offset,
        data.limit,
      ],
      data.search,
      data.order_by,
      data.order_type
    );
    let page_prixod_sum = 0;
    let page_rasxod_sum = 0;
    for (let item of result.data) {
      page_prixod_sum += item.prixod_sum;
      page_rasxod_sum += item.rasxod_sum;
    }

    const summa_from = await KassaMonitoringDB.getSumma(
      [data.region_id, data.main_schet_id],
      "<",
      data.search,
      { from: data.from }
    );

    const summa_to = await KassaMonitoringDB.getSumma(
      [data.region_id, data.main_schet_id],
      "<=",
      data.search,
      { to: data.to }
    );

    return {
      data: result.data || [],
      total_count: result.total_count,
      prixod_sum: result.prixod_sum,
      rasxod_sum: result.rasxod_sum,
      page_prixod_sum,
      page_rasxod_sum,
      page_total_sum: page_prixod_sum - page_rasxod_sum,
      summa_from,
      summa_to,
    };
  }

  static async cap(data) {
    let result = await KassaMonitoringDB.capData([
      data.main_schet_id,
      data.from,
      data.to,
      data.region_id,
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

  static async daysReport(data) {
    const result = await KassaMonitoringDB.daysReport([
      data.main_schet_id,
      data.from,
      data.to,
      data.region_id,
    ]);

    const summa_from = await KassaMonitoringDB.getSumma(
      [data.region_id, data.main_schet_id, data.from],
      "<"
    );

    const summa_to = await KassaMonitoringDB.getSumma(
      [data.region_id, data.main_schet_id, data.to],
      "<="
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

    return { ...result, summa_from, summa_to };
  }

  static async prixodReport(data) {
    const result = await KassaMonitoringDB.prixodReport([
      data.main_schet_id,
      data.from,
      data.to,
      data.region_id,
    ]);

    let prixod_summa = 0;
    for (let prixod of result) {
      prixod_summa += prixod.summa;
    }

    return { docs: result, prixod_summa };
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
      "ФИО",
      "Раён",
      "Приход",
      "Счет",
      "Субсчет",
      "Описание",
    ];

    worksheet.columns = [
      { key: "doc_num", width: 20 },
      { key: "doc_date", width: 20 },
      { key: "fio", width: 40 },
      { key: "rayon", width: 20 },
      { key: "prixod", width: 30 },
      { key: "schet", width: 20 },
      { key: "sub_schet", width: 20 },
      { key: "comment", width: 60 },
    ];

    let column = 8;

    for (let doc of data.docs) {
      worksheet.addRow({
        doc_num: doc.doc_num,
        doc_date: HelperFunctions.returnLocalDate(new Date(doc.doc_date)),
        fio: doc.fio,
        rayon: doc.rayon,
        prixod: doc.summa,
        rasxod: 0,
        schet: doc.schet,
        sub_schet: doc.sub_schet,
        comment: doc.comment || "",
      });
      column++;
    }
    column += 2;

    worksheet.mergeCells(`A${column}`, `D${column}`);
    const itogoTitleCell = worksheet.getCell(`A${column}`);
    itogoTitleCell.value = `ВСЕГО`;
    itogoTitleCell.note = JSON.stringify({
      bold: true,
      horizontal: "left",
    });

    const itogoPrixodCell = worksheet.getCell(`E${column}`);
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

        if (
          (column === 5 || column === 6) &&
          rowNumber > 8 &&
          !cellData.horizontal
        ) {
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
      await fs.access(folder_path, fs.constants.W_OK);
    } catch (error) {
      await fs.mkdir(folder_path);
    }

    const filePath = `${folder_path}/${fileName}`;

    await workbook.xlsx.writeFile(filePath);

    return { fileName, filePath };
  }
};
