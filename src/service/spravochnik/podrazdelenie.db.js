const pool = require("../../config/db");
const { handleServiceError } = require("../../middleware/service.handle");

const getByAllPodrazdelenie = handleServiceError(
  async (user_id, name, rayon) => {
    const test = await pool.query(
      `SELECT * FROM spravochnik_podrazdelenie WHERE name = $1 AND rayon = $2 AND user_id = $3 AND isdeleted = false
    `,
      [name, rayon, user_id],
    );
    return test.rows[0];
  },
);

const createPodrazdelenie = handleServiceError(
  async (user_id, name, rayon) => {
    await pool.query(
      `INSERT INTO spravochnik_podrazdelenie(name, rayon, user_id) VALUES($1, $2, $3) 
    `,
      [name, rayon, user_id],
    );
  },
);

const getAllPodrazdelenie = handleServiceError(
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

const getTotalPodrazlanie = handleServiceError(async (user_id) => {
  const result = await pool.query(
    `SELECT COUNT(id) AS total FROM spravochnik_podrazdelenie WHERE isdeleted = false AND user_id = $1`,
    [user_id],
  );
  return result.rows[0];
});

const getByIdPodrazlanie = handleServiceError(async (user_id, id) => {
  const result = await pool.query(
    `SELECT id, name, rayon  FROM spravochnik_podrazdelenie   WHERE id = $1 AND user_id = $2 AND isdeleted = false`,
    [id, user_id],
  );
  return result.rows[0];
});

const updatePodrazlanie = handleServiceError(
  async (user_id, id, name, rayon) => {
    await pool.query(
      `UPDATE  spravochnik_podrazdelenie SET name = $1, rayon = $2
        WHERE user_id = $3 AND id = $4
    `,
      [name, rayon, user_id, id],
    );
  },
);

const deletePodrazlanie = handleServiceError(async (id) => {
  await pool.query(
    `UPDATE spravochnik_podrazdelenie SET isdeleted = $1 WHERE id = $2 RETURNING *`,
    [true, id],
  );
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
