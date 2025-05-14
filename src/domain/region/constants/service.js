const { ConstanstsDB } = require("./db");

exports.ConstanstsService = class {
  static async getPodpisType(data) {
    const result = await ConstanstsDB.getPodpisType([]);

    return result;
  }
};
