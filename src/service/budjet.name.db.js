const pool = require('../config/db')
const asyncFunctionHandler = require('../middleware/asyncFunctionHandler')

const getByNameBudjet = asyncFunctionHandler(async (name) => {
    const result = await pool.query(`SELECT id, name FROM spravochnik_budjet_name WHERE name = $1 AND isdeleted = false`, [name]);
    return result.rows[0]
});

const createBudjet = asyncFunctionHandler(async (name) => {
    const result = await pool.query(`INSERT INTO spravochnik_budjet_name(name) VALUES($1) RETURNING *`, [name]);
    return result.rows[0]
});

const getAllBudjet = asyncFunctionHandler(async () => {
    const result = await pool.query(`SELECT id, name FROM spravochnik_budjet_name WHERE isdeleted = false ORDER BY id`);
    return result.rows
});

const getByIdBudjet = asyncFunctionHandler(async (id) => {
    let result = await pool.query(`SELECT * FROM spravochnik_budjet_name WHERE id = $1`, [id])
    return result.rows[0]
});

const updateBudjet = asyncFunctionHandler(async (name, id) => {
    const result = await pool.query(`UPDATE spravochnik_budjet_name SET name = $1 WHERE id = $2 RETURNING *`, [name, id])
    return result.rows[0]
})

const deleteBudjet = asyncFunctionHandler(async (id) => {
    const result = await pool.query(`UPDATE spravochnik_budjet_name SET isdeleted = $1 WHERE id = $2 RETURNING *`, [true, req.params.id])
    return result[0];
})

module.exports = {
    getByNameBudjet,
    createBudjet,
    getAllBudjet,
    getByIdBudjet,
    updateBudjet,
    deleteBudjet
}