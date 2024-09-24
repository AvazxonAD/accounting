const pool = require("../config/db");
const asyncFunctionHandler = require("../middleware/asyncFunctionHandler");

const getByLoginAuth = asyncFunctionHandler(async (login) => {
  const result = await pool.query(
    `
        SELECT users.id, users.fio, users.password, users.login, users.region_id, users.role_id, role.name AS role_name 
        FROM users 
        INNER JOIN role ON role.id = users.role_id 
        WHERE login = $1 AND users.isdeleted = false
    `,
    [login.trim()],
  );
  return result.rows[0];
});

const getByIdAuth = asyncFunctionHandler(async (id) => {
  const result = await pool.query(
    `SELECT * FROM users WHERE id = $1 AND isdeleted = false`,
    [id],
  );
  return result.rows[0];
});

const updateAuth = asyncFunctionHandler(async (login, password, fio, id) => {
  const result = await pool.query(
    `UPDATE users SET login = $1, password = $2, fio = $3 WHERE id = $4 RETURNING *
    `,
    [login, password, fio, id],
  );
  return result.rows[0];
});

const getProfileAuth = asyncFunctionHandler(async (id) => {
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
