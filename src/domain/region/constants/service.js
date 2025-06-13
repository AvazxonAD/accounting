const { ConstanstsDB } = require("./db");

exports.ConstanstsService = class {
  static async getPodpisType(data) {
    const result = await ConstanstsDB.getPodpisType([]);

    return result;
  }

  static async getRegions(data) {
    const result = await ConstanstsDB.getRegions([]);

    return result;
  }

  static async getByIdRegion(data) {
    const result = await ConstanstsDB.getByIdRegion([data.id]);

    return result;
  }

  static async getDistricts(data) {
    const result = await ConstanstsDB.getDistricts([], data.region_id);

    return result;
  }

  static async getByIdDistrict(data) {
    const result = await ConstanstsDB.getByIdDistrict([data.id]);

    return result;
  }
};
