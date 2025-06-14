const pool = require("../../config/db");
const ErrorResponse = require('../../utils/errorResponse');

const createOperatsiiService = async (data) => {
  try {
    const result = await pool.query(
      `INSERT INTO spravochnik_operatsii(
          name,  schet, sub_schet, type_schet, smeta_id
          ) VALUES($1, $2, $3, $4, $5) RETURNING * 
      `, [
      data.name,
      data.schet,
      data.sub_schet,
      data.type_schet,
      data.smeta_id,
    ]);
    return result.rows[0]
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const getByNameAndSchetOperatsiiService = async (name, type_schet, smeta_id) => {
  try {
    const result = await pool.query(
      `SELECT * FROM spravochnik_operatsii WHERE name = $1 AND type_schet = $2 AND isdeleted = false AND smeta_id = $3`,
      [name, type_schet, smeta_id]);
    if (result.rows[0]) {
      throw new ErrorResponse('This data has already been entered', 409)
    }
    return result.rows[0];
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const getAllOperatsiiService = async (offset, limit, type_schet, search) => {
  try {
    type_schet_filter = ''
    let search_filter = ``
    const params = [offset, limit];
    if (search) {
      search_filter = `AND (
        name ILIKE '%' || $${params.length + 1} || '%' OR
        schet ILIKE '%' || $${params.length + 1} || '%' OR
        sub_schet ILIKE '%' || $${params.length + 1} || '%'
      )`
      params.push(search)
    }
    if (type_schet) {
      type_schet_filter = `AND type_schet  = $${params.length + 1}`
      params.push(type_schet)
    }
    const result = await pool.query(`
      WITH data AS (
        SELECT id, name, schet, sub_schet, type_schet, smeta_id
        FROM spravochnik_operatsii  WHERE isdeleted = false ${search_filter} ${type_schet_filter} OFFSET $1 LIMIT $2)
      SELECT 
        ARRAY_AGG(row_to_json(data)) AS data,
        (SELECT COUNT(spravochnik_operatsii.id) FROM spravochnik_operatsii WHERE isdeleted = false ${search_filter} ${type_schet_filter})::INTEGER AS total_count
      FROM data
    `, params);
    return { result: result.rows[0]?.data || [], total: result.rows[0]?.total_count || 0 }
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode);
  }
};

const getByIdOperatsiiService = async (id, type_schet = null, ignoreDeleted = false) => {
  try {
    const params = [id]
    let ignore = ``
    let type_schet_filter = ``
    if (!ignoreDeleted) {
      ignore = `AND isdeleted = false`
    }
    if (type_schet) {
      type_schet_filter = ` AND type_schet = $${params.length + 1}`
      params.push(type_schet)
    }
    const result = await pool.query(
      `SELECT id, name, schet, sub_schet, type_schet, smeta_id 
        FROM spravochnik_operatsii 
        WHERE id = $1 ${type_schet_filter} ${ignore}
      `, params);
    if (!result.rows[0]) {
      throw new ErrorResponse(`Spravochnik operatsii not found`, 404);
    }
    return result.rows[0];
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode);
  }
}


const updateOperatsiiService = async (data) => {
  const result = await pool.query(
    `UPDATE spravochnik_operatsii 
      SET name = $1, schet = $2, sub_schet = $3, type_schet = $4, smeta_id = $5
      WHERE id = $6 RETURNING * 
    `, [
    data.name,
    data.schet,
    data.sub_schet,
    data.type_schet,
    data.smeta_id,
    data.id,
  ]);
  return result.rows[0]
}

const deleteOperatsiiService = async (id) => {
  await pool.query(
    `UPDATE spravochnik_operatsii SET isdeleted = $1 WHERE id = $2`,
    [true, id],
  );
}

const getBySchetService = async (schet) => {
  try {
    const result = await pool.query(`
          SELECT id, name, schet, sub_schet, type_schet, smeta_id 
          FROM spravochnik_operatsii 
          WHERE schet = $1  AND isdeleted = false
        `, [schet])
    if (!result.rows[0]) {
      throw new ErrorResponse('Schet not found', 404)
    }
    return result.rows[0]
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const getSchetService = async () => {
  try {
    const result = await pool.query(`SELECT DISTINCT schet FROM spravochnik_operatsii WHERE  isdeleted = false`)
    return result.rows
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

module.exports = {
  getByNameAndSchetOperatsiiService,
  createOperatsiiService,
  getAllOperatsiiService,
  getByIdOperatsiiService,
  updateOperatsiiService,
  deleteOperatsiiService,
  getBySchetService,
  getSchetService
};
