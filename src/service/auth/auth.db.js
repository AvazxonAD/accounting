const pool = require("../../config/db");
const { handleServiceError } = require("../../middleware/service.handle");

const getByLoginAuth = handleServiceError(async (login) => {
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
          access.kassa AS access_kassa,
          access.bank AS access_bank,
          access.spravochnik AS access_spravochnik,
          access.organization AS access_organization,
          access.region_users AS access_region_users,
          access.smeta AS access_smeta,
          access.region AS access_region,
          access.role AS access_role, 
          access.users AS access_users,
          access.shartnoma AS access_shartnoma,
          access.jur3 AS access_jur3,
          access.jur4 AS access_jur4
        FROM users 
        INNER JOIN role ON role.id = users.role_id
        INNER JOIN access ON access.role_id = role.id 
        WHERE users.login = $1
    `,
    [login.trim()],
  );
  return result.rows[0];
});

const getByIdAuth = handleServiceError(async (id) => {
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
  getByLoginAuth,
  getByIdAuth,
  updateAuth,
  getProfileAuth,
};
