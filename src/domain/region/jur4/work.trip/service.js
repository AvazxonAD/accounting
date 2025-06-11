const { Jur4SaldoService } = require(`@podotchet_saldo/service`);
const { WorkerTripDB } = require("./db");
const { childsSumma, HelperFunctions, tashkentTime } = require("@helper/functions");
const { db } = require("@db/index");

exports.WorkerTripService = class {
  static now = new Date();

  static async get(data) {
    const result = await WorkerTripDB.get(
      [data.region_id, data.main_schet_id, data.from, data.to, data.schet_id, data.offset, data.limit],
      data.search,
      data.order_by,
      data.order_type
    );

    let page_summa = 0;
    result.data.forEach((item) => {
      page_summa += item.summa;
    });

    return { ...result, page_summa };
  }

  static async create(data) {
    const result = await db.transaction(async (client) => {
      const doc = await WorkerTripDB.create(
        [
          data.user_id,
          data.doc_num,
          data.doc_date,
          data.from_date,
          data.to_date,
          data.day_summa,
          data.hostel_ticket_number,
          data.hostel_summa,
          data.from_district_id,
          data.to_district_id,
          data.road_ticket_number,
          data.road_summa,
          data.summa,
          data.comment,
          data.main_schet_id,
          data.schet_id,
          data.worker_id,
          this.now,
          this.now,
        ],
        client
      );

      await this.createChild({ ...data, docId: doc.id }, client);

      const dates = await Jur4SaldoService.createSaldoDate({
        ...data,
        client,
      });

      return { doc, dates };
    });

    return result;
  }

  static async createChild(data, client) {
    const create_childs = [];

    for (let item of data.childs) {
      create_childs.push(item.schet_id, item.summa, item.type, data.docId, this.now, this.now);
    }

    const _values = HelperFunctions.paramsValues({
      params: create_childs,
      column_count: 6,
    });

    await WorkerTripDB.createChild(create_childs, _values, client);
  }

  static async getById(data) {
    const result = await WorkerTripDB.getById([data.region_id, data.main_schet_id, data.id], data.isdeleted);

    return result;
  }

  static async update(data) {
    const summa = childsSumma(data.childs);

    const result = await db.transaction(async (client) => {
      const doc = await WorkerTripDB.update(
        [data.doc_num, data.doc_date, data.opisanie, summa, data.spravochnik_podotchet_litso_id, data.schet_id, tashkentTime(), data.id],
        client
      );

      await WorkerTripDB.deleteChild([data.id], client);

      await this.createChild({ ...data, docId: data.id }, client);
      let dates;

      dates = await Jur4SaldoService.createSaldoDate({
        ...data,
        client,
      });

      if (
        new Date(data.doc_date).getFullYear() !== new Date(data.old_data.doc_date).getFullYear() ||
        new Date(data.doc_date).getMonth() + 1 !== new Date(data.old_data.doc_date).getMonth() + 1
      ) {
        dates = dates.concat(
          await Jur4SaldoService.createSaldoDate({
            ...data,
            doc_date: data.old_data.doc_date,
            client,
          })
        );
      }

      const uniqueDates = dates.filter(
        (item, index, self) => index === self.findIndex((t) => t.year === item.year && t.month === item.month)
      );

      return { doc, dates: uniqueDates };
    });

    return result;
  }

  static async delete(data) {
    const result = await db.transaction(async (client) => {
      const doc = await WorkerTripDB.delete([data.id], client);

      const dates = await Jur4SaldoService.createSaldoDate({
        ...data,
        client,
      });

      return { doc, dates };
    });

    return result;
  }
};
