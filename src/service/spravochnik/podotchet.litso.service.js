const pool = require("../../config/db");
const ErrorResponse = require("../../utils/errorResponse");
const { tashkentTime } = require('../../utils/date.function')

const getByAllPodotChetService = async (name, rayon, region_id) => {
  try {
    const result = await pool.query(
      `SELECT s_p_l.id, s_p_l.name, s_p_l.rayon 
        FROM spravochnik_podotchet_litso AS s_p_l 
        JOIN users ON s_p_l.user_id = users.id
        JOIN regions ON users.region_id = regions.id
        WHERE s_p_l.name = $1 
          AND s_p_l.rayon = $2 
          AND regions.id = $3 
          AND s_p_l.isdeleted = false
      `,
      [name, rayon, region_id],
    );
    if (result.rows[0]) {
      throw new ErrorResponse('This information has already been submitted', 409)
    }
    return result.rows[0];
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const createPodotChetService = async (data) => {
  try {
    const result = await pool.query(
      `INSERT INTO spravochnik_podotchet_litso(name, rayon, user_id, created_at, updated_at) VALUES($1, $2, $3, $4, $5) RETURNING *
    `,
      [data.name, data.rayon, data.user_id, tashkentTime(), tashkentTime()],
    );
    return result.rows[0]
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }

}

const getAllPodotChetService = async (region_id, offset, limit, search) => {
  try {
    const params = [region_id, offset, limit]
    let search_filter = ``
    if(search){
      search_filter = `AND s_p_l.name ILIKE '%' || $${params.length + 1} || '%'`
      params.push(search)
    }
    const result = await pool.query(
      ` WITH data AS (
        SELECT s_p_l.id, 
              s_p_l.name, 
              s_p_l.rayon
        FROM spravochnik_podotchet_litso AS  s_p_l
        JOIN users AS u ON s_p_l.user_id = u.id
        JOIN regions AS r ON u.region_id = r.id
        WHERE r.id = $1 AND s_p_l.isdeleted = false ${search_filter}
        ORDER BY s_p_l.id OFFSET $2 LIMIT $3
      )
      SELECT 
        ARRAY_AGG(row_to_json(data)) AS data,
        (SELECT COUNT(s_p_l.id)
        FROM spravochnik_podotchet_litso AS s_p_l
        JOIN users AS u ON s_p_l.user_id = u.id
        JOIN regions AS r ON u.region_id = r.id
        WHERE r.id = $1 AND s_p_l.isdeleted = false ${search_filter})::INTEGER AS total_count
      FROM data
      `, params);
    return result.rows[0];
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const getByIdPodotchetService = async (region_id, id, ignoreDeleted = false) => {
  try {
    let query = `
      SELECT 
          s_p_l.id, 
          s_p_l.name, 
          s_p_l.rayon 
      FROM spravochnik_podotchet_litso AS s_p_l
      JOIN users ON s_p_l.user_id = users.id
      JOIN regions ON users.region_id = regions.id
      WHERE regions.id = $1
        AND s_p_l.id = $2
    `;
    let params = [region_id, id];

    if (!ignoreDeleted) {
      query += ` AND s_p_l.isdeleted = false`;
    }
    const result = await pool.query(query, params);
    if (!result.rows[0]) {
      throw new ErrorResponse('spravochnik_podotchet_litso not found', 404)
    }
    return result.rows[0];
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const updatePodotchetService = async (data) => {
  try {
    const result = await pool.query(
      ` UPDATE  spravochnik_podotchet_litso SET name = $1, rayon = $2, updated_at = $4
        WHERE id = $3
        RETURNING *
      `, [data.name, data.rayon, data.id, tashkentTime()],
    );
    return result.rows[0]
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const deletePodotchetService = async (id) => {
  try {
    await pool.query(
      `UPDATE spravochnik_podotchet_litso SET isdeleted = $1 WHERE id = $2 AND isdeleted = false`,
      [true, id],
    );
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

module.exports = {
  getByAllPodotChetService,
  createPodotChetService,
  getAllPodotChetService,
  getByIdPodotchetService,
  updatePodotchetService,
  deletePodotchetService,
};
