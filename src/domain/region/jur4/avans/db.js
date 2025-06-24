const { db } = require("@db/index");

exports.AvansDB = class {
  static async get(params, search = null, order_by, order_type) {
    let search_filter = ``;
    let order = ``;
    if (search) {
      params.push(search);
      search_filter = ` AND (
                d.doc_num = $${params.length} OR 
                sp.name ILIKE '%' || $${params.length} || '%'
            )`;
    }

    if (order_by === "doc_num") {
      order = `ORDER BY 
        CASE WHEN d.doc_num ~ '^[0-9]+$' THEN d.doc_num::BIGINT ELSE NULL END ${order_type} NULLS LAST, 
        d.doc_num ${order_type}`;
    } else {
      order = `ORDER BY d.${order_by} ${order_type}`;
    }

    const query = `--sql
            WITH data AS (
                SELECT 
                    d.*, 
                    TO_CHAR(d.doc_date, 'YYYY-MM-DD') AS doc_date, 
                    d.summa::FLOAT, 
                    d.spravochnik_podotchet_litso_id AS id_spravochnik_podotchet_litso,  
                    sp.name AS spravochnik_podotchet_litso_name,
                    sp.rayon AS spravochnik_podotchet_litso_rayon,
                    (
                        SELECT JSON_AGG(row_to_json(a_j_ch))
                        FROM (
                            SELECT 
                                so.schet AS provodki_schet,
                                so.sub_schet AS provodki_sub_schet
                            FROM avans_otchetlar_jur4_child AS a_j_ch
                            JOIN spravochnik_operatsii AS so ON so.id = a_j_ch.spravochnik_operatsii_id
                            WHERE  a_j_ch.avans_otchetlar_jur4_id = d.id 
                        ) AS a_j_ch
                    ) AS provodki_array,
                    u.login,
                    u.fio
                FROM avans_otchetlar_jur4 AS d
                JOIN users AS u ON u.id =  d.user_id
                JOIN regions AS r ON u.region_id = r.id
                JOIN spravochnik_podotchet_litso AS sp ON sp.id = d.spravochnik_podotchet_litso_id 
                WHERE r.id = $1 
                    AND d.main_schet_id = $2 
                    AND d.isdeleted = false 
                    AND d.doc_date BETWEEN $3 AND $4
                    AND d.schet_id = $5
                    ${search_filter}
                ${order}
                OFFSET $6 LIMIT $7
            ) 
            SELECT 
                COALESCE( JSON_AGG( row_to_json( data ) ), '[]'::JSON ) AS data,
                (
                    SELECT COALESCE(COUNT(d.id), 0)
                    FROM avans_otchetlar_jur4 AS d
                    JOIN users AS u ON u.id =  d.user_id
                    JOIN regions AS r ON u.region_id = r.id
                    JOIN spravochnik_podotchet_litso AS sp ON sp.id = d.spravochnik_podotchet_litso_id 
                    WHERE r.id = $1 
                        AND d.main_schet_id = $2 
                        AND d.isdeleted = false 
                        AND d.doc_date BETWEEN $3 AND $4
                        AND d.schet_id = $5
                        ${search_filter}
                )::INTEGER AS total_count,
                (
                    SELECT COALESCE(SUM(d.summa), 0)
                    FROM avans_otchetlar_jur4 AS d
                    JOIN users AS u ON u.id =  d.user_id
                    JOIN regions AS r ON u.region_id = r.id
                    JOIN spravochnik_podotchet_litso AS sp ON sp.id = d.spravochnik_podotchet_litso_id 
                    WHERE r.id = $1 
                        AND d.main_schet_id = $2 
                        AND d.isdeleted = false 
                        AND d.doc_date BETWEEN $3 AND $4
                        AND d.schet_id = $5
                        ${search_filter}
                )::FLOAT AS summa
            FROM data
        `;

    const result = await db.query(query, params);

    return {
      data: result[0].data || [],
      summa: result[0].summa,
      total_count: result[0].total_count,
    };
  }

  static async create(params, client) {
    const query = `--sql 
            INSERT INTO avans_otchetlar_jur4(
                doc_num, 
                doc_date,
                opisanie, 
                summa,
                spravochnik_podotchet_litso_id, 
                main_schet_id, 
                user_id,
                schet_id,
                created_at, 
                updated_at
            ) 
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
            RETURNING id
        `;
    const result = await client.query(query, params);
    return result.rows[0];
  }

  static async createChild(params, _values, client) {
    const query = `--sql
            INSERT INTO avans_otchetlar_jur4_child(
                spravochnik_operatsii_id,
                summa,
                id_spravochnik_podrazdelenie,
                id_spravochnik_sostav,
                id_spravochnik_type_operatsii,
                main_schet_id,
                avans_otchetlar_jur4_id,
                user_id,
                created_at,
                updated_at
            )
            VALUES ${_values}
        `;

    await client.query(query, params);
  }

  static async getById(params, isdeleted) {
    const query = `--sql
            SELECT 
                d.*, 
                TO_CHAR(d.doc_date, 'YYYY-MM-DD') AS doc_date, 
                d.summa::FLOAT, 
                d.spravochnik_podotchet_litso_id AS id_spravochnik_podotchet_litso,
                sp.name AS spravochnik_podotchet_litso_name,
                sp.rayon AS spravochnik_podotchet_litso_rayon,
                row_to_json(sp) AS podotchet,
                (
                    SELECT JSON_AGG(row_to_json(a_o_j_4_child))
                    FROM (
                        SELECT   
                            ch.id,
                            ch.spravochnik_operatsii_id,
                            so.name AS spravochnik_operatsii_name,
                            ch.summa::FLOAT,
                            ch.id_spravochnik_podrazdelenie,
                            s_p.name AS spravochnik_podrazdelenie_name,
                            ch.id_spravochnik_sostav,
                            s_s.name AS spravochnik_sostav_name,
                            ch.id_spravochnik_type_operatsii,
                            s_t_o.name AS spravochnik_type_operatsii_name,
                            row_to_json(so) AS operatsii,
                            row_to_json(s_p) AS podrazdelenie,
                            row_to_json(s_t_o) AS type_operatsii,
                            row_to_json(s_s) AS sostav
                        FROM  avans_otchetlar_jur4_child AS ch 
                        JOIN spravochnik_operatsii AS so ON so.id = ch.spravochnik_operatsii_id
                        LEFT JOIN spravochnik_podrazdelenie AS s_p ON s_p.id = ch.id_spravochnik_podrazdelenie
                        LEFT JOIN spravochnik_sostav AS s_s ON s_s.id = ch.id_spravochnik_sostav
                        LEFT JOIN spravochnik_type_operatsii AS s_t_o ON s_t_o.id = ch.id_spravochnik_type_operatsii
                        WHERE ch.avans_otchetlar_jur4_id = $3
                          AND ch.isdeleted = false
                    ) AS a_o_j_4_child
                ) AS childs
            FROM avans_otchetlar_jur4 AS d
            JOIN users AS u ON u.id = d.user_id
            JOIN regions AS r ON u.region_id = r.id
            JOIN spravochnik_podotchet_litso AS sp ON sp.id = d.spravochnik_podotchet_litso_id 
            WHERE r.id = $1 
                AND d.main_schet_id = $2 
                AND d.id = $3
                ${!isdeleted ? "AND d.isdeleted = false" : ""}   
        `;
    const data = await db.query(query, params);
    return data[0];
  }

  static async update(params, client) {
    const query = `--sql
            UPDATE avans_otchetlar_jur4 SET 
                doc_num = $1, 
                doc_date = $2, 
                opisanie = $3,
                summa = $4,
                spravochnik_podotchet_litso_id = $5,
                schet_id = $6,
                updated_at = $7
            WHERE id = $8 RETURNING id
        `;
    const result = await client.query(query, params);

    return result.rows[0];
  }

  static async deleteChild(params, client) {
    const query = `DELETE FROM avans_otchetlar_jur4_child WHERE avans_otchetlar_jur4_id = $1`;
    await client.query(query, params);
  }

  static async delete(params, client) {
    await client.query(
      `UPDATE avans_otchetlar_jur4_child SET isdeleted = true WHERE avans_otchetlar_jur4_id = $1`,
      params
    );
    const result = await client.query(
      `UPDATE avans_otchetlar_jur4 SET  isdeleted = true WHERE id = $1 RETURNING id`,
      params
    );

    return result.rows[0];
  }
};
