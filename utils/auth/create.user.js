const pool = require('../../config/db');
const bcrypt = require('bcrypt');

module.exports = async () => {
    let super_admin = await pool.query(`SELECT * FROM role WHERE name = $1`, ['super_admin'])
    super_admin = super_admin.rows[0]
    if(!super_admin){
        super_admin = await pool.query(`INSERT INTO role(name) VALUES($1) RETURNING * `, ['super_admin'])
        super_admin.rows[0]
    }
    let user = await pool.query(`SELECT * FROM users WHERE region_id IS NULL`)
    user = user.rows[0]
    if(!user){
        await pool.query(`INSERT INTO users(login, password, fio, role_id) VALUES($1, $2, $3, $4)
        `, ['root', await bcrypt.hash('123', 10), 'Asqarov Muhammadjon', super_admin.id])
    }
    return;
};
