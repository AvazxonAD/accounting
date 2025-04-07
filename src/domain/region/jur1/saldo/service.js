const { db } = require("@db/index");
const { KassaSaldoDB } = require("./db");
const { HelperFunctions } = require("@helper/functions");

exports.KassaSaldoService = class {
  static async cleanData(data) {
    await KassaSaldoDB.cleanData([data.main_schet_id]);
  }

  static async getFirstSaldo(data) {
    const result = await KassaSaldoDB.getFirstSaldo([
      data.region_id,
      data.main_schet_id,
    ]);

    return result;
  }

  static async getSaldoDate(data) {
    const result = await KassaSaldoDB.getSaldoDate([
      data.region_id,
      data.date_saldo,
      data.main_schet_id,
    ]);

    return result;
  }

  static async createSaldoDate(data) {
    const year = new Date(data.doc_date).getFullYear();
    const month = new Date(data.doc_date).getMonth() + 1;

    const saldo_date = `${year}-${String(month).padStart(2, "0")}-01`;
    const check = await KassaSaldoDB.getSaldoDate([
      data.region_id,
      saldo_date,
      data.main_schet_id,
    ]);

    let dates = [];
    for (let date of check) {
      dates.push(
        await KassaSaldoDB.createSaldoDate(
          [
            data.user_id,
            date.year,
            date.month,
            data.main_schet_id,
            HelperFunctions.tashkentTime(),
            HelperFunctions.tashkentTime(),
          ],
          data.client
        )
      );
    }

    return dates;
  }

  static async getDateSaldo(data) {
    const result = await KassaSaldoDB.getDateSaldo([
      data.region_id,
      data.main_schet_id,
    ]);

    return result;
  }

  static async createAuto(data) {
    const response = await db.transaction(async (client) => {
      await KassaSaldoDB.deleteByMonth(
        [data.year, data.month, data.main_schet_id],
        client
      );

      await KassaSaldoDB.deleteSaldoDateByMonth(
        [data.year, data.month, data.main_schet_id],
        client
      );

      const saldo_date = `${data.year}-${String(data.month).padStart(2, "0")}-01`;

      const doc = await KassaSaldoDB.create(
        [
          data.summa,
          data.main_schet_id,
          data.year,
          data.month,
          data.user_id,
          data.budjet_id,
          saldo_date,
          new Date(),
          new Date(),
        ],
        client
      );

      const dates = await this.createSaldoDate({
        ...data,
        doc_date: saldo_date,
        client,
      });

      return { dates, doc };
    });

    return response;
  }

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
      `${data.year}-${String(data.month).padStart(2, "0")}-01`,
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
    const result = await db.transaction(async (client) => {
      const date_saldo = `${data.year}-${String(data.month).padStart(2, "0")}-01`;

      const doc = await KassaSaldoDB.update(
        [
          data.summa,
          data.main_schet_id,
          data.year,
          data.month,
          date_saldo,
          new Date(),
          data.id,
        ],
        client
      );

      const dates = await this.createSaldoDate({
        ...data,
        doc_date: date_saldo,
        client,
      });

      return { doc, dates };
    });

    return result;
  }

  static async delete(data) {
    const doc = await KassaSaldoDB.delete([data.id]);
    return doc;
  }
};
