const { db } = require("@db/index");
const { MainBookDB } = require("./db");

exports.MainBookService = class {
  static async get(data) {
    const result = await MainBookDB.get(
      [data.offset, data.limit],
      data.year,
      data.budjet_id
    );

    return result;
  }

  static async getById(data) {
    const result = await MainBookDB.getById([data.id]);

    if (result) {
      result.childs = await MainBookDB.getByIdChild([data.id]);
    }

    return result;
  }

  static async update(data) {
    const result = await MainBookDB.update([
      data.status,
      new Date(),
      data.user_id,
      data.id,
    ]);

    return result;
  }
};
