const { db } = require("@db/index");
const { KassaPrixodDB } = require("./db");
const { tashkentTime, HelperFunctions } = require("@helper/functions");
const { KassaSaldoService } = require(`@jur1_saldo/service`);

exports.KassaPrixodService = class {
  static async create(data) {
    const summa = HelperFunctions.summaDoc(data.childs);

    const result = await db.transaction(async (client) => {
      const doc = await KassaPrixodDB.create(
        [
          data.doc_num,
          data.doc_date,
          data.opisanie,
          summa,
          data.id_podotchet_litso,
          data.main_schet_id,
          data.user_id,
          tashkentTime(),
          tashkentTime(),
          data.main_zarplata_id,
        ],
        client
      );

      await this.createChild({
        childs: data.childs,
        client,
        docId: doc.id,
        user_id: data.user_id,
        main_schet_id: data.main_schet_id,
      });

      const dates = await KassaSaldoService.createSaldoDate({
        ...data,
        client,
      });

      return { doc, dates };
    });

    return result;
  }

  static async createChild(data) {
    const create_childs = [];
    for (let child of data.childs) {
      create_childs.push(
        child.spravochnik_operatsii_id,
        child.summa,
        child.id_spravochnik_podrazdelenie,
        child.id_spravochnik_sostav,
        child.id_spravochnik_type_operatsii,
        data.docId,
        data.user_id,
        data.main_schet_id,
        tashkentTime(),
        tashkentTime()
      );
    }

    const _values = HelperFunctions.paramsValues({
      params: create_childs,
      column_count: 10,
    });

    await KassaPrixodDB.createChild(create_childs, _values, data.client);
  }

  static async get(data) {
    const result = await KassaPrixodDB.get(
      [
        data.region_id,
        data.main_schet_id,
        data.from,
        data.to,
        data.offset,
        data.limit,
      ],
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

  static async getById(data) {
    const result = await KassaPrixodDB.getById(
      [data.region_id, data.main_schet_id, data.id],
      data.iseleted
    );

    return result;
  }

  static async update(data) {
    const summa = HelperFunctions.summaDoc(data.childs);

    const result = await db.transaction(async (client) => {
      const doc = await KassaPrixodDB.update(
        [
          data.doc_num,
          data.doc_date,
          data.opisanie,
          summa,
          data.id_podotchet_litso,
          tashkentTime(),
          data.id,
          data.main_zarplata_id,
        ],
        client
      );

      await KassaPrixodDB.deleteChild([doc.id], client);

      await this.createChild({
        childs: data.childs,
        client,
        docId: doc.id,
        user_id: data.user_id,
        main_schet_id: data.main_schet_id,
      });

      let dates;

      dates = await KassaSaldoService.createSaldoDate({
        ...data,
        client,
      });

      if (
        new Date(data.doc_date).getFullYear() !==
          new Date(data.old_data.doc_date).getFullYear() ||
        new Date(data.doc_date).getMonth() + 1 !==
          new Date(data.old_data.doc_date).getMonth() + 1
      ) {
        dates = dates.concat(
          await KassaSaldoService.createSaldoDate({
            ...data,
            doc_date: data.old_data.doc_date,
            client,
          })
        );
      }

      const uniqueDates = dates.filter(
        (item, index, self) =>
          index ===
          self.findIndex((t) => t.year === item.year && t.month === item.month)
      );

      return { doc, dates: uniqueDates };
    });

    return result;
  }

  static async delete(data) {
    const result = await db.transaction(async (client) => {
      const doc = await KassaPrixodDB.delete([data.id], client);

      const dates = await KassaSaldoService.createSaldoDate({
        ...data,
        client,
      });

      return { doc, dates };
    });

    return result;
  }
};
