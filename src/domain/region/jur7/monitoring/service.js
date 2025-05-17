const { Jur7MonitoringDB } = require("./db");
const ExcelJS = require("exceljs");
const path = require("path");
const { HelperFunctions } = require("@helper/functions");
const { REPORT_RASXOD_SCHET } = require("@helper/constants");
const { access, constants, mkdir } = require("fs").promises;

exports.Jur7MonitoringService = class {
  static async uniqueSchets(data) {
    const result = await Jur7MonitoringDB.uniqueSchets([]);

    return result;
  }

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
    worksheet.eachRow((row, row_number) => {
      let bold = false;
      let horizontal = "center";
      let height = 20;
      let argb = "FFFFFFFF";

      if (row_number === 1) {
        height = 50;
      }

      if (row_number > 1 && row_number < 4) {
        height = 30;
      }

      if (row_number < 8) {
        bold = true;
      }

      worksheet.getRow(row_number).height = height;

      row.eachCell((cell, column) => {
        const cellData = cell.note ? JSON.parse(cell.note) : {};

        if (column === 3 && row_number > 6 && !cellData.horizontal) {
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
          worksheet.getRow(row_number).height = cellData.height;
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
    const podpis = data.podpis[0] || {};
    const Workbook = new ExcelJS.Workbook();
    const worksheet = Workbook.addWorksheet("material");

    worksheet.mergeCells("G1", "K1");
    const title1 = worksheet.getCell("G1");
    title1.value = `"Тасдиқлайман" ${podpis.position} ${podpis.fio}`;

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

    const doc_num = worksheet.getCell("L6");
    doc_num.value = "Документ рақам";

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
      { key: "product_name", width: 40 },
      { key: "edin", width: 22 },
      { key: "from_kol", width: 22 },
      { key: "from_summa", width: 22 },
      { key: "prixod_kol", width: 22 },
      { key: "prixod", width: 22 },
      { key: "rasxod_kol", width: 22 },
      { key: "rasxod", width: 22 },
      { key: "to_kol", width: 22 },
      { key: "to_summa", width: 22 },
      { key: "date", width: 22 },
      { key: "doc_num", width: 22 },
    ];

    for (let responsible of data.responsibles) {
      for (let schet of responsible.products) {
        if (schet.products.length) {
          worksheet.addRow({});

          const title = `${responsible.fio} Счет ${schet.schet}`;
          const rowFio = worksheet.addRow({
            product_name: title,
          });

          const fioIndex = rowFio.values.findIndex((v) => v === title);
          if (fioIndex !== -1) {
            rowFio.getCell(fioIndex).note = JSON.stringify({
              bold: true,
              horizontal: "left",
            });
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
              doc_num: product.doc_num,
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
            doc_num: undefined,
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

    worksheet.eachRow((row, row_number) => {
      let size = 12;
      let bold = false;
      let horizontal = "center";

      let border = {
        top: { style: "thin", color: { argb: "FFD3D3D3" } },
        left: { style: "thin", color: { argb: "FFD3D3D3" } },
        bottom: { style: "thin", color: { argb: "FFD3D3D3" } },
        right: { style: "thin", color: { argb: "FFD3D3D3" } },
      };

      if (row_number < 8) {
        worksheet.getRow(row_number).height = 25;
        bold = true;
      }

      row.eachCell((cell) => {
        const cellData = cell.note ? JSON.parse(cell.note) : {};

        if (cellData.bold) {
          bold = true;
        }

        if (cellData.horizontal) {
          horizontal = cellData.horizontal;
        }

        if (row_number > 5 && cell.value !== "" && cell.value !== undefined) {
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
          alignment: { vertical: "middle", horizontal, wrapText: true },
          fill: {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFFFFFFF" },
          },
          border,
        });

        if (cell.note) {
          cell.note = undefined;
        }

        // Matn uzunligiga qarab katak balandligini oshirish
        if (typeof cell.value === "string") {
          const lineCount = Math.ceil(cell.value.length / 30); // Har 30 belgidan keyin yangi qator
          const newHeight = lineCount * 15; // Har bir qator uchun 15px balandlik
          if (newHeight > row.height) {
            row.height = newHeight;
          }
        }
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

  static async act(data) {
    const Workbook = new ExcelJS.Workbook();
    const worksheet = Workbook.addWorksheet("act");

    worksheet.mergeCells(`A1`, `L1`);
    worksheet.getCell(`A1`).value = "Товар-моддий бойликларни санокдан ўтказиш";

    worksheet.mergeCells(`A2`, `L2`);
    worksheet.getCell(`A2`).value = "Далолатномаси";

    worksheet.mergeCells(`I3`, `L3`);
    worksheet.getCell(`I3`).value =
      `${HelperFunctions.returnStringDate(new Date(data.to))}`;

    worksheet.mergeCells(`A4`, `L4`);
    worksheet.getCell(`A4`).value = data.title;

    worksheet.mergeCells(`A5`, `L5`);
    worksheet.getCell(`A5`).value =
      `Моддий жавобгар шахс ${data.responsibles[0].fio} нинг`;

    worksheet.mergeCells(`A6`, `L6`);
    worksheet.getCell(`A6`).value = "Тилхати";

    worksheet.mergeCells(`A7`, `L7`);
    worksheet.getCell(`A7`).value = data.comment;

    worksheet.mergeCells(`A8`, `L8`);
    worksheet.getCell(`A8`).value = data.responsibles[0].fio;
    worksheet.getCell(`L9`).value = `(Имзо)`;

    worksheet.mergeCells(`A11`, `A12`);
    worksheet.getCell(`A11`).value = "№";

    worksheet.mergeCells(`B11`, `B12`);
    worksheet.getCell(`B11`).value = "Номер счет";

    worksheet.mergeCells(`C11`, `C12`);
    worksheet.getCell(`C11`).value =
      "Товар-моддий бойликларни номи, тури ва маркаси";

    worksheet.mergeCells(`D11`, `D12`);
    worksheet.getCell(`D11`).value = `Един из`;

    worksheet.mergeCells(`E11`, `F11`);
    worksheet.getCell(`E11`).value = `Ҳисоб бўйнида`;
    worksheet.getCell(`E12`).value = `Сони`;
    worksheet.getCell(`F12`).value = `Суммаси`;

    worksheet.mergeCells(`G11`, `H11`);
    worksheet.getCell(`G11`).value = `Ҳақиқатда`;
    worksheet.getCell(`G12`).value = `Сони`;
    worksheet.getCell(`H12`).value = `Суммаси`;

    worksheet.mergeCells(`I11`, `J11`);
    worksheet.getCell(`I11`).value = `Камомад`;
    worksheet.getCell(`I12`).value = `Сони`;
    worksheet.getCell(`J12`).value = `Суммаси`;

    worksheet.mergeCells(`K11`, `L11`);
    worksheet.getCell(`K11`).value = `Ортиқча`;
    worksheet.getCell(`K12`).value = `Сони`;
    worksheet.getCell(`L12`).value = `Суммаси`;

    worksheet.columns = [
      { key: "order", width: 10 },
      { key: "schet", width: 14 },
      { key: "name", width: 40 },
      { key: "edin", width: 10 },
      { key: "to_kol", width: 20 },
      { key: "to_summa", width: 25 },
      { key: "empty1", width: 20 },
      { key: "empty2", width: 25 },
      { key: "empty3", width: 20 },
      { key: "empty4", width: 25 },
      { key: "empty5", width: 20 },
      { key: "empty6", width: 25 },
    ];

    let index = 1;
    let column = 13;
    const itogo = { kol: 0, summa: 0 };

    for (let schet of data.responsibles[0].products) {
      const schetCell = worksheet.getCell(`A${column}`);
      schetCell.value = `Счет: ${schet.schet}`;
      schetCell.note = JSON.stringify({
        bold: true,
        horizontal: "left",
      });
      column++;

      for (let product of schet.products) {
        worksheet.addRow({
          order: index,
          schet: schet.schet,
          name: product.name,
          edin: product.edin,
          to_kol: product.to.kol,
          to_summa: product.to.summa,
          empty1: "",
          empty2: "",
          empty3: "",
          empty4: "",
          empty5: "",
          empty6: "",
        });

        column++;
        index++;
      }

      const itogoCell = worksheet.getCell(`C${column}`);
      itogoCell.value = `Итого по счет ${schet.schet} :      `;
      itogoCell.note = JSON.stringify({
        bold: true,
        horizontal: "left",
        border: "false",
      });

      const itogoKolCell = worksheet.getCell(`E${column}`);
      itogoKolCell.value = schet.itogo.to_kol;
      itogoKolCell.note = JSON.stringify({
        bold: true,
        horizontal: "left",
        border: "false",
      });

      const itogoSummaCell = worksheet.getCell(`F${column}`);
      itogoSummaCell.value = schet.itogo.to_summa;
      itogoSummaCell.note = JSON.stringify({
        bold: true,
        horizontal: "left",
        border: "false",
      });

      itogo.kol += schet.itogo.to_kol;
      itogo.summa += schet.itogo.to_summa;
      column++;
    }

    const itogoCell = worksheet.getCell(`C${column + 1}`);
    itogoCell.value = `Итого`;
    itogoCell.note = JSON.stringify({
      bold: true,
      horizontal: "left",
      border: "false",
    });

    const itogoKolCell = worksheet.getCell(`E${column + 1}`);
    itogoKolCell.value = itogo.kol;
    itogoKolCell.note = JSON.stringify({
      bold: true,
      horizontal: "left",
      border: "false",
    });

    const itogoSummaCell = worksheet.getCell(`F${column + 1}`);
    itogoSummaCell.value = itogo.summa;
    itogoSummaCell.note = JSON.stringify({
      bold: true,
      horizontal: "left",
      border: "false",
    });

    // css
    worksheet.getRow(1).height = 30;
    worksheet.getRow(2).height = 30;
    worksheet.getRow(3).height = 30;
    worksheet.getRow(4).height = 80;
    worksheet.getRow(5).height = 40;
    worksheet.getRow(6).height = 40;
    worksheet.getRow(7).height = 60;
    worksheet.getRow(8).height = 40;
    worksheet.getRow(11).height = 30;
    worksheet.getRow(12).height = 30;

    worksheet.eachRow((row, row_number) => {
      let size = 12;
      let bold = false;
      let horizontal = "center";
      let border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };

      if (row_number < 13) {
        size = 14;
      }

      if (row_number === 6) {
        size = 25;
      }

      if (row_number === 8) {
        horizontal = "left";
      }

      if (row_number < 13) {
        bold = true;
      }

      if (row_number === 8) {
        border = {
          bottom: { style: "thin" },
        };
      }

      if (row_number === 9) {
        border = {};
      }

      row.eachCell((cell, column) => {
        const cellData = cell.note ? JSON.parse(cell.note) : {};

        if (column > 1) {
          cell.numFmt = "#,##0.00";
        }

        if (column === 6 && row_number > 12) {
          horizontal = "right";
        } else {
          horizontal = "center";
        }

        if (row_number < 13) {
          bold = true;
        } else if (cellData.bold && row_number > 12) {
          bold = true;
        } else {
          bold = false;
        }

        if (cellData.border === "false" && row_number > 12) {
          border = {};
        } else {
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
          alignment: { vertical: "middle", horizontal, wrapText: true },
          fill: {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFFFFFFF" },
          },
          border,
        });

        if (row_number > 10) {
          if (typeof cell.value === "string") {
            const lineCount = Math.ceil(cell.value.length / 30);
            const newHeight = lineCount * 15;
            if (newHeight > row.height) {
              row.height = newHeight;
            }
          }
        }

        if (Object.keys(cellData).length !== 0) {
          cell.note = undefined;
        }
      });
    });

    const folder_path = path.join(__dirname, "../../../../../public/exports");
    const fileName = `act_${new Date().getTime()}.xlsx`;

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
    const podpis = data.podpis[0] || {};
    const Workbook = new ExcelJS.Workbook();
    const worksheet = Workbook.addWorksheet("material");

    worksheet.mergeCells("G1", "K1");
    const title1 = worksheet.getCell("G1");
    title1.value = `"Тасдиқлайман" ${podpis.position} ${podpis.fio}`;

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

    const doc_num = worksheet.getCell("L6");
    doc_num.value = "Документ рақам";

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
      { key: "doc_num", width: 15 },
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
          const title = `${responsible.fio} Счет ${schet.schet}`;
          const rowFio = worksheet.addRow({
            product_name: title,
          });

          const fioIndex = rowFio.values.findIndex((v) => v === title);
          if (fioIndex !== -1) {
            rowFio.getCell(fioIndex).note = JSON.stringify({
              bold: true,
              horizontal: "left",
            });
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
              doc_num: product.doc_num,
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

    worksheet.eachRow((row, row_number) => {
      let size = 12;
      let bold = false;
      let horizontal = "center";

      let border = {
        top: { style: "thin", color: { argb: "FFD3D3D3" } },
        left: { style: "thin", color: { argb: "FFD3D3D3" } },
        bottom: { style: "thin", color: { argb: "FFD3D3D3" } },
        right: { style: "thin", color: { argb: "FFD3D3D3" } },
      };

      if (row_number < 8) {
        worksheet.getRow(row_number).height = 25;
        bold = true;
      }

      if (row_number === 3) {
        horizontal = "left";
      }

      if (row_number === 4) {
        border = {
          top: { style: "thin", color: { argb: "FFD3D3D3" } },
          left: { style: "thin", color: { argb: "FFD3D3D3" } },
          bottom: { style: "thin" },
          right: { style: "thin", color: { argb: "FFD3D3D3" } },
        };
      }

      row.eachCell((cell, colNumber) => {
        const cellData = cell.note ? JSON.parse(cell.note) : {};

        if (cellData.bold) {
          bold = true;
        }

        if (cellData.horizontal) {
          horizontal = cellData.horizontal;
        }

        if (row_number > 5 && cell.value !== "" && cell.value !== undefined) {
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
          alignment: { vertical: "middle", horizontal, wrapText: true },
          fill: {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFFFFFFF" },
          },
          border,
        });

        if (cell.note) {
          cell.note = undefined;
        }

        if (typeof cell.value === "string") {
          const lineCount = Math.ceil(cell.value.length / 30);
          const newHeight = lineCount * 15;
          if (newHeight > row.height) {
            row.height = newHeight;
          }
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

  static async reportBySchet(data) {
    const result = await Jur7MonitoringDB.uniqueSchets([]);
    const itogo = { saldo_from: 0, prixod: 0, rasxod: 0, saldo_to: 0 };

    for (let schet of result) {
      schet.saldo_from = await Jur7MonitoringDB.getSchetSummaBySaldo([
        data.year,
        data.months[0],
        data.region_id,
        data.main_schet_id,
        schet.schet,
      ]);

      schet.internal = await Jur7MonitoringDB.getSummaBySchet([
        data.year,
        data.months,
        data.region_id,
        data.main_schet_id,
        schet.schet,
      ]);

      schet.saldo_to = {
        summa:
          schet.saldo_from.summa +
          (schet.internal.prixod - schet.internal.rasxod),
      };

      itogo.saldo_from += schet.saldo_from.summa;
      itogo.prixod += schet.internal.prixod;
      itogo.rasxod += schet.internal.rasxod;
      itogo.saldo_to += schet.saldo_to.summa;
    }

    return { schets: result, itogo };
  }

  static async reportBySchetExcel(data) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("responsibles");

    worksheet.mergeCells(`A1`, "E1");
    worksheet.getCell("A1").value =
      `СВОДНАЯ ОБОРОТЬ ЗА ${data.is_year === "true" ? `${data.year} года` : HelperFunctions.returnStringDate(new Date(data.to))}          ${data.region.name}`;

    worksheet.columns = [
      { key: "schet", width: 10 },
      { key: "from", width: 40 },
      { key: "prixod", width: 30 },
      { key: "rasxod", width: 30 },
      { key: "to", width: 30 },
    ];

    worksheet.getRow(2).values = [
      "Счет",
      "Сальдо",
      "Приход",
      "Расход",
      "Сальдо",
    ];

    data.schets.forEach((item) => {
      worksheet.addRow({
        schet: item.schet,
        from: item.saldo_from.summa,
        prixod: item.internal.prixod,
        rasxod: item.internal.rasxod,
        to: item.saldo_to.summa,
      });
    });

    worksheet.addRow({
      schet: "Итого",
      from: data.itogo.saldo_from,
      prixod: data.itogo.prixod,
      rasxod: data.itogo.rasxod,
      to: data.itogo.saldo_to,
    });

    worksheet.eachRow((row, row_number) => {
      let bold = false;
      let horizontal = "center";

      if (row_number < 3 || worksheet.rowCount === row_number) {
        worksheet.getRow(row_number).height = 30;
        bold = true;
      }

      row.eachCell((cell, column) => {
        if (row_number > 2 && column > 1) {
          horizontal = "right";
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

    const folder_path = path.join(__dirname, `../../../../../public/exports`);

    try {
      await access(folder_path, constants.W_OK);
    } catch (error) {
      await mkdir(folder_path);
    }

    const fileName = `schets.${new Date().getTime()}.xlsx`;

    const filePath = `${folder_path}/${fileName}`;

    await workbook.xlsx.writeFile(filePath);

    return { fileName, filePath };
  }
};
