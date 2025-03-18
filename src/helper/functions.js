const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs").promises;
const xlsx = require("xlsx");
const ExcelJS = require("exceljs");
const { REPORT_RASXOD_SCHET } = require("./constants");

exports.HelperFunctions = class {
  static returnLocalDate(date) {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString();
    return `${day}.${month}.${year}`;
  }

  static async daysReportExcel(data) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Hisobot");

    worksheet.mergeCells(`A1`, `G1`);
    worksheet.getCell(`A1`).value = `${data.title} книга`;

    worksheet.mergeCells(`A2`, `G2`);
    worksheet.getCell(`A2`).value =
      `от ${this.returnStringDate(new Date(data.from))} до ${this.returnStringDate(new Date(data.to))} `;

    worksheet.mergeCells(`A4`, `G4`);
    const summa_from = worksheet.getCell(`A4`);
    summa_from.value = `Остаток к началу ${data.title} дня : ${data.summa_from.summa}`;
    summa_from.note = JSON.stringify({
      bold: true,
      horizontal: "left",
    });

    worksheet.getRow(6).values = [
      "Номер документ",
      "Номер документ",
      "описание ",
      "Счет",
      "Субсчет",
      "Приход",
      "Расход",
    ];

    worksheet.columns = [
      { key: "doc_num", width: 20 },
      { key: "doc_date", width: 20 },
      { key: "comment", width: 20 },
      { key: "schet", width: 20 },
      { key: "sub_schet", width: 20 },
      { key: "prixod", width: 40 },
      { key: "rasxod", width: 40 },
    ];

    let column = 7;

    for (let doc of data.prixods) {
      worksheet.addRow({
        doc_num: doc.doc_num,
        doc_date: this.returnLocalDate(new Date(doc.doc_date)),
        comment: doc.opisanie,
        schet: doc.schet,
        sub_schet: doc.sub_schet,
        prixod: doc.summa,
        rasxod: 0,
      });
      column++;
    }

    for (let doc of data.rasxods) {
      worksheet.addRow({
        doc_num: doc.doc_num,
        doc_date: doc.doc_date,
        comment: doc.opisanie,
        schet: doc.schet,
        sub_schet: doc.sub_schet,
        prixod: 0,
        rasxod: doc.summa,
      });
      column++;
    }

    worksheet.mergeCells(`A${column}`, `E${column}`);
    const itogoTitleCell = worksheet.getCell(`A${column}`);
    itogoTitleCell.value = `ВСЕГО`;
    itogoTitleCell.note = JSON.stringify({
      bold: true,
      horizontal: "left",
    });

    const itogoPrixodCell = worksheet.getCell(`F${column}`);
    itogoPrixodCell.value = data.summa_from.summa;
    itogoPrixodCell.note = JSON.stringify({
      bold: true,
    });

    const itogoRasxodCell = worksheet.getCell(`G${column}`);
    itogoRasxodCell.value = data.summa_to.summa;
    itogoRasxodCell.note = JSON.stringify({
      bold: true,
    });

    // css
    worksheet.eachRow((row, rowNumber) => {
      let bold = false;
      let horizontal = "center";
      let height = 25;
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

        if (column > 5 && rowNumber > 6 && !cellData.horizontal) {
          horizontal = "right";
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

    const fileName = `${data.file_name}_days_report_${new Date().getTime()}.xlsx`;
    const folder_path = path.join(__dirname, "../../public/exports");

    try {
      await fs.access(folder_path, fs.constants.W_OK);
    } catch (error) {
      await fs.mkdir(folder_path);
    }

    const filePath = `${folder_path}/${fileName}`;

    await workbook.xlsx.writeFile(filePath);

    return { fileName, filePath };
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
      `от ${this.returnStringDate(new Date(data.from))} до ${this.returnStringDate(new Date(data.to))}`;

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
          prixod: data.schet,
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

    const fileName = `${data.file_name}_shapka_${new Date().getTime()}.xlsx`;
    const folder_path = path.join(__dirname, "../../public/exports");

    try {
      await fs.access(folder_path, fs.constants.W_OK);
    } catch (error) {
      await fs.mkdir(folder_path);
    }

    const filePath = `${folder_path}/${fileName}`;

    await workbook.xlsx.writeFile(filePath);

    return { fileName, filePath };
  }

  static async readFile(filePath) {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const excel_data = xlsx.utils.sheet_to_json(sheet).map((row, index) => {
      const newRow = {};
      for (const key in row) {
        if (Object.prototype.hasOwnProperty.call(row, key)) {
          newRow[key] = row[key];
        }
      }

      return newRow;
    });

    const result = excel_data.filter((item, index) => index >= 3);

    const header = excel_data.filter((item, index) => index === 3);

    return { result, header };
  }

  static checkYearMonth(array) {
    const year = array[0].year;
    const month = array[0].month;

    for (let item of array) {
      if (item.year !== year || item.month !== month) {
        return;
      }
    }

    return { year, month, full_date: new Date(`${year}-${month}-01`) };
  }

  static lastDate(date) {
    if (date.month === 1) return { month: 12, year: date.year - 1 };
    else if (date.month > 1) return { month: date.month - 1, year: date.year };
    else return null;
  }

  static nextDate(date) {
    if (date.month === 12) return { month: 1, year: date.year + 1 };
    else if (date.month < 12) return { month: date.month + 1, year: date.year };
    else return null;
  }

  static async returnTemplateFile(fileName, lang) {
    const folder_path = path.join(__dirname, `../../public/template`);

    const filePath = path.join(folder_path, fileName);

    try {
      await fs.access(filePath, fs.constants.R_OK);
    } catch (error) {
      throw new Error(lang.t("fileError"));
    }

    const fileRes = await fs.readFile(filePath);

    return { fileName, fileRes };
  }

  static sum(...args) {
    let sum = 0;
    args.map((arg) => (sum += Number(arg)));
    return sum;
  }

  static tashkentTime() {
    const currentUtcDate = new Date();
    const tashkentOffset = 10 * 60 * 60 * 1000;
    const tashkentDate = new Date(currentUtcDate.getTime() + tashkentOffset);
    return tashkentDate.toISOString();
  }

  static returnMonth(month) {
    switch (month) {
      case 1:
        return "январь";
      case 2:
        return "февраль";
      case 3:
        return "март";
      case 4:
        return "апрель";
      case 5:
        return "май";
      case 6:
        return "июнь";
      case 7:
        return "июль";
      case 8:
        return "август";
      case 9:
        return "сентябрь";
      case 10:
        return "октябрь";
      case 11:
        return "ноябрь";
      case 12:
        return "декабрь";
      default:
        return "server xatolik";
    }
  }

  static formatSubSchet(str) {
    const result = ["", "", ""];
    for (let i = 0; i < str.length; i++) {
      if (i < 2) {
        result[0] += str[i];
      } else if (i < 4) {
        result[1] += str[i];
      } else {
        result[2] += str[i];
      }
    }
    return result;
  }

  static filters(data) {
    return data.length ? `AND ${data.join(" AND ")}` : "";
  }

  static summaDoc(data) {
    const summa = data.reduce((acc, item) => (acc += item.summa), 0);

    return summa;
  }

  static saldoSumma(data) {
    let summa = { prixod_summa: 0, rasxod_summa: 0 };
    if (data.prixod) {
      summa.prixod_summa = data.childs.reduce(
        (acc, item) => (acc += item.summa),
        0
      );
    } else if (data.rasxod) {
      summa.rasxod_summa = data.childs.reduce(
        (acc, item) => (acc += item.summa),
        0
      );
    }

    return summa;
  }

  static paramsValues(data) {
    const index_max = data.params.length;
    let values = "(";
    for (let i = 1; i <= index_max; i++) {
      if (index_max === i) {
        values += ` $${i})`;
      } else if (i % data.column_count === 0) {
        values += ` $${i}), (`;
      } else {
        values += `$${i}, `;
      }
    }
    return values;
  }

  static excelSerialToDate(serial) {
    const excelEpoch = new Date(1899, 11, 30);
    const date = new Date(excelEpoch.getTime() + serial * 86400000);
    return date.toISOString().split("T")[0];
  }

  static probelNumber(num) {
    const strNum = String(num);
    return strNum.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }

  static getMonthStartEnd(year, month) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    return [startDate, endDate];
  }

  static returnStringDate(date) {
    function getMonth(month) {
      switch (month) {
        case "01":
          return "январь";
        case "02":
          return "февраль";
        case "03":
          return "март";
        case "04":
          return "апрель";
        case "05":
          return "май";
        case "06":
          return "июнь";
        case "07":
          return "июль";
        case "08":
          return "август";
        case "09":
          return "сентябрь";
        case "10":
          return "октябрь";
        case "11":
          return "ноябрь";
        case "12":
          return "декабрь";
        default:
          return "server xatolik";
      }
    }
    const day = date.getDate().toString().padStart(2, "0");
    let month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString();
    month = getMonth(month);
    return `${year} ${day}-${month}`;
  }
};

exports.tashkentTime = () => {
  const currentUtcDate = new Date();
  const tashkentOffset = 10 * 60 * 60 * 1000;
  const tashkentDate = new Date(currentUtcDate.getTime() + tashkentOffset);
  return tashkentDate.toISOString();
};

exports.sum = (...args) => {
  let sum = 0;
  args.map((arg) => (sum += Number(arg)));
  return sum;
};

exports.childsSumma = (args) => {
  let sum = 0;
  args.map((arg) => (sum += Number(arg.summa)));
  return sum;
};

exports.checkUniqueIds = (array) => {
  const ids = array.map((item) =>
    item.id
      ? item.id
      : item.spravochnik_main_book_schet_id
        ? item.spravochnik_main_book_schet_id
        : item.smeta_grafik_id
  );
  const uniqueIds = new Set(ids);
  return ids.length === uniqueIds.size;
};

exports.returnStringDate = (date) => {
  function getMonth(month) {
    switch (month) {
      case "01":
        return "январь";
      case "02":
        return "февраль";
      case "03":
        return "март";
      case "04":
        return "апрель";
      case "05":
        return "май";
      case "06":
        return "июнь";
      case "07":
        return "июль";
      case "08":
        return "август";
      case "09":
        return "сентябрь";
      case "10":
        return "октябрь";
      case "11":
        return "ноябрь";
      case "12":
        return "декабрь";
      default:
        return "server xatolik";
    }
  }
  const day = date.getDate().toString().padStart(2, "0");
  let month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString();
  month = getMonth(month);
  return `${year} ${day}-${month}`;
};

exports.returnLocalDate = (date) => {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString();
  return `${day}.${month}.${year}`;
};

exports.returnSleshDate = (date) => {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString();
  return `${day}/${month}/${year}`;
};

exports.designParams = (params, design_keys) => {
  return (allValues = params.reduce((acc, obj) => {
    const sortValues = design_keys.map((key) => obj[key]);
    return acc.concat(Object.values(sortValues));
  }, []));
};

exports.sqlFilter = (column_name, index_contract_id) => {
  return `AND ${column_name} = $${index_contract_id}`;
};

exports.returnStringSumma = (num) => {
  const formatNumber = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  if (Number.isInteger(num)) {
    return formatNumber(num) + ".00";
  } else {
    let parts = num.toString().split(".");
    parts[0] = formatNumber(parts[0]);
    return parts.join(".");
  }
};

exports.returnParamsValues = (params, column_count) => {
  const index_max = params.length;
  let values = "(";
  for (let i = 1; i <= index_max; i++) {
    if (index_max === i) {
      values += ` $${i})`;
    } else if (i % column_count === 0) {
      values += ` $${i}), (`;
    } else {
      values += `$${i}, `;
    }
  }
  return values;
};

exports.generateToken = (user) => {
  const payload = user;
  const secret = process.env.JWT_SECRET;
  const options = {
    expiresIn: process.env.JWT_EXPIRE || "30d",
  };
  const token = jwt.sign(payload, secret, options);
  return token;
};

exports.checkSchetsEquality = (childs) => {
  const firstSchet = childs[0].schet;
  return childs.every((child) => child.schet === firstSchet);
};

exports.checkTovarId = (array) => {
  let test;
  for (let item of array) {
    test = array.filter(
      (element) =>
        element.naimenovanie_tovarov_jur7_id ===
        item.naimenovanie_tovarov_jur7_id
    );
    if (test.length > 1) {
      test = true;
    } else {
      test = false;
    }
  }
  return test;
};

exports.filterLogs = (array) => {
  const logPattern =
    /(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})\.\s*(\w+)\.\s*id:(\d+)\.\s*user_id:(\d+)/;
  const logs = array
    .map((line) => {
      const match = line.match(logPattern);
      if (match) {
        return {
          date: match[1],
          type: match[2],
          id: match[3],
          user_id: match[4],
        };
      }
      return null;
    })
    .filter((log) => log !== null);
  return logs;
};

