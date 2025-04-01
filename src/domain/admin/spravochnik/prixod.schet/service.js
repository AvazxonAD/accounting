const { PrixodSchetsDB } = require("./db");
const { HelperFunctions } = require("@helper/functions");

exports.PrixodSchetsService = class {
  static async getBySchet(data) {
    const result = await PrixodSchetsDB.getBySchet([data.schet]);

    return result;
  }

  static async get(data) {
    const result = await PrixodSchetsDB.get(
      [data.offset, data.limit],
      data.search
    );

    return result;
  }

  static async getById(data) {
    const result = await PrixodSchetsDB.getById([data.id], data.isdeleted);

    return result;
  }

  static async delete(data) {
    const result = await PrixodSchetsDB.delete([data.id]);

    return result;
  }

  static async create(data) {
    const result = await PrixodSchetsDB.create([
      data.schet,
      data.name,
      HelperFunctions.tashkentTime(),
      HelperFunctions.tashkentTime(),
    ]);

    return result;
  }

  static async update(data) {
    const result = await PrixodSchetsDB.update([
      data.schet,
      data.name,
      HelperFunctions.tashkentTime(),
      data.id,
    ]);

    return result;
  }
};
