const pool = require("../../config/db");
const { handleServiceError } = require("../../middleware/service.handle");
const { returnLocalDate } = require("../../utils/date.function");

const getAllMonitoring = handleServiceError(
  async (region_id, main_schet_id, offset, limit, from, to) => {
    const data = await pool.query(
      `
        WHITH 
    `,
      [region_id, main_schet_id, from, to, offset, limit],
    );

    const total = await pool.query(
      `
        SELECT 
        COALESCE((SELECT COUNT(br.id) 
                FROM bank_rasxod br
                JOIN users u ON br.user_id = u.id
                JOIN regions r ON u.region_id = r.id
                WHERE r.id = $1 AND br.main_schet_id = $2 AND br.isdeleted = false
                AND br.doc_date BETWEEN $3 AND $4), 0) +
        COALESCE((SELECT COUNT(bp.id) 
                FROM bank_prixod bp
                JOIN users u ON bp.user_id = u.id
                JOIN regions r ON u.region_id = r.id
                WHERE r.id = $1 AND bp.main_schet_id = $2 AND bp.isdeleted = false
                AND bp.doc_date BETWEEN $3 AND $4), 0) AS total_count
    `,
      [region_id, main_schet_id, from, to],
    );

    const prixod_sum = await pool.query(
      `
        SELECT SUM(bp.summa) AS all_prixod_sum
        FROM bank_prixod bp
        JOIN users u ON bp.user_id = u.id
        JOIN regions r ON u.region_id = r.id
        WHERE r.id = $1 AND bp.main_schet_id = $2 AND bp.isdeleted = false
        AND bp.doc_date BETWEEN $3 AND $4
    `,
      [region_id, main_schet_id, from, to],
    );

    const rasxod_sum = await pool.query(
      `
        SELECT SUM(br.summa) AS all_rasxod_sum
        FROM bank_rasxod br
        JOIN users u ON br.user_id = u.id
        JOIN regions r ON u.region_id = r.id
        WHERE r.id = $1 AND br.main_schet_id = $2 AND br.isdeleted = false
        AND br.doc_date BETWEEN $3 AND $4
    `,
      [region_id, main_schet_id, from, to],
    );

    const summaFrom = await pool.query(`
        SELECT 
          COALESCE((SELECT SUM(bp.summa) 
                  FROM bank_prixod bp
                  JOIN users u ON bp.user_id = u.id
                  JOIN regions r ON u.region_id = r.id
                  WHERE r.id = $1 AND bp.main_schet_id = $2 AND bp.isdeleted = false
                  AND bp.doc_date < $3), 0) -
          COALESCE((SELECT SUM(br.summa) 
                  FROM bank_rasxod br
                  JOIN users u ON br.user_id = u.id
                  JOIN regions r ON u.region_id = r.id
                  WHERE r.id = $1 AND br.main_schet_id = $2 AND  br.isdeleted = false
                  AND br.doc_date < $3 ), 0) AS total_sum
        `, 
        [
          region_id,
          main_schet_id,
          from,
        ]
    );
    
    const summaTo = await pool.query(`
      SELECT 
        COALESCE((SELECT SUM(bp.summa) 
                FROM bank_prixod bp
                JOIN users u ON bp.user_id = u.id
                JOIN regions r ON u.region_id = r.id
                WHERE r.id = $1 AND bp.main_schet_id = $2 AND bp.isdeleted = false
                AND bp.doc_date <= $3), 0) -
        COALESCE((SELECT SUM(br.summa) 
                FROM bank_rasxod br
                JOIN users u ON br.user_id = u.id
                JOIN regions r ON u.region_id = r.id
                WHERE r.id = $1 AND br.main_schet_id = $2 AND  br.isdeleted = false
                AND br.doc_date <= $3 ), 0) AS total_sum
    `, [region_id, main_schet_id, to]);

    const result_data = data.rows.map((row) => ({
      id: row.id,
      doc_num: row.doc_num,
      doc_date: row.doc_date,
      prixod_sum: Number(row.prixod_sum),
      rasxod_sum: Number(row.rasxod_sum),
      id_spravochnik_organization: row.id_spravochnik_organization,
      spravochnik_organization_name: row.spravochnik_organization_name,
      spravochnik_organization_raschet_schet:
        row.spravochnik_organization_raschet_schet,
      spravochnik_organization_inn: row.spravochnik_organization_inn,
      shartnomalar_doc_num: row.shartnomalar_doc_num,
      shartnomalar_doc_date: row.shartnomalar_doc_date,
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
