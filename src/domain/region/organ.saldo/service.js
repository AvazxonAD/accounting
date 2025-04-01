const { db } = require("@db/index");
const { OrganSaldoDB } = require("./db");
const { HelperFunctions } = require("@helper/functions");

exports.OrganSaldoService = class {
  static async create(data) {
    const summa = HelperFunctions.saldoSumma(data);

    const result = await db.transaction(async (client) => {
      const doc = await OrganSaldoDB.create(
        [
          data.doc_num,
          data.doc_date,
          summa.prixod_summa,
          data.prixod,
          summa.rasxod_summa,
          data.rasxod,
          data.opisanie,
          data.organ_id,
          data.contract_id,
          data.main_schet_id,
          data.user_id,
          data.organ_account_number_id,
          data.organ_gazna_number_id,
          data.contract_grafik_id,
          new Date(),
        ],
        client
      );

      await this.createChild({
        childs: data.childs,
        client,
        parent_id: doc.id,
        user_id: data.user_id,
        main_schet_id: data.main_schet_id,
      });

      return doc;
    });

    return result;
  }

  static async createChild(data) {
    const create_childs = [];
    for (let child of data.childs) {
      create_childs.push(
        child.operatsii_id,
        child.summa,
        child.podraz_id,
        child.sostav_id,
        child.type_operatsii_id,
        data.main_schet_id,
        data.parent_id,
        data.user_id,
        new Date()
      );
    }

    const _values = HelperFunctions.paramsValues({
      params: create_childs,
      column_count: 9,
    });

    if (create_childs.length) {
      await OrganSaldoDB.createChild(create_childs, _values, data.client);
    }
  }

  static async get(data) {
    const result = await OrganSaldoDB.get(
      [
        data.region_id,
        data.main_schet_id,
        data.from,
        data.to,
        data.offset,
        data.limit,
      ],
      data.search
    );

    let page_prixod_summa = 0;
    let page_rasxod_summa = 0;
    result.data.forEach((item) => {
      page_prixod_summa += item.prixod_summa;
      page_rasxod_summa += item.rasxod_summa;
    });

    return { ...result, page_prixod_summa, page_rasxod_summa };
  }

  static async getById(data) {
    const result = await OrganSaldoDB.getById(
      [data.region_id, data.main_schet_id, data.id],
      data.isdeleted
    );

    return result;
  }

  static async update(data) {
    const summa = HelperFunctions.saldoSumma(data);

    const result = await db.transaction(async (client) => {
      const doc = await OrganSaldoDB.update(
        [
          data.doc_num,
          data.doc_date,
          summa.prixod_summa,
          data.prixod,
          summa.rasxod_summa,
          data.rasxod,
          data.opisanie,
          data.organ_id,
          data.contract_id,
          data.organ_account_number_id,
          data.organ_gazna_number_id,
          data.contract_grafik_id,
          new Date(),
          data.id,
        ],
        client
      );

      const create_childs = [];

      for (let child of data.old_data.childs) {
        const check = data.childs.find((item) => item.id === child.id);
        if (!check) {
          await OrganSaldoDB.deleteChild([child.id], client);
        }
      }

      for (let child of data.childs) {
        if (!child.id) {
          create_childs.push(child);
        } else {
          await OrganSaldoDB.updateChild(
            [
              child.operatsii_id,
              child.summa,
              child.podraz_id,
              child.sostav_id,
              child.type_operatsii_id,
              child.main_schet_id,
              data.user_id,
              new Date(),
              child.id,
            ],
            client
          );
        }
      }

      await this.createChild({
        childs: create_childs,
        client,
        parent_id: doc.id,
        user_id: data.user_id,
        main_schet_id: data.main_schet_id,
      });

      return doc;
    });

    return result;
  }

  static async delete(data) {
    const result = await db.transaction(async (client) => {
      const doc = await OrganSaldoDB.delete([data.id], client);

      return doc;
    });

    return result;
  }
};
