const { db } = require("@db/index");

exports.SaldoDB = class {
  static async createProduct(params, client) {
    const query = `--sql
            INSERT INTO naimenovanie_tovarov_jur7 (
                user_id, 
                spravochnik_budjet_name_id, 
                name, 
                unit_id, 
                group_jur7_id, 
                inventar_num,
                serial_num,
                iznos,
                created_at, 
                updated_at
            ) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
            RETURNING *
        `;
    const result = await client.query(query, params);

    return result.rows[0];
  }

  static async checkDelete(params) {
    const query = `--sql
      SELECT
        DISTINCT year, month
      FROM saldo_naimenovanie_jur7
      WHERE region_id = $1
        AND main_schet_id = $2
        AND isdeleted = false
    `;

    const result = await db.query(query, params);

    return result;
  }

  static async getById(params, isdeleted = null, iznos = null) {
    const query = `--sql
            SELECT 
                s.*, 
                s.id::INTEGER,
                s.sena::FLOAT,
                s.summa::FLOAT,
                s.iznos_summa::FLOAT,
                s.kol::FLOAT,
                s.naimenovanie_tovarov_jur7_id::INTEGER,
                s.eski_iznos_summa::FLOAT,
                s.region_id::INTEGER, 
                s.kimning_buynida AS responsible_id,
                row_to_json(n) AS product,
                n.name,
                n.edin,
                g.name AS group_jur7_name,
                JSON_BUILD_OBJECT(
                    'doc_num', s.doc_num,
                    'doc_date', s.doc_date,
                    'doc_id', s.prixod_id
                ) AS prixod_data,
                row_to_json(g) AS group,
                row_to_json(jsh) AS responsible
            FROM saldo_naimenovanie_jur7 s 
            JOIN users AS u ON u.id = s.user_id
            JOIN regions AS r ON r.id = u.region_id
            JOIN naimenovanie_tovarov_jur7 n ON n.id = s.naimenovanie_tovarov_jur7_id  
            JOIN spravochnik_javobgar_shaxs_jur7 jsh ON jsh.id = s.kimning_buynida
            JOIN group_jur7 g ON g.id = n.group_jur7_id  
            WHERE r.id = $1 
                AND s.id = $2
                AND main_schet_id = $3
                ${!isdeleted ? "AND s.isdeleted = false" : ""}
                ${!iznos ? "" : "AND s.iznos = true"}
        `;

    const result = await db.query(query, params);

    return result[0];
  }

  static async getKolAndSumma(params, start = null, end = null, responsible_id = null, prixod_id = null) {
    let start_filter = ``;
    let end_filter = ``;
    let between_filter = ``;
    let responsible_filter = ``;
    let prixod_filter = ``;

    if (start && end) {
      params.push(start, end);
      between_filter = `AND d.doc_date BETWEEN $${params.length - 1} AND $${params.length}`;
    } else if (start) {
      params.push(start);
      start_filter = `AND d.doc_date < $${params.length}`;
    } else if (end) {
      params.push(end);
      end_filter = `AND d.doc_date <= $${params.length}`;
    }

    if (prixod_id) {
      params.push(prixod_id);
      prixod_filter = `AND d.id = $${params.length}`;
    }

    if (responsible_id) {
      params.push(responsible_id);
      responsible_filter = `AND jsh.id = $${params.length}`;
    }

    const query = `--sql
            WITH prixod AS (
                SELECT
                    COALESCE(SUM(ch.kol), 0)::FLOAT AS kol,
                    COALESCE(SUM(ch.summa_s_nds), 0)::FLOAT AS summa,
                    COALESCE(SUM(ch.iznos_summa), 0)::FLOAT AS iznos_summa
                FROM document_prixod_jur7 d
                JOIN document_prixod_jur7_child ch ON d.id = ch.document_prixod_jur7_id
                JOIN spravochnik_javobgar_shaxs_jur7 jsh ON jsh.id = d.kimga_id
                WHERE ch.naimenovanie_tovarov_jur7_id = $1
                    AND d.isdeleted = false
                    AND ch.isdeleted = false
                    AND d.main_schet_id = $2
                    ${prixod_filter}
                    ${start_filter}
                    ${end_filter}
                    ${between_filter}
                    ${responsible_filter}
            ),
            prixod_internal AS (
                SELECT
                    COALESCE(SUM(ch.kol), 0)::FLOAT AS kol,
                    COALESCE(SUM(ch.summa), 0)::FLOAT AS summa,
                    COALESCE(SUM(ch.iznos_summa), 0)::FLOAT AS iznos_summa
                FROM document_vnutr_peremesh_jur7 d
                JOIN document_vnutr_peremesh_jur7_child ch ON d.id = ch.document_vnutr_peremesh_jur7_id
                JOIN spravochnik_javobgar_shaxs_jur7 jsh ON jsh.id = d.kimga_id
                WHERE ch.naimenovanie_tovarov_jur7_id = $1
                    AND d.isdeleted = false
                    AND ch.isdeleted = false
                    AND d.main_schet_id = $2
                    ${prixod_filter}
                    ${start_filter}
                    ${end_filter}
                    ${between_filter}
                    ${responsible_filter}
            ),
            rasxod AS (
                SELECT
                    COALESCE(SUM(ch.kol), 0)::FLOAT AS kol,
                    COALESCE(SUM(ch.summa), 0)::FLOAT AS summa,
                    COALESCE(SUM(ch.iznos_summa), 0)::FLOAT AS iznos_summa
                FROM document_rasxod_jur7 d
                JOIN document_rasxod_jur7_child ch ON d.id = ch.document_rasxod_jur7_id
                JOIN spravochnik_javobgar_shaxs_jur7 jsh ON jsh.id = d.kimdan_id
                WHERE ch.naimenovanie_tovarov_jur7_id = $1
                    AND d.isdeleted = false
                    AND ch.isdeleted = false
                    AND d.main_schet_id = $2
                    ${start_filter}
                    ${end_filter}
                    ${between_filter}
                    ${responsible_filter}
            ),
            rasxod_internal AS (
                SELECT
                    COALESCE(SUM(ch.kol), 0)::FLOAT AS kol,
                    COALESCE(SUM(ch.summa), 0)::FLOAT AS summa,
                    COALESCE(SUM(ch.iznos_summa), 0)::FLOAT AS iznos_summa
                FROM document_vnutr_peremesh_jur7 d
                JOIN document_vnutr_peremesh_jur7_child ch ON d.id = ch.document_vnutr_peremesh_jur7_id
                JOIN spravochnik_javobgar_shaxs_jur7 jsh ON jsh.id = d.kimdan_id
                WHERE ch.naimenovanie_tovarov_jur7_id = $1
                    AND d.isdeleted = false
                    AND ch.isdeleted = false
                    AND d.main_schet_id = $2
                    ${start_filter}
                    ${end_filter}
                    ${between_filter}
                    ${responsible_filter}
            )
            SELECT
                (COALESCE(p.kol, 0) + COALESCE(pi.kol, 0) - COALESCE(r.kol, 0) - COALESCE(ri.kol, 0))::FLOAT AS kol,
                (COALESCE(r.kol, 0) - COALESCE(ri.kol, 0))::FLOAT AS kol_rasxod,
                (COALESCE(p.kol, 0) + COALESCE(pi.kol, 0))::FLOAT AS kol_prixod,
                (COALESCE(p.summa, 0) + COALESCE(pi.summa, 0) - COALESCE(r.summa, 0) - COALESCE(ri.summa, 0))::FLOAT AS summa,
                (COALESCE(p.summa, 0) + COALESCE(pi.summa, 0))::FLOAT AS summa_prixod,
                (COALESCE(r.summa, 0) - COALESCE(ri.summa, 0))::FLOAT AS summa_rasxod,
                (COALESCE(r.iznos_summa, 0) - COALESCE(ri.iznos_summa, 0))::FLOAT AS iznos_rasxod,
                (COALESCE(p.iznos_summa, 0) + COALESCE(pi.iznos_summa, 0))::FLOAT AS iznos_prixod,
                (COALESCE(p.iznos_summa, 0) + COALESCE(pi.iznos_summa, 0) - COALESCE(r.iznos_summa, 0) - COALESCE(ri.iznos_summa, 0))::FLOAT AS iznos_summa
            FROM
                prixod p,
                prixod_internal pi,
                rasxod r,
                rasxod_internal ri
        `;

    const result = await db.query(query, params);

    return result[0];
  }

  static async getByProduct(params, filter) {
    let conditions = [];

    if (filter.iznos) {
      conditions.push(`s.iznos = true`);
    }

    if (filter.group_id) {
      params.push(filter.group_id);
      conditions.push(`g.id = $${params.length}`);
    }

    if (filter.responsible_id) {
      params.push(filter.responsible_id);
      conditions.push(`jsh.id = $${params.length}`);
    }

    if (filter.search) {
      params.push(filter.search);
      conditions.push(
        `(
          n.name ILIKE '%' || $${params.length} || '%' OR
          jsh.fio ILIKE '%' || $${params.length} || '%' OR
          s.debet_schet ILIKE '%' || $${params.length} || '%' OR
          s.kredit_schet ILIKE '%' || $${params.length} || '%'
        )`
      );
    }

    if (filter.product_id) {
      params.push(filter.product_id);
      conditions.push(`n.id = $${params.length}`);
    }

    if (filter.budjet_id) {
      params.push(filter.budjet_id);
      conditions.push(`s.budjet_id = $${params.length}`);
    }

    const whereClouse = conditions.length ? `AND ${conditions.join(" AND ")}` : "";

    const query = `--sql
        WITH data AS (
            SELECT  
                s.id::INTEGER,
                s.eski_iznos_summa::FLOAT,
                s.region_id::INTEGER, 
                n.id AS product_id,
                n.name,
                su.name AS edin,
                n.inventar_num,
                n.serial_num,
                g.id AS group_id,
                g.name AS group_name,
                g.group_number,
                g.provodka_debet,
                jsh.id AS responsible_id,
                jsh.fio,
                s.iznos,
                s.eski_iznos_summa,
                s.month_iznos_summa,
                s.iznos_start,
                s.iznos_schet,
                s.iznos_sub_schet,
                s.debet_schet,
                s.debet_sub_schet,
                s.kredit_schet,
                s.kredit_sub_schet,
                s.year,
                s.month,
                s.isdeleted,
                s.type,
                g.iznos_foiz,
                JSON_BUILD_OBJECT(
                    'doc_id', s.prixod_id,
                    'docNum', s.doc_num,
                    'docDate', s.doc_date,
                    'docId', s.prixod_id
                ) AS "prixodData",
                JSON_BUILD_OBJECT(
                    'sena', s.sena::FLOAT,
                    'summa', s.summa::FLOAT,
                    'iznos_summa', s.iznos_summa::FLOAT,
                    'kol', s.kol::FLOAT
                ) AS from
            FROM saldo_naimenovanie_jur7 s 
            JOIN users AS u ON u.id = s.user_id
            JOIN regions AS r ON r.id = u.region_id
            JOIN naimenovanie_tovarov_jur7 n ON n.id = s.naimenovanie_tovarov_jur7_id  
            JOIN spravochnik_javobgar_shaxs_jur7 jsh ON jsh.id = s.kimning_buynida
            JOIN group_jur7 g ON g.id = n.group_jur7_id
            JOIN storage_unit su ON su.id = n.unit_id
            WHERE r.id = $1
              AND s.month = $2
              AND s.year = $3
              AND s.isdeleted = false
              AND s.main_schet_id = $4
              ${whereClouse}
        )
        SELECT
            COALESCE(JSON_AGG(ROW_TO_JSON(data)), '[]'::JSON) AS data
        FROM data
    `;

    const result = await db.query(query, params);

    return result[0];
  }

  static async getFirstSaldoDocs(params) {
    const query = `--sql
           SELECT
              DISTINCT
                s.year,
                s.month,
                m.id AS         main_schet_id,
                m.account_number
            FROM saldo_naimenovanie_jur7 s
            LEFT JOIN main_schet m ON m.id = s.main_schet_id
            WHERE s.region_id = $1
                AND s.isdeleted = false
                AND m.id = $2
            LIMIT 1
        `;

    const result = await db.query(query, params);

    return result[0];
  }

  static async cleanData(params, client) {
    const query1 = `DELETE FROM saldo_naimenovanie_jur7 WHERE region_id = $1 AND main_schet_id = $2`;
    const query2 = `UPDATE saldo_date SET isdeleted = true WHERE region_id = $1 AND main_schet_id = $2`;

    await client.query(query1, params);
    await client.query(query2, params);
  }

  static async checkDoc(params) {
    const query = `--sql
      SELECT
        *
      FROM saldo_naimenovanie_jur7
      WHERE type = 'prixod'
        AND year = $1
        AND month = $2
        AND region_id = $3
        AND main_schet_id = $4
    `;

    const data = await db.query(query, params);

    return data;
  }

  static async deleteByMonth(params) {
    const query = `--sql
      DELETE FROM saldo_naimenovanie_jur7
      WHERE region_id = $1
        AND month = $2
        AND year = $3
        AND main_schet_id = $4
        AND type != 'prixod'
    `;

    await db.query(query, params);
  }

  static async createSaldoDate(params, client) {
    const query = `--sql
            INSERT INTO saldo_date(
                region_id, 
                year, 
                month,
                main_schet_id,
                budjet_id,
                created_at,
                updated_at
            ) 
            VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *
        `;

    const result = await client.query(query, params);

    return result.rows[0];
  }

  static async getSaldoDate(params, client) {
    const _db = client || db;
    const query = `--sql
            SELECT 
                DISTINCT year, month
            FROM saldo_naimenovanie_jur7 
            WHERE region_id = $1
                AND date_saldo > $2
                AND main_schet_id = $3
                AND isdeleted = false
            ORDER BY year, month
        `;

    const data = await _db.query(query, params);

    const response = client ? data.rows : data;

    return response;
  }

  static async getFirstSaldoDate(params) {
    const query = `--sql
           SELECT 
                DISTINCT TO_CHAR(date_saldo, 'YYYY-MM-DD') AS date_saldo
            FROM saldo_naimenovanie_jur7 
            WHERE region_id = $1
                AND isdeleted = false
                AND main_schet_id = $2
            ORDER BY date_saldo
            LIMIT 1
        `;

    const result = await db.query(query, params);

    return result[0];
  }

  static async getEndSaldo(params) {
    const query = `--sql
           SELECT
              year,
              month
            FROM saldo_naimenovanie_jur7 
            WHERE region_id = $1
                AND isdeleted = false
                AND main_schet_id = $2
            ORDER BY date_saldo DESC
            LIMIT 1
        `;

    const result = await db.query(query, params);

    return result[0];
  }

  static async getEndSaldoDate(params) {
    const query = `--sql
           SELECT 
                DISTINCT TO_CHAR(date_saldo, 'YYYY-MM-DD') AS date_saldo
            FROM saldo_naimenovanie_jur7 
            WHERE region_id = $1
                AND isdeleted = false
                AND main_schet_id = $2
            ORDER BY date_saldo DESC 
            LIMIT 1
        `;

    const result = await db.query(query, params);

    return result[0];
  }

  static async getBlock(params) {
    const query = `--sql
            SELECT 
                DISTINCT year, month
            FROM saldo_date 
            WHERE region_id = $1
                AND isdeleted = false
                AND main_schet_id = $2
            ORDER BY year, month
        `;

    const data = await db.query(query, params);

    return data;
  }

  static async unblock(params) {
    const query = `UPDATE saldo_date SET isdeleted = true WHERE region_id = $1 AND year = $2 AND month = $3 AND main_schet_id = $4`;

    await db.query(query, params);
  }

  static async check(params, year = null, month = null) {
    let year_filter = ``;
    let month_filter = ``;

    if (year) {
      params.push(year);
      year_filter = `AND year = $${params.length}`;
    }

    if (month) {
      params.push(month);
      month_filter = `AND month = $${params.length}`;
    }

    const query = `--sql
            SELECT
                *
            FROM saldo_naimenovanie_jur7 
            WHERE region_id = $1 
                AND  isdeleted = false
                AND main_schet_id = $2 
                ${year_filter}
                ${month_filter}  
            LIMIT 1
        `;

    const result = await db.query(query, params);

    return result;
  }

  static async get(params, responsible_id = null, search = null, product_id = null, group_id = null, iznos = null) {
    let responsible_filter = ``;
    let filter = ``;
    let product_filter = ``;
    let group_filter = ``;
    let iznos_filer = ``;

    if (product_id) {
      params.push(product_id);
      product_filter = `AND n.id = $${params.length}`;
    }

    if (search) {
      params.push(search);
      filter = `AND (n.name ILIKE '%' || $${params.length} || '%' OR jsh.fio ILIKE '%' || $${params.length} || '%')`;
    }

    if (responsible_id) {
      params.push(responsible_id);
      responsible_filter = `AND kimning_buynida = $${params.length}`;
    }

    if (group_id) {
      params.push(group_id);
      group_filter = `AND g.id = $${params.length}`;
    }

    if (iznos === "true") {
      iznos_filer = `AND s.iznos = true`;
    }

    const query = `--sql
            WITH data AS (
                SELECT 
                    s.*, 
                    s.id::INTEGER,
                    s.sena::FLOAT,
                    s.summa::FLOAT,
                    s.kol::FLOAT,
                    s.naimenovanie_tovarov_jur7_id::INTEGER,
                    s.region_id::INTEGER, 
                    s.kimning_buynida AS responsible_id,
                    s.eski_iznos_summa::FLOAT,
                    row_to_json(n) AS product,
                    n.name,
                    n.edin,
                    g.name AS group_jur7_name,
                    JSON_BUILD_OBJECT(
                        'doc_num', s.doc_num,
                        'doc_date', s.doc_date,
                        'doc_id', s.prixod_id
                    ) AS prixod_data,
                    row_to_json(g) AS group,
                    row_to_json(jsh) AS responsible,
                    row_to_json(p) AS podraz,
                    JSON_BUILD_OBJECT(
                        'kol', s.kol,
                        'sena', s.sena,
                        'summa', s.summa,
                        'iznos_summa', s.iznos_summa,
                        'iznos_schet', s.iznos_schet,
                        'iznos_sub_schet', s.iznos_sub_schet
                    ) AS from
            FROM saldo_naimenovanie_jur7 s 
            JOIN users AS u ON u.id = s.user_id
            JOIN regions AS r ON r.id = u.region_id
            JOIN naimenovanie_tovarov_jur7 n ON n.id = s.naimenovanie_tovarov_jur7_id  
            LEFT JOIN spravochnik_javobgar_shaxs_jur7 jsh ON jsh.id = s.kimning_buynida
            LEFT JOIN spravochnik_podrazdelenie_jur7 p ON p.id = jsh.spravochnik_podrazdelenie_jur7_id  
            LEFT JOIN group_jur7 g ON g.id = n.group_jur7_id  
            WHERE r.id = $1 
                AND s.year = $2
                AND s.month = $3 
                AND s.isdeleted = false
                AND s.main_schet_id = $4
                ${responsible_filter} 
                ${filter}
                ${product_filter}
                ${group_filter}
                ${iznos_filer}
                OFFSET $5 LIMIT $6
            )
            SELECT 
                COALESCE(JSON_AGG(row_to_json(data)), '[]'::JSON) AS data,
                (
                    SELECT 
                        COALESCE(COUNT(s.id), 0)::INTEGER
                    FROM saldo_naimenovanie_jur7 s 
                    JOIN users AS u ON u.id = s.user_id
                    JOIN regions AS r ON r.id = u.region_id
                    JOIN naimenovanie_tovarov_jur7 n ON n.id = s.naimenovanie_tovarov_jur7_id  
                    JOIN spravochnik_javobgar_shaxs_jur7 jsh ON jsh.id = s.kimning_buynida
                    JOIN group_jur7 g ON g.id = n.group_jur7_id
                    WHERE r.id = $1
                        AND s.year = $2
                        AND s.month = $3
                        AND s.isdeleted = false
                        AND s.main_schet_id = $4
                        ${responsible_filter} 
                        ${filter}
                        ${product_filter}
                        ${group_filter}
                        ${iznos_filer}
                ) AS total
            FROM data
        `;

    const data = await db.query(query, params);

    return data[0];
  }

  static async checkDelete(params) {
    const query = `--sql
      SELECT
        DISTINCT year, month
      FROM saldo_naimenovanie_jur7
      WHERE region_id = $1
        AND main_schet_id = $2
        AND isdeleted = false
    `;

    const result = await db.query(query, params);

    return result;
  }

  static async delete(params, client, type = null) {
    const _db = client || db;

    let type_filter = ``;

    if (type) {
      type_filter = `AND type = '${type}'`;
    }

    const query = `DELETE FROM saldo_naimenovanie_jur7 WHERE year = $1 AND month = $2 AND region_id = $3 ${type_filter}`;

    await _db.query(query, params);
  }

  static async deleteById(params, client) {
    const _db = client || db;
    const query = `DELETE FROM saldo_naimenovanie_jur7 WHERE id = $1`;

    const data = await _db.query(query, params);

    return data?.rows ? data.rows[0] : data[0];
  }

  static async create(params, client) {
    const query = `--sql
            INSERT INTO saldo_naimenovanie_jur7 (
                user_id,
                naimenovanie_tovarov_jur7_id,
                kol,
                sena,
                summa,
                month,
                year,
                date_saldo,
                doc_date,
                doc_num,
                kimning_buynida,
                region_id,
                prixod_id,
                iznos,
                iznos_summa,
                iznos_schet,
                iznos_sub_schet,
                eski_iznos_summa,
                iznos_start,
                month_iznos_summa,
                debet_schet,
                debet_sub_schet,
                kredit_schet,
                kredit_sub_schet,
                budjet_id,
                main_schet_id,
                type,
                created_at,
                updated_at
            )
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29) RETURNING *
        `;

    const result = await client.query(query, params);

    return result.rows[0];
  }

  static async createMultiInsert(paramsArray, client) {
    if (!paramsArray.length) return [];

    const valuesSql = [];
    const flatValues = [];

    paramsArray.forEach((row, rowIndex) => {
      const placeholders = row.map((_, colIndex) => `$${rowIndex * row.length + colIndex + 1}`);
      valuesSql.push(`(${placeholders.join(", ")})`);
      flatValues.push(...row);
    });

    const query = `--sql
      INSERT INTO saldo_naimenovanie_jur7 (
        user_id,
        naimenovanie_tovarov_jur7_id,
        kol,
        sena,
        summa,
        month,
        year,
        date_saldo,
        doc_date,
        doc_num,
        kimning_buynida,
        region_id,
        prixod_id,
        iznos,
        iznos_summa,
        iznos_schet,
        iznos_sub_schet,
        eski_iznos_summa,
        iznos_start,
        month_iznos_summa,
        debet_schet,
        debet_sub_schet,
        kredit_schet,
        kredit_sub_schet,
        budjet_id,
        main_schet_id,
        type,
        created_at,
        updated_at
      )
      VALUES ${valuesSql.join(", ")}
      RETURNING *
    `;

    const result = await client.query(query, flatValues);
    return result.rows;
  }

  static async deleteByPrixodId(params, client) {
    const query = `DELETE FROM saldo_naimenovanie_jur7 WHERE prixod_id = $1 AND main_schet_id = $2`;

    await client.query(query, params);
  }

  static async getProductPrixod(params) {
    const query = `--sql
            SELECT
                d.id,
                TO_CHAR(ch.data_pereotsenka, 'YYYY-MM-DD') AS doc_date,
                d.doc_num, 
                'prixod' AS type
            FROM document_prixod_jur7_child ch
            JOIN document_prixod_jur7 d ON ch.document_prixod_jur7_id = d.id
            WHERE ch.naimenovanie_tovarov_jur7_id = $1
              AND main_schet_id = $2
              AND ch.isdeleted = false
              AND d.isdeleted = false
        `;
    const result = await db.query(query, params);
    return result[0] || null;
  }

  static async updateIznosSumma(params) {
    const query = `--sql
            UPDATE saldo_naimenovanie_jur7
            SET 
                eski_iznos_summa = $1,
                iznos_summa = $1 + month_iznos_summa
            WHERE id = $2
                AND isdeleted = false
                AND iznos = true
            RETURNING *
        `;

    const data = await db.query(query, params);

    return data[0];
  }
};
