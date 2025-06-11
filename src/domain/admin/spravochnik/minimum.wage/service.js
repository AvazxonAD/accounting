const { MinimumWageDB } = require("./db");
const { HelperFunctions } = require("@helper/functions");

exports.MinimumWageService = class {
  static async get(data) {
    const result = await MinimumWageDB.get([]);

    return result;
  }

  static async update(data) {
    const result = await MinimumWageDB.update([data.summa, HelperFunctions.tashkentTime()]);

    return result;
  }
};
