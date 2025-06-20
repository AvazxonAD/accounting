const { PositionsDB } = require("./db");
const { db } = require(`@db/index`);

exports.PositionsService = class {
  static now = new Date();

  static async get(data) {
    const result = await PositionsDB.get([data.offset, data.limit], data.search);

    return result;
  }

  static async getById(data) {
    const result = await PositionsDB.getById([data.id], data.isdeleted);

    return result;
  }

  static async getByName(data) {
    const result = await PositionsDB.getByName([data.name]);

    return result;
  }

  static async delete(data) {
    await PositionsDB.delete([data.id]);
  }

  static async create(data) {
    const result = await PositionsDB.create([data.name, this.now, this.now]);

    return result;
  }

  static async update(data) {
    const result = await PositionsDB.update([data.name, this.now, data.id]);

    return result;
  }
};
