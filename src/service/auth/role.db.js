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
  const role = await pool.query(
    `INSERT INTO role(name, created_at) VALUES($1, $2) RETURNING *`,
    [name, new Date()],
  );
  return role.rows[0]
});

const get_all_role = handleServiceError(async () => {
  const result = await pool.query(
    `SELECT id, name FROM role WHERE isdeleted = false AND name != $1 AND name != $2 ORDER BY id`,
  ['super-admin', 'region-admin']);
  return result.rows;
});

const getByIdRole = handleServiceError(async (id, ignore = false) => {
  let query = `SELECT id, name FROM role WHERE id = $1`
  if(!ignore){
    query += `   AND isdeleted = false`
  }
  const result = await pool.query(query,[id]);
  return result.rows[0];
});

const update_role = handleServiceError(async (id, name) => {
  await pool.query(`UPDATE role SET name = $1, updated_at = $3 WHERE id = $2`, [
    name,
    id,
    new Date(),
  ]);
});

const delete_role = handleServiceError(async (id) => {
  await pool.query(`UPDATE access SET isdeleted = true WHERE role_id = $1`, [id])
  console.log(1)
  await pool.query(`UPDATE role SET isdeleted = $1 WHERE id = $2 AND name != $3 AND name != $4`, [true, id, 'super-admin', 'region-admin']);
});

const getAdminRole = handleServiceError(async () => {
  const admin = await pool.query(`SELECT * FROM role WHERE name = $1 AND isdeleted = $2`, ['region-admin', false])
  return admin.rows[0]
})

module.exports = {
  getByNameRole,
  create_role,
  get_all_role,
  getByIdRole,
  update_role,
  delete_role,
  getAdminRole
};
