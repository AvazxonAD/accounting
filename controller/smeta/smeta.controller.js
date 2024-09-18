const pool = require("../../config/db");
const asyncHandler = require("../../middleware/asyncHandler");
const ErrorResponse = require("../../utils/errorResponse");
const { checkValueString, checkValueNumber } = require('../../utils/check.functions');

// create 
exports.create = asyncHandler(async (req, res, next) => {
    if(!req.user.region_id){
        return next(new ErrorResponse('Siz uchun ruhsat etilmagan', 403))
    }

    let { smeta_name, smeta_number } = req.body;
    
    checkValueString(smeta_name)
    checkValueNumber(smeta_number)

    smeta_name = smeta_name.trim();

    const test = await pool.query(`SELECT * FROM smeta WHERE smeta_name = $1 AND smeta_number = $2 AND isdeleted = false
    `, [smeta_name, smeta_number]);
    if (test.rows.length > 0) {
        return next(new ErrorResponse('Ushbu malumot avval kiritilgan', 409));
    }

    const result = await pool.query(`INSERT INTO smeta(smeta_name, smeta_number) VALUES($1, $2) RETURNING *
    `, [smeta_name, smeta_number]);
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
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;

    if (limit <= 0 || page <= 0) {
        return next(new ErrorResponse("Limit va page musbat sonlar bo'lishi kerak", 400));
    }

    const offset = (page - 1) * limit;
    if(!req.user.region_id){
        return next(new ErrorResponse('Siz uchun ruhsat etilmagan', 403))
    }
    
    const result = await pool.query(`SELECT id, smeta_name, smeta_number FROM smeta  
        WHERE isdeleted = false ORDER BY id
        OFFSET $1 
        LIMIT $2
    `, [offset, limit])

    const totalQuery = await pool.query(`SELECT COUNT(id) AS total FROM smeta WHERE isdeleted = false`);
    const total = parseInt(totalQuery.rows[0].total);
    const pageCount = Math.ceil(total / limit);

    return res.status(200).json({
        success: true,
        pageCount: pageCount,
        count: total,
        currentPage: page, 
        nextPage: page >= pageCount ? null : page + 1,
        backPage: page === 1 ? null : page - 1,
        data: result.rows
    })
})

// update
exports.update = asyncHandler(async (req, res, next) => {
    if(!req.user.region_id){
        return next(new ErrorResponse('Siz uchun ruhsat etilmagan', 403))
    }

    let { smeta_name, smeta_number } = req.body;
    
    checkValueString(smeta_name)
    checkValueNumber(smeta_number)
    smeta_name = smeta_name.trim();

    const test = await pool.query(`SELECT * FROM smeta WHERE smeta_name = $1 AND smeta_number = $2 AND isdeleted = false
    `, [smeta_name, smeta_number]);
    if (test.rows.length > 0) {
        return next(new ErrorResponse('Ushbu malumot avval kiritilgan', 409));
    }

    const result = await pool.query(`UPDATE  smeta SET smeta_name = $1, smeta_number = $2
        WHERE  id = $3
        RETURNING *
    `, [smeta_name, smeta_number, req.params.id]);
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
    let value = await pool.query(`SELECT * FROM smeta WHERE id = $1 AND isdeleted = false
    `, [req.params.id])
    value = value.rows[0]
    if(!value){
        return next(new ErrorResponse('Server xatolik. Malumot topilmadi', 404))
    }

    const deleteValue = await pool.query(`UPDATE smeta SET isdeleted = $1 WHERE id = $2 RETURNING *`, [true, req.params.id])

    if(!deleteValue.rows[0]){
        return next(new ErrorResponse('Server xatolik. Malumot ochirilmadi', 500))
    }

    return res.status(200).json({
        success: true, 
        data: "Muvaffaqiyatli ochirildi"
    })
})
