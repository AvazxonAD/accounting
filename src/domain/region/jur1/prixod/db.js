const { db } = require("@db/index");

exports.KassaPrixodDB = class {
  static async create(params, client) {
    const query = `--sql
            INSERT INTO kassa_prixod(
                doc_num, 
                doc_date, 
                opisanie, 
                summa, 
                id_podotchet_litso,
                main_schet_id, 
                user_id,
                organ_id, 
                contract_id, 
                contract_grafik_id,
                organ_account_id,
                organ_gazna_id,
                type,
                created_at,
                updated_at,
                main_zarplata_id
            ) 
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) 
            RETURNING id
        `;

    const result = await client.query(query, params);

    return result.rows[0];
  }

  static async createChild(params, _values, client) {
    const query = `--sql
            INSERT INTO kassa_prixod_child (
              spravochnik_operatsii_id,
              summa,
              id_spravochnik_podrazdelenie, 
              id_spravochnik_sostav, 
              id_spravochnik_type_operatsii,
              kassa_prixod_id,
              user_id, 
              main_schet_id, 
              created_at, 
              updated_at
          )
          VALUES ${_values}
        `;

    const result = await client.query(query, params);

    return result;
  }

  static async get(params, search = null, order_by, order_type) {
    let search_filter = ``;
    let order = ``;

    if (search) {
      params.push(search);
      search_filter = `AND (
                d.doc_num = $${params.length} OR 
                p.name ILIKE '%' || $${params.length} || '%'
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
                    p.name AS spravochnik_podotchet_litso_name,
                    p.rayon AS spravochnik_podotchet_litso_rayon,
                    d.main_zarplata_id,
                    mp.fio AS zarplata_fio,
                    so.name AS organization_name,
                    so.inn AS organization_inn,
                    (
                        SELECT JSON_AGG(row_to_json(ch))
                        FROM (
                            SELECT 
                                s_o.schet AS provodki_schet,
                                s_o.sub_schet AS provodki_sub_schet
                            FROM kassa_prixod_child AS ch
                            JOIN spravochnik_operatsii AS s_o ON s_o.id = ch.spravochnik_operatsii_id
                            WHERE  ch.kassa_prixod_id = d.id
                                AND ch.isdeleted = false
                        ) AS ch
                    ) AS provodki_array
                FROM kassa_prixod AS d
                JOIN users AS u ON u.id = d.user_id
                JOIN regions AS r ON r.id = u.region_id
                LEFT JOIN spravochnik_podotchet_litso AS p ON p.id = d.id_podotchet_litso
                LEFT JOIN spravochnik_organization AS so ON so.id = d.organ_id 
                LEFT JOIN main_zarplata AS mp ON mp.id = d.main_zarplata_id
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
                        COALESCE(SUM(d.summa), 0)
                    FROM kassa_prixod AS d
                    JOIN users AS u ON u.id = d.user_id
                    JOIN regions AS r ON r.id = u.region_id  
                    LEFT JOIN spravochnik_podotchet_litso AS p ON p.id = d.id_podotchet_litso
                    WHERE d.main_schet_id = $2 
                        AND r.id = $1
                        AND d.doc_date BETWEEN $3 AND $4 
                        AND d.isdeleted = false
                        ${search_filter}
                )::FLOAT AS summa,
                (
                    SELECT 
                        COALESCE(COUNT(d.id), 0)
                    FROM kassa_prixod AS d
                    JOIN users AS u ON u.id = d.user_id
                    JOIN regions AS r ON r.id = u.region_id  
                    LEFT JOIN spravochnik_podotchet_litso AS p ON p.id = d.id_podotchet_litso
                    WHERE r.id = $1 
                        AND d.main_schet_id = $2 
                        AND d.doc_date BETWEEN $3 AND $4 
                        AND d.isdeleted = false
                        ${search_filter}
                )::INTEGER AS total_count
            FROM data
        `;

    const result = await db.query(query, params);

    return result[0];
  }

  static async getById(params, isdeleted) {
    const query = `--sql
            SELECT 
                d.*,
                TO_CHAR(d.doc_date, 'YYYY-MM-DD') AS doc_date,
                p.name AS spravochnik_podotchet_litso_name,
                p.rayon AS spravochnik_podotchet_litso_rayon,
                row_to_json(p) AS podotchet,
                row_to_json(so) AS organ,
                row_to_json(ac) AS account_number,
                row_to_json(g) AS gazna_number,
                row_to_json(c) AS contract,
                row_to_json(cg) AS contract_grafik,
                d.main_zarplata_id,
                mp.fio AS zarplata_fio,
                (
                    SELECT JSON_AGG(row_to_json(ch))
                    FROM (
                      SELECT      
                          ch.*,
                          op.schet,
                          row_to_json(op) AS operatsii,
                          row_to_json(sp) AS podrazdelenie,
                          row_to_json(sto) AS type_operatsii,
                          row_to_json(so) AS sostav
                      FROM kassa_prixod_child AS ch 
                      JOIN spravochnik_operatsii op ON op.id = ch.spravochnik_operatsii_id
                      LEFT JOIN spravochnik_podrazdelenie sp ON sp.id = ch.id_spravochnik_podrazdelenie
                      LEFT JOIN spravochnik_sostav so ON sp.id = ch.id_spravochnik_sostav
                      LEFT JOIN spravochnik_type_operatsii sto ON sto.id = ch.id_spravochnik_type_operatsii
                      JOIN users AS u ON u.id = d.user_id
                      JOIN regions AS r ON r.id = u.region_id   
                      WHERE r.id = $1
                        AND ch.main_schet_id = $2
                        AND ch.kassa_prixod_id = d.id
                    ) AS ch
                ) AS childs,
                row_to_json(p) AS podotchet
            FROM kassa_prixod AS d
            JOIN users AS u ON u.id = d.user_id
            JOIN regions AS r ON r.id = u.region_id
            LEFT JOIN spravochnik_podotchet_litso AS p ON p.id = d.id_podotchet_litso
            LEFT JOIN spravochnik_organization AS so ON so.id = d.organ_id
            LEFT JOIN organization_by_raschet_schet_gazna g ON g.spravochnik_organization_id = so.id
            LEFT JOIN organization_by_raschet_schet ac ON ac.spravochnik_organization_id = so.id
            LEFT JOIN shartnomalar_organization c ON c.id = d.contract_grafik_id
            LEFT JOIN shartnoma_grafik cg ON cg.id = d.contract_grafik_id
            LEFT JOIN main_zarplata AS mp ON mp.id = d.main_zarplata_id
            WHERE r.id = $1 
                AND d.main_schet_id = $2 
                AND d.id = $3
                ${!isdeleted ? "AND d.isdeleted = false" : ""}
        `;

    const result = await db.query(query, params);

    return result[0];
  }

  static async update(params, client) {
    const result = await client.query(
      `--sql
            UPDATE kassa_prixod SET 
                doc_num = $1, 
                doc_date = $2, 
                opisanie = $3, 
                summa = $4, 
                id_podotchet_litso = $5,
                organ_id = $6,
                contract_id = $7,
                contract_grafik_id = $8,
                organ_account_id = $9,
                organ_gazna_id = $10,
                type = $11,
                updated_at = $12,
                main_zarplata_id = $13
            WHERE id = $14 RETURNING id 
        `,
      params
    );

    return result.rows[0];
  }

  static async deleteChild(params, client) {
    await client.query(
      `DELETE FROM kassa_prixod_child  WHERE kassa_prixod_id = $1`,
      params
    );
  }

  static async delete(params, client) {
    await client.query(
      `UPDATE kassa_prixod_child SET isdeleted = true WHERE kassa_prixod_id = $1`,
      params
    );

    const result = await client.query(
      `UPDATE kassa_prixod SET isdeleted = true WHERE id = $1 RETURNING id`,
      params
    );

    return result.rows[0];
  }
};
