const pool = require("../../config/db");
const asyncHandler = require("../../middleware/asyncHandler");
const ErrorResponse = require("../../utils/errorResponse");
const { checkNotNull, checkValueString } = require('../../utils/check.functions');

// create 
exports.create = asyncHandler(async (req, res, next) => {
    if(!req.user.region_id){
        return next(new ErrorResponse('Siz uchun ruhsat etilmagan', 403))
    }

    let { account_number } = req.body;
    
    checkNotNull(next, account_number);
    checkValueString(next, account_number)

    const test = await pool.query(`SELECT * FROM main_schet WHERE account_number = $1 AND user_id = $2
    `, [account_number, req.user.region_id]);
    if (test.rows.length > 0) {
        return next(new ErrorResponse('Ushbu malumot avval kiritilgan', 409));
    }

    const result = await pool.query(`INSERT INTO main_schet(account_number, user_id) VALUES($1, $2) RETURNING *
    `, [account_number, req.user.region_id]);
    if (!result.rows[0]) {
        return next(new ErrorResponse('Server xatolik. Malumot kiritilmadi', 500));
    }

    return res.status(201).json({
        success: true,
        data: "Muvafaqyatli kiritildi"
    });
});

// get all
exports.getAll = asyncHandler(async (req, res, next) => {
    if(!req.user.region_id){
        return next(new ErrorResponse('Siz uchun ruhsat etilmagan', 403))
    }
    
    const result = await pool.query(`SELECT id, account_number
        FROM main_schet
        WHERE isdeleted = false AND user_id = $1 ORDER BY id
    `, [req.user.region_id])
    return res.status(200).json({
        success: true,
        data: result.rows
    })
})

exports.getAlLForLogin = asyncHandler(async (req, res, next) => {
    const result = await pool.query(`SELECT id, account_number
        FROM main_schet
        WHERE isdeleted = false`)

    return res.status(200).json({
        success: true,
        data: result.rows
    })
})

// update
exports.update = asyncHandler(async (req, res, next) => {
    if(!req.user.region_id){
        return next(new ErrorResponse('Siz uchun ruhsat etilmagan', 403))
    }

    let { account_number } = req.body;
    
    checkNotNull(next, account_number);
    checkValueString(next, account_number)

    const test = await pool.query(`SELECT * FROM main_schet WHERE account_number = $1 AND user_id = $2
    `, [account_number, req.user.region_id]);
    if (test.rows.length > 0) {
        return next(new ErrorResponse('Ushbu malumot avval kiritilgan', 409));
    }

    const result = await pool.query(`UPDATE  main_schet SET account_number = $1
        WHERE user_id = $2 AND id = $3
        RETURNING *
    `, [account_number, req.user.region_id, req.params.id]);
    if (!result.rows[0]) {
        return next(new ErrorResponse('Server xatolik. Malumot Yangilanmadi', 500));
    }

    return res.status(201).json({
        success: true,
        data: "Muvafaqyatli yangilandi"
    });
})

// delete value
exports.deleteValue = asyncHandler(async (req, res, next) => {
    let value = await pool.query(`SELECT * FROM main_schet WHERE id = $1 AND isdeleted = false AND user_id = $2
    `, [req.params.id, req.user.region_id])
    value = value.rows[0]
    if(!value){
        return next(new ErrorResponse('Server xatolik. Malumot topilmadi', 404))
    }

    const deleteValue = await pool.query(`UPDATE main_schet SET isdeleted = $1 WHERE id = $2 RETURNING *`, [true, req.params.id])

    if(!deleteValue.rows[0]){
        return next(new ErrorResponse('Server xatolik. Malumot ochirilmadi', 500))
    }

    return res.status(200).json({
        success: true, 
        data: "Muvaffaqiyatli ochirildi"
    })
})