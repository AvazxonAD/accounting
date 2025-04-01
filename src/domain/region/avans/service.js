const { AvansDB } = require("./db");
const {
  childsSumma,
  HelperFunctions,
  tashkentTime,
} = require("@helper/functions");
const { db } = require("@db/index");

exports.AktService = class {
  static async get(data) {
    const result = await AvansDB.get(
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

  static async create(data) {
    const summa = childsSumma(data.childs);

    const result = await db.transaction(async (client) => {
      const doc = await AvansDB.create(
        [
          data.doc_num,
          data.doc_date,
          data.opisanie,
          summa,
          data.spravochnik_podotchet_litso_id,
          data.main_schet_id,
          data.user_id,
          tashkentTime(),
          tashkentTime(),
        ],
        client
      );

      await this.createChild({ ...data, docId: doc.id }, client);

      return doc;
    });

    return result;
  }

  static async createChild(data, client) {
    const create_childs = [];

    for (let item of data.childs) {
      create_childs.push(
        item.spravochnik_operatsii_id,
        item.summa,
        item.id_spravochnik_podrazdelenie,
        item.id_spravochnik_sostav,
        item.id_spravochnik_type_operatsii,
        data.main_schet_id,
        data.docId,
        data.user_id,
        tashkentTime(),
        tashkentTime()
      );
    }

    const _values = HelperFunctions.paramsValues({
      params: create_childs,
      column_count: 15,
    });

    await AvansDB.createChild(create_childs, _values, client);
  }

  static async getById(data) {
    const result = await AvansDB.getById(
      [data.region_id, data.main_schet_id, data.id],
      data.isdeleted
    );

    return result;
  }

  static async update(data) {
    const summa = childsSumma(data.childs);

    const result = await db.transaction(async (client) => {
      const doc = await AvansDB.update(
        [
          data.doc_num,
          data.doc_date,
          data.opisanie,
          summa,
          data.spravochnik_podotchet_litso_id,
          tashkentTime(),
          data.id,
        ],
        client
      );

      await AvansDB.deleteChild([data.id], client);

      await this.createChild({ ...data, docId: data.id }, client);

      return doc;
    });

    return result;
  }

  static async delete(data) {
    const result = await db.transaction(async (client) => {
      const docId = await AvansDB.delete([data.id], client);

      return docId;
    });

    return result;
  }
};
