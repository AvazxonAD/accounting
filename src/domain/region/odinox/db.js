const { db } = require(`@db/index`);
exports.OdinoxDB = class {
  static async getSmeta(params) {
    const query = `--sql
      SELECT
        DISTINCT ON(s.smeta_number)
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

  static async getJur1Data(params) {
    const query = `--sql
      SELECT
        op.sub_schet,
        COALESCE(SUM(ch.summa), 0)::FLOAT AS summa
      FROM bank_prixod_child ch
      JOIN bank_prixod d ON d.id = ch.id_bank_prixod
      JOIN spravochnik_operatsii op ON op.id = ch.spravochnik_operatsii_id
      JOIN users AS u ON u.id = d.user_id
      JOIN regions AS r ON r.id = u.region_id
      WHERE EXTRACT(YEAR FROM d.doc_date) = $1
        AND EXTRACT(MONTH FROM d.doc_date) = $2
        AND r.id = $3
        AND d.main_schet_id = $4
        
      GROUP BY op.sub_schet
    `;

    const result = await db.query(query, params);

    return result;
  }

  static async getJur2Data(params) {
    const query = `--sql
      SELECT
        op.sub_schet,
        COALESCE(SUM(ch.summa), 0)::FLOAT AS summa
      FROM bank_rasxod_child ch
      JOIN bank_rasxod d ON d.id = ch.id_bank_rasxod
      JOIN spravochnik_operatsii op ON op.id = ch.spravochnik_operatsii_id
      JOIN users AS u ON u.id = d.user_id
      JOIN regions AS r ON r.id = u.region_id
      WHERE EXTRACT(YEAR FROM d.doc_date) = $1
        AND EXTRACT(MONTH FROM d.doc_date) = $2
        AND r.id = $3
        AND d.main_schet_id = $4
        
      GROUP BY op.sub_schet

      UNION ALL
      
      SELECT
        op.sub_schet,
        COALESCE(SUM(ch.summa), 0)::FLOAT AS summa
      FROM kassa_rasxod_child ch
      JOIN kassa_rasxod d ON d.id = ch.kassa_rasxod_id
      JOIN spravochnik_operatsii op ON op.id = ch.spravochnik_operatsii_id
      JOIN users AS u ON u.id = d.user_id
      JOIN regions AS r ON r.id = u.region_id
      WHERE EXTRACT(YEAR FROM d.doc_date) = $1
        AND EXTRACT(MONTH FROM d.doc_date) = $2
        AND r.id = $3
        AND d.main_schet_id = $4
        
      GROUP BY op.sub_schet
    `;

    const result = await db.query(query, params);

    return result;
  }

  static async getJur3Data(params) {
    const query = `--sql
      SELECT
        op.sub_schet,
        COALESCE(SUM(ch.summa), 0)::FLOAT AS summa
      FROM avans_otchetlar_jur4_child ch
      JOIN avans_otchetlar_jur4 d ON d.id = ch.avans_otchetlar_jur4_id
      JOIN spravochnik_operatsii op ON op.id = ch.spravochnik_operatsii_id
      JOIN users AS u ON u.id = d.user_id
      JOIN regions AS r ON r.id = u.region_id
      WHERE EXTRACT(YEAR FROM d.doc_date) = $1
        AND EXTRACT(MONTH FROM d.doc_date) = $2
        AND r.id = $3
        AND d.main_schet_id = $4
        
      GROUP BY op.sub_schet

      UNION ALL
      
      SELECT
        op.sub_schet,
        COALESCE(SUM(ch.summa), 0)::FLOAT AS summa
      FROM bajarilgan_ishlar_jur3_child ch
      JOIN bajarilgan_ishlar_jur3 d ON d.id = ch.bajarilgan_ishlar_jur3_id
      JOIN spravochnik_operatsii op ON op.id = ch.spravochnik_operatsii_id
      JOIN users AS u ON u.id = d.user_id
      JOIN regions AS r ON r.id = u.region_id
      WHERE EXTRACT(YEAR FROM d.doc_date) = $1
        AND EXTRACT(MONTH FROM d.doc_date) = $2
        AND r.id = $3
        AND d.main_schet_id = $4
        
      GROUP BY op.sub_schet
    `;

    const result = await db.query(query, params);

    return result;
  }

  static async getById(params, isdeleted = null) {
    const query = `--sql
      SELECT
        d.*,
        ua.fio AS                 accept_user_fio,
        ua.login AS               accept_user_login
      FROM odiox d
      JOIN main_schet m ON m.id = d.main_schet_id
      JOIN users u ON u.id = d.user_id
      LEFT JOIN users ua ON ua.id = d.accept_user_id
      JOIN regions r ON r.id = u.region_id
      WHERE r.id = $1
        AND d.id = $2
        ${!isdeleted ? "AND d.isdeleted = false" : ""}
    `;

    const result = await db.query(query, params);

    return result[0];
  }

  static async getByIdChild(params) {
    const query = `--sql
      SELECT
        DISTINCT ON (t.id, t.name, t.sort_order)
        t.id AS             type_id,
        t.name AS           type_name,
        (
          SELECT
            JSON_AGG(
              JSON_BUILD_OBJECT(
                'id', subch.id,
                'schet', subch.schet,
                'prixod', subch.prixod,
                'rasxod', subch.rasxod
              )
            )
          FROM odinox_child subch
          WHERE subch.isdeleted = false
            AND subch.type_id = t.id
            AND subch.parent_id = $1
        ) AS sub_childs
      FROM odinox_child ch
      JOIN odinox_type t ON t.id = ch.type_id
      WHERE ch.isdeleted = false
        AND parent_id = $1
      ORDER BY t.sort_order
    `;

    const result = await db.query(query, params);

    return result;
  }

  static async getByIdChild(params) {
    const query = `--sql
      
    `;

    const result = await db.query(query, params);

    return result;
  }

  static async getByMonth(params) {
    const query = `--sql
      SELECT
        d.*
      FROM odinox d
      JOIN main_schet m ON m.id = d.main_schet_id
      JOIN users u ON u.id = d.user_id
      LEFT JOIN users ua ON ua.id = d.accept_user_id
      JOIN regions r ON r.id = u.region_id
      WHERE r.id = $1
        AND d.year = $2
        AND d.month = $3
        AND d.main_schet_id = $4
        AND d.isdeleted = false
    `;

    const result = await db.query(query, params);

    return result[0];
  }
};
