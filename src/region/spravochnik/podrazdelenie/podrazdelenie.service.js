const pool = require("@config/db");
const ErrorResponse = require('@utils/errorResponse')

const getByAllPodrazdelenieService = async (region_id, name, rayon) => {
  try {
    const result = await pool.query(
      ` SELECT s_p.* 
          FROM spravochnik_podrazdelenie AS s_p
          JOIN  users AS u ON s_p.user_id = u.id
          JOIN regions AS r ON u.region_id = r.id 
          WHERE s_p.name = $1 
            AND s_p.rayon = $2 
            AND r.id = $3 
            AND s_p.isdeleted = false
      `,
      [name, rayon, region_id],
    );
    return result.rows[0];
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}


const createPodrazdelenieService = async (user_id, name, rayon) => {
  try {
    const resut = await pool.query(
      `INSERT INTO spravochnik_podrazdelenie(name, rayon, user_id) VALUES($1, $2, $3) RETURNING * `,
      [name, rayon, user_id]
    );
    return resut.rows[0]
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const getAllPodrazdelenieService = async (region_id, offset, limit, search) => {
  try {
    const params  = [region_id, offset, limit] 
    let search_filter = ``
    if(search){
      search_filter = `AND s_p.name ILIKE '%' || $${params.length + 1} || '%'`
      params.push(search)
    }
    const result = await pool.query(
      ` WITH data AS (
        SELECT s_p.id, 
              s_p.name, 
              s_p.rayon
        FROM spravochnik_podrazdelenie AS  s_p
        JOIN users AS u ON s_p.user_id = u.id
        JOIN regions AS r ON u.region_id = r.id
        WHERE r.id = $1 AND s_p.isdeleted = false ${search_filter}
        ORDER BY s_p.id
        OFFSET $2 
        LIMIT $3
      )
      SELECT 
        COALESCE( JSON_AGG( row_to_json( data ) ), '[]'::JSON ) AS data,
        (SELECT COUNT(s_p.id)
        FROM spravochnik_podrazdelenie AS s_p
        JOIN users AS u ON s_p.user_id = u.id
        JOIN regions AS r ON u.region_id = r.id
        WHERE r.id = $1 AND s_p.isdeleted = false ${search_filter})::INTEGER AS total_count
      FROM data
      `,params);
    return result.rows[0];
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
  }


const getByIdPodrazlanieService = async (region_id, id, ignoreDeleted = false) => {
  try {
    let query = `
      SELECT 
          spravochnik_podrazdelenie.id, 
          spravochnik_podrazdelenie.name, 
          spravochnik_podrazdelenie.rayon 
      FROM spravochnik_podrazdelenie
      JOIN users ON spravochnik_podrazdelenie.user_id = users.id
      JOIN regions ON users.region_id = regions.id  
      WHERE spravochnik_podrazdelenie.id = $1
        AND regions.id = $2
    `;
    if (!ignoreDeleted) {
      query += ` AND spravochnik_podrazdelenie.isdeleted = false`;
    }
    const result = await pool.query(query, [id, region_id]);
    if (!result.rows[0]) {
      throw new ErrorResponse('spravochnik_podrazdelenie not found', 404)
    }
    return result.rows[0];
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const updatePodrazlanieService = async (id, name, rayon) => {
  try {
    const result = await pool.query(
      `UPDATE  spravochnik_podrazdelenie SET name = $1, rayon = $2 WHERE id = $3 RETURNING * `,
      [name, rayon, id]
    );
    return result.rows[0]
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const deletePodrazlanieService = async (id) => {
  await pool.query(
    `UPDATE spravochnik_podrazdelenie SET isdeleted = $1 WHERE id = $2 RETURNING *`,
    [true, id],
  );
}

module.exports = {
  getByAllPodrazdelenieService,
  createPodrazdelenieService,
  getAllPodrazdelenieService,
  getByIdPodrazlanieService,
  updatePodrazlanieService,
  deletePodrazlanieService,
};
