const { RegionDB } = require("./db");

exports.RegionService = class {
  static async getById(data) {
    const result = await RegionDB.getById([data.id], data.isdeleted);

    return result;
  }

  static async get(data) {
    const result = await RegionDB.get([data.offset, data.limit], data.search);

    return result;
  }
};
