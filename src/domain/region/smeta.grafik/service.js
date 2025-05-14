const { SmetaGrafikDB } = require("./db");
const { HelperFunctions } = require("@helper/functions");
const { db } = require(`@db/index`);
const ExcelJS = require(`exceljs`);
const path = require("path");
const fs = require("fs").promises;

exports.SmetaGrafikService = class {
  static now = new Date();

  static async getByOrderNumber(data) {
    const result = await SmetaGrafikDB.getByOrderNumber([
      data.order_number,
      data.year,
      data.main_schet_id,
      data.region_id,
    ]);

    return result;
  }

  static async updateMain(data) {
    for (let smeta of data.smetas) {
      const itogo = HelperFunctions.smetaSum(smeta);

      const check = data.main_parent.smetas.find(
        (item) => item.smeta_id === smeta.smeta_id
      );

      if (check) {
        await SmetaGrafikDB.updateMain(
          [
            itogo,
            smeta.oy_1,
            smeta.oy_2,
            smeta.oy_3,
            smeta.oy_4,
            smeta.oy_5,
            smeta.oy_6,
            smeta.oy_7,
            smeta.oy_8,
            smeta.oy_9,
            smeta.oy_10,
            smeta.oy_11,
            smeta.oy_12,
            this.now,
            smeta.smeta_id,
            data.main_parent.id,
          ],
          data.client
        );
      } else {
        await SmetaGrafikDB.create(
          [
            smeta.smeta_id,
            data.user_id,
            itogo,
            smeta.oy_1,
            smeta.oy_2,
            smeta.oy_3,
            smeta.oy_4,
            smeta.oy_5,
            smeta.oy_6,
            smeta.oy_7,
            smeta.oy_8,
            smeta.oy_9,
            smeta.oy_10,
            smeta.oy_11,
            smeta.oy_12,
            data.main_parent.year,
            data.main_parent.main_schet_id,
            data.main_parent.id,
            data.main_parent.order_number,
            this.now,
            this.now,
          ],
          data.client
        );
      }
    }

    for (let item of data.main_parent.smetas) {
      const check = data.smetas.find(
        (smeta) => smeta.smeta_id === item.smeta_id
      );

      if (!check) {
        await SmetaGrafikDB.deleteMain(
          [item.smeta_id, data.main_parent.id],
          data.client
        );
      }
    }
  }

  static async createChild(data) {
    for (let smeta of data.smetas) {
      const itogo = HelperFunctions.smetaSum(smeta);

      await SmetaGrafikDB.create(
        [
          smeta.smeta_id,
          data.user_id,
          itogo,
          smeta.oy_1,
          smeta.oy_2,
          smeta.oy_3,
          smeta.oy_4,
          smeta.oy_5,
          smeta.oy_6,
          smeta.oy_7,
          smeta.oy_8,
          smeta.oy_9,
          smeta.oy_10,
          smeta.oy_11,
          smeta.oy_12,
          data.year,
          data.main_schet_id,
          data.parent_id,
          data.parent.order_number,
          this.now,
          this.now,
        ],
        data.client
      );
    }
  }

  static async createParent(data) {
    const parent = await SmetaGrafikDB.createParent(
      [
        data.user_id,
        data.year,
        data.main_schet_id,
        data.order_number,
        data.command,
        this.now,
        this.now,
      ],
      data.client
    );

    return parent;
  }

  static async create(data) {
    await db.transaction(async (client) => {
      const order_number = await SmetaGrafikDB.getOrderNumber([
        data.year,
        data.main_schet_id,
      ]);

      const parent = await this.createParent({
        ...data,
        order_number,
        client,
      });

      await this.createChild({ ...data, parent_id: parent.id, parent, client });

      if (order_number === 1) {
        const main_parent = await this.createParent({
          ...data,
          order_number: 0,
          client,
        });

        await this.createChild({
          ...data,
          parent_id: main_parent.id,
          parent: main_parent,
          client,
        });
      } else {
        const main_parent = await this.getByOrderNumber({
          ...data,
          order_number: 0,
        });

        await this.updateMain({ ...data, main_parent, client });
      }
    });
  }

  static async getEnd(data) {
    const result = await SmetaGrafikDB.getEnd([
      data.region_id,
      data.year,
      data.main_schet_id,
    ]);

    return result;
  }

  static async get(data) {
    const result = await SmetaGrafikDB.get(
      [data.region_id, data.main_schet_id, data.offset, data.limit],
      data.year
    );

    const end = await this.getEnd({ ...data });

    if (end) {
      for (let item of result.data) {
        item.updated_at = item.id === end.id ? true : false;
        item.isdeleted = item.id === end.id ? true : false;
      }
    } else {
      for (let item of result.data) {
        item.updated_at = false;
        item.isdeleted = false;
      }
    }

    return result;
  }

  static async getById(data, isdeleted) {
    const result = await SmetaGrafikDB.getById(
      [data.region_id, data.id, data.main_schet_id],
      isdeleted
    );

    const end = await this.getEnd({ ...data });
    if (end && result) {
      result.updated_at = result.id === end.id ? true : false;
      result.isdeleted = result.id === end.id ? true : false;
    }

    return result;
  }

  static async getByIdExcel(data) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("responsibles");

    worksheet.mergeCells("A1", "O1");

    worksheet.getCell(`A1`).value =
      `${data.year} года ${data.command} буйруқ Хисоб рақам: ${data.account_number}`;

    worksheet.getRow(2).values = [
      `№`,
      "Смета рақами",
      "Январ",
      "Феврал",
      "Март",
      "Апрел",
      "Май",
      "Июн",
      "Июл",
      "Август",
      "Сентябр",
      "Октябр",
      "Ноябр",
      "Декабр",
      "Жами",
    ];

    worksheet.columns = [
      { key: "order", width: 7 },
      { key: "smeta_number", width: 20 },
      { key: "oy_1", width: 18 },
      { key: "oy_2", width: 18 },
      { key: "oy_3", width: 18 },
      { key: "oy_4", width: 18 },
      { key: "oy_5", width: 18 },
      { key: "oy_6", width: 18 },
      { key: "oy_7", width: 18 },
      { key: "oy_8", width: 18 },
      { key: "oy_9", width: 18 },
      { key: "oy_10", width: 18 },
      { key: "oy_11", width: 18 },
      { key: "oy_12", width: 18 },
      { key: "itogo", width: 18 },
    ];

    let itogo = {
      oy_1: 0,
      oy_2: 0,
      oy_3: 0,
      oy_4: 0,
      oy_5: 0,
      oy_6: 0,
      oy_7: 0,
      oy_8: 0,
      oy_9: 0,
      oy_10: 0,
      oy_11: 0,
      oy_12: 0,
      itogo: 0,
    };

    data.smetas.forEach((item, index) => {
      worksheet.addRow({
        order: index + 1,
        smeta_number: item.smeta_number,
        oy_1: item.oy_1,
        oy_2: item.oy_2,
        oy_3: item.oy_3,
        oy_4: item.oy_4,
        oy_5: item.oy_5,
        oy_6: item.oy_6,
        oy_7: item.oy_7,
        oy_8: item.oy_8,
        oy_9: item.oy_9,
        oy_10: item.oy_10,
        oy_11: item.oy_11,
        oy_12: item.oy_12,
        itogo: item.itogo,
      });

      itogo.oy_1 += item.oy_1;
      itogo.oy_2 += item.oy_2;
      itogo.oy_3 += item.oy_3;
      itogo.oy_4 += item.oy_4;
      itogo.oy_5 += item.oy_5;
      itogo.oy_6 += item.oy_6;
      itogo.oy_7 += item.oy_7;
      itogo.oy_8 += item.oy_8;
      itogo.oy_9 += item.oy_9;
      itogo.oy_10 += item.oy_10;
      itogo.oy_11 += item.oy_11;
      itogo.oy_12 += item.oy_12;
      itogo.itogo += item.itogo;
    });

    worksheet.addRow({
      smeta_number: `Жами: `,
      oy_1: itogo.oy_1,
      oy_2: itogo.oy_2,
      oy_3: itogo.oy_3,
      oy_4: itogo.oy_4,
      oy_5: itogo.oy_5,
      oy_6: itogo.oy_6,
      oy_7: itogo.oy_7,
      oy_8: itogo.oy_8,
      oy_9: itogo.oy_9,
      oy_10: itogo.oy_10,
      oy_11: itogo.oy_11,
      oy_12: itogo.oy_12,
      itogo: itogo.itogo,
    });

    worksheet.eachRow((row, rowNumber) => {
      let bold = false;
      if (rowNumber < 3 || worksheet.rowCount === rowNumber) {
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

    const folder_path = path.join(__dirname, `../../../../public/exports`);

    try {
      await fs.access(folder_path, fs.constants.W_OK);
    } catch (error) {
      await fs.mkdir(folder_path);
    }

    const fileName = `smeta.${new Date().getTime()}.xlsx`;

    const filePath = `${folder_path}/${fileName}`;

    await workbook.xlsx.writeFile(filePath);

    return { fileName, filePath };
  }

  static async update(data) {
    const result = await db.transaction(async (client) => {
      await SmetaGrafikDB.updateParent([data.command, data.id], client);
      for (let smeta of data.smetas) {
        const itogo = HelperFunctions.smetaSum(smeta);

        if (smeta.id) {
          await SmetaGrafikDB.update(
            [
              itogo,
              smeta.oy_1,
              smeta.oy_2,
              smeta.oy_3,
              smeta.oy_4,
              smeta.oy_5,
              smeta.oy_6,
              smeta.oy_7,
              smeta.oy_8,
              smeta.oy_9,
              smeta.oy_10,
              smeta.oy_11,
              smeta.oy_12,
              smeta.smeta_id,
              this.now,
              smeta.id,
            ],
            client
          );
        } else {
          await SmetaGrafikDB.create(
            [
              smeta.smeta_id,
              data.user_id,
              itogo,
              smeta.oy_1,
              smeta.oy_2,
              smeta.oy_3,
              smeta.oy_4,
              smeta.oy_5,
              smeta.oy_6,
              smeta.oy_7,
              smeta.oy_8,
              smeta.oy_9,
              smeta.oy_10,
              smeta.oy_11,
              smeta.oy_12,
              data.old_data.year,
              data.old_data.main_schet_id,
              data.id,
              data.old_data.order_number,
              this.now,
              this.now,
            ],
            client
          );
        }
      }

      for (let smeta of data.old_data.smetas) {
        console.log(smeta.id);
        const check = data.smetas.find((item) => smeta.id === item.id);
        if (!check) {
          await SmetaGrafikDB.deleteChild([smeta.id], client);
        }
      }

      const main_parent = await this.getByOrderNumber({
        ...data,
        year: data.old_data.year,
        order_number: 0,
      });

      await this.updateMain({ ...data, main_parent, client });
    });

    return result;
  }

  static async delete(data) {
    const main_parent = await this.getByOrderNumber({
      ...data,
      year: data.old_data.year,
      order_number: 0,
    });

    await db.transaction(async (client) => {
      await SmetaGrafikDB.delete([data.id], client);
      if (data.old_data.order_number === 1) {
        await SmetaGrafikDB.delete([main_parent.id], client);
      } else {
        const doc = await this.getByOrderNumber({
          ...data,
          year: data.old_data.year,
          order_number: data.old_data.order_number - 1,
        });

        await this.updateMain({
          ...data,
          smetas: doc.smetas,
          main_parent,
          client,
        });
      }
    });
  }
};
