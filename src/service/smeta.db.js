const pool = require('../config/db')
const asyncFunctionHandler = require('../middleware/asyncFunctionHandler')

const getByAllSmeta = asyncFunctionHandler(async (smeta_name, smeta_number, father_smeta_name) => {
    const result = await pool.query(`SELECT * FROM smeta WHERE smeta_name = $1 AND smeta_number = $2 AND isdeleted = false AND father_smeta_name = $3
    `, [smeta_name, smeta_number, father_smeta_name]);
    return result.rows[0]
});


const createSmeta = asyncFunctionHandler(async (smeta_name, smeta_number, father_smeta_name) => {
    const result = await pool.query(`INSERT INTO smeta(smeta_name, smeta_number, father_smeta_name) VALUES($1, $2, $3) RETURNING *
    `, [smeta_name, smeta_number, father_smeta_name]);
    return result.rows[0]
});

const getAllSmeta = asyncFunctionHandler(async (offset, limit) => {
    const result = await pool.query(`SELECT id, smeta_name, smeta_number, father_smeta_name FROM smeta  
        WHERE isdeleted = false ORDER BY id
        OFFSET $1 
        LIMIT $2
    `, [offset, limit])
    return result.rows
});

const getTotalSmeta = asyncFunctionHandler(async () => {
    const result = await pool.query(`SELECT COUNT(id) AS total FROM smeta WHERE isdeleted = false`);
    return result.rows[0]
})

const getByIdSmeta = asyncFunctionHandler(async (id) => {
    const result = await pool.query(`SELECT id, smeta_name, smeta_number, father_smeta_name FROM smeta  
        WHERE isdeleted = false AND id = $1
    `, [id])
    return result.rows[0]
})

const updateSmeta = asyncFunctionHandler(async (smeta_name, smeta_number, father_smeta_name, id) => {
    const result = await pool.query(`UPDATE  smeta SET smeta_name = $1, smeta_number = $2, father_smeta_name = $3
        WHERE  id = $4
        RETURNING *
    `, [smeta_name, smeta_number, father_smeta_name, id]);
    return result.rows[0]
})

const deleteSmeta = asyncFunctionHandler(async (id) => {
    const deleteValue = await pool.query(`UPDATE smeta SET isdeleted = $1 WHERE id = $2 RETURNING *`, [true, id])
    return deleteValue.rows[0]
})

module.exports = {
    getByAllSmeta,
    createSmeta,
    getAllSmeta,
    getAllSmeta,
    getTotalSmeta,
    getByIdSmeta,
    updateSmeta,
    deleteSmeta
}