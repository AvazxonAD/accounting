const pool = require("../../config/db")

module.exports = async ( user ) => {
    let user_id = null
    if(user.admin_status){
        user_id = user.id
    }else{
        const result = await pool.query(`SELECT user_id FROM users WHERE id = $1 AND admin_status = $2`, [user.id, false])
        if(!result.rows[0]){
            return false
        }
        user_id = result.rows[0].user_id
    }

    return user_id
}