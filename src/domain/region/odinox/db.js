exports.OdinoxDB = class {
  static async getSmeta(params) {
    const query = `--sql
      SELECT 
          DISTINCT ON (schet)
          schet,
          0 AS prixod,
          0 AS rasxod
      FROM spravochnik_operatsii 
      WHERE isdeleted = false
         AND (
            type_schet = 'akt' OR 
            type_schet = 'bank_prixod' OR 
            type_schet = 'avans_otchet' OR 
            type_schet = 'kassa_prixod' OR 
            type_schet = 'kassa_rasxod' OR 
            type_schet = 'jur3' OR 
            type_schet = 'jur4' OR 
            type_schet = 'bank_rasxod' OR 
            type_schet = 'show_service'
          )
      
      UNION
      
      SELECT
          DISTINCT ON (schet)
          schet,
          0 AS prixod,
          0 AS rasxod
      FROM group_jur7 
      WHERE isdeleted = false

      UNION 
      
      SELECT
          DISTINCT ON (schet)
          schet,
          0 AS prixod,
          0 AS rasxod
      FROM jur_schets 
      WHERE isdeleted = false
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
