const { DistancesDB } = require("./db");
const { db } = require(`@db/index`);

exports.DistancesService = class {
  static now = new Date();

  static async get(data) {
    const result = await DistancesDB.get(
      [data.offset, data.limit],
      data.search,
      data.from_district_id,
      data.to_district_id,
      data.from_region_id,
      data.to_region_id
    );

    return result;
  }

  static async getById(data) {
    const result = await DistancesDB.getById([data.id], data.isdeleted);

    return result;
  }

  static async getByDistrictId(data) {
    const result = await DistancesDB.getByDistrictId([data.from_district_id, data.to_district_id]);

    return result;
  }

  static async delete(data) {
    await db.transaction(async (client) => {
      await DistancesDB.delete([data.id], client);

      await DistancesDB.deleteByDistrictId([data.to_district_id, data.from_district_id], client);
    });
  }

  static async create(data) {
    const result = await db.transaction(async (client) => {
      const one = await DistancesDB.create([data.from_district_id, data.to_district_id, data.distance_km, this.now, this.now], client);
      const two = await DistancesDB.create([data.to_district_id, data.from_district_id, data.distance_km, this.now, this.now], client);

      return { one, two };
    });

    return result;
  }

  static async update(data) {
    const result = await db.transaction(async (client) => {
      const one = await DistancesDB.update([data.distance_km, this.now, data.id], client);

      const two = await DistancesDB.updateByDistrictId([data.distance_km, this.now, data.to_district_id, data.from_district_id], client);

      return { one, two };
    });

    return result;
  }
};
