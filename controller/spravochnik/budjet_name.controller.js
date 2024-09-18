const pool = require("../../config/db");
const asyncHandler = require("../../middleware/asyncHandler");
const ErrorResponse = require("../../utils/errorResponse");
const {checkValueString } = require('../../utils/check.functions');

// create
exports.create = asyncHandler(async (req, res, next) => {
    let { name } = req.body;

    checkValueString(name)
    name = name.trim();

    const test = await pool.query(`SELECT * FROM spravochnik_budjet_name WHERE name = $1 AND isdeleted = false`, [name]);
    if (test.rows.length > 0) {
        return next(new ErrorResponse('Ushbu malumot avval kiritilgan', 409));
    }

    const result = await pool.query(`INSERT INTO spravochnik_budjet_name(name) 
        VALUES($1) RETURNING *`, [name]);
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
    const result = await pool.query(`SELECT id, name FROM spravochnik_budjet_name WHERE isdeleted = false ORDER BY id`)
    return res.status(200).json({
        success: true,
        data: result.rows
    })
})

// update
exports.update = asyncHandler(async (req, res, next) => {
    let value = await pool.query(`SELECT * FROM spravochnik_budjet_name WHERE id = $1`, [req.params.id])
    value = value.rows[0]
    if(!value){
        return next(new ErrorResponse('Server xatolik. Malumot topilmadi', 404))
    }

    let { name } = req.body 

    checkValueString(name)
    name = name.trim()

    if(value.name !== name){
        const test = await pool.query(`SELECT * FROM spravochnik_budjet_name WHERE name = $1 AND isdeleted = false`, [name])
        if(test.rows[0]){
            return next(new ErrorResponse('Ushbu malumot avval kiritilgan', 409))
        }
    }

    const result = await pool.query(`UPDATE spravochnik_budjet_name SET name = $1 WHERE id = $2 RETURNING *`, [name, req.params.id])
    if(!result.rows[0]){
        return next(new ErrorResponse('Server xatolik. Malumot yangilanmadi', 500))
    }

    return res.status(200).json({
        success: true,
        data: "Muvafaqyatli yangilandi"
    })
})

// delete value 
exports.deleteValue = asyncHandler(async (req, res, next) => {
    let value = await pool.query(`SELECT * FROM spravochnik_budjet_name WHERE id = $1 AND isdeleted = false`, [req.params.id])
    value = value.rows[0]
    if(!value){
        return next(new ErrorResponse('Server xatolik. Malumot topilmadi', 404))
    }

    const deleteValue = await pool.query(`UPDATE spravochnik_budjet_name SET isdeleted = $1 WHERE id = $2 RETURNING *`, [true, req.params.id])

    if(!deleteValue.rows[0]){
        return next(new ErrorResponse('Server xatolik. Malumot ochirilmadi', 500))
    }

    return res.status(200).json({
        success: true, 
        data: "Muvaffaqiyatli ochirildi"
    })
})