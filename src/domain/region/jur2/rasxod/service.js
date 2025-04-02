const { db } = require("@db/index");
const { BankRasxodDB } = require("./db");
const { tashkentTime, HelperFunctions } = require("@helper/functions");
const { FeaturesService } = require(`@features/service`);

exports.BankRasxodService = class {
  static async import(data) {
    await db.transaction(async (client) => {
      for (let item of data.docs) {
        const summa = HelperFunctions.summaDoc(item.childs);

        const doc_num_object = await FeaturesService.getDocNum({
          tableName: "bank_rasxod",
          region_id: data.region_id,
          main_schet_id: data.main_schet_id,
          client,
        });

        const doc = await BankRasxodDB.create(
          [
            doc_num_object.doc_num,
            new Date(),
            summa,
            item.opisanie,
            item.idSpravochnikOrganization,
            null,
            data.main_schet_id,
            data.user_id,
            null,
            null,
            item.organizationByRaschetSchetId,
            item.organizationByRaschetSchetGaznaId,
            null,
            tashkentTime(),
            tashkentTime(),
          ],
          client
        );

        await this.createChild({
          childs: item.childs,
          client,
          docId: doc.id,
          user_id: data.user_id,
          main_schet_id: data.main_schet_id,
        });
      }
    });
  }

  static async payment(data) {
    const result = await db.transaction(async (client) => {
      const doc = await BankRasxodDB.payment([data.status, data.id], client);
      return doc;
    });

    return result;
  }

  static async fio(data) {
    const result = await BankRasxodDB.fio([data.region_id, data.main_schet_id]);

    const rukovoditelSet = new Set(result.map((item) => item.rukovoditel));
    const glavBuxgalterSet = new Set(result.map((item) => item.glav_buxgalter));
    const rukovoditel = Array.from(rukovoditelSet);
    const glav_buxgalter = Array.from(glavBuxgalterSet);

    return { glav_buxgalter, rukovoditel };
  }

  static async create(data) {
    const summa = HelperFunctions.summaDoc(data.childs);

    const result = await db.transaction(async (client) => {
      const doc = await BankRasxodDB.create(
        [
          data.doc_num,
          data.doc_date,
          summa,
          data.opisanie,
          data.id_spravochnik_organization,
          data.id_shartnomalar_organization,
          data.main_schet_id,
          data.user_id,
          data.rukovoditel,
          data.glav_buxgalter,
          data.organization_by_raschet_schet_id,
          data.organization_by_raschet_schet_gazna_id,
          data.shartnoma_grafik_id,
          tashkentTime(),
          tashkentTime(),
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

      return doc;
    });

    return result;
  }

  static async createChild(data) {
    const create_childs = [];
    for (let child of data.childs) {
      create_childs.push(
        child.spravochnikOperatsiiId || child.spravochnik_operatsii_id,
        child.summa,
        child.id_spravochnik_podrazdelenie,
        child.id_spravochnik_sostav,
        child.id_spravochnik_type_operatsii,
        data.main_schet_id,
        data.docId,
        data.user_id,
        child.main_zarplata_id,
        child.id_spravochnik_podotchet_litso,
        tashkentTime(),
        tashkentTime()
      );
    }

    const _values = HelperFunctions.paramsValues({
      params: create_childs,
      column_count: 12,
    });

    await BankRasxodDB.createChild(create_childs, _values, data.client);
  }

  static async get(data) {
    const result = await BankRasxodDB.get(
      [
        data.main_schet_id,
        data.region_id,
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
    const result = await BankRasxodDB.getById(
      [data.main_schet_id, data.region_id, data.id],
      data.isdeleted
    );

    return result;
  }

  static async update(data) {
    const summa = HelperFunctions.summaDoc(data.childs);

    const result = await db.transaction(async (client) => {
      const doc = await BankRasxodDB.update(
        [
          data.doc_num,
          data.doc_date,
          summa,
          data.opisanie,
          data.id_spravochnik_organization,
          data.id_shartnomalar_organization,
          data.rukovoditel,
          data.glav_buxgalter,
          data.organization_by_raschet_schet_id,
          data.organization_by_raschet_schet_gazna_id,
          data.shartnoma_grafik_id,
          tashkentTime(),
          data.id,
        ],
        client
      );

      await BankRasxodDB.deleteChild([doc.id], client);

      await this.createChild({
        childs: data.childs,
        client,
        docId: doc.id,
        user_id: data.user_id,
        main_schet_id: data.main_schet_id,
      });

      return doc;
    });

    return result;
  }

  static async delete(data) {
    const result = await db.transaction(async (client) => {
      const doc = await BankRasxodDB.delete([data.id], client);

      return doc;
    });

    return result;
  }
};
