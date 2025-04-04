const { HelperFunctions } = require("@helper/functions");
const { MainSchetDB } = require("./db");
const { db } = require(`@db/index`);

exports.MainSchetService = class {
  static async getById(data, isdeleted) {
    const result = await MainSchetDB.getById(
      [data.region_id, data.id],
      isdeleted
    );
    return result;
  }

  static async get(data) {
    const result = await MainSchetDB.get(
      [data.region_id, data.budjet_id, data.offset, data.limit],
      data.search
    );

    return result;
  }

  static async checkSchet(data) {
    const result = await MainSchetDB.checkSchet(
      [data.budjet_id, data.region_id, data.column],
      data.column_name
    );

    return result;
  }

  static async checkJurSchet(data) {
    const result = await MainSchetDB.checkJurSchet([
      data.main_schet_id,
      data.type,
      data.schet,
    ]);

    return result;
  }

  static async create(data) {
    const result = await db.transaction(async (client) => {
      const doc = await MainSchetDB.create(
        [
          data.account_number,
          data.spravochnik_budjet_name_id,
          data.tashkilot_nomi,
          data.tashkilot_bank,
          data.tashkilot_mfo,
          data.tashkilot_inn,
          data.account_name,
          data.jur1_schet,
          data.jur2_schet,
          data.gazna_number,
          data.user_id,
        ],
        client
      );

      for (let schet of data.jur3_schets) {
        await MainSchetDB.createSchet(
          [
            schet.schet,
            "jur3",
            doc.id,
            HelperFunctions.tashkentTime(),
            HelperFunctions.tashkentTime(),
          ],
          client
        );
      }

      for (let schet of data.jur4_schets) {
        await MainSchetDB.createSchet(
          [
            schet.schet,
            "jur4",
            doc.id,
            HelperFunctions.tashkentTime(),
            HelperFunctions.tashkentTime(),
          ],
          client
        );
      }

      return doc;
    });

    return result;
  }

  static async getByAccount(data) {
    const result = await MainSchetDB.getByAccount([
      data.account_number,
      data.region_id,
    ]);

    return result;
  }

  static async update(data) {
    const result = await db.transaction(async (client) => {
      const doc = await MainSchetDB.update(
        [
          data.account_number,
          data.spravochnik_budjet_name_id,
          data.tashkilot_nomi,
          data.tashkilot_bank,
          data.tashkilot_mfo,
          data.tashkilot_inn,
          data.account_name,
          data.jur1_schet,
          data.jur2_schet,
          data.gazna_number,
          data.id,
        ],
        client
      );

      for (let jur3 of data.old_data.jur3_schets) {
        const check = await data.jur3_schets.find(
          (item) => item.id === jur3.id
        );
        if (!check) {
          await MainSchetDB.deleteJurSchet([jur3.id], client);
        }
      }

      for (let jur4 of data.old_data.jur4_schets) {
        const check = await data.jur4_schets.find(
          (item) => item.id === jur4.id
        );
        if (!check) {
          await MainSchetDB.deleteJurSchet([jur4.id], client);
        }
      }

      for (let jur3 of data.jur3_schets) {
        if (!jur3.id) {
          await MainSchetDB.createSchet(
            [
              jur3.schet,
              "jur3",
              doc.id,
              HelperFunctions.tashkentTime(),
              HelperFunctions.tashkentTime(),
            ],
            client
          );
        } else {
          await MainSchetDB.updateJurSchet([jur3.schet, jur3.id], client);
        }
      }

      for (let jur4 of data.jur4_schets) {
        if (!jur4.id) {
          await MainSchetDB.createSchet(
            [
              jur4.schet,
              "jur4",
              doc.id,
              HelperFunctions.tashkentTime(),
              HelperFunctions.tashkentTime(),
            ],
            client
          );
        } else {
          await MainSchetDB.updateJurSchet([jur4.schet, jur4.id], client);
        }
      }

      return doc;
    });

    return result;
  }

  static async delete(data) {
    const result = await db.transaction(async (client) => {
      const doc = await MainSchetDB.delete([data.id], client);

      return doc;
    });

    return result;
  }
};
