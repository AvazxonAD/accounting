const pool = require("../../config/db");
const asyncHandler = require("../../middleware/asyncHandler");
const ErrorResponse = require("../../utils/errorResponse");
const {checkValueString, checkValueNumber } = require('../../utils/check.functions');
const bcrypt = require('bcrypt')

// create user
exports.createUser = asyncHandler(async (req, res, next) => {

    let { login, password, fio, region_id, role_id } = req.body;
    
    let user = await pool.query(`SELECT users.id, users.region_id, users.role_id, role.name AS role_name 
        FROM users 
        JOIN role ON role.id = users.role_id
        WHERE users.id = $1`, [req.user.id])
    user = user.rows[0]

    if(region_id){
        if(user.role_name !== 'super_admin'){
            return next(new ErrorResponse('Siz uchun ruhsat etilmagan', 403))
        }
    }else if (user.role_name !== 'region_admin') {
        return next(new ErrorResponse('Siz uchun ruhsat etilmagan', 403))
    
    }

    checkValueString(login, password, fio)
    checkValueNumber(role_id)

    const role = await pool.query(`SELECT * FROM role WHERE id = $1`, [role_id])
    if (!role.rows[0]) {
        return next(new ErrorResponse('Server xatolik. Role topilmadi', 404))
    }

    if (region_id) {
        checkValueNumber(region_id)
        const region = await pool.query(`SELECT * FROM regions WHERE id = $1`, [region_id])
        if (!region.rows[0]) {
            return next(new ErrorResponse('Server xatolik. Viloyat topilmadi', 404))
        }
    }else{
        region_id = user.region_id
    }

    login = login.trim()
    password = password.trim()
    fio = fio.trim()
    const hashedPassword = await bcrypt.hash(password, 10)

    const test = await pool.query(`SELECT * FROM users WHERE login = $1 AND isdeleted = false`, [login]);
    if (test.rows.length > 0) {
        return next(new ErrorResponse('Ushbu login avval kiritilgan', 409));
    }

    const newUser = await pool.query(`INSERT INTO users(login, password, fio, role_id, region_id) 
        VALUES($1, $2, $3, $4, $5) RETURNING *
    `, [login, hashedPassword, fio, role_id, region_id]);
    if (!newUser.rows[0]) {
        return next(new ErrorResponse('Server xatolik. Malumot kiritilmadi', 500));
    }

    return res.status(201).json({
        success: true,
        data: "Muvafaqyatli kiritildi"
    });
});


// get all users
exports.getAllUsers = asyncHandler(async (req, res, next) => {
    let user = await pool.query(`SELECT users.id, users.region_id, users.role_id, role.name AS role_name 
        FROM users 
        JOIN role ON role.id = users.role_id
        WHERE users.id = $1`, [req.user.id])
    user = user.rows[0]

    if(user.role_name !== 'super_admin' && user.role_name !== "region_admin"){
        return next(new ErrorResponse('Siz uchun ruhsat etilmagan', 403))
    }

    let users = null
    const query = `SELECT 
            users.id, 
            users.role_id, 
            users.region_id, 
            users.fio,
            users.login,
            role.name AS role_name,
            regions.name AS region_name
            FROM users 
            JOIN role ON role.id = users.role_id
            JOIN regions ON regions.id = users.region_id
            WHERE region_id = $1 AND users.isdeleted = false
        `
    if(!user.region_id ){
        if(req.params.id === 'null'){
            return next(new ErrorResponse('Id jonatilmadi', 404))
        }

        users = await pool.query(query, [req.params.id])
    }else {
        users = await pool.query(query, [user.region_id])
    }

    return res.status(200).json({
        success: true,
        data: users.rows
    })
})

// update user 
exports.updateUser = asyncHandler(async (req, res, next) => {
    let { login, password, fio, region_id, role_id } = req.body;
    
    let user = await pool.query(`SELECT users.id, users.region_id, users.role_id, role.name AS role_name 
        FROM users 
        JOIN role ON role.id = users.role_id
        WHERE users.id = $1`, [req.user.id])
    user = user.rows[0]

    if(region_id){
        if(user.role_name !== 'super_admin'){  
            return next(new ErrorResponse('Siz uchun ruhsat etilmagan', 403))
        }
    }else if (user.role_name !== 'region_admin') {
        return next(new ErrorResponse('Siz uchun ruhsat etilmagan', 403))
    
    }

    let oldUser = await pool.query(`SELECT * FROM users WHERE id = $1`, [req.params.id])
    oldUser = oldUser.rows[0]
    if(!oldUser){
        return next(new ErrorResponse('Server xatolik. User topilmadi', 404))
    }

    checkValueString(login, password, fio)
    checkValueNumber(role_id)

    const role = await pool.query(`SELECT * FROM role WHERE id = $1`, [role_id])
    if (!role.rows[0]) {
        return next(new ErrorResponse('Server xatolik. Role topilmadi', 404))
    }

    if (region_id) {
        checkValueNumber(region_id)
        const region = await pool.query(`SELECT * FROM regions WHERE id = $1`, [region_id])
        if (!region.rows[0]) {
            return next(new ErrorResponse('Server xatolik. Viloyat topilmadi', 404))
        }
    }else{
        region_id = user.region_id
    }

    login = login.trim()
    password = password.trim()
    fio = fio.trim()
    const hashedPassword = await bcrypt.hash(password, 10)

    if(oldUser.login !== login){
        const test = await pool.query(`SELECT * FROM users WHERE login = $1 AND isdeleted = false`, [login]);
        if (test.rows.length > 0) {
            return next(new ErrorResponse('Ushbu login avval kiritilgan', 409));
        }
    } 

    const updateUser = await pool.query(`UPDATE users SET login = $1, password = $2, fio = $3, role_id =$4, region_id = $5
        WHERE id = $6
        RETURNING *
    `, [login, hashedPassword, fio, role_id, region_id, req.params.id]);
    if (!updateUser.rows[0]) {
        return next(new ErrorResponse('Server xatolik. Malumot yangilanmadi', 500));
    }

    return res.status(201).json({
        success: true,
        data: "Muvafaqyatli yangilandi"
    });
})

// delete user
exports.deleteUser = asyncHandler(async (req, res, next) => {
    let user = await pool.query(`SELECT users.id, users.region_id, users.role_id, role.name AS role_name 
        FROM users 
        JOIN role ON role.id = users.role_id
        WHERE users.id = $1`, [req.user.id])
    user = user.rows[0]

    if(user.role_name !== 'super_admin' && user.role_name !== "region_admin"){
        return next(new ErrorResponse('Siz uchun ruhsat etilmagan', 403))
    }

    let deleteUser = null
    if(!user.region_id){
        deleteUser = await pool.query(`SELECT * FROM users WHERE id = $1 AND isdeleted = false`, [req.params.id])
        deleteUser = deleteUser.rows[0]
    }else{
        deleteUser = await pool.query(`SELECT * FROM users WHERE id = $1 AND isdeleted = false AND region_id = $2`, [req.params.id, user.region_id])
        deleteUser = deleteUser.rows[0]
    }

    if (!deleteUser) {
        return next(new ErrorResponse('Server xatolik. User topilmadi', 404))
    }

    const deleteRegion = await pool.query(`UPDATE users SET isdeleted = $1 WHERE id = $2 RETURNING *`, [true, req.params.id])

    if (!deleteRegion.rows[0]) {
        return next(new ErrorResponse('Server xatolik. User ochirilmadi', 500))
    }

    return res.status(200).json({
        success: true,
        data: "Muvaffaqiyatli ochirildi"
    })
})