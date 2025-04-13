const { ShowServiceDB } = require("./db");
const { db } = require(`@db/index`);
const { HelperFunctions } = require(`@helper/functions`);
const { Saldo159Service } = require("@saldo_159/service");

exports.ShowServiceService = class {
  static now = new Date();

  static async create(data) {
    const result = await db.transaction(async (client) => {
      const summa = HelperFunctions.returnSummaWithKol(data);

      const doc = await ShowServiceDB.create(
        [
          data.user_id,
          data.doc_num,
          data.doc_date,
          summa,
          data.opisanie,
          data.id_spravochnik_organization,
          data.shartnomalar_organization_id,
          data.main_schet_id,
          data.organization_by_raschet_schet_id,
          data.organization_by_raschet_schet_gazna_id,
          data.shartnoma_grafik_id,
          data.schet_id,
          this.now,
          this.now,
        ],
        client
      );

      await this.createChild({ ...data, doc, client });

      const dates = await Saldo159Service.createSaldoDate({
        ...data,
        client,
      });

      return { dates, doc };
    });

    return result;
  }

  static async createChild(data) {
    const result_childs = data.childs.map((item) => {
      item.summa = item.kol * item.sena;
      if (item.nds_foiz) {
        item.nds_summa = (item.nds_foiz / 100) * item.summa;
      } else {
        item.nds_summa = 0;
      }

      item.summa_s_nds = item.summa + item.nds_summa;
      item.created_at = this.now;
      item.updated_at = this.now;
      item.main_schet_id = data.main_schet_id;
      item.user_id = data.user_id;
      item.kursatilgan_hizmatlar_jur152_id = data.doc.id;
      return item;
    });

    await ShowServiceDB.createShowServiceChild(result_childs, data.client);
  }

  static async update(data) {
    const summa = HelperFunctions.returnSummaWithKol(data);

    const result = await db.transaction(async (client) => {
      const doc = await ShowServiceDB.update(
        [
          data.doc_num,
          data.doc_date,
          data.opisanie,
          summa,
          data.id_spravochnik_organization,
          data.shartnomalar_organization_id,
          this.now,
          data.organization_by_raschet_schet_id,
          data.organization_by_raschet_schet_gazna_id,
          data.shartnoma_grafik_id,
          data.schet_id,
          data.id,
        ],
        client
      );

      await ShowServiceDB.deleteShowServiceChild([data.id], client);

      await this.createChild({ ...data, doc, client });

      let dates;

      dates = await Saldo159Service.createSaldoDate({
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
          await Saldo159Service.createSaldoDate({
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
      const doc = await ShowServiceDB.delete([data.id], client);

      const dates = await Saldo159Service.createSaldoDate({
        ...data,
        client,
      });

      return { doc, dates };
    });

    return result;
  }
};
