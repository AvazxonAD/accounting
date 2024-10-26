const pool = require("../config/db");
const { tashkentTime } = require('../utils/date.function');
const ErrorResponse = require("../utils/errorResponse");

const getByNameRoleService = async (name) => {
  try {
    const result = await pool.query(`SELECT * FROM role WHERE name = $1`, [name]);
    return result.rows[0];
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const createRoleService = async (name) => {
  try {
    const role = await pool.query(`INSERT INTO role(name, created_at, updated_at) VALUES($1, $2, $3) RETURNING *`, [name, tashkentTime(), tashkentTime()]);
    return role.rows[0]
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const getRoleService = async () => {
  try {
    const result = await pool.query(
      `SELECT id, name FROM role WHERE isdeleted = false AND name != $1 AND name != $2 ORDER BY id`,
      ['super-admin', 'region-admin']);
    return result.rows;
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const getByIdRoleService = async (id, ignore = false) => {
  try {
    let query = `SELECT id, name FROM role WHERE id = $1 AND name != $2 AND name != $3`
    if (!ignore) {
      query += `   AND isdeleted = false`
    }
    const result = await pool.query(query, [id, 'super-admin', 'region-admin']);
    if(!result.rows[0]){
      throw new ErrorResponse('role not found', 404)
    }
    return result.rows[0];
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const updateRoleService = async (id, name) => {
  try {
    const role = await pool.query(`UPDATE role SET name = $1, updated_at = $3 WHERE id = $2 RETURNING * `
    , [ name, id, tashkentTime() ]);
    return role.rows[0]
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const deleteRoleService = async (id) => {
  try {
    await pool.query(`UPDATE access SET isdeleted = true WHERE role_id = $1`, [id])
    await pool.query(`UPDATE role SET isdeleted = $1 WHERE id = $2 AND name != $3 AND name != $4`, [true, id, 'super-admin', 'region-admin']);
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const getAdminRoleService = async () => {
  try {
    const admin = await pool.query(`SELECT * FROM role WHERE name = $1 AND isdeleted = $2`, ['region-admin', false])
    if(!admin.rows[0]){
      throw new ErrorResponse('role not found', 404)
    }
    return admin.rows[0]
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

module.exports = {
  getByNameRoleService,
  createRoleService,
  getRoleService,
  getByIdRoleService,
  updateRoleService,
  deleteRoleService,
  getAdminRoleService
};
