const pool = require("../../config/db");
const { handleServiceError } = require("../../middleware/service.handle");

const getByNameRole = handleServiceError(async (name) => {
  const result = await pool.query(
    `SELECT * FROM role WHERE name = $1 AND isdeleted = false`,
    [name],
  );
  return result.rows[0];
});

const create_role = handleServiceError(async (name) => {
  await pool.query(`INSERT INTO role(name) VALUES($1)`, [name]);
});

const get_all_role = handleServiceError(async () => {
  const result = await pool.query(
    `SELECT id, name FROM role WHERE isdeleted = false ORDER BY id`,
  );
  return result.rows;
});

const getByIdRole = handleServiceError(async (id) => {
  const result = await pool.query(
    `SELECT id, name FROM role WHERE isdeleted = false AND id = $1`,
    [id],
  );
  return result.rows[0];
});

const update_role = handleServiceError(async (id, name) => {
  await pool.query(`UPDATE role SET name = $1 WHERE id = $2`, [name, id]);
});

const delete_role = handleServiceError(async (id) => {
  await pool.query(`UPDATE role SET isdeleted = $1 WHERE id = $2`, [true, id]);
});

module.exports = {
  getByNameRole,
  create_role,
  get_all_role,
  getByIdRole,
  update_role,
  delete_role,
};
