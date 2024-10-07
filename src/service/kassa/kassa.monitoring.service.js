const pool = require("../../config/db");
const { handleServiceError } = require("../../middleware/service.handle");
const { returnLocalDate } = require("../../utils/date.function");

const getAllMonitoring = handleServiceError(
  async (region_id, main_schet_id, offset, limit, from, to) => {
    const data = await pool.query(
      `
        SELECT 
            kp.id, 
            kp.doc_num,
            TO_CHAR(kp.doc_date, 'YYYY-MM-DD') AS doc_date,
            kp.summa AS prixod_sum,
            0 AS rasxod_sum,
            kp.id_podotchet_litso,
            spravochnik_podotchet_litso.name AS spravochnik_podotchet_litso_name,
            kp.opisanie,
            kp.doc_date AS combined_date
        FROM kassa_prixod kp
        JOIN users u ON kp.user_id = u.id
        JOIN regions r ON u.region_id = r.id
        JOIN spravochnik_podotchet_litso ON spravochnik_podotchet_litso.id = kp.id_podotchet_litso
        WHERE r.id = $1 AND kp.main_schet_id = $2
        AND kp.doc_date BETWEEN $3 AND $4
        
        UNION ALL
        
        SELECT 
            kr.id, 
            kr.doc_num,
            TO_CHAR(kr.doc_date, 'YYYY-MM-DD') AS doc_date,
            0 AS prixod_sum,
            kr.summa AS rasxod_sum,
            kr.id_podotchet_litso,
            spravochnik_podotchet_litso.name,
            kr.opisanie,
            kr.doc_date AS combined_date
        FROM kassa_rasxod kr
        JOIN users u ON kr.user_id = u.id
        JOIN regions r ON u.region_id = r.id
        JOIN spravochnik_podotchet_litso ON spravochnik_podotchet_litso.id = kr.id_podotchet_litso
        WHERE r.id = $1 AND kr.main_schet_id = $2
        AND kr.doc_date BETWEEN $3 AND $4
        ORDER BY combined_date
        OFFSET $5 LIMIT $6;
    `,
      [region_id, main_schet_id, from, to, offset, limit],
    );

    const total = await pool.query(
      `
        SELECT 
        COALESCE((SELECT COUNT(kr.id) 
                FROM kassa_rasxod kr
                JOIN users u ON kr.user_id = u.id
                JOIN regions r ON u.region_id = r.id
                WHERE r.id = $1 AND kr.main_schet_id = $2 
                AND kr.doc_date BETWEEN $3 AND $4), 0) +
        COALESCE((SELECT COUNT(kp.id) 
                FROM kassa_prixod kp
                JOIN users u ON kp.user_id = u.id
                JOIN regions r ON u.region_id = r.id
                WHERE r.id = $1 AND kp.main_schet_id = $2 
                AND kp.doc_date BETWEEN $3 AND $4), 0) AS total_count
    `,
      [region_id, main_schet_id, from, to],
    );

    const prixod_sum = await pool.query(
      `
        SELECT SUM(kp.summa) AS all_prixod_sum
        FROM kassa_prixod kp
        JOIN users u ON kp.user_id = u.id
        JOIN regions r ON u.region_id = r.id
        WHERE r.id = $1 AND kp.main_schet_id = $2 
        AND kp.doc_date BETWEEN $3 AND $4
    `,
      [region_id, main_schet_id, from, to],
    );

    const rasxod_sum = await pool.query(
      `
        SELECT SUM(kr.summa) AS all_rasxod_sum
        FROM kassa_rasxod kr
        JOIN users u ON kr.user_id = u.id
        JOIN regions r ON u.region_id = r.id
        WHERE r.id = $1 AND kr.main_schet_id = $2 
        AND kr.doc_date BETWEEN $3 AND $4
    `,
      [region_id, main_schet_id, from, to],
    );

    const summaFrom = await pool.query(`
      SELECT 
        COALESCE((SELECT SUM(kp.summa) 
                FROM kassa_prixod kp
                JOIN users u ON kp.user_id = u.id
                JOIN regions r ON u.region_id = r.id
                WHERE r.id = $1 AND kp.main_schet_id = $2 
                AND kp.doc_date < $3), 0) -
        COALESCE((SELECT SUM(kr.summa) 
                FROM kassa_rasxod kr
                JOIN users u ON kr.user_id = u.id
                JOIN regions r ON u.region_id = r.id
                WHERE r.id = $1 AND kr.main_schet_id = $2 
                AND kr.doc_date < $3 ), 0) AS total_sum
    `, [ region_id, main_schet_id, from]);
    
    const summaTo = await pool.query(`
      SELECT 
        COALESCE((SELECT SUM(kp.summa) 
                FROM kassa_prixod kp
                JOIN users u ON kp.user_id = u.id
                JOIN regions r ON u.region_id = r.id
                WHERE r.id = $1 AND kp.main_schet_id = $2 
                AND kp.doc_date <= $3), 0) -
        COALESCE((SELECT SUM(kr.summa) 
                FROM kassa_rasxod kr
                JOIN users u ON kr.user_id = u.id
                JOIN regions r ON u.region_id = r.id
                WHERE r.id = $1 AND kr.main_schet_id = $2 
                AND kr.doc_date <= $3 ), 0) AS total_sum
    `, [region_id, main_schet_id, to]);

    const result_data = data.rows.map((row) => ({
      id: row.id,
      doc_num: row.doc_num,
      doc_date: row.doc_date,
      prixod_sum: Number(row.prixod_sum),
      rasxod_sum: Number(row.rasxod_sum),
      id_podotchet_litso: row.id_podotchet_litso,
      spravochnik_podotchet_litso_name: row.spravochnik_podotchet_litso_name,
      opisanie: row.opisanie,
    }));

    return {
      result_data,
      total_count: total.rows[0].total_count,
      all_prixod_sum: prixod_sum.rows[0].all_prixod_sum,
      all_rasxod_sum: rasxod_sum.rows[0].all_rasxod_sum,
      total_sum_from: summaFrom.rows[0].total_sum,
      total_sum_to: summaTo.rows[0].total_sum,
    };
  },
);

module.exports = {
  getAllMonitoring,
};
