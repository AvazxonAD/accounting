const pool = require("../config/db");
const ErrorResponse = require('../utils/errorResponse')

const existLogin = async (login) => {
  try {
    const user = await pool.query(
      `
        SELECT
          users.id
        FROM users
        WHERE users.login = $1 AND isdeleted = false
      `,
      [login.trim()]
    );
    if (user.rows[0]) {
      throw new ErrorResponse('Login already exist', 409);
    }
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode);
  }
}

const getByLoginUserService = async (login) => {
  try {
    const user = await pool.query(
      `
        SELECT
          users.role_id,
          role.name AS role_name
        FROM users
        INNER JOIN role ON role.id = users.role_id
        WHERE users.login = $1 AND users.isdeleted = false
      `,
      [login.trim()]
    );
    console.log(user.rows)
    if(!user.rows[0]){
      throw new ErrorResponse('login or password incorrent', 403)
    }
    let filter = ``;
    if (user.rows[0].role_name !== 'super-admin' && user.rows[0].role_name !== 'region-admin') {
      filter = `AND users.region_id = access.region_id`
    }
    const result = await pool.query(
      `
        SELECT 
          users.id, 
          users.fio, 
          users.password, 
          users.login, 
          users.region_id, 
          users.role_id, 
          role.name AS role_name,
          regions.name AS region_name,
          json_build_object(
              'region_id', access.region_id,
              'region', access.region,
              'role', access.role,
              'users', access.users,
              'budjet', access.budjet,
              'access', access.access,
              'spravochnik', access.spravochnik,
              'smeta', access.smeta,
              'smeta_grafik', access.smeta_grafik,
              'bank', access.bank,
              'kassa', access.kassa,
              'shartnoma', access.shartnoma,
              'jur3', access.jur3,
              'jur152', access.jur152,
              'jur4', access.jur4,
              'region_users', access.region_users,
              'podotchet_monitoring', access.podotchet_monitoring,
              'organization_monitoring', access.organization_monitoring
          ) AS access_object
        FROM users 
        INNER JOIN role ON role.id = users.role_id
        INNER JOIN access ON access.role_id = role.id 
        LEFT JOIN regions ON regions.id = users.region_id
        WHERE users.login = $1 ${filter}
        `,
      [login.trim()],
    );
    return result.rows[0];
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
};

const getByIdUserService = async (id) => {
  try {
    const result = await pool.query(
      `SELECT * FROM users WHERE id = $1 AND isdeleted = false`,
      [id],
    );
    return result.rows[0];
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const updateAuth = async (login, password, fio, id) => {
  try {
    const result = await pool.query(
      `UPDATE users SET login = $1, password = $2, fio = $3, updated_at = $5 WHERE id = $4 RETURNING * 
      `,
      [login, password, fio, id, new Date()],
    );
    return result.rows[0]
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const getProfileAuth = async (id) => {
  try {
    const result = await pool.query(
      `SELECT users.id, role.id AS role_id, role.name AS role_name, users.fio, users.login
          FROM users 
          LEFT JOIN role ON users.role_id = role.id
          WHERE users.id = $1
      `,
      [id],
    );
    if (!result.rows[0]) {
      throw new ErrorResponse('user not found', 404)
    }
    return result.rows[0];
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

module.exports = {
  existLogin,
  getByLoginUserService,
  getByIdUserService,
  updateAuth,
  getProfileAuth,
};
