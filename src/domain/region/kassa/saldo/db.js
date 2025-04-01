const { db } = require("@db/index");

exports.KassaSaldoDB = class {
  static async create(params, client) {
    const query = `
            INSERT INTO kassa_saldo (
                doc_num, 
                doc_date, 
                prixod_summa,
                prixod,
                rasxod_summa,
                rasxod,
                opisanie, 
                main_schet_id,
                user_id,
                created_at
            ) 
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING id
        `;

    const result = await client.query(query, params);

    return result.rows[0];
  }

  static async createChild(params, _values, client) {
    const query = `
            INSERT INTO kassa_saldo_child (
                operatsii_id,
                summa,
                podraz_id,
                sostav_id,
                type_operatsii_id,
                main_schet_id,
                parent_id,
                user_id,
                created_at
          )
          VALUES ${_values}
        `;

    const result = await client.query(query, params);

    return result;
  }

  static async get(params, search = null) {
    let search_filter = ``;
    if (search) {
      params.push(search);
      search_filter = ` AND d.doc_num = $${params.length}`;
    }

    const query = `
            WITH data AS (
                SELECT 
                    d.*,
                    d.id::BIGINT,
                    d.prixod_summa::FLOAT,
                    d.rasxod_summa::FLOAT,
                    TO_CHAR(d.doc_date, 'YYYY-MM-DD') AS            doc_date, 
                    (
                        SELECT JSON_AGG(row_to_json(ch))
                        FROM (
                            SELECT 
                                so.schet AS provodki_schet,
                                so.sub_schet AS provodki_sub_schet
                            FROM kassa_saldo_child AS ch
                            JOIN spravochnik_operatsii AS so ON so.id = ch.operatsii_id
                            WHERE  ch.parent_id = d.id 
                                and ch.isdeleted = false
                        ) AS ch
                    ) AS provodki_array 
                FROM kassa_saldo AS d
                JOIN users AS u ON d.user_id = u.id
                JOIN regions AS r ON u.region_id = r.id
                WHERE d.main_schet_id = $2 
                    AND r.id = $1 
                    AND d.isdeleted = false 
                    AND doc_date BETWEEN $3 AND $4 
                    ${search_filter}
                ORDER BY d.doc_date 
                OFFSET $5 LIMIT $6
            )
                SELECT 
                    COALESCE( JSON_AGG( row_to_json( data ) ), '[]'::JSON ) AS data,
                    (
                        SELECT 
                            COALESCE(SUM(d.prixod_summa), 0)
                        FROM kassa_saldo d
                        JOIN users ON d.user_id = users.id
                        JOIN regions ON users.region_id = regions.id
                        WHERE d.main_schet_id = $2 
                            AND d.isdeleted = false 
                            AND regions.id = $1 
                            AND doc_date BETWEEN $3 AND $4
                            ${search_filter}
                    )::FLOAT AS prixod_summa,

                    (
                        SELECT 
                            COALESCE(SUM(d.prixod_summa), 0) - COALESCE(SUM(d.rasxod_summa), 0)
                        FROM kassa_saldo d
                        JOIN users ON d.user_id = users.id
                        JOIN regions ON users.region_id = regions.id
                        WHERE d.main_schet_id = $2 
                            AND d.isdeleted = false 
                            AND regions.id = $1 
                            AND doc_date < $3
                            ${search_filter}
                    )::FLOAT AS from_summa,

                    (
                        SELECT 
                            COALESCE(SUM(d.prixod_summa), 0)
                        FROM kassa_saldo d
                        JOIN users ON d.user_id = users.id
                        JOIN regions ON users.region_id = regions.id
                        WHERE d.main_schet_id = $2 
                            AND d.isdeleted = false 
                            AND regions.id = $1 
                            AND doc_date < $3
                            ${search_filter}
                    )::FLOAT AS from_summa_prixod,

                    (
                        SELECT 
                            COALESCE(SUM(d.rasxod_summa), 0)
                        FROM kassa_saldo d
                        JOIN users ON d.user_id = users.id
                        JOIN regions ON users.region_id = regions.id
                        WHERE d.main_schet_id = $2 
                            AND d.isdeleted = false 
                            AND regions.id = $1 
                            AND doc_date < $3
                            ${search_filter}
                    )::FLOAT AS from_summa_rasxod,

                    (
                        SELECT 
                            COALESCE(SUM(d.prixod_summa), 0) - COALESCE(SUM(d.rasxod_summa), 0)
                        FROM kassa_saldo d
                        JOIN users ON d.user_id = users.id
                        JOIN regions ON users.region_id = regions.id
                        WHERE d.main_schet_id = $2 
                            AND d.isdeleted = false 
                            AND regions.id = $1 
                            AND doc_date <= $4
                            ${search_filter}
                    )::FLOAT AS to_summa,

                    (
                        SELECT 
                            COALESCE(SUM(d.prixod_summa), 0)
                        FROM kassa_saldo d
                        JOIN users ON d.user_id = users.id
                        JOIN regions ON users.region_id = regions.id
                        WHERE d.main_schet_id = $2 
                            AND d.isdeleted = false 
                            AND regions.id = $1 
                            AND doc_date <= $4
                            ${search_filter}
                    )::FLOAT AS to_summa_prixod,

                    (
                        SELECT 
                            COALESCE(SUM(d.rasxod_summa), 0)
                        FROM kassa_saldo d
                        JOIN users ON d.user_id = users.id
                        JOIN regions ON users.region_id = regions.id
                        WHERE d.main_schet_id = $2 
                            AND d.isdeleted = false 
                            AND regions.id = $1 
                            AND doc_date <= $4
                            ${search_filter}
                    )::FLOAT AS to_summa_rasxod,

                    (
                        SELECT 
                            COALESCE(SUM(d.rasxod_summa), 0)
                        FROM kassa_saldo d
                        JOIN users ON d.user_id = users.id
                        JOIN regions ON users.region_id = regions.id
                        WHERE d.main_schet_id = $2 
                            AND d.isdeleted = false 
                            AND regions.id = $1 
                            AND doc_date BETWEEN $3 AND $4
                            ${search_filter}
                    )::FLOAT AS rasxod_summa,
                    (
                        SELECT 
                            COALESCE(COUNT(d.id), 0)
                        FROM kassa_saldo d
                        JOIN users ON d.user_id = users.id
                        JOIN regions ON users.region_id = regions.id
                        WHERE regions.id = $1 
                            AND d.main_schet_id = $2 
                            AND d.isdeleted = false 
                            AND doc_date BETWEEN $3 AND $4
                            ${search_filter}
                    )::FLOAT AS total_count
                FROM data
            `;

    const result = await db.query(query, params);

    return result[0];
  }

  static async getById(params, isdeleted) {
    const query = `
            SELECT 
                d.*,
                d.id,
                TO_CHAR(d.doc_date, 'YYYY-MM-DD') AS        doc_date,
                d.prixod_summa::FLOAT,
                d.rasxod_summa::FLOAT,
                (
                    SELECT JSON_AGG(row_to_json(ch))
                    FROM (
                        SELECT 
                            ch.*
                        FROM kassa_saldo_child AS ch
                        WHERE ch.parent_id = d.id 
                            AND isdeleted = false
                    ) AS ch
                ) AS childs 
            FROM kassa_saldo AS d
            JOIN users AS u ON d.user_id = u.id
            JOIN regions AS r ON u.region_id = r.id
            WHERE r.id = $1 
                AND d.main_schet_id = $2 
                AND d.id = $3
                ${!isdeleted ? "AND d.isdeleted = false" : ""}
        `;

    const result = await db.query(query, params);

    return result[0];
  }

  static async update(params, client) {
    const query = `
            UPDATE kassa_saldo SET 
                doc_num = $1, 
                doc_date = $2, 
                prixod_summa = $3,
                prixod = $4,
                rasxod_summa = $5,
                rasxod = $6,
                opisanie = $7, 
                updated_at = $8
            WHERE id = $9
            RETURNING id
        `;

    const result = await client.query(query, params);

    return result.rows[0];
  }

  static async deleteChild(params, client) {
    await client.query(
      `UPDATE kassa_saldo_child SET isdeleted = true WHERE id = $1`,
      params
    );
  }

  static async updateChild(params, client) {
    const query = `
            UPDATE kassa_saldo_child 
            SET 
                operatsii_id = $1,
                summa = $2,
                podraz_id = $3,
                sostav_id = $4,
                type_operatsii_id = $5,
                main_schet_id = $6,
                user_id = $7,
                updated_at = $8
            WHERE id = $9
        `;

    await client.query(query, params);
  }

  static async delete(params, client) {
    await client.query(
      `UPDATE kassa_saldo_child SET isdeleted = true WHERE parent_id = $1`,
      params
    );

    const result = await client.query(
      `UPDATE kassa_saldo SET isdeleted = true WHERE id = $1 RETURNING id`,
      params
    );

    return result.rows[0];
  }
};