exports.parseLogs = (logs, type) => {
  return logs
    .map((log) => {
      const match = log.match(/^(.*?)\. (\w+)\. id:([\d,]+)\. user_id:(\d+)/);
      if (match) {
        return {
          date: match[1],
          type: match[2],
          ids: match[3].split(",").map((id) => parseInt(id)),
          user_id: match[4],
          type: type,
        };
      }
      return null;
    })
    .filter((entry) => entry !== null);
};

exports.returnExcelColumn = (columns) => {
  if (columns.length === 1) {
    let columnNumber = columns[0];
    let result = "";
    while (columnNumber > 0) {
      let remainder = (columnNumber - 1) % 26;
      result = String.fromCharCode(65 + remainder) + result;
      columnNumber = Math.floor((columnNumber - 1) / 26);
    }
    return result;
  }

  let results = [];
  columns.forEach((columnNumber) => {
    let result = "";
    while (columnNumber > 0) {
      let remainder = (columnNumber - 1) % 26;
      result = String.fromCharCode(65 + remainder) + result;
      columnNumber = Math.floor((columnNumber - 1) / 26);
    }
    results.push(result);
  });
  return results;
};

exports.getMonthStartEnd = (year, month) => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);
  return [startDate, endDate];
};

exports.getDayStartEnd = (year, month) => {
  const startOfMonth = 1;
  const endOfMonth = new Date(year, month, 0).getDate();
  return {
    start: startOfMonth,
    end: endOfMonth,
  };
};

exports.returnMonth = (month) => {
  switch (month) {
    case 1:
      return "январь";
    case 2:
      return "февраль";
    case 3:
      return "март";
    case 4:
      return "апрель";
    case 5:
      return "май";
    case 6:
      return "июнь";
    case 7:
      return "июль";
    case 8:
      return "август";
    case 9:
      return "сентябрь";
    case 10:
      return "октябрь";
    case 11:
      return "ноябрь";
    case 12:
      return "декабрь";
    default:
      return "server xatolik";
  }
};

exports.formatSubSchet = (str) => {
  const result = ["", "", ""];
  for (let i = 0; i < str.length; i++) {
    if (i < 2) {
      result[0] += str[i];
    } else if (i < 4) {
      result[1] += str[i];
    } else {
      result[2] += str[i];
    }
  }
  return result;
};

exports.checkSchetsEquality = (childs) => {
  const firstSchet = childs[0].schet;
  return childs.every((child) => child.schet === firstSchet);
};
