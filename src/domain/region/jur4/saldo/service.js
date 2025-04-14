const { db } = require("@db/index");
const { Saldo159DB } = require("./db");
const { HelperFunctions } = require("@helper/functions");

exports.Jur4SaldoService = class {
  static now = new Date();

  static async createChild(data) {
    for (let podotchet of data.podotchets) {
      await Saldo159DB.createChild(
        [
          podotchet.podotchet_id,
          data.doc.id,
          podotchet.prixod,
          podotchet.rasxod,
          this.now,
          this.now,
        ],
        data.client
      );
    }
  }

  static async create(data) {
    const result = await db.transaction(async (client) => {
      await Saldo159DB.deleteByMonth(
        [data.year, data.month, data.main_schet_id, data.schet_id],
        client
      );

      // await Saldo159DB.deleteSaldoDateByMonth(
      //   [data.year, data.month, data.main_schet_id, data.schet_id],
      //   client
      // );

      const saldo_date = `${data.year}-${String(data.month).padStart(2, "0")}-01`;

      const doc = await Saldo159DB.create(
        [
          data.main_schet_id,
          data.year,
          data.month,
          data.user_id,
          data.budjet_id,
          saldo_date,
          data.schet_id,
          this.now,
          this.now,
        ],
        client
      );

      await this.createChild({ ...data, client, doc });

      return { dates: [], doc };
    });

    return result;
  }

  static async get(data) {
    const result = await Saldo159DB.get(
      [data.budjet_id, data.region_id],
      data.main_schet_id,
      data.year,
      data.month,
      data.schet_id
    );

    let prixod = 0;
    let rasxod = 0;
    result.forEach((item) => {
      item.prixod = 0;
      item.rasxod = 0;

      item.childs.forEach((child) => {
        item.prixod += child.prixod;
        item.rasxod += child.rasxod;
      });

      prixod += item.prixod;
      rasxod += item.rasxod;
    });

    return { docs: result, meta: { prixod, rasxod, summa: prixod - rasxod } };
  }

  static async getById(data) {
    const result = await Saldo159DB.getById(
      [data.region_id, data.id, data.budjet_id],
      data.isdeleted
    );

    if (result) {
      for (let child of result.childs) {
        result.prixod += child.prixod;
        result.rasxod += child.rasxod;
      }
    }

    return result;
  }

  static async getByMonth(data) {
    const result = await Saldo159DB.getByMonth([
      data.main_schet_id,
      data.year,
      data.month,
      data.region_id,
      data.schet_id,
    ]);

    if (result) {
      result.prixod = 0;
      result.rasxod = 0;

      result.childs.forEach((child) => {
        result.prixod += child.prixod;
        result.rasxod += child.rasxod;
      });

      result.summa = result.prixod - result.rasxod;
    }

    return result;
  }

  static async cleanData(data) {
    await db.transaction(async (client) => {
      await Saldo159DB.cleanData([data.main_schet_id, data.schet_id], client);
    });
  }

  static async getFirstSaldo(data) {
    const result = await Saldo159DB.getFirstSaldo([
      data.region_id,
      data.main_schet_id,
      data.schet_id,
    ]);

    return result;
  }

  static async getEndSaldo(data) {
    const result = await Saldo159DB.getEndSaldo([
      data.region_id,
      data.main_schet_id,
      data.schet_id,
    ]);

    return result;
  }

  static async update(data) {
    const result = await db.transaction(async (client) => {
      const result = await db.transaction(async (client) => {
        const saldo_date = HelperFunctions.returnDate({
          year: data.year,
          month: data.month,
        });

        await Saldo159DB.deleteChild([data.id], client);

        const doc = { id: data.id };

        await Saldo159DB.deleteSaldoDateByMonth([data.id], client);

        await this.createChild({ ...data, client, doc });

        const dates = await this.createSaldoDate({
          ...data,
          doc_date: saldo_date,
          client,
        });

        return { dates, doc };
      });

      return result;
    });

    return result;
  }

  static async delete(data) {
    const result = await db.transaction(async (client) => {
      await Saldo159DB.deleteChild([data.id], client);

      const doc = await Saldo159DB.delete([data.id], client);

      return doc;
    });

    return result;
  }

  static async createSaldoDate(data) {
    const year = new Date(data.doc_date).getFullYear();
    const month = new Date(data.doc_date).getMonth() + 1;

    const saldo_date = HelperFunctions.returnDate({ year, month });
    const check = await Saldo159DB.getSaldoDate([
      data.region_id,
      saldo_date,
      data.main_schet_id,
      data.schet_id,
    ]);

    let dates = [];
    for (let date of check) {
      dates.push(
        await Saldo159DB.createSaldoDate(
          [
            data.user_id,
            date.year,
            date.month,
            data.main_schet_id,
            data.schet_id,
            date.id,
            data.budjet_id,
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
    const result = await Saldo159DB.getDateSaldo([
      data.region_id,
      data.main_schet_id,
      data.schet_id,
    ]);

    return result;
  }
};
