const { OdinoxDB } = require("./db");

exports.OdinoxService = class {
  static async get(data) {
    const result = await OdinoxDB.get(
      [data.offset, data.limit],
      data.year,
      data.budjet_id,
      data.month
    );

    return result;
  }

  static async getById(data) {
    const result = await OdinoxDB.getById([data.id]);

    if (result) {
      result.childs = await OdinoxDB.getByIdChild([data.id]);
    }

    return result;
  }

  static async update(data) {
    const result = await OdinoxDB.update([
      data.status,
      new Date(),
      data.user_id,
      data.id,
    ]);

    return result;
  }
};
