const pool = require("../../config/db");
const ErrorResponse = require("../../utils/errorResponse");
const { tashkentTime } = require('../../utils/date.function')

const createPodpisService = async (data) => {
  try {
    const result = await pool.query(
      `INSERT INTO spravochnik_podpis_dlya_doc(
          user_id, type_document, numeric_poryadok, 
          doljnost_name, fio_name, created_at, updated_at
       ) VALUES($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [
        data.user_id,
        data.type_document,
        data.numeric_poryadok,
        data.doljnost_name,
        data.fio_name,
        tashkentTime(),
        tashkentTime()
      ]
    );
    return result.rows[0];
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode);
  }
};

const getAllPodpisService = async (region_id, offset, limit, type = null) => {
  try {
    const params = [region_id]
    let offset_limit = ``
    let type_filter = ``
    if(type){
      type_filter = `AND s_p.type_document = $${params.length + 1}`
      params.push(type) 
    } 
    if(offset && limit){
      offset_limit = `OFFSET $${params.length + 1} LIMIT $${params + 2}`
      params.push(offset, limit)
    }
    const result = await pool.query(
      `
        WITH data AS (
          SELECT 
            s_p.id, s_p.type_document, s_p.numeric_poryadok, 
            s_p.doljnost_name, s_p.fio_name
          FROM spravochnik_podpis_dlya_doc AS s_p
          JOIN users AS u ON u.id = s_p.user_id
          JOIN regions AS r ON r.id = u.region_id
          WHERE r.id = $1 AND s_p.isdeleted = false ${type_filter}
          ORDER BY numeric_poryadok ${offset_limit}
        )
        SELECT 
          ARRAY_AGG(ROW_TO_JSON(data)) AS data,
          (
            SELECT 
              COALESCE(COUNT(s_p.id), 0)::INTEGER
            FROM spravochnik_podpis_dlya_doc AS s_p
            JOIN users AS u ON u.id = s_p.user_id
            JOIN regions AS r ON r.id = u.region_id
            WHERE r.id = $1 AND s_p.isdeleted = false ${type_filter}
          ) AS total_count
        FROM data
    `, params);
    const data = result.rows[0]
    return { data: data?.data || [], total: data.total_count }
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode);
  }
};

const getByIdPodpisService = async (region_id, id, ignoreDelete = false) => {
  try {
    let ignore = ``
    if(!ignoreDelete){
      ignore = `AND s_p.isdeleted = false`
    }
    const result = await pool.query(
      `SELECT 
          s_p.id, s_p.type_document, s_p.numeric_poryadok, 
          s_p.doljnost_name, s_p.fio_name
       FROM spravochnik_podpis_dlya_doc AS s_p
       JOIN users AS u ON u.id = s_p.user_id
       JOIN regions AS r ON r.id = u.region_id
       WHERE r.id = $1 AND s_p.id = $2 ${ignore}`,
      [region_id, id]
    );
    if (!result.rows[0]) {
      throw new ErrorResponse(`Podpis not found`, 404);
    }
    return result.rows[0];
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode);
  }
};

const getByAllPodpisService = async (region_id, type_doc, doljnost_name, fio_name) => {
  try {
    const result = await pool.query(
      `SELECT s_p.id
       FROM spravochnik_podpis_dlya_doc AS s_p
       JOIN users AS u ON u.id = s_p.user_id
       JOIN regions AS r ON r.id = u.region_id
       WHERE r.id = $1 AND s_p.doljnost_name = $2 AND s_p.type_document = $3 AND s_p.fio_name = $4`,
      [region_id, doljnost_name, type_doc,  fio_name]
    );
    if (result.rows[0]) {
      throw new ErrorResponse(`This data already exist`, 409);
    }
    return result.rows[0];
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode);
  }
};

const updatePodpisService = async (data) => {
  try {
    const result = await pool.query(
      `UPDATE spravochnik_podpis_dlya_doc
       SET type_document = $1, numeric_poryadok = $2, 
           doljnost_name = $3, fio_name = $4, updated_at = $6
       WHERE id = $5 AND isdeleted = false
       RETURNING *`,
      [
        data.type_document,
        data.numeric_poryadok,
        data.doljnost_name,
        data.fio_name,
        data.id,
        tashkentTime()
      ]
    );
    return result.rows[0];
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode);
  }
};

const deletePodpisService = async (id) => {
  try {
    await pool.query(
      `UPDATE spravochnik_podpis_dlya_doc SET isdeleted = true, updated_at = $2 WHERE id = $1`,
      [id, tashkentTime()]
    );
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode);
  }
};

module.exports = {
  createPodpisService,
  getAllPodpisService,
  getByIdPodpisService,
  updatePodpisService,
  deletePodpisService,
  getByAllPodpisService
};
