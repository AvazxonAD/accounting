const pool = require('../../config/db');
const bcrypt = require('bcrypt');

module.exports = async () => {
    let admin = await pool.query(`SELECT * FROM users WHERE admin_status = $1`, [true]);
    if (admin.rows.length === 0) {
        const hashedPassword = await bcrypt.hash('123', 10);
        await pool.query(`
            INSERT INTO users (login, password, admin_status) 
            VALUES ($1, $2, $3) 
        `, ['root', hashedPassword, true]);
    }
};
