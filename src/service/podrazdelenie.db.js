const pool = require("../config/db");
const asyncFunctionHandler = require("../middleware/asyncFunctionHandler");

const getByAllPodrazdelenie = asyncFunctionHandler(
  async (user_id, name, rayon) => {
    const test = await pool.query(
      `SELECT * FROM spravochnik_podrazdelenie WHERE name = $1 AND rayon = $2 AND user_id = $3 AND isdeleted = false
    `,
      [name, rayon, user_id],
    );
    return test.rows[0];
  },
);

const createPodrazdelenie = asyncFunctionHandler(
  async (user_id, name, rayon) => {
    const result = await pool.query(
      `INSERT INTO spravochnik_podrazdelenie(name, rayon, user_id) VALUES($1, $2, $3) RETURNING *
    `,
      [name, rayon, user_id],
    );
    return result.rows[0];
  },
);

const getAllPodrazdelenie = asyncFunctionHandler(
  async (user_id, offset, limit) => {
    const result = await pool.query(
      `SELECT id, name, rayon FROM spravochnik_podrazdelenie  
        WHERE isdeleted = false AND user_id = $1 ORDER BY id
        OFFSET $2 
        LIMIT $3 
    `,
      [user_id, offset, limit],
    );
    return result.rows;
  },
);

const getTotalPodrazlanie = asyncFunctionHandler(async (user_id) => {
  const result = await pool.query(
    `SELECT COUNT(id) AS total FROM spravochnik_podrazdelenie WHERE isdeleted = false AND user_id = $1`,
    [user_id],
  );
  return result.rows[0];
});

const getByIdPodrazlanie = asyncFunctionHandler(async (user_id, id) => {
  const result = await pool.query(
    `SELECT * FROM spravochnik_podrazdelenie   WHERE id = $1 AND user_id = $2 AND isdeleted = false`,
    [id, user_id],
  );
  return result.rows[0];
});

const updatePodrazlanie = asyncFunctionHandler(
  async (user_id, id, name, rayon) => {
    const result = await pool.query(
      `UPDATE  spravochnik_podrazdelenie SET name = $1, rayon = $2
        WHERE user_id = $3 AND id = $4
        RETURNING *
    `,
      [name, rayon, user_id, id],
    );
    return result.rows[0];
  },
);

const deletePodrazlanie = asyncFunctionHandler(async (id) => {
  const result = await pool.query(
    `UPDATE spravochnik_podrazdelenie SET isdeleted = $1 WHERE id = $2 RETURNING *`,
    [true, id],
  );
  return result.rows[0];
});

module.exports = {
  getByAllPodrazdelenie,
  createPodrazdelenie,
  getAllPodrazdelenie,
  getTotalPodrazlanie,
  getByIdPodrazlanie,
  updatePodrazlanie,
  deletePodrazlanie,
};
