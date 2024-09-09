const pool = require('../../config/db')

const return_requisite_id = async function (right, left, id, user_id) {
    const count = await pool.query(`SELECT count(id) `)
    if(right){
        const id = await pool.query(`SELECT * FROM requisites WHERE id = $1 AND user_id = $2`, [id + 1, user_id])
        if(id.rows[0]){
            return id.rows[0]
        }else{
            return_requisite_id()
        }
    }
    if(left){
        const id = await pool.query(`SELECT * FROM requisites WHERE id = $1 AND user_id = $2`, [id - 1, user_id])
        if(id.rows[0]){
            return id.rows[0]
        }else{
            return_requisite_id()
        }
    }
}