const { db } = require(`@db/index`);
exports.OdinoxDB = class {
  static async getSmeta(params) {
    const query = `--sql
      SELECT
      
      FROM smeta_grafik s
      JOIN users u ON u.id = s.user_id
      JOIN regions r ON r.id = u.region_id
      
    `;

    const result = await db.query(query, params);

    return result;
  }

  static async getOdinoxType(params) {
    const query = `SELECT * FROM odinox_type ORDER BY sort_order`;

    const result = await db.query(query, params);

    return result;
  }
};
