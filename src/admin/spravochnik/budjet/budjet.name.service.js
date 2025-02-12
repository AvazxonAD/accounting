const pool = require("../../../config/db");
const ErrorResponse = require("../../../utils/errorResponse");

const getByNameBudjetService = async (name) => {
  try {
    const result = await pool.query(
      `SELECT id, name FROM spravochnik_budjet_name WHERE name = $1 AND isdeleted = false`,
      [name],
    );
    if (result.rows[0]) {
      throw new ErrorResponse('This data has already been entered', 409)
    }
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const createBudjetService = async (name) => {
  try {
    const result = await pool.query(`INSERT INTO spravochnik_budjet_name(name) VALUES($1) RETURNING * `, [name]);
    return result.rows[0]
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const getBudjetService = async () => {
  try {
    const result = await pool.query(`SELECT id, name FROM spravochnik_budjet_name WHERE isdeleted = false ORDER BY id`);
    return result.rows;
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const getByIdBudjetService = async (id, ignoreDeleted = false) => {
  try {
    let query = ``;
    if (!ignoreDeleted) {
      query = `AND isdeleted = false`;
    }
    let result = await pool.query(`SELECT id, name FROM spravochnik_budjet_name WHERE id = $1 ${query}`, [id]);
    if(!result.rows[0]){
      throw new ErrorResponse('budjet not found', 404)
    }
    return result.rows[0];
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const updateBudjetService = async (name, id) => {
  try {
    const result = await pool.query(`UPDATE spravochnik_budjet_name SET name = $1 WHERE id = $2 RETURNING *`,[name, id]);
    return result.rows[0]
} catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const deleteBudjetService = async (id) => {
  try {
    const tables = await pool.query(`
      SELECT 
          conrelid::regclass AS name
      FROM 
          pg_constraint
      WHERE 
          confrelid = 'spravochnik_budjet_name'::regclass`)
    for (let table of tables.rows) {
      const test = await pool.query(`SELECT * FROM ${table.name} WHERE spravochnik_budjet_name_id = $1 AND isdeleted = false`, [id])
      if (test.rows.length > 0) {
        throw new ErrorResponse('Cannot delete, there are linked documents', 400)
      }
    }
    await pool.query(`UPDATE spravochnik_budjet_name SET isdeleted = $1 WHERE id = $2`,[true, id]);
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

module.exports = {
  getByNameBudjetService,
  createBudjetService,
  getBudjetService,
  getByIdBudjetService,
  updateBudjetService,
  deleteBudjetService,
};
