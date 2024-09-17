const asyncHandler = require('../../middleware/asyncHandler');
const ErrorResponse = require('../../utils/errorResponse');
const pool = require('../../config/db');
const generateToken = require('../../utils/auth/generate.token');
const bcrypt = require('bcrypt')
const { checkNotNull, checkValueString, checkValueNumber } = require('../../utils/check.functions')


// login 
exports.login = asyncHandler(async (req, res, next) => {
    const { login, password, main_schet_id } = req.body;

    checkNotNull(login, password)
    checkValueString(login, password)

    let user = await pool.query(`
        SELECT users.id, users.fio, users.password, users.login, users.region_id, users.role_id, role.name AS role_name 
        FROM users 
        INNER JOIN role ON role.id = users.role_id 
        WHERE login = $1 AND (users.isdeleted IS NULL OR users.isdeleted = false)
    `, [login.trim()]);
    user = user.rows[0]

    if (!user) {
        return next(new ErrorResponse("login yoki parol xato kiritildi", 403));
    }

    const matchPassword = await bcrypt.compare(password, user.password)
    if (!matchPassword) {
        return next(new ErrorResponse("login yoki parol xato kiritildi", 403));
    }
    let main_schet = null

    if(main_schet_id){
        main_schet = await pool.query(`
            SELECT 
                main_schet.id, 
                main_schet.account_number, 
                main_schet.spravochnik_budjet_name_id, 
                main_schet.tashkilot_nomi, 
                main_schet.tashkilot_bank, 
                main_schet.tashkilot_mfo, 
                main_schet.tashkilot_inn, 
                main_schet.account_name, 
                main_schet.jur1_schet, 
                main_schet.jur1_subschet,
                main_schet.jur2_schet, 
                main_schet.jur2_subschet,
                main_schet.jur3_schet,
                main_schet.jur3_subschet, 
                main_schet.jur4_schet,
                main_schet.jur4_subschet, 
                spravochnik_budjet_name.name AS budjet_name
            FROM main_schet
            JOIN spravochnik_budjet_name 
                ON spravochnik_budjet_name.id = main_schet.spravochnik_budjet_name_id
            WHERE main_schet.isdeleted = false 
                AND main_schet.id = $1
                AND main_schet.user_id = $2 
            ORDER BY main_schet.id
        `, [main_schet_id, user.region_id]);
        main_schet = main_schet.rows[0]
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
exports.update = asyncHandler(async (req, res, next) => {
    let { fio, login, oldPassword, newPassword } = req.body;

    let user = await pool.query(`SELECT * FROM users WHERE id = $1`, [req.user.id]);
    user = user.rows[0];

    // Faqat mavjud bo'lgan maydonlarni tekshirish
    if (oldPassword || newPassword) {
        checkNotNull(oldPassword, newPassword);
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
exports.getProfile = asyncHandler(async (req, res, next) => {
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
exports.select_budget = asyncHandler(async (req, res, next) => {
    const { budget_id } = req.body

    checkNotNull(budget_id)
    checkValueNumber(budget_id)

    const main_schets = await pool.query(`SELECT id AS main_schet_id, account_number FROM main_schet WHERE spravochnik_budjet_name_id = $1`, [budget_id])

    return res.status(200).json({
        success: true,
        data: main_schets.rows
    })
})