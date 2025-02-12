const pool = require("@config/db");
const ErrorResponse = require('@utils/errorResponse')

const getByAlltypeOperatsiiService = async (region_id, name, rayon) => {
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
    if(test.rows[0]){
      throw new ErrorResponse('This information has already been entered', 409)
    }
    return test.rows[0];    
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}


const createTypeOperatsiiService = async (user_id, name, rayon) => {
  try {
    const result = await pool.query(
      `INSERT INTO spravochnik_type_operatsii(name, rayon, user_id) VALUES($1, $2, $3) RETURNING *
    `,[name, rayon, user_id]);
    return result.rows[0]
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}


const getAlltypeOperatsiiService = async (region_id, offset, limit, search) => {
  try {
    const params = [region_id, offset, limit]
    let search_filter = ``
    if(search){
      search_filter = `AND s_t_o.name ILIKE '%' || $${params.length + 1} || '%'`
      params.push(search)
    }
    const result = await pool.query(
      `
              WITH data AS (
          SELECT s_t_o.id, 
                s_t_o.rayon, 
                s_t_o.name 
          FROM spravochnik_type_operatsii AS s_t_o
          JOIN users ON s_t_o.user_id = users.id
          JOIN regions ON users.region_id = regions.id  
          WHERE s_t_o.isdeleted = false 
            AND regions.id = $1 ${search_filter}
          ORDER BY id
          OFFSET $2 
          LIMIT $3
      )
      SELECT 
          ARRAY_AGG(row_to_json(data)) AS data,
          (SELECT COUNT(s_t_o.id) AS total 
          FROM  spravochnik_type_operatsii s_t_o
          JOIN users ON s_t_o.user_id = users.id
          JOIN regions ON users.region_id = regions.id  
          WHERE s_t_o.isdeleted = false 
            AND regions.id = $1 ${search_filter})::INTEGER AS total_count 
      FROM data
      `
    ,params);
    return result.rows[0];
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const getByIdTypeOperatsiiService = async (region_id, id, ignoreDeleted = false) => {
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


const updatetypeOperatsiiService = async (id, name, rayon) => {
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

const deletetypeOperatsiiService = async (id) => {
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
  getByAlltypeOperatsiiService,
  createTypeOperatsiiService,
  getAlltypeOperatsiiService,
  getByIdTypeOperatsiiService,
  updatetypeOperatsiiService,
  deletetypeOperatsiiService
};
