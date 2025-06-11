const { db } = require("@db/index");

exports.MinimumWageDB = class {
  static async get(params) {
    const query = `--sql
      SELECT 
          mw.*
      FROM minimum_wage AS mw
      WHERE mw.isdeleted = false
    `;

    const result = await db.query(query, params);

    return result[0];
  }

  static async update(params) {
    const query = `--sql
      UPDATE minimum_wage SET summa = $1, updated_at = $2
    `;

    await db.query(query, params);
  }
};
