const pool = require('../../config/db')
const ErrorResponse = require('../../utils/errorResponse')

exports.check_super_admin = async (req, res, next) => {
    let role = await pool.query(`SELECT * FROM role WHERE id = $1`, [req.user.role_id])
    role = role.rows[0]
    if(!role || role.name !== 'super_admin'){
        return next(new ErrorResponse('Siz uchun ruhsat etilmagan amal', 404))
    }
    next()
}

exports.check_admin = async (req, res, next) => {
    let region = await pool.query(`SELECT * FROM role WHERE id = $1`, [req.user.role_id])
    region = region.rows[0]
    if(!region || region.name !== "admin"){
        return next(new ErrorResponse('Siz uchun ruhsat etilmagan amal', 404))
    }
    next()
}