const pool = require("../../config/db");
const { handleServiceError } = require("../../middleware/service.handle");

const createOperatsii = handleServiceError(async (object) => {
  await pool.query(
    `INSERT INTO spravochnik_operatsii(
        name,  schet, sub_schet, type_schet, smeta_id
        ) VALUES($1, $2, $3, $4, $5) 
    `,
    [
      object.name,
      object.schet,
      object.sub_schet,
      object.type_schet,
      object.smeta_id,
    ],
  );
});

const getByNameAndSchetOperatsii = handleServiceError(
  async (name, type_schet, smeta_id) => {
    const result = await pool.query(
      `SELECT * FROM spravochnik_operatsii WHERE name = $1 AND type_schet = $2 AND isdeleted = false AND smeta_id = $3`,
      [name, type_schet, smeta_id],
    );
    return result.rows[0];
  },
);

const getAllOperatsii = handleServiceError(async (query, offset, limit) => {
  const result = await pool.query(
    `SELECT id, name, schet, sub_schet, type_schet, smeta_id
        FROM spravochnik_operatsii  
        WHERE isdeleted = false AND type_schet = $1 ORDER BY id
        OFFSET $2
        LIMIT $3
    `,
    [query, offset, limit],
  );
  return result.rows;
});

const totalOperatsii = handleServiceError(async (query) => {
  const result = await pool.query(
    `SELECT COUNT(id) AS total FROM spravochnik_operatsii WHERE isdeleted = false AND type_schet = $1`,
    [query],
  );
  return result.rows[0];
});

const getByIdOperatsii = handleServiceError(async (id) => {
  let result = await pool.query(
    `SELECT id, name, schet, sub_schet, type_schet, smeta_id FROM spravochnik_operatsii WHERE id = $1 AND isdeleted = false
    `,
    [id],
  );
  return result.rows[0];
});

const updateOperatsii = handleServiceError(async (object) => {
  await pool.query(
    `UPDATE spravochnik_operatsii 
        SET name = $1, schet = $2, sub_schet = $3, type_schet = $4, smeta_id = $5
        WHERE id = $6
    `,
    [
      object.name,
      object.schet,
      object.sub_schet,
      object.type_schet,
      object.smeta_id,
      object.id,
    ],
  );
});

const deleteOperatsii = handleServiceError(async (id) => {
  await pool.query(
    `UPDATE spravochnik_operatsii SET isdeleted = $1 WHERE id = $2`,
    [true, id],
  );
});

module.exports = {
  getByNameAndSchetOperatsii,
  createOperatsii,
  getAllOperatsii,
  totalOperatsii,
  getByIdOperatsii,
  updateOperatsii,
  deleteOperatsii,
};
