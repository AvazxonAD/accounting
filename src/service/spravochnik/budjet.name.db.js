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
  const result = await pool.query(
    `INSERT INTO spravochnik_budjet_name(name) VALUES($1) RETURNING *`,
    [name],
  );
  return result.rows[0];
});

const getAllBudjet = handleServiceError(async () => {
  const result = await pool.query(
    `SELECT id, name FROM spravochnik_budjet_name WHERE isdeleted = false ORDER BY id`,
  );
  return result.rows;
});

const getByIdBudjet = handleServiceError(async (id) => {
  let result = await pool.query(
    `SELECT * FROM spravochnik_budjet_name WHERE id = $1`,
    [id],
  );
  return result.rows[0];
});

const updateBudjet = handleServiceError(async (name, id) => {
  const result = await pool.query(
    `UPDATE spravochnik_budjet_name SET name = $1 WHERE id = $2 RETURNING *`,
    [name, id],
  );
  return result.rows[0];
});

const deleteBudjet = handleServiceError(async (id) => {
  const result = await pool.query(
    `UPDATE spravochnik_budjet_name SET isdeleted = $1 WHERE id = $2 RETURNING *`,
    [true, req.params.id],
  );
  return result[0];
});

module.exports = {
  getByNameBudjet,
  createBudjet,
  getAllBudjet,
  getByIdBudjet,
  updateBudjet,
  deleteBudjet,
};
