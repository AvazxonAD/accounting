const pool = require("../../config/db");
const { handleServiceError } = require("../../middleware/service.handle");
const ErrorResponse = require("../../utils/errorResponse");

const getByAllSmeta = handleServiceError(
  async (smeta_name, smeta_number, father_smeta_name) => {
    const result = await pool.query(
      `SELECT * FROM smeta WHERE smeta_name = $1 AND smeta_number = $2 AND isdeleted = false AND father_smeta_name = $3
    `,
      [smeta_name, smeta_number, father_smeta_name],
    );
    return result.rows[0];
  },
);

const createSmeta = handleServiceError(
  async (smeta_name, smeta_number, father_smeta_name) => {
    await pool.query(
      `INSERT INTO smeta(smeta_name, smeta_number, father_smeta_name) VALUES($1, $2, $3) 
    `,
      [smeta_name, smeta_number, father_smeta_name],
    );
  },
);

const getAllSmeta = handleServiceError(async (offset, limit) => {
  const result = await pool.query(
    `SELECT id, smeta_name, smeta_number, father_smeta_name FROM smeta  
        WHERE isdeleted = false ORDER BY id
        OFFSET $1 
        LIMIT $2
    `,
    [offset, limit],
  );
  return result.rows;
});

const getTotalSmeta = handleServiceError(async () => {
  const result = await pool.query(
    `SELECT COUNT(id) AS total FROM smeta WHERE isdeleted = false`,
  );
  return result.rows[0];
});

const getByIdSmeta = async (id, ignoreDeleted = false) => {
  try {
    let query = `
      SELECT 
          id, 
          smeta_name, 
          smeta_number, 
          father_smeta_name 
      FROM smeta  
      WHERE id = $1
    `;
  
    if (!ignoreDeleted) {
      query += ` AND isdeleted = false`;
    }
  
    const result = await pool.query(query, [id]);
    return result.rows[0];
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}


const updateSmeta = handleServiceError(
  async (smeta_name, smeta_number, father_smeta_name, id) => {
    await pool.query(
      `UPDATE  smeta SET smeta_name = $1, smeta_number = $2, father_smeta_name = $3
        WHERE  id = $4
    `,
      [smeta_name, smeta_number, father_smeta_name, id],
    );
  },
);

const deleteSmeta = handleServiceError(async (id) => {
  await pool.query(`UPDATE smeta SET isdeleted = $1 WHERE id = $2`, [true, id]);
});

module.exports = {
  getByAllSmeta,
  createSmeta,
  getAllSmeta,
  getAllSmeta,
  getTotalSmeta,
  getByIdSmeta,
  updateSmeta,
  deleteSmeta,
};
