const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const pool = require('../config/db');
const generateToken = require('../utils/auth/generate.token');
const bcrypt = require('bcrypt')

// login 
exports.login = asyncHandler(async (req, res, next) => {
    const { login, password } = req.body;

    if (!login || !password) {
        return next(new ErrorResponse("So'rovlar bo'sh qolishi mumkin emas", 400));
    }

    if (typeof login !== "string" || typeof password !== "string") {
        return next(new ErrorResponse('Malumotlar tog`ri fromatda kiritilishi kerak', 400))
    }

    let user = await pool.query(`SELECT * FROM users WHERE login = $1`, [login.trim()]);
    user = user.rows[0]
    if (!user) {
        return next(new ErrorResponse("login yoki parol xato kiritildi", 403));
    }

    const matchPassword = await bcrypt.compare(password, user.password)
    if (!matchPassword) {
        return next(new ErrorResponse("login yoki parol xato kiritildi", 403));
    }

    const token = generateToken(user);

    return res.status(200).json({
        success: true,
        data: {
            user,
            token
        },
    });
});

// create users 
exports.createUsers = asyncHandler(async (req, res, next) => {

    const { login, password } = req.body;

    if (!login || !password) {
        return next(new ErrorResponse("So'rovlar bo'sh qolishi mumkin emas", 400));
    }

    if (typeof login !== "string" || typeof password !== "string") {
        return next(new ErrorResponse('Malumotlar tog`ri fromatda kiritilishi kerak', 400))
    }

    const testLogin = await pool.query(`SELECT * FROM users WHERE login = $1`, [login.trim()]);

    if (testLogin.rows[0]) {
        return next(new ErrorResponse("Login avval kiritilgan", 400));
    }

    const hashedPassword = await bcrypt.hash(password.trim(), 10)

    const newUser = await pool.query(`INSERT INTO users(login, password, user_id) 
        VALUES($1, $2, $3)
    `, [login.trim(), hashedPassword, req.user.id]);

    return res.status(200).json({
        success: true,
        data: "Muvaffaqiyatli kiritildi"
    });
});

// update 
exports.update = asyncHandler(async (req, res, next) => {
    let updateUser = null
    if (req.user.admin_status) {
        const { admin, user } = req.body;

        if ((admin && user) || (!admin && !user)) {
            console.log(2)
            return next(new ErrorResponse('Server error: Administrator or user required, but not both or none', 400));
        }
        if(admin){
            if (admin !== undefined && typeof admin !== "boolean") {
                return next(new ErrorResponse('Server error: Admin status must be boolean', 400));
            }
        }
        if(user){
            if (user !== undefined && typeof user !== "boolean") {
                return next(new ErrorResponse('Server error: User status must be boolean', 400));
            }
        }        

        if (user) {
            const { login, newPassword, user_id} = req.body

            
            if (!user_id) {
                return next(new ErrorResponse('Server error id is not defined', 400))
            }

            let user = await pool.query(`SELECT * FROM users WHERE id = $1`, [user_id]);
            user = user.rows[0]
            if (!user) {
                return next(new ErrorResponse('server xatolik', 400))
            }

            if (!login || !newPassword) {
                return next(new ErrorResponse("So'rovlar bo'sh qolishi mumkin emas", 400));
            }

            if (typeof newPassword !== "string" || typeof login !== "string") {
                return next(new ErrorResponse('Malumotlar tog`ri fromatda kiritilishi kerak', 400))
            }

            const hashedPassword = await bcrypt.hash(newPassword.trim(), 10)

            if (login.trim() !== user.login) {
                const test = await pool.query(`SELECT * FROM users WHERE login = $1`, [login.trim()])
                if (test.rows[0]) {
                    return next(new ErrorResponse('Login avval ishlatilgan', 400))
                }
            }

            updateUser = await pool.query(`UPDATE users SET login = $1, password = $2 WHERE id = $3 AND user_id = $4 RETURNING * 
            `, [login, hashedPassword, user_id, req.user.id]);
        } else if (admin) {
            let user = await pool.query(`SELECT * FROM users WHERE id = $1`, [req.user.id]);
            user = user.rows[0]
            const { login, oldPassword, newPassword } = req.body;

            if (!login || !oldPassword || !newPassword) {
                return next(new ErrorResponse("So'rovlar bo'sh qolishi mumkin emas", 400));
            }

            if (typeof oldPassword !== "string" || typeof newPassword !== "string" || typeof login !== "string") {
                return next(new ErrorResponse('Malumotlar tog`ri fromatda kiritilishi kerak', 400))
            }

            const matchPassword = await bcrypt.compare(oldPassword, user.password)
            if (!matchPassword) {
                return next(new ErrorResponse("Eski parol xato kiritildi", 403));
            }

            const hashedPassword = await bcrypt.hash(newPassword.trim(), 10)

            if (login.trim() !== user.login) {
                const test = await pool.query(`SELECT * FROM users WHERE login = $1`, [login.trim()])
                if (test.rows[0]) {
                    return next(new ErrorResponse('Login avval ishlatilgan', 400))
                }
            }

            updateUser = await pool.query(`UPDATE users SET login = $1, password = $2 WHERE id = $3 RETURNING * 
                `, [login, hashedPassword, req.user.id]);
        }
    } else if( !req.user.admin_status ) {
        let user = await pool.query(`SELECT * FROM users WHERE id = $1`, [req.user.id]);
        user = user.rows[0]
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return next(new ErrorResponse("So'rovlar bo'sh qolishi mumkin emas", 400));
        }

        if (typeof oldPassword !== "string" || typeof newPassword !== "string") {
            return next(new ErrorResponse('Malumotlar tog`ri fromatda kiritilishi kerak', 400))
        }

        const matchPassword = await bcrypt.compare(oldPassword, user.password)
        if (!matchPassword) {
            return next(new ErrorResponse("Eski parol xato kiritildi", 403));
        }

        const hashedPassword = await bcrypt.hash(newPassword.trim(), 10)

        updateUser = await pool.query(`UPDATE users SET password = $1 WHERE id = $2 RETRUNING * 
        `, [hashedPassword, req.user.id]);
    }

    if(!updateUser.rows[0]){
        return next(new ErrorResponse('Server xatolik', 500))
    }

    return res.status(200).json({
        success: true,
        data: "Muvaffaqiyatli yangilandi"
    });
});


// get profile 
exports.getProfile = asyncHandler(async (req, res, next) => {
    let users = []
    let user = await pool.query(`SELECT id, login, admin_status FROM users WHERE id = $1`, [req.user.id]);
    user = user.rows[0]

    if (user.admin_status) {
        users = await pool.query(`SELECT id, login FROM users WHERE user_id = $1 ORDER BY id`, [user.id])
        users = users.rows
    }
    return res.status(200).json({
        success: true,
        data: {
            user,
            users: users.length !== 0 ? users : null
        }
    });
});

// delete users 
exports.deleteUser = asyncHandler(async (req, res, next) => {
    if (!req.user.admin_status) {
        return next(new ErrorResponse("siz admin emassiz", 400))
    }
    const delteUser = await pool.query(`DELETE FROM users WHERE id = $1 AND user_id = $2 RETURNING *`, [req.params.id, req.user.id])

    if (delteUser.rows[0]) {
        return res.status(200).json({
            success: true,
            data: "DELETE true"
        })
    } else {
        return next(new ErrorResponse('DELETE false', 500))
    }
})
