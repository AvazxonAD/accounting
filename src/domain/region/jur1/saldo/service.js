const { KassaSaldoDB } = require("./db");

exports.KassaSaldoService = class {
  static async getByMonth(data) {
    const result = await KassaSaldoDB.getByMonth([
      data.main_schet_id,
      data.year,
      data.month,
      data.region_id,
    ]);

    return result;
  }

  static async create(data) {
    const doc = await KassaSaldoDB.create([
      data.summa,
      data.main_schet_id,
      data.year,
      data.month,
      data.user_id,
      data.budjet_id,
      new Date(),
      new Date(),
    ]);

    return doc;
  }

  static async get(data) {
    const result = await KassaSaldoDB.get(
      [data.budjet_id],
      data.main_schet_id,
      data.year,
      data.month
    );

    let summa = 0;
    result.forEach((item) => {
      summa += item.summa;
    });

    return { docs: result, summa };
  }

  static async getById(data) {
    const result = await KassaSaldoDB.getById(
      [data.region_id, data.id, data.budjet_id],
      data.isdeleted
    );

    return result;
  }

  static async update(data) {
    const doc = await KassaSaldoDB.update([
      data.summa,
      data.main_schet_id,
      data.year,
      data.month,
      new Date(),
      data.id,
    ]);

    return doc;
  }

  static async delete(data) {
    const doc = await KassaSaldoDB.delete([data.id]);
    return doc;
  }
};
