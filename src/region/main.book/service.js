const { db } = require("@db/index");
const { MainBookDB } = require("./db");
const ExcelJS = require("exceljs");
const fs = require("fs");
const path = require("path");

exports.MainBookService = class {
  static async getUniqueSchets(data) {
    const result = await MainBookDB.getUniqueSchets([]);

    return result;
  }

  static async getMainSchets(data) {
    const result = await MainBookDB.getMainSchets([
      data.region_id,
      data.budjet_id,
    ]);

    return result;
  }

  static async delete(data) {
    await db.transaction(async (client) => {
      await MainBookDB.delete([data.id], client);

      await MainBookDB.deleteChildByParentId([data.id], client);
    });
  }

  static async getMainBookType(data) {
    const result = await MainBookDB.getMainBookType([]);

    return result;
  }

  static async create(data) {
    const result = await db.transaction(async (client) => {
      const doc = await MainBookDB.create(
        [
          1,
          data.accept_time,
          new Date(),
          data.user_id,
          data.year,
          data.month,
          data.budjet_id,
          new Date(),
          new Date(),
        ],
        client
      );

      await this.createChild({ ...data, client, parent_id: doc.id });

      return doc;
    });

    return result;
  }

  static async update(data) {
    const result = await db.transaction(async (client) => {
      const create_childs = [];

      // doc update
      const doc = await MainBookDB.update(
        [1, new Date(), data.year, data.month, new Date(), data.id],
        client
      );

      // old sub_child delete
      for (let child of data.old_data.childs) {
        for (let sub_child of child.sub_childs) {
          const check = data.childs.find((item) => {
            return item.sub_childs.find(
              (element) => element.id === sub_child.id
            );
          });

          if (!check) {
            await MainBookDB.deleteChild([sub_child.id], client);
          }
        }
      }

      // child update
      for (let child of data.childs) {
        for (let sub_child of child.sub_childs) {
          if (sub_child.id) {
            await MainBookDB.updateChild(
              [
                sub_child.schet,
                sub_child.prixod,
                sub_child.rasxod,
                new Date(),
                sub_child.id,
              ],
              client
            );
          } else {
            const index = create_childs.findIndex(
              (item) => item.type_id === child.type_id
            );

            if (index > 0) {
              create_childs[index].sub_childs.push(sub_child);
            } else {
              create_childs.push({
                type_id: child.type_id,
                sub_childs: [sub_child],
              });
            }
          }
        }
      }

      // child create
      if (create_childs.length > 0) {
        await this.createChild({
          ...data,
          childs: create_childs,
          client,
          parent_id: doc.id,
        });
      }

      return doc;
    });

    return result;
  }

  static async createChild(data) {
    for (let child of data.childs) {
      for (let sub_child of child.sub_childs) {
        await MainBookDB.createChild(
          [
            sub_child.schet,
            sub_child.prixod,
            sub_child.rasxod,
            data.user_id,
            data.parent_id,
            child.type_id,
            new Date(),
            new Date(),
          ],
          data.client
        );
      }
    }
  }

  static async get(data) {
    const result = await MainBookDB.get(
      [data.region_id, data.budjet_id, data.offset, data.limit],
      data.year,
      data.month
    );

    return result;
  }

  static async getById(data) {
    const result = await MainBookDB.getById(
      [data.region_id, data.id],
      data.isdeleted
    );

    if (result) {
      result.childs = await MainBookDB.getByIdChild([data.id]);
    }

    return result;
  }

  static async getJur1Data(data) {
    for (let main_schet of data.main_schets) {
      let rasxod = 0;
      let prixod = 0;
      const rasxod_data = await MainBookDB.getJur1Rasxod(
        [data.region_id, main_schet.id],
        { from: data.from, to: data.to },
        data.operator
      );

      const prixod_data = await MainBookDB.getJur1Prixod(
        [data.region_id, main_schet.id],
        { from: data.from, to: data.to },
        data.operator
      );

      // rasxod
      for (let schet of rasxod_data) {
        const index = data.schets.findIndex(
          (item) => item.schet === schet.schet
        );

        data.schets[index].prixod += schet.summa;
        rasxod += schet.summa;
      }

      const index = data.schets.findIndex(
        (item) => item.schet === main_schet.jur1_schet
      );

      data.schets[index].rasxod += rasxod;

      // prixod
      for (let schet of prixod_data) {
        const index = data.schets.findIndex(
          (item) => item.schet === schet.schet
        );

        data.schets[index].rasxod += schet.summa;
        prixod += schet.summa;
      }

      data.schets[index].prixod += prixod;
    }

    return data.schets;
  }

  static async getJur2Data(data) {
    for (let main_schet of data.main_schets) {
      let rasxod = 0;
      let prixod = 0;

      const rasxod_data = await MainBookDB.getJur2Rasxod(
        [data.region_id, main_schet.id],
        { from: data.from, to: data.to },
        data.operator
      );

      const prixod_data = await MainBookDB.getJur2Prixod(
        [data.region_id, main_schet.id],
        { from: data.from, to: data.to },
        data.operator
      );

      // rasxod
      for (let schet of rasxod_data) {
        const index = data.schets.findIndex(
          (item) => item.schet === schet.schet
        );

        data.schets[index].prixod += schet.summa;
        rasxod += schet.summa;
      }

      const index = data.schets.findIndex(
        (item) => item.schet === main_schet.jur2_schet
      );

      data.schets[index].rasxod += rasxod;

      // prixod
      for (let schet of prixod_data) {
        const index = data.schets.findIndex(
          (item) => item.schet === schet.schet
        );

        data.schets[index].rasxod += schet.summa;
        prixod += schet.summa;
      }

      data.schets[index].prixod += prixod;
    }

    return data.schets;
  }

  static async getJur3Data(data) {
    for (let main_schet of data.main_schets) {
      let rasxod = 0;
      let prixod = 0;

      const rasxod_data = await MainBookDB.getJur3Rasxod(
        [data.region_id, main_schet.id, main_schet.jur3_schet],
        { from: data.from, to: data.to },
        data.operator
      );

      const prixod_data = await MainBookDB.getJur3Prixod(
        [data.region_id, main_schet.id, main_schet.jur3_schet],
        { from: data.from, to: data.to },
        data.operator
      );

      // rasxod
      for (let schet of rasxod_data) {
        const index = data.schets.findIndex(
          (item) => item.schet === schet.schet
        );

        data.schets[index].prixod += schet.summa;
        rasxod += schet.summa;
      }

      const index = data.schets.findIndex(
        (item) => item.schet === main_schet.jur3_schet
      );

      data.schets[index].rasxod += rasxod;

      // prixod
      for (let schet of prixod_data) {
        const index = data.schets.findIndex(
          (item) => item.schet === schet.schet
        );

        data.schets[index].rasxod += schet.summa;
        prixod += schet.summa;
      }

      data.schets[index].prixod += prixod;
    }

    return data.schets;
  }

  static async getJur4Data(data) {
    for (let main_schet of data.main_schets) {
      let rasxod = 0;
      let prixod = 0;

      const rasxod_data = await MainBookDB.getJur4Rasxod(
        [data.region_id, main_schet.id, main_schet.jur4_schet],
        { from: data.from, to: data.to },
        data.operator
      );

      const prixod_data = await MainBookDB.getJur4Prixod(
        [data.region_id, main_schet.id, main_schet.jur4_schet],
        { from: data.from, to: data.to },
        data.operator
      );

      const index = data.schets.findIndex(
        (item) => item.schet === main_schet.jur4_schet
      );

      // rasxod
      for (let schet of rasxod_data) {
        const index = data.schets.findIndex(
          (item) => item.schet === schet.schet
        );

        data.schets[index].prixod += schet.summa;
        rasxod += schet.summa;
      }

      data.schets[index].rasxod += rasxod;

      // prixod
      for (let schet of prixod_data) {
        const index = data.schets.findIndex(
          (item) => item.schet === schet.schet
        );

        data.schets[index].rasxod += schet.summa;
        prixod += schet.summa;
      }

      data.schets[index].prixod += prixod;
    }

    return data.schets;
  }

  static async getFromOrToData(data) {
    data.schets = await this.getJur1Data({
      schets: data.schets,
      budjet_id: data.budjet_id,
      from: data.from,
      to: data.to,
      region_id: data.region_id,
      main_schets: data.main_schets,
      operator: "<",
    });

    data.schets = await this.getJur2Data({
      schets: data.schets,
      budjet_id: data.budjet_id,
      from: data.from,
      to: data.to,
      region_id: data.region_id,
      main_schets: data.main_schets,
      operator: "<",
    });

    data.schets = await this.getJur3Data({
      schets: data.schets,
      budjet_id: data.budjet_id,
      from: data.from,
      to: data.to,
      region_id: data.region_id,
      main_schets: data.main_schets,
      operator: "<",
    });

    data.schets = await this.getJur4Data({
      schets: data.schets,
      budjet_id: data.budjet_id,
      from: data.from,
      to: data.to,
      region_id: data.region_id,
      main_schets: data.main_schets,
      operator: "<",
    });

    for (let schet of data.schets) {
      const check = data.jur3AndJur4Schets.find((item) => item === schet.schet);
      if (check) {
        continue;
      }

      const summa = schet.prixod - schet.rasxod;

      if (summa > 0) {
        schet.prixod = summa;
        schet.rasxod = 0;
      } else if (summa < 0) {
        schet.rasxod = Math.abs(summa);
        schet.prixod = 0;
      } else {
        schet.prixod = 0;
        schet.rasxod = 0;
      }
    }

    return data.schets;
  }

  static async getByIdExcel(data) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("main book");

    const title = data.report_title.name
      .split(" ")
      .filter((word) => word.length)
      .map((word) => word[0])
      .join(".");

    worksheet.mergeCells(`A1`, "T1");
    worksheet.getCell(`A1`).value =
      `${data.budjet_name} ${String(data.month).padStart(2, "0")}-${data.year}`;

    worksheet.mergeCells(`A2`, "A3");
    worksheet.getCell(`A3`).value = `№`;

    worksheet.mergeCells(`B2`, "B3");
    worksheet.getCell(`B2`).value = `Счет`;

    worksheet.mergeCells(`C2`, "D2");
    worksheet.getCell(`C2`).value = "Бош.";

    worksheet.mergeCells(`E2`, "F2");
    worksheet.getCell(`E2`).value = `${title}.1`;

    worksheet.mergeCells(`G2`, "H2");
    worksheet.getCell(`G2`).value = `${title}.2`;

    worksheet.mergeCells(`I2`, "J2");
    worksheet.getCell(`I2`).value = `${title}.3`;

    worksheet.mergeCells(`K2`, "L2");
    worksheet.getCell(`K2`).value = `${title}.4`;

    worksheet.mergeCells(`M2`, "N2");
    worksheet.getCell(`M2`).value = `${title}.5`;

    worksheet.mergeCells(`O2`, "P2");
    worksheet.getCell(`O2`).value = `${title}.7`;

    worksheet.mergeCells(`Q2`, "R2");
    worksheet.getCell(`Q2`).value = `Ички`;

    worksheet.mergeCells(`S2`, "T2");
    worksheet.getCell(`S2`).value = `Як.`;

    worksheet.getCell("C3").value = "Дебет";
    worksheet.getCell("D3").value = "Кредит";

    worksheet.getCell("E3").value = "Дебет";
    worksheet.getCell("F3").value = "Кредит";

    worksheet.getCell("G3").value = "Дебет";
    worksheet.getCell("H3").value = "Кредит";

    worksheet.getCell("I3").value = "Дебет";
    worksheet.getCell("J3").value = "Кредит";

    worksheet.getCell("K3").value = "Дебет";
    worksheet.getCell("L3").value = "Кредит";

    worksheet.getCell("M3").value = "Дебет";
    worksheet.getCell("N3").value = "Кредит";

    worksheet.getCell("O3").value = "Дебет";
    worksheet.getCell("P3").value = "Кредит";

    worksheet.getCell("Q3").value = "Дебет";
    worksheet.getCell("R3").value = "Кредит";

    worksheet.getCell("S3").value = "Дебет";
    worksheet.getCell("T3").value = "Кредит";

    worksheet.columns = [
      { key: "order", width: 5 },
      { key: "schet", width: 10 },
      { key: "from_prixod", width: 14 },
      { key: "from_rasxod", width: 14 },
      { key: "jur1_prixod", width: 14 },
      { key: "jur1_rasxod", width: 14 },
      { key: "jur2_prixod", width: 14 },
      { key: "jur2_rasxod", width: 14 },
      { key: "jur3_prixod", width: 14 },
      { key: "jur3_rasxod", width: 14 },
      { key: "jur4_prixod", width: 14 },
      { key: "jur4_rasxod", width: 14 },
      { key: "jur5_prixod", width: 14 },
      { key: "jur5_rasxod", width: 14 },
      { key: "jur7_prixod", width: 14 },
      { key: "jur7_rasxod", width: 14 },
      { key: "internal_prixod", width: 14 },
      { key: "internal_rasxod", width: 14 },
      { key: "to_prixod", width: 14 },
      { key: "to_rasxod", width: 14 },
    ];

    for (let i = 0; i < data.childs.length; i++) {
      const child = data.childs[i];

      for (let i = 0; i < child.sub_childs.length; i++) {
        const sub_child = child.sub_childs[i];

        worksheet.addRow({
          order: i + 1,
          schet: sub_child.account_number || "",
          from_prixod: sub_child.from_prixod || 0,
          from_rasxod: sub_child.from_rasxod || 0,
          jur1_prixod: sub_child.jur1_prixod || 0,
          jur1_rasxod: sub_child.jur1_rasxod || 0,
          jur2_prixod: sub_child.jur2_prixod || 0,
          jur2_rasxod: sub_child.jur2_rasxod || 0,
          jur3_prixod: sub_child.jur3_prixod || 0,
          jur3_rasxod: sub_child.jur3_rasxod || 0,
          jur4_prixod: sub_child.jur4_prixod || 0,
          jur4_rasxod: sub_child.jur4_rasxod || 0,
          jur5_prixod: sub_child.jur5_prixod || 0,
          jur5_rasxod: sub_child.jur5_rasxod || 0,
          jur7_prixod: sub_child.jur7_prixod || 0,
          jur7_rasxod: sub_child.jur7_rasxod || 0,
          internal_prixod: sub_child.internal_prixod || 0,
          internal_rasxod: sub_child.internal_rasxod || 0,
          to_prixod: sub_child.to_prixod || 0,
          to_rasxod: sub_child.to_rasxod || 0,
        });
      }
    }

    worksheet.eachRow((row, rowNumber) => {
      let bold = false;
      let horizontal = "center";

      row.eachCell((cell) => {
        Object.assign(cell, {
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

    const folder_path = path.join(__dirname, `../../../public/exports`);

    try {
      await fs.promises.access(folder_path, fs.promises.constants.W_OK);
    } catch (error) {
      await fs.promises.mkdir(folder_path);
    }

    const file_name = `groups.${new Date().getTime()}.xlsx`;

    const file_path = `${folder_path}/${file_name}`;

    await workbook.xlsx.writeFile(file_path);

    return { file_name, file_path };
  }
};
