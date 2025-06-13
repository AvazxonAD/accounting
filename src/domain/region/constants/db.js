const { db } = require("@db/index");

exports.ConstanstsDB = class {
  static async getPodpisType(params) {
    const query = `
      SELECT
        *
      FROM podpis_type
    `;

    const result = await db.query(query, params);

    return result;
  }

  static async getRegions(params) {
    const query = `SELECT * FROM _regions`;

    const result = await db.query(query, params);

    return result;
  }

  static async getByIdRegion(params) {
    const query = `SELECT * FROM _regions WHERE id = $1`;

    const result = await db.query(query, params);

    return result[0];
  }

  static async getDistricts(params, region_id = null) {
    let region_filter = ``;

    if (region_id) {
      params.push(region_id);
      region_filter = "WHERE region_id = $1";
    }

    const query = `SELECT * FROM districts ${region_filter}`;

    const result = await db.query(query, params);

    return result;
  }

  static async getByIdDistrict(params) {
    const query = `SELECT * FROM districts WHERE id = $1`;

    const result = await db.query(query, params);

    return result[0];
  }
};
