const { db } = require(`@db/index`);
exports.OdinoxDB = class {
  static async getSmeta(params) {
    const query = `--sql
      SELECT
        s.*
      FROM smeta_grafik s
      JOIN users u ON u.id = s.user_id
      JOIN regions r ON r.id = u.region_id
      WHERE s.region_id = $1
        AND s.main_schet_id = $2
        AND s.isdeleted = false
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
