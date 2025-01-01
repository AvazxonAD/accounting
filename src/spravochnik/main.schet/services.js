const { MainSchetDB } = require('./db')

exports.MainSchetService = class {
  static async getByIdMainScet(data, isdeleted) {
    const result = await MainSchetDB.getByIdMainSchet([data.region_id, data.id], isdeleted);
    return result;
  }
}