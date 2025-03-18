const { PodotchetMonitoringDB } = require("./db");
const ExcelJS = require("exceljs");
const { returnStringDate } = require("@helper/functions");
const path = require("path");

exports.PodotchetMonitoringService = class {
  static async cap(data) {
    const result = await PodotchetMonitoringDB.capData([
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
      `ОБ ОРГАНИЗАТИОН Счёт-№ ${data.main_schet.jur3_schet}`;

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

    const fileName = `Ob_organization_shapka_${new Date().getTime()}.xlsx`;
    const folder_path = path.join(__dirname, "../../../public/exports");

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
