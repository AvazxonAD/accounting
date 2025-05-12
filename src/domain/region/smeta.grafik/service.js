const { SmetaGrafikDB } = require("./db");
const { sum, HelperFunctions } = require("@helper/functions");
const { db } = require(`@db/index`);

exports.SmetaGrafikService = class {
  static now = new Date();

  static async getByOrderNumber(data) {
    const result = await SmetaGrafikDB.getByOrderNumber([
      data.order_number,
      data.year,
      data.main_schet_id,
      data.region_id,
    ]);

    return result;
  }

  static async updateMain(data) {
    for (let smeta of data.smetas) {
      const itogo = HelperFunctions.smetaSum(smeta);

      const check = data.main_parent.smetas.find(
        (item) => item.smeta_id === smeta.smeta_id
      );

      if (check) {
        await SmetaGrafikDB.updateMain(
          [
            itogo,
            smeta.oy_1,
            smeta.oy_2,
            smeta.oy_3,
            smeta.oy_4,
            smeta.oy_5,
            smeta.oy_6,
            smeta.oy_7,
            smeta.oy_8,
            smeta.oy_9,
            smeta.oy_10,
            smeta.oy_11,
            smeta.oy_12,
            this.now,
            smeta.smeta_id,
            data.main_parent.id,
          ],
          data.client
        );
      } else {
        await SmetaGrafikDB.create(
          [
            smeta.smeta_id,
            data.user_id,
            itogo,
            smeta.oy_1,
            smeta.oy_2,
            smeta.oy_3,
            smeta.oy_4,
            smeta.oy_5,
            smeta.oy_6,
            smeta.oy_7,
            smeta.oy_8,
            smeta.oy_9,
            smeta.oy_10,
            smeta.oy_11,
            smeta.oy_12,
            data.main_parent.year,
            data.main_parent.main_schet_id,
            data.main_parent.id,
            data.main_parent.order_number,
            this.now,
            this.now,
          ],
          data.client
        );
      }
    }

    for (let item of data.main_parent.smetas) {
      const check = data.smetas.find(
        (smeta) => smeta.smeta_id === item.smeta_id
      );

      if (!check) {
        await SmetaGrafikDB.deleteMain(
          [item.smeta_id, data.main_parent.id],
          data.client
        );
      }
    }
  }

  static async createChild(data) {
    for (let smeta of data.smetas) {
      const itogo = HelperFunctions.smetaSum(smeta);

      await SmetaGrafikDB.create(
        [
          smeta.smeta_id,
          data.user_id,
          itogo,
          smeta.oy_1,
          smeta.oy_2,
          smeta.oy_3,
          smeta.oy_4,
          smeta.oy_5,
          smeta.oy_6,
          smeta.oy_7,
          smeta.oy_8,
          smeta.oy_9,
          smeta.oy_10,
          smeta.oy_11,
          smeta.oy_12,
          data.year,
          data.main_schet_id,
          data.parent_id,
          data.parent.order_number,
          this.now,
          this.now,
        ],
        data.client
      );
    }
  }

  static async createParent(data) {
    const parent = await SmetaGrafikDB.createParent(
      [
        data.user_id,
        data.year,
        data.main_schet_id,
        data.order_number,
        data.command,
        this.now,
        this.now,
      ],
      data.client
    );

    return parent;
  }

  static async create(data) {
    await db.transaction(async (client) => {
      const order_number = await SmetaGrafikDB.getOrderNumber([
        data.year,
        data.main_schet_id,
      ]);

      const parent = await this.createParent({
        ...data,
        order_number,
        client,
      });

      await this.createChild({ ...data, parent_id: parent.id, parent, client });

      if (order_number === 1) {
        const main_parent = await this.createParent({
          ...data,
          order_number: 0,
          client,
        });

        await this.createChild({
          ...data,
          parent_id: main_parent.id,
          parent: main_parent,
          client,
        });
      } else {
        const main_parent = await this.getByOrderNumber({
          ...data,
          order_number: 0,
        });

        await this.updateMain({ ...data, main_parent, client });
      }
    });
  }

  static async getEnd(data) {
    const result = await SmetaGrafikDB.getEnd([
      data.region_id,
      data.year,
      data.main_schet_id,
    ]);

    return result;
  }

  static async get(data) {
    const result = await SmetaGrafikDB.get(
      [data.region_id, data.main_schet_id, data.offset, data.limit],
      data.year
    );

    const end = await this.getEnd({ ...data });

    if (end) {
      for (let item of result.data) {
        item.updated_at = item.id === end.id ? true : false;
        item.isdeleted = item.id === end.id ? true : false;
      }
    } else {
      for (let item of result.data) {
        item.updated_at = false;
        item.isdeleted = false;
      }
    }

    return result;
  }

  static async getById(data, isdeleted) {
    const result = await SmetaGrafikDB.getById(
      [data.region_id, data.id, data.main_schet_id],
      isdeleted
    );

    const end = await this.getEnd({ ...data });
    if (end && result) {
      result.updated_at = result.id === end.id ? true : false;
      result.isdeleted = result.id === end.id ? true : false;
    }

    return result;
  }

  static async update(data) {
    const result = await db.transaction(async (client) => {
      await SmetaGrafikDB.updateParent([data.command, data.id], client);
      for (let smeta of data.smetas) {
        const itogo = HelperFunctions.smetaSum(smeta);

        if (smeta.id) {
          await SmetaGrafikDB.update(
            [
              itogo,
              smeta.oy_1,
              smeta.oy_2,
              smeta.oy_3,
              smeta.oy_4,
              smeta.oy_5,
              smeta.oy_6,
              smeta.oy_7,
              smeta.oy_8,
              smeta.oy_9,
              smeta.oy_10,
              smeta.oy_11,
              smeta.oy_12,
              smeta.smeta_id,
              this.now,
              smeta.id,
            ],
            client
          );
        } else {
          await SmetaGrafikDB.create(
            [
              smeta.smeta_id,
              data.user_id,
              itogo,
              smeta.oy_1,
              smeta.oy_2,
              smeta.oy_3,
              smeta.oy_4,
              smeta.oy_5,
              smeta.oy_6,
              smeta.oy_7,
              smeta.oy_8,
              smeta.oy_9,
              smeta.oy_10,
              smeta.oy_11,
              smeta.oy_12,
              data.old_data.year,
              data.old_data.main_schet_id,
              data.old_data.order_number,
              data.id,
              this.now,
              this.now,
            ],
            client
          );
        }
      }

      for (let smeta of data.old_data.smetas) {
        const check = data.smetas.find((item) => smeta.id === item.id);
        if (!check) {
          await SmetaGrafikDB.deleteChild([smeta.id], client);
        }
      }

      const main_parent = await this.getByOrderNumber({
        ...data,
        year: data.old_data.year,
        order_number: 0,
      });

      await this.updateMain({ ...data, main_parent, client });
    });

    return result;
  }

  static async delete(data) {
    const main_parent = await this.getByOrderNumber({
      ...data,
      year: data.old_data.year,
      order_number: 0,
    });

    await db.transaction(async (client) => {
      await SmetaGrafikDB.delete([data.id], client);
      if (data.old_data.order_number === 1) {
        await SmetaGrafikDB.delete([main_parent.id], client);
      } else {
        const doc = await this.getByOrderNumber({
          ...data,
          year: data.old_data.year,
          order_number: data.old_data.order_number - 1,
        });

        await this.updateMain({
          ...data,
          smetas: doc.smetas,
          main_parent,
          client,
        });
      }
    });
  }
};
