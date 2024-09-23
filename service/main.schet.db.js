const pool = require('../config/db')
const asyncFunctionHandler = require('../middleware/asyncFunctionHandler')

const getByIdMainSchet = asyncFunctionHandler(async (user_id, id) => {
    const main_schet = await pool.query(`SELECT * FROM `)
});