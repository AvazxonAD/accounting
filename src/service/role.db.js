const pool = require("../config/db");
const asyncFunctionHandler = require("../middleware/asyncFunctionHandler");

const getByNameRole = asyncFunctionHandler(async (name) => {
  const result = await pool.query(
    `SELECT * FROM role WHERE name = $1 AND isdeleted = false`,
    [name],
  );
  return result.rows[0];
});

const create_role = asyncFunctionHandler(async (name) => {
  const result = await pool.query(
    `INSERT INTO role(name) VALUES($1) RETURNING *`,
    [name],
  );
  return result.rows[0];
});

const get_all_role = asyncFunctionHandler(async () => {
  const result = await pool.query(
    `SELECT id, name FROM role WHERE isdeleted = false ORDER BY id`,
  );
  return result.rows;
});

const getByIdRole = asyncFunctionHandler(async (id) => {
  const result = await pool.query(
    `SELECT id, name FROM role WHERE isdeleted = false AND id = $1`,
    [id],
  );
  return result.rows[0];
});

const update_role = asyncFunctionHandler(async (id, name) => {
  const result = await pool.query(
    `UPDATE role SET name = $1 WHERE id = $2 RETURNING *`,
    [name, id],
  );
  return result.rows[0];
});

const delete_role = asyncFunctionHandler(async (id) => {
  const result = await pool.query(
    `UPDATE role SET isdeleted = $1 WHERE id = $2 RETURNING *`,
    [true, id],
  );
  return result.rows[0];
});

module.exports = {
  getByNameRole,
  create_role,
  get_all_role,
  getByIdRole,
  update_role,
  delete_role,
};
