const { PodpisDB } = require("./db");

exports.PodpisService = class {
  static async get(data) {
    const result = await PodpisDB.get([data.region_id], data.type);

    return result;
  }
};
