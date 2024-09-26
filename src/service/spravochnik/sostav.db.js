const pool = require("../../config/db");
const { handleServiceError } = require("../../middleware/service.handle");

const getByAllSostav = handleServiceError(async (user_id, name, rayon) => {
  const test = await pool.query(
    `SELECT * FROM spravochnik_sostav WHERE name = $1 AND rayon = $2 AND user_id = $3 AND isdeleted = false
    `,
    [name, rayon, user_id],
  );
  return test.rows[0];
});

const createSostav = handleServiceError(async (user_id, name, rayon) => {
  await pool.query(
    `INSERT INTO spravochnik_sostav(name, rayon, user_id) VALUES($1, $2, $3)
    `,
    [name, rayon, user_id],
  );
});

const getAllSostav = handleServiceError(async (user_id, offset, limit) => {
  const result = await pool.query(
    `SELECT id, name, rayon FROM spravochnik_sostav  
        WHERE isdeleted = false AND user_id = $1 ORDER BY id
        OFFSET $2 
        LIMIT $3 
    `,
    [user_id, offset, limit],
  );
  return result.rows;
});

const getTotalSostav = handleServiceError(async (user_id) => {
  const result = await pool.query(
    `SELECT COUNT(id) AS total FROM spravochnik_sostav WHERE isdeleted = false AND user_id = $1`,
    [user_id],
  );
  return result.rows[0];
});

const getByIdSostav = handleServiceError(async (user_id, id) => {
  const result = await pool.query(
    `SELECT id, name, rayon FROM spravochnik_sostav   WHERE id = $1 AND user_id = $2 AND isdeleted = false`,
    [id, user_id],
  );
  return result.rows[0];
});

const updateSostav = handleServiceError(async (user_id, id, name, rayon) => {
  await pool.query(
    `UPDATE  spravochnik_sostav SET name = $1, rayon = $2
        WHERE user_id = $3 AND id = $4
    `,
    [name, rayon, user_id, id],
  );
});

const deleteSostav = handleServiceError(async (id) => {
  await pool.query(
    `UPDATE spravochnik_sostav SET isdeleted = $1 WHERE id = $2 `,
    [true, id],
  );
});

module.exports = {
  getByAllSostav,
  createSostav,
  getAllSostav,
  getTotalSostav,
  getByIdSostav,
  updateSostav,
  deleteSostav,
};
