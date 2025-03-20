const { db } = require("@db/index");
const { MainBookDB } = require("./db");

exports.MainBookService = class {
  static async create(data) {
    const result = await db.transaction(async (client) => {
      const doc = await MainBookDB.create(
        [
          1,
          data.acsept_time,
          new Date(),
          data.user_id,
          data.year,
          data.month,
          data.budjet_id,
          new Date(),
          new Date(),
        ],
        client
      );

      await this.createChild({ ...data, client, parent_id: doc.id });

      return doc;
    });

    return result;
  }

  static async createChild(data) {
    for (let child of data.childs) {
      for (let sub_child of child.sub_childs) {
        await MainBookDB.createChild(
          [
            sub_child.schet,
            sub_child.prixod,
            sub_child.rasxod,
            data.user_id,
            data.parent_id,
            child.type,
            new Date(),
            new Date(),
          ],
          data.client
        );
      }
    }
  }

  static async get(data) {
    const result = await MainBookDB.get([
      data.region_id,
      data.offset,
      data.limit,
    ]);

    return result;
  }

  static async getById(data) {
    const result = await MainBookDB.getById(
      [data.region_id, data.id],
      data.isdeleted
    );

    return result;
  }

  static async getJur1Data(data) {
    const query = `
      SELECT 
    `;
  }
};
