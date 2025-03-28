const { db } = require("@db/index");
const { MainBookDB } = require("./db");
const ExcelJS = require("exceljs");
const fs = require("fs");
const path = require("path");
const { HelperFunctions } = require(`@helper/functions`);

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

      const rasxod_data = await MainBookDB.getJur1Rasxod(
        [data.region_id, main_schet.id],
        { from: data.from, to: data.to },
        data.operator
      );

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
    }

    return data.schets;
  }

  static async getJur2Data(data) {
    for (let main_schet of data.main_schets) {
      let rasxod = 0;

      const rasxod_data = await MainBookDB.getJur2Rasxod(
        [data.region_id, main_schet.id],
        { from: data.from, to: data.to },
        data.operator
      );

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
    }

    return data.schets;
  }

  static async getJur3Data(data) {
    for (let main_schet of data.main_schets) {
      let rasxod = 0;

      const rasxod_data = await MainBookDB.getJur3Rasxod(
        [data.region_id, main_schet.id],
        { from: data.from, to: data.to },
        data.operator
      );

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
    }

    return data.schets;
  }

  static async getJur4Data(data) {
    for (let main_schet of data.main_schets) {
      let rasxod = 0;

      const rasxod_data = await MainBookDB.getJur4Rasxod(
        [data.region_id, main_schet.id],
        { from: data.from, to: data.to },
        data.operator
      );

      const index = data.schets.findIndex(
        (item) => item.schet === main_schet.jur4_schet
      );

      for (let schet of rasxod_data) {
        const index = data.schets.findIndex(
          (item) => item.schet === schet.schet
        );

        data.schets[index].prixod += schet.summa;

        rasxod += schet.summa;
      }

      data.schets[index].rasxod += rasxod;
    }

    return data.schets;
  }

  static async getFromData(data) {
    // jur1
    for (let main_schet of data.main_schets) {
      let rasxod = 0;

      const rasxod_data = await MainBookDB.getJur1Rasxod(
        [data.region_id, main_schet.id],
        { from: data.from, to: data.to },
        data.operator
      );

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
    }

    // jur2
    for (let main_schet of data.main_schets) {
      let rasxod = 0;

      const rasxod_data = await MainBookDB.getJur2Rasxod(
        [data.region_id, main_schet.id],
        { from: data.from, to: data.to },
        data.operator
      );

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
    }

    // jur3
    for (let main_schet of data.main_schets) {
      let rasxod = 0;

      const rasxod_data = await MainBookDB.getJur3Rasxod(
        [data.region_id, main_schet.id],
        { from: data.from, to: data.to },
        data.operator
      );

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
    }

    // jur4
    for (let main_schet of data.main_schets) {
      let rasxod = 0;

      const rasxod_data = await MainBookDB.getJur4Rasxod(
        [data.region_id, main_schet.id],
        { from: data.from, to: data.to },
        data.operator
      );

      const index = data.schets.findIndex(
        (item) => item.schet === main_schet.jur4_schet
      );

      for (let schet of rasxod_data) {
        const index = data.schets.findIndex(
          (item) => item.schet === schet.schet
        );

        data.schets[index].prixod += schet.summa;

        rasxod += schet.summa;
      }

      data.schets[index].rasxod += rasxod;
    }

    for (let schet of data.schets) {
      // const check = data.jur3AndJur4Schets.find((item) => item === schet.schet);
      // if (check) {
      //   continue;
      // }

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

  static async getToData(data) {
    // jur1
    for (let main_schet of data.main_schets) {
      let rasxod = 0;

      const rasxod_data = await MainBookDB.getJur1Rasxod(
        [data.region_id, main_schet.id],
        { from: data.from, to: data.to },
        data.operator
      );

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
    }

    // jur2
    for (let main_schet of data.main_schets) {
      let rasxod = 0;

      const rasxod_data = await MainBookDB.getJur2Rasxod(
        [data.region_id, main_schet.id],
        { from: data.from, to: data.to },
        data.operator
      );

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
    }

    // jur3
    for (let main_schet of data.main_schets) {
      let rasxod = 0;

      const rasxod_data = await MainBookDB.getJur3Rasxod(
        [data.region_id, main_schet.id],
        { from: data.from, to: data.to },
        data.operator
      );

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
    }

    // jur4
    for (let main_schet of data.main_schets) {
      let rasxod = 0;

      const rasxod_data = await MainBookDB.getJur4Rasxod(
        [data.region_id, main_schet.id],
        { from: data.from, to: data.to },
        data.operator
      );

      const index = data.schets.findIndex(
        (item) => item.schet === main_schet.jur4_schet
      );

      for (let schet of rasxod_data) {
        const index = data.schets.findIndex(
          (item) => item.schet === schet.schet
        );

        data.schets[index].prixod += schet.summa;

        rasxod += schet.summa;
      }

      data.schets[index].rasxod += rasxod;
    }

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
      `${data.budjet_name} ${HelperFunctions.returnStringYearMonth({ year: data.year, month: data.month })}`;

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

    let column = 4;
    for (let i = 0; i < data.childs.length; i++) {
      const child = data.childs[i];

      if (child.type_id === 0) {
        child.sub_childs.forEach((item, index) => {
          worksheet.getCell(`A${column}`).value = `${index + 1}`;
          worksheet.getCell(`B${column}`).value = item.schet;
          worksheet.getCell(`C${column}`).value = item.prixod;
          worksheet.getCell(`D${column}`).value = item.rasxod;
          column++;
        });

        worksheet.getCell(`C${column}`).value = child.prixod;
        worksheet.getCell(`D${column}`).value = child.rasxod;
      } else if (child.type_id === 1) {
        column = 4;
        child.sub_childs.forEach((item) => {
          worksheet.getCell(`E${column}`).value = item.prixod;
          worksheet.getCell(`F${column}`).value = item.rasxod;
          column++;
        });
        worksheet.getCell(`E${column}`).value = child.prixod;
        worksheet.getCell(`F${column}`).value = child.rasxod;
      } else if (child.type_id === 2) {
        column = 4;
        child.sub_childs.forEach((item) => {
          worksheet.getCell(`G${column}`).value = item.prixod;
          worksheet.getCell(`H${column}`).value = item.rasxod;
          column++;
        });
        worksheet.getCell(`G${column}`).value = child.prixod;
        worksheet.getCell(`H${column}`).value = child.rasxod;
      } else if (child.type_id === 3) {
        column = 4;
        child.sub_childs.forEach((item) => {
          worksheet.getCell(`I${column}`).value = item.prixod;
          worksheet.getCell(`J${column}`).value = item.rasxod;
          column++;
        });
        worksheet.getCell(`I${column}`).value = child.prixod;
        worksheet.getCell(`J${column}`).value = child.rasxod;
      } else if (child.type_id === 4) {
        column = 4;
        child.sub_childs.forEach((item) => {
          worksheet.getCell(`K${column}`).value = item.prixod;
          worksheet.getCell(`L${column}`).value = item.rasxod;
          column++;
        });
        worksheet.getCell(`K${column}`).value = child.prixod;
        worksheet.getCell(`L${column}`).value = child.rasxod;
      } else if (child.type_id === 5) {
        column = 4;
        child.sub_childs.forEach((item) => {
          worksheet.getCell(`M${column}`).value = item.prixod;
          worksheet.getCell(`N${column}`).value = item.rasxod;
          column++;
        });
        worksheet.getCell(`M${column}`).value = child.prixod;
        worksheet.getCell(`N${column}`).value = child.rasxod;
      } else if (child.type_id === 7) {
        column = 4;
        child.sub_childs.forEach((item) => {
          worksheet.getCell(`O${column}`).value = item.prixod;
          worksheet.getCell(`P${column}`).value = item.rasxod;
          column++;
        });
        worksheet.getCell(`O${column}`).value = child.prixod;
        worksheet.getCell(`P${column}`).value = child.rasxod;
      } else if (child.type_id === 9) {
        column = 4;
        child.sub_childs.forEach((item) => {
          worksheet.getCell(`Q${column}`).value = item.prixod;
          worksheet.getCell(`R${column}`).value = item.rasxod;
          column++;
        });
        worksheet.getCell(`Q${column}`).value = child.prixod;
        worksheet.getCell(`R${column}`).value = child.rasxod;
      } else if (child.type_id === 10) {
        column = 4;
        child.sub_childs.forEach((item) => {
          worksheet.getCell(`S${column}`).value = item.prixod;
          worksheet.getCell(`T${column}`).value = item.rasxod;
          column++;
        });
        worksheet.getCell(`S${column}`).value = child.prixod;
        worksheet.getCell(`T${column}`).value = child.rasxod;
      }
    }

    const end_column = column;
    worksheet.mergeCells(`A${column}`, `B${column}`);
    worksheet.getCell(`A${column}`).value = `Итого`;

    worksheet.eachRow((row, rowNumber) => {
      let bold = false;
      let horizontal = "center";
      let size = 13;

      if (rowNumber > 3) {
        size = 8;
      }

      if (end_column === rowNumber || rowNumber < 3) {
        bold = true;
      }

      row.eachCell((cell, column) => {
        if (column > 2 && rowNumber > 3) {
          cell.numFmt = "# ##0 ##0.00";

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

    const folder_path = path.join(__dirname, `../../../public/exports`);

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
};
