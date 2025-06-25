const { db } = require("@db/index");
const { MainBookDB } = require("./db");
const ExcelJS = require("exceljs");
const fs = require("fs");
const path = require("path");
const { HelperFunctions, sum } = require(`@helper/functions`);

exports.MainBookService = class {
  static now = new Date();

  static filterSchets(data) {
    const type0 = data.types.find((t) => t.sort_order === 0);
    const type9 = data.types.find((t) => t.sort_order === 9);

    if (!type0 || !type9) return data.types;

    const emptySchetsIn0 = type0.sub_childs.filter((item) => item.prixod === 0 && item.rasxod === 0).map((item) => item.schet);

    const schetsToRemove = emptySchetsIn0.filter((schet) =>
      type9.sub_childs.some((item) => item.schet === schet && item.prixod === 0 && item.rasxod === 0)
    );

    data.types.forEach((type) => {
      type.sub_childs = type.sub_childs.filter((item) => !schetsToRemove.includes(item.schet));
    });

    return data.types;
  }

  static async getCheck(data) {
    const result = await MainBookDB.getCheck([data.region_id, data.main_schet_id]);

    return result;
  }

  static async getJur1PrixodDocs(data) {
    const result = await MainBookDB.getJur1PrixodDocs([data.year, data.month, data.main_schet_id, data.schet, data.region_id]);

    return result;
  }

  static async getJur1RasxodDocs(data) {
    const result = await MainBookDB.getJur1RasxodDocs([data.year, data.month, data.main_schet_id, data.schet, data.region_id]);

    return result;
  }

  static async getJur2PrixodDocs(data) {
    const result = await MainBookDB.getJur2PrixodDocs([data.year, data.month, data.main_schet_id, data.schet, data.region_id]);

    return result;
  }

  static async getJur2RasxodDocs(data) {
    const result = await MainBookDB.getJur2RasxodDocs([data.year, data.month, data.main_schet_id, data.schet, data.region_id]);

    return result;
  }

  static async getJur3PrixodDocs(data) {
    const jur3_schets = data.jur3AndJur4Schets.filter((item) => item.type === "152" || item.type === "159").map((item) => item.schet);

    const result = await MainBookDB.getJur3PrixodDocs([data.year, data.month, data.main_schet_id, data.schet, data.region_id, jur3_schets]);

    return result;
  }

  static async getJur3RasxodDocs(data) {
    const result = await MainBookDB.getJur3RasxodDocs([data.year, data.month, data.main_schet_id, data.schet, data.region_id]);

    return result;
  }

  static async getJur4PrixodDocs(data) {
    const jur3_schets = data.jur3AndJur4Schets.filter((item) => item.type === "jur4").map((item) => item.schet);

    const result = await MainBookDB.getJur4PrixodDocs([data.year, data.month, data.main_schet_id, data.schet, data.region_id, jur3_schets]);

    return result;
  }

  static async getJur4RasxodDocs(data) {
    const result = await MainBookDB.getJur4RasxodDocs([data.year, data.month, data.main_schet_id, data.schet, data.region_id]);

    return result;
  }

  static async getJur7PrixodDocs(data) {
    const result = await MainBookDB.getJur7PrixodDocs([data.year, data.month, data.main_schet_id, data.schet, data.region_id]);

    return result;
  }

  static async getJur7RasxodDocs(data) {
    const result = await MainBookDB.getJur7RasxodDocs([data.year, data.month, data.main_schet_id, data.schet, data.region_id]);

    return result;
  }

  static async getJur8PrixodDocs(data) {
    const result = await MainBookDB.getJur8PrixodDocs([data.year, data.month, data.main_schet_id, data.schet, data.region_id]);

    const response = await MainBookDB.get8Docs(result);

    return response;
  }

  static async getJur8RasxodDocs(data) {
    const result = await MainBookDB.getJur8RasxodDocs([data.year, data.month, data.main_schet_id, data.schet, data.region_id]);

    const response = await MainBookDB.get8Docs(result);

    return response;
  }

  static async cleanData(data) {
    const ids = data.data.map((item) => item.id);

    await db.transaction(async (client) => {
      await MainBookDB.cleanData([ids], client);
    });
  }

  static async getCheckFirst(data) {
    const result = await MainBookDB.getCheckFirst([data.main_schet_id, data.region_id]);

    return result;
  }

  static async getEndMainBook(data) {
    const result = await MainBookDB.getEndMainBook([data.main_schet_id, data.region_id]);

    return result;
  }

  static async getUniqueSchets(data) {
    const main_schets = await MainBookDB.getMainSchets([data.region_id, data.main_schet_id]);

    const schets = await MainBookDB.getUniqueSchets([]);

    const set_schets = new Set(schets.map((item) => item.schet));

    for (let main_schet of main_schets) {
      [main_schet.jur1_schet, main_schet.jur2_schet].forEach((schet) => {
        if (schet && !set_schets.has(schet)) {
          set_schets.add(schet);
          schets.push({ schet, prixod: 0, rasxod: 0 });
        }
      });
    }

    schets.sort((a, b) => {
      const numA = a.schet.split("/").map(Number);
      const numB = b.schet.split("/").map(Number);

      for (let i = 0; i < Math.max(numA.length, numB.length); i++) {
        if ((numA[i] || 0) !== (numB[i] || 0)) {
          return (numA[i] || 0) - (numB[i] || 0);
        }
      }
      return 0;
    });

    return { schets, main_schets };
  }

  static async getJurSchets(data) {
    const result = await MainBookDB.getJurSchets([data.main_schet_id]);

    return result;
  }

  static async delete(data) {
    await db.transaction(async (client) => {
      await MainBookDB.delete([data.id], client);

      await MainBookDB.deleteChildByParentId([data.id], client);

      await MainBookDB.unblockSaldo([data.id], client);
    });
  }

  static async getMainBookType(data) {
    const result = await MainBookDB.getMainBookType([]);

    return result;
  }

  static async create(data) {
    const result = await db.transaction(async (client) => {
      const doc = await MainBookDB.create(
        [1, data.accept_time, new Date(), data.user_id, data.year, data.month, data.main_schet_id, new Date(), new Date()],
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
      const doc = await MainBookDB.update([1, new Date(), data.year, data.month, new Date(), data.id], client);

      // old sub_child delete
      for (let child of data.old_data.childs) {
        for (let sub_child of child.sub_childs) {
          const check = data.childs.find((item) => {
            return item.sub_childs.find((element) => element.id === sub_child.id);
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
            await MainBookDB.updateChild([sub_child.schet, sub_child.prixod, sub_child.rasxod, new Date(), sub_child.id], client);
          } else {
            const index = create_childs.findIndex((item) => item.type_id === child.type_id);

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

      await MainBookDB.unblockSaldo([data.id], client);

      const check = await this.checkLarge({ ...data, client });

      const dates = await this.createCheck({ ...data, client, docs: check });

      return { doc, dates };
    });

    return result;
  }

  static async createChild(data) {
    for (let child of data.childs) {
      for (let sub_child of child.sub_childs) {
        await MainBookDB.createChild(
          [sub_child.schet, sub_child.prixod, sub_child.rasxod, data.user_id, data.parent_id, child.type_id, new Date(), new Date()],
          data.client
        );
      }
    }
  }

  static async get(data) {
    const result = await MainBookDB.get([data.region_id, data.main_schet_id, data.offset, data.limit], data.year, data.month);

    return result;
  }

  static async getById(data) {
    const result = await MainBookDB.getById([data.region_id, data.id], data.isdeleted);

    if (result) {
      result.childs = await MainBookDB.getByIdChild([data.id]);
    }

    return result;
  }

  static async getByMonth(data) {
    let sub_childs = [];
    let main_book = await MainBookDB.getByMonth([data.region_id, data.year, data.month, data.main_schet_id]);

    if (main_book) {
      main_book.childs = await MainBookDB.getByIdChild([main_book.id]);

      sub_childs = main_book.childs.find((item) => item.type_id === 10).sub_childs;
    }

    return { sub_childs, main_book };
  }

  static getJur9Data(data) {
    const index = data.types.findIndex((item) => item.id === 9);
    data.types[index].sub_childs = [...data.schets];

    for (let type of data.types) {
      if (type.id !== 9 && type.id !== 0 && type.id !== 10) {
        for (let child of type.sub_childs) {
          const child_index = data.types[index].sub_childs.findIndex((item) => item.schet === child.schet);

          data.types[index].sub_childs[child_index].prixod += child.prixod;
          data.types[index].sub_childs[child_index].rasxod += child.rasxod;
        }
      }
    }

    return data.types[index];
  }

  static getJur10Data(data) {
    const index = data.types.findIndex((item) => item.id === 10);
    data.types[index].sub_childs = [...data.schets];

    for (let type of data.types) {
      if (type.id === 9 || type.id === 0) {
        for (let child of type.sub_childs) {
          const child_index = data.types[index].sub_childs.findIndex((item) => item.schet === child.schet);

          data.types[index].sub_childs[child_index].prixod += child.prixod;
          data.types[index].sub_childs[child_index].rasxod += child.rasxod;
        }
      }
    }

    return data.types[index];
  }

  static async getJur1Data(data) {
    for (let main_schet of data.main_schets) {
      let rasxod = 0;

      const rasxod_data = await MainBookDB.getJur1Rasxod([data.region_id, main_schet.id], { from: data.from, to: data.to }, data.operator);

      for (let schet of rasxod_data) {
        const index = data.schets.findIndex((item) => item.schet === schet.schet);

        if (data.schets[index]) {
          data.schets[index].prixod += schet.summa;
        }

        rasxod += schet.summa;
      }

      const index = data.schets.findIndex((item) => item.schet === main_schet.jur1_schet);

      data.schets[index].rasxod += rasxod;
    }

    return data.schets;
  }

  static getJur0Data(data) {
    const index = data.types.findIndex((item) => item.id === 0);
    data.types[index].sub_childs = [...data.schets];

    for (let child of data.types[index].sub_childs) {
      const schet = data.last_saldo.find((item) => item.schet === child.schet);
      if (schet) {
        child.prixod += schet.prixod;
        child.rasxod += schet.rasxod;
      }
    }

    return data.types[index];
  }

  static async getJur2Data(data) {
    for (let main_schet of data.main_schets) {
      let rasxod = 0;

      const rasxod_data = await MainBookDB.getJur2Rasxod([data.region_id, main_schet.id], { from: data.from, to: data.to }, data.operator);

      for (let schet of rasxod_data) {
        const index = data.schets.findIndex((item) => item.schet === schet.schet);

        if (data.schets[index]) {
          data.schets[index].prixod += schet.summa;
        }

        rasxod += schet.summa;
      }

      const index = data.schets.findIndex((item) => item.schet === main_schet.jur2_schet);

      data.schets[index].rasxod += rasxod;
    }

    return data.schets;
  }

  static async getJur3Data(data) {
    const jur3_schets = data.jur3AndJur4Schets.filter((item) => item.type === "159" || item.type === "152").map((item) => item.schet);

    const rasxod_data = await MainBookDB.getJur3Rasxod(
      [data.region_id, data.main_schet_id, jur3_schets],
      { from: data.from, to: data.to },
      data.operator
    );

    for (let schet of rasxod_data) {
      const index_prixod = data.schets.findIndex((item) => item.schet === schet.schet);

      if (data.schets[index_prixod]) {
        data.schets[index_prixod].prixod += schet.summa;
      }

      const index_rasxod = data.schets.findIndex((item) => item.schet === schet.own);

      if (data.schets[index_rasxod]) {
        data.schets[index_rasxod].rasxod += schet.summa;
      }
    }

    return data.schets;
  }

  static async getJur8Data(data) {
    const rasxod_data = await MainBookDB.getJur8Rasxod([data.region_id, data.main_schet_id, data.year, data.month]);

    for (let schet of rasxod_data) {
      const index_prixod = data.schets.findIndex((item) => item.schet === schet.schet);

      if (data.schets[index_prixod]) {
        data.schets[index_prixod].prixod += schet.summa;
      }

      const index_rasxod = data.schets.findIndex((item) => item.schet === schet.own);

      if (data.schets[index_rasxod]) {
        data.schets[index_rasxod].rasxod += schet.summa;
      }
    }

    return data.schets;
  }

  static async getJur4Data(data) {
    const jur4_schets = data.jur3AndJur4Schets.filter((item) => item.type === "jur4").map((item) => item.schet);

    const rasxod_data = await MainBookDB.getJur4Rasxod(
      [data.region_id, data.main_schet_id, jur4_schets],
      { from: data.from, to: data.to },
      data.operator
    );

    for (let schet of rasxod_data) {
      const index_prixod = data.schets.findIndex((item) => item.schet === schet.schet);

      if (data.schets[index_prixod]) {
        data.schets[index_prixod].prixod += schet.summa;
      }

      const index_rasxod = data.schets.findIndex((item) => item.schet === schet.own);

      if (data.schets[index_rasxod]) {
        data.schets[index_rasxod].rasxod += schet.summa;
      }
    }

    return data.schets;
  }

  static async getJur5Data(data) {
    const ZARPL_URL = process.env.ZARPL_URL;
    let response;

    try {
      const url = `${ZARPL_URL}/api/Nachislenie/get-jurnal5-glavniy-kniga?regionId=${data.region_id}&year=${data.year}&month=${data.month}&mainSchetId=${data.main_schet_id}`;
      response = await fetch(url);

      if (response.ok) {
        const result = await response.json(); // JSON formatga o‘tkazamiz

        for (let schet of result.schetChild) {
          const find = data.schets.find((i) => i.schet === schet.schet);
          if (find) {
            find.rasxod += schet.summa;
          }
        }

        return data.schets;
      } else {
        console.error("Xatolik:", response.statusText);
        return data.schets;
      }
    } catch (error) {
      console.error("Tarmoq xatosi:", error.message);
      return data.schets;
    }
  }

  static async getJur7Data(data) {
    const rasxod_data = await MainBookDB.getJur7Rasxod(
      [data.region_id, data.main_schet_id],
      { from: data.from, to: data.to },
      data.operator
    );

    for (let schet of rasxod_data) {
      const debet = data.schets.find((item) => item.schet === schet.debet_schet);

      if (debet) {
        debet.prixod += schet.summa;
      }

      const kredit = data.schets.find((item) => item.schet === schet.kredit_schet);

      if (kredit) {
        kredit.rasxod += schet.summa;
      }
    }

    return data.schets;
  }

  static async getFromData(data) {
    // jur1
    for (let main_schet of data.main_schets) {
      let rasxod = 0;

      const rasxod_data = await MainBookDB.getJur1Rasxod([data.region_id, main_schet.id], { from: data.from, to: data.to }, data.operator);

      for (let schet of rasxod_data) {
        const index = data.schets.findIndex((item) => item.schet === schet.schet);

        if (data.schets[index]) {
          data.schets[index].prixod += schet.summa;
        }

        rasxod += schet.summa;
      }

      const index = data.schets.findIndex((item) => item.schet === main_schet.jur1_schet);

      data.schets[index].rasxod += rasxod;
    }

    // jur2
    for (let main_schet of data.main_schets) {
      let rasxod = 0;

      const rasxod_data = await MainBookDB.getJur2Rasxod([data.region_id, main_schet.id], { from: data.from, to: data.to }, data.operator);

      for (let schet of rasxod_data) {
        const index = data.schets.findIndex((item) => item.schet === schet.schet);

        if (data.schets[index]) {
          data.schets[index].prixod += schet.summa;
        }

        rasxod += schet.summa;
      }

      const index = data.schets.findIndex((item) => item.schet === main_schet.jur2_schet);

      data.schets[index].rasxod += rasxod;
    }

    // jur3
    const jur3_schets = data.jur3AndJur4Schets.filter((item) => item.type === "jur3").map((item) => item.schet);
    for (let main_schet of data.main_schets) {
      let rasxod = 0;

      const rasxod_data = await MainBookDB.getJur3Rasxod(
        [data.region_id, main_schet.id, jur3_schets],
        { from: data.from, to: data.to },
        data.operator
      );

      for (let schet of rasxod_data) {
        const index = data.schets.findIndex((item) => item.schet === schet.schet);

        if (data.schets[index]) {
          data.schets[index].prixod += schet.summa;
        }

        rasxod += schet.summa;
      }

      const index = data.schets.findIndex((item) => item.schet === main_schet.jur3_schet);

      data.schets[index].rasxod += rasxod;
    }

    // jur4
    for (let main_schet of data.main_schets) {
      let rasxod = 0;

      const rasxod_data = await MainBookDB.getJur4Rasxod([data.region_id, main_schet.id], { from: data.from, to: data.to }, data.operator);

      const index = data.schets.findIndex((item) => item.schet === main_schet.jur4_schet);

      for (let schet of rasxod_data) {
        const index = data.schets.findIndex((item) => item.schet === schet.schet);

        if (data.schets[index]) {
          data.schets[index].prixod += schet.summa;
        }

        rasxod += schet.summa;
      }

      data.schets[index].rasxod += rasxod;
    }

    // jur7
    const rasxod_data = await MainBookDB.getJur7Rasxod(
      [data.region_id, data.main_schet_id],
      { from: data.from, to: data.to },
      data.operator
    );

    for (let schet of rasxod_data) {
      const debet = data.schets.find((item) => item.schet === schet.debet_schet);

      if (debet) {
        debet.prixod += schet.summa;
      }

      const kredit = data.schets.find((item) => item.schet === schet.kredit_schet);

      if (kredit) {
        kredit.rasxod += schet.summa;
      }
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

      const rasxod_data = await MainBookDB.getJur1Rasxod([data.region_id, main_schet.id], { from: data.from, to: data.to }, data.operator);

      for (let schet of rasxod_data) {
        const index = data.schets.findIndex((item) => item.schet === schet.schet);

        if (data.schets[index]) {
          data.schets[index].prixod += schet.summa;
        }

        rasxod += schet.summa;
      }

      const index = data.schets.findIndex((item) => item.schet === main_schet.jur1_schet);

      data.schets[index].rasxod += rasxod;
    }

    // jur2
    for (let main_schet of data.main_schets) {
      let rasxod = 0;

      const rasxod_data = await MainBookDB.getJur2Rasxod([data.region_id, main_schet.id], { from: data.from, to: data.to }, data.operator);

      for (let schet of rasxod_data) {
        const index = data.schets.findIndex((item) => item.schet === schet.schet);

        if (data.schets[index]) {
          data.schets[index].prixod += schet.summa;
        }

        rasxod += schet.summa;
      }

      const index = data.schets.findIndex((item) => item.schet === main_schet.jur2_schet);

      data.schets[index].rasxod += rasxod;
    }

    // jur3
    const jur3_schets = data.jur3AndJur4Schets.filter((item) => item.type === "jur3").map((item) => item.schet);

    for (let main_schet of data.main_schets) {
      let rasxod = 0;

      const rasxod_data = await MainBookDB.getJur3Rasxod(
        [data.region_id, main_schet.id, jur3_schets],
        { from: data.from, to: data.to },
        data.operator
      );

      for (let schet of rasxod_data) {
        const index = data.schets.findIndex((item) => item.schet === schet.schet);

        if (data.schets[index]) {
          data.schets[index].prixod += schet.summa;
        }

        rasxod += schet.summa;
      }

      const index = data.schets.findIndex((item) => item.schet === main_schet.jur3_schet);

      data.schets[index].rasxod += rasxod;
    }

    // jur4
    for (let main_schet of data.main_schets) {
      let rasxod = 0;

      const rasxod_data = await MainBookDB.getJur4Rasxod([data.region_id, main_schet.id], { from: data.from, to: data.to }, data.operator);

      const index = data.schets.findIndex((item) => item.schet === main_schet.jur4_schet);

      for (let schet of rasxod_data) {
        const index = data.schets.findIndex((item) => item.schet === schet.schet);

        if (data.schets[index]) {
          data.schets[index].prixod += schet.summa;
        }

        rasxod += schet.summa;
      }

      data.schets[index].rasxod += rasxod;
    }

    // jur7
    const rasxod_data = await MainBookDB.getJur7Rasxod(
      [data.region_id, data.main_schet_id],
      { from: data.from, to: data.to },
      data.operator
    );

    for (let schet of rasxod_data) {
      const debet = data.schets.find((item) => item.schet === schet.debet_schet);

      if (debet) {
        debet.prixod += schet.summa;
      }

      const kredit = data.schets.find((item) => item.schet === schet.kredit_schet);

      if (kredit) {
        kredit.rasxod += schet.summa;
      }
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

  static async getByIdExcel(data) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("main book");

    const title = data.report_title.name
      .split(" ")
      .filter((word) => word.length)
      .map((word) => word[0])
      .join(".");

    worksheet.mergeCells(`A1`, "X1");
    worksheet.getCell(`A1`).value = `${HelperFunctions.returnStringYearMonth({ year: data.year, month: data.month })}`;

    worksheet.mergeCells(`A2`, "A3");
    worksheet.getCell(`A3`).value = `№`;

    worksheet.mergeCells(`B2`, "B3");
    worksheet.getCell(`B2`).value = `Счет`;

    worksheet.mergeCells(`C2`, "D2");
    worksheet.getCell(`C2`).value = "Бош.";

    worksheet.mergeCells(`E2`, "F2");
    worksheet.getCell(`E2`).value = `Бош Китоб.1`;

    worksheet.mergeCells(`G2`, "H2");
    worksheet.getCell(`G2`).value = `Бош Китоб.2`;

    worksheet.mergeCells(`I2`, "J2");
    worksheet.getCell(`I2`).value = `Бош Китоб.3`;

    worksheet.mergeCells(`K2`, "L2");
    worksheet.getCell(`K2`).value = `Бош Китоб.3a`;

    worksheet.mergeCells(`M2`, "N2");
    worksheet.getCell(`M2`).value = `Бош Китоб.4`;

    worksheet.mergeCells(`O2`, "P2");
    worksheet.getCell(`O2`).value = `Бош Китоб.5`;

    worksheet.mergeCells(`Q2`, "R2");
    worksheet.getCell(`Q2`).value = `Бош Китоб.7`;

    worksheet.mergeCells(`S2`, "T2");
    worksheet.getCell(`S2`).value = `Бош Китоб.8`;

    worksheet.mergeCells(`U2`, "V2");
    worksheet.getCell(`U2`).value = `Ички`;

    worksheet.mergeCells(`W2`, "X2");
    worksheet.getCell(`W2`).value = `Якуний`;

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

    worksheet.getCell("U3").value = "Дебет";
    worksheet.getCell("V3").value = "Кредит";

    worksheet.getCell("W3").value = "Дебет";
    worksheet.getCell("X3").value = "Кредит";

    worksheet.columns = [
      { key: "order", width: 5 },
      { key: "schet", width: 10 },
      { key: "from_prixod", width: 11.5 },
      { key: "from_rasxod", width: 11.5 },
      { key: "jur1_prixod", width: 11.5 },
      { key: "jur1_rasxod", width: 11.5 },
      { key: "jur2_prixod", width: 11.5 },
      { key: "jur2_rasxod", width: 11.5 },
      { key: "jur3_prixod", width: 11.5 },
      { key: "jur3_rasxod", width: 11.5 },
      { key: "jur3a_prixod", width: 11.5 },
      { key: "jur3a_rasxod", width: 11.5 },
      { key: "jur4_prixod", width: 11.5 },
      { key: "jur4_rasxod", width: 11.5 },
      { key: "jur5_prixod", width: 11.5 },
      { key: "jur5_rasxod", width: 11.5 },
      { key: "jur7_prixod", width: 11.5 },
      { key: "jur7_rasxod", width: 11.5 },
      { key: "jur8_prixod", width: 11.5 },
      { key: "jur8_rasxod", width: 11.5 },
      { key: "internal_prixod", width: 11.5 },
      { key: "internal_rasxod", width: 11.5 },
      { key: "to_prixod", width: 11.5 },
      { key: "to_rasxod", width: 11.5 },
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
      } else if (child.type_id === 11) {
        column = 4;
        child.sub_childs.forEach((item) => {
          worksheet.getCell(`K${column}`).value = item.prixod;
          worksheet.getCell(`L${column}`).value = item.rasxod;
          column++;
        });
        worksheet.getCell(`K${column}`).value = child.prixod;
        worksheet.getCell(`L${column}`).value = child.rasxod;
      } else if (child.type_id === 4) {
        column = 4;
        child.sub_childs.forEach((item) => {
          worksheet.getCell(`M${column}`).value = item.prixod;
          worksheet.getCell(`N${column}`).value = item.rasxod;
          column++;
        });
        worksheet.getCell(`M${column}`).value = child.prixod;
        worksheet.getCell(`N${column}`).value = child.rasxod;
      } else if (child.type_id === 5) {
        column = 4;
        child.sub_childs.forEach((item) => {
          worksheet.getCell(`O${column}`).value = item.prixod;
          worksheet.getCell(`P${column}`).value = item.rasxod;
          column++;
        });
        worksheet.getCell(`O${column}`).value = child.prixod;
        worksheet.getCell(`P${column}`).value = child.rasxod;
      } else if (child.type_id === 7) {
        column = 4;
        child.sub_childs.forEach((item) => {
          worksheet.getCell(`Q${column}`).value = item.prixod;
          worksheet.getCell(`R${column}`).value = item.rasxod;
          column++;
        });
        worksheet.getCell(`Q${column}`).value = child.prixod;
        worksheet.getCell(`R${column}`).value = child.rasxod;
      } else if (child.type_id === 8) {
        column = 4;
        child.sub_childs.forEach((item) => {
          worksheet.getCell(`S${column}`).value = item.prixod;
          worksheet.getCell(`T${column}`).value = item.rasxod;
          column++;
        });
        worksheet.getCell(`S${column}`).value = child.prixod;
        worksheet.getCell(`T${column}`).value = child.rasxod;
      } else if (child.type_id === 9) {
        column = 4;
        child.sub_childs.forEach((item) => {
          worksheet.getCell(`U${column}`).value = item.prixod;
          worksheet.getCell(`V${column}`).value = item.rasxod;
          column++;
        });
        worksheet.getCell(`U${column}`).value = child.prixod;
        worksheet.getCell(`V${column}`).value = child.rasxod;
      } else if (child.type_id === 10) {
        column = 4;
        child.sub_childs.forEach((item) => {
          worksheet.getCell(`W${column}`).value = item.prixod;
          worksheet.getCell(`X${column}`).value = item.rasxod;
          column++;
        });
        worksheet.getCell(`W${column}`).value = child.prixod;
        worksheet.getCell(`X${column}`).value = child.rasxod;
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
        size = 6;
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

  static async checkLarge(data) {
    const check = await MainBookDB.checkLarge([data.region_id, data.year, data.month, data.main_schet_id]);

    return check;
  }

  static async createCheck(data) {
    const dates = [];
    for (let doc of data.docs) {
      dates.push(
        await MainBookDB.createCheck([doc.id, doc.main_schet_id, data.user_id, doc.year, doc.month, this.now, this.now], data.client)
      );
    }

    return dates;
  }
};
