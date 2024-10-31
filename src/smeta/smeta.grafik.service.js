const pool = require("../config/db");
const ErrorResponse = require("../utils/errorResponse");

const getByAllSmetaGrafik = async (region_id, smeta_id, spravochnik_budjet_name_id, year) => {
  try {
    const result = await pool.query(
      `   SELECT s_g.* 
              FROM smeta_grafik AS s_g
              JOIN users ON s_g.user_id = users.id
              JOIN regions ON users.region_id = regions.id
              WHERE s_g.smeta_id = $1 AND s_g.spravochnik_budjet_name_id = $2 AND s_g.isdeleted = false AND regions.id = $3 AND s_g.year = $4
          `,
      [smeta_id, spravochnik_budjet_name_id, region_id, year],
    );
    if (result.rows[0]) {
      throw new ErrorResponse('This information has already been entered', 409)
    }
    return result.rows[0];
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const createSmetaGrafik = async (data) => {
  try {
    const result = await pool.query(`
      INSERT INTO smeta_grafik(
        smeta_id, 
        spravochnik_budjet_name_id, 
        user_id, 
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
        itogo
      ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING *
    `, [
      data.smeta_id,
      data.spravochnik_budjet_name_id,
      data.user_id,
      data.year,
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
      data.itogo
    ]);
    return result.rows[0];
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode);
  }
}


const getAllSmetaGrafik = async (region_id, offset, limit) => {
  try {
    const { rows } = await pool.query(
      `
        WITH data AS 
          (SELECT 
              s_g.id, 
              s_g.smeta_id, 
              smeta.smeta_name,
              smeta.smeta_number,
              s_g.spravochnik_budjet_name_id,
              spravochnik_budjet_name.name AS budjet_name,
              s_g.itogo::FLOAT,
              s_g.oy_1::FLOAT,
              s_g.oy_2::FLOAT,
              s_g.oy_3::FLOAT,
              s_g.oy_4::FLOAT,
              s_g.oy_5::FLOAT,
              s_g.oy_6::FLOAT,
              s_g.oy_7::FLOAT,
              s_g.oy_8::FLOAT,
              s_g.oy_9::FLOAT,
              s_g.oy_10::FLOAT,
              s_g.oy_11::FLOAT,
              s_g.oy_12::FLOAT,
              s_g.year
            FROM smeta_grafik AS s_g
            JOIN users ON s_g.user_id = users.id
            JOIN regions ON regions.id = users.region_id  
            JOIN spravochnik_budjet_name ON spravochnik_budjet_name.id = s_g.spravochnik_budjet_name_id
            JOIN smeta ON smeta.id = s_g.smeta_id
            WHERE s_g.isdeleted = false AND regions.id = $1 OFFSET $2 LIMIT $3
          )
        SELECT
          ARRAY_AGG(row_to_json(data)) AS data,
          (
            SELECT COUNT(smeta_grafik.id) FROM smeta_grafik 
            JOIN users ON smeta_grafik.user_id = users.id
            JOIN regions ON regions.id = users.region_id
            WHERE smeta_grafik.isdeleted = false AND regions.id = $1)::INTEGER total_count 
        FROM data
      `,
      [region_id, offset, limit],
    );
    return { data: rows[0]?.data, total: rows[0]?.total_count }
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const getElementByIdGrafik = async (region_id, id, ignoreDeleted = false) => {
  try {
    let ignore = ``
    if (!ignoreDeleted) {
      ignore += ` AND s_g.isdeleted = false`;
    }
    const result = await pool.query(`
      SELECT 
          s_g.id, 
          s_g.smeta_id, 
          smeta.smeta_name,
          smeta.smeta_number,
          s_g.spravochnik_budjet_name_id,
          spravochnik_budjet_name.name AS budjet_name,
          s_g.itogo::FLOAT,
          s_g.oy_1::FLOAT,
          s_g.oy_2::FLOAT,
          s_g.oy_3::FLOAT,
          s_g.oy_4::FLOAT,
          s_g.oy_5::FLOAT,
          s_g.oy_6::FLOAT,
          s_g.oy_7::FLOAT,
          s_g.oy_8::FLOAT,
          s_g.oy_9::FLOAT,
          s_g.oy_10::FLOAT,
          s_g.oy_11::FLOAT,
          s_g.oy_12::FLOAT,
          s_g.year
      FROM smeta_grafik AS s_g
      JOIN users ON s_g.user_id = users.id
      JOIN regions ON users.region_id = regions.id  
      JOIN spravochnik_budjet_name ON spravochnik_budjet_name.id = s_g.spravochnik_budjet_name_id
      JOIN smeta ON smeta.id = s_g.smeta_id
      WHERE regions.id = $1 AND s_g.id = $2 ${ignore}
    `, [region_id, id]);
    if ((!result.rows[0])) {
      throw new ErrorResponse('smeta_grafik not found', 404)
    }
    return result.rows[0];
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}


const updateSmetaGrafikDB = async (data) => {
  try {
    const result = await pool.query(
      `UPDATE  smeta_grafik 
              SET 
                  itogo = $1,
                  oy_1 = $2,
                  oy_2 = $3,
                  oy_3 = $4,
                  oy_4 = $5,
                  oy_5 = $6,
                  oy_6 = $7,
                  oy_7 = $8,
                  oy_8 = $9,
                  oy_9 = $10,
                  oy_10 = $11,
                  oy_11 = $12,
                  oy_12 = $13,
                  smeta_id = $15,
                  spravochnik_budjet_name_id = $16,
                  year = $17
              WHERE  id = $14 AND isdeleted = false RETURNING * 
          `,
      [
        data.itogo,
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
        data.id,
        data.smeta_id,
        data.spravochnik_budjet_name_id,
        data.year
      ],
    );
    return result.rows[0]
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const deleteSmetaGrafik = async (id) => {
  try {
    await pool.query(`UPDATE smeta_grafik SET isdeleted = $1 WHERE id = $2 AND isdeleted = false`, [true, id]);
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

module.exports = {
  getByAllSmetaGrafik,
  createSmetaGrafik,
  getAllSmetaGrafik,
  getElementByIdGrafik,
  updateSmetaGrafikDB,
  deleteSmetaGrafik,
};
