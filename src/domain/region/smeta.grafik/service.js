const { SmetaGrafikDB } = require("./db");
const { sum } = require("@helper/functions");

exports.SmetaGrafikService = class {
  static now = new Date();

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
      data.year
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
      data.spravochnik_budjet_name_id,
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

    const result = await SmetaGrafikDB.update([
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
    ]);

    return result;
  }

  static async delete(data) {
    const result = await SmetaGrafikDB.delete([data.id]);

    return result;
  }
};
