const { db } = require("@db/index");
const { MainBookDB } = require("./db");
const { HelperFunctions } = require(`@helper/functions`);

exports.MainBookService = class {
  static async getUniqueSchets(data) {
    const result = await MainBookDB.getUniqueSchets([]);

    return result;
  }

  static async getMainSchets(data) {
    const result = await MainBookDB.getMainSchets([
      data.region_id,
      data.budjet_id,
    ]);

    return result;
  }

  static async delete(data) {
    await db.transaction(async (client) => {
      await MainBookDB.delete([data.id], client);

      await MainBookDB.deleteChildByParentId([data.id], client);
    });
  }

  static async getMainBookType(data) {
    const result = await MainBookDB.getMainBookType([]);

    return result;
  }

  static async create(data) {
    const result = await db.transaction(async (client) => {
      const doc = await MainBookDB.create(
        [
          1,
          data.accept_time,
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

  static async update(data) {
    const result = await db.transaction(async (client) => {
      const create_childs = [];

      // doc update
      const doc = await MainBookDB.update(
        [1, new Date(), data.year, data.month, new Date(), data.id],
        client
      );

      // old sub_child delete
      for (let child of data.old_data.childs) {
        for (let sub_child of child.sub_childs) {
          const check = data.childs.find((item) => {
            return item.sub_childs.find(
              (element) => element.id === sub_child.id
            );
          });

          if (!check) {
            await MainBookDB.deleteChild([sub_child.id], client);
          }
        }
      }

      // child update
      for (let child of data.childs) {
        for (let sub_child of child.sub_childs) {
          if (sub_child.id) {
            await MainBookDB.updateChild(
              [
                sub_child.schet,
                sub_child.prixod,
                sub_child.rasxod,
                new Date(),
                sub_child.id,
              ],
              client
            );
          } else {
            const index = create_childs.findIndex(
              (item) => item.type_id === child.type_id
            );

            if (index > 0) {
              create_childs[index].sub_childs.push(sub_child);
            } else {
              create_childs.push({
                type_id: child.type_id,
                sub_childs: [sub_child],
              });
            }
          }
        }
      }

      // child create
      if (create_childs.length > 0) {
        await this.createChild({
          ...data,
          childs: create_childs,
          client,
          parent_id: doc.id,
        });
      }

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
            child.type_id,
            new Date(),
            new Date(),
          ],
          data.client
        );
      }
    }
  }

  static async get(data) {
    const result = await MainBookDB.get(
      [data.region_id, data.budjet_id, data.offset, data.limit],
      data.year,
      data.month
    );

    return result;
  }

  static async getById(data) {
    const result = await MainBookDB.getById(
      [data.region_id, data.id],
      data.isdeleted
    );

    if (result) {
      result.childs = await MainBookDB.getByIdChild([data.id]);
    }

    return result;
  }

  static async getJur1Data(data) {
    for (let main_schet of data.main_schets) {
      let rasxod = 0;
      const rasxod_data = await MainBookDB.getJur1Rasxod(
        [data.region_id, main_schet.id],
        { from: data.from, to: data.to },
        data.operator
      );

      for (let schet of rasxod_data) {
        const index = data.schets.findIndex(
          (item) => item.schet === schet.schet
        );

        data.schets[index].prixod += schet.summa;
        rasxod += schet.summa;
      }

      // rasxod
      const index = data.schets.findIndex(
        (item) => item.schet === main_schet.jur1_schet
      );
      data.schets[index].rasxod += rasxod;
    }

    return data.schets;
  }

  static async getJur2Data(data) {
    for (let main_schet of data.main_schets) {
      let rasxod = 0;
      const rasxod_data = await MainBookDB.getJur2Rasxod(
        [data.region_id, main_schet.id],
        { from: data.from, to: data.to },
        data.operator
      );

      for (let schet of rasxod_data) {
        const index = data.schets.findIndex(
          (item) => item.schet === schet.schet
        );

        data.schets[index].prixod += schet.summa;
        rasxod += schet.summa;
      }

      const index = data.schets.findIndex(
        (item) => item.schet === main_schet.jur2_schet
      );
      data.schets[index].rasxod += rasxod;
    }

    return data.schets;
  }

  static async getJur3Data(data) {
    for (let main_schet of data.main_schets) {
      let rasxod = 0;
      const rasxod_data = await MainBookDB.getJur3Rasxod(
        [data.region_id, main_schet.id],
        { from: data.from, to: data.to },
        data.operator
      );

      for (let schet of rasxod_data) {
        const index = data.schets.findIndex(
          (item) => item.schet === schet.schet
        );

        data.schets[index].prixod += schet.summa;
        rasxod += schet.summa;
      }

      const index = data.schets.findIndex(
        (item) => item.schet === main_schet.jur3_schet
      );
      data.schets[index].rasxod += rasxod;
    }

    return data.schets;
  }

  static async getJur4Data(data) {
    for (let main_schet of data.main_schets) {
      let rasxod = 0;
      const rasxod_data = await MainBookDB.getJur4Rasxod(
        [data.region_id, main_schet.id],
        { from: data.from, to: data.to },
        data.operator
      );

      for (let schet of rasxod_data) {
        const index = data.schets.findIndex(
          (item) => item.schet === schet.schet
        );

        data.schets[index].prixod += schet.summa;
        rasxod += schet.summa;
      }

      const index = data.schets.findIndex(
        (item) => item.schet === main_schet.jur4_schet
      );
      data.schets[index].rasxod += rasxod;
    }

    return data.schets;
  }

  static async getFromOrToData(data) {
    data.schets = await this.getJur1Data({
      schets: data.schets,
      budjet_id: data.budjet_id,
      from: data.from,
      region_id: data.region_id,
      main_schets: data.main_schets,
      operator: "<",
    });

    data.schets = await this.getJur2Data({
      schets: data.schets,
      budjet_id: data.budjet_id,
      from: data.from,
      region_id: data.region_id,
      main_schets: data.main_schets,
      operator: "<",
    });

    data.schets = await this.getJur3Data({
      schets: data.schets,
      budjet_id: data.budjet_id,
      from: data.from,
      region_id: data.region_id,
      main_schets: data.main_schets,
      operator: "<",
    });

    data.schets = await this.getJur4Data({
      schets: data.schets,
      budjet_id: data.budjet_id,
      from: data.from,
      region_id: data.region_id,
      main_schets: data.main_schets,
      operator: "<",
    });

    return data.schets;
  }
};
