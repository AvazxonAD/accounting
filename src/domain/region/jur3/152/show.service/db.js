const { db } = require("@db/index");
const { returnParamsValues, designParams } = require("@helper/functions");

exports.ShowServiceDB = class {
  static async getById(params, isdeleted) {
    const ignore = "AND d.isdeleted = false";
    const query = `--sql
            SELECT 
                d.*,
                TO_CHAR(d.doc_date, 'YYYY-MM-DD') AS doc_date,
                d.summa::FLOAT,
                row_to_json(so) AS organ,
                row_to_json(ac) AS account_number,
                row_to_json(g) AS gazna_number,
                row_to_json(c) AS contract,
                row_to_json(cg) AS contract_grafik,
                (
                    SELECT JSON_AGG(row_to_json(ch))
                    FROM (
                            SELECT  
                                ch.id,
                                ch.kursatilgan_hizmatlar_jur152_id,
                                ch.spravochnik_operatsii_id,
                                ch.summa::FLOAT,
                                ch.id_spravochnik_podrazdelenie,
                                ch.id_spravochnik_sostav,
                                ch.id_spravochnik_type_operatsii,
                                ch.kol,
                                ch.sena,
                                ch.nds_foiz,
                                ch.nds_summa,
                                ch.summa_s_nds,
                                row_to_json(so) AS operatsii,
                                row_to_json(s_p) AS podrazdelenie,
                                row_to_json(s_t_o) AS type_operatsii,
                                row_to_json(s_s) AS sostav
                            FROM kursatilgan_hizmatlar_jur152_child AS ch
                            JOIN users AS u ON ch.user_id = u.id
                            JOIN regions AS r ON u.region_id = r.id
                            JOIN spravochnik_operatsii AS so ON so.id = ch.spravochnik_operatsii_id
                            LEFT JOIN spravochnik_podrazdelenie AS s_p ON s_p.id = ch.id_spravochnik_podrazdelenie
                            LEFT JOIN spravochnik_sostav AS s_s ON s_s.id = ch.id_spravochnik_sostav
                            LEFT JOIN spravochnik_type_operatsii AS s_t_o ON s_t_o.id = ch.id_spravochnik_type_operatsii
                            WHERE ch.kursatilgan_hizmatlar_jur152_id = d.id
                              AND ch.isdeleted = false

                        ) AS ch
                ) AS childs,
                d.organization_by_raschet_schet_id::INTEGER,
                d.organization_by_raschet_schet_gazna_id::INTEGER,
                d.shartnoma_grafik_id::INTEGER
            FROM kursatilgan_hizmatlar_jur152 AS d
            LEFT JOIN spravochnik_organization AS so ON so.id = d.id_spravochnik_organization
            LEFT JOIN organization_by_raschet_schet_gazna g ON g.id = d.organization_by_raschet_schet_gazna_id
            LEFT JOIN organization_by_raschet_schet ac ON ac.id = d.organization_by_raschet_schet_id
            LEFT JOIN shartnomalar_organization c ON c.id = d.shartnomalar_organization_id
            LEFT JOIN shartnoma_grafik cg ON cg.id = d.shartnoma_grafik_id
            JOIN users AS u ON u.id = d.user_id
            JOIN regions AS r ON u.region_id = r.id
            WHERE r.id = $1 AND d.id = $2 AND d.main_schet_id = $3 ${!isdeleted ? ignore : ""}
        `;

    const result = await db.query(query, params);

    return result[0];
  }

  static async create(params, client) {
    const query = `--sql
            INSERT INTO kursatilgan_hizmatlar_jur152(
                user_id,
                doc_num,
                doc_date,
                summa,
                opisanie,
                id_spravochnik_organization,
                shartnomalar_organization_id,
                main_schet_id,
                organization_by_raschet_schet_id,
                organization_by_raschet_schet_gazna_id,
                shartnoma_grafik_id,
                schet_id,
                created_at,
                updated_at
            )
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
            RETURNING *
        `;
    const result = await client.query(query, params);
    return result.rows[0];
  }

  static async createShowServiceChild(params, client) {
    const design_params = [
      "user_id",
      "spravochnik_operatsii_id",
      "summa",
      "id_spravochnik_podrazdelenie",
      "id_spravochnik_sostav",
      "id_spravochnik_type_operatsii",
      "kursatilgan_hizmatlar_jur152_id",
      "main_schet_id",
      "kol",
      "sena",
      "nds_foiz",
      "nds_summa",
      "summa_s_nds",
      "created_at",
      "updated_at",
    ];

    const _params = designParams(params, design_params);
    const _values = returnParamsValues(_params, 15);

    const query = `--sql
            INSERT INTO kursatilgan_hizmatlar_jur152_child(
                user_id,
                spravochnik_operatsii_id,
                summa,
                id_spravochnik_podrazdelenie,
                id_spravochnik_sostav,
                id_spravochnik_type_operatsii,
                kursatilgan_hizmatlar_jur152_id,
                main_schet_id,
                kol,
                sena,
                nds_foiz,
                nds_summa,
                summa_s_nds,
                created_at,
                updated_at
            ) VALUES ${_values}
        `;

    await client.query(query, _params);
  }
  static async get(params, search = null, order_by, order_type) {
    let search_filter = ``;
    let order = ``;

    if (search) {
      params.push(search);
      search_filter = `AND (
                d.doc_num = $${params.length} OR 
                so.name ILIKE '%' || $${params.length} || '%' OR 
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
                    d.*,
                    TO_CHAR(d.doc_date, 'YYYY-MM-DD') AS doc_date,
                    so.name AS spravochnik_organization_name,
                    so.raschet_schet AS spravochnik_organization_raschet_schet,
                    so.inn AS spravochnik_organization_inn,
                    sho.doc_num AS shartnomalar_organization_doc_num,
                    sho.doc_date AS shartnomalar_organization_doc_date,
                    d.summa::FLOAT,
                    (
                        SELECT JSON_AGG(row_to_json(ch))
                        FROM (
                            SELECT 
                                so.schet AS provodki_schet,
                                so.sub_schet AS provodki_sub_schet
                            FROM kursatilgan_hizmatlar_jur152_child AS ch
                            JOIN spravochnik_operatsii AS so ON so.id = ch.spravochnik_operatsii_id
                            WHERE  ch.kursatilgan_hizmatlar_jur152_id = d.id 
                        ) AS ch
                    ) AS provodki_array,
                    d.organization_by_raschet_schet_id::INTEGER,
                    d.organization_by_raschet_schet_gazna_id::INTEGER,
                    d.shartnoma_grafik_id::INTEGER
                FROM kursatilgan_hizmatlar_jur152 AS d
                JOIN users AS u ON u.id = d.user_id
                JOIN regions AS r ON u.region_id = r.id
                JOIN spravochnik_organization AS so ON so.id = d.id_spravochnik_organization
                LEFT JOIN shartnomalar_organization AS sho ON sho.id = d.shartnomalar_organization_id
                WHERE r.id = $1 
                    AND d.doc_date BETWEEN $2 AND $3 
                    AND d.main_schet_id = $4 
                    AND d.isdeleted = false
                    AND d.schet_id = $5
                    ${search_filter}    
                
                ${order}
                
                OFFSET $6 LIMIT $7 
            )
            SELECT 
            COALESCE( JSON_AGG( row_to_json( data ) ), '[]'::JSON ) AS data,
            (SELECT COUNT(d.id) 
                FROM kursatilgan_hizmatlar_jur152 AS d
                JOIN users AS u ON u.id = d.user_id
                JOIN regions AS r ON u.region_id = r.id
                JOIN spravochnik_organization AS so ON so.id = d.id_spravochnik_organization
                WHERE r.id = $1 
                    AND d.doc_date BETWEEN $2 AND $3 
                    AND d.main_schet_id = $4 
                    AND d.isdeleted = false
                    AND d.schet_id = $5
                    ${search_filter}
            )::INTEGER AS total_count,
            (
                SELECT 
                    COALESCE(SUM(d.summa), 0) 
                FROM kursatilgan_hizmatlar_jur152 AS d
                JOIN users AS u ON u.id = d.user_id
                JOIN regions AS r ON u.region_id = r.id
                JOIN spravochnik_organization AS so ON so.id = d.id_spravochnik_organization
                WHERE r.id = $1 
                    AND d.doc_date BETWEEN $2 AND $3 
                    AND d.main_schet_id = $4 
                    AND d.isdeleted = false
                    AND d.schet_id = $5
                    ${search_filter}
            )::FLOAT AS summa
            FROM data
        `;
    const result = await db.query(query, params);

    return result[0];
  }

  static async update(params, client) {
    const query = `--sql
            UPDATE kursatilgan_hizmatlar_jur152
            SET 
                doc_num = $1, 
                doc_date = $2, 
                opisanie = $3, 
                summa = $4, 
                id_spravochnik_organization = $5, 
                shartnomalar_organization_id = $6, 
                updated_at = $7,
                organization_by_raschet_schet_id = $8,
                organization_by_raschet_schet_gazna_id = $9,
                shartnoma_grafik_id = $10,
                schet_id = $11
            WHERE id = $12
            RETURNING *
        `;
    const result = await client.query(query, params);
    return result.rows[0];
  }

  static async deleteShowServiceChild(params, client) {
    const query = `DELETE FROM kursatilgan_hizmatlar_jur152_child WHERE kursatilgan_hizmatlar_jur152_id = $1`;
    await client.query(query, params);
  }

  static async delete(params, client) {
    await client.query(
      `UPDATE kursatilgan_hizmatlar_jur152_child SET isdeleted = true WHERE kursatilgan_hizmatlar_jur152_id = $1`,
      params
    );

    const result = await client.query(
      `UPDATE kursatilgan_hizmatlar_jur152 SET  isdeleted = true WHERE id = $1 RETURNING id`,
      params
    );

    return result.rows[0];
  }
};
