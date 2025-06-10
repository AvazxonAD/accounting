// const { db } = require("@db/index");

// exports.Jur7SaldoDB = class {
//   static async get(params, responsible_id = null, search = null, product_id = null, region_id = null) {
//     let responsible_filter = ``;
//     let filter = ``;
//     let product_filter = ``;
//     let region_filter = ``;

//     if (region_id) {
//       params.push(region_id);
//       region_filter = `AND r.id = $${params.length}`;
//     }

//     if (product_id) {
//       params.push(product_id);
//       product_filter = `AND n.id = $${params.length}`;
//     }

//     if (search) {
//       params.push(search);
//       filter = `AND n.name ILIKE '%' || $${params.length} || '%'`;
//     }

//     if (responsible_id) {
//       params.push(responsible_id);
//       responsible_filter = `AND kimning_buynida = $${params.length}`;
//     }

//     const query = `
//             WITH data AS (
//                 SELECT
//                 s.*,
//                 s.id::INTEGER,
//                 s.sena::FLOAT,
//                 s.summa::FLOAT,
//                 s.kol::FLOAT,
//                 s.naimenovanie_tovarov_jur7_id::INTEGER,
//                 s.kimning_buynida AS responsible_id,
//                 row_to_json(n) AS product,
//                 n.name,
//                 n.edin,
//                 g.name AS group_jur7_name,
//                 JSON_BUILD_OBJECT(
//                     'doc_num', s.doc_num,
//                     'doc_date', s.doc_date,
//                     'doc_id', s.prixod_id
//                 ) AS prixod_data,
//                 row_to_json(g) AS group,
//                 s.region_id::INTEGER,
//                 row_to_json(jsh) AS responsible
//             FROM saldo_naimenovanie_jur7 s
//             JOIN users AS u ON u.id = s.user_id
//             JOIN regions AS r ON r.id = u.region_id
//             JOIN naimenovanie_tovarov_jur7 n ON n.id = s.naimenovanie_tovarov_jur7_id
//             JOIN spravochnik_javobgar_shaxs_jur7 jsh ON jsh.id = s.kimning_buynida
//             JOIN group_jur7 g ON g.id = n.group_jur7_id
//             WHERE s.year = $1
//                 AND s.month = $2
//                 AND s.isdeleted = false
//                 ${responsible_filter}
//                 ${filter}
//                 ${product_filter}
//                 ${region_filter}
//                 OFFSET $3 LIMIT $4
//             )
//             SELECT
//                 COALESCE(JSON_AGG(row_to_json(data)), '[]'::JSON) AS data,
//                 (
//                     SELECT
//                         COALESCE(COUNT(s.id), 0)::INTEGER
//                     FROM saldo_naimenovanie_jur7 s
//                     JOIN users AS u ON u.id = s.user_id
//                     JOIN regions AS r ON r.id = u.region_id
//                     JOIN naimenovanie_tovarov_jur7 n ON n.id = s.naimenovanie_tovarov_jur7_id
//                     JOIN spravochnik_javobgar_shaxs_jur7 jsh ON jsh.id = s.kimning_buynida
//                     WHERE s.year = $1
//                         AND s.month = $2
//                         AND s.isdeleted = false
//                         ${responsible_filter}
//                         ${filter}
//                         ${product_filter}
//                         ${region_filter}
//                 ) AS total
//             FROM data
//         `;

//     const data = await db.query(query, params);

//     return data[0];
//   }

//   static async getKolAndSumma(params, start = null, end = null, responsible_id = null) {
//     let start_filter = ``;
//     let end_filter = ``;
//     let between_filter = ``;
//     let responsible_filter = ``;

//     if (start && end) {
//       params.push(start, end);
//       between_filter = `AND d.doc_date BETWEEN $${params.length - 1} AND $${params.length}`;
//     } else if (start) {
//       params.push(start);
//       start_filter = `AND d.doc_date < $${params.length}`;
//     } else if (end) {
//       params.push(end);
//       end_filter = `AND d.doc_date <= $${params.length}`;
//     }

//     if (responsible_id) {
//       params.push(responsible_id);
//       responsible_filter = `AND jsh.id = $${params.length}`;
//     }

