const { db } = require(`@db/index`);
exports.OdinoxDB = class {
  static async getSmeta(params) {
    const query = `--sql
      SELECT
        s.id,
        s.smeta_name,
        s.smeta_number,
        s.group_number,
        row_to_json(sg) AS smeta_grafik
      FROM smeta s
      LEFT JOIN smeta_grafik sg 
        ON sg.smeta_id = s.id 
        AND sg.main_schet_id = $2 
        AND sg.isdeleted = false
        AND sg.year = $3
      LEFT JOIN users u 
        ON u.id = sg.user_id
      LEFT JOIN regions r 
        ON r.id = u.region_id 
        AND r.id = $1
      WHERE 
        s.isdeleted = false
        AND s.smeta_number IS NOT NULL
        AND s.smeta_number != '';
    `;

    const result = await db.query(query, params);

    return result;
  }

  static async getOdinoxType(params) {
    const query = `SELECT * FROM odinox_type ORDER BY sort_order`;

    const result = await db.query(query, params);

    return result;
  }

  static getJur1Data(data) {
    const query = `--sql
      SELECT
      FROM bank_prixod_child ch
      JOIN spravochnik_operatsii op ON op.id = ch.spravochnik_operatsii_id
    `;
  }
};
