const { Jur7MonitoringDB } = require("./db");
const ExcelJS = require("exceljs");
const path = require("path");
const { HelperFunctions } = require("@helper/functions");
const { REPORT_RASXOD_SCHET } = require("@helper/constants");
const { access, constants, mkdir } = require("fs").promises;

exports.Jur7MonitoringService = class {
  static async monitoring(data) {
    const result = await Jur7MonitoringDB.monitoring(
      [
        data.region_id,
        data.from,
        data.to,
        data.main_schet_id,
        data.offset,
        data.limit,
      ],
      data.order_by,
      data.order_type,
      data.search
    );
    let page_prixod_sum = 0;
    let page_rasxod_sum = 0;

    for (let doc of result.data) {
      page_prixod_sum += doc.summa_prixod;
      page_rasxod_sum += doc.summa_rasxod;
    }

    return { ...result, page_prixod_sum, page_rasxod_sum };
  }

  static async cap(data) {
    const date = HelperFunctions.getMonthStartEnd({
      year: data.year,
      month: data.month,
    });

    let result = await Jur7MonitoringDB.capData([
      data.region_id,
      date[0],
      date[1],
      data.main_schet_id,
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
      for (let schet of responsible.products) {
        if (schet.products.length) {
          worksheet.addRow({});
          const rowFio = worksheet.addRow({ product_name: responsible.fio });
          const rowSchet = worksheet.addRow({
            product_name: `Счет ${schet.schet}`,
          });

          const fioIndex = rowFio.values.findIndex(
            (v) => v === responsible.fio
          );
          if (fioIndex !== -1) {
            rowFio.getCell(fioIndex).note = JSON.stringify({ bold: true });
          }

          const schetText = `Счет ${schet.schet}`;
          const schetIndex = rowSchet.values.findIndex((v) => v === schetText);
          if (schetIndex !== -1) {
            rowSchet.getCell(schetIndex).note = JSON.stringify({ bold: true });
          }

          for (let product of schet.products) {
            worksheet.addRow({
              product_name: product.name,
              edin: product.edin,
              from_kol: Math.round(product.from.kol * 100) / 100,
              from_summa: Math.round(product.from.summa * 100) / 100,
              prixod_kol: Math.round(product.internal.prixod_kol * 100) / 100,
              prixod: Math.round(product.internal.prixod_summa * 100) / 100,
              rasxod_kol: Math.round(product.internal.rasxod_kol * 100) / 100,
              rasxod: Math.round(product.internal.rasxod_summa * 100) / 100,
              to_kol: Math.round(product.to.kol * 100) / 100,
              to_summa: Math.round(product.to.summa * 100) / 100,
              date: product.doc_date,
            });
          }

          const schetRow = worksheet.addRow({
            product_name: "Счет итого",
            edin: "",
            from_kol: schet.itogo.from_kol,
            from_summa: schet.itogo.from_summa,
            prixod_kol: schet.itogo.prixod_kol,
            prixod: schet.itogo.prixod_summa,
            rasxod_kol: schet.itogo.rasxod_kol,
            rasxod: schet.itogo.rasxod_summa,
            to_kol: schet.itogo.to_kol,
            to_summa: schet.itogo.to_summa,
            date: undefined,
          });

          for (let i = 1; i < schetRow.values.length; i++) {
            schetRow.getCell(i).note = JSON.stringify({ bold: true });
          }
        }
      }
    }

    worksheet.addRow({});
    const itogoRow = worksheet.addRow({
      product_name: "итого",
      edin: "",
      from_kol: data.itogo.from_kol,
      from_summa: data.itogo.from_summa,
      prixod_kol: data.itogo.prixod_kol,
      prixod: data.itogo.prixod_summa,
      rasxod_kol: data.itogo.rasxod_kol,
      rasxod: data.itogo.rasxod_summa,
      to_kol: data.itogo.to_kol,
      to_summa: data.itogo.to_summa,
      date: undefined,
    });

    for (let i = 1; i < itogoRow.values.length; i++) {
      itogoRow.getCell(i).note = JSON.stringify({ bold: true });
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
      if (rowNumber < 8) {
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
        const cellData = cell.note ? JSON.parse(cell.note) : {};

        if (cellData.bold) {
          bold = true;
        }

        if (rowNumber > 5 && cell.value !== "" && cell.value !== undefined) {
          border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        }

        Object.assign(cell, {
          numFmt: "#,##0.00",
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

  static async materialExcelWithIznos(data) {
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

    worksheet.mergeCells("L6", "P6");
    const toIznosCell = worksheet.getCell("L6");
    toIznosCell.value = "ОСТАТОК на кон";

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
      "",
      "Сальдо износ",
      "Приход",
      "Износ сумма",
      "Расход",
      "Сальдо износ",
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
      { key: "from_iznos", width: 15 },
      { key: "prixod_iznos", width: 15 },
      { key: "month_iznos", width: 15 },
      { key: "rasxod_iznos", width: 15 },
      { key: "to_iznos", width: 15 },
    ];

    for (let responsible of data.responsibles) {
      for (let schet of responsible.products) {
        if (schet.products.length) {
          worksheet.addRow({});
          const rowFio = worksheet.addRow({ product_name: responsible.fio });
          const rowSchet = worksheet.addRow({
            product_name: `Счет ${schet.schet}`,
          });

          const fioIndex = rowFio.values.findIndex(
            (v) => v === responsible.fio
          );
          if (fioIndex !== -1) {
            rowFio.getCell(fioIndex).note = JSON.stringify({ bold: true });
          }

          const schetText = `Счет ${schet.schet}`;
          const schetIndex = rowSchet.values.findIndex((v) => v === schetText);
          if (schetIndex !== -1) {
            rowSchet.getCell(schetIndex).note = JSON.stringify({ bold: true });
          }

          for (let product of schet.products) {
            worksheet.addRow({
              product_name: product.name,
              edin: product.edin,
              from_kol: Math.round(product.from.kol * 100) / 100,
              from_summa: Math.round(product.from.summa * 100) / 100,
              prixod_kol: Math.round(product.internal.prixod_kol * 100) / 100,
              prixod: Math.round(product.internal.prixod_summa * 100) / 100,
              rasxod_kol: Math.round(product.internal.rasxod_kol * 100) / 100,
              rasxod: Math.round(product.internal.rasxod_summa * 100) / 100,
              to_kol: Math.round(product.to.kol * 100) / 100,
              to_summa: Math.round(product.to.summa * 100) / 100,
              date: product.doc_date,
              from_iznos: Math.round(product.from.iznos_summa * 100) / 100,
              prixod_iznos:
                Math.round(product.internal.prixod_iznos_summa * 100) / 100,
              month_iznos: Math.round(product.to.month_iznos * 100) / 100,
              rasxod_iznos:
                Math.round(product.internal.rasxod_iznos_summa * 100) / 100,
              to_iznos: product.to.iznos_summa,
            });
          }

          const schetRow = worksheet.addRow({
            product_name: "Счет итого",
            edin: "",
            from_kol: schet.itogo.from_kol,
            from_summa: schet.itogo.from_summa,
            prixod_kol: schet.itogo.prixod_kol,
            prixod: schet.itogo.prixod_summa,
            rasxod_kol: schet.itogo.rasxod_kol,
            rasxod: schet.itogo.rasxod_summa,
            to_kol: schet.itogo.to_kol,
            to_summa: schet.itogo.to_summa,
            date: undefined,
            from_iznos: Math.round(schet.itogo.from_iznos_summa * 100) / 100,
            prixod_iznos:
              Math.round(schet.itogo.prixod_iznos_summa * 100) / 100,
            month_iznos: Math.round(schet.itogo.month_iznos * 100) / 100,
            rasxod_iznos:
              Math.round(schet.itogo.rasxod_iznos_summa * 100) / 100,
            to_iznos: schet.itogo.to_iznos_summa,
          });

          for (let i = 1; i < schetRow.values.length; i++) {
            schetRow.getCell(i).note = JSON.stringify({ bold: true });
          }
        }
      }
    }

    worksheet.addRow({});
    const itogoRow = worksheet.addRow({
      product_name: "итого",
      edin: "",
      from_kol: data.itogo.from_kol,
      from_summa: data.itogo.from_summa,
      prixod_kol: data.itogo.prixod_kol,
      prixod: data.itogo.prixod_summa,
      rasxod_kol: data.itogo.rasxod_kol,
      rasxod: data.itogo.rasxod_summa,
      to_kol: data.itogo.to_kol,
      to_summa: data.itogo.to_summa,
      date: undefined,
      from_iznos: Math.round(data.itogo.from_iznos_summa * 100) / 100,
      prixod_iznos: Math.round(data.itogo.prixod_iznos_summa * 100) / 100,
      month_iznos: Math.round(data.itogo.month_iznos * 100) / 100,
      rasxod_iznos: Math.round(data.itogo.rasxod_iznos_summa * 100) / 100,
      to_iznos: data.itogo.to_iznos_summa,
    });

    for (let i = 1; i < itogoRow.values.length; i++) {
      itogoRow.getCell(i).note = JSON.stringify({ bold: true });
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

      if (rowNumber < 8) {
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
        const cellData = cell.note ? JSON.parse(cell.note) : {};

        if (cellData.bold) {
          bold = true;
        }

        if (rowNumber > 5 && cell.value !== "" && cell.value !== undefined) {
          border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        }

        Object.assign(cell, {
          numFmt: "#,##0.00",
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

        // clean note
        if (cell.note) {
          cell.note = undefined;
        }
      });
    });

    const folder_path = path.join(__dirname, "../../../../../public/exports");
    const fileName = `material_iznos_${new Date().getTime()}.xlsx`;

    try {
      await access(folder_path, constants.W_OK);
    } catch (error) {
      await mkdir(folder_path);
    }

    const filePath = `${folder_path}/${fileName}`;
    await Workbook.xlsx.writeFile(filePath);

    return { fileName, filePath };
  }

  static async history(data) {
    const result = await Jur7MonitoringDB.history(
      [data.from, data.to, data.region_id, data.main_schet_id],
      data.responsible_id
    );

    return result;
  }

  static async getMaterial(data) {
    const result = await Jur7MonitoringDB.getMaterial(
      [data.year, data.month, data.region_id, data.main_schet_id],
      data.responsible_id
    );

    return result;
  }

  static async getSaldoDate(data) {
    const result = await Jur7MonitoringDB.getSaldoDate(
      [data.region_id, data.main_schet_id, data.main_schet_id],
      data.year
    );

    return result;
  }

  static async history(data) {
    const history = await Jur7MonitoringDB.history(
      [data.from, data.to, data.region_id, data.main_schet_id],
      data.responsible_id
    );

    return history;
  }
};
