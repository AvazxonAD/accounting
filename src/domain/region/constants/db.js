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
};
