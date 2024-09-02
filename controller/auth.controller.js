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

    /*const regex = /^(?=.*[a-zA-Z])(?=.*\d)[^\s]{8,}$/;
    if(!regex.test(password)){
        return next(new ErrorResponse("password sodda bolmasligi kerak"))
    }*/

    const test = await pool.query(`SELECT * FROM users WHERE login = $1`, [login.trim()]);

    if (test.rows[0]) {
        return next(new ErrorResponse("User avval kiritilgan", 400));
    }

    const hashedPassword = await bcrypt.hash(password.trim(), 10)

    const newUser = await pool.query(`INSERT INTO users(login, password, user_id) VALUES($1, $2, $3) RETURNING *
    `, [login.trim(), hashedPassword, req.user.id]);

    return res.status(200).json({
        success: true,
        data: newUser.rows[0]
    });
});

// update admin
exports.updateAdmin = asyncHandler(async (req, res, next) => {
    let user = await pool.query(`SELECT * FROM users WHERE id = $1`, [req.user.id]);
    user = user.rows[0]
    const { login, oldPassword, newPassword } = req.body;

    if ( !login || !oldPassword || !newPassword ) {
        return next(new ErrorResponse("So'rovlar bo'sh qolishi mumkin emas", 400));
    }

    if (typeof oldPassword !== "string" || typeof newPassword !== "string" || typeof login !== "string") {
        return next(new ErrorResponse('Malumotlar tog`ri fromatda kiritilishi kerak', 400))
    }

    const matchPassword = await bcrypt.compare(oldPassword, user.password)
    if (!matchPassword) {
        return next(new ErrorResponse("Eski parol xato kiritildi", 403));
    }

    /*const regex = /^(?=.*[a-zA-Z])(?=.*\d)[^\s]{8,}$/;
    if (!regex.test(newPassword)) {
        return next(new ErrorResponse("password sodda bolmasligi kerak"))
    }*/

    const hashedPassword = await bcrypt.hash(newPassword.trim(), 10)
    
    if(login.trim() !== user.login){
        const test = await pool.query(`SELECT * FROM users WHERE login = $1`, [login.trim()])
        if(test.rows[0]){
            return next(new ErrorResponse('Login avval ishlatilgan', 400))
        }
    }

    const updateUser = await pool.query(`UPDATE users SET login = $1, password = $2 WHERE id = $3 RETURNING *
        `, [login, hashedPassword, req.user.id]);

    return res.status(200).json({
        success: true,
        data: updateUser.rows[0]
    });
});

// update user
exports.updateUser = asyncHandler(async (req, res, next) => {
    let user = await pool.query(`SELECT * FROM users WHERE id = $1`, [req.user.id]);
    user = user.rows[0]
    const {oldPassword, newPassword } = req.body;

    if ( !oldPassword || !newPassword ) {
        return next(new ErrorResponse("So'rovlar bo'sh qolishi mumkin emas", 400));
    }

    if (typeof oldPassword !== "string" || typeof newPassword !== "string") {
        return next(new ErrorResponse('Malumotlar tog`ri fromatda kiritilishi kerak', 400))
    }

    const matchPassword = await bcrypt.compare(oldPassword, user.password)
    if (!matchPassword) {
        return next(new ErrorResponse("Eski parol xato kiritildi", 403));
    }

    /*const regex = /^(?=.*[a-zA-Z])(?=.*\d)[^\s]{8,}$/;
    if (!regex.test(newPassword)) {
        return next(new ErrorResponse("password sodda bolmasligi kerak"))
    }*/

    const hashedPassword = await bcrypt.hash(newPassword.trim(), 10)
    
    const updateUser = await pool.query(`UPDATE users SET password = $1 WHERE id = $2 RETURNING *
        `, [ hashedPassword, req.user.id ]);

    return res.status(200).json({
        success: true,
        data: updateUser.rows[0]
    });
});

// update user by admin
exports.updateUserByAdmin = asyncHandler(async (req, res, next) => {
    let user = await pool.query(`SELECT * FROM users WHERE id = $1`, [req.params.id]);
    user = user.rows[0]
    if(!user){
        return next(new ErrorResponse('server xatolik', 400))
    }

    const { login, newPassword } = req.body;

    if ( !login ||  !newPassword ) {
        return next(new ErrorResponse("So'rovlar bo'sh qolishi mumkin emas", 400));
    }

    if ( typeof newPassword !== "string" || typeof login !== "string") {
        return next(new ErrorResponse('Malumotlar tog`ri fromatda kiritilishi kerak', 400))
    }


    /*const regex = /^(?=.*[a-zA-Z])(?=.*\d)[^\s]{8,}$/;
    if (!regex.test(newPassword)) {
        return next(new ErrorResponse("password sodda bolmasligi kerak"))
    }*/

    const hashedPassword = await bcrypt.hash(newPassword.trim(), 10)
    
    if(login.trim() !== user.login){
        const test = await pool.query(`SELECT * FROM users WHERE login = $1`, [login.trim()])
        if(test.rows[0]){
            return next(new ErrorResponse('Login avval ishlatilgan', 400))
        }
    }

    const updateUser = await pool.query(`UPDATE users SET login = $1, password = $2 WHERE id = $3 RETURNING *
        `, [login, hashedPassword, req.params.id]);

    return res.status(200).json({
        success: true,
        data: updateUser.rows[0]
    });
});


