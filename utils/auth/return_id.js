const pool = require("../../config/db")

module.exports = async ( user ) => {
    let id = null
    if(user.admin || user.super_admin){
        id = user.id
    }else{
        const result = await pool.query(`SELECT id FROM users WHERE id = $1 AND (admin = true or super_admin = true)`, [user.user_id])
        if(!result.rows[0]){
            return false
        }
        id = result.rows[0].id
    }

    return id
}