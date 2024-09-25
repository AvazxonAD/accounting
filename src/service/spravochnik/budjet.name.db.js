const pool = require("../../config/db");
const { handleServiceError } = require("../../middleware/service.handle");

const getByNameBudjet = handleServiceError(async (name) => {
  const result = await pool.query(
    `SELECT id, name FROM spravochnik_budjet_name WHERE name = $1 AND isdeleted = false`,
    [name],
  );
  return result.rows[0];
});

const createBudjet = handleServiceError(async (name) => {
  await pool.query(
    `INSERT INTO spravochnik_budjet_name(name) VALUES($1)`,
    [name],
  );
});

const getAllBudjet = handleServiceError(async () => {
  const result = await pool.query(
    `SELECT id, name FROM spravochnik_budjet_name WHERE isdeleted = false ORDER BY id`,
  );
  return result.rows;
});

const getByIdBudjet = handleServiceError(async (id) => {
  let result = await pool.query(
    `SELECT id, name FROM spravochnik_budjet_name WHERE id = $1`,
    [id],
  );
  return result.rows[0];
});

const updateBudjet = handleServiceError(async (name, id) => {
  await pool.query(
    `UPDATE spravochnik_budjet_name SET name = $1 WHERE id = $2 `,
    [name, id],
  );
});

const deleteBudjet = handleServiceError(async (id) => {
  await pool.query(
    `UPDATE spravochnik_budjet_name SET isdeleted = $1 WHERE id = $2`,
    [true, id],
  );
});

module.exports = {
  getByNameBudjet,
  createBudjet,
  getAllBudjet,
  getByIdBudjet,
  updateBudjet,
  deleteBudjet,
};
