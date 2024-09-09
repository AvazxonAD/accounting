const pool = require('../../config/db');
const bcrypt = require('bcrypt');

module.exports = async () => {
    let admin = await pool.query(`SELECT * FROM users WHERE super_admin = $1`, [true]);
    if (admin.rows.length === 0) {
        const hashedPassword = await bcrypt.hash('123', 10);
        await pool.query(`
            INSERT INTO users (login, password, super_admin) 
            VALUES ($1, $2, $3) 
        `, ['root', hashedPassword, true]);
    }
};
