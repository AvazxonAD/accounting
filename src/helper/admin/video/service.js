const { VideoDB } = require("./db");
const { HelperFunctions } = require("@helper/functions");

exports.VideoService = class {
  static async create(data) {
    const result = await VideoDB.create([
      data.name,
      data.file,
      data.module_id,
      data.status,
      data.sort_order,
      HelperFunctions.tashkentTime(),
      HelperFunctions.tashkentTime(),
    ]);

    return result;
  }

  static async update(data) {
    const result = await VideoDB.update([
      data.name,
      data.file,
      data.module_id,
      data.status,
      data.sort_order,
      HelperFunctions.tashkentTime(),
      data.id,
    ]);

    return result;
  }

  static async get(data) {
    const result = await VideoDB.get(
      [data.offset, data.limit],
      data.search,
      data.status
    );

    return result;
  }

  static async getById(data) {
    const result = await VideoDB.getById([data.id]);

    return result;
  }

  static async delete(data) {
    await VideoDB.delete([data.id]);
  }
};
