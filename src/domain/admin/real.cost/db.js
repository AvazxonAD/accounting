const { db } = require("@db/index");

exports.RealCostDB = class {
  static async update(params) {
    const query = `--sql
      UPDATE real_cost
        SET
          status = $1,
          accept_time = $2,
          accept_user_id = $3
      WHERE id = $4
      RETURNING id 
    `;

    const result = await db.query(query, params);

    return result[0];
  }

  static async get(params, year = null, main_schet_id = null, month = null) {
    const conditions = [];

    if (year) {
      params.push(year);
      conditions.push(`AND d.year = $${params.length}`);
    }

    if (main_schet_id) {
      params.push(main_schet_id);
      conditions.push(`d.main_schet_id = $${params.length}`);
    }

    if (month) {
      params.push(month);
      conditions.push(`d.month = $${params.length}`);
    }

    const where_clause = conditions.length ? conditions.join(" AND ") : "";

    const query = `--sql
      WITH data AS (
        SELECT
          d.id,
          d.status,
          d.accept_time,
          d.send_time,
          d.user_id,
          u.fio,
          u.login,
          d.year,
          d.month,
          d.main_schet_id,
          m.account_number,
          d.accept_user_id,
          ua.fio AS                 accept_user_fio,
          ua.login AS               accept_user_login,
          r.name AS                 region_name
        FROM real_cost d
        JOIN main_schet m ON m.id = d.main_schet_id
        JOIN users u ON u.id = d.user_id
        LEFT JOIN users ua ON ua.id = d.accept_user_id
        JOIN regions r ON r.id = u.region_id
        WHERE d.isdeleted = false
          ${where_clause}
        OFFSET $1 LIMIT $2 
      )
      SELECT
        COALESCE(JSON_AGG(ROW_TO_JSON(data)), '[]'::JSON) AS data,
        (
          SELECT
            COALESCE(COUNT(d.id), 0)
          FROM real_cost d
          JOIN users u ON u.id = d.user_id
          JOIN regions r ON r.id = u.region_id
          WHERE d.isdeleted = false
            ${where_clause}
        )::INTEGER AS total
      FROM data
    `;

    const result = await db.query(query, params);

    return result[0];
  }

  static async getById(params) {
    const query = `--sql
      SELECT
        d.id,
        d.status,
        d.accept_time,
        d.send_time,
        d.user_id,
        d.year,
        d.month,
        d.main_schet_id,
        m.account_number,
        d.accept_user_id,
        ua.fio AS                 accept_user_fio,
        ua.login AS               accept_user_login,
        r.name AS                 region_name
      FROM real_cost d
      JOIN main_schet m ON m.id = d.main_schet_id
      JOIN users u ON u.id = d.user_id
      LEFT JOIN users ua ON ua.id = d.accept_user_id
      JOIN regions r ON r.id = u.region_id
      WHERE d.id = $1
        AND d.isdeleted = false
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
        ch.year_summa::FLOAT
      FROM real_cost_child ch
      JOIN smeta s ON s.id = ch.smeta_id
      WHERE ch.isdeleted = false
        AND ch.parent_id = $1
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
          so.name,
          so.inn
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
          so.name,
          so.inn
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
};
