const pool = require("../../config/db");
const asyncHandler = require("../../middleware/asyncHandler");
const ErrorResponse = require("../../utils/errorResponse");
const { checkNotNull, checkValueString } = require('../../utils/check.functions');

// create 
exports.create = asyncHandler(async (req, res, next) => {
    if(!req.user.region_id){
        return next(new ErrorResponse('Siz uchun ruhsat etilmagan', 403))
    }

    let { name, rayon } = req.body;
    
    checkNotNull(next, name, rayon);
    checkValueString(next, name, rayon)
    name = name.trim();
    rayon = rayon.trim()

    const test = await pool.query(`SELECT * FROM spravochnik_type_operatsii WHERE name = $1 AND rayon = $2 AND user_id = $3
    `, [name, rayon, req.user.region_id]);
    if (test.rows.length > 0) {
        return next(new ErrorResponse('Ushbu malumot avval kiritilgan', 409));
    }

    const result = await pool.query(`INSERT INTO spravochnik_type_operatsii(name, rayon, user_id) VALUES($1, $2, $3) RETURNING *
    `, [name, rayon, req.user.region_id]);
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
    
    const result = await pool.query(`SELECT id, name, rayon FROM spravochnik_type_operatsii  
        WHERE isdeleted = false AND user_id = $1 ORDER BY id
    `, [req.user.region_id])
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

    let { name, rayon } = req.body;
    
    checkNotNull(next, name, rayon);
    checkValueString(next, name, rayon)
    name = name.trim();
    rayon = rayon.trim()

    const test = await pool.query(`SELECT * FROM spravochnik_type_operatsii WHERE name = $1 AND rayon = $2 AND user_id = $3
    `, [name, rayon, req.user.region_id]);
    if (test.rows.length > 0) {
        return next(new ErrorResponse('Ushbu malumot avval kiritilgan', 409));
    }

    const result = await pool.query(`UPDATE  spravochnik_type_operatsii SET name = $1, rayon = $2
        WHERE user_id = $3 AND id = $4
        RETURNING *
    `, [name, rayon, req.user.region_id, req.params.id]);
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
    let value = await pool.query(`SELECT * FROM spravochnik_type_operatsii WHERE id = $1 AND isdeleted = false AND user_id = $2
    `, [req.params.id, req.user.region_id])
    value = value.rows[0]
    if(!value){
        return next(new ErrorResponse('Server xatolik. Malumot topilmadi', 404))
    }

    const deleteValue = await pool.query(`UPDATE spravochnik_type_operatsii SET isdeleted = $1 WHERE id = $2 RETURNING *`, [true, req.params.id])

    if(!deleteValue.rows[0]){
        return next(new ErrorResponse('Server xatolik. Malumot ochirilmadi', 500))
    }

    return res.status(200).json({
        success: true, 
        data: "Muvaffaqiyatli ochirildi"
    })
})