const pool = require('../config/db')
const asyncFunctionHandler = require('../middleware/asyncFunctionHandler')

const getByLoginAuth = asyncFunctionHandler(async ( login ) => {
    const result = await pool.query(`
        SELECT users.id, users.fio, users.password, users.login, users.region_id, users.role_id, role.name AS role_name 
        FROM users 
        INNER JOIN role ON role.id = users.role_id 
        WHERE login = $1 AND (users.isdeleted IS NULL OR users.isdeleted = false)
    `, [login.trim()]);
    return result.rows[0]
});

module.exports = {
    getByLoginAuth
}