//     const query = `--sql
//             WITH prixod AS (
//                 SELECT
//                     COALESCE(SUM(ch.kol), 0) AS kol,
//                     COALESCE(SUM(ch.summa_s_nds), 0) AS summa
//                 FROM document_prixod_jur7 d
//                 JOIN document_prixod_jur7_child ch ON d.id = ch.document_prixod_jur7_id
//                 JOIN spravochnik_javobgar_shaxs_jur7 jsh ON jsh.id = d.kimga_id
//                 WHERE ch.naimenovanie_tovarov_jur7_id = $1
//                     AND d.isdeleted = false
//                     AND ch.isdeleted = false
//                     ${start_filter}
//                     ${end_filter}
//                     ${between_filter}
//                     ${responsible_filter}
//             ),
//             prixod_internal AS (
//                 SELECT
//                     COALESCE(SUM(ch.kol), 0) AS kol,
//                     COALESCE(SUM(ch.summa), 0) AS summa
//                 FROM document_vnutr_peremesh_jur7 d
//                 JOIN document_vnutr_peremesh_jur7_child ch ON d.id = ch.document_vnutr_peremesh_jur7_id
//                 JOIN spravochnik_javobgar_shaxs_jur7 jsh ON jsh.id = d.kimga_id
//                 WHERE ch.naimenovanie_tovarov_jur7_id = $1
//                     AND d.isdeleted = false
//                     AND ch.isdeleted = false
//                     ${start_filter}
//                     ${end_filter}
//                     ${between_filter}
//                     ${responsible_filter}
//             ),
//             rasxod AS (
//                 SELECT
//                     COALESCE(SUM(ch.kol), 0) AS kol,
//                     COALESCE(SUM(ch.summa), 0) AS summa
//                 FROM document_rasxod_jur7 d
//                 JOIN document_rasxod_jur7_child ch ON d.id = ch.document_rasxod_jur7_id
//                 JOIN spravochnik_javobgar_shaxs_jur7 jsh ON jsh.id = d.kimdan_id
//                 WHERE ch.naimenovanie_tovarov_jur7_id = $1
//                     AND d.isdeleted = false
//                     AND ch.isdeleted = false
//                     ${start_filter}
//                     ${end_filter}
//                     ${between_filter}
//                     ${responsible_filter}
//             ),
//             rasxod_internal AS (
//                 SELECT
//                     COALESCE(SUM(ch.kol), 0) AS kol,
//                     COALESCE(SUM(ch.summa), 0) AS summa
//                 FROM document_vnutr_peremesh_jur7 d
//                 JOIN document_vnutr_peremesh_jur7_child ch ON d.id = ch.document_vnutr_peremesh_jur7_id
//                 JOIN spravochnik_javobgar_shaxs_jur7 jsh ON jsh.id = d.kimdan_id
//                 WHERE ch.naimenovanie_tovarov_jur7_id = $1
//                     AND d.isdeleted = false
//                     AND ch.isdeleted = false
//                     ${start_filter}
//                     ${end_filter}
//                     ${between_filter}
//                     ${responsible_filter}
//             )
//             SELECT
//                 (COALESCE(p.kol, 0) + COALESCE(pi.kol, 0) - COALESCE(r.kol, 0) - COALESCE(ri.kol, 0))::FLOAT AS kol,
//                 (COALESCE(r.kol, 0) - COALESCE(ri.kol, 0))::FLOAT AS kol_rasxod,
//                 (COALESCE(p.kol, 0) + COALESCE(pi.kol, 0))::FLOAT AS kol_prixod,
//                 (COALESCE(p.summa, 0) + COALESCE(pi.summa, 0) - COALESCE(r.summa, 0) - COALESCE(ri.summa, 0))::FLOAT AS summa,
//                 (COALESCE(p.summa, 0) + COALESCE(pi.summa, 0))::FLOAT AS summa_prixod,
//                 (COALESCE(r.summa, 0) - COALESCE(ri.summa, 0))::FLOAT AS summa_rasxod
//             FROM
//                 prixod p,
//                 prixod_internal pi,
//                 rasxod r,
//                 rasxod_internal ri
//         `;

//     const result = await db.query(query, params);

//     return result[0];
//   }
// };
