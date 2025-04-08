const { Jur8SchetsDB } = require("./db");
const { HelperFunctions } = require("@helper/functions");

exports.Jur8SchetsService = class {
  static async getBySchet(data) {
    const result = await Jur8SchetsDB.getBySchet([data.schet]);

    return result;
  }

  static async get(data) {
    const result = await Jur8SchetsDB.get(
      [data.offset, data.limit],
      data.search
    );

    return result;
  }

  static async getById(data) {
    const result = await Jur8SchetsDB.getById([data.id], data.isdeleted);

    return result;
  }

  static async delete(data) {
    const result = await Jur8SchetsDB.delete([data.id]);

    return result;
  }

  static async create(data) {
    const result = await Jur8SchetsDB.create([
      data.schet,
      data.name,
      HelperFunctions.tashkentTime(),
      HelperFunctions.tashkentTime(),
    ]);

    return result;
  }

  static async update(data) {
    const result = await Jur8SchetsDB.update([
      data.schet,
      data.name,
      HelperFunctions.tashkentTime(),
      data.id,
    ]);

    return result;
  }
};
