const pool = require("../../config/db");
const ErrorResponse = require('../../utils/errorResponse')
const { handleServiceError } = require("../../middleware/service.handle");

const getByAlltype_operatsii = async (region_id, name, rayon) => {
  try {
    const test = await pool.query(
      ` SELECT spravochnik_type_operatsii.* 
        FROM spravochnik_type_operatsii
        JOIN users ON spravochnik_type_operatsii.user_id = users.id
        JOIN regions ON users.region_id = regions.id 
        WHERE spravochnik_type_operatsii.name = $1 
          AND spravochnik_type_operatsii.rayon = $2 
          AND regions.id = $3 
          AND spravochnik_type_operatsii.isdeleted = false
    `,[name, rayon, region_id]);
    return test.rows[0];    
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}


const createtype_operatsii = async (user_id, name, rayon) => {
  try {
    const result = await pool.query(
      `INSERT INTO spravochnik_type_operatsii(name, rayon, user_id) VALUES($1, $2, $3) RETURNING *
    `,[name, rayon, user_id]);
    return result.rows[0]
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}


const getAlltype_operatsii = async (region_id, offset, limit) => {
  try {
    const result = await pool.query(
      `
              WITH data AS (
          SELECT spravochnik_type_operatsii.id, 
                spravochnik_type_operatsii.rayon, 
                spravochnik_type_operatsii.name 
          FROM spravochnik_type_operatsii
          JOIN users ON spravochnik_type_operatsii.user_id = users.id
          JOIN regions ON users.region_id = regions.id  
          WHERE spravochnik_type_operatsii.isdeleted = false 
            AND regions.id = $1 
          ORDER BY id
          OFFSET $2 
          LIMIT $3
      )
      SELECT 
          COALESCE(ARRAY_AGG(row_to_json(data)), '[]') AS data,
          (SELECT COUNT(spravochnik_type_operatsii.id) AS total 
          FROM spravochnik_type_operatsii
          JOIN users ON spravochnik_type_operatsii.user_id = users.id
          JOIN regions ON users.region_id = regions.id  
          WHERE spravochnik_type_operatsii.isdeleted = false 
            AND regions.id = $1) AS total_count
      FROM data
      `
    ,[region_id, offset, limit]);
    console.log(result.rows[0])
    return result.rows[0];
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}


const getTotaltype_operatsii = async (region_id) => {
  try {
    const result = await pool.query(
      `SELECT COUNT(spravochnik_type_operatsii.id) AS total 
          FROM spravochnik_type_operatsii
          JOIN users ON spravochnik_type_operatsii.user_id = users.id
          JOIN regions ON users.region_id = regions.id  
          WHERE spravochnik_type_operatsii.isdeleted = false AND regions.id = $1 
    `,[region_id]);
    return result.rows[0];
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const getByIdtype_operatsii = async (region_id, id, ignoreDeleted = false) => {
  try {
    let query = `
      SELECT 
          spravochnik_type_operatsii.id, 
          spravochnik_type_operatsii.rayon, 
          spravochnik_type_operatsii.name 
      FROM spravochnik_type_operatsii
      JOIN users ON spravochnik_type_operatsii.user_id = users.id
      JOIN regions ON users.region_id = regions.id  
      WHERE regions.id = $1 
        AND spravochnik_type_operatsii.id = $2
    `;
  
    if (!ignoreDeleted) {
      query += ` AND spravochnik_type_operatsii.isdeleted = false`;
    }
  
    const result = await pool.query(query, [region_id, id]);
    if (!result.rows[0]) {
      throw new ErrorResponse('spravochnik_type_operatsii not found', 404)
    }
    return result.rows[0];
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}


const updatetype_operatsii = async (id, name, rayon) => {
  try {
    const result = await pool.query(
      `UPDATE  spravochnik_type_operatsii SET name = $1, rayon = $2
          WHERE  id = $3
          RETURNING * 
      `,[name, rayon, id]);
    return result.rows[0]
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const deletetype_operatsii = async (id) => {
  try {
    await pool.query(
      `UPDATE spravochnik_type_operatsii SET isdeleted = $1 WHERE id = $2 `,
      [true, id],
    );
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

module.exports = {
  getByAlltype_operatsii,
  createtype_operatsii,
  getAlltype_operatsii,
  getTotaltype_operatsii,
  getByIdtype_operatsii,
  updatetype_operatsii,
  deletetype_operatsii,
};
