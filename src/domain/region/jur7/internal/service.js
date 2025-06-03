const { db } = require("@db/index");
const { InternalDB } = require("./db");
const { tashkentTime, returnParamsValues, HelperFunctions } = require("@helper/functions");
const { SaldoDB } = require("@jur7_saldo/db");
const { Jur7SaldoService } = require("@jur7_saldo/service");

exports.Jur7InternalService = class {
  static async delete(data) {
    const result = await db.transaction(async (client) => {
      const doc = await InternalDB.delete([data.id], client);

      const dates = await Jur7SaldoService.createSaldoDate({
        ...data,
        doc_date: data.old_data.doc_date,
        client,
      });

      return { dates, doc };
    });

    return result;
  }

  static async create(data) {
    const summa = data.childs.reduce((acc, child) => acc + child.summa, 0);

    const result = await db.transaction(async (client) => {
      const doc = await InternalDB.create(
        [
          data.user_id,
          data.doc_num,
          data.doc_date,
          data.j_o_num,
          data.opisanie,
          data.doverennost,
          summa,
          data.kimdan_id,
          data.kimdan_name,
          data.kimga_id,
          data.kimga_name,
          data.budjet_id,
          data.main_schet_id,
          tashkentTime(),
          tashkentTime(),
        ],
        client
      );

      await this.createChild({ ...data, docId: doc.id, client, doc: doc });

      const dates = await Jur7SaldoService.createSaldoDate({
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
        child.naimenovanie_tovarov_jur7_id,
        child.kol,
        child.sena,
        child.summa,
        child.debet_schet,
        child.debet_sub_schet,
        child.kredit_schet,
        child.kredit_sub_schet,
        child.data_pereotsenka,
        data.user_id,
        data.docId,
        data.budjet_id,
        child.iznos,
        child.iznos_summa,
        child.iznos_schet,
        child.iznos_sub_schet,
        child.iznos_start,
        tashkentTime(),
        tashkentTime()
      );

      const month = new Date(data.doc.doc_date).getMonth() + 1;
      const year = new Date(data.doc.doc_date).getFullYear();

      let month_iznos_summa = 0;

      if (child.iznos) {
        // month_iznos_summa = child.sena * (child.product.group.iznos_foiz / 100);
        // month_iznos_summa =
        //   month_iznos_summa >= child.sena ? child.sena : month_iznos_summa;
      }

      await SaldoDB.create(
        [
          data.user_id,
          child.naimenovanie_tovarov_jur7_id,
          0,
          0,
          0,
          month,
          year,
          `${year}-${String(month).padStart(2, "0")}-01`,
          data.doc.doc_date,
          data.doc.doc_num,
          data.kimga_id,
          data.region_id,
          data.docId,
          child.iznos,
          0,
          child.iznos_schet,
          child.iznos_sub_schet,
          0,
          child.iznos_start,
          month_iznos_summa,
          child.debet_schet,
          child.debet_sub_schet,
          child.kredit_schet,
          child.kredit_sub_schet,
          data.budjet_id,
          data.main_schet_id,
          "prixod",
          tashkentTime(),
          tashkentTime(),
        ],
        data.client
      );
    }

    const _values = returnParamsValues(create_childs, 19);

    await InternalDB.createChild(create_childs, _values, data.client);
  }

  static async update(data) {
    const summa = data.childs.reduce((acc, child) => acc + child.summa, 0);

    const result = await db.transaction(async (client) => {
      const doc = await InternalDB.update(
        [
          data.doc_num,
          data.doc_date,
          data.j_o_num,
          data.opisanie,
          data.doverennost,
          summa,
          data.kimdan_id,
          data.kimga_id,
          data.kimga_name,
          data.kimdan_name,
          tashkentTime(),
          data.id,
        ],
        client
      );

      await InternalDB.deleteRasxodChild([data.id], client);

      await this.createChild({ ...data, docId: data.id, client, doc: doc });

      const date = HelperFunctions.getSmallDate({
        date1: data.doc_date,
        date2: data.old_data.doc_date,
      });

      const dates = await Jur7SaldoService.createSaldoDate({
        ...data,
        doc_date: date.date,
        client,
      });

      return { doc, dates };
    });

    return result;
  }

  static async getById(data) {
    const result = await InternalDB.getById([data.region_id, data.id, data.main_schet_id], data.isdeleted);
    return result;
  }

  static async get(data) {
    const result = await InternalDB.get(
      [data.region_id, data.from, data.to, data.main_schet_id, data.offset, data.limit],
      data.search,
      data.order_by,
      data.order_type
    );

    return result;
  }
};
