const pool = require("../../config/db");
const { handleServiceError } = require("../../middleware/service.handle");

const getByAllPodotChet = handleServiceError(async (name, rayon, region_id) => {
  const result = await pool.query(
    `SELECT spravochnik_podotchet_litso.id, spravochnik_podotchet_litso.name, spravochnik_podotchet_litso.rayon 
      FROM spravochnik_podotchet_litso 
      JOIN users ON spravochnik_podotchet_litso.user_id = users.id
      JOIN regions ON users.region_id = regions.id
      WHERE spravochnik_podotchet_litso.name = $1 
        AND spravochnik_podotchet_litso.rayon = $2 
        AND regions.id = $3 
        AND spravochnik_podotchet_litso.isdeleted = false
    `,
    [name, rayon, region_id],
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

const getAllPodotChet = handleServiceError(async (region_id, offset, limit) => {
  const result = await pool.query(
    ` SELECT spravochnik_podotchet_litso.id, spravochnik_podotchet_litso.name, spravochnik_podotchet_litso.rayon 
      FROM spravochnik_podotchet_litso 
      JOIN users ON spravochnik_podotchet_litso.user_id = users.id
      JOIN regions ON users.region_id = regions.id
      WHERE regions.id = $1
        AND spravochnik_podotchet_litso.isdeleted = false
      ORDER BY id
      OFFSET $2 
      LIMIT $3 
    `,
    [region_id, offset, limit],
  );
  return result;
});

const totalPodotChet = handleServiceError(async (region_id) => {
  const result = await pool.query(
    `SELECT COUNT(spravochnik_podotchet_litso.id) AS total
      FROM spravochnik_podotchet_litso 
      JOIN users ON spravochnik_podotchet_litso.user_id = users.id
      JOIN regions ON users.region_id = regions.id
      WHERE regions.id = $1
        AND spravochnik_podotchet_litso.isdeleted = false`,
    [region_id],
  );
  return result.rows[0];
});

const getByIdPodotchet = handleServiceError(async (region_id, id) => {
  const result = await pool.query(
    `SELECT spravochnik_podotchet_litso.id, spravochnik_podotchet_litso.name, spravochnik_podotchet_litso.rayon 
      FROM spravochnik_podotchet_litso
      JOIN users ON spravochnik_podotchet_litso.user_id = users.id
      JOIN regions ON users.region_id = regions.id
      WHERE regions.id = $1
        AND spravochnik_podotchet_litso.isdeleted = false
        AND spravochnik_podotchet_litso.id = $2
    `,
    [region_id, id],
  );
  return result.rows[0];
});

const updatePodotchet = handleServiceError(async (object) => {
  await pool.query(
    `UPDATE  spravochnik_podotchet_litso SET name = $1, rayon = $2
        WHERE id = $3 AND isdeleted = false
    `,
    [object.name, object.rayon, object.id],
  );
});

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
