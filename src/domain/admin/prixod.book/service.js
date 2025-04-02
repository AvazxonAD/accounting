const { PrixodBookDB } = require("./db");

exports.PrixodBookService = class {
  static async get(data) {
    const result = await PrixodBookDB.get(
      [data.offset, data.limit],
      data.year,
      data.budjet_id,
      data.month
    );

    return result;
  }

  static async getById(data) {
    const result = await PrixodBookDB.getById([data.id]);

    if (result) {
      result.childs = await PrixodBookDB.getByIdChild([data.id]);
    }

    return result;
  }

  static async update(data) {
    const result = await PrixodBookDB.update([
      data.status,
      new Date(),
      data.user_id,
      data.id,
    ]);

    return result;
  }
};
