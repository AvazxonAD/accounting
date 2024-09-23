const pool = require('../config/db')
const asyncFunctionHandler = require('../middleware/asyncFunctionHandler')

const createGrafik = asyncFunctionHandler(async (user_id, shartnoma_id) => {
    const result = await pool.query(`
        INSERT INTO shartnoma_grafik(id_shartnomalar_organization, user_id) VALUES($1, $2) RETURNING *  
    `,[shartnoma_id, user_id]);
    return result.rows[0]
})


module.exports = {
    createGrafik
}