const pool = require("../../config/db");
const ErrorResponse = require("../../utils/errorResponse");

const getByIdSchetOperatsiiService = async (region_id, id, ignoreDeleted = false) => {
  try {
    let ignore = ``
    if (!ignoreDeleted) {
      ignore = ` AND s_o.isdeleted = false`;
    }
    const result = await pool.query(`
      SELECT 
        s_o.id, 
        s_o.name, 
        s_o.schet 
      FROM schet_operatsii s_o
      JOIN users AS u ON s_o.user_id = u.id
      JOIN regions AS r ON u.region_id = r.id
      WHERE r.id = $1 ${ignore} AND s_o.id = $2`,
      [region_id, id]);
    if (!result.rows[0]) {
      throw new ErrorResponse(`schet operatsii not found`, 404);
    }
    return result.rows[0];
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode);
  }
};

const createSchetOperatsiiService = async (data) => {
  try {
    const result = await pool.query(
      `   INSERT INTO schet_operatsii(
          name,
          schet,
          user_id
        ) 
        VALUES($1, $2, $3) RETURNING *
      `, [
      data.name,
      data.schet,
      data.user_id
    ]);
    return result.rows[0]
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const getAllSchetOperatsiiService = async (region_id, offset, limit, search) => {
  try {
    const params = [region_id, offset, limit]
    let search_filter = ``
    if (search) {
      search_filter = `AND (s_o.name ILIKE '%' || $${params.length + 1} || '%' OR s_o.schet ILIKE '%' || $${params.length + 1} || '%')`
      params.push(search)
    }
    const result = await pool.query(
      `
          WITH data AS (SELECT 
              s_o.id, 
              s_o.user_id,
              s_o.name, 
              s_o.schet
            FROM schet_operatsii AS s_o
            JOIN users ON s_o.user_id = users.id
            JOIN regions ON users.region_id = regions.id
            WHERE s_o.isdeleted = false AND regions.id = $1 ${search_filter} OFFSET $2 LIMIT $3)
          SELECT 
            ARRAY_AGG(row_to_json(data)) AS data,
            (SELECT COUNT(s_o.id)
              FROM schet_operatsii AS s_o
              JOIN users ON s_o.user_id = users.id
              JOIN regions ON users.region_id = regions.id
              WHERE s_o.isdeleted = false ${search_filter}
              AND regions.id = $1)::INTEGER AS total_count
          FROM data 
      `, params);
    return { result: result.rows[0]?.data || [], total: result.rows[0]?.total_count || 0 };
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const updateSchetOperatsiiService = async (data) => {
  try {
    const result = await pool.query(`UPDATE  schet_operatsii SET name = $1, schet = $2 WHERE id = $3 RETURNING * `, [
      data.name,
      data.schet,
      data.id
    ])
    return result.rows[0]
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const deleteSchetOperatsiiService = async (id) => {
  try {
    await pool.query(`UPDATE schet_operatsii SET isdeleted = $1 WHERE id = $2`, [true, id]);
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const getByAllOperatsiiService = async (region_id, name, schet) => {
  try {
    const result = await pool.query(`SELECT s_o.* 
      FROM schet_operatsii AS s_o 
      JOIN users ON users.id = s_o.user_id
      JOIN regions ON regions.id = users.region_id
      WHERE s_o.name = $1 AND s_o.isdeleted = false AND regions.id = $2 AND s_o.schet = $3
    `, [name, region_id, schet])
    if (result.rows[0]) {
      throw new ErrorResponse('This data has already been entered', 409)
    }
    return result.rows[0]
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

module.exports = {
  getByIdSchetOperatsiiService,
  createSchetOperatsiiService,
  getAllSchetOperatsiiService,
  updateSchetOperatsiiService,
  deleteSchetOperatsiiService,
  getByAllOperatsiiService,
}
