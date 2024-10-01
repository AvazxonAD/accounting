const pool = require("../../config/db");
const { handleServiceError } = require("../../middleware/service.handle");

const getByNameRegion = handleServiceError(async (name) => {
  const result = await pool.query(
    `SELECT * FROM regions WHERE name = $1 AND isdeleted = false`,
    [name],
  );
  return result.rows[0];
});

const create_region = handleServiceError(async (name) => {
  await pool.query(
    `INSERT INTO regions(name, created_at, updated_at) VALUES($1, $2, $3)`,
    [name, new Date(), new Date()],
  );
});

const get_all_region = handleServiceError(async () => {
  const result = await pool.query(
    `SELECT id, name FROM regions WHERE isdeleted = false ORDER BY id`,
  );
  return result.rows;
});

const getByIdRegion = handleServiceError(async (id) => {
  const result = await pool.query(
    `SELECT id, name FROM regions WHERE isdeleted = false AND id = $1`,
    [id],
  );
  return result.rows[0];
});

const update_region = handleServiceError(async (id, name) => {
  await pool.query(
    `UPDATE regions SET name = $1, updated_at = $3 WHERE id = $2`,
    [name, id, new Date()],
  );
});

const delete_region = handleServiceError(async (id) => {
  await pool.query(
    `UPDATE regions SET isdeleted = $1 WHERE id = $2 RETURNING *`,
    [true, id],
  );
});

module.exports = {
  getByNameRegion,
  create_region,
  get_all_region,
  getByIdRegion,
  update_region,
  delete_region,
};
