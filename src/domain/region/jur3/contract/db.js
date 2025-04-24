const { db } = require("@db/index");

exports.ContractDB = class {
  static async checkGrafik(params) {
    const query = `
            SELECT 
                id, 
                'bank_rasxod' AS type
            FROM bank_rasxod
            WHERE isdeleted = false 
                AND shartnoma_grafik_id = $1

            UNION ALL 

            SELECT 
                id, 
                'bank_prixod' AS type
            FROM bank_prixod
            WHERE isdeleted = false 
                AND shartnoma_grafik_id = $1

            UNION ALL 

            SELECT 
                id, 
                'show_service' AS type
            FROM kursatilgan_hizmatlar_jur152
            WHERE isdeleted = false 
                AND shartnoma_grafik_id = $1
            
            UNION ALL 

            SELECT 
                id, 
                'akt' AS type
            FROM bajarilgan_ishlar_jur3
            WHERE isdeleted = false 
                AND shartnoma_grafik_id = $1

            UNION ALL 

            SELECT 
                id, 
                'jur7_prixod' AS type
            FROM document_prixod_jur7
            WHERE isdeleted = false 
                AND shartnoma_grafik_id = $1
        `;

    const result = await db.query(query, params);

    return result;
  }

  static async create(params, client) {
    const query = `
            INSERT INTO shartnomalar_organization(
                doc_num, 
                doc_date, 
                summa, 
                opisanie, 
                user_id, 
                spravochnik_organization_id, 
                pudratchi_bool, 
                budjet_id
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id, doc_date
        `;

    const result = await client.query(query, params);

    return result.rows[0];
  }

  static async updateGrafik(params, client) {
    const query = `
            UPDATE shartnoma_grafik
            SET 
                oy_1 = $1,
                oy_2 = $2,
                oy_3 = $3,
                oy_4 = $4,
                oy_5 = $5,
                oy_6 = $6,
                oy_7 = $7,
                oy_8 = $8,
                oy_9 = $9,
                oy_10 = $10,
                oy_11 = $11,
                oy_12 = $12,
                year = $13, 
                yillik_oylik = $14,
                smeta_id = $15,
                itogo = $16
            WHERE id = $17
            RETURNING id
        `;

    const result = await client.query(query, params);

    return result.rows[0];
  }

  static async createGrafik(params, _values, client) {
    const query = `--sql
            INSERT INTO shartnoma_grafik(
                id_shartnomalar_organization, 
                user_id, 
                budjet_id, 
                year, 
                oy_1,
                oy_2,
                oy_3,
                oy_4,
                oy_5,
                oy_6,
                oy_7,
                oy_8,
                oy_9,
                oy_10,
                oy_11,
                oy_12,
                yillik_oylik,
                smeta_id,
                itogo
            ) 
            VALUES ${_values}
        `;

    const result = await client.query(query, params);

    return result.rows;
  }

  static async getById(params, isdeleted, budjet_id, organ_id) {
    const ignore = `AND d.isdeleted = false`;
    let budjet_filter = ``;
    let organ_filter = ``;

    if (budjet_id) {
      budjet_filter = `AND d.budjet_id = $${params.length + 1}`;
      params.push(budjet_id);
    }

    if (organ_id) {
      organ_filter = `AND so.id = $${params.length + 1}`;
      params.push(organ_id);
    }

    let query = `--sql
            SELECT 
                d.*,
                d.summa::FLOAT,
                row_to_json(so) AS organization,
                (
                    SELECT 
                        COALESCE(JSON_AGG(garfik), '[]'::JSON)
                        FROM (
                            SELECT 
                                g.*,
                                row_to_json(s) AS smeta
                            FROM shartnoma_grafik g
                            JOIN smeta s ON s.id = g.smeta_id
                            WHERE g.id_shartnomalar_organization = d.id
                                AND g.isdeleted = false
                        ) AS garfik
                ) AS grafiks
            FROM shartnomalar_organization AS d
            JOIN users AS u ON d.user_id = u.id
            JOIN regions AS r ON u.region_id = r.id
            JOIN spravochnik_organization so ON so.id = d.spravochnik_organization_id
            WHERE r.id = $1 
                AND d.id = $2 
                ${isdeleted ? "" : ignore} 
                ${budjet_filter} 
                ${organ_filter}
        `;
    const result = await db.query(query, params);

    return result[0];
  }

  static async get(
    params,
    organ_id,
    pudratchi,
    search = null,
    order_by,
    order_type
  ) {
    let search_filter = ``;
    let filter_organization = ``;
    let pudratchi_filter = ``;
    let order = ``;

    if (organ_id) {
      params.push(organ_id);
      filter_organization = `AND d.spravochnik_organization_id = $${params.length}`;
    }

    if (pudratchi === "true") {
      pudratchi_filter = `AND d.pudratchi_bool = true`;
    }

    if (pudratchi === "false") {
      pudratchi_filter = `AND d.pudratchi_bool = false`;
    }

    if (search) {
      params.push(search);
      search_filter = `AND (d.doc_num ILIKE '%' || $${params.length} || '%' OR d.opisanie ILIKE '%' || $${params.length} || '%')`;
    }

    if (order_by === "doc_num") {
      order = `ORDER BY 
        CASE WHEN d.doc_num ~ '^[0-9]+$' THEN d.doc_num::BIGINT ELSE NULL END ${order_type} NULLS LAST, 
        d.doc_num ${order_type}`;
    } else {
      order = `ORDER BY d.${order_by} ${order_type}`;
    }

    const query = `--sql
            WITH 
                data AS (
                    SELECT 
                        d.*,
                        row_to_json(so) AS organization,
                        (
                            SELECT 
                                COALESCE(JSON_AGG(garfik), '[]'::JSON)
                                FROM (
                                    SELECT 
                                        g.*,
                                        row_to_json(s) AS smeta
                                    FROM shartnoma_grafik g
                                    JOIN smeta s ON s.id = g.smeta_id
                                    WHERE g.id_shartnomalar_organization = d.id
                                        AND g.isdeleted = false
                                ) AS garfik
                        ) AS grafiks
                    FROM shartnomalar_organization AS d
                    JOIN users AS u ON d.user_id = u.id
                    JOIN regions AS r ON u.region_id = r.id
                    JOIN spravochnik_organization so ON so.id = d.spravochnik_organization_id
                    WHERE d.isdeleted = false 
                        ${filter_organization}
                        ${pudratchi_filter}
                        ${search_filter}
                        AND r.id = $1
                        AND d.budjet_id = $2
                    ${order}
                    OFFSET $3 LIMIT $4
                ) 
                SELECT 
                    COALESCE( JSON_AGG( row_to_json( data ) ), '[]'::JSON ) AS data,
                    (
                        SELECT COUNT(d.id) 
                        FROM shartnomalar_organization AS d
                        JOIN users AS u  ON d.user_id = u.id
                        JOIN regions AS r ON u.region_id = r.id
                        WHERE d.isdeleted = false ${filter_organization} ${pudratchi_filter} ${search_filter}
                            AND r.id = $1
                            AND d.budjet_id = $2
                    )::INTEGER AS total_count
                FROM data
        `;
    const data = await db.query(query, params);
    return { data: data[0]?.data || [], total: data[0]?.total_count };
  }

  static async getGrafiks(params) {
    const query = `
            SELECT 
                g.id,
                g.oy_1::FLOAT,
                g.oy_2::FLOAT,
                g.oy_3::FLOAT,
                g.oy_4::FLOAT,
                g.oy_5::FLOAT,
                g.oy_6::FLOAT,
                g.oy_7::FLOAT,
                g.oy_8::FLOAT,
                g.oy_9::FLOAT,
                g.oy_10::FLOAT,
                g.oy_11::FLOAT,
                g.oy_12::FLOAT,
                g.itogo::FLOAT AS summa,
                g.year,
                s.id smeta_id,
                s.smeta_number sub_schet
            FROM shartnoma_grafik AS g
            JOIN smeta s ON s.id = g.smeta_id 
            WHERE g.id_shartnomalar_organization = $1 
                AND g.budjet_id = $2 
                AND g.isdeleted = false
        `;

    const data = await db.query(query, params);

    return data;
  }

  static async deleteGrafiks(params, client) {
    const query = `UPDATE shartnoma_grafik SET isdeleted = true WHERE id_shartnomalar_organization = $1`;
    await client.query(query, params);
  }

  static async deleteGrafik(params, client) {
    const query = `
            UPDATE shartnoma_grafik 
            SET isdeleted = true 
            WHERE id_shartnomalar_organization = $1
                AND id = $2
        `;

    await client.query(query, params);
  }

  static async delete(params, client) {
    const query1 = `UPDATE shartnoma_grafik SET isdeleted = true WHERE id_shartnomalar_organization = $1`;
    const query2 = `UPDATE shartnomalar_organization SET isdeleted = true WHERE id = $1 RETURNING id`;

    await client.query(query1, params);
    const data = await client.query(query2, params);

    return data.rows[0];
  }

  static async getContractByOrganizations(params, organ_id) {
    let organ_filter = ``;
    if (organ_id) {
      params.push(organ_id);
      organ_filter = `AND so.id = $${params.length}`;
    }
    const query = `--sql
            SELECT 
                d.id AS contract_id,
                d.doc_num,
                TO_CHAR(d.doc_date, 'YYYY-MM-DD') AS doc_date,
                so.id,
                so.name
            FROM shartnomalar_organization d
            JOIN users u ON d.user_id = u.id
            JOIN regions r ON u.region_id = r.id
            JOIN spravochnik_organization so ON so.id = d.spravochnik_organization_id 
            WHERE d.isdeleted = false 
                AND r.id = $1
                ${organ_filter}
        `;
    const result = await db.query(query, params);
    return result;
  }

  static async update(params, client) {
    const query = `
            UPDATE shartnomalar_organization 
            SET 
                doc_num = $1, 
                doc_date = $2, 
                summa = $3, 
                opisanie = $4, 
                spravochnik_organization_id = $5, 
                pudratchi_bool = $6,
                yillik_oylik = $7
            WHERE id = $8 
            RETURNING id, doc_date
        `;

    const data = await client.query(query, params);

    return data.rows[0];
  }
};
