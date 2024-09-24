const asyncHandler = require('../../middleware/asyncHandler');
const ErrorResponse = require('../../utils/errorResponse');
const pool = require('../../config/db');
const generateToken = require('../../utils/auth/generate.token');
const bcrypt = require('bcrypt')
const {checkValueString } = require('../../utils/check.functions');
const { getByLoginAuth } = require('../../service/auth.db');
const { getByIdMainSchet } = require('../../service/main.schet.db');


// login 
const login = asyncHandler(async (req, res, next) => {
    const { login, password, main_schet_id } = req.body;

    checkValueString(login, password)

    const user = await getByLoginAuth(login)

    if (!user) {
        return next(new ErrorResponse("login yoki parol xato kiritildi", 403));
    }

    const matchPassword = await bcrypt.compare(password, user.password)
    if (!matchPassword) {
        return next(new ErrorResponse("login yoki parol xato kiritildi", 403));
    }
    let main_schet = null

    if(main_schet_id){
        main_schet = await getByIdMainSchet(user.region_id, main_schet_id)
        if(!main_schet){
            return next(new ErrorResponse('Shot raqami raqami notog`ri kir111itildi', 400))
        }
    }

    const token = generateToken(user);
    return res.status(200).json({
        success: true,
        data: {
            user,
            main_schet,
            token
        },
    });
});

// update
const update = asyncHandler(async (req, res, next) => {
    let { fio, login, oldPassword, newPassword } = req.body;

    let user = await pool.query(`SELECT * FROM users WHERE id = $1`, [req.user.id]);
    user = user.rows[0];

    // Faqat mavjud bo'lgan maydonlarni tekshirish
    if (oldPassword || newPassword) {
        checkValueString(oldPassword, newPassword);
        
        oldPassword = oldPassword.trim();
        newPassword = newPassword.trim();
        
        const matchPassword = await bcrypt.compare(oldPassword, user.password);
        if (!matchPassword) {
            return next(new ErrorResponse("Eski parol xato kiritildi", 403));
        }
        const newHashedPassword = await bcrypt.hash(newPassword, 10);

        // Yangilash faqat yangi parolni qo‘shadi
        user.password = newHashedPassword;
    }

    if (fio) {
        fio = fio.trim();
        user.fio = fio;
    }

    if (login) {
        login = login.trim();
        if (login !== user.login) {
            const test = await pool.query(`SELECT * FROM users WHERE login = $1 AND isdeleted = false`, [login]);
            if (test.rows[0]) {
                return next(new ErrorResponse('Login avval ishlatilgan', 400));
            }
            user.login = login;
        }
    }

    // Yangilangan ma'lumotlarni saqlash
    await pool.query(`UPDATE users SET login = $1, password = $2, fio = $3 WHERE id = $4 RETURNING *`, 
        [user.login, user.password, user.fio, req.user.id]);

    return res.status(200).json({
        success: true,
        data: "Muvaffaqiyatli yangilandi"
    });
});

// get profile 
const getProfile = asyncHandler(async (req, res, next) => {
    let user = await pool.query(`SELECT users.id, role.id AS role_id, role.name AS role_name, users.fio, users.login
        FROM users 
        LEFT JOIN role ON users.role_id = role.id
        WHERE users.id = $1
    `, [req.user.id])
    user = user.rows[0]

    if(!user){
        return next(new ErrorResponse('Server xatolik. Foydalanuvchi topilmadi', 404))
    }

    return res.status(200).json({
        success: true,
        data: user
    });
});


// select budget 
const select_budget = asyncHandler(async (req, res, next) => {
    const main_schets = await pool.query(`SELECT id AS main_schet_id, account_number FROM main_schet WHERE spravochnik_budjet_name_id = $1`, [req.params.id])

    return res.status(200).json({
        success: true,
        data: main_schets.rows
    })
})

module.exports = {
    login,
    update,
    getProfile,
    select_budget
}