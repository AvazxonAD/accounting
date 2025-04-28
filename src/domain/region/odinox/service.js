const { OdinoxDB } = require("./db");
const { db } = require("@db/index");
const ExcelJS = require("exceljs");
const fs = require("fs");
const path = require("path");
const { HelperFunctions, sum } = require(`@helper/functions`);

exports.OdinoxService = class {
  static now = new Date();

  static async getSort1Docs(data) {
    const result = await OdinoxDB.getSort1Docs([
      data.year,
      data.months,
      data.region_id,
      data.main_schet_id,
      data.sub_schet,
    ]);

    return result;
  }

  static async getSort2Docs(data) {
    const result = await OdinoxDB.getSort2Docs([
      data.year,
      data.months,
      data.region_id,
      data.main_schet_id,
      data.sub_schet,
    ]);

    return result;
  }

  static async getSort3Docs(data) {
    const result = await OdinoxDB.getSort3Docs([
      data.year,
      data.months,
      data.region_id,
      data.main_schet_id,
      data.sub_schet,
    ]);

    return result;
  }

  static async getByIdExcel(data) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("main book");

    worksheet.mergeCells(`A1`, "T1");
    worksheet.getCell(`A1`).value =
      `${HelperFunctions.returnStringYearMonth({ year: data.year, month: data.month })}`;

    worksheet.mergeCells(`A2`, "A3");
    worksheet.getCell(`A3`).value = `№`;

    worksheet.mergeCells(`B2`, "B3");
    worksheet.getCell(`B2`).value = `Nomi`;

    worksheet.mergeCells(`C2`, "C3");
    worksheet.getCell(`C2`).value = `Smeta №`;

    worksheet.mergeCells(`D2`, "H2");
    worksheet.getCell(`D2`).value = "Ой учун";

    worksheet.mergeCells(`I2`, "M2");
    worksheet.getCell(`I2`).value = "Йил учун";

    worksheet.getCell("D3").value = "Ажратилган маблағлар";
    worksheet.getCell("E3").value =
      "Вазирлик томонидан тўлаб берилган маблағлар";
    worksheet.getCell("F3").value = "Касса расход / Банк расход";
    worksheet.getCell("G3").value = "Ҳақиқатда ҳаражатлар";
    worksheet.getCell("H3").value = "Қолдиқ";

    worksheet.getCell("I3").value = "Ажратилган маблағлар";
    worksheet.getCell("J3").value =
      "Вазирлик томонидан тўлаб берилган маблағлар";
    worksheet.getCell("K3").value = "Касса расход / Банк расход";
    worksheet.getCell("L3").value = "Ҳақиқатда ҳаражатлар";
    worksheet.getCell("M3").value = "Қолдиқ";

    worksheet.columns = [
      { key: "order", width: 5 },
      { key: "smeta_name", width: 50 },
      { key: "smeta_number", width: 19 },
      { key: "grafik", width: 19 },
      { key: "bank_prixod", width: 19 },
      { key: "jur1_jur2_rasxod", width: 19 },
      { key: "jur3a_akt_avans", width: 19 },
      { key: "remaining", width: 19 },
      { key: "grafik_year", width: 19 },
      { key: "bank_prixod_year", width: 19 },
      { key: "jur1_jur2_rasxod_year", width: 19 },
      { key: "jur3a_akt_avans_year", width: 19 },
      { key: "remaining_year", width: 19 },
    ];

    let column = 4;
    let genral = false;
    for (let i = 0; i < data.childs.length; i++) {
      const type = data.childs[i];

      if (!genral) {
        type.sub_childs.forEach((item, index) => {
          worksheet.addRow({
            order: index + 1,
            smeta_name: item.smeta_name || "",
            smeta_number: item.smeta_number || "",
          });

          column++;
        });

        genral = true;
      }

      if (type.sort_order === 0) {
        let column = 4;
        type.sub_childs.forEach((item) => {
          worksheet.getCell(`D${column}`).value = item.summa;

          column++;
        });
        worksheet.getCell(`D${column}`).value = type.summa;
      }

      if (type.sort_order === 1) {
        let column = 4;
        type.sub_childs.forEach((item) => {
          worksheet.getCell(`E${column}`).value = item.summa;

          column++;
        });
        worksheet.getCell(`E${column}`).value = type.summa;
      }

      if (type.sort_order === 2) {
        let column = 4;
        type.sub_childs.forEach((item) => {
          worksheet.getCell(`F${column}`).value = item.summa;

          column++;
        });
        worksheet.getCell(`F${column}`).value = type.summa;
      }

      if (type.sort_order === 3) {
        let column = 4;
        type.sub_childs.forEach((item) => {
          worksheet.getCell(`G${column}`).value = item.summa;

          column++;
        });
        worksheet.getCell(`G${column}`).value = type.summa;
      }

      if (type.sort_order === 4) {
        let column = 4;
        type.sub_childs.forEach((item) => {
          worksheet.getCell(`H${column}`).value = item.summa;

          column++;
        });
        worksheet.getCell(`H${column}`).value = type.summa;
      }

      if (type.sort_order === 5) {
        let column = 4;
        type.sub_childs.forEach((item) => {
          worksheet.getCell(`I${column}`).value = item.summa;

          column++;
        });
        worksheet.getCell(`I${column}`).value = type.summa;
      }

      if (type.sort_order === 6) {
        let column = 4;
        type.sub_childs.forEach((item) => {
          worksheet.getCell(`J${column}`).value = item.summa;

          column++;
        });
        worksheet.getCell(`J${column}`).value = type.summa;
      }

      if (type.sort_order === 7) {
        let column = 4;
        type.sub_childs.forEach((item) => {
          worksheet.getCell(`K${column}`).value = item.summa;

          column++;
        });
        worksheet.getCell(`K${column}`).value = type.summa;
      }

      if (type.sort_order === 8) {
        let column = 4;
        type.sub_childs.forEach((item) => {
          worksheet.getCell(`L${column}`).value = item.summa;

          column++;
        });
        worksheet.getCell(`L${column}`).value = type.summa;
      }

      if (type.sort_order === 9) {
        let column = 4;
        type.sub_childs.forEach((item) => {
          worksheet.getCell(`M${column}`).value = item.summa;

          column++;
        });
        worksheet.getCell(`M${column}`).value = type.summa;
      }
    }

    const end_column = column;
    worksheet.mergeCells(`A${column}`, `C${column}`);
    worksheet.getCell(`A${column}`).value = `Итого`;

    worksheet.eachRow((row, rowNumber) => {
      let bold = false;
      let horizontal = "center";
      let size = 13;

      if (rowNumber > 3) {
        size = 8;
      }

      if (end_column === rowNumber || rowNumber < 4) {
        bold = true;
      }

      row.eachCell((cell, column) => {
        if (column > 2 && rowNumber > 3) {
          cell.numFmt = "# ##0.00";

          horizontal = "right";
        }

        if (column === 2 && rowNumber > 3) {
          horizontal = "left";
        }

        Object.assign(cell, {
          font: { size, name: "Times New Roman", bold },
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
      await fs.promises.access(folder_path, fs.promises.constants.W_OK);
    } catch (error) {
      await fs.promises.mkdir(folder_path);
    }

    const file_name = `main_book.${new Date().getTime()}.xlsx`;

    const file_path = `${folder_path}/${file_name}`;

    await workbook.xlsx.writeFile(file_path);

    return { file_name, file_path };
  }

  static async update(data) {
    const result = await db.transaction(async (client) => {
      const doc = await OdinoxDB.update(
        [this.now, 1, this.now, data.id],
        client
      );

      await OdinoxDB.deleteChildByParentId([data.id], client);

      await this.createChild({ ...data, client, parent_id: doc.id });

      return { doc, dates: [] };
    });

    return result;
  }

  static async getEnd(data) {
    const result = await OdinoxDB.getEnd([data.region_id, data.main_schet_id]);

    return result;
  }

  static async createChild(data) {
    for (let child of data.childs) {
      for (let sub_child of child.sub_childs) {
        await OdinoxDB.createChild(
          [
            sub_child.smeta_id,
            sub_child.summa,
            data.parent_id,
            child.type_id,
            this.now,
            this.now,
          ],
          data.client
        );
      }
    }
  }

  static async create(data) {
    const result = await db.transaction(async (client) => {
      const doc = await OdinoxDB.create(
        [
          1,
          data.accept_time,
          this.now,
          data.user_id,
          data.year,
          data.month,
          data.main_schet_id,
          this.now,
          this.now,
        ],
        client
      );

      await this.createChild({ ...data, client, parent_id: doc.id });

      return doc;
    });

    return result;
  }

  static async getByIdType(data) {
    const result = await OdinoxDB.getByIdType([data.id]);

    return result;
  }

  static async getSmeta(data) {
    const smetas = await OdinoxDB.getSmeta([
      data.region_id,
      data.main_schet_id,
      data.year,
    ]);

    return smetas;
  }

  static getJur0Data(data) {
    for (let smeta of data.smetas) {
      if (smeta.smeta_grafik) {
        smeta.summa = smeta.smeta_grafik[`oy_${data.month}`];
      } else {
        smeta.summa = 0;
      }
    }

    return data.smetas;
  }

  static async getJur1Data(data) {
    const _data = await OdinoxDB.getJur1Data([
      data.year,
      data.months,
      data.region_id,
      data.main_schet_id,
    ]);

    for (let smeta of data.smetas) {
      smeta.summa = 0;
      _data.forEach((item) => {
        if (item.sub_schet === smeta.smeta_number) {
          smeta.summa += item.summa;
        }
      });
    }

    return data.smetas;
  }

  static async getJur2Data(data) {
    const _data = await OdinoxDB.getJur2Data([
      data.year,
      data.months,
      data.region_id,
      data.main_schet_id,
    ]);

    for (let smeta of data.smetas) {
      smeta.summa = 0;
      _data.forEach((item) => {
        if (item.sub_schet === smeta.smeta_number) {
          smeta.summa += item.summa;
        }
      });
    }

    return data.smetas;
  }

  static async getJur3Data(data) {
    const _data = await OdinoxDB.getJur3Data([
      data.year,
      data.months,
      data.region_id,
      data.main_schet_id,
    ]);

    for (let smeta of data.smetas) {
      smeta.summa = 0;
      _data.forEach((item) => {
        if (item.sub_schet === smeta.smeta_number) {
          smeta.summa += item.summa;
        }
      });
    }

    return data.smetas;
  }

  static async getJur4Data(data) {
    for (let smeta of data.smetas) {
      const grafik_summa = data.grafik.sub_childs.find(
        (item) => item.id === smeta.id
      );

      const jur3a_akt_avans_summa = data.jur3a_akt_avans.sub_childs.find(
        (item) => item.id === smeta.id
      );

      smeta.summa = grafik_summa.summa - jur3a_akt_avans_summa.summa;
    }

    return data.smetas;
  }

  static async delete(data) {
    await db.transaction(async (client) => {
      await OdinoxDB.delete([data.id], client);

      await OdinoxDB.deleteChildByParentId([data.id], client);
    });
  }

  static getJur0DataYear(data) {
    for (let smeta of data.smetas) {
      smeta.summa = 0;
      if (smeta.smeta_grafik) {
        for (let i = 1; i <= data.month; i++) {
          smeta.summa += smeta.smeta_grafik[`oy_${i}`];
        }
      }
    }

    return data.smetas;
  }

  static async getOdinoxType() {
    const result = await OdinoxDB.getOdinoxType([]);

    return result;
  }

  static async getById(data) {
    const result = await OdinoxDB.getById(
      [data.region_id, data.id, data.main_schet_id],
      data.isdeleted
    );

    if (result) {
      result.childs = await OdinoxDB.getByIdChild([data.id]);
    }

    return result;
  }

  static async get(data) {
    const result = await OdinoxDB.get(
      [data.region_id, data.main_schet_id, data.offset, data.limit],
      data.year
    );

    return result;
  }

  static async getByMonth(data) {
    let result = await OdinoxDB.getByMonth([
      data.region_id,
      data.year,
      data.month,
      data.main_schet_id,
    ]);

    if (result) {
      result.childs = await OdinoxDB.getByIdChild([result.id]);
    }

    return result;
  }

  static async checkCreateCount(data) {
    const result = await OdinoxDB.checkCreateCount([
      data.region_id,
      data.main_schet_id,
    ]);

    return result;
  }
};
