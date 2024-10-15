const pool = require("../../config/db");
const { handleServiceError } = require("../../middleware/service.handle");
const ErrorResponse = require('../../utils/errorResponse')

const getByLoginUserService = async (login) => {  
  try {
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
          WHERE users.login = $1 AND access.region_id = regions.id
      `,
      [login.trim()],
    );
    return result.rows[0];
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
};

const getByIdUserService = handleServiceError(async (id) => {
  const result = await pool.query(
    `SELECT * FROM users WHERE id = $1 AND isdeleted = false`,
    [id],
  );
  return result.rows[0];
});

const updateAuth = handleServiceError(async (login, password, fio, id) => {
  await pool.query(
    `UPDATE users SET login = $1, password = $2, fio = $3, updated_at = $5 WHERE id = $4
    `,
    [login, password, fio, id, new Date()],
  );
});

const getProfileAuth = handleServiceError(async (id) => {
  const result = await pool.query(
    `SELECT users.id, role.id AS role_id, role.name AS role_name, users.fio, users.login
        FROM users 
        LEFT JOIN role ON users.role_id = role.id
        WHERE users.id = $1
    `,
    [id],
  );
  return result.rows[0];
});

module.exports = {
  getByLoginUserService,
  getByIdUserService,
  updateAuth,
  getProfileAuth,
};
