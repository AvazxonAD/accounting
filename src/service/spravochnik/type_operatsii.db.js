const pool = require("../../config/db");
const { handleServiceError } = require("../../middleware/service.handle");

const getByAlltype_operatsii = handleServiceError(
  async (region_id, name, rayon) => {
    const test = await pool.query(
      ` SELECT spravochnik_type_operatsii.* 
        FROM spravochnik_type_operatsii
        JOIN users ON spravochnik_type_operatsii.user_id = users.id
        JOIN regions ON users.region_id = regions.id 
        WHERE spravochnik_type_operatsii.name = $1 
          AND spravochnik_type_operatsii.rayon = $2 
          AND regions.id = $3 
          AND spravochnik_type_operatsii.isdeleted = false
    `,
      [name, rayon, region_id],
    );
    return test.rows[0];
  },
);

const createtype_operatsii = handleServiceError(
  async (user_id, name, rayon) => {
    await pool.query(
      `INSERT INTO spravochnik_type_operatsii(name, rayon, user_id) VALUES($1, $2, $3)
    `,
      [name, rayon, user_id],
    );
  },
);

const getAlltype_operatsii = handleServiceError(
  async (region_id, offset, limit) => {
    const result = await pool.query(
      `SELECT spravochnik_type_operatsii.id, spravochnik_type_operatsii.rayon, spravochnik_type_operatsii.name 
        FROM spravochnik_type_operatsii
        JOIN users ON spravochnik_type_operatsii.user_id = users.id
        JOIN regions ON users.region_id = regions.id  
        WHERE spravochnik_type_operatsii.isdeleted = false AND regions.id = $1 
        ORDER BY id
        OFFSET $2 
        LIMIT $3 
    `,
      [region_id, offset, limit],
    );
    return result.rows;
  },
);

const getTotaltype_operatsii = handleServiceError(async (region_id) => {
  const result = await pool.query(
    `SELECT COUNT(spravochnik_type_operatsii.id) AS total 
        FROM spravochnik_type_operatsii
        JOIN users ON spravochnik_type_operatsii.user_id = users.id
        JOIN regions ON users.region_id = regions.id  
        WHERE spravochnik_type_operatsii.isdeleted = false AND regions.id = $1 `,
    [region_id],
  );
  return result.rows[0];
});

const getByIdtype_operatsii = handleServiceError(async (region_id, id) => {
  const result = await pool.query(
    `SELECT spravochnik_type_operatsii.id, spravochnik_type_operatsii.rayon, spravochnik_type_operatsii.name 
        FROM spravochnik_type_operatsii
        JOIN users ON spravochnik_type_operatsii.user_id = users.id
        JOIN regions ON users.region_id = regions.id  
        WHERE spravochnik_type_operatsii.isdeleted = false 
          AND regions.id = $1 
          AND spravochnik_type_operatsii.id = $2
    `,
    [region_id, id],
  );
  return result.rows[0];
});

const updatetype_operatsii = handleServiceError(async (id, name, rayon) => {
  await pool.query(
    `UPDATE  spravochnik_type_operatsii SET name = $1, rayon = $2
        WHERE  id = $3
    `,
    [name, rayon, id],
  );
});

const deletetype_operatsii = handleServiceError(async (id) => {
  await pool.query(
    `UPDATE spravochnik_type_operatsii SET isdeleted = $1 WHERE id = $2 `,
    [true, id],
  );
});

module.exports = {
  getByAlltype_operatsii,
  createtype_operatsii,
  getAlltype_operatsii,
  getTotaltype_operatsii,
  getByIdtype_operatsii,
  updatetype_operatsii,
  deletetype_operatsii,
};
