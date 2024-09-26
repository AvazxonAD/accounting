const pool = require("../../config/db");
const { handleServiceError } = require("../../middleware/service.handle");

const getByAllPodotChet = handleServiceError(async (name, rayon, user_id) => {
  const result = await pool.query(
    `SELECT * FROM spravochnik_podotchet_litso WHERE name = $1 AND rayon = $2 AND user_id = $3 AND isdeleted = false
    `,
    [name, rayon, user_id],
  );
  return result.rows[0];
});

const createPodotChet = handleServiceError(async (object) => {
  await pool.query(
    `INSERT INTO spravochnik_podotchet_litso(name, rayon, user_id) VALUES($1, $2, $3)
    `,
    [object.name, object.rayon, object.user_id],
  );
});

const getAllPodotChet = handleServiceError(async (user_id, offset, limit) => {
  const result = await pool.query(
    `SELECT id, name, rayon FROM spravochnik_podotchet_litso  
        WHERE isdeleted = false AND user_id = $1 ORDER BY id
        OFFSET $2 
        LIMIT $3 
    `,
    [user_id, offset, limit],
  );
  return result;
});

const totalPodotChet = handleServiceError(async (user_id) => {
  const result = await pool.query(
    `SELECT COUNT(id) AS total FROM spravochnik_podotchet_litso WHERE isdeleted = false AND user_id = $1`,
    [user_id],
  );
  return result.rows[0];
});

const getByIdPodotchet = handleServiceError(async (user_id, id) => {
  const result = await pool.query(
    `SELECT id, name, rayon FROM spravochnik_podotchet_litso  WHERE id = $1 AND user_id = $2 AND isdeleted = false`,
    [id, user_id],
  );
  return result.rows[0];
});

const updatePodotchet = handleServiceError(async (object) => {
    await pool.query(
      `UPDATE  spravochnik_podotchet_litso SET name = $1, rayon = $2
        WHERE user_id = $3 AND id = $4 AND isdeleted = false
    `,
      [object.name, object.rayon, object.user_id, object.id],
    );
  },
);

const deletePodotchet = handleServiceError(async (id) => {
  await pool.query(
    `UPDATE spravochnik_podotchet_litso SET isdeleted = $1 WHERE id = $2 AND isdeleted = false`,
    [true, id],
  );
});

module.exports = {
  getByAllPodotChet,
  createPodotChet,
  getAllPodotChet,
  totalPodotChet,
  getByIdPodotchet,
  updatePodotchet,
  deletePodotchet,
};
