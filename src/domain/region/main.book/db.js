const { db } = require("@db/index");

exports.MainBookDB = class {
  static async getUniqueSchets(params) {
    const query = `--sql
      SELECT 
          DISTINCT ON (schet)
          schet,
          0 AS prixod,
          0 AS rasxod
      FROM spravochnik_operatsii 
      WHERE isdeleted = false
      
      UNION
      
      SELECT
          DISTINCT ON (schet)
          schet,
          0 AS prixod,
          0 AS rasxod
      FROM group_jur7 
      WHERE isdeleted = false
    `;

    const result = await db.query(query, params);

    return result;
  }

  static async getMainSchets(params) {
    const query = `--sql
      SELECT
        m.id,
        m.jur1_schet,
        m.jur2_schet,
        m.jur3_schet,
        m.jur4_schet,
        m.jur5_schet,
        m.jur7_schet
      FROM main_schet m
      JOIN users u ON u.id = m.user_id
      JOIN regions r ON r.id = u.region_id  
      WHERE m.isdeleted = false
        AND r.id = $1
        AND m.spravochnik_budjet_name_id = $2
    `;

    const result = await db.query(query, params);

    return result;
  }

  static async delete(params, client) {
    const query = `UPDATE main_book SET isdeleted = true WHERE id = $1`;

    await client.query(query, params);
  }

  static async deleteChildByParentId(params, client) {
    const query = `UPDATE main_book_child SET isdeleted = true WHERE parent_id = $1`;

    await client.query(query, params);
  }

  static async create(params, client) {
    const query = `
      INSERT INTO main_book (
          status,
          accept_time,
          send_time,
          user_id,
          year,
          month,
          budjet_id,
          created_at,
          updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id
    `;

    const result = await client.query(query, params);

    return result.rows[0];
  }

  static async update(params, client) {
    const query = `
      UPDATE main_book
        SET
          status = $1,
          send_time = $2,
          year = $3,
          month = $4,
          updated_at = $5
      WHERE id = $6
      RETURNING id 
    `;

    const result = await client.query(query, params);

    return result.rows[0];
  }

  static async updateChild(params, client) {
    const query = `
      UPDATE main_book_child
        SET
          schet = $1,
          prixod = $2,
          rasxod = $3,
          updated_at = $4  
      WHERE id = $5
    `;

    await client.query(query, params);
  }

  static async deleteChild(params, client) {
    const query = `UPDATE main_book_child SET isdeleted = true WHERE id = $1`;

    await client.query(query, params);
  }

  static async createChild(params, client) {
    const query = `
            INSERT INTO main_book_child (
                schet,
                prixod,
                rasxod,
                user_id,
                parent_id,
                type_id,
                created_at,
                updated_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `;

    await client.query(query, params);
  }

  static async getMainBookType(params) {
    const query = `SELECT * FROM main_book_type ORDER BY sort_order`;

    const result = await db.query(query, params);

    return result;
  }

  static async get(params, year = null, month = null) {
    const conditions = [];

    if (year) {
      params.push(year);
      conditions.push(`AND d.year = $${params.length}`);
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
          d.budjet_id,
          b.name AS                 budjet_name,
          d.accept_user_id,
          ua.fio AS                 accept_user_fio,
          ua.login AS               accept_user_login
        FROM main_book d
        JOIN spravochnik_budjet_name b ON b.id = d.budjet_id
        JOIN users u ON u.id = d.user_id
        LEFT JOIN users ua ON ua.id = d.accept_user_id
        JOIN regions r ON r.id = u.region_id
        WHERE d.isdeleted = false
          AND r.id = $1
          AND d.budjet_id = $2
          ${where_clause}
        OFFSET $3 LIMIT $4 
      )
      SELECT
        COALESCE(JSON_AGG(ROW_TO_JSON(data)), '[]'::JSON) AS data,
        (
          SELECT
            COALESCE(COUNT(d.id), 0)
          FROM main_book d
          JOIN users u ON u.id = d.user_id
          JOIN regions r ON r.id = u.region_id
          WHERE d.isdeleted = false
            AND r.id = $1
            AND d.budjet_id = $2
            ${where_clause}
        )::INTEGER AS total
      FROM data
    `;

    const result = await db.query(query, params);

    return result[0];
  }

  static async getById(params, isdeleted = null) {
    const query = `--sql
      SELECT
        d.id,
        d.status,
        d.accept_time,
        d.send_time,
        d.user_id,
        d.year,
        d.month,
        d.budjet_id,
        b.name AS                 budjet_name,
        d.accept_user_id,
        ua.fio AS                 accept_user_fio,
        ua.login AS               accept_user_login
      FROM main_book d
      JOIN spravochnik_budjet_name b ON b.id = d.budjet_id
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
          FROM main_book_child subch
          WHERE subch.isdeleted = false
            AND subch.type_id = t.id
            AND subch.parent_id = $1
        ) AS sub_childs
      FROM main_book_child ch
      JOIN main_book_type t ON t.id = ch.type_id
      WHERE ch.isdeleted = false
        AND parent_id = $1
      ORDER BY t.sort_order
    `;

    const result = await db.query(query, params);

    return result;
  }

  static async getJur1Rasxod(params, date, operator = null) {
    let date_filter = ``;

    if (date.from && date.to) {
      params.push(date.from, date.to);
      date_filter = `AND d.doc_date BETWEEN $${params.length - 1} AND $${params.length}`;
    }

    if (date.from && !date.to) {
      params.push(date.from);
      date_filter = `AND d.doc_date ${operator} $${params.length}`;
    }

    if (!date.from && date.to) {
      params.push(date.to);
      date_filter = `AND d.doc_date ${operator} $${params.length}`;
    }

    const query = `--sql
      SELECT
        COALESCE(SUM(ch.summa), 0)::FLOAT AS             summa,
        op.schet
      FROM kassa_rasxod d
      JOIN kassa_rasxod_child ch ON ch.kassa_rasxod_id = d.id
      JOIN spravochnik_operatsii op ON op.id = ch.spravochnik_operatsii_id
      JOIN users AS u ON d.user_id = u.id
      JOIN regions AS r ON r.id = u.region_id
      WHERE d.isdeleted = false
        AND ch.isdeleted = false
        AND r.id = $1
        AND d.main_schet_id = $2
        ${date_filter}
      GROUP BY op.schet
    `;

    const result = await db.query(query, params);

    return result;
  }

  static async getJur2Rasxod(params, date, operator = null) {
    let date_filter = ``;

    if (date.from && date.to) {
      params.push(date.from, date.to);
      date_filter = `AND d.doc_date BETWEEN $${params.length - 1} AND $${params.length}`;
    }

    if (date.from && !date.to) {
      params.push(date.from);
      date_filter = `AND d.doc_date ${operator} $${params.length}`;
    }

    if (!date.from && date.to) {
      params.push(date.to);
      date_filter = `AND d.doc_date ${operator} $${params.length}`;
    }

    const query = `--sql
      SELECT
        COALESCE(SUM(ch.summa), 0)::FLOAT AS             summa,
        op.schet
      FROM bank_rasxod d
      JOIN bank_rasxod_child ch ON ch.id_bank_rasxod = d.id
      JOIN spravochnik_operatsii op ON op.id = ch.spravochnik_operatsii_id
      JOIN users AS u ON d.user_id = u.id
      JOIN regions AS r ON r.id = u.region_id
      WHERE d.isdeleted = false
        AND ch.isdeleted = false
        AND r.id = $1
        AND d.main_schet_id = $2
        ${date_filter}
      GROUP BY op.schet
    `;

    const result = await db.query(query, params);

    return result;
  }

  static async getJur3Rasxod(params, date, operator = null) {
    let date_filter = ``;

    if (date.from && date.to) {
      params.push(date.from, date.to);
      date_filter = `AND d.doc_date BETWEEN $${params.length - 1} AND $${params.length}`;
    }

    if (date.from && !date.to) {
      params.push(date.from);
      date_filter = `AND d.doc_date ${operator} $${params.length}`;
    }

    if (!date.from && date.to) {
      params.push(date.to);
      date_filter = `AND d.doc_date ${operator} $${params.length}`;
    }

    const query = `--sql
      SELECT 
          COALESCE(SUM(ch.summa), 0)::FLOAT AS          summa,
          op.schet
      FROM bajarilgan_ishlar_jur3_child AS ch
      JOIN bajarilgan_ishlar_jur3 AS d ON d.id = ch.bajarilgan_ishlar_jur3_id 
      JOIN spravochnik_operatsii AS op ON op.id = ch.spravochnik_operatsii_id
      JOIN users AS u ON d.user_id = u.id
      JOIN regions AS r ON r.id = u.region_id
      WHERE d.isdeleted = false
        AND ch.isdeleted = false
        AND r.id = $1
        AND d.main_schet_id = $2
        ${date_filter}
      GROUP BY op.schet  
    `;

    const result = await db.query(query, params);

    return result;
  }

  static async getJur4Rasxod(params, date, operator = null) {
    let date_filter = ``;

    if (date.from && date.to) {
      params.push(date.from, date.to);
      date_filter = `AND d.doc_date BETWEEN $${params.length - 1} AND $${params.length}`;
    }

    if (date.from && !date.to) {
      params.push(date.from);
      date_filter = `AND d.doc_date ${operator} $${params.length}`;
    }

    if (!date.from && date.to) {
      params.push(date.to);
      date_filter = `AND d.doc_date ${operator} $${params.length}`;
    }

    const query = `--sql
      SELECT 
        COALESCE(SUM(ch.summa), 0)::FLOAT AS          summa,
        op.schet
      FROM avans_otchetlar_jur4_child ch
      JOIN avans_otchetlar_jur4 AS d ON ch.avans_otchetlar_jur4_id = d.id
      JOIN users u ON d.user_id = u.id
      JOIN regions r ON u.region_id = r.id
      JOIN spravochnik_operatsii AS op ON op.id = ch.spravochnik_operatsii_id
      WHERE d.isdeleted = false
        AND ch.isdeleted = false
        AND r.id = $1
        AND d.main_schet_id = $2
        ${date_filter}
      GROUP BY op.schet
    `;

    const result = await db.query(query, params);

    return result;
  }

  static async getJur7Rasxod(params, date, operator = null) {
    let date_filter = ``;

    if (date.from && date.to) {
      params.push(date.from, date.to);
      date_filter = `AND d.doc_date BETWEEN $${params.length - 1} AND $${params.length}`;
    }

    if (date.from && !date.to) {
      params.push(date.from);
      date_filter = `AND d.doc_date ${operator} $${params.length}`;
    }

    if (!date.from && date.to) {
      params.push(date.to);
      date_filter = `AND d.doc_date ${operator} $${params.length}`;
    }

    const query = `--sql
      SELECT 
            ch.debet_schet,
            ch.kredit_schet,
            COALESCE(SUM(ch.summa), 0)::FLOAT AS        summa  
        FROM document_rasxod_jur7_child ch
        JOIN document_rasxod_jur7 d ON d.id = ch.document_rasxod_jur7_id
        JOIN users AS u ON u.id = d.user_id
        JOIN regions AS r ON r.id = u.region_id
        WHERE d.isdeleted = false
          AND ch.isdeleted = false
          AND r.id = $1
          AND d.budjet_id = $2
          ${date_filter}
        GROUP BY ch.debet_schet,
            ch.kredit_schet

        UNION ALL 

        SELECT 
            ch.debet_schet,
            ch.kredit_schet,
            COALESCE(SUM(ch.summa), 0)::FLOAT AS        summa  
        FROM document_vnutr_peremesh_jur7_child ch
        JOIN document_vnutr_peremesh_jur7 d ON d.id = ch.document_vnutr_peremesh_jur7_id
        JOIN users AS u ON u.id = d.user_id
        JOIN regions AS r ON r.id = u.region_id
        WHERE d.isdeleted = false
          AND ch.isdeleted = false
          AND r.id = $1
          AND d.budjet_id = $2
          ${date_filter}
        GROUP BY ch.debet_schet,
            ch.kredit_schet
    `;

    const result = await db.query(query, params);

    return result;
  }
};
