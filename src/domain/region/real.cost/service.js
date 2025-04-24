const { OdinoxDB } = require("./db");
const { db } = require("@db/index");
const ExcelJS = require("exceljs");
const fs = require("fs");
const path = require("path");
const { HelperFunctions, sum } = require(`@helper/functions`);

exports.OdinoxService = class {
  static now = new Date();

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
      if (smeta.smeta_grafik) {
        for (let i = 1; i <= data.month; i++) {
          smeta.summa = smeta.smeta_grafik[`oy_${i}`];
        }
      } else {
        smeta.summa = 0;
      }
    }

    return data.smetas;
  }

  static async getCangculate(data) {
    for (let smeta of data.smetas) {
      let old_summa;
      const doc_summa = data.doc.sub_childs.find(
        (item) => item.id === smeta.id
      );

      if (data.old) {
        old_summa = data.old.sub_childs.find(
          (item) => item.smeta_id === smeta.id
        );
      } else {
        old_summa = { summa: 0 };
      }

      smeta.summa = doc_summa.summa + old_summa.summa;
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
