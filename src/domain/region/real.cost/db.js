const { db } = require(`@db/index`);
exports.RealCostDB = class {
  static async getRasxodDocs(params) {
    const query = `--sql
      SELECT 
        d.id,
        d.doc_num,
        TO_CHAR(d.doc_date, 'YYYY-MM-DD') AS doc_date,
        op.schet,
        op.sub_schet,
        ch.summa::FLOAT,
        'bank_rasxod' AS type
      FROM bank_rasxod_child ch
      JOIN bank_rasxod d ON d.id = ch.id_bank_rasxod
      JOIN spravochnik_operatsii op ON op.id = ch.spravochnik_operatsii_id
      WHERE d.isdeleted = false
        AND ch.isdeleted = false
        AND d.main_schet_id = $1
        AND EXTRACT(YEAR FROM d.doc_date) = $2
        AND EXTRACT(MONTH FROM d.doc_date) = ANY($3)
        AND d.shartnoma_grafik_id = $4
        AND d.id_spravochnik_organization = $5
        AND d.id_shartnomalar_organization = $6 

      UNION ALL 
      
      SELECT
        d.id,
        d.doc_num,
        TO_CHAR(d.doc_date, 'YYYY-MM-DD') AS doc_date,
        op.schet,
        op.sub_schet,
        ch.summa::FLOAT,
        'kassa_rasxod' AS type
      FROM kassa_rasxod_child ch
      JOIN kassa_rasxod d ON d.id = ch.kassa_rasxod_id
      JOIN spravochnik_operatsii op ON op.id = ch.spravochnik_operatsii_id
      WHERE d.isdeleted = false
        AND ch.isdeleted = false
        AND d.main_schet_id = $1
        AND EXTRACT(YEAR FROM d.doc_date) = $2
        AND EXTRACT(MONTH FROM d.doc_date) = ANY($3)
        AND d.contract_grafik_id = $4
        AND d.organ_id = $5
        AND d.contract_id = $6
    `;

    const result = await db.query(query, params);

    return result;
  }

  static async getSmeta(params) {
    const query = `--sql
      SELECT
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
        AND sg.order_number = 0
      LEFT JOIN users u 
        ON u.id = sg.user_id
      LEFT JOIN regions r 
        ON r.id = u.region_id 
        AND r.id = $1
      WHERE 
        s.isdeleted = false
        AND s.smeta_number IS NOT NULL
        AND s.smeta_number != ''

      ORDER BY s.smeta_number
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
        c.spravochnik_organization_id,
        so.name AS organ_name,
        so.inn AS organ_inn,
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
    let year_filter = ``;

    if (year) {
      params.push(year);
      year_filter = `AND d.year = $${params.length}`;
    }

    const query = `--sql
      WITH data AS (
         SELECT
          d.*,
          ua.fio AS accept_user_fio,
          ua.login AS accept_user_login,
          u.fio,
          u.login   
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

  static async getByIdChild(params) {
    const query = `--sql
      SELECT
        ch.id,
        ch.smeta_id,
        s.smeta_name,
        s.smeta_number,
        s.group_number,
        ch.month_summa::FLOAT,
        ch.year_summa::FLOAT,
        row_to_json(sg) AS smeta_grafik
      FROM real_cost_child ch
      JOIN real_cost d ON d.id = ch.parent_id
      JOIN smeta s ON s.id = ch.smeta_id
      LEFT JOIN smeta_grafik sg 
        ON sg.smeta_id = s.id 
        AND sg.main_schet_id = d.main_schet_id 
        AND sg.isdeleted = false
        AND sg.year = d.year
        AND sg.order_number = 0
      LEFT JOIN users u 
        ON u.id = sg.user_id
      LEFT JOIN regions r 
        ON r.id = u.region_id 
        AND r.id = $1
      WHERE ch.isdeleted = false
        AND ch.parent_id = $1

      ORDER BY s.smeta_number
    `;

    const result = await db.query(query, params);

    return result;
  }

  static async getByMonthChild(params) {
    const query = `--sql
      WITH by_month AS (
        SELECT
          cg.*,
          ch.*,
          cg.id AS contract_grafik_id,
          c.doc_num,
          c.doc_date,
          so.name AS organ_name,
          so.inn AS organ_inn
        FROM real_cost_sub_child ch
        JOIN shartnoma_grafik cg ON cg.id = ch.contract_grafik_id
        JOIN shartnomalar_organization c ON c.id = cg.id_shartnomalar_organization
        JOIN spravochnik_organization so ON so.id = c.spravochnik_organization_id
        WHERE ch.isdeleted = false
          AND ch.parent_id = $1
          AND ch.is_year = false
      ),
      by_year AS (
        SELECT
          cg.*,
          ch.*,
          cg.id AS contract_grafik_id,
          c.doc_num,
          c.doc_date,
          so.name AS organ_name,
          so.inn AS organ_inn
        FROM real_cost_sub_child ch
        JOIN shartnoma_grafik cg ON cg.id = ch.contract_grafik_id
        JOIN shartnomalar_organization c ON c.id = cg.id_shartnomalar_organization
        JOIN spravochnik_organization so ON so.id = c.spravochnik_organization_id
        WHERE ch.isdeleted = false
          AND ch.parent_id = $1
          AND ch.is_year = true
      )
      SELECT
        (SELECT COALESCE(JSON_AGG(ROW_TO_JSON(by_month)), '[]'::JSON) FROM by_month) AS by_month,
        (SELECT COALESCE(JSON_AGG(ROW_TO_JSON(by_year)), '[]'::JSON) FROM by_year) AS by_year;
    `;

    const result = await db.query(query, params);

    return result[0];
  }

  static async deleteChildByParentId(params, client) {
    const queryParent = `UPDATE real_cost_child SET isdeleted = true WHERE id = ANY($1)`;
    const queryChild = `UPDATE real_cost_sub_child SET isdeleted = true WHERE parent_id = ANY($1)`;

    await client.query(queryParent, params);
    await client.query(queryChild, params);
  }

  static async delete(params, client) {
    const query = `UPDATE real_cost SET isdeleted = true WHERE id = $1`;

    await client.query(query, params);
  }

  static async update(params, client) {
    const query = `--sql
      UPDATE real_cost
      SET
        send_time = $1,
        status = $2,
        year = $3,
        month = $4,
        updated_at = $5
      WHERE id = $6
      RETURNING id 
    `;

    const result = await client.query(query, params);

    return result.rows[0];
  }
};
