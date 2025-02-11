const pool = require("../config/db");
const ErrorResponse = require("../utils/errorResponse");

const createShartnomaGrafik = async (data) => {
  const grafik = await pool.query(`
    INSERT INTO shartnoma_grafik
      (
        id_shartnomalar_organization, 
        user_id, 
        budjet_id, 
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
        yillik_oylik,
        smeta_id
      ) 
      VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18) 
      RETURNING *
    `, [
    data.shartnoma_id,
    data.user_id,
    data.budjet_id,
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
    data.yillik_oylik,
    data.smeta_id
  ]);
  
  return grafik.rows[0]
}

const getByIdGrafikDB = async (region_id, budjet_id, id, ignoreDeleted = false) => {
  try {
    let ignore = ``
    if (!ignoreDeleted) {
      ignore = ` AND sh_g.isdeleted = false`;
    }
    const result = await pool.query(`
        SELECT 
          sh_g.id,
          sh_g.id_shartnomalar_organization,
          sh.doc_num, 
          TO_CHAR(sh.doc_date, 'YYYY-MM-DD') AS doc_date, 
          sh.summa::FLOAT,
          sh.opisanie,
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
          sh_g.year,
          s.id smeta_id,
          s.smeta_number sub_schet
        FROM shartnoma_grafik AS sh_g
        JOIN users  ON sh_g.user_id = users.id
        JOIN regions ON users.region_id = regions.id
        JOIN shartnomalar_organization AS sh ON sh.id = sh_g.id_shartnomalar_organization
        JOIN smeta s ON s.id = sh_g.smeta_id 
        WHERE regions.id = $1 AND sh_g.budjet_id = $2 AND sh_g.id = $3 ${ignore}
      `, [region_id, budjet_id, id])
    if (!result.rows[0]) {
      throw new ErrorResponse('shartnoma_grafik not found', 404)
    }
    return result.rows[0];
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}


const getAllGrafikDB = async (region_id, budjet_id, organization, limit, offset, search = null) => {
  try {
    let organization_filter = '';
    let search_filter = ``;

    const params = [region_id, budjet_id, offset, limit];

    if (typeof organization === "number") {
      organization_filter = `AND so.id = $${params.length + 1}`;
      params.push(organization);
    }

    if (search) {
      params.push(search);
      search_filter = `AND (
        sho.doc_num = $${params.length} OR 
        so.inn ILIKE '%' || $${params.length} || '%' OR
        so.name ILIKE '%' || $${params.length} || '%'
      )`;
    }

    const { rows } = await pool.query(`
      WITH data AS (
        SELECT
          so.id AS spravochnik_organization_id,
          so.name AS spravochnik_organization_name,
          so.bank_klient AS spravochnik_organization_bank_klient,
          so.mfo AS spravochnik_organization_mfo,
          so.inn AS spravochnik_organization_inn,
          so.raschet_schet AS spravochnik_organization_raschet_schet,
          sh_g.id_shartnomalar_organization,
          sho.doc_num AS shartnomalar_organization_doc_num,
          TO_CHAR(sho.doc_date, 'YYYY-MM-DD') AS shartnomalar_organization_doc_date,
          s.id AS smeta_id,
          s.smeta_number AS smeta_number,
          s_2.smeta_number AS smeta2_number,
          sho.opisanie AS shartnomalar_organization_opisanie,
          sho.summa::FLOAT AS shartnomalar_organization_summa,
          sho.pudratchi_bool AS shartnomalar_organization_pudratchi_bool,
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
        JOIN shartnomalar_organization AS sho ON sho.id = sh_g.id_shartnomalar_organization
        JOIN spravochnik_organization AS so ON so.id = sho.spravochnik_organization_id
        JOIN smeta AS s ON s.id = sh_g.smeta_id
        WHERE sh_g.isdeleted = false 
          AND r.id = $1 
          AND sh_g.budjet_id = $2 
          ${organization_filter}
          ${search_filter}
        
        ORDER BY sho.doc_date 
        OFFSET $3 LIMIT $4
      )
      SELECT 
        ARRAY_AGG(row_to_json(data)) AS data,
        COALESCE(
          (
            SELECT COUNT(sh_g.id)
            FROM shartnoma_grafik AS sh_g
            JOIN users AS u ON sh_g.user_id = u.id
            JOIN regions AS r ON u.region_id = r.id
            JOIN shartnomalar_organization AS sho ON sho.id = sh_g.id_shartnomalar_organization
            JOIN spravochnik_organization AS so ON so.id = sho.spravochnik_organization_id
            JOIN smeta AS s ON s.id = sh_g.smeta_id
            WHERE sh_g.isdeleted = false 
              AND r.id = $1 
              AND sh_g.budjet_id = $2 
              ${organization_filter}
              ${search_filter}
          ), 0
        )::INTEGER AS total_count
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
        oy_12 = $12,
        smeta_id = $13
        WHERE id = $14 RETURNING *
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
        data.smeta_id,
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
  updateShartnomaGrafikDB
};
