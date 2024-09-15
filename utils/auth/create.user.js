const pool = require('../../config/db');
const bcrypt = require('bcrypt');

module.exports = async () => {
    let super_admin = await pool.query(`SELECT * FROM role WHERE name = $1`, ['super_admin']);
    super_admin = super_admin.rows[0];
    let user = await pool.query(`SELECT * FROM users WHERE region_id IS NULL`);
    user = user.rows[0];

    if(!super_admin || !user){
        if (!super_admin) {
            const result = await pool.query(
                `INSERT INTO role(name) VALUES($1) RETURNING *`, 
                ['super_admin']
            );
            super_admin = result.rows[0];
        }
    
        if (!user) {
            await pool.query(
                `INSERT INTO users(login, password, fio, role_id) VALUES($1, $2, $3, $4)`,
                ['root', await bcrypt.hash('123', 10), 'Asqarov Muhammadjon', super_admin.id]
            );
        }


    }

    let admin = await pool.query(`SELECT * FROM role WHERE name = $1`, ['region_admin']);
    admin = admin.rows[0];
    let region_user = await pool.query(`SELECT * FROM users WHERE region_id IS NOT NULL`);
    region_user = region_user.rows[0];

    if(!admin || !region_user){
        if (!admin) {
            const result = await pool.query(
                `INSERT INTO role(name) VALUES($1) RETURNING *`, 
                ['region_admin']
            );
            super_admin = result.rows[0];
        }
    
        if (!region_user) {
            await pool.query(
                `INSERT INTO users(login, password, fio, role_id) VALUES($1, $2, $3, $4)`,
                ['admin', await bcrypt.hash('123', 10), 'Asqarov Doniyorjon', admin.id]
            );
        }
    }
    
    return;
};
