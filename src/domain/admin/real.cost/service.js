const { RealCostDB } = require("./db");

exports.RealCostService = class {
  static async get(data) {
    const result = await RealCostDB.get(
      [data.offset, data.limit],
      data.year,
      data.budjet_id,
      data.month
    );

    return result;
  }

  static async getById(data) {
    const result = await RealCostDB.getById([data.id]);

    if (result) {
      result.childs = await RealCostDB.getByIdChild([data.id]);
      for (let child of result.childs) {
        const smeta_data = await RealCostDB.getByMonthChild([child.id]);
        child.by_month = smeta_data.by_month;
        child.by_year = smeta_data.by_year;
      }
    }

    return result;
  }

  static async update(data) {
    const result = await RealCostDB.update([
      data.status,
      new Date(),
      data.user_id,
      data.id,
    ]);

    return result;
  }
};
