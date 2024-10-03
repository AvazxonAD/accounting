const pool = require("../../config/db");
const { handleServiceError } = require("../../middleware/service.handle");

const getByAllSostav = handleServiceError(async (region_id, name, rayon) => {
  const test = await pool.query(
    ` SELECT spravochnik_sostav.* 
      FROM spravochnik_sostav 
      JOIN users ON spravochnik_sostav.user_id = users.id
      JOIN regions ON users.region_id = regions.id
      WHERE spravochnik_sostav.name = $1 
        AND spravochnik_sostav.rayon = $2 
        AND regions.id = $3 
        AND spravochnik_sostav.isdeleted = false
    `,
    [name, rayon, region_id],
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

const getAllSostav = handleServiceError(async (region_id, offset, limit) => {
  const result = await pool.query(
    ` SELECT spravochnik_sostav.id, spravochnik_sostav.name, spravochnik_sostav.rayon 
      FROM spravochnik_sostav
      JOIN users ON spravochnik_sostav.user_id = users.id
      JOIN regions ON users.region_id = regions.id  
      WHERE spravochnik_sostav.isdeleted = false 
        AND regions.id = $1 
      ORDER BY id
      OFFSET $2 
      LIMIT $3 
    `,
    [region_id, offset, limit],
  );
  return result.rows;
});

const getTotalSostav = handleServiceError(async (region_id) => {
  const result = await pool.query(
    `SELECT COUNT(spravochnik_sostav.id) AS total
      FROM spravochnik_sostav
      JOIN users ON spravochnik_sostav.user_id = users.id
      JOIN regions ON users.region_id = regions.id  
      WHERE spravochnik_sostav.isdeleted = false 
        AND regions.id = $1`,
    [region_id],
  );
  return result.rows[0];
});

const getByIdSostav = handleServiceError(async (region_id, id, ignoreDeleted = false) => {
  let query = `
    SELECT 
        spravochnik_sostav.id, 
        spravochnik_sostav.name, 
        spravochnik_sostav.rayon 
    FROM spravochnik_sostav
    JOIN users ON spravochnik_sostav.user_id = users.id
    JOIN regions ON users.region_id = regions.id  
    WHERE spravochnik_sostav.id = $2 
      AND regions.id = $1
  `;

  if (!ignoreDeleted) {
    query += ` AND spravochnik_sostav.isdeleted = false`;
  }

  const result = await pool.query(query, [region_id, id]);
  return result.rows[0];
});

const updateSostav = handleServiceError(async (id, name, rayon) => {
  await pool.query(
    `UPDATE  spravochnik_sostav SET name = $1, rayon = $2
        WHERE id = $3
    `,
    [name, rayon, id],
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
