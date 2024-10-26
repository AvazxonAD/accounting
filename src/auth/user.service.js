const pool = require("../config/db");
const ErrorResponse = require('../utils/errorResponse')
const { tashkentTime } = require('../utils/date.function')

const createUserSerivice = async (login, password, fio, role_id, region_id) => {
  try {
    const user = await pool.query(
      `INSERT INTO users(login, password, fio, role_id, region_id, created_at, updated_at) 
          VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING * 
      `,
      [login, password, fio, role_id, region_id, tashkentTime(), tashkentTime()],
    );
    return user.rows[0]
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
};

const checkAdminService = async (region_id, role_id) => {
  try {
    const test = await pool.query(`SELECT * FROM users WHERE role_id = $1 AND isdeleted = false AND region_id = $2`, [role_id, region_id])
    if(test.rows[0]){
      throw new ErrorResponse(`The admin has already been entered. code: 409`, 409)
    }
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
} 

const getPasswordUser = async(id) => {
  try {
    const password = await pool.query(`SELECT password FROM users WHERE id = $1 AND isdeleted = false`, [id])
    return password[0]
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const getByIdUserService = async (id, isdeleted = false) => {
  try {
    let ignore = ``
    if(!isdeleted){
      ignore = `AND users.isdeleted = false`
    }
    const result = await pool.query(`
              SELECT 
              users.id, 
              users.fio, 
              users.login, 
              users.region_id, 
              users.role_id, 
              role.name AS role_name,
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
          WHERE users.id = $1 ${ignore}
    `, [id]);

    if (!result.rows[0]) {
      throw new ErrorResponse('user not found', 404)
    }
    return result.rows[0];
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const updateUserService = async (login, password, fio, role_id, region_id, id) => {
  try {
    const result = await pool.query(
      `UPDATE users SET login = $1, password = $2, fio = $3, role_id  = $4, updated_at = $5, region_id = $7
        WHERE id = $6
        RETURNING *
      `,
    [login, password, fio, role_id, tashkentTime(), id, region_id]);
    return result.rows[0]
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const getUserService = async (region_id) => {
  try {
    const result = await pool.query(
      `SELECT 
              users.id, 
              users.role_id, 
              users.region_id, 
              users.fio,
              users.login,
              role.name AS role_name,
              regions.name AS region_name
              FROM users 
              JOIN role ON role.id = users.role_id
              JOIN regions ON regions.id = users.region_id
              WHERE region_id = $1 AND users.isdeleted = false
      `,
      [region_id],
    );
    return result.rows;
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const getAdminService = async (role_id) => {
  try {
    const result = await pool.query(
      `SELECT 
              users.id, 
              users.role_id, 
              users.region_id, 
              users.fio,
              users.login,
              role.name AS role_name,
              regions.name AS region_name
              FROM users 
              JOIN role ON role.id = users.role_id
              JOIN regions ON regions.id = users.region_id
              WHERE users.isdeleted = false AND role_id = $1
              ORDER BY users.id
      `, [role_id],
    );
    return result.rows;
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const deleteUserService = async (id) => {
  try {
    await pool.query(`UPDATE users SET isdeleted = $1 WHERE id = $2`, [true, id]);
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

module.exports = {
  createUserSerivice,
  getUserService,
  getByIdUserService,
  updateUserService,
  deleteUserService,
  getAdminService,
  getPasswordUser,
  checkAdminService
};
