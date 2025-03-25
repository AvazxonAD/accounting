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

    const query = `
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
    const query = `
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
    const query = `
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

  static async getJur1Prixod(params, date, operator = null) {
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
      FROM kassa_prixod d
      JOIN kassa_prixod_child ch ON ch.kassa_prixod_id = d.id
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

  static async getJur2Prixod(params, date, operator = null) {
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
      FROM bank_prixod d
      JOIN bank_prixod_child ch ON ch.id_bank_prixod = d.id
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

    console.log(query, params);
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
      WITH
        bajarilgan_ishlar AS (
            SELECT 
                COALESCE(SUM(ch.summa), 0)::FLOAT AS          summa,
                op.schet,
                'akt' AS                                      type
            FROM bajarilgan_ishlar_jur3_child AS ch
            JOIN bajarilgan_ishlar_jur3 AS d ON d.id = ch.bajarilgan_ishlar_jur3_id 
            JOIN spravochnik_operatsii AS op ON op.id = ch.spravochnik_operatsii_id
            JOIN spravochnik_operatsii AS own ON own.id = d.spravochnik_operatsii_own_id
            JOIN users AS u ON d.user_id = u.id
            JOIN regions AS r ON r.id = u.region_id
            WHERE d.isdeleted = false
              AND ch.isdeleted = false
              AND r.id = $1
              AND d.main_schet_id = $2
              AND own.schet = $3
              ${date_filter}
            GROUP BY op.schet
        ),
        
        organ_saldo_rasxod AS (
            SELECT 
                COALESCE(SUM(ch.summa), 0)::FLOAT AS            summa,
                op.schet,
                'organ_saldo_rasxod' AS                         type
            FROM organ_saldo_child ch
            JOIN organ_saldo AS d ON ch.parent_id = d.id
            JOIN spravochnik_operatsii AS op ON op.id = ch.operatsii_id
            JOIN users AS u ON d.user_id = u.id
            JOIN regions AS r ON r.id = u.region_id
            WHERE d.isdeleted = false
              AND d.rasxod = true
              AND ch.isdeleted = false
              AND r.id = $1
              AND d.main_schet_id = $2
              AND op.schet = $3
              ${date_filter}
            GROUP BY op.schet
        ),
        
        bank_prixod AS (
            SELECT 
                COALESCE(SUM(ch.summa), 0)::FLOAT AS            summa,
                m.jur2_schet AS                                 schet,
                'bank_prixod' AS                                type
            FROM bank_prixod_child AS ch
            JOIN bank_prixod AS d ON ch.id_bank_prixod = d.id
            JOIN spravochnik_operatsii AS op ON op.id = ch.spravochnik_operatsii_id
            JOIN main_schet m ON m.id = d.main_schet_id
            JOIN users AS u ON d.user_id = u.id
            JOIN regions AS r ON r.id = u.region_id
            WHERE d.isdeleted = false
              AND ch.isdeleted = false
              AND r.id = $1
              AND d.main_schet_id = $2
              AND op.schet = $3
              ${date_filter}
            GROUP BY m.jur2_schet
        ),

        jur7_prixod AS (
            SELECT 
                COALESCE(SUM(ch.summa), 0)::FLOAT AS            summa,
                ch.kredit_schet AS schet,
                'jur7_prixod' AS                                type
            FROM document_prixod_jur7_child ch
            JOIN document_prixod_jur7 AS d ON ch.document_prixod_jur7_id = d.id
            JOIN users AS u ON d.user_id = u.id
            JOIN regions AS r ON r.id = u.region_id
            WHERE d.isdeleted = false
              AND ch.isdeleted = false
              AND r.id = $1
              AND d.main_schet_id = $2
              AND d.j_o_num = $3
              ${date_filter}
            GROUP BY ch.kredit_schet
        )

        SELECT schet, summa, type FROM bajarilgan_ishlar
        
        UNION ALL
          
        SELECT schet, summa, type FROM organ_saldo_rasxod
        
        UNION ALL
        
        SELECT schet, summa, type FROM bank_prixod
        
        UNION ALL
        
        SELECT schet, summa, type FROM jur7_prixod
      `;

    const result = await db.query(query, params);

    return result;
  }

  static async getJur3Prixod(params, date, operator = null) {
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
      WITH
        kursatilgan_hizmatlar AS (
            SELECT 
              COALESCE(SUM(ch.summa), 0)::FLOAT AS          summa,
              op.schet,
              'show_service' AS                             type
            FROM kursatilgan_hizmatlar_jur152_child AS ch
            JOIN kursatilgan_hizmatlar_jur152 AS d ON d.id = ch.kursatilgan_hizmatlar_jur152_id
            JOIN spravochnik_operatsii AS op ON op.id = ch.spravochnik_operatsii_id
            JOIN spravochnik_operatsii AS own ON own.id = d.spravochnik_operatsii_own_id
            JOIN users AS u ON d.user_id = u.id
            JOIN regions AS r ON r.id = u.region_id
            WHERE d.isdeleted = false
              AND ch.isdeleted = false
              AND r.id = $1
              AND d.main_schet_id = $2
              AND own.schet = $3
              ${date_filter}
            GROUP BY op.schet
        ),
        
        organ_saldo_prixod AS (
            SELECT 
              COALESCE(SUM(ch.summa), 0)::FLOAT AS            summa,
              op.schet,
              'organ_saldo_prixod' AS                         type
            FROM organ_saldo_child ch
            JOIN organ_saldo AS d ON ch.parent_id = d.id
            JOIN spravochnik_operatsii AS op ON op.id = ch.operatsii_id
            JOIN users AS u ON d.user_id = u.id
            JOIN regions AS r ON r.id = u.region_id
            WHERE d.isdeleted = false
              AND d.prixod = true
              AND ch.isdeleted = false
              AND r.id = $1
              AND d.main_schet_id = $2
              AND op.schet = $3
              ${date_filter}
            GROUP BY op.schet
        ),
        
        bank_rasxod AS (
            SELECT 
                COALESCE(SUM(ch.summa), 0)::FLOAT AS            summa,
                m.jur2_schet AS                                 schet,
                'bank_rasxod' AS                                type
            FROM bank_rasxod_child ch
            JOIN bank_rasxod AS d ON ch.id_bank_rasxod = d.id
            JOIN spravochnik_operatsii AS op ON op.id = ch.spravochnik_operatsii_id
            JOIN main_schet m ON m.id = d.main_schet_id
            JOIN users AS u ON d.user_id = u.id
            JOIN regions AS r ON r.id = u.region_id
            WHERE d.isdeleted = false
              AND ch.isdeleted = false
              AND r.id = $1
              AND d.main_schet_id = $2
              AND op.schet = $3
              ${date_filter}
            GROUP BY m.jur2_schet
        )

        SELECT schet, summa, type FROM kursatilgan_hizmatlar
        
        UNION ALL
          
        SELECT schet, summa, type FROM bank_rasxod
        
        UNION ALL
        
        SELECT schet, summa, type FROM organ_saldo_prixod
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
      WITH
        podotchet_saldo_rasxod AS (
          SELECT 
            COALESCE(SUM(ch.summa), 0)::FLOAT AS        summa,
            op.schet,
            'podotchet_saldo_rasxod' AS                 type 
          FROM podotchet_saldo_child ch
          JOIN podotchet_saldo AS d ON ch.parent_id = d.id
          JOIN users u ON d.user_id = u.id
          JOIN regions r ON u.region_id = r.id
          JOIN spravochnik_operatsii AS op ON op.id = ch.operatsii_id
          WHERE d.isdeleted = false
            AND d.rasxod = true
            AND ch.isdeleted = false
            AND r.id = $1
            AND d.main_schet_id = $2
            AND op.schet = $3
            ${date_filter}
          GROUP BY op.schet
        ),
        
        kassa_prixod AS (
          SELECT 
            COALESCE(SUM(ch.summa), 0)::FLOAT AS        summa,
            m.jur1_schet AS                             schet,
            'kassa_prixod' AS                           type
          FROM kassa_prixod_child ch
          JOIN kassa_prixod AS d ON ch.kassa_prixod_id = d.id
          JOIN users u ON d.user_id = u.id
          JOIN regions r ON u.region_id = r.id
          JOIN spravochnik_operatsii AS op ON op.id = ch.spravochnik_operatsii_id
          JOIN main_schet m ON m.id = d.main_schet_id
          WHERE d.isdeleted = false
            AND ch.isdeleted = false
            AND r.id = $1
            AND d.main_schet_id = $2
            AND op.schet = $3
            ${date_filter}
          GROUP BY m.jur1_schet
        ),
        
        bank_prixod AS (
          SELECT 
              COALESCE(SUM(ch.summa), 0)::FLOAT AS      summa,
              m.jur2_schet AS                           schet,
              'bank_prixod' AS                          type
          FROM bank_prixod_child AS ch
          JOIN bank_prixod AS d ON ch.id_bank_prixod = d.id
          JOIN spravochnik_operatsii AS op ON op.id = ch.spravochnik_operatsii_id
          JOIN main_schet m ON m.id = d.main_schet_id
          JOIN users AS u ON d.user_id = u.id
          JOIN regions AS r ON r.id = u.region_id
          WHERE d.isdeleted = false
            AND ch.isdeleted = false
            AND r.id = $1
            AND d.main_schet_id = $2
            AND op.schet = $3
            ${date_filter}
          GROUP BY m.jur2_schet
        ),

        avans_otchet AS (
          SELECT 
            COALESCE(SUM(ch.summa), 0)::FLOAT AS          summa,
            op.schet,
            'avans_otchet' AS                             type
          FROM avans_otchetlar_jur4_child ch
          JOIN avans_otchetlar_jur4 AS d ON ch.avans_otchetlar_jur4_id = d.id
          JOIN users u ON d.user_id = u.id
          JOIN regions r ON u.region_id = r.id
          JOIN spravochnik_operatsii AS op ON op.id = ch.spravochnik_operatsii_id
          JOIN spravochnik_operatsii AS own ON own.id = d.spravochnik_operatsii_own_id
          WHERE d.isdeleted = false
            AND ch.isdeleted = false
            AND r.id = $1
            AND d.main_schet_id = $2
            AND own.schet = $3
            ${date_filter}
          GROUP BY op.schet
        )

        SELECT schet, summa, type FROM podotchet_saldo_rasxod
        
        UNION ALL
          
        SELECT schet, summa, type FROM kassa_prixod
        
        UNION ALL
        
        SELECT schet, summa, type FROM bank_prixod
        
        UNION ALL
        
        SELECT schet, summa, type FROM avans_otchet
      `;

    const result = await db.query(query, params);

    return result;
  }

  static async getJur4Prixod(params, date, operator = null) {
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
      WITH
        podotchet_saldo_prixod AS (
          SELECT 
            COALESCE(SUM(ch.summa), 0)::FLOAT AS        summa,
            op.schet,
            'podotchet_saldo_prixod' AS                 type 
          FROM podotchet_saldo_child ch
          JOIN podotchet_saldo AS d ON ch.parent_id = d.id
          JOIN users u ON d.user_id = u.id
          JOIN regions r ON u.region_id = r.id
          JOIN spravochnik_operatsii AS op ON op.id = ch.operatsii_id
          WHERE d.isdeleted = false
            AND d.prixod = true
            AND ch.isdeleted = false
            AND r.id = $1
            AND d.main_schet_id = $2
            AND op.schet = $3
            ${date_filter}
          GROUP BY op.schet
        ),
        
        kassa_rasxod AS (
          SELECT 
            COALESCE(SUM(ch.summa), 0)::FLOAT AS        summa,
            m.jur1_schet AS                             schet,
            'kassa_rasxod' AS                           type
          FROM kassa_rasxod_child ch
          JOIN kassa_rasxod AS d ON ch.kassa_rasxod_id = d.id
          JOIN users u ON d.user_id = u.id
          JOIN regions r ON u.region_id = r.id
          JOIN spravochnik_operatsii AS op ON op.id = ch.spravochnik_operatsii_id
          JOIN main_schet m ON m.id = d.main_schet_id
          WHERE d.isdeleted = false
            AND ch.isdeleted = false
            AND r.id = $1
            AND d.main_schet_id = $2
            AND op.schet = $3
            ${date_filter}
          GROUP BY m.jur1_schet
        ),
        
        bank_rasxod AS (
          SELECT 
              COALESCE(SUM(ch.summa), 0)::FLOAT AS      summa,
              m.jur2_schet AS                           schet,
              'bank_rasxod' AS                          type
          FROM bank_rasxod_child ch
          JOIN bank_rasxod AS d ON ch.id_bank_rasxod = d.id
          JOIN spravochnik_operatsii AS op ON op.id = ch.spravochnik_operatsii_id
          JOIN main_schet m ON m.id = d.main_schet_id
          JOIN users AS u ON d.user_id = u.id
          JOIN regions AS r ON r.id = u.region_id
          WHERE d.isdeleted = false
            AND ch.isdeleted = false
            AND r.id = $1
            AND d.main_schet_id = $2
            AND op.schet = $3
            ${date_filter}
          GROUP BY m.jur2_schet
        )

        SELECT schet, summa, type FROM bank_rasxod
        
        UNION ALL
          
        SELECT schet, summa, type FROM kassa_rasxod
        
        UNION ALL
        
        SELECT schet, summa, type FROM podotchet_saldo_prixod
    `;

    const result = await db.query(query, params);

    return result;
  }
};
