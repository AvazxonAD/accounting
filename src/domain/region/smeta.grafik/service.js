const { SmetaGrafikDB } = require("./db");
const { sum, HelperFunctions } = require("@helper/functions");
const { db } = require(`@db/index`);

exports.SmetaGrafikService = class {
  static now = new Date();

  static async getMain(data) {
    const result = await SmetaGrafikDB.getMain([
      0,
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

      await this.createChild({ ...data, parent_id: parent.id, client });

      if (order_number === 1) {
        const main_parent = await this.createParent({
          ...data,
          order_number: 0,
          client,
        });

        await this.createChild({ ...data, parent_id: main_parent.id, client });
      } else {
        const main_parent = await this.getMain({ ...data });

        await this.updateMain({ ...data, main_parent, client });
      }
    });
  }

  static async get(data) {
    const result = await SmetaGrafikDB.get(
      [data.region_id, data.main_schet_id, data.offset, data.limit],
      data.budjet_id,
      data.operator,
      data.year,
      data.search
    );

    return result;
  }

  static async getById(data, isdeleted) {
    const result = await SmetaGrafikDB.getById(
      [data.region_id, data.id, data.main_schet_id],
      isdeleted
    );
    return result;
  }

  static async update(data) {
    const itogo = sum(
      data.oy_1,
      data.oy_2,
      data.oy_3,
      data.oy_4,
      data.oy_5,
      data.oy_6,
      data.oy_7,
      data.oy_8,
      data.oy_9,
      data.oy_10,
      data.oy_11,
      data.oy_12
    );

    const result = await db.transaction(async (client) => {
      const grafik = await SmetaGrafikDB.update(
        [
          itogo,
          data.oy_1,
          data.oy_2,
          data.oy_3,
          data.oy_4,
          data.oy_5,
          data.oy_6,
          data.oy_7,
          data.oy_8,
          data.oy_9,
          data.oy_10,
          data.oy_11,
          data.oy_12,
          data.smeta_id,
          data.spravochnik_budjet_name_id,
          data.year,
          data.main_schet_id,
          this.now,
          data.id,
        ],
        client
      );

      return grafik;
    });

    return result;
  }

  static async delete(data) {
    await db.transaction(async (client) => {
      await SmetaGrafikDB.delete([data.id], client);
    });
  }
};
