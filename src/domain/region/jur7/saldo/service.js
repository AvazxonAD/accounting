const { Jur7SaldoDB } = require("./db");

const {
  tashkentTime,
  returnStringDate,
  HelperFunctions,
} = require("@helper/functions");
const { db } = require("@db/index");
const xlsx = require("xlsx");
const ExcelJS = require("exceljs");
const path = require("path");
const { Jur7MonitoringService } = require(`@jur7_monitoring/service`);
const fs = require("fs").promises;

exports.Jur7SaldoService = class {
  static async getByIdProduct(data) {
    const result = await Jur7SaldoDB.getByIdProduct([data.id, data.region_id]);

    return result;
  }

  // static groupedSaldo(arr) {
  //   const map = new Map();

  //   arr.forEach((item) => {
  //     const key = `${item.prixodData.docId}_${item.group_id}_${item.name}`;

  //     if (map.has(key)) {
  //       const existing = map.get(key);

  //       // from
  //       existing.from.kol += item.from.kol;
  //       existing.from.summa += item.from.summa;
  //       existing.from.iznos_summa += item.from.iznos_summa;
  //       existing.from.sena += item.from.sena;

  //       // internal
  //       existing.internal.kol += item.internal.kol;
  //       existing.internal.summa += item.internal.summa;
  //       existing.internal.iznos_summa += item.internal.iznos_summa;
  //       existing.internal.sena += item.internal.sena;
  //       existing.internal.prixod_kol += item.internal.prixod_kol;
  //       existing.internal.rasxod_kol += item.internal.rasxod_kol;
  //       existing.internal.prixod_summa += item.internal.prixod_summa;
  //       existing.internal.rasxod_summa += item.internal.rasxod_summa;
  //       existing.internal.prixod_iznos_summa += item.internal.prixod_iznos_summa;
  //       existing.internal.rasxod_iznos_summa += item.internal.rasxod_iznos_summa;

  //       // to
  //       existing.to.kol += item.to.kol;
  //       existing.to.summa += item.to.summa;
  //       existing.to.iznos_summa += item.to.iznos_summa;
  //       existing.to.sena += item.to.sena;
  //       if (item.to.month_iznos) existing.to.month_iznos = (existing.to.month_iznos || 0) + item.to.month_iznos;
  //     } else {
  //       map.set(key, JSON.parse(JSON.stringify(item)));
  //     }
  //   });

  //   return Array.from(map.values());
  // }

  static returnDocDate(data) {
    const dates = String(data.doc_date).trim().split("");
    const checkSlesh = dates.find((data) => data === "/");
    const checkDotNet = dates.find((data) => data === ".");
    if (checkDotNet) {
      const dates = String(data.doc_date).split(".");
      data.doc_date = `${dates[2]}-${dates[1]}-${dates[0]}`;
    } else if (checkSlesh) {
      const dates = String(data.doc_date).split("/");
      data.doc_date = `${dates[2]}-${dates[1]}-${dates[0]}`;
    } else {
      function excelSerialToDate(serial) {
        const utc_days = Math.floor(serial - 25569);
        const utc_value = utc_days * 86400;
        return `${new Date(utc_value * 1000).getFullYear()}-${String(new Date(utc_value * 1000).getMonth() + 1).padStart(2, "0")}-${String(new Date(utc_value * 1000).getDate()).padStart(2, "0")}`;
      }

      data.doc_date = excelSerialToDate(data.doc_date);
    }

    return data.doc_date;
  }

  static async getFirstSaldoDocs(data) {
    const result = await Jur7SaldoDB.getFirstSaldoDocs([
      data.region_id,
      data.main_schet_id,
    ]);

    return result;
  }

  static async readFile(data) {
    const workbook = xlsx.readFile(data.filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const excel_data = xlsx.utils
      .sheet_to_json(sheet, { raw: true })
      .map((row, index) => {
        const newRow = {};
        for (const key in row) {
          if (Object.prototype.hasOwnProperty.call(row, key)) {
            const value = row[key];
            newRow[key] = value;

            newRow.index = index + 2;
          }
        }

        return newRow;
      });

    const result = excel_data.filter((item, index) => index >= 3);
    const header = excel_data.filter((item, index) => index === 2);

    return { result, header };
  }

  static async getByProduct(data) {
    const { year, month } = HelperFunctions.returnMonthAndYear({
      doc_date: data.to,
    });

    const result = await Jur7SaldoDB.getByProduct(
      [data.region_id, month, year, data.main_schet_id],
      {
        group_id: data.group_id,
        responsible_id: data.responsible_id,
        iznos: data.iznos,
        search: data.search,
        product_id: data.product_id,
        budjet_id: data.budjet_id,
      }
    );

    result.data.forEach((item) => {
      if (!item.prixod_id) {
        item.prixodData.unshift({
          docDate: item.doc_date,
          doc_id: item.prixod_id,
          docId: item.prixod_id,
          doc_num: item.doc_num,
        });
      }
    });

    const history = await Jur7MonitoringService.history({
      region_id: data.region_id,
      responsible_id: data.responsible_id,
      main_schet_id: data.main_schet_id,
      from: HelperFunctions.returnDate({ year, month }),
      to: HelperFunctions.returnDate({ year, month, end: true }),
    });

    for (let product of result.data) {
      product.internal = {
        kol: 0,
        summa: 0,
        iznos_summa: 0,
        sena: 0,
        prixod_kol: 0,
        rasxod_kol: 0,
        prixod_summa: 0,
        rasxod_summa: 0,
        prixod_iznos_summa: 0,
        rasxod_iznos_summa: 0,
      };

      const productData = history.filter(
        (item) =>
          item.responsible_id == product.responsible_id &&
          item.product_id == product.product_id
      );

      if (productData.length > 0) {
        productData.forEach((item) => {
          if (item.type === "prixod" || item.type === "prixod_internal") {
            product.internal.prixod_kol += item.kol;
            product.internal.prixod_summa += item.summa;
            product.internal.prixod_iznos_summa += item.iznos_summa;
          } else {
            product.internal.rasxod_kol += item.kol;
            product.internal.rasxod_summa += item.summa;
            product.internal.rasxod_iznos_summa += item.iznos_summa;
          }
        });
        product.internal.kol =
          product.internal.prixod_kol - product.internal.rasxod_kol;
        product.internal.summa =
          product.internal.prixod_summa - product.internal.rasxod_summa;
        product.internal.iznos_summa =
          product.internal.prixod_iznos_summa -
          product.internal.rasxod_iznos_summa;
      }

      product.to = {
        kol: product.from.kol + product.internal.kol,
        summa: product.from.summa + product.internal.summa,
        iznos_summa: product.from.iznos_summa + product.internal.iznos_summa,
      };

      if (product.to.kol !== 0) {
        product.to.sena = product.to.summa / product.to.kol;
      } else {
        product.to.sena = product.to.summa;
      }

      if (product.iznos) {
        const docDate = new Date(product.iznos_start);
        const now = new Date(`${year}-${month}-01`);

        const diffInMs = now - docDate;
        const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

        if (diffInDays >= 30) {
          const month_iznos =
            product.to.summa * (product.iznos_foiz / 100 / 12);
          product.to.month_iznos = month_iznos;
        } else {
          product.to.month_iznos = 0;
        }

        product.to.iznos_summa += product.to.month_iznos;

        if (product.to.iznos_summa >= product.to.summa) {
          product.to.iznos_summa = product.to.summa;
        }
      }
    }

    if (data.rasxod === "true") {
      result.data = result.data.filter((item) => item.to.kol !== 0);
    }

    const total = result.data.length;

    result.from_summa = 0;
    result.from_kol = 0;
    result.internal_rasxod_summa = 0;
    result.internal_rasxod_kol = 0;
    result.internal_prixod_summa = 0;
    result.internal_prixod_kol = 0;
    result.to_summa = 0;
    result.to_iznos_summa = 0;
    result.to_kol = 0;

    result.page_from_summa = 0;
    result.page_from_kol = 0;
    result.page_internal_rasxod_summa = 0;
    result.page_internal_rasxod_kol = 0;
    result.page_internal_prixod_summa = 0;
    result.page_internal_prixod_kol = 0;
    result.page_to_summa = 0;
    result.page_to_iznos_summa = 0;
    result.page_to_kol = 0;

    result.data.forEach((item) => {
      result.from_summa += item.from.summa;
      result.from_kol += item.from.kol;
      result.internal_rasxod_summa += item.internal.rasxod_summa;
      result.internal_rasxod_kol += item.internal.rasxod_kol;
      result.internal_prixod_summa += item.internal.prixod_summa;
      result.internal_prixod_kol += item.internal.prixod_kol;
      result.to_summa += item.to.summa;
      result.to_iznos_summa += item.to.iznos_summa;
      result.to_kol += item.to.kol;
    });

    result.data = HelperFunctions.paginate({
      array: result.data,
      page: data.page,
      limit: data.limit,
    });

    result.data.forEach((item) => {
      result.page_from_summa += item.from.summa;
      result.page_from_kol += item.from.kol;
      result.page_internal_rasxod_summa += item.internal.rasxod_summa;
      result.page_internal_rasxod_kol += item.internal.rasxod_kol;
      result.page_internal_prixod_summa += item.internal.prixod_summa;
      result.page_internal_prixod_kol += item.internal.prixod_kol;
      result.page_to_summa += item.to.summa;
      result.page_to_iznos_summa += item.to.iznos_summa;
      result.page_to_kol += item.to.kol;
    });

    return { ...result, total };
  }

  static async calculateKol(data) {
    data.product.internal = await Jur7SaldoDB.getKolAndSumma(
      [data.product.product_id, data.main_schet_id],
      `${data.year}-${data.month < 10 ? `0${data.month}` : data.month}-01`,
      data.to,
      data.product.responsible_id
    );

    data.product.to = {
      kol: data.product.from.kol + data.product.internal.kol,
      summa: data.product.from.summa + data.product.internal.summa,
      iznos_summa:
        data.product.from.iznos_summa + data.product.internal.iznos_summa,
    };

    if (data.product.to.kol !== 0) {
      data.product.to.sena = data.product.to.summa / data.product.to.kol;
    } else {
      data.product.to.sena = data.product.to.summa;
    }

    return data.product;
  }

  static async checkDelete(data) {
    const result = await Jur7SaldoDB.checkDelete([
      data.region_id,
      data.main_schet_id,
    ]);

    return result;
  }

  static async getById(data) {
    const result = await Jur7SaldoDB.getById(
      [data.region_id, data.id, data.main_schet_id],
      data.isdeleted,
      data.iznos
    );

    return result;
  }

  static async reportByResponsibleExcel(data) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("material obarotka");

    worksheet.mergeCells("I1", "K1");
    worksheet.getCell("I1").value = "“ТАСДИҚЛАЙМАН”";
    worksheet.mergeCells("H2", "K2");
    worksheet.getCell("H2").value = data.region.name;

    worksheet.getCell("H3").value = "бошлиғи";

    worksheet.mergeCells("H4", "K4");
    worksheet.getCell("H4").value = "";

    worksheet.mergeCells("A5", "C5");
    worksheet.getCell("A5").value =
      `Материалний отчёт за ${returnStringDate(new Date(data.to))}`;

    worksheet.getCell("A6").value = "Наименования претмета";

    worksheet.getCell("B6").value = "Ед.изм";

    worksheet.mergeCells("C6", "D6");
    worksheet.getCell("C6").value = `OCTATOK на нач.`;

    worksheet.mergeCells("E6", "H6");
    worksheet.getCell("E6").value = `ОБОРОТ`;

    worksheet.mergeCells("I6", "J6");
    worksheet.getCell("I6").value = `OCTATOK на кон.`;

    worksheet.getCell("K6").value = `Дата Прихода`;

    if (data.iznos === "true") {
      worksheet.mergeCells("L6", "P6");
      worksheet.getCell("L6").value = `OCTATOK на кон.`;

      worksheet.getCell("L7").value = `Салдо изн`;

      worksheet.getCell("M7").value = `Приход`;

      worksheet.getCell("N7").value = `тек из`;

      worksheet.getCell("O7").value = `Расход`;

      worksheet.getCell("P7").value = `Салдо изн`;
    }

    worksheet.getCell("C7").value = `Кол`;

    worksheet.getCell("D7").value = `Остаток`;

    worksheet.getCell("E7").value = `Кол`;

    worksheet.getCell("F7").value = `Приход`;

    worksheet.getCell("G7").value = `Кол`;

    worksheet.getCell("H7").value = `Расход`;

    worksheet.getCell("I7").value = `Кол`;

    worksheet.getCell("J7").value = `Остаток`;

    const columns = [
      { key: "name", width: 50 },
      { key: "edin", width: 10 },
      { key: "from_kol", width: 10 },
      { key: "from_summa", width: 20 },
      { key: "internal_kol_prixod", width: 10 },
      { key: "internal_summa_prixod", width: 20 },
      { key: "internal_kol_rasxod", width: 10 },
      { key: "internal_summa_rasxod", width: 20 },
      { key: "to_kol", width: 10 },
      { key: "to_summa", width: 20 },
      { key: "prixod_date", width: 15 },
    ];

    if (data.iznos === "true") {
      columns.push(
        { key: "from_iznos_summa", width: 20 },
        { key: "iznos_prixod", width: 20 },
        { key: "month_iznos_summa", width: 20 },
        { key: "iznos_rasxod", width: 20 },
        { key: "to_iznos_summa", width: 20 }
      );
    }

    worksheet.columns = columns;

    const all_itogo = {
      from_kol: 0,
      from_summa: 0,
      internal_kol_prixod: 0,
      internal_summa_prixod: 0,
      internal_kol_rasxod: 0,
      internal_summa_rasxod: 0,
      to_kol: 0,
      to_summa: 0,
      from_iznos_summa: 0,
      iznos_prixod: 0,
      month_iznos_summa: 0,
      iznos_rasxod: 0,
      to_iznos_summa: 0,
    };

    for (let responsible of data.products) {
      worksheet.addRow({
        name: `${responsible.fio}     Cчет    ${responsible.debet_schet}`,
      });

      worksheet.addRow({});

      const itogo = {
        from_kol: 0,
        from_summa: 0,
        internal_kol_prixod: 0,
        internal_summa_prixod: 0,
        internal_kol_rasxod: 0,
        internal_summa_rasxod: 0,
        to_kol: 0,
        to_summa: 0,
        from_iznos_summa: 0,
        iznos_prixod: 0,
        month_iznos_summa: 0,
        iznos_rasxod: 0,
        to_iznos_summa: 0,
      };

      responsible.products.forEach((item) => {
        if (data.iznos === "true") {
          worksheet.addRow({
            name: item.name,
            edin: item.edin,
            from_kol: item.from.kol,
            from_summa: item.from.summa,
            internal_kol_prixod: item.internal.kol_prixod,
            internal_summa_prixod: item.internal.summa_prixod,
            internal_kol_rasxod: item.internal.kol_rasxod,
            internal_summa_rasxod: item.internal.summa_rasxod,
            to_kol: item.to.kol,
            to_summa: item.to.summa,
            prixod_date: product.prixodData
              .map((item) => item.docDate)
              .join(" / "),
            from_iznos_summa: item.from.iznos_summa,
            iznos_prixod: item.internal.iznos_prixod,
            month_iznos_summa: item.month_iznos_summa,
            iznos_rasxod: item.internal.iznos_rasxod,
            to_iznos_summa: item.to.iznos_summa,
          });
        } else {
          worksheet.addRow({
            name: item.name,
            edin: item.edin,
            from_kol: item.from.kol,
            from_summa: item.from.summa,
            internal_kol_prixod: item.internal.kol_prixod,
            internal_summa_prixod: item.internal.summa_prixod,
            internal_kol_rasxod: item.internal.kol_rasxod,
            internal_summa_rasxod: item.internal.summa_rasxod,
            to_kol: item.to.kol,
            to_summa: item.to.summa,
            prixod_date: product.prixodData
              .map((item) => item.docDate)
              .join(" / "),
          });
        }

        itogo.from_kol += item.from.kol;
        itogo.from_summa += item.from.summa;
        itogo.internal_kol_prixod += item.internal.kol_prixod;
        itogo.internal_summa_prixod += item.internal.summa_prixod;
        itogo.internal_kol_rasxod += item.internal.kol_rasxod;
        itogo.internal_summa_rasxod += item.internal.summa_rasxod;
        itogo.to_kol += item.to.kol;
        itogo.to_summa += item.to.summa;
        itogo.from_iznos_summa += item.from.iznos_summa;
        itogo.iznos_prixod += item.internal.iznos_prixod;
        itogo.month_iznos_summa += item.month_iznos_summa;
        itogo.iznos_rasxod += item.internal.iznos_rasxod;
        itogo.to_iznos_summa += item.to.iznos_summa;
      });

      if (data.iznos === "true") {
        worksheet.addRow({
          name: "Итого",
          from_kol: itogo.from_kol,
          from_summa: itogo.from_summa,
          internal_kol_prixod: itogo.internal_kol_prixod,
          internal_summa_prixod: itogo.internal_summa_prixod,
          internal_kol_rasxod: itogo.internal_kol_rasxod,
          internal_summa_rasxod: itogo.internal_summa_rasxod,
          to_kol: itogo.to_kol,
          to_summa: itogo.to_summa,
          from_iznos_summa: itogo.from_iznos_summa,
          iznos_prixod: itogo.iznos_prixod,
          month_iznos_summa: itogo.month_iznos_summa,
          iznos_rasxod: itogo.iznos_rasxod,
          to_iznos_summa: itogo.to_iznos_summa,
        });
      } else {
        worksheet.addRow({
          name: "Итого",
          from_kol: itogo.from_kol,
          from_summa: itogo.from_summa,
          internal_kol_prixod: itogo.internal_kol_prixod,
          internal_summa_prixod: itogo.internal_summa_prixod,
          internal_kol_rasxod: itogo.internal_kol_rasxod,
          internal_summa_rasxod: itogo.internal_summa_rasxod,
          to_kol: itogo.to_kol,
          to_summa: itogo.to_summa,
        });
      }

      all_itogo.from_kol += itogo.from_kol;
      all_itogo.from_summa += itogo.from_summa;
      all_itogo.internal_kol_prixod += itogo.internal_kol_prixod;
      all_itogo.internal_summa_prixod += itogo.internal_summa_prixod;
      all_itogo.internal_kol_rasxod += itogo.internal_kol_rasxod;
      all_itogo.internal_summa_rasxod += itogo.internal_summa_rasxod;
      all_itogo.to_kol += itogo.to_kol;
      all_itogo.to_summa += itogo.to_summa;
      all_itogo.from_iznos_summa += itogo.from_iznos_summa;
      all_itogo.iznos_prixod += itogo.iznos_prixod;
      all_itogo.month_iznos_summa += itogo.month_iznos_summa;
      all_itogo.iznos_rasxod += itogo.iznos_rasxod;
      all_itogo.to_iznos_summa += itogo.to_iznos_summa;
    }

    if (data.iznos === "true") {
      worksheet.addRow({
        name: "Итого",
        from_kol: all_itogo.from_kol,
        from_summa: all_itogo.from_summa,
        internal_kol_prixod: all_itogo.internal_kol_prixod,
        internal_summa_prixod: all_itogo.internal_summa_prixod,
        internal_kol_rasxod: all_itogo.internal_kol_rasxod,
        internal_summa_rasxod: all_itogo.internal_summa_rasxod,
        to_kol: all_itogo.to_kol,
        to_summa: all_itogo.to_summa,
        from_iznos_summa: all_itogo.from_iznos_summa,
        iznos_prixod: all_itogo.iznos_prixod,
        month_iznos_summa: all_itogo.month_iznos_summa,
        iznos_rasxod: all_itogo.iznos_rasxod,
        to_iznos_summa: all_itogo.to_iznos_summa,
      });
    } else {
      worksheet.addRow({
        name: "Итого",
        from_kol: all_itogo.from_kol,
        from_summa: all_itogo.from_summa,
        internal_kol_prixod: all_itogo.internal_kol_prixod,
        internal_summa_prixod: all_itogo.internal_summa_prixod,
        internal_kol_rasxod: all_itogo.internal_kol_rasxod,
        internal_summa_rasxod: all_itogo.internal_summa_rasxod,
        to_kol: all_itogo.to_kol,
        to_summa: all_itogo.to_summa,
      });
    }

    worksheet.eachRow((row, row_number) => {
      let bold = false;
      let horizontal = "center";

      if (row_number < 7) {
        worksheet.getRow(row_number).height = 40;
        bold = true;
      } else {
        worksheet.getRow(row_number).height = 25;
      }

      row.eachCell((cell, column) => {
        if (column > 2 && column !== 11 && row_number > 8) {
          horizontal = "right";
        } else if (column === 1 && row_number > 8) {
          horizontal = "left";
        } else {
          horizontal = "center";
        }

        if (column === 1 && row_number > 7) {
          const check_array = cell.value.split(" ");
          const check = check_array.find(
            (item) => item === "Cчет" || item === "Итого"
          );
          if (check) {
            bold = true;
          }
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

    const folder_path = path.join(__dirname, `../../../../public/exports`);

    try {
      await fs.access(folder_path, fs.constants.W_OK);
    } catch (error) {
      await fs.mkdir(folder_path);
    }

    const file_name = `material_oborotka.${new Date().getTime()}.xlsx`;

    const file_path = `${folder_path}/${file_name}`;

    await workbook.xlsx.writeFile(file_path);

    return { file_name, file_path };
  }

  static async createSaldoDate(data) {
    const year = new Date(data.doc_date).getFullYear();
    const month = new Date(data.doc_date).getMonth() + 1;

    const check = await Jur7SaldoDB.getSaldoDate([
      data.region_id,
      `${year}-${String(month).padStart(2, "0")}-01`,
      data.main_schet_id,
    ]);

    let dates = [];
    for (let date of check) {
      dates.push(
        await Jur7SaldoDB.createSaldoDate(
          [
            data.region_id,
            date.year,
            date.month,
            data.main_schet_id,
            data.budjet_id,
            tashkentTime(),
            tashkentTime(),
          ],
          data.client
        )
      );
    }

    return dates;
  }

  static async getEndSaldo(data) {
    const result = await Jur7SaldoDB.getEndSaldo([
      data.region_id,
      data.main_schet_id,
    ]);

    return result;
  }

  static async cleanData(data) {
    await db.transaction(async (client) => {
      await Jur7SaldoDB.cleanData([data.region_id, data.main_schet_id], client);
    });
  }

  static async getFirstSaldoDate(data) {
    const result = await Jur7SaldoDB.getFirstSaldoDate([
      data.region_id,
      data.main_schet_id,
    ]);

    return result;
  }

  static async checkDoc(data) {
    const result = await Jur7SaldoDB.checkDoc([
      data.year,
      data.month,
      data.region_id,
      data.main_schet_id,
    ]);

    return result;
  }

  static async deleteById(data) {
    const result = await Jur7SaldoDB.deleteById([data.id]);

    return result;
  }

  static async getSaldoCheck(data) {
    const last_saldo = await Jur7SaldoDB.get([
      data.region_id,
      data.year,
      data.month,
      data.main_schet_id,
      0,
      99999999,
    ]);

    return last_saldo.data;
  }

  static async getBlock(data) {
    const result = await Jur7SaldoDB.getBlock([
      data.region_id,
      data.main_schet_id,
    ]);

    return result;
  }

  static async getSaldoDate(data) {
    const result = await Jur7SaldoDB.getSaldoDate([
      data.region_id,
      data.date,
      data.main_schet_id,
    ]);

    return result;
  }

  static async check(data) {
    const result = await Jur7SaldoDB.check(
      [data.region_id, data.main_schet_id],
      data.year,
      data.month
    );

    const first = await Jur7SaldoDB.getFirstSaldoDate([
      data.region_id,
      data.main_schet_id,
    ]);

    const end = await Jur7SaldoDB.getEndSaldoDate([
      data.region_id,
      data.main_schet_id,
    ]);

    return { result, meta: { first, end } };
  }

  static async unblock(data) {
    await Jur7SaldoDB.unblock([
      data.region_id,
      data.year,
      data.month,
      data.main_schet_id,
    ]);
  }

  static async create(data) {
    const groups = data.last_saldo.reduce((acc, item) => {
      if (!acc[item.responsible_id]) acc[item.responsible_id] = [];
      acc[item.responsible_id].push(item);
      return acc;
    }, {});

    const result = await Promise.all(
      Object.entries(groups).map(async ([responsibleId, products]) => {
        const updatedProducts = await Promise.all(
          products.map(async (product) => {
            const periodStart = `${data.last_date.year}-${data.last_date.month}-01`;
            const periodEnd = `${data.year}-${data.month}-01`;

            const saldos = await Jur7SaldoDB.getKolAndSumma(
              [product.naimenovanie_tovarov_jur7_id, data.main_schet_id],
              periodStart,
              periodEnd,
              Number(responsibleId)
            );

            saldos.kol += product.kol;
            saldos.summa += product.summa;
            saldos.iznos_summa += product.iznos_summa;
            saldos.sena =
              saldos.kol !== 0 ? saldos.summa / saldos.kol : saldos.summa;

            return {
              ...product,
              id: product.naimenovanie_tovarov_jur7_id,
              data: saldos,
              doc_data: {
                doc_date: product.prixod_data.doc_date,
                doc_num: product.prixod_data.doc_num,
                id: product.prixod_data.doc_id,
              },
            };
          })
        );

        const filtered = updatedProducts.filter(
          (item) => item.data.iznos_summa !== 0 || item.data.kol !== 0
        );

        return filtered.length
          ? { responsible_id: responsibleId, products: filtered }
          : null;
      })
    );

    const finalResult = result.filter(Boolean);

    const dates = await db.transaction(async (client) => {
      await Jur7SaldoDB.delete(
        [data.year, data.month, data.region_id],
        client,
        "saldo"
      );

      const saldoData = [];

      for (let responsible of finalResult) {
        for (let product of responsible.products) {
          let sena = 0;
          let iznos_summa = 0;
          let last_iznos_summa = 0;
          let month_iznos_summa = 0;

          const iznos_date = HelperFunctions.checkIznosDate({
            doc_date: product.doc_data.doc_date,
            year: data.year,
            month: data.month,
          });

          if (iznos_date) {
            sena =
              product.data.kol !== 0
                ? product.data.summa / product.data.kol
                : product.data.summa;

            month_iznos_summa =
              product.data.summa * (product.group.iznos_foiz / 100 / 12);

            if (product.data.kol !== 0) {
              iznos_summa = month_iznos_summa + product.data.iznos_summa;
              if (sena !== 0) {
                month_iznos_summa = Math.min(
                  month_iznos_summa,
                  product.data.summa
                );
                iznos_summa = Math.min(iznos_summa, product.data.summa);
              }
            } else {
              iznos_summa = product.data.iznos_summa;
            }

            last_iznos_summa =
              product.data.iznos_summa + product.eski_iznos_summa;
          } else {
            iznos_summa = product.data.iznos_summa;
            last_iznos_summa = 0;
          }

          if (product.iznos) {
            console.log(iznos_summa);
          }

          saldoData.push([
            data.user_id,
            product.id,
            product.data.kol,
            sena,
            product.data.summa,
            data.month,
            data.year,
            `${data.year}-${data.month}-01`,
            product.doc_data?.doc_date || `${data.year}-${data.month}-01`,
            product.doc_data?.doc_num || "saldo",
            responsible.responsible_id,
            data.region_id,
            product.doc_data?.id,
            product.iznos,
            iznos_summa,
            product.iznos_schet,
            product.iznos_sub_schet,
            last_iznos_summa,
            product.iznos_start,
            month_iznos_summa,
            product.debet_schet,
            product.debet_sub_schet,
            product.kredit_schet,
            product.kredit_sub_schet,
            data.budjet_id,
            data.main_schet_id,
            "saldo",
            HelperFunctions.tashkentTime(),
            HelperFunctions.tashkentTime(),
          ]);
        }
      }

      const BATCH_SIZE = 1000;
      for (let i = 0; i < saldoData.length; i += BATCH_SIZE) {
        const batch = saldoData.slice(i, i + BATCH_SIZE);
        await Jur7SaldoDB.createMultiInsert(batch, client);
      }

      await Jur7SaldoDB.unblock(
        [data.region_id, data.year, data.month, data.main_schet_id],
        client
      );

      const date = HelperFunctions.returnDate({
        year: data.year,
        month: data.month,
      });
      const dates = await this.createSaldoDate({
        ...data,
        doc_date: date,
      });

      return dates;
    });

    return dates;
  }

  static async get(data) {
    const { data: result } = await Jur7SaldoDB.get([
      data.region_id,
      data.year,
      data.month,
      data.main_schet_id,
      0,
      99999999,
    ]);

    return result;
  }

  static async deleteByYearMonth(data) {
    await Jur7SaldoDB.delete(
      [data.year, data.month, data.region_id],
      null,
      data.type
    );
  }

  static async delete(data) {
    await Jur7SaldoDB.deleteByMonth([
      data.region_id,
      data.month,
      data.year,
      data.main_schet_id,
    ]);
  }

  static async importData(data) {
    await db.transaction(async (client) => {
      const saldo_create = [];
      for (let doc of data.docs) {
        if (doc.summa !== 0 && doc.kol !== 0) {
          doc.sena = doc.summa / doc.kol;
        } else {
          doc.sena = 0;
        }

        const product = await Jur7SaldoDB.createProduct(
          [
            data.user_id,
            data.budjet_id,
            doc.name,
            doc.unit_id,
            doc.group_jur7_id,
            doc.inventar_num,
            doc.serial_num,
            doc.iznos,
            tashkentTime(),
            tashkentTime(),
          ],
          client
        );

        saldo_create.push({ product_id: product.id, ...doc });
      }

      const year = data.date_saldo.full_date.getFullYear();
      const month = data.date_saldo.full_date.getMonth() + 1;

      for (let doc of saldo_create) {
        let old_iznos = doc.eski_iznos_summa;

        if (doc.iznos) {
          old_iznos = old_iznos >= doc.summa ? doc.summa : old_iznos;
        }

        await Jur7SaldoDB.create(
          [
            data.user_id,
            doc.product_id,
            doc.kol,
            doc.sena,
            doc.summa,
            month,
            year,
            `${year}-${String(month).padStart(2, "0")}-01`,
            doc?.doc_date || `${year}-${String(month).padStart(2, "0")}-01`,
            doc?.doc_num || "saldo",
            doc.responsible_id,
            data.region_id,
            null,
            doc.iznos,
            old_iznos,
            doc.iznos_schet,
            doc.iznos_sub_schet,
            old_iznos,
            doc.iznos_start,
            0,
            doc.group.schet,
            doc.group.provodka_subschet,
            doc.group.provodka_kredit,
            doc.group.provodka_subschet,
            data.budjet_id,
            data.main_schet_id,
            "import",
            tashkentTime(),
            tashkentTime(),
          ],
          client
        );
      }
    });
  }
};
