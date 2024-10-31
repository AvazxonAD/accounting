const pool = require("../config/db");
const ErrorResponse = require("../utils/errorResponse");

const getByAllSmeta = async (smeta_name, smeta_number, father_smeta_name) => {
  try {
    const result = await pool.query(`SELECT * FROM smeta WHERE smeta_name = $1 AND smeta_number = $2 AND isdeleted = false AND father_smeta_name = $3`,
      [smeta_name, smeta_number, father_smeta_name]);
    if (result.rows[0]) {
      throw new ErrorResponse('This information has already been entered', 409)
    }
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const createSmeta = async (smeta_name, smeta_number, father_smeta_name) => {
  try {
    const smeta = await pool.query(`INSERT INTO smeta(smeta_name, smeta_number, father_smeta_name) VALUES($1, $2, $3) RETURNING *`,
      [smeta_name, smeta_number, father_smeta_name]);
    return smeta.rows[0]
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const getAllSmeta = async (offset, limit, search) => {
  try {
    const params = [offset, limit]
    let search_filter = ``
    if(search && !Number.isInteger(Number(search)) ){
      search_filter = `AND smeta_name ILIKE '%' || $${params.length + 1} || '%'`
      params.push(search)
    }
    if(Number.isInteger(Number(search))){
      search_filter = `AND smeta_number = $${params.length + 1}`
      search = Number(search)
      params.push(search)
    }
    const { rows } = await pool.query(
      `
        WITH data AS (
          SELECT id, smeta_name, smeta_number, father_smeta_name FROM smeta  
          WHERE isdeleted = false ${search_filter} OFFSET $1 LIMIT $2
        )
        SELECT 
          ARRAY_AGG(row_to_json(data)) AS data,
          (SELECT COUNT(id) FROM smeta WHERE isdeleted = false ${search_filter})::INTEGER AS total_count
        FROM data
      `,
      params);
    return {data: rows[0]?.data || [], total: rows[0]?.total_count || 0}
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const getByIdSmeta = async (id, ignoreDeleted = false) => {
  try {
    let ignore = ``
    if (!ignoreDeleted) {
      ignore = ` AND isdeleted = false`;
    }
    const result = await pool.query(`
      SELECT 
        id, 
        smeta_name, 
        smeta_number, 
        father_smeta_name 
      FROM smeta  
      WHERE id = $1 ${ignore}`, [id]);
    if (!result.rows[0]) {
      throw new ErrorResponse('smeta not found', 404)
    }
    return result.rows[0];
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const updateSmeta = async (smeta_name, smeta_number, father_smeta_name, id) => {
  try {
    const result = await pool.query(`UPDATE  smeta SET smeta_name = $1, smeta_number = $2, father_smeta_name = $3 WHERE  id = $4`,
      [smeta_name, smeta_number, father_smeta_name, id],
    );
    return result[0]
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const deleteSmeta = async (id) => {
  try {
    const tables = await pool.query(`SELECT conrelid::regclass AS name FROM  pg_constraint WHERE confrelid = 'smeta'::regclass`)
    for (let table of tables.rows) {
      const test = await pool.query(`SELECT * FROM ${table.name} WHERE smeta_id = $1 AND isdeleted = false`, [id])
      if (test.rows.length > 0) {
        throw new ErrorResponse('Cannot delete this data as it is linked to existing documents', 400)
      }
    }
    await pool.query(`UPDATE smeta SET isdeleted = $1 WHERE id = $2`, [true, id]);
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

module.exports = {
  getByAllSmeta,
  createSmeta,
  getAllSmeta,
  getAllSmeta,
  getByIdSmeta,
  updateSmeta,
  deleteSmeta
};
