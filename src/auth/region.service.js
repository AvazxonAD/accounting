const pool = require("../config/db.js");
const ErrorResponse = require('../utils/errorResponse.js')
const { tashkentTime } = require('../utils/date.function.js')

const getByNameRegionService  = async (name) => {
  try {
    const result = await pool.query(
      `SELECT * FROM regions WHERE name = $1 AND isdeleted = false`,
      [name],
    );
    return result.rows[0];
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const createRegionService = async (name) => {
  try {
    const result = await pool.query(
      `INSERT INTO regions(name, created_at, updated_at) VALUES($1, $2, $3) RETURNING *`,
      [name, tashkentTime(), tashkentTime()],
    );
    return result.rows[0]
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const getRegionService = async () => {
  try {
    const result = await pool.query(
      `SELECT id, name FROM regions WHERE isdeleted = false ORDER BY id`,
    );
    return result.rows;
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const getByIdRegionService = async (id, ignoreDeleted = false) => {
  try {
    let query = `SELECT id, name FROM regions WHERE id = $1`
    if (!ignoreDeleted) {
      query += `   AND isdeleted = false`
    }
    const result = await pool.query(query, [id]);
    if (!result.rows[0]) {
      throw new ErrorResponse("region not found", 404)
    }
    return result.rows[0];
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const update_region = async (id, name) => {
  try {
    const result = await pool.query(
      `UPDATE regions SET name = $1, updated_at = $3 WHERE id = $2 RETURNING *`,
      [name, id, tashkentTime()],
    );
    return result.rows[0]
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const delete_region = async (id) => {
  try {
    await pool.query(
      `UPDATE regions SET isdeleted = $1 WHERE id = $2 RETURNING *`,
      [true, id],
    );
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

module.exports = {
  getByNameRegionService ,
  createRegionService,
  getRegionService,
  getByIdRegionService,
  update_region,
  delete_region,
};
