const { VideoModuleDB } = require("./db");
const { HelperFunctions } = require("@helper/functions");

exports.VideoModuleService = class {
  static async getByName(data) {
    const result = await VideoModuleDB.getByName([data.name]);

    return result;
  }

  static async create(data) {
    const result = await VideoModuleDB.create([
      data.name,
      data.status,
      HelperFunctions.tashkentTime(),
      HelperFunctions.tashkentTime(),
    ]);

    return result;
  }

  static async update(data) {
    const result = await VideoModuleDB.update([
      data.name,
      data.status,
      HelperFunctions.tashkentTime(),
      data.id,
    ]);

    return result;
  }

  static async get(data) {
    const result = await VideoModuleDB.get(
      [data.offset, data.limit],
      data.search,
      data.status
    );

    return result;
  }

  static async getById(data) {
    const result = await VideoModuleDB.getById([data.id], data.isdeleted);

    return result;
  }

  static async delete(data) {
    await VideoModuleDB.delete([data.id]);
  }
};
