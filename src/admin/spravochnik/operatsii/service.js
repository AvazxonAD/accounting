const { OperatsiiDB } = require("./db");

exports.OperatsiiService = class {
  static async getById(data) {
    const result = await OperatsiiDB.getById(
      [data.id],
      data.type,
      data.budjet_id,
      data.isdeleted
    );
    return result;
  }

  static async get(data) {
    const result = await OperatsiiDB.get([]);
  }

  static async getUniqueSchets(data) {
    const result = await OperatsiiDB.getUniqueSchets(
      [],
      data.type_schet,
      data.budjet_id
    );

    return result;
  }
};
