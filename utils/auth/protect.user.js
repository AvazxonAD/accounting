const bcrypt = require('bcrypt');
const pool = require('../../config/db');

module.exports = async (login, password) => {
    let rol = {
        super_admin: false,
        admin: false,
        user: false
    };
    let user = null;

    let loginTest = await pool.query(`SELECT * FROM super_admins WHERE login = $1`, [login.trim()]);
    user = loginTest.rows[0];
    if (user) {
        rol.super_admin = true;
    } else {
        loginTest = await pool.query(`SELECT * FROM admins WHERE login = $1`, [login.trim()]);
        user = loginTest.rows[0];
        if (user) {
            rol.admin = true;
        } else {
            loginTest = await pool.query(`SELECT * FROM users WHERE login = $1`, [login.trim()]);
            user = loginTest.rows[0];
            if (user) {
                rol.user = true;
            } else {
                return false;
            }
        }
    }

    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
        return false;
    }

    let result = { ...user, rol };
    return result;
};
