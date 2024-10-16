const { query, log } = require("winston");
const pool = require("../../config/db");
const ErrorResponse = require("../../utils/errorResponse");

const getAllMonitoring = async (region_id, main_schet_id, offset, limit, from, to) => {
  try {
    const data = await pool.query(
      `
          WITH data AS (
            SELECT 
                bp.id, 
                bp.doc_num,
                TO_CHAR(bp.doc_date, 'YYYY-MM-DD') AS doc_date,
                bp.summa AS prixod_sum,
                0 AS rasxod_sum,
                bp.id_spravochnik_organization,
                so.name AS spravochnik_organization_name,
                so.raschet_schet AS spravochnik_organization_raschet_schet,
                so.inn AS spravochnik_organization_inn,
                bp.id_shartnomalar_organization,
                so2.doc_num AS shartnomalar_doc_num,
                TO_CHAR(so2.doc_date, 'YYYY-MM-DD') AS shartnomalar_doc_date,
                bp.opisanie,
                bp.doc_date AS combined_date
            FROM bank_prixod bp
            JOIN users u ON bp.user_id = u.id
            JOIN regions r ON u.region_id = r.id
            JOIN spravochnik_organization so ON bp.id_spravochnik_organization = so.id
            LEFT JOIN shartnomalar_organization so2 ON bp.id_shartnomalar_organization = so2.id
            WHERE r.id = $1 AND bp.main_schet_id = $2 AND bp.isdeleted = false 
            AND bp.doc_date BETWEEN $3 AND $4
            
            UNION ALL
            
            SELECT 
                br.id, 
                br.doc_num,
                TO_CHAR(br.doc_date, 'YYYY-MM-DD') AS doc_date,
                0 AS prixod_sum,
                br.summa AS rasxod_sum,
                br.id_spravochnik_organization,
                so.name AS spravochnik_organization_name,
                so.raschet_schet AS spravochnik_organization_raschet_schet,
                so.inn AS spravochnik_organization_inn,
                br.id_shartnomalar_organization,
                so2.doc_num AS shartnomalar_doc_num,
                TO_CHAR(so2.doc_date, 'YYYY-MM-DD') AS shartnomalar_doc_date,
                br.opisanie,
                br.doc_date AS combined_date
            FROM bank_rasxod br
            JOIN users u ON br.user_id = u.id
            JOIN regions r ON u.region_id = r.id
            JOIN spravochnik_organization so ON br.id_spravochnik_organization = so.id
            LEFT JOIN shartnomalar_organization so2 ON br.id_shartnomalar_organization = so2.id
            WHERE r.id = $1 AND br.main_schet_id = $2 AND br.isdeleted = false
            AND br.doc_date BETWEEN $3 AND $4
            ORDER BY combined_date
            OFFSET $5 LIMIT $6
        )
        SELECT 
            (SELECT 
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
                        AND bp.doc_date BETWEEN $3 AND $4), 0))::INTEGER AS total_count,
            COALESCE((SELECT SUM(bp.summa)
              FROM bank_prixod bp
              JOIN users u ON bp.user_id = u.id
              JOIN regions r ON u.region_id = r.id
              WHERE r.id = $1 AND bp.main_schet_id = $2 AND bp.isdeleted = false
              AND bp.doc_date BETWEEN $3 AND $4), 0)::FLOAT AS prixod_sum,
            COALESCE((SELECT SUM(br.summa)
              FROM bank_rasxod br
              JOIN users u ON br.user_id = u.id
              JOIN regions r ON u.region_id = r.id
              WHERE r.id = $1 AND br.main_schet_id = $2 AND br.isdeleted = false
              AND br.doc_date BETWEEN $3 AND $4), 0)::FLOAT AS rasxod_sum,
            (SELECT 
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
                WHERE r.id = $1 AND br.main_schet_id = $2 AND br.isdeleted = false
                AND br.doc_date < $3 ), 0))::FLOAT AS summa_from,
            (SELECT 
                COALESCE((SELECT SUM(bp.summa) 
                FROM bank_prixod bp
                JOIN users u ON bp.user_id = u.id
                JOIN regions r ON u.region_id = r.id
                WHERE r.id = $1 AND bp.main_schet_id = $2 AND bp.isdeleted = false
                AND bp.doc_date <= $4), 0) -
                COALESCE((SELECT SUM(br.summa) 
                FROM bank_rasxod br
                JOIN users u ON br.user_id = u.id
                JOIN regions r ON u.region_id = r.id
                WHERE r.id = $1 AND br.main_schet_id = $2 AND br.isdeleted = false
                AND br.doc_date <= $4 ), 0))::FLOAT AS summa_to,
            ARRAY_AGG(row_to_json(data)) AS data
          FROM data`, [region_id, main_schet_id, from, to, offset, limit],
    );
    return {
      data: data.rows[0]?.data || [],
      total: data.rows[0].total_count,
      prixod_sum: data.rows[0].prixod_sum,
      rasxod_sum: data.rows[0].rasxod_sum,
      summaFrom: data.rows[0].summa_from,
      summaTo: data.rows[0].summa_to,
    };
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const bankCapService = async (region_id, main_schet_id, from, to) => {
  const { rows } = await pool.query(`
    WITH data AS (
      SELECT s_o.schet, SUM(b_p_ch.summa)::FLOAT AS prixod_sum, 0 AS rasxod_sum 
      FROM bank_prixod b_p
      JOIN users AS u ON u.id = b_p.user_id
      JOIN regions AS r ON r.id = u.region_id
      JOIN bank_prixod_child AS b_p_ch ON b_p.id = b_p_ch.id_bank_prixod 
      JOIN spravochnik_operatsii AS s_o ON s_o.id = b_p_ch.spravochnik_operatsii_id
      WHERE r.id = $1 AND b_p.main_schet_id = $2 AND b_p.doc_date BETWEEN $3 AND $4
      GROUP BY s_o.schet
      UNION ALL 
      SELECT s_o.schet, 0 AS prixod_sum, SUM(b_r_ch.summa)::FLOAT AS rasxod_sum 
      FROM bank_rasxod b_r
      JOIN users AS u ON u.id = b_r.user_id
      JOIN regions AS r ON r.id = u.region_id
      JOIN bank_rasxod_child AS b_r_ch ON b_r.id = b_r_ch.id_bank_rasxod 
      JOIN spravochnik_operatsii AS s_o ON s_o.id = b_r_ch.spravochnik_operatsii_id
      WHERE r.id = $1 AND b_r.main_schet_id = $2 AND b_r.doc_date BETWEEN $3 AND $4
      GROUP BY s_o.schet
    )
    SELECT 
      ARRAY_AGG(row_to_json(data)) AS data,
      (
        COALESCE((SELECT SUM(b_p_ch.summa)
          FROM bank_prixod b_p
          JOIN users AS u ON u.id = b_p.user_id
          JOIN regions AS r ON r.id = u.region_id
          JOIN bank_prixod_child AS b_p_ch ON b_p.id = b_p_ch.id_bank_prixod 
          JOIN spravochnik_operatsii AS s_o ON s_o.id = b_p_ch.spravochnik_operatsii_id
          WHERE r.id = $1 AND b_p.main_schet_id = $2 AND b_p.doc_date < $3), 0) -
        COALESCE((SELECT SUM(b_r_ch.summa) 
          FROM bank_rasxod b_r
          JOIN users AS u ON u.id = b_r.user_id
          JOIN regions AS r ON r.id = u.region_id
          JOIN bank_rasxod_child AS b_r_ch ON b_r.id = b_r_ch.id_bank_rasxod 
          JOIN spravochnik_operatsii AS s_o ON s_o.id = b_r_ch.spravochnik_operatsii_id
          WHERE r.id = $1 AND b_r.main_schet_id = $2 AND b_r.doc_date < $3), 0) 
      )::FLOAT AS balance_from,
      (
        COALESCE((SELECT SUM(b_p_ch.summa) 
          FROM bank_prixod b_p
          JOIN users AS u ON u.id = b_p.user_id
          JOIN regions AS r ON r.id = u.region_id
          JOIN bank_prixod_child AS b_p_ch ON b_p.id = b_p_ch.id_bank_prixod 
          JOIN spravochnik_operatsii AS s_o ON s_o.id = b_p_ch.spravochnik_operatsii_id
          WHERE r.id = $1 AND b_p.main_schet_id = $2 AND b_p.doc_date <= $4), 0) -
        COALESCE((SELECT SUM(b_r_ch.summa)
          FROM bank_rasxod b_r
          JOIN users AS u ON u.id = b_r.user_id
          JOIN regions AS r ON r.id = u.region_id
          JOIN bank_rasxod_child AS b_r_ch ON b_r.id = b_r_ch.id_bank_rasxod 
          JOIN spravochnik_operatsii AS s_o ON s_o.id = b_r_ch.spravochnik_operatsii_id
          WHERE r.id = $1 AND b_r.main_schet_id = $2 AND b_r.doc_date <= $4), 0) 
      )::FLOAT AS balance_to
    FROM data 
  `, [region_id, main_schet_id, from, to]);
  let prixod_sum = 0
  let rasxod_sum = 0
  rows[0].data?.forEach(item => {
    prixod_sum += item.prixod_sum
    rasxod_sum += item.rasxod_sum
  })
  return {prixod_sum, rasxod_sum, data: rows[0]?.data || [], balance_from: rows[0].balance_from, balance_to: rows[0]?.balance_to}
}

const dailyReportService = async (region_id, main_schet_id, from, to) => {

  const { rows } = await pool.query(`
    WITH data AS (
      SELECT 
      s_o.schet,
      ARRAY_AGG(
        json_build_object(
          'doc_num', b_p.doc_num, 
          'doc_date', b_p.doc_date,
          'spravochnik_organization_name', s_organ.name,
          'opisanie', b_p.opisanie,
          'schet', s_o.schet,
          'prixod_sum', b_p_ch.summa,
          'rasxod_sum', 0
          )
        ) AS docs,
        SUM(b_p_ch.summa) AS prixod_sum,
        0 AS rasxod_sum
      FROM spravochnik_operatsii AS s_o
      JOIN bank_prixod_child AS b_p_ch ON b_p_ch.spravochnik_operatsii_id = s_o.id
      JOIN bank_prixod AS b_p ON b_p.id = b_p_ch.id_bank_prixod
      JOIN spravochnik_organization AS s_organ ON b_p.id_spravochnik_organization = s_organ.id
      JOIN users AS u ON u.id = b_p.user_id
      JOIN regions AS r ON r.id = u.region_id 
      WHERE r.id = $4 AND b_p.doc_date BETWEEN $2 AND $3 AND b_p.main_schet_id = $1
      GROUP BY s_o.schet
      UNION ALL 
      SELECT 
      s_o.schet,
      ARRAY_AGG(
        json_build_object(
          'doc_num', b_r.doc_num, 
          'doc_date', b_r.doc_date,
          'spravochnik_organization_name', s_organ.name,
          'opisanie', b_r.opisanie,
          'schet', s_o.schet,
          'prixod_sum', 0,
          'rasxod_sum', b_r_ch.summa
          )
        ) AS docs,
        0 AS prixod_sum,
        SUM(b_r_ch.summa) AS rasxod_sum
      FROM spravochnik_operatsii AS s_o
      JOIN bank_rasxod_child AS b_r_ch ON b_r_ch.spravochnik_operatsii_id = s_o.id
      JOIN bank_prixod AS b_r ON b_r.id = b_r_ch.id_bank_rasxod
      JOIN spravochnik_organization AS s_organ ON b_r.id_spravochnik_organization = s_organ.id
      JOIN users AS u ON u.id = b_r.user_id
      JOIN regions AS r ON r.id = u.region_id 
      WHERE r.id = $4 AND b_r.doc_date BETWEEN $2 AND $3 AND b_r.main_schet_id = $1
      GROUP BY s_o.schet
    )
    SELECT 
      ARRAY_AGG(row_to_json(data)) AS data,
      COALESCE((
        SELECT SUM(b_r_ch.summa)
        FROM spravochnik_operatsii AS s_o
        JOIN bank_rasxod_child AS b_r_ch ON b_r_ch.spravochnik_operatsii_id = s_o.id
        JOIN bank_prixod AS b_r ON b_r.id = b_r_ch.id_bank_rasxod
        JOIN users AS u ON u.id = b_r.user_id
        JOIN regions AS r ON r.id = u.region_id 
        WHERE r.id = $4 AND b_r.doc_date BETWEEN $2 AND $3 AND b_r.main_schet_id = $1
      ), 0)::FLOAT AS rasxod_sum,
      COALESCE((
        SELECT SUM(b_p_ch.summa)
        FROM spravochnik_operatsii AS s_o
        JOIN bank_prixod_child AS b_p_ch ON b_p_ch.spravochnik_operatsii_id = s_o.id
        JOIN bank_prixod AS b_p ON b_p.id = b_p_ch.id_bank_prixod
        JOIN users AS u ON u.id = b_p.user_id
        JOIN regions AS r ON r.id = u.region_id 
        WHERE r.id = $4 AND b_p.doc_date BETWEEN $2 AND $3 AND b_p.main_schet_id = $1
      ), 0)::FLOAT prixod_sum,
      COALESCE((
        (SELECT SUM(b_p_ch.summa)
        FROM spravochnik_operatsii AS s_o
        JOIN bank_prixod_child AS b_p_ch ON b_p_ch.spravochnik_operatsii_id = s_o.id
        JOIN bank_prixod AS b_p ON b_p.id = b_p_ch.id_bank_prixod
        JOIN users AS u ON u.id = b_p.user_id
        JOIN regions AS r ON r.id = u.region_id 
        WHERE r.id = $4 AND b_p.doc_date < $2 AND b_p.main_schet_id = $1) - 
        (SELECT SUM(b_r_ch.summa)
        FROM spravochnik_operatsii AS s_o
        JOIN bank_rasxod_child AS b_r_ch ON b_r_ch.spravochnik_operatsii_id = s_o.id
        JOIN bank_prixod AS b_r ON b_r.id = b_r_ch.id_bank_rasxod
        JOIN users AS u ON u.id = b_r.user_id
        JOIN regions AS r ON r.id = u.region_id 
        WHERE r.id = $4 AND b_r.doc_date < $2 AND b_r.main_schet_id = $1)  
      ), 0)::FLOAT summa_from,
      COALESCE((
        (SELECT SUM(b_p_ch.summa)
        FROM spravochnik_operatsii AS s_o
        JOIN bank_prixod_child AS b_p_ch ON b_p_ch.spravochnik_operatsii_id = s_o.id
        JOIN bank_prixod AS b_p ON b_p.id = b_p_ch.id_bank_prixod
        JOIN users AS u ON u.id = b_p.user_id
        JOIN regions AS r ON r.id = u.region_id 
        WHERE r.id = $4 AND b_p.doc_date < $3 AND b_p.main_schet_id = $1) - 
        (SELECT SUM(b_r_ch.summa)
        FROM spravochnik_operatsii AS s_o
        JOIN bank_rasxod_child AS b_r_ch ON b_r_ch.spravochnik_operatsii_id = s_o.id
        JOIN bank_prixod AS b_r ON b_r.id = b_r_ch.id_bank_rasxod
        JOIN users AS u ON u.id = b_r.user_id
        JOIN regions AS r ON r.id = u.region_id 
        WHERE r.id = $4 AND b_r.doc_date < $3 AND b_r.main_schet_id = $1)  
      ), 0)::FLOAT summa_to
    FROM data
  `, [main_schet_id, from, to, region_id]);
  return {
    prixod_sum: rows[0].prixod_sum,
    rasxod_sum: rows[0].rasxod_sum,
    data: rows[0]?.data || [],
    balance_from: rows[0].summa_from,
    balance_to: rows[0]?.summa_to
  };
};

module.exports = {
  getAllMonitoring,
  bankCapService,
  dailyReportService
};
