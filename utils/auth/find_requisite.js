const pool = require('../../config/db')

const return_requisite_id = async function (right, left, id, user_id) {
    let test = await pool.query(`SELECT * FROM requisites WHERE user_id = $1 AND id = $2`, [user_id, id])
    test = test.rows[0]
    if(!test){
        return false 
    }

    if(right){
        const requisites = await pool.query(`SELECT * FROM requisites WHERE user_id = $1 ORDER BY id`, [user_id])
        
        const index = requisites.rows.findIndex(item => item.id === test.id)
        
        if (index === -1) {
            return false 
        }

        const result_index = index + 1

        if(result_index < requisites.rows.length){
            return requisites.rows[result_index]
        } else {
            return false
        }
    } else if(left){
        const requisites = await pool.query(`SELECT * FROM requisites WHERE user_id = $1 ORDER BY id`, [user_id])
        
        const index = requisites.rows.findIndex(item => item.id === test.id)
        
        if (index === -1) {
            return false 
        }

        const result_index = index - 1

        if(result_index < requisites.rows.length){
            return requisites.rows[result_index]
        } else {
            return false
        }
    }
}

module.exports = return_requisite_id
