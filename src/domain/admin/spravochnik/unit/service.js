const { UnitDB } = require("./db");

exports.UnitService = class {
  static async getById(data) {
    const unit = await UnitDB.getById([data.id], data.isdeleted);

    return unit;
  }

  static async getByName(data) {
    const unit = await UnitDB.getByName([data.name], data.isdeleted);

    return unit;
  }

  static async getByNameSearch(data) {
    const unit = await UnitDB.getByNameSearch([data.name], data.isdeleted);

    return unit;
  }

  static async create(data) {
    const result = await UnitDB.create([data.name, new Date(), new Date()]);
    return result;
  }
};
