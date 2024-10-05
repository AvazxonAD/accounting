const pool = require("../../config/db");
const { handleServiceError } = require("../../middleware/service.handle");
const ErrorResponse = require('../../utils/errorResponse')

const getByAllPodrazdelenie = handleServiceError(
  async (region_id, name, rayon) => {
    const result = await pool.query(
      ` SELECT spravochnik_podrazdelenie.* 
        FROM spravochnik_podrazdelenie
        JOIN users ON spravochnik_podrazdelenie.user_id = users.id
        JOIN regions ON users.region_id = regions.id 
        WHERE spravochnik_podrazdelenie.name = $1 
          AND spravochnik_podrazdelenie.rayon = $2 
          AND regions.id = $3 
          AND spravochnik_podrazdelenie.isdeleted = false
    `,
      [name, rayon, region_id],
    );
    return result.rows[0];
  },
);

const createPodrazdelenie = handleServiceError(async (user_id, name, rayon) => {
  await pool.query(
    `INSERT INTO spravochnik_podrazdelenie(name, rayon, user_id) VALUES($1, $2, $3) 
    `,
    [name, rayon, user_id],
  );
});

const getAllPodrazdelenie = handleServiceError(
  async (region_id, offset, limit) => {
    const result = await pool.query(
      ` SELECT spravochnik_podrazdelenie.id, spravochnik_podrazdelenie.name, spravochnik_podrazdelenie.rayon 
        FROM spravochnik_podrazdelenie
        JOIN users ON spravochnik_podrazdelenie.user_id = users.id
        JOIN regions ON users.region_id = regions.id  
        WHERE spravochnik_podrazdelenie.isdeleted = false 
          AND regions.id = $1 
        ORDER BY id
        OFFSET $2 
        LIMIT $3 
    `,
      [region_id, offset, limit],
    );
    return result.rows;
  },
);

const getTotalPodrazlanie = handleServiceError(async (region_id) => {
  const result = await pool.query(
    `SELECT COUNT(spravochnik_podrazdelenie.id) AS total
        FROM spravochnik_podrazdelenie
        JOIN users ON spravochnik_podrazdelenie.user_id = users.id
        JOIN regions ON users.region_id = regions.id  
        WHERE spravochnik_podrazdelenie.isdeleted = false 
          AND regions.id = $1 `,
    [region_id],
  );
  return result.rows[0];
});

const getByIdPodrazlanie = handleServiceError(async (region_id, id, ignoreDeleted = false) => {
  let query = `
    SELECT 
        spravochnik_podrazdelenie.id, 
        spravochnik_podrazdelenie.name, 
        spravochnik_podrazdelenie.rayon 
    FROM spravochnik_podrazdelenie
    JOIN users ON spravochnik_podrazdelenie.user_id = users.id
    JOIN regions ON users.region_id = regions.id  
    WHERE spravochnik_podrazdelenie.id = $1
      AND regions.id = $2
  `;

  if (!ignoreDeleted) {
    query += ` AND spravochnik_podrazdelenie.isdeleted = false`;
  }

  const result = await pool.query(query, [id, region_id]);
  if(!result.rows[0]){
    throw new ErrorResponse('spravochnik_podrazdelenie not found', 404)
  }
  return result.rows[0];
});

const updatePodrazlanie = handleServiceError(async (id, name, rayon) => {
  await pool.query(
    `UPDATE  spravochnik_podrazdelenie SET name = $1, rayon = $2
        WHERE id = $3
    `,
    [name, rayon, id],
  );
});

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
