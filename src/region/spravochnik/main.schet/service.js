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

  static async checkSchet(data) {
    const result = await MainSchetDB.checkSchet(
      [data.budjet_id, data.region_id, data.column],
      data.column_name
    );

    return result;
  }
};
