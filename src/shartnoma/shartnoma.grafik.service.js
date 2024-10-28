const pool = require("../config/db");
const ErrorResponse = require("../utils/errorResponse");

const createShartnomaGrafik = async (data) => {
  const grafik = await pool.query(`
    INSERT INTO shartnoma_grafik
      (
        id_shartnomalar_organization, 
        user_id, 
        main_schet_id, 
        year, 
        oy_1,
        oy_2,
        oy_3,
        oy_4,
        oy_5,
        oy_6,
        oy_7,
        oy_8,
        oy_9,
        oy_10,
        oy_11,
        oy_12,
        yillik_oylik
      ) 
      VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) 
      RETURNING *
    `,[
        data.shartnoma_id, 
        data.user_id, 
        data.main_schet_id, 
        data.year,
        data.oy_1 || 0,
        data.oy_2 || 0,
        data.oy_3 || 0,
        data.oy_4 || 0,
        data.oy_5 || 0,
        data.oy_6 || 0,
        data.oy_7 || 0,
        data.oy_8 || 0,
        data.oy_9 || 0,
        data.oy_10 || 0,
        data.oy_11 || 0,
        data.oy_12 || 0,
        data.yillik_oylik
    ]);
  return grafik.rows[0]
}

const getByIdGrafikDB = async (region_id, main_schet_id, id, ignoreDeleted = false) => {
  try {
    let ignore = ``
    if (!ignoreDeleted) {
      ignore = ` AND sh_g.isdeleted = false`;
    }
    const result = await pool.query(`
        SELECT 
          sh_g.id,
          sh_g.id_shartnomalar_organization,
          sh_o.doc_num, 
          TO_CHAR(sh_o.doc_date, 'YYYY-MM-DD') AS doc_date, 
          sh_o.summa::FLOAT,
          sh_o.opisanie,
          sh_g.oy_1::FLOAT,
          sh_g.oy_2::FLOAT,
          sh_g.oy_3::FLOAT,
          sh_g.oy_4::FLOAT,
          sh_g.oy_5::FLOAT,
          sh_g.oy_6::FLOAT,
          sh_g.oy_7::FLOAT,
          sh_g.oy_8::FLOAT,
          sh_g.oy_9::FLOAT,
          sh_g.oy_10::FLOAT,
          sh_g.oy_11::FLOAT,
          sh_g.oy_12::FLOAT,
          sh_g.year
        FROM shartnoma_grafik AS sh_g
        JOIN users  ON sh_g.user_id = users.id
        JOIN regions ON users.region_id = regions.id
        JOIN shartnomalar_organization AS sh_o ON sh_o.id = sh_g.id_shartnomalar_organization
        WHERE regions.id = $1 AND sh_g.main_schet_id = $2 AND sh_g.id = $3 ${ignore}
      `, [region_id, main_schet_id, id])
    if (!result.rows[0]) {
      throw new ErrorResponse('shartnoma_grafik not found', 404)
    }
    return result.rows[0];
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}


const getAllGrafikDB = async (region_id, main_schet_id, organization, limit, offset) => {
  try {
    let organization_filter = '';
    const params = [region_id, main_schet_id, offset, limit];
    if (typeof organization === "number") {
      organization_filter = `AND s_o.id = $${params.length + 1}`;
      params.push(organization);
    }
    
    const { rows } = await pool.query(`
      WITH data AS (
        SELECT
          s_o.id AS spravochnik_organization_id,
          s_o.name AS spravochnik_organization_name,
          s_o.bank_klient AS spravochnik_organization_bank_klient,
          s_o.mfo AS spravochnik_organization_mfo,
          s_o.inn AS spravochnik_organization_inn,
          s_o.raschet_schet AS spravochnik_organization_raschet_schet,
          sh_g.id_shartnomalar_organization,
          sh_o.doc_num AS shartnomalar_organization_doc_num,
          TO_CHAR(sh_o.doc_date, 'YYYY-MM-DD') AS shartnomalar_organization_doc_date,
          s_1.smeta_number AS smeta_number,
          s_2.smeta_number AS smeta2_number,
          sh_o.opisanie AS shartnomalar_organization_opisanie,
          sh_o.summa::FLOAT AS shartnomalar_organization_summa,
          sh_o.pudratchi_bool AS shartnomalar_organization_pudratchi_bool,
          sh_g.id,
          sh_g.oy_1::FLOAT,
          sh_g.oy_2::FLOAT,
          sh_g.oy_3::FLOAT,
          sh_g.oy_4::FLOAT,
          sh_g.oy_5::FLOAT,
          sh_g.oy_6::FLOAT,
          sh_g.oy_7::FLOAT,
          sh_g.oy_8::FLOAT,
          sh_g.oy_9::FLOAT,
          sh_g.oy_10::FLOAT,
          sh_g.oy_11::FLOAT,
          sh_g.oy_12::FLOAT,
          sh_g.year
        FROM shartnoma_grafik AS sh_g
        JOIN users AS u ON sh_g.user_id = u.id
        JOIN regions AS r ON u.region_id = r.id
        JOIN shartnomalar_organization AS sh_o ON sh_o.id = sh_g.id_shartnomalar_organization
        JOIN spravochnik_organization AS s_o ON s_o.id = sh_o.spravochnik_organization_id
        JOIN smeta AS s_1 ON s_1.id = sh_o.smeta_id
        LEFT JOIN smeta AS s_2 ON s_2.id = sh_o.smeta2_id
        WHERE sh_g.isdeleted = false AND r.id = $1 AND sh_g.main_schet_id = $2 ${organization_filter}
        ORDER BY sh_o.doc_date 
        OFFSET $3 
        LIMIT $4
      )
      SELECT 
        ARRAY_AGG(row_to_json(data)) AS data,
        COALESCE((
          SELECT COUNT(sh_g.id)
          FROM shartnoma_grafik AS sh_g
          JOIN users AS u ON sh_g.user_id = u.id
          JOIN regions AS r ON u.region_id = r.id
          JOIN shartnomalar_organization AS sh_o ON sh_o.id = sh_g.id_shartnomalar_organization
          JOIN spravochnik_organization AS s_o ON s_o.id = sh_o.spravochnik_organization_id
          JOIN smeta AS s_1 ON s_1.id = sh_o.smeta_id
          LEFT JOIN smeta AS s_2 ON s_2.id = sh_o.smeta2_id
          WHERE sh_g.isdeleted = false 
            AND r.id = $1 
            AND sh_g.main_schet_id = $2 
            ${organization_filter}
        ), 0)::INTEGER AS total_count
      FROM data
    `, params);

    return { data: rows[0]?.data || [], total: rows[0].total_count };
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode);
  }
}


const updateShartnomaGrafikDB = async (data) => {
  try {
    const result = await pool.query(
      `
      UPDATE shartnoma_grafik SET 
        oy_1 = $1,
        oy_2 = $2,
        oy_3 = $3,
        oy_4 = $4,
        oy_5 = $5,
        oy_6 = $6,
        oy_7 = $7,
        oy_8 = $8,
        oy_9 = $9,
        oy_10 = $10,
        oy_11 = $11,
        oy_12 = $12
        WHERE id = $13 RETURNING *
    `,
      [
        data.oy_1,
        data.oy_2,
        data.oy_3,
        data.oy_4,
        data.oy_5,
        data.oy_6,
        data.oy_7,
        data.oy_8,
        data.oy_9,
        data.oy_10,
        data.oy_11,
        data.oy_12,
        data.id
      ],
    );
    return result.rows[0]
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

module.exports = {
  createShartnomaGrafik,
  getByIdGrafikDB,
  getAllGrafikDB,
  updateShartnomaGrafikDB,
};
