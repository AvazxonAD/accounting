const { db } = require("@db/index");

exports.AktDB = class {
  static async get(params, search = null, order_by, order_type) {
    let search_filter = ``;
    let order = ``;

    if (search) {
      params.push(search);
      search_filter = `AND (
                d.doc_num = $${params.length} OR 
                so.inn ILIKE '%' || $${params.length} || '%'
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
                    d.id, 
                    d.doc_num,
                    TO_CHAR(d.doc_date, 'YYYY-MM-DD') AS doc_date, 
                    d.opisanie, 
                    (
                        SELECT 
                            COALESCE(SUM(ch.summa), 0)
                        FROM bajarilgan_ishlar_jur3_child AS ch
                        JOIN spravochnik_operatsii AS so ON so.id = ch.spravochnik_operatsii_id
                        WHERE  ch.bajarilgan_ishlar_jur3_id = d.id
                            AND  ch.isdeleted = false
                    )::FLOAT AS summa, 
                    d.id_spravochnik_organization,
                    so.name AS spravochnik_organization_name,
                    so.raschet_schet AS spravochnik_organization_raschet_schet,
                    so.inn AS spravochnik_organization_inn, 
                    d.shartnomalar_organization_id,
                    sh_o.doc_num AS shartnomalar_organization_doc_num,
                    TO_CHAR(sh_o.doc_date, 'YYYY-MM-DD') AS shartnomalar_organization_doc_date,
                    (
                        SELECT JSON_AGG(row_to_json(ch))
                        FROM (
                            SELECT 
                                so.schet AS provodki_schet,
                                so.sub_schet AS provodki_sub_schet
                            FROM bajarilgan_ishlar_jur3_child AS ch
                            JOIN spravochnik_operatsii AS so ON so.id = ch.spravochnik_operatsii_id
                            WHERE  ch.bajarilgan_ishlar_jur3_id = d.id
                                AND  ch.isdeleted = false
                        ) AS ch
                    ) AS provodki_array,
                    d.organization_by_raschet_schet_id::INTEGER,
                    d.organization_by_raschet_schet_gazna_id::INTEGER,
                    d.shartnoma_grafik_id::INTEGER
                FROM  bajarilgan_ishlar_jur3 AS d 
                JOIN users AS u ON d.user_id = u.id
                JOIN regions AS r ON u.region_id = r.id
                JOIN spravochnik_organization AS so ON so.id = d.id_spravochnik_organization
                LEFT JOIN shartnomalar_organization AS sh_o ON sh_o.id = d.shartnomalar_organization_id
                WHERE r.id = $1 
                    AND d.main_schet_id = $2 
                    AND d.isdeleted = false 
                    AND d.doc_date BETWEEN $3 AND $4
                    ${search_filter}
                
                ${order}
                
                OFFSET $5 LIMIT $6
            )
            SELECT 
                COALESCE( JSON_AGG( row_to_json( data ) ), '[]'::JSON ) AS data,
                (
                    SELECT 
                        COALESCE(COUNT(d.id), 0)::INTEGER
                    FROM bajarilgan_ishlar_jur3 AS d 
                    JOIN users AS u  ON d.user_id = u.id
                    JOIN regions AS r ON u.region_id = r.id
                    JOIN spravochnik_organization AS so ON so.id = d.id_spravochnik_organization
                    WHERE r.id = $1 
                        AND d.main_schet_id = $2 
                        AND d.isdeleted = false 
                        AND d.doc_date BETWEEN $3 AND $4
                        ${search_filter}
                ) AS total, 
                (
                    SELECT 
                        COALESCE(SUM(ch.summa), 0)::FLOAT
                    FROM bajarilgan_ishlar_jur3 AS d 
                    JOIN bajarilgan_ishlar_jur3_child ch ON ch.bajarilgan_ishlar_jur3_id = d.id
                    JOIN spravochnik_organization AS so ON so.id = d.id_spravochnik_organization
                    JOIN users AS u  ON d.user_id = u.id
                    JOIN regions AS r ON u.region_id = r.id
                    WHERE r.id = $1 
                        AND d.main_schet_id = $2 
                        AND d.isdeleted = false
                        AND d.doc_date BETWEEN $3 AND $4
                        AND ch.isdeleted = false
                        ${search_filter}
                ) AS summa
            FROM data
        `;

    const result = await db.query(query, params);

    return {
      data: result[0].data || [],
      total: result[0].total,
      summa: result[0].summa,
    };
  }

  static async create(params, client) {
    const query = `--sql 
            INSERT INTO bajarilgan_ishlar_jur3(
                doc_num, 
                doc_date, 
                opisanie, 
                summa, 
                id_spravochnik_organization, 
                shartnomalar_organization_id, 
                main_schet_id,
                user_id,
                organization_by_raschet_schet_id,
                organization_by_raschet_schet_gazna_id,
                shartnoma_grafik_id,
                created_at,
                updated_at
            ) 
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) 
            RETURNING id
        `;
    const result = await client.query(query, params);
    return result.rows[0];
  }

  static async createChild(params, _values, client) {
    const query = `--sql
            INSERT INTO bajarilgan_ishlar_jur3_child(
                spravochnik_operatsii_id,
                summa,
                id_spravochnik_podrazdelenie,
                id_spravochnik_sostav,
                id_spravochnik_type_operatsii,
                main_schet_id,
                bajarilgan_ishlar_jur3_id,
                user_id,
                kol,
                sena,
                nds_foiz,
                nds_summa,
                summa_s_nds,
                created_at,
                updated_at
            ) 
            VALUES ${_values}
        `;

    const result = await client.query(query, params);

    return result.rows;
  }

  static async getById(params, isdeleted) {
    const query = `--sql
            SELECT 
                d.id, 
                d.doc_num,
                TO_CHAR(d.doc_date, 'YYYY-MM-DD') AS doc_date, 
                d.opisanie, 
                (
                    SELECT 
                        COALESCE(SUM(ch.summa), 0)
                    FROM bajarilgan_ishlar_jur3_child AS ch
                    JOIN spravochnik_operatsii AS so ON so.id = ch.spravochnik_operatsii_id
                    WHERE  ch.bajarilgan_ishlar_jur3_id = d.id
                        AND  ch.isdeleted = false
                )::FLOAT AS summa, 
                d.id_spravochnik_organization,
                so.name AS spravochnik_organization_name,
                so.raschet_schet AS spravochnik_organization_raschet_schet,
                so.inn AS spravochnik_organization_inn, 
                d.shartnomalar_organization_id,
                sh_o.doc_num AS shartnomalar_organization_doc_num,
                TO_CHAR(sh_o.doc_date, 'YYYY-MM-DD') AS shartnomalar_organization_doc_date,
                (
                    SELECT JSON_AGG(row_to_json(ch))
                    FROM (
                        SELECT  
                        ch.id,
                        ch.bajarilgan_ishlar_jur3_id,
                        ch.spravochnik_operatsii_id,
                        so.name AS spravochnik_operatsii_name,
                        ch.summa::FLOAT,
                        ch.id_spravochnik_podrazdelenie,
                        s_p.name AS spravochnik_podrazdelenie_name,
                        ch.id_spravochnik_sostav,
                        s_s.name AS spravochnik_sostav_name,
                        ch.id_spravochnik_type_operatsii,
                        s_t_o.name AS spravochnik_type_operatsii_name,
                        ch.kol,
                        ch.sena,
                        ch.nds_foiz,
                        ch.nds_summa,
                        ch.summa_s_nds
                        FROM bajarilgan_ishlar_jur3_child AS ch
                        JOIN users AS u ON ch.user_id = u.id
                        JOIN regions AS r ON u.region_id = r.id
                        JOIN spravochnik_operatsii AS so ON so.id = ch.spravochnik_operatsii_id
                        LEFT JOIN spravochnik_podrazdelenie AS s_p ON s_p.id = ch.id_spravochnik_podrazdelenie
                        LEFT JOIN spravochnik_sostav AS s_s ON s_s.id = ch.id_spravochnik_sostav
                        LEFT JOIN spravochnik_type_operatsii AS s_t_o ON s_t_o.id = ch.id_spravochnik_type_operatsii
                        WHERE ch.bajarilgan_ishlar_jur3_id = d.id
                    ) AS ch
                ) AS childs,
                d.organization_by_raschet_schet_id::INTEGER,
                d.organization_by_raschet_schet_gazna_id::INTEGER,
                d.shartnoma_grafik_id::INTEGER
            FROM  bajarilgan_ishlar_jur3 AS d 
            JOIN users AS u ON d.user_id = u.id
            JOIN regions AS r ON u.region_id = r.id
            JOIN spravochnik_organization AS so ON so.id = d.id_spravochnik_organization
            LEFT JOIN shartnomalar_organization AS sh_o ON sh_o.id = d.shartnomalar_organization_id
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
            UPDATE bajarilgan_ishlar_jur3
            SET 
                doc_num = $1, 
                doc_date = $2, 
                opisanie = $3, 
                summa = $4, 
                id_spravochnik_organization = $5, 
                shartnomalar_organization_id = $6, 
                organization_by_raschet_schet_id = $7,
                organization_by_raschet_schet_gazna_id = $8,
                shartnoma_grafik_id = $9,
                updated_at = $10
            WHERE id = $11 RETURNING id
        `;
    const result = await client.query(query, params);

    return result.rows[0];
  }

  static async deleteChild(params, client) {
    const query = `DELETE FROM bajarilgan_ishlar_jur3_child WHERE bajarilgan_ishlar_jur3_id = $1`;
    await client.query(query, params);
  }

  static async delete(params, client) {
    await client.query(
      `UPDATE bajarilgan_ishlar_jur3_child SET isdeleted = true WHERE bajarilgan_ishlar_jur3_id = $1`,
      params
    );
    const result = await client.query(
      `UPDATE bajarilgan_ishlar_jur3 SET  isdeleted = true WHERE id = $1 RETURNING id`,
      params
    );

    return result.rows[0];
  }

  static async cap(params) {
    const query = `--sql
            SELECT 
                so.schet, 
                s.smeta_number, 
                COALESCE(SUM(ch.summa::FLOAT), 0) AS summa
            FROM bajarilgan_ishlar_jur3 AS d 
            JOIN bajarilgan_ishlar_jur3_child AS ch ON ch.bajarilgan_ishlar_jur3_id = d.id
            JOIN spravochnik_operatsii AS so ON so.id = ch.spravochnik_operatsii_id
            JOIN users AS u ON u.id = d.user_id
            JOIN regions AS r ON r.id = u.region_id
            JOIN smeta AS s ON s.id = so.smeta_id
            WHERE d.doc_date BETWEEN $1 AND $2 
                AND r.id = $3 
                AND s_own.schet = $4 
                AND d.main_schet_id = $5
                AND ch.isdeleted = false

            GROUP BY so.schet, s.smeta_number
        `;
    const data = await db.query(query, params);
    return data;
  }

  static async getSchets(params) {
    const query = `--sql
            SELECT
                DISTINCT so.schet
            FROM bajarilgan_ishlar_jur3 AS d
            JOIN bajarilgan_ishlar_jur3_child ch ON ch.bajarilgan_ishlar_jur3_id = d.id
            JOIN spravochnik_operatsii AS so  ON ch.spravochnik_operatsii_id = so.id
            JOIN users AS u ON u.id = d.user_id
            JOIN regions AS r ON r.id = u.region_id
            WHERE  r.id = $1 
                AND d.isdeleted = false 
                AND d.main_schet_id = $2 
                AND d.doc_date BETWEEN $3 AND $4
        `;

    const schets = await db.query(query, params);

    return schets;
  }
};
