const { db } = require(`@db/index`);
exports.RealCostDB = class {
  static async getSmeta(params) {
    const query = `--sql
      SELECT
        DISTINCT ON(s.smeta_number)
        s.id,
        s.id AS smeta_id,
        s.smeta_name,
        s.smeta_number,
        s.group_number,
        row_to_json(sg) AS smeta_grafik,
        s.id AS smeta_id
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

  static async createChild(params, client) {
    const query = `--sql
            INSERT INTO real_cost_child (
                smeta_id,
                month_summa,
                year_summa,
                parent_id,
                created_at,
                updated_at
            )
            VALUES ($1, $2, $3, $4, $5, $6)

            RETURNING id
        `;

    const result = await client.query(query, params);

    return result.rows[0];
  }

  static async createSubChild(params, client) {
    const query = `--sql
      INSERT INTO real_cost_sub_child (
        contract_grafik_id,
        contract_grafik_summa,
        rasxod_summa,
        remaining_summa,
        is_year,
        parent_id,
        created_at,
        updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `;

    await client.query(query, params);
  }

  static async create(params, client) {
    const query = `--sql
      INSERT INTO real_cost (
          status,
          accept_time,
          send_time,
          user_id,
          year,
          month,
          main_schet_id,
          created_at,
          updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id
    `;

    const result = await client.query(query, params);

    return result.rows[0];
  }

  static async byMonth(params, month = null, by_year = null) {
    function monthFilter(param, column, operator) {
      params.push(param);
      return `AND EXTRACT(MONTH FROM ${column}.doc_date) ${operator} $${params.length}`;
    }

    const query = `--sql
      SELECT
        cg.*,
        cg.id AS contract_grafik_id,
        c.doc_num,
        c.doc_date,
        so.name,
        so.inn,
        COALESCE(
          (
            (
              SELECT 
                COALESCE(SUM(ch.summa))
              FROM bank_rasxod_child ch
              JOIN bank_rasxod d ON d.id = ch.id_bank_rasxod 
              WHERE d.isdeleted = false
                AND ch.isdeleted = false
                AND d.shartnoma_grafik_id = cg.id
                AND d.id_spravochnik_organization = c.spravochnik_organization_id
                AND d.id_shartnomalar_organization = cg.id_shartnomalar_organization 
                AND d.main_schet_id = $2
                AND EXTRACT(YEAR FROM d.doc_date) = $3
                ${month ? monthFilter(month, "d", "=") : ""}
                ${by_year ? monthFilter(by_year, "d", "<=") : ""}
            ) +
            (
              SELECT 
                COALESCE(SUM(ch.summa))
              FROM kassa_rasxod_child ch
              JOIN kassa_rasxod d ON d.id = ch.kassa_rasxod_id 
              WHERE d.isdeleted = false
                AND ch.isdeleted = false
                AND d.contract_grafik_id = cg.id
                AND d.organ_id = c.spravochnik_organization_id
                AND d.contract_id = cg.id_shartnomalar_organization
                AND d.main_schet_id = $2
                AND EXTRACT(YEAR FROM d.doc_date) = $3
                ${month ? monthFilter(month, "d", "=") : ""}
                ${by_year ? monthFilter(by_year, "d", "<=") : ""}
            )
        ), 0)::FLOAT AS rasxod_summa
      FROM shartnoma_grafik cg
      JOIN shartnomalar_organization c ON c.id = cg.id_shartnomalar_organization
      JOIN spravochnik_organization so ON so.id = c.spravochnik_organization_id
      JOIN users u ON u.id = cg.user_id
      JOIN regions r ON r.id = u.region_id
      WHERE r.id = $1 
        AND cg.isdeleted = false
        AND cg.main_schet_id = $2
        AND cg.year = $3
        AND cg.smeta_id = $4
        AND EXTRACT(YEAR FROM c.doc_date) = $3
        ${month ? monthFilter(month, "c", "=") : ""}
        ${by_year ? monthFilter(by_year, "c", "<=") : ""}
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
      FROM real_cost d
      JOIN main_schet m ON m.id = d.main_schet_id
      JOIN users u ON u.id = d.user_id
      LEFT JOIN users ua ON ua.id = d.accept_user_id
      JOIN regions r ON r.id = u.region_id
      WHERE r.id = $1
        AND d.id = $2
        AND d.main_schet_id = $3
        ${!isdeleted ? "AND d.isdeleted = false" : ""}
    `;

    const result = await db.query(query, params);

    return result[0];
  }

  // old
  static async update(params, client) {
    const query = `--sql
      UPDATE real_cost
      SET
        send_time = $1,
        status = $2,
        updated_at = $3
      WHERE id = $4
      RETURNING id 
    `;

    const result = await client.query(query, params);

    return result.rows[0];
  }

  static async getreal_costType(params) {
    const query = `SELECT *, id AS type_id FROM real_cost_type ORDER BY sort_order`;

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
        AND EXTRACT(MONTH FROM d.doc_date) = ANY($2)
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
        AND EXTRACT(MONTH FROM d.doc_date) = ANY($2)
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
        AND EXTRACT(MONTH FROM d.doc_date) = ANY($2)
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
        AND EXTRACT(MONTH FROM d.doc_date) = ANY($2)
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
        AND EXTRACT(MONTH FROM d.doc_date) = ANY($2)
        AND r.id = $3
        AND d.main_schet_id = $4
        
      GROUP BY op.sub_schet
    `;

    const result = await db.query(query, params);

    return result;
  }

  static async getEnd(params) {
    const query = `--sql
      SELECT
          d.*
        FROM real_cost d
        JOIN main_schet m ON m.id = d.main_schet_id
        JOIN users u ON u.id = d.user_id
        JOIN regions r ON r.id = u.region_id
        WHERE r.id = $1
          AND d.main_schet_id = $2
          AND d.isdeleted = false
        ORDER by d.year DESC, d.month DESC
      LIMIT 1
    `;

    const result = await db.query(query, params);

    return result[0];
  }

  static async get(params, year = null) {
    const year_filter = ``;

    if (year) {
      params.push(year);
      year_filter = `AND d.year = $${params.length}`;
    }

    const query = `--sql
      WITH data AS (
         SELECT
          d.*,
          ua.fio AS                 accept_user_fio,
          ua.login AS               accept_user_login
        FROM real_cost d
        JOIN main_schet m ON m.id = d.main_schet_id
        JOIN users u ON u.id = d.user_id
        LEFT JOIN users ua ON ua.id = d.accept_user_id
        JOIN regions r ON r.id = u.region_id
        WHERE r.id = $1
          AND d.main_schet_id = $2
          AND d.isdeleted = false
          ${year_filter}
        ORDER by d.year DESC, d.month DESC

        OFFSET $3 LIMIT $4
      )

      SELECT
        COALESCE(JSON_AGG(row_to_json(data)), '[]'::JSON) AS data,
        (
           SELECT
            COALESCE(COUNT(d.id), 0)
          FROM real_cost d
          JOIN main_schet m ON m.id = d.main_schet_id
          JOIN users u ON u.id = d.user_id
          JOIN regions r ON r.id = u.region_id
          WHERE r.id = $1
            AND d.main_schet_id = $2
            ${year_filter}
            AND d.isdeleted = false
        )::INTEGER AS total

      FROM data
    `;

    const result = await db.query(query, params);

    return result[0];
  }

  static async delete(params, client) {
    const query = `UPDATE real_cost SET isdeleted = true WHERE id = $1`;

    await client.query(query, params);
  }

  static async deleteChildByParentId(params, client) {
    const query = `UPDATE real_cost_child SET isdeleted = true WHERE parent_id = $1`;

    await client.query(query, params);
  }

  static async getByIdChild(params) {
    const query = `--sql
      SELECT
        ch.smeta_id,
        s.smeta_name,
        s.smeta_number,
        s.group_number,
        ch.month_summa::FLOAT,
        ch.year_summa::FLOAT
      FROM real_cost_child ch
      JOIN smeta s ON s.id = ch.smeta_id
      WHERE ch.isdeleted = false
        AND parent_id = $1
    `;

    const result = await db.query(query, params);

    return result;
  }

  static async getBySubChild(params) {
    const query = `
      
    `;
  }

  static async getByIdType(params) {
    const query = `SELECT * FROM real_cost_type WHERE id = $1 AND is_deleted = false`;

    const result = await db.query(query, params);

    return result[0];
  }

  static async checkCreateCount(params) {
    const query = `--sql
      SELECT
        d.*
      FROM real_cost d
      JOIN main_schet m ON m.id = d.main_schet_id
      JOIN users u ON u.id = d.user_id
      LEFT JOIN users ua ON ua.id = d.accept_user_id
      JOIN regions r ON r.id = u.region_id
      WHERE r.id = $1
        AND d.main_schet_id = $2
        AND d.isdeleted = false
    `;

    const result = await db.query(query, params);

    return result;
  }

  static async getByMonth(params) {
    const query = `--sql
      SELECT
        d.*
      FROM real_cost d
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
