const { RegionJur8SchetsDB } = require("./db");
const { HelperFunctions } = require("@helper/functions");

exports.RegionJur8SchetsService = class {
  static async getBySchetId(data) {
    const result = await RegionJur8SchetsDB.getBySchetId([data.schet_id, data.region_id, data.main_schet_id]);

    return result;
  }

  static async get(data) {
    const result = await RegionJur8SchetsDB.get([data.region_id, data.main_schet_id, data.offset, data.limit], data.search);

    return result;
  }

  static async getById(data) {
    const result = await RegionJur8SchetsDB.getById([data.id, data.region_id, data.main_schet_id], data.isdeleted);

    return result;
  }

  static async delete(data) {
    const result = await RegionJur8SchetsDB.delete([data.id]);

    return result;
  }

  static async create(data) {
    const result = await RegionJur8SchetsDB.create([
      data.schet_id,
      data.user_id,
      data.main_schet_id,
      HelperFunctions.tashkentTime(),
      HelperFunctions.tashkentTime(),
    ]);

    return result;
  }

  static async update(data) {
    const result = await RegionJur8SchetsDB.update([data.schet_id, HelperFunctions.tashkentTime(), data.id]);

    return result;
  }
};
