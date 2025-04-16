const { db } = require("@db/index");

exports.PrixodDB = class {
  static async createProduct(params, client) {
    const query = `--sql
            INSERT INTO naimenovanie_tovarov_jur7 (
                user_id, 
                spravochnik_budjet_name_id, 
                name, 
                edin, 
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

  static async create(params, client) {
    const query = `--sql
            INSERT INTO document_prixod_jur7 (
                user_id,
                doc_num,
                doc_date,
                j_o_num,
                opisanie,
                doverennost,
                summa,
                kimdan_id,
                kimdan_name,
                kimga_id,
                kimga_name,
                id_shartnomalar_organization,
                budjet_id,
                main_schet_id,
                shartnoma_grafik_id,
                organization_by_raschet_schet_id,
                organization_by_raschet_schet_gazna_id,
                created_at,
                updated_at
            ) 
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19) RETURNING *
        `;

    const result = await client.query(query, params);

    return result.rows[0];
  }

  static async createChild(params, client) {
    const query = `--sql
            INSERT INTO document_prixod_jur7_child (
                naimenovanie_tovarov_jur7_id,
                kol,
                sena,
                summa,
                nds_foiz,
                nds_summa,
                summa_s_nds, 
                debet_schet,
                debet_sub_schet,
                kredit_schet,
                kredit_sub_schet,
                data_pereotsenka,
                user_id,
                document_prixod_jur7_id,
                budjet_id,
                eski_iznos_summa,
                iznos,
                iznos_summa,
                iznos_schet,
                iznos_sub_schet,
                iznos_start,
                created_at,
                updated_at
            ) 
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)
        `;
    const result = await client.query(query, params);
    return result.rows[0];
  }

  static async get(params, search = null, order_by, order_type) {
    let search_filter = ``;
    let order = ``;

    if (search) {
      params.push(search);
      search_filter = `AND (
                d.doc_num = $${params.length} OR 
                so.inn ILIKE '%' || $${params.length} || '%' OR
                rj.fio  ILIKE '%' || $${params.length} || '%'
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
              ( 
                SELECT 
                    COALESCE(SUM(ch.summa), 0)
                FROM document_prixod_jur7_child ch
                WHERE ch.isdeleted = false  
                    AND ch.document_prixod_jur7_id = d.id
              ) AS summa,
              so.name AS kimdan_name,
              so.okonx AS spravochnik_organization_okonx,
              so.bank_klient AS spravochnik_organization_bank_klient,
              so.raschet_schet AS spravochnik_organization_raschet_schet,
              so.raschet_schet_gazna AS spravochnik_organization_raschet_schet_gazna,
              so.mfo AS spravochnik_organization_mfo,
              so.inn AS spravochnik_organization_inn,
              rj.fio AS kimga_name,
              d.shartnoma_grafik_id::INTEGER,
              d.organization_by_raschet_schet_id::INTEGER,
              d.organization_by_raschet_schet_gazna_id::INTEGER
            FROM document_prixod_jur7 AS d
            JOIN users AS u ON u.id = d.user_id
            JOIN regions AS r ON r.id = u.region_id
            LEFT JOIN spravochnik_organization AS so ON so.id = d.kimdan_id
            JOIN spravochnik_javobgar_shaxs_jur7 AS rj ON rj.id = d.kimga_id 
            WHERE r.id = $1 
              AND d.isdeleted = false 
              AND d.doc_date BETWEEN $2 AND $3
              ${search_filter}
              AND d.main_schet_id = $4
            
            ${order}
            OFFSET $5 LIMIT $6
          )
          SELECT 
            COALESCE( JSON_AGG( row_to_json( data ) ), '[]'::JSON ) AS data,
            
            (
              SELECT COALESCE(SUM(d.summa), 0)
              FROM document_prixod_jur7 AS d
              JOIN users AS u ON u.id = d.user_id
              JOIN regions AS r ON r.id = u.region_id  
              LEFT JOIN spravochnik_organization AS so ON so.id = d.kimdan_id
              JOIN spravochnik_javobgar_shaxs_jur7 AS rj ON rj.id = d.kimga_id
              WHERE r.id = $1 
                AND d.doc_date BETWEEN $2 AND $3 
                AND d.isdeleted = false ${search_filter}
                AND d.main_schet_id = $4
            )::FLOAT AS summa,

            (
              SELECT COALESCE(COUNT(d.id), 0)
              FROM document_prixod_jur7 AS d
              JOIN users AS u ON u.id = d.user_id
              JOIN regions AS r ON r.id = u.region_id  
              LEFT JOIN spravochnik_organization AS so ON so.id = d.kimdan_id
              JOIN spravochnik_javobgar_shaxs_jur7 AS rj ON rj.id = d.kimga_id
              WHERE r.id = $1 
                AND d.doc_date BETWEEN $2 AND $3 
                AND d.isdeleted = false ${search_filter}
                AND d.main_schet_id = $4
            )::INTEGER AS total
            
          FROM data
        `;

    const result = await db.query(query, params);

    return result[0];
  }

  static async getById(params, isdeleted) {
    let ignore = "AND d.isdeleted = false";
    const query = `--sql
            SELECT 
                d.id, 
                d.doc_num,
                TO_CHAR(d.doc_date, 'YYYY-MM-DD') AS doc_date, 
                d.opisanie, 
                d.summa::FLOAT, 
                d.kimdan_id,
                d.kimdan_name, 
                d.kimga_id,
                d.kimga_name, 
                d.doverennost,
                d.j_o_num,
                d.id_shartnomalar_organization,
                (
                    SELECT JSON_AGG(row_to_json(child))
                    FROM (
                        SELECT  
                            ch.*,
                            TO_CHAR(ch.data_pereotsenka, 'YYYY-MM-DD') AS data_pereotsenka,
                            n.name,
                            n.edin,
                            n.group_jur7_id,
                            n.inventar_num,
                            n.serial_num,
                            row_to_json(n) AS product,
                            row_to_json(g) AS group
                        FROM document_prixod_jur7_child AS ch
                        JOIN naimenovanie_tovarov_jur7 AS n ON n.id = ch.naimenovanie_tovarov_jur7_id
                        JOIN group_jur7 g ON g.id = n.group_jur7_id
                        WHERE ch.document_prixod_jur7_id = d.id  
                            AND ch.isdeleted = false
                    ) AS child
                ) AS childs,
                d.organization_by_raschet_schet_id::INTEGER,
                d.organization_by_raschet_schet_gazna_id::INTEGER,
                d.shartnoma_grafik_id::INTEGER
            FROM document_prixod_jur7 AS d
            JOIN users AS u ON u.id = d.user_id
            JOIN regions AS r ON r.id = u.region_id
            WHERE r.id = $1
              AND d.id = $2
              AND d.main_schet_id = $3
              ${isdeleted ? `` : ignore}
        `;
    const result = await db.query(query, params);
    return result[0];
  }

  static async update(params) {
    const query = `--sql
            UPDATE document_prixod_jur7 SET 
              doc_num = $1,
              doc_date = $2,
              j_o_num = $3,
              opisanie = $4, 
              doverennost = $5, 
              summa = $6, 
              kimdan_id = $7, 
              kimdan_name = $8, 
              kimga_id = $9, 
              kimga_name = $10, 
              id_shartnomalar_organization = $11, 
              shartnoma_grafik_id = $12,
              organization_by_raschet_schet_id = $13,
              organization_by_raschet_schet_gazna_id = $14,
              updated_at = $15
            WHERE id = $16
            RETURNING * 
        `;

    const result = await db.query(query, params);

    return result[0];
  }

  static async delete(params, client) {
    await client.query(
      `UPDATE document_prixod_jur7_child SET isdeleted = true WHERE document_prixod_jur7_id = $1`,
      params
    );
    const result = await client.query(
      `UPDATE document_prixod_jur7 SET isdeleted = true WHERE id = $1 AND isdeleted = false RETURNING id`,
      params
    );

    return result.rows[0];
  }

  static async deletePrixodChild(documentPrixodId, productIds, client) {
    const query1 = `--sql
            UPDATE document_prixod_jur7_child 
            SET isdeleted = true 
            WHERE document_prixod_jur7_id = $1 AND isdeleted = false
        `;

    const query2 = `--sql
            UPDATE iznos_tovar_jur7 
            SET isdeleted = true 
            WHERE naimenovanie_tovarov_jur7_id = ANY($1)
        `;

    const query3 = `--sql
            DELETE FROM saldo_naimenovanie_jur7  
            WHERE naimenovanie_tovarov_jur7_id = ANY($1)
        `;

    const query4 = `--sql
            UPDATE naimenovanie_tovarov_jur7 
            SET isdeleted = true 
            WHERE id = ANY($1)
        `;

    await client.query(query1, [documentPrixodId]);
    await client.query(query2, [productIds]);
    await client.query(query3, [productIds]);
    await client.query(query4, [productIds]);
  }

  static async prixodReport(params) {
    const query = `--sql
            SELECT 
              d.*, 
              TO_CHAR(d.doc_date, 'YYYY-MM-DD') AS doc_date, 
              d.summa::FLOAT,
              so.name AS organization,
              co.doc_date AS c_doc_date,
              co.doc_num AS c_doc_num
            FROM document_prixod_jur7 AS d
            JOIN users AS u ON u.id = d.user_id
            JOIN regions AS r ON r.id = u.region_id
            LEFT JOIN spravochnik_organization AS so ON so.id = d.kimdan_id
            LEFT JOIN shartnomalar_organization AS co ON d.id_shartnomalar_organization = co.id
            WHERE r.id = $1 
              AND d.isdeleted = false 
              AND d.doc_date BETWEEN $2 AND $3
              AND d.main_schet_id = $4
            ORDER BY d.doc_date
        `;
    const result = await db.query(query, params);
    return result;
  }

  static async getByProductIdPrixod(params) {
    const query = `--sql
            SELECT 
                d.id, 
                d.doc_num,
                TO_CHAR(d.doc_date, 'YYYY-MM-DD') AS doc_date, 
                d.opisanie, 
                d.summa::FLOAT, 
                d.kimdan_id,
                d.kimdan_name, 
                d.kimga_id,
                d.kimga_name, 
                d.doverennost,
                d.j_o_num,
                d.id_shartnomalar_organization, 
                ch.id,
                ch.naimenovanie_tovarov_jur7_id,
                ch.kol,
                ch.sena,
                ch.summa,
                ch.debet_schet,
                ch.debet_sub_schet,
                ch.kredit_schet,
                ch.kredit_sub_schet,
                TO_CHAR(ch.data_pereotsenka, 'YYYY-MM-DD') AS data_pereotsenka,
                ch.nds_foiz,
                ch.nds_summa,
                ch.summa_s_nds,
                ch.eski_iznos_summa
            FROM document_prixod_jur7 AS d
            JOIN document_prixod_jur7_child AS ch ON d.id = ch.document_prixod_jur7_id 
            JOIN users AS u ON u.id = d.user_id
            JOIN regions AS r ON r.id = u.region_id
            WHERE r.id = $1 
                AND d.main_schet_id = $2 
                AND d.isdeleted = false 
                AND ch.naimenovanie_tovarov_jur7_id = $3
        `;
    const result = await db.query(query, params);
    return result[0];
  }

  static async prixodReportChild(params) {
    const query = `--sql
            SELECT  
                ch.id,
                n_t.name AS product_name,
                n_t.edin,
                ch.kol::FLOAT,
                ch.sena::FLOAT,
                ch.summa::FLOAT,
                ch.debet_schet AS schet, 
                ch.debet_sub_schet AS sub_schet,
                ch.eski_iznos_summa
            FROM document_prixod_jur7_child AS ch
            JOIN document_prixod_jur7 d ON d.id = ch.document_prixod_jur7_id
            JOIN naimenovanie_tovarov_jur7 AS n_t ON n_t.id = ch.naimenovanie_tovarov_jur7_id
            WHERE d.id = $1
              AND ch.isdeleted = false
              AND d.isdeleted = false
              AND d.main_schet_id = $2
        `;
    const result = await db.query(query, params);
    return result;
  }

  static async getProductsByDocId(params, client) {
    const query = `--sql
            SELECT  
                ch.naimenovanie_tovarov_jur7_id  product_id
            FROM document_prixod_jur7_child ch
            WHERE ch.document_prixod_jur7_id = $1
              AND ch.isdeleted = false
              AND ch.isdeleted = false
        `;

    const _db = client || db;

    const result = await _db.query(query, params);

    const data = client ? result.rows : result;

    return data.map((row) => row.product_id);
  }

  static async checkPrixodDoc(params) {
    const query = `--sql
            SELECT 
              d.id, 
              d.doc_num,
              TO_CHAR(d.doc_date, 'YYYY-MM-DD') AS doc_date, 
              d.opisanie, 
              d.summa, 
              kd.id AS kimdan_id,
              kd.name AS kimdan_name,
              kg.id AS kimga_id,
              kg.fio AS kimga_name,
              'rasxod' AS type 
            FROM document_rasxod_jur7 d
            JOIN document_rasxod_jur7_child ch ON ch.document_rasxod_jur7_id = d.id
            LEFT JOIN spravochnik_organization kd ON kd.id = d.kimga_id
            JOIN spravochnik_javobgar_shaxs_jur7 kg ON kg.id = d.kimdan_id 
            WHERE  ch.naimenovanie_tovarov_jur7_id = $1 
                AND d.isdeleted = false
                AND ch.isdeleted = false
            
            UNION ALL 

            SELECT 
              d.id, 
              d.doc_num,
              TO_CHAR(d.doc_date, 'YYYY-MM-DD') AS doc_date, 
              d.opisanie, 
              d.summa, 
              kd.id AS kimdan_id,
              kd.fio AS kimdan_name,
              kg.id AS kimga_id,
              kg.fio AS kimga_name,
              'internal' AS type
            FROM document_vnutr_peremesh_jur7 d
            JOIN document_vnutr_peremesh_jur7_child ch ON ch.document_vnutr_peremesh_jur7_id = d.id
            JOIN spravochnik_javobgar_shaxs_jur7 kd ON kd.id = d.kimdan_id 
            JOIN spravochnik_javobgar_shaxs_jur7 kg ON kg.id = d.kimga_id 
            WHERE  ch.naimenovanie_tovarov_jur7_id = $1 
                AND d.isdeleted = false
                AND ch.isdeleted = false
        `;

    const result = await db.query(query, params);
    return result;
  }

  // old
  static async getByProductId(params) {
    const query = `--sql
            SELECT 
                d.id, 
                d.doc_num,
                TO_CHAR(d.doc_date, 'YYYY-MM-DD') AS doc_date, 
                d.opisanie, 
                d.summa::FLOAT, 
                d.kimdan_id,
                d.kimdan_name, 
                d.kimga_id,
                d.kimga_name, 
                d.doverennost,
                d.j_o_num,
                d.id_shartnomalar_organization,
                d.organization_by_raschet_schet_id::INTEGER,
                d.organization_by_raschet_schet_gazna_id::INTEGER,
                d.shartnoma_grafik_id::INTEGER
            FROM document_prixod_jur7 AS d
            JOIN document_prixod_jur7_child AS ch ON ch.document_prixod_jur7_id = d.id
            WHERE d.isdeleted = false 
                AND ch.naimenovanie_tovarov_jur7_id = $1
                AND d.main_schet_id = $2
        `;

    const data = await db.query(query, params);

    return data[0];
  }
};