// get profile 
exports.getProfile = asyncHandler(async (req, res, next) => {
    let users = []
    let user = await pool.query(`SELECT * FROM users WHERE id = $1`, [req.user.id]);
    user = user.rows[0]
    
    if (user.admin_status) {
        users = await pool.query(`SELECT * FROM users WHERE user_id = $1`, [user.id])
        users = users.rows
    }
    return res.status(200).json({
        success: true,
        data: {
            user,
            users
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

// requisite create 
exports.requisitesCreate = asyncHandler(async (req, res, next) => {
    const { name, inn, budget } = req.body;

    const requisite = await pool.query(`SELECT * FROM requisites WHERE user_id = $1`, [req.user.id]);
    if (requisite.rows.length > 0) {
        return next(new ErrorResponse('Sizning rekvizitlaringiz mavjud', 400));
    }

    if (!name || !inn || !budget) {
        return next(new ErrorResponse('So\'rovlar bosh qolmasligi kerak', 400));
    }

    if (typeof name !== 'string' || !Number.isInteger(inn) || typeof budget !== 'string') {
        return next(new ErrorResponse('Malumotlar to\'g\'ri kiritilishi kerak', 400));
    }

    const result = await pool.query(`INSERT INTO requisites(name, inn, budget, user_id) 
        VALUES($1, $2, $3, $4)
        RETURNING *`, [name, inn, budget, req.user.id]);

    return res.status(200).json({
        success: true,
        data: result.rows[0]
    });
});

// get requisites 
exports.getRequisites = asyncHandler(async (req, res, next) => {
    let requisite = await pool.query(`SELECT * FROM requisites WHERE user_id = $1`, [req.user.id]);
    requisite = requisite.rows[0]

    if(!requisite){
        return next(new ErrorResponse('Hali rekvizitlar kiritilmagan', 400))
    }

    return res.status(200).json({ 
        success: true,
        data: requisite 
    })
})

// update requisite 
exports.updateRequisite = asyncHandler(async (req, res, next) => {
    const { name, inn, budget } = req.body;

    const requisite = await pool.query(`SELECT * FROM requisites WHERE id = $1`, [req.params.id])
    if(!requisite.rows[0]){
        return next(new ErrorResponse('server xatolik', 500))
    }

    if (!name || !inn || !budget) {
        return next(new ErrorResponse('So\'rovlar bosh qolmasligi kerak', 400));
    }

    if (typeof name !== 'string' || !Number.isInteger(inn) || typeof budget !== 'string') {
        return next(new ErrorResponse('Malumotlar to\'g\'ri kiritilishi kerak', 400));
    }

    const result = await pool.query(`UPDATE requisites SET name = $1, inn = $2, budget = $3
        WHERE id = $4
        RETURNING *`
    , [name, inn, budget, req.params.id]);

    console.log(result.rows[0])
    return res.status(200).json({
        success: true,
        data: result.rows[0]
    });
})

// default requisite 
exports.defaultRequisite = asyncHandler(async (req, res, next) => {
    const {shot_id , bank_id, account_number_id} = req.body
    if(!shot_id || !bank_id || !account_number_id){
        return next(new ErrorResponse('So`rovlar bosh qolmasligi kerak', 400))
    }

    const shot = await pool.query(`SELECT * FROM shots WHERE id = $1`, [shot_id])
    const bank = await pool.query(`SELECT * FROM banks WHERE id = $1`, [bank_id])
    const account_number = await pool.query(`SELECT * FROM account_numbers WHERE id = $1`, [account_number_id])
    
    if(!shot.rows[0] || !bank.rows[0] || !account_number.rows[0]){
        return next(new ErrorResponse('Server xatolik', 500))
    }

    await pool.query(`UPDATE banks SET default_value = $1 WHERE user_id = $2`, [false, req.user.id])
    await pool.query(`UPDATE banks SET default_value = $1 WHERE id = $2 AND user_id = $3`, [true, bank_id, req.user.id])

    await pool.query(`UPDATE shots SET default_value = $1 WHERE user_id = $2`, [false, req.user.id])
    await pool.query(`UPDATE shots SET default_value = $1 WHERE id = $2 AND user_id = $3`, [true, shot_id, req.user.id])

    await pool.query(`UPDATE account_numbers SET default_value = $1 WHERE user_id = $2`, [false, req.user.id])
    await pool.query(`UPDATE account_numbers SET default_value = $1 WHERE id = $2 AND user_id = $3`, [true, account_number_id, req.user.id])

    return res.status(200).json({
        success: true,
        data: "Default value has been created"
    })
})

//  get default requisite 
exports.getDefaultRequisite = asyncHandler(async (req, res, next) => {
    const user = await pool.query(`SELECT * FROM requisites WHERE user_id = $1`, [req.user.id])
    const bank = await pool.query(`SELECT * FROM banks WHERE user_id = $1 AND default_value = $2`, [req.user.id, true])
    const shot = await pool.query(`SELECT * FROM shots WHERE user_id = $1 AND default_value = $2`, [req.user.id, true])
    const account_number = await pool.query(`SELECT * FROM account_numbers WHERE user_id = $1 AND default_value = $2`, [req.user.id, true])

    res.status(200).json({
        success: true,
        data: {
            user: user.rows[0],
            bank: bank.rows[0],
            shot: shot.rows[0],
            account_number: account_number.rows[0]
        }
    })
})