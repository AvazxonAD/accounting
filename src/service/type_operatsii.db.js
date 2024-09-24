const pool = require("../config/db");
const asyncFunctionHandler = require("../middleware/asyncFunctionHandler");

const getByAlltype_operatsii = asyncFunctionHandler(
  async (user_id, name, rayon) => {
    const test = await pool.query(
      `SELECT * FROM spravochnik_type_operatsii WHERE name = $1 AND rayon = $2 AND user_id = $3 AND isdeleted = false
    `,
      [name, rayon, user_id],
    );
    return test.rows[0];
  },
);

const createtype_operatsii = asyncFunctionHandler(
  async (user_id, name, rayon) => {
    const result = await pool.query(
      `INSERT INTO spravochnik_type_operatsii(name, rayon, user_id) VALUES($1, $2, $3) RETURNING *
    `,
      [name, rayon, user_id],
    );
    return result.rows[0];
  },
);

const getAlltype_operatsii = asyncFunctionHandler(
  async (user_id, offset, limit) => {
    const result = await pool.query(
      `SELECT id, name, rayon FROM spravochnik_type_operatsii  
        WHERE isdeleted = false AND user_id = $1 ORDER BY id
        OFFSET $2 
        LIMIT $3 
    `,
      [user_id, offset, limit],
    );
    return result.rows;
  },
);

const getTotaltype_operatsii = asyncFunctionHandler(async (user_id) => {
  const result = await pool.query(
    `SELECT COUNT(id) AS total FROM spravochnik_type_operatsii WHERE isdeleted = false AND user_id = $1`,
    [user_id],
  );
  return result.rows[0];
});

const getByIdtype_operatsii = asyncFunctionHandler(async (user_id, id) => {
  const result = await pool.query(
    `SELECT * FROM spravochnik_type_operatsii   WHERE id = $1 AND user_id = $2 AND isdeleted = false`,
    [id, user_id],
  );
  return result.rows[0];
});

const updatetype_operatsii = asyncFunctionHandler(
  async (user_id, id, name, rayon) => {
    const result = await pool.query(
      `UPDATE  spravochnik_type_operatsii SET name = $1, rayon = $2
        WHERE user_id = $3 AND id = $4
        RETURNING *
    `,
      [name, rayon, user_id, id],
    );
    return result.rows[0];
  },
);

const deletetype_operatsii = asyncFunctionHandler(async (id) => {
  const result = await pool.query(
    `UPDATE spravochnik_type_operatsii SET isdeleted = $1 WHERE id = $2 RETURNING *`,
    [true, id],
  );
  return result.rows[0];
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
