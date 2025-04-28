const { RealCostDB } = require("./db");
const { db } = require("@db/index");
const ExcelJS = require("exceljs");
const fs = require("fs");
const path = require("path");
const { HelperFunctions, sum } = require(`@helper/functions`);

exports.RealCostService = class {
  static now = new Date();

  static async getRasxodDocs(data) {
    const result = await RealCostDB.getRasxodDocs([
      data.main_schet_id,
      data.year,
      data.months,
      data.contract_grafik_id,
      data.organ_id,
      data.contract_id,
    ]);

    return result;
  }

  static async getSmeta(data) {
    const smetas = await RealCostDB.getSmeta([
      data.region_id,
      data.main_schet_id,
      data.year,
    ]);

    return { smetas };
  }

  static getMonthYearSumma(data) {
    for (let smeta of data.smetas) {
      if (smeta.smeta_grafik) {
        smeta.month_summa = smeta.smeta_grafik[`oy_${data.month}`];

        for (let i = 1; i <= data.month; i++) {
          smeta.year_summa = smeta.smeta_grafik[`oy_${i}`];
        }
      } else {
        smeta.month_summa = 0;
        smeta.year_summa = 0;
      }
    }

    return data.smetas;
  }

  static async byMonth(data) {
    for (let smeta of data.smetas) {
      smeta.by_month = await RealCostDB.byMonth(
        [data.region_id, data.main_schet_id, data.year, smeta.id],
        data.month
      );

      for (let contract of smeta.by_month) {
        contract.contract_grafik_summa = Number(contract[`oy_${data.month}`]);

        contract.remaining_summa =
          contract.contract_grafik_summa - contract.rasxod_summa;
      }
    }

    return data.smetas;
  }

  static async byYear(data) {
    for (let smeta of data.smetas) {
      smeta.by_year = await RealCostDB.byMonth(
        [data.region_id, data.main_schet_id, data.year, smeta.id],
        null,
        data.month
      );

      for (let contract of smeta.by_year) {
        contract.contract_grafik_summa = 0;
        for (let i = 1; i <= data.month; i++) {
          contract.contract_grafik_summa += Number(contract[`oy_${i}`]);
        }

        contract.remaining_summa =
          contract.contract_grafik_summa - contract.rasxod_summa;
      }
    }

    return data.smetas;
  }

  static async create(data) {
    const result = await db.transaction(async (client) => {
      const doc = await RealCostDB.create(
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

  static async createChild(data) {
    for (let child of data.childs) {
      const doc = await RealCostDB.createChild(
        [
          child.smeta_id,
          child.month_summa,
          child.year_summa,
          data.parent_id,
          this.now,
          this.now,
        ],
        data.client
      );

      for (let sub_child of child.by_month) {
        await RealCostDB.createSubChild(
          [
            sub_child.contract_grafik_id,
            sub_child.contract_grafik_summa,
            sub_child.rasxod_summa,
            sub_child.remaining_summa,
            false,
            doc.id,
            this.now,
            this.now,
          ],
          data.client
        );
      }

      for (let sub_child of child.by_year) {
        await RealCostDB.createSubChild(
          [
            sub_child.contract_grafik_id,
            sub_child.contract_grafik_summa,
            sub_child.rasxod_summa,
            sub_child.remaining_summa,
            true,
            doc.id,
            this.now,
            this.now,
          ],
          data.client
        );
      }
    }
  }

  static async getByMonth(data) {
    let result = await RealCostDB.getByMonth([
      data.region_id,
      data.year,
      data.month,
      data.main_schet_id,
    ]);

    return result;
  }

  static async checkCreateCount(data) {
    const result = await RealCostDB.checkCreateCount([
      data.region_id,
      data.main_schet_id,
    ]);

    return result;
  }

  static async getEnd(data) {
    const result = await RealCostDB.getEnd([
      data.region_id,
      data.main_schet_id,
    ]);

    return result;
  }

  static async get(data) {
    const result = await RealCostDB.get(
      [data.region_id, data.main_schet_id, data.offset, data.limit],
      data.year
    );

    return result;
  }

  static async getById(data) {
    const result = await RealCostDB.getById(
      [data.region_id, data.id, data.main_schet_id],
      data.isdeleted
    );

    if (result) {
      result.childs = await RealCostDB.getByIdChild([data.id]);
      for (let child of result.childs) {
        const smeta_data = await RealCostDB.getByMonthChild([child.id]);
        child.by_month = smeta_data.by_month;
        child.by_year = smeta_data.by_year;
      }
    }

    return result;
  }

  static async getByIdExcel(data) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("main book");

    worksheet.mergeCells(`A1`, "O1");
    worksheet.getCell(`A1`).value =
      `${HelperFunctions.returnStringYearMonth({ year: data.year, month: data.month })}`;

    worksheet.mergeCells(`A2`, "A3");
    worksheet.getCell(`A3`).value = `№`;

    worksheet.mergeCells(`B2`, "B3");
    worksheet.getCell(`B2`).value = `Nomi`;

    worksheet.mergeCells(`C2`, "C3");
    worksheet.getCell(`C2`).value = `Smeta №`;

    worksheet.mergeCells(`D2`, "I2");
    worksheet.getCell(`D2`).value = "Ой учун";

    worksheet.mergeCells(`J2`, "O2");
    worksheet.getCell(`J2`).value = "Йил учун";

    worksheet.getCell("D3").value = "Ажратилган маблағлар";
    worksheet.getCell("E3").value = "Договор дата";
    worksheet.getCell("F3").value = "Корхона номи";
    worksheet.getCell("G3").value = "Шартнома график суммаси";
    worksheet.getCell("H3").value = "Касса расход / Банк расход";
    worksheet.getCell("I3").value = "Қолдиқ";

    worksheet.getCell("J3").value = "Ажратилган маблағлар";
    worksheet.getCell("K3").value = "Договор дата";
    worksheet.getCell("L3").value = "Корхона номи";
    worksheet.getCell("M3").value = "Шартнома график суммаси";
    worksheet.getCell("N3").value = "Касса расход / Банк расход";
    worksheet.getCell("O3").value = "Қолдиқ";

    worksheet.columns = [
      { key: "order", width: 5 },
      { key: "smeta_name", width: 40 },
      { key: "smeta_number", width: 17 },
      { key: "month_summa", width: 17 },
      { key: "doc_data", width: 17 },
      { key: "organization", width: 17 },
      { key: "contract_grafik_summa", width: 17 },
      { key: "rasxod_summa", width: 17 },
      { key: "remaining_summa", width: 17 },
      { key: "year_summa", width: 17 },
      { key: "doc_data_year", width: 17 },
      { key: "organization_year", width: 17 },
      { key: "contract_grafik_summa_year", width: 17 },
      { key: "rasxod_summa_year", width: 17 },
      { key: "remaining_summa_year", width: 17 },
    ];

    let column = 4;

    const fillCells = (worksheet, startRow, dataList, columns) => {
      let row = startRow;
      if (dataList.length) {
        for (let item of dataList) {
          worksheet.getCell(`${columns[0]}${row}`).value =
            `${item.doc_num}   ${item.doc_date}`;
          worksheet.getCell(`${columns[1]}${row}`).value =
            `Номи: ${item.name}. Инн: ${item.inn}`;
          worksheet.getCell(`${columns[2]}${row}`).value =
            item.contract_grafik_summa;
          worksheet.getCell(`${columns[3]}${row}`).value = item.rasxod_summa;
          worksheet.getCell(`${columns[4]}${row}`).value = item.remaining_summa;
          row++;
        }
      } else {
        worksheet.getCell(`${columns[0]}${row}`).value = "";
        worksheet.getCell(`${columns[1]}${row}`).value = "";
        worksheet.getCell(`${columns[2]}${row}`).value = 0;
        worksheet.getCell(`${columns[3]}${row}`).value = 0;
        worksheet.getCell(`${columns[4]}${row}`).value = 0;
      }
    };

    data.childs.forEach((smeta, index) => {
      worksheet.getCell(`A${column}`).value = index + 1;
      worksheet.getCell(`B${column}`).value = smeta.smeta_name;
      worksheet.getCell(`C${column}`).value = smeta.smeta_number;
      worksheet.getCell(`D${column}`).value = smeta.month_summa;
      worksheet.getCell(`J${column}`).value = smeta.year_summa;

      fillCells(worksheet, column, smeta.by_month, ["E", "F", "G", "H", "I"]);
      fillCells(worksheet, column, smeta.by_year, ["K", "L", "M", "N", "O"]);

      column++;
    });

    worksheet.mergeCells(`A${column}`, `C${column}`);
    worksheet.getCell(`A${column}`).value = `Итого`;
    worksheet.getCell(`D${column}`).value = data.meta.month_summa;
    worksheet.getCell(`J${column}`).value = data.meta.year_summa;

    worksheet.getCell(`G${column}`).value =
      data.meta.by_month.contract_grafik_summa;
    worksheet.getCell(`H${column}`).value = data.meta.by_month.rasxod_summa;
    worksheet.getCell(`I${column}`).value = data.meta.by_month.remaining_summa;

    worksheet.getCell(`M${column}`).value =
      data.meta.by_year.contract_grafik_summa;
    worksheet.getCell(`N${column}`).value = data.meta.by_year.rasxod_summa;
    worksheet.getCell(`O${column}`).value = data.meta.by_year.remaining_summa;

    worksheet.eachRow((row, rowNumber) => {
      let bold = false;
      let horizontal = "center";
      let size = 13;

      if (rowNumber > 3) {
        size = 8;
      }

      if (column === rowNumber || rowNumber < 4) {
        bold = true;
      }

      row.eachCell((cell, columnNumber) => {
        if (columnNumber > 2 && rowNumber > 3) {
          cell.numFmt = "# ##0.00";

          horizontal = "right";
        }

        if (columnNumber === 2 && rowNumber > 3) {
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

    const file_name = `real_cost.${new Date().getTime()}.xlsx`;

    const file_path = `${folder_path}/${file_name}`;

    await workbook.xlsx.writeFile(file_path);

    return { file_name, file_path };
  }

  static async update(data) {
    const result = await db.transaction(async (client) => {
      const doc = await RealCostDB.update(
        [this.now, 1, data.year, data.month, this.now, data.id],
        client
      );

      const ids = data.old_data.childs.map((item) => item.id);

      await RealCostDB.deleteChildByParentId([ids], client);

      await this.createChild({ ...data, client, parent_id: doc.id });

      return doc;
    });

    return result;
  }

  static async delete(data) {
    await db.transaction(async (client) => {
      await RealCostDB.delete([data.id], client);

      const ids = data.old_data.childs.map((item) => item.id);

      await RealCostDB.deleteChildByParentId([ids], client);
    });
  }
};
