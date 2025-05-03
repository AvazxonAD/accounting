const { OperatsiiDB } = require("./db");
const ExcelJS = require("exceljs");
const fs = require("fs").promises;
const path = require("path");

exports.OperatsiiService = class {
  static async getById(data) {
    const result = await OperatsiiDB.getById(
      [data.id],
      data.type,
      data.budjet_id,
      data.isdeleted
    );
    return result;
  }

  static async getUniqueSchets(data) {
    const result = await OperatsiiDB.getUniqueSchets(
      [],
      data.type_schet,
      data.budjet_id
    );

    return result;
  }

  static async get(data) {
    const result = await OperatsiiDB.get(
      [data.offset, data.limit],
      data.search,
      data.type_schet
    );

    return result;
  }

  static async export(data) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("responsibles");

    worksheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Nomi", key: "name", width: 40 },
      { header: "Schet", key: "schet", width: 30 },
      { header: "Sub Schet", key: "sub_schet", width: 30 },
      { header: "Turi", key: "type", width: 30 },
    ];

    data.forEach((item) => {
      worksheet.addRow({
        id: item.id,
        name: item.name,
        schet: item.schet,
        sub_schet: item.sub_schet,
        type: item.type_schet,
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

    const fileName = `operatsii.${new Date().getTime()}.xlsx`;

    const filePath = `${folder_path}/${fileName}`;

    await workbook.xlsx.writeFile(filePath);

    return { fileName, filePath };
  }
};
