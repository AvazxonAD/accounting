const pool = require("@config/db");
const ErrorResponse = require('@utils/errorResponse')

const getByAllSostavService = async (region_id, name, rayon) => {
  try {
    const test = await pool.query(
      ` SELECT spravochnik_sostav.* 
        FROM spravochnik_sostav 
        JOIN users ON spravochnik_sostav.user_id = users.id
        JOIN regions ON users.region_id = regions.id
        WHERE spravochnik_sostav.name = $1 
          AND spravochnik_sostav.rayon = $2 
          AND regions.id = $3 
          AND spravochnik_sostav.isdeleted = false
      `,
      [name, rayon, region_id],
    );
    if(test.rows[0]){
      throw new ErrorResponse('This information has already been entered', 409)
    }
    return test.rows[0];
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const createSostavService = async (user_id, name, rayon) => {
  try {
    const result = await pool.query(
      `INSERT INTO spravochnik_sostav(name, rayon, user_id) VALUES($1, $2, $3) RETURNING *
      `,
      [name, rayon, user_id],
    );
    return result.rows[0]
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const getSostavService = async (region_id, offset, limit, search) => {
  try {
    const params = [region_id, offset, limit]
    let search_filter = ``
    if(search){
      search_filter = `AND spravochnik_sostav.name ILIKE '%' || $${params.length + 1} || '%'`
      params.push(search)
    }
    const result = await pool.query(
      ` WITH data AS (SELECT spravochnik_sostav.id, spravochnik_sostav.name, spravochnik_sostav.rayon 
          FROM spravochnik_sostav
          JOIN users ON spravochnik_sostav.user_id = users.id
          JOIN regions ON users.region_id = regions.id  
          WHERE spravochnik_sostav.isdeleted = false ${search_filter} 
            AND regions.id = $1 
          ORDER BY id
          OFFSET $2 
          LIMIT $3)
        SELECT 
          ARRAY_AGG(row_to_json(data)) AS data,
          (SELECT COUNT(spravochnik_sostav.id) AS total
          FROM spravochnik_sostav
          JOIN users ON spravochnik_sostav.user_id = users.id
          JOIN regions ON users.region_id = regions.id  
          WHERE spravochnik_sostav.isdeleted = false ${search_filter}
            AND regions.id = $1)::INTEGER AS total_count
        FROM data
      `, params);
    return result.rows[0];
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const getByIdSostavService = async (region_id, id, ignoreDeleted = false) => {
  try {
    let query = `
      SELECT 
          spravochnik_sostav.id, 
          spravochnik_sostav.name, 
          spravochnik_sostav.rayon 
      FROM spravochnik_sostav
      JOIN users ON spravochnik_sostav.user_id = users.id
      JOIN regions ON users.region_id = regions.id  
      WHERE spravochnik_sostav.id = $2 
        AND regions.id = $1
    `;
  
    if (!ignoreDeleted) {
      query += ` AND spravochnik_sostav.isdeleted = false`;
    }
  
    const result = await pool.query(query, [region_id, id]);
    if(!result.rows[0]){
      throw new ErrorResponse('spravochnik_sostav not found', 404)
    }
    return result.rows[0];
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const updateSostavService = async (id, name, rayon) => {
  try {
    const result = await pool.query(
      `UPDATE  spravochnik_sostav SET name = $1, rayon = $2 WHERE id = $3 RETURNING * 
      `,[name, rayon, id],
    );
    return result.rows[0]
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const deleteSostavService = async (id) => {
  try {
    await pool.query(
      `UPDATE spravochnik_sostav SET isdeleted = $1 WHERE id = $2 `,
      [true, id],
    );
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

module.exports = {
  getByAllSostavService,
  createSostavService,
  getSostavService,
  getByIdSostavService,
  updateSostavService,
  deleteSostavService,
};
