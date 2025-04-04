const { Jur7MonitoringDB } = require("./db");
const ExcelJS = require("exceljs");
const path = require("path");
const { HelperFunctions } = require("@helper/functions");
const { REPORT_RASXOD_SCHET } = require("@helper/constants");
const { access, constants, mkdir } = require("fs").promises;

exports.Jur7MonitoringService = class {
  static async cap(data) {
    const date = HelperFunctions.getMonthStartEnd({
      year: data.year,
      month: data.month,
    });

    let result = await Jur7MonitoringDB.capData([
      data.region_id,
      date[0],
      date[1],
      data.budjet_id,
    ]);

    result = result.reduce((acc, item) => {
      const key = `${item.debet_schet}-${item.kredit_schet}`;

      if (!acc[key]) {
        acc[key] = { summa: 0, items: [] };
      }

      acc[key].summa += item.summa;
      acc[key].items.push(item);
      return acc;
    }, {});

    result.summa = 0;

    for (let key in result) {
      if (key !== "summa") {
        result.summa += result[key].summa;
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
    worksheet.getCell("A3").value = `${data.title}`;

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
        const rasxod_schets = rasxod.split("-");

        worksheet.addRow({
          prixod: rasxod_schets[0],
          rasxod: rasxod_schets[1],
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
    let rasxod_summa = 0;
    const rasxods = [];

    for (let rasxod in data.rasxods) {
      const schet = rasxod.split("-")[0];

      if (
        rasxod !== "summa" &&
        data.rasxods[rasxod].summa !== 0 &&
        schet === REPORT_RASXOD_SCHET[1]
      ) {
        rasxods.push(...data.rasxods[rasxod].items);
      }
    }

    if (rasxods.length) {
      worksheet.mergeCells(`E6`, `G6`);
      const titleCelll = worksheet.getCell(`E6`);
      titleCelll.value = `${REPORT_RASXOD_SCHET[1]}-счёт суммаси расшифровкаси`;
      titleCelll.note = JSON.stringify({
        bold: true,
        horizontal: "center",
      });

      for (let item of rasxods) {
        const r_prixodCell = worksheet.getCell(`E${rasxod_column}`);
        r_prixodCell.value = item.debet_schet;
        r_prixodCell.note = JSON.stringify({
          horizontal: "center",
        });

        const r_rasxodCell = worksheet.getCell(`F${rasxod_column}`);
        r_rasxodCell.value = item.debet_sub_schet;
        r_rasxodCell.note = JSON.stringify({
          horizontal: "center",
        });

        const r_summaCell = worksheet.getCell(`G${rasxod_column}`);
        r_summaCell.value = item.summa;
        r_summaCell.note = JSON.stringify({
          horizontal: "right",
        });

        rasxod_column++;
        rasxod_summa += item.summa;
      }

      worksheet.mergeCells(`E${rasxod_column}`, `F${rasxod_column}`);
      const rasxodTitleCell = worksheet.getCell(`E${rasxod_column}`);
      rasxodTitleCell.value = `Кредит буйича жами:`;
      rasxodTitleCell.note = JSON.stringify({
        bold: true,
        horizontal: "left",
      });

      const rasxodCell = worksheet.getCell(`G${rasxod_column}`);
      rasxodCell.value = rasxod_summa;
      rasxodCell.note = JSON.stringify({
        bold: true,
        horizontal: "right",
      });
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

  static async materialReport(data) {
    const dates = HelperFunctions.getMonthStartEnd({
      year: data.year,
      month: data.month,
    });

    for (let responsible of data.responsibles) {
      responsible.schets = data.schets.map((item) => ({ ...item }));
      for (let schet of responsible.schets) {
        schet.products = await Jur7MonitoringDB.getBySchetProducts([
          data.region_id,
          data.budjet_id,
          schet.schet,
          responsible.id,
        ]);

        schet.kol_from = 0;
        schet.summa_from = 0;
        schet.kol_prixod = 0;
        schet.prixod = 0;
        schet.kol_rasxod = 0;
        schet.rasxod = 0;
        schet.kol_to = 0;
        schet.summa_to = 0;
        for (let product of schet.products) {
          product.summa_from = await Jur7MonitoringDB.getSummaReport(
            [data.budjet_id, schet.schet, dates[0]],
            "<",
            responsible.id,
            product.id
          );
          product.internal = await Jur7MonitoringDB.getSummaReport(
            [data.budjet_id, schet.schet, dates[0], dates[1]],
            null,
            responsible.id,
            product.id
          );
          product.summa_to = await Jur7MonitoringDB.getSummaReport(
            [data.budjet_id, schet.schet, dates[1]],
            "<=",
            responsible.id,
            product.id
          );
          schet.kol_from += product.summa_from.kol;
          schet.summa_from += product.summa_from.summa;
          schet.kol_prixod += product.internal.prixod_kol;
          schet.prixod += product.internal.prixod;
          schet.kol_rasxod += product.internal.rasxod_kol;
          schet.rasxod += product.internal.rasxod;
          schet.kol_to += product.summa_to.kol;
          schet.summa_to += product.summa_to.summa;
        }
      }
    }

    return data.responsibles;
  }

  static async materialExcel(data) {
    const Workbook = new ExcelJS.Workbook();
    const worksheet = Workbook.addWorksheet("material");

    worksheet.mergeCells("G1", "K1");
    const title1 = worksheet.getCell("G1");
    title1.value = '"Тасдиқлайман"';

    worksheet.mergeCells("G2", "K2");
    const title2 = worksheet.getCell("G2");
    title2.value = data.region.name;

    worksheet.mergeCells("G3", "K3");
    const title3 = worksheet.getCell("G3");
    title3.value = "бошлиғи";

    worksheet.mergeCells("G4", "K4");
    const title4 = worksheet.getCell("G4");
    title4.value = "";

    worksheet.mergeCells("A5", "K5");
    const title5 = worksheet.getCell("A5");
    title5.value = `Материалный отчёт за ${HelperFunctions.returnMonth(data.month)} ${data.year} год.`;

    const productTitleCell = worksheet.getCell("A6");
    productTitleCell.value = "Назвал предмет";

    const edinTitleCell = worksheet.getCell("B6");
    edinTitleCell.value = "Ед.ном";

    worksheet.mergeCells("C6", "D6");
    const fromCell = worksheet.getCell("C6");
    fromCell.value = "ОСТАТОК на нач";

    worksheet.mergeCells("E6", "H6");
    const oborotCell = worksheet.getCell("E6");
    oborotCell.value = "ОБОРОТ";

    worksheet.mergeCells("I6", "J6");
    const toCell = worksheet.getCell("I6");
    toCell.value = "ОСТАТОК на кон";

    const date_prixod = worksheet.getCell("K6");
    date_prixod.value = "Дата приход";

    worksheet.getRow(7).values = [
      "",
      "",
      "Кол",
      "Остаток",
      "Кол",
      "Приход",
      "Кол",
      "Расход",
      "Кол",
      "Остаток",
    ];

    worksheet.columns = [
      { key: "product_name", width: 30 },
      { key: "edin", width: 15 },
      { key: "from_kol", width: 15 },
      { key: "from_summa", width: 15 },
      { key: "prixod_kol", width: 15 },
      { key: "prixod", width: 15 },
      { key: "rasxod_kol", width: 15 },
      { key: "rasxod", width: 15 },
      { key: "to_kol", width: 15 },
      { key: "to_summa", width: 15 },
      { key: "date", width: 15 },
    ];

    for (let responsible of data.responsibles) {
      for (let schet of responsible.schets) {
        if (schet.products.length) {
          worksheet.addRow({});
          worksheet.addRow({ product_name: responsible.fio });
          worksheet.addRow({ product_name: `Счет ${schet.schet}` });
          for (let product of schet.products) {
            worksheet.addRow({
              product_name: product.name,
              edin: product.edin,
              from_kol: product.summa_from.kol,
              from_summa: product.summa_from.summa,
              prixod_kol: product.internal.prixod_kol,
              prixod: product.internal.prixod,
              rasxod_kol: product.internal.rasxod_kol,
              rasxod: product.internal.rasxod,
              to_kol: product.summa_to.kol,
              to_summa: product.summa_to.summa,
              date: product.doc_date,
            });
          }
          worksheet.addRow({
            product_name: "",
            edin: "",
            from_kol: schet.kol_from,
            from_summa: schet.summa_from,
            prixod_kol: schet.kol_prixod,
            prixod: schet.prixod,
            rasxod_kol: schet.kol_rasxod,
            rasxod: schet.rasxod,
            to_kol: schet.kol_to,
            to_summa: schet.summa_to,
            date: undefined,
          });
        }
      }
    }
    worksheet.eachRow((row, rowNumber) => {
      let size = 12;
      let bold = false;
      let horizontal = "center";
      let border = {
        top: { style: "thin", color: { argb: "FFD3D3D3" } },
        left: { style: "thin", color: { argb: "FFD3D3D3" } },
        bottom: { style: "thin", color: { argb: "FFD3D3D3" } },
        right: { style: "thin", color: { argb: "FFD3D3D3" } },
      };
      if (rowNumber < 6) {
        worksheet.getRow(rowNumber).height = 25;
        bold = true;
      }
      if (rowNumber === 3) {
        horizontal = "left";
      }
      if (rowNumber === 4) {
        border = {
          top: { style: "thin", color: { argb: "FFD3D3D3" } },
          left: { style: "thin", color: { argb: "FFD3D3D3" } },
          bottom: { style: "thin" },
          right: { style: "thin", color: { argb: "FFD3D3D3" } },
        };
      }
      row.eachCell((cell) => {
        if (rowNumber > 5 && cell.value !== "" && cell.value !== undefined) {
          border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        }
        Object.assign(cell, {
          font: {
            size,
            bold,
            color: { argb: "FF000000" },
            name: "Times New Roman",
          },
          alignment: { vertical: "middle", horizontal },
          fill: {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFFFFFFF" },
          },
          border,
        });
      });
    });

    const folder_path = path.join(__dirname, "../../../../../public/exports");
    const fileName = `material_${new Date().getTime()}.xlsx`;

    try {
      await access(folder_path, constants.W_OK);
    } catch (error) {
      await mkdir(folder_path);
    }

    const filePath = `${folder_path}/${fileName}`;
    await Workbook.xlsx.writeFile(filePath);

    return { fileName, filePath };
  }

  static async getSchets(data) {
    const result = await Jur7MonitoringDB.getSchets([
      data.year,
      data.month,
      data.region_id,
      data.budjet_id,
    ]);

    const dates = HelperFunctions.getMonthStartEnd({
      year: data.year,
      month: data.month,
    });

    for (let schet of result) {
      schet.summa_from = await Jur7MonitoringDB.getSummaReport(
        [data.budjet_id, schet.schet, dates[0]],
        "<"
      );
      schet.internal = await Jur7MonitoringDB.getSummaReport([
        data.budjet_id,
        schet.schet,
        dates[0],
        dates[1],
      ]);
      schet.summa_to = await Jur7MonitoringDB.getSummaReport(
        [data.budjet_id, schet.schet, dates[1]],
        "<="
      );
    }

    return result;
  }

  static async getSaldoDate(data) {
    const result = await Jur7MonitoringDB.getSaldoDate(
      [data.region_id, data.budjet_id],
      data.year
    );

    return result;
  }
};
