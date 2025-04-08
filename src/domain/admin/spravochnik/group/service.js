const { GroupDB } = require("./db");
const { HelperFunctions } = require("@helper/functions");
const xlsx = require("xlsx");
const path = require("path");
const fs = require("fs").promises;
const { db } = require("@db/index");
const ExcelJS = require("exceljs");

exports.GroupService = class {
  static async export(data) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("responsibles");

    worksheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Nomi", key: "name", width: 40 },
      { header: "Schet", key: "schet", width: 30 },
      { header: "Iznos foiz", key: "iznos_foiz", width: 30 },
      { header: "Debet", key: "provodka_debet", width: 30 },
      { header: "Kredit", key: "provodka_kredit", width: 30 },
      { header: "Subschet", key: "provodka_subschet", width: 30 },
      { header: "Gruh raqami", key: "group_number", width: 30 },
      { header: "Rim raqami", key: "roman_numeral", width: 30 },
      { header: "Asosiy guruh", key: "pod_group", width: 30 },
    ];

    data.forEach((item) => {
      worksheet.addRow({
        id: item.id,
        name: item.name,
        schet: item.schet,
        iznos_foiz: item.iznos_foiz,
        provodka_debet: item.provodka_debet,
        provodka_kredit: item.provodka_kredit,
        provodka_subschet: item.provodka_subschet,
        group_number: item.group_number,
        roman_numeral: item.roman_numeral,
        pod_group: item.pod_group,
      });
    });

    worksheet.eachRow((row, rowNumber) => {
      let bold = false;
      if (rowNumber === 1) {
        worksheet.getRow(rowNumber).height = 30;
        bold = true;
      }

      row.eachCell((cell) => {
        Object.assign(cell, {
          font: { size: 13, name: "Times New Roman", bold },
          alignment: {
            vertical: "middle",
            horizontal: "center",
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
      await fs.access(folder_path, fs.constants.W_OK);
    } catch (error) {
      await fs.mkdir(folder_path);
    }

    const fileName = `groups.${new Date().getTime()}.xlsx`;

    const filePath = `${folder_path}/${fileName}`;

    await workbook.xlsx.writeFile(filePath);

    return { fileName, filePath };
  }

  static async import(data) {
    await db.transaction(async (client) => {
      for (let item of data.groups) {
        await this.create({ ...item, client });
      }
    });
  }

  static async getById(data) {
    const result = await GroupDB.getById([data.id]);
    return result;
  }

  static async getByName(data) {
    const result = await GroupDB.getByName([data.name]);

    return result;
  }

  static async getByNumberName(data) {
    const result = await GroupDB.getByNumberName([data.number, data.name]);

    return result;
  }

  static async get(data) {
    const result = await GroupDB.get(
      [data.offset, data.limit],
      data.search,
      data.id
    );

    return { data: result.data || [], total: result.total };
  }

  static async create(data) {
    const result = await GroupDB.create(
      [
        data.smeta_id,
        data.name,
        data.schet,
        data.iznos_foiz,
        data.provodka_debet
          ? String(data.provodka_debet).replace(/\s/g, "")
          : null,
        data.group_number,
        data.provodka_kredit
          ? String(data.provodka_kredit).replace(/\s/g, "")
          : null,
        data.provodka_subschet
          ? String(data.provodka_subschet).replace(/\s/g, "")
          : null,
        data.roman_numeral,
        data.pod_group,
        HelperFunctions.tashkentTime(),
        HelperFunctions.tashkentTime(),
      ],
      data.client
    );

    return result;
  }

  static async update(data) {
    const result = await GroupDB.update([
      data.smeta_id,
      data.name,
      data.schet,
      data.iznos_foiz,
      data.provodka_debet,
      data.group_number,
      data.provodka_kredit,
      data.provodka_subschet,
      data.roman_numeral,
      data.pod_group,
      HelperFunctions.tashkentTime(),
      data.id,
    ]);

    return result;
  }

  static async delete(data) {
    const result = await GroupDB.delete([data.id]);

    return result;
  }

  static async getWithPercent() {
    const result = await GroupDB.getWithPercent();

    return result;
  }

  static async readFile(data) {
    const workbook = xlsx.readFile(data.filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const excel_data = xlsx.utils.sheet_to_json(sheet).map((row) => {
      const newRow = {};

      for (const key in row) {
        if (Object.prototype.hasOwnProperty.call(row, key)) {
          newRow[key] = row[key];
        }
      }

      return newRow;
    });

    const result = excel_data.filter((item, index) => index > 2);

    return result;
  }

  static async templateFile() {
    const fileName = `group.xlsx`;
    const folder_path = path.join(__dirname, `../../../../../public/template`);

    const filePath = path.join(folder_path, fileName);

    const fileRes = await fs.readFile(filePath);

    return { fileName, fileRes };
  }
};
