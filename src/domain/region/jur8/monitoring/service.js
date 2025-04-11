const { db } = require(`@db/index`);
const { Jur8MonitoringDB } = require("./db");
exports.Jur8MonitoringService = class {
  static now = new Date();

  static async delete(data) {
    const result = await db.transaction(async (client) => {
      const doc = await Jur8MonitoringDB.delete([data.id], client);

      return doc;
    });

    return result;
  }

  static async getById(data) {
    const result = await Jur8MonitoringDB.getById(
      [data.budjet_id, data.region_id, data.id],
      data.isdeleted
    );

    if (result) {
      result.childs = await Jur8MonitoringDB.getChilds(
        [data.id],
        data.isdeleted
      );

      for (let child of result.childs) {
        const doc = await Jur8MonitoringDB.getDoc(
          [child.doc_id],
          child.type_doc
        );

        if (doc) {
          child.doc_date = doc.doc_date;
          child.doc_num = doc.doc_num;
          child.opisanie = doc.opisanie;
          child.document_id = doc.document_id;
        } else {
          child.doc_date = null;
          child.doc_num = null;
          child.opisanie = null;
          child.document_id = null;
        }
      }
    }

    return result;
  }

  static async get(data) {
    const result = await Jur8MonitoringDB.get(
      [data.budjet_id, data.region_id, data.offset, data.limit],
      data.year,
      data.month
    );

    return result;
  }

  static async create(data) {
    const result = await db.transaction(async (client) => {
      const doc = await Jur8MonitoringDB.create(
        [data.year, data.month, data.budjet_id, data.user_id, this.now],
        client
      );

      await this.createChild({ ...data, doc, client });

      return doc;
    });

    return result;
  }

  static async createChild(data) {
    for (let child of data.childs) {
      await Jur8MonitoringDB.createChild(
        [
          child.schet_id,
          data.doc.id,
          child.summa,
          child.type_doc,
          child.doc_id,
          child.rasxod_schet,
          child.doc_num,
          child.doc_date,
          child.schet,
          this.now,
        ],
        data.client
      );
    }
  }

  static async getData(data) {
    const schets = data.schets.map((item) => item.schet);

    const docs = await Jur8MonitoringDB.getPrixod([
      data.budjet_id,
      data.from,
      data.to,
      schets,
      data.region_id,
    ]);

    let summa = 0;
    for (let doc of docs) {
      const schet = data.schets.find((item) => item.schet === doc.schet);
      doc.schet_id = schet.id;
      summa += doc.summa;
    }

    return { childs: docs, summa };
  }

  static async update(data) {
    const result = await db.transaction(async (client) => {
      const doc = await Jur8MonitoringDB.update(
        [data.year, data.month, this.now, data.id],
        client
      );

      await Jur8MonitoringDB.deleteChild([doc.id], client);

      await this.createChild({ ...data, doc, client });

      return doc;
    });

    return result;
  }
};
