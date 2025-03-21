const { MainSchetDB } = require("./db");

exports.MainSchetService = class {
  static async getById(data, isdeleted) {
    const result = await MainSchetDB.getByIdMainSchet(
      [data.region_id, data.id],
      isdeleted
    );
    return result;
  }

  static async get(data) {
    const result = await MainSchetDB.getByIdMainSchet([
      data.region_id,
      data.id,
    ]);
    return result;
  }
};
