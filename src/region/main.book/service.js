const { db } = require("@db/index");
const { MainBookDB } = require("./db");
const { HelperFunctions } = require(`@helper/functions`);
const { shartnomaGarfikValidation } = require("../../delete/utils/validation");

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

    const folder_path = path.join(__dirname, `../../../../public/exports`);

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
};
