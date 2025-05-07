const { SmetaGrafikDB } = require("./db");
const { sum } = require("@helper/functions");
const { db } = require(`@db/index`);

exports.SmetaGrafikService = class {
  static now = new Date();

  static async getOld(data) {
    const result = await SmetaGrafikDB.getOld(
      [data.region_id, data.offset, data.limit],
      { year: data.year, smeta_id: data.smeta_id }
    );

    return result;
  }

  static async multiInsert(data) {
    await db.transaction(async (client) => {
      for (let smeta of data.smetas) {
        const itogo = sum(
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
          smeta.oy_12
        );

        await SmetaGrafikDB.create(
          [
            smeta.smeta_id,
            null,
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
            this.now,
            this.now,
          ],
          client
        );
      }
    });
  }

  static async create(data) {
    const itogo = sum(
      data.oy_1,
      data.oy_2,
      data.oy_3,
      data.oy_4,
      data.oy_5,
      data.oy_6,
      data.oy_7,
      data.oy_8,
      data.oy_9,
      data.oy_10,
      data.oy_11,
      data.oy_12
    );

    const result = await SmetaGrafikDB.create([
      data.smeta_id,
      data.spravochnik_budjet_name_id,
      data.user_id,
      itogo,
      data.oy_1,
      data.oy_2,
      data.oy_3,
      data.oy_4,
      data.oy_5,
      data.oy_6,
      data.oy_7,
      data.oy_8,
      data.oy_9,
      data.oy_10,
      data.oy_11,
      data.oy_12,
      data.year,
      data.main_schet_id,
      this.now,
      this.now,
    ]);

    return result;
  }

  static async get(data) {
    const result = await SmetaGrafikDB.get(
      [data.region_id, data.main_schet_id, data.offset, data.limit],
      data.budjet_id,
      data.operator,
      data.year,
      data.search
    );

    return result;
  }

  static async getById(data, isdeleted) {
    const result = await SmetaGrafikDB.getById(
      [data.region_id, data.id, data.main_schet_id],
      isdeleted
    );
    return result;
  }

  static async getByYear(data) {
    const result = await SmetaGrafikDB.getByYear([
      data.region_id,
      data.smeta_id,
      data.year,
      data.main_schet_id,
    ]);

    return result;
  }

  static async update(data) {
    const itogo = sum(
      data.oy_1,
      data.oy_2,
      data.oy_3,
      data.oy_4,
      data.oy_5,
      data.oy_6,
      data.oy_7,
      data.oy_8,
      data.oy_9,
      data.oy_10,
      data.oy_11,
      data.oy_12
    );

    const order = await SmetaGrafikDB.getBySortNumber([data.id]);

    const result = await db.transaction(async (client) => {
      const grafik = await SmetaGrafikDB.update(
        [
          itogo,
          data.oy_1,
          data.oy_2,
          data.oy_3,
          data.oy_4,
          data.oy_5,
          data.oy_6,
          data.oy_7,
          data.oy_8,
          data.oy_9,
          data.oy_10,
          data.oy_11,
          data.oy_12,
          data.smeta_id,
          data.spravochnik_budjet_name_id,
          data.year,
          data.main_schet_id,
          this.now,
          data.id,
        ],
        client
      );

      await SmetaGrafikDB.createOld(
        [
          data.id,
          order,
          data.user_id,
          data.old_data.smeta_name,
          data.old_data.smeta_number,
          data.old_data.budjet_name,
          data.old_data.itogo,
          data.old_data.oy_1,
          data.old_data.oy_2,
          data.old_data.oy_3,
          data.old_data.oy_4,
          data.old_data.oy_5,
          data.old_data.oy_6,
          data.old_data.oy_7,
          data.old_data.oy_8,
          data.old_data.oy_9,
          data.old_data.oy_10,
          data.old_data.oy_11,
          data.old_data.oy_12,
          data.old_data.account_number,
          data.old_data.year,
          this.now,
          this.now,
        ],
        client
      );

      return grafik;
    });

    return result;
  }

  static async delete(data) {
    const result = await SmetaGrafikDB.delete([data.id]);

    return result;
  }
};
