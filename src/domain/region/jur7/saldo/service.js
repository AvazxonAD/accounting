const { SaldoDB } = require("./db");
const {
  tashkentTime,
  returnStringDate,
  HelperFunctions,
} = require("@helper/functions");
const { db } = require("@db/index");
const xlsx = require("xlsx");
const ExcelJS = require("exceljs");
const path = require("path");
const fs = require("fs").promises;

exports.SaldoService = class {
  static returnDocDate(data) {
    const dates = String(data.doc_date).split("");
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
        return `${new Date(utc_value * 1000).getFullYear()}-${new Date(utc_value * 1000).getMonth() + 1}-${String(new Date(utc_value * 1000).getDate()).padStart(2, "0")}`;
      }

      data.doc_date = excelSerialToDate(data.doc_date);
    }

    return data.doc_date;
  }

  static async getFirstSaldoDocs(data) {
    const result = await SaldoDB.getFirstSaldoDocs([
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

  static async importData(data) {
    await db.transaction(async (client) => {
      const saldo_create = [];
      for (let doc of data.docs) {
        if (doc.summa !== 0) {
          doc.sena = doc.summa / doc.kol;
        } else {
          doc.sena = 0;
        }

        if (doc.iznos) {
          for (let i = 1; i <= doc.kol; i++) {
            const product = await SaldoDB.createProduct(
              [
                data.user_id,
                data.budjet_id,
                doc.name,
                doc.edin,
                doc.group_jur7_id,
                doc.inventar_num,
                doc.serial_num,
                doc.iznos,
                tashkentTime(),
                tashkentTime(),
              ],
              client
            );

            if (doc.eski_iznos_summa && doc.eski_iznos_summa > 0) {
              doc.old_iznos = doc.eski_iznos_summa / doc.kol;
            }

            saldo_create.push({
              ...doc,
              product_id: product.id,
              kol: 1,
              summa: doc.sena,
            });
          }
        } else {
          const product = await SaldoDB.createProduct(
            [
              data.user_id,
              data.budjet_id,
              doc.name,
              doc.edin,
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
      }

      const { year, month, full_date } = data.date_saldo;

      for (let doc of saldo_create) {
        let old_iznos = 0;
        let iznos_summa = 0;
        let month_iznos_summa = 0;

        if (doc.iznos) {
          month_iznos_summa = doc.sena * (doc.iznos_foiz / 100);
          old_iznos = doc.old_iznos >= doc.sena ? doc.sena : doc.old_iznos;
        }

        await SaldoDB.create(
          [
            data.user_id,
            doc.product_id,
            doc.kol,
            doc.sena,
            doc.summa,
            month,
            year,
            full_date,
            doc?.doc_date || full_date,
            doc?.doc_num || "saldo",
            doc.responsible_id,
            data.region_id,
            null,
            doc.iznos,
            iznos_summa,
            doc.iznos_schet,
            doc.iznos_sub_schet,
            old_iznos,
            doc.iznos_start,
            month_iznos_summa,
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

  static async getByProduct(data) {
    const { year, month } = HelperFunctions.returnMonthAndYear({
      doc_date: data.to,
    });

    const result = await SaldoDB.getByProduct(
      [
        data.region_id,
        month,
        year,
        data.main_schet_id,
        data.offset,
        data.limit,
      ],
      {
        group_id: data.group_id,
        responsible_id: data.responsible_id,
        iznos: data.iznos,
        search: data.search,
        product_id: data.product_id,
        budjet_id: data.budjet_id,
      }
    );

    for (let product of result.data) {
      product = await this.calculateKol({
        product,
        main_schet_id: data.main_schet_id,
        to: data.to,
        year,
        month,
      });
    }

    if (data.rasxod) {
      result.data = result.data.filter((item) => item.to.kol !== 0);
    }

    return result;
  }

  static async calculateKol(data) {
    data.product.internal = await SaldoDB.getKolAndSumma(
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
    const result = await SaldoDB.checkDelete([
      data.region_id,
      data.main_schet_id,
    ]);

    return result;
  }

  static async getById(data) {
    const result = await SaldoDB.getById(
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
            prixod_date: item.prixodData.docDate,
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
            prixod_date: item.prixodData.docDate,
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

    const check = await SaldoDB.getSaldoDate([
      data.region_id,
      `${year}-${String(month).padStart(2, "0")}-01`,
      data.main_schet_id,
    ]);

    let dates = [];
    for (let date of check) {
      dates.push(
        await SaldoDB.createSaldoDate(
          [
            data.region_id,
            date.year,
            date.month,
            data.main_schet_id,
            data.budjet_id,
            tashkentTime(),
            tashkentTime(),
          ],
          client
        )
      );
    }

    return dates;
  }

  static async getEndSaldo(data) {
    const result = await SaldoDB.getEndSaldo([
      data.region_id,
      data.main_schet_id,
    ]);

    return result;
  }

  static async cleanData(data) {
    await db.transaction(async (client) => {
      await SaldoDB.cleanData([data.region_id, data.main_schet_id], client);
    });
  }

  static async getFirstSaldoDate(data) {
    const result = await SaldoDB.getFirstSaldoDate([
      data.region_id,
      data.main_schet_id,
    ]);

    return result;
  }

  static async checkDoc(data) {
    const result = await SaldoDB.checkDoc([
      data.year,
      data.month,
      data.region_id,
      data.main_schet_id,
    ]);

    return result;
  }

  static async deleteById(data) {
    const result = await SaldoDB.deleteById([data.id]);

    return result;
  }

  static async getSaldoCheck(data) {
    const last_saldo = await SaldoDB.get([
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
    const result = await SaldoDB.getBlock([data.region_id, data.main_schet_id]);

    return result;
  }

  static async getSaldoDate(data) {
    const result = await SaldoDB.getSaldoDate([
      data.region_id,
      data.date,
      data.main_schet_id,
    ]);

    return result;
  }

  static async check(data) {
    const result = await SaldoDB.check(
      [data.region_id, data.main_schet_id],
      data.year,
      data.month
    );

    const first = await SaldoDB.getFirstSaldoDate([
      data.region_id,
      data.main_schet_id,
    ]);

    const end = await SaldoDB.getEndSaldoDate([
      data.region_id,
      data.main_schet_id,
    ]);

    return { result, meta: { first, end } };
  }

  static async unblock(data) {
    await SaldoDB.unblock([
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

            const saldos = await SaldoDB.getKolAndSumma(
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
          (item) =>
            item.data.iznos_summa !== 0 ||
            (item.data.kol !== 0 && item.data.summa !== 0)
        );

        return filtered.length
          ? { responsible_id: responsibleId, products: filtered }
          : null;
      })
    );

    const finalResult = result.filter(Boolean);

    const dates = await db.transaction(async (client) => {
      await SaldoDB.delete(
        [data.year, data.month, data.region_id],
        client,
        "saldo"
      );

      const saldoData = [];
      const currentSaldoDate = new Date(`${data.year}-${data.month}-01`);

      for (let responsible of finalResult) {
        for (let product of responsible.products) {
          let sena = 0;
          let iznos_summa = 0;
          let last_iznos_summa = 0;
          let month_iznos_summa = 0;

          const docDate = new Date(product.doc_data.doc_date);
          const nextDate = HelperFunctions.nextDate({
            year: docDate.getFullYear(),
            month: docDate.getMonth() + 1,
          });
          const futureSaldoDate = new Date(
            `${nextDate.year}-${nextDate.month}-01`
          );

          if (currentSaldoDate > futureSaldoDate) {
            sena =
              product.data.kol !== 0
                ? product.data.summa / product.data.kol
                : product.data.summa;

            month_iznos_summa = sena * (product.group.iznos_foiz / 100);

            if (product.data.kol !== 0) {
              iznos_summa = month_iznos_summa + product.data.iznos_summa;
              if (sena !== 0) {
                month_iznos_summa = Math.min(month_iznos_summa, sena);
                iznos_summa = Math.min(iznos_summa, sena);
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
        await SaldoDB.createMultiInsert(batch, client);
      }

      await SaldoDB.unblock(
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
    const { data: result } = await SaldoDB.get([
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
    await SaldoDB.delete(
      [data.year, data.month, data.region_id],
      null,
      data.type
    );
  }

  static async delete(data) {
    await SaldoDB.deleteByMonth([
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
        if (doc.summa !== 0) {
          doc.sena = doc.summa / doc.kol;
        } else {
          doc.sena = 0;
        }

        if (doc.iznos) {
          for (let i = 1; i <= doc.kol; i++) {
            const product = await SaldoDB.createProduct(
              [
                data.user_id,
                data.budjet_id,
                doc.name,
                doc.edin,
                doc.group_jur7_id,
                doc.inventar_num,
                doc.serial_num,
                doc.iznos,
                tashkentTime(),
                tashkentTime(),
              ],
              client
            );

            saldo_create.push({
              ...doc,
              product_id: product.id,
              kol: 1,
              summa: doc.sena,
            });
          }
        } else {
          const product = await SaldoDB.createProduct(
            [
              data.user_id,
              data.budjet_id,
              doc.name,
              doc.edin,
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
      }

      let dates = [];

      let year, month;

      let first_date = await SaldoDB.getFirstSaldoDate([
        data.region_id,
        data.main_schet_id,
      ]);
      if (first_date) {
        first_date = new Date(first_date.date_saldo);

        if (first_date < data.date_saldo.full_date) {
          year = first_date.getFullYear();
          month = first_date.getMonth() + 1;
        } else {
          year = data.date_saldo.full_date.getFullYear();
          month = data.date_saldo.full_date.getMonth() + 1;
        }
      } else {
        year = data.date_saldo.full_date.getFullYear();
        month = data.date_saldo.full_date.getMonth() + 1;
      }

      for (let doc of saldo_create) {
        let old_iznos = 0;
        let iznos_summa = 0;
        let month_iznos_summa = 0;

        if (doc.iznos) {
          month_iznos_summa = doc.sena * (doc.iznos_foiz / 100);
          old_iznos = doc.eski_iznos_summa ? doc.eski_iznos_summa / doc.kol : 0;
          old_iznos = old_iznos >= doc.sena ? doc.sena : old_iznos;
        }

        await SaldoDB.create(
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
            iznos_summa,
            doc.iznos_schet,
            doc.iznos_sub_schet,
            old_iznos,
            doc.iznos_start,
            month_iznos_summa,
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

  static async updateIznosSumma(data) {
    const result = await SaldoDB.updateIznosSumma([data.iznos_summa, data.id]);

    return result;
  }

  static async getByGroup(data) {
    const month = new Date(data.to).getMonth() + 1;
    const year = new Date(data.to).getFullYear();

    for (let group of data.groups) {
      const products = await SaldoDB.get(
        [data.region_id, year, month, data.main_schet_id, 0, 99999999],
        data.responsible_id,
        data.search,
        data.product_id,
        group.id,
        data.iznos
      );
      group.products = products.data;
      for (let product of group.products) {
        product.internal = await SaldoDB.getKolAndSumma(
          [product.naimenovanie_tovarov_jur7_id, data.main_schet_id],
          `${year}-${month < 10 ? `0${month}` : month}-01`,
          data.to,
          product.responsible.id
        );

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
          product.to.month_iznos = product.month_iznos_summa;
          product.to.eski_iznos_summa = product.eski_iznos_summa;
        }
      }

      if (data.iznos) {
        group.products = group.products.filter(
          (item) =>
            (item.to.kol !== 0 && item.to.summa !== 0) ||
            item.to.iznos_summa !== 0
        );
      } else {
        group.products = group.products.filter(
          (item) => item.to.kol !== 0 && item.to.summa !== 0
        );
      }
    }

    return data.groups;
  }
};
