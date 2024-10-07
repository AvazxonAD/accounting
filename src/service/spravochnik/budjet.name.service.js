const pool = require("../../config/db");
const { handleServiceError } = require("../../middleware/service.handle");
const ErrorResponse = require("../../utils/errorResponse");

const getByNameBudjet = handleServiceError(async (name) => {
  const result = await pool.query(
    `SELECT id, name FROM spravochnik_budjet_name WHERE name = $1 AND isdeleted = false`,
    [name],
  );
  return result.rows[0];
});

const createBudjet = handleServiceError(async (name) => {
  await pool.query(`INSERT INTO spravochnik_budjet_name(name) VALUES($1)`, [
    name,
  ]);
});

const getAllBudjet = handleServiceError(async () => {
  const result = await pool.query(
    `SELECT id, name FROM spravochnik_budjet_name WHERE isdeleted = false ORDER BY id`,
  );
  return result.rows;
});

const getByIdBudjet = handleServiceError(async (id, ignoreDeleted = false) => {
  let query = `SELECT id, name FROM spravochnik_budjet_name WHERE id = $1`;
  let params = [id];

  // Agar ignoreDeleted false bo'lsa, isdeleted shartini qo'shamiz
  if (!ignoreDeleted) {
    query += ` AND isdeleted = false`;
  }

  let result = await pool.query(query, params);
  return result.rows[0];
});

const updateBudjet = handleServiceError(async (name, id) => {
  await pool.query(
    `UPDATE spravochnik_budjet_name SET name = $1 WHERE id = $2 `,
    [name, id],
  );
});

const deleteBudjet = async (id) => {
  try {
    const tables = await pool.query(`
      SELECT 
          conrelid::regclass AS name
      FROM 
          pg_constraint
      WHERE 
          confrelid = 'spravochnik_budjet_name'::regclass;
    `)
    for (let table of tables.rows) {
      const test = await pool.query(`
      SELECT * FROM ${table.name} WHERE spravochnik_budjet_name_id = $1 AND isdeleted = false
    `, [id])
      if (test.rows.length > 0) {
       throw new ErrorResponse('Cannot delete, there are linked documents', 400) 
      }
    }
    await pool.query(
      `UPDATE spravochnik_budjet_name SET isdeleted = $1 WHERE id = $2`,
      [true, id],
    );
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

module.exports = {
  getByNameBudjet,
  createBudjet,
  getAllBudjet,
  getByIdBudjet,
  updateBudjet,
  deleteBudjet,
};
