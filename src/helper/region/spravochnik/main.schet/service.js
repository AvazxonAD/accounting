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
    const result = await MainSchetDB.get([
      data.region_id,
      data.budjet_id,
      data.offset,
      data.limit,
    ]);

    return result;
  }
};
