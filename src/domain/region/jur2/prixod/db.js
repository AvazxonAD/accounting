const { db } = require("@db/index");

exports.BankPrixodDB = class {
  static async create(params, client) {
    const query = `--sql
            INSERT INTO bank_prixod(
                doc_num, 
                doc_date, 
                summa, 
                provodki_boolean, 
                opisanie, 
                id_spravochnik_organization, 
                id_shartnomalar_organization, 
                main_schet_id, 
                user_id,
                organization_by_raschet_schet_id,
                organization_by_raschet_schet_gazna_id,
                shartnoma_grafik_id
            ) 
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
            RETURNING id
        `;

    const result = await client.query(query, params);

    return result.rows[0];
  }

  static async createChild(params, _values, client) {
    const query = `
            INSERT INTO bank_prixod_child (
                spravochnik_operatsii_id,
                summa,
                id_spravochnik_podrazdelenie,
                id_spravochnik_sostav,
                id_spravochnik_type_operatsii,
                id_spravochnik_podotchet_litso,
                main_schet_id,
                id_bank_prixod,
                user_id,
                main_zarplata_id
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
      search_filter = ` AND (
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
                    d.summa, 
                    d.provodki_boolean, 
                    d.dop_provodki_boolean, 
                    d.opisanie, 
                    d.id_spravochnik_organization, 
                    so.name AS spravochnik_organization_name,
                    so.okonx AS spravochnik_organization_okonx,
                    so.bank_klient AS spravochnik_organization_bank_klient,
                    so.raschet_schet AS spravochnik_organization_raschet_schet,
                    so.raschet_schet_gazna AS spravochnik_organization_raschet_schet_gazna,
                    so.mfo AS spravochnik_organization_mfo,
                    so.inn AS spravochnik_organization_inn,
                    d.id_shartnomalar_organization,
                    d.organization_by_raschet_schet_id::INTEGER,
                    d.organization_by_raschet_schet_gazna_id::INTEGER,
                    d.shartnoma_grafik_id::INTEGER,
                    (
                        SELECT JSON_AGG(row_to_json(ch))
                        FROM (
                            SELECT 
                                so.schet AS provodki_schet,
                                so.sub_schet AS provodki_sub_schet
                            FROM bank_prixod_child AS ch
                            JOIN spravochnik_operatsii AS so ON so.id = ch.spravochnik_operatsii_id
                            WHERE  ch.id_bank_prixod = d.id
                                AND ch.isdeleted = false
                        ) AS ch
                    ) AS provodki_array,
                    u.login,
                    u.fio
                FROM bank_prixod AS d
                JOIN users AS u ON d.user_id = u.id
                JOIN regions AS r ON u.region_id = r.id
                JOIN spravochnik_organization AS so ON so.id = d.id_spravochnik_organization 
                WHERE d.main_schet_id = $2 
                    AND r.id = $1 
                    AND d.isdeleted = false 
                    AND doc_date BETWEEN $3 AND $4 
                    ${search_filter}
                ${order}
                OFFSET $5 LIMIT $6
            )
                SELECT 
                    COALESCE( JSON_AGG( row_to_json( data ) ), '[]'::JSON ) AS data,
                    (
                        SELECT 
                            COALESCE(SUM(d.summa), 0)
                        FROM bank_prixod d
                        JOIN users ON d.user_id = users.id
                        JOIN regions ON users.region_id = regions.id
                        JOIN spravochnik_organization AS so ON so.id = d.id_spravochnik_organization 
                        WHERE d.main_schet_id = $2 
                            AND d.isdeleted = false 
                            AND regions.id = $1 
                            AND doc_date BETWEEN $3 AND $4
                            ${search_filter}
                    )::FLOAT AS summa,
                    (
                        SELECT 
                            COALESCE(COUNT(d.id), 0)
                        FROM bank_prixod d
                        JOIN users ON d.user_id = users.id
                        JOIN regions ON users.region_id = regions.id
                        JOIN spravochnik_organization AS so ON so.id = d.id_spravochnik_organization 
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
    const query = `--sql
            SELECT 
                d.id,
                d.doc_num, 
                TO_CHAR(d.doc_date, 'YYYY-MM-DD') AS doc_date, 
                d.summa::FLOAT, 
                d.provodki_boolean, 
                d.dop_provodki_boolean, 
                d.opisanie, 
                d.id_spravochnik_organization, 
                d.id_shartnomalar_organization,
                d.organization_by_raschet_schet_id::INTEGER,
                d.organization_by_raschet_schet_gazna_id::INTEGER,
                d.shartnoma_grafik_id::INTEGER,
                row_to_json(so) AS organ,
                row_to_json(ac) AS account_number,
                row_to_json(g) AS gazna_number,
                row_to_json(c) AS contract,
                row_to_json(cg) AS contract_grafik,
                s.smeta_name,
                s.smeta_number,
                (
                    SELECT JSON_AGG(row_to_json(ch))
                    FROM (
                        SELECT 
                            ch.id,
                            ch.spravochnik_operatsii_id,
                            so.name AS spravochnik_operatsii_name,
                            ch.summa,
                            so.schet,
                            ch.id_spravochnik_podrazdelenie,
                            s_p.name AS spravochnik_podrazdelenie_name,
                            ch.id_spravochnik_sostav,
                            s_s.name AS spravochnik_sostav_name,
                            ch.id_spravochnik_type_operatsii,
                            s_t_o.name AS spravochnik_type_operatsii_name,
                            ch.id_spravochnik_podotchet_litso,
                            s_p_l.name AS spravochnik_podotchet_litso_name,
                            ch.main_zarplata_id,
                            row_to_json(so) AS operatsii,
                            row_to_json(s_p) AS podrazdelenie,
                            row_to_json(s_t_o) AS type_operatsii,
                            row_to_json(s_s) AS sostav,
                            row_to_json(s_p_l) AS podotchet
                        FROM bank_prixod_child AS ch
                        JOIN spravochnik_operatsii AS so ON so.id = ch.spravochnik_operatsii_id
                        LEFT JOIN spravochnik_podrazdelenie AS s_p ON s_p.id = ch.id_spravochnik_podrazdelenie
                        LEFT JOIN spravochnik_sostav AS s_s ON s_s.id = ch.id_spravochnik_sostav
                        LEFT JOIN spravochnik_type_operatsii AS s_t_o ON s_t_o.id = ch.id_spravochnik_type_operatsii
                        LEFT JOIN spravochnik_podotchet_litso AS s_p_l ON s_p_l.id = ch.id_spravochnik_podotchet_litso
                        WHERE ch.id_bank_prixod = d.id 
                    ) AS ch
                ) AS childs 
            FROM bank_prixod AS d
            JOIN users AS u ON d.user_id = u.id
            JOIN regions AS r ON u.region_id = r.id
            LEFT JOIN spravochnik_organization AS so ON so.id = d.id_spravochnik_organization
            LEFT JOIN organization_by_raschet_schet_gazna g ON g.id = d.organization_by_raschet_schet_gazna_id
            LEFT JOIN organization_by_raschet_schet ac ON ac.id = d.organization_by_raschet_schet_id
            LEFT JOIN shartnomalar_organization c ON c.id = d.id_shartnomalar_organization
            LEFT JOIN shartnoma_grafik cg ON cg.id = d.shartnoma_grafik_id
            LEFT JOIN smeta s ON s.id = cg.smeta_id
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
      `
            UPDATE bank_prixod SET 
                doc_num = $1, 
                doc_date = $2, 
                summa = $3,
                provodki_boolean = $4, 
                opisanie = $5, 
                id_spravochnik_organization = $6, 
                id_shartnomalar_organization = $7,
                organization_by_raschet_schet_id = $8,
                organization_by_raschet_schet_gazna_id = $9,
                shartnoma_grafik_id = $10
            WHERE id = $11 RETURNING id
        `,
      params
    );

    return result.rows[0];
  }

  static async deleteChild(params, client) {
    await client.query(
      `DELETE FROM bank_prixod_child  WHERE id_bank_prixod = $1`,
      params
    );
  }

  static async delete(params, client) {
    await client.query(
      `UPDATE bank_prixod_child SET isdeleted = true WHERE id_bank_prixod = $1`,
      params
    );

    const result = await client.query(
      `UPDATE bank_prixod SET isdeleted = true WHERE id = $1 RETURNING id`,
      params
    );

    return result.rows[0];
  }
};
