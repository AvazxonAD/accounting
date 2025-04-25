const { ContractDB } = require("./db");
const { db } = require("@db/index");
const { HelperFunctions } = require("@helper/functions");

exports.ContractService = class {
  static async checkGrafik(data) {
    const result = await ContractDB.checkGrafik([data.grafik_id]);

    return result;
  }

  static async create(data) {
    const result = await db.transaction(async (client) => {
      const contract = await ContractDB.create(
        [
          data.doc_num,
          data.doc_date,
          data.summa,
          data.opisanie,
          data.user_id,
          data.spravochnik_organization_id,
          data.pudratchi_bool,
          data.main_schet_id,
        ],
        client
      );

      await this.createGrafik({ ...data, contract, client });

      return contract;
    });

    return result;
  }

  static async createGrafik(data) {
    const create_grafiks = [];
    for (let grafik of data.grafiks) {
      create_grafiks.push(
        data.contract.id,
        data.user_id,
        data.main_schet_id,
        new Date(data.contract.doc_date).getFullYear(),
        grafik.oy_1,
        grafik.oy_2,
        grafik.oy_3,
        grafik.oy_4,
        grafik.oy_5,
        grafik.oy_6,
        grafik.oy_7,
        grafik.oy_8,
        grafik.oy_9,
        grafik.oy_10,
        grafik.oy_11,
        grafik.oy_12,
        data.yillik_oylik,
        grafik.smeta_id,
        grafik.itogo
      );
    }

    const _values = HelperFunctions.paramsValues({
      params: create_grafiks,
      column_count: 19,
    });

    await ContractDB.createGrafik(create_grafiks, _values, data.client);
  }

  static async get(data) {
    const result = await ContractDB.get(
      [data.region_id, data.main_schet_id, data.offset, data.limit],
      data.organ_id,
      data.pudratchi_bool,
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
    const result = await ContractDB.getById(
      [data.region_id, data.id],
      data.isdeleted,
      data.main_schet_id,
      data.organ_id
    );

    return result;
  }

  static async getContractByOrganizations(data) {
    const result = await ContractDB.getContractByOrganizations(
      [data.region_id],
      data.organ_id
    );
    return result;
  }

  static async update(data) {
    const result = await db.transaction(async (client) => {
      const contract = await ContractDB.update(
        [
          data.doc_num,
          data.doc_date,
          data.summa,
          data.opisanie,
          data.spravochnik_organization_id,
          data.pudratchi_bool,
          data.yillik_oylik,
          data.id,
        ],
        client
      );
      const create_grafiks = [];

      for (let grafik of data.old_data.grafiks) {
        const check = data.grafiks.find((item) => item.id === grafik.id);
        if (!check) {
          await ContractDB.deleteGrafik([contract.id, grafik.id], client);
        }
      }

      for (let grafik of data.grafiks) {
        if (!grafik.id) {
          create_grafiks.push(grafik);
        } else {
          await ContractDB.updateGrafik(
            [
              grafik.oy_1,
              grafik.oy_2,
              grafik.oy_3,
              grafik.oy_4,
              grafik.oy_5,
              grafik.oy_6,
              grafik.oy_7,
              grafik.oy_8,
              grafik.oy_9,
              grafik.oy_10,
              grafik.oy_11,
              grafik.oy_12,
              new Date(contract.doc_date).getFullYear(),
              data.yillik_oylik,
              grafik.smeta_id,
              grafik.itogo,
              grafik.id,
            ],
            client
          );
        }
      }

      if (create_grafiks.length) {
        await this.createGrafik({
          ...data,
          grafiks: create_grafiks,
          contract,
          client,
        });
      }

      return contract;
    });

    return result;
  }

  static async delete(data) {
    const result = await db.transaction(async (client) => {
      const doc = await ContractDB.delete([data.id], client);

      return doc;
    });

    return result;
  }
};
