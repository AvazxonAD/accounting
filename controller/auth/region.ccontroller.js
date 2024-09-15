const pool = require("../../config/db");
const asyncHandler = require("../../middleware/asyncHandler");
const ErrorResponse = require("../../utils/errorResponse");
const { checkNotNull, checkValueString } = require('../../utils/check.functions');

// create region 
exports.createRegion = asyncHandler(async (req, res, next) => {
    let { name } = req.body;
    
    checkNotNull(next, name);
    checkValueString(next, name)
    name = name.trim();

    const test = await pool.query(`SELECT * FROM regions WHERE name = $1`, [name]);
    if (test.rows.length > 0) {
        return next(new ErrorResponse('Ushbu viloyat avval kiritilgan', 409));
    }

    const region = await pool.query(`INSERT INTO regions(name) VALUES($1) RETURNING *`, [name]);
    if (!region.rows[0]) {
        return next(new ErrorResponse('Server xatolik. Malumot kiritilmadi', 500));
    }

    return res.status(201).json({
        success: true,
        data: "Muvafaqyatli kiritildi"
    });
});


// get all regions 
exports.getAllReegions = asyncHandler(async (req, res, next) => {
    const regions = await pool.query(`SELECT id, name FROM regions WHERE isdeleted = false ORDER BY id`)
    return res.status(200).json({
        success: true,
        data: regions.rows
    })
})

// update region 
exports.updateRegion = asyncHandler(async (req, res, next) => {
    let region = await pool.query(`SELECT * FROM regions WHERE id = $1`, [req.params.id])
    region = region.rows[0]
    if(!region){
        return next(new ErrorResponse('Server xatolik. Viloyat topilmadi', 404))
    }

    let { name } = req.body 

    checkNotNull(next, name)
    checkValueString(next, name)
    name = name.trim()

    

    if(region.name !== name){
        const test = await pool.query(`SELECT * FROM regions WHERE name = $1`, [name])
        if(test.rows[0]){
            return next(new ErrorResponse('Ushbu viloyat avval kiritilgan', 409))
        }
    }

    const updateRegion = await pool.query(`UPDATE regions SET name = $1 WHERE id = $2 RETURNING *`, [name, req.params.id])
    if(!updateRegion.rows[0]){
        return next(new ErrorResponse('Server xatolik. Malumot yangilamadi', 500))
    }

    return res.status(200).json({
        success: true,
        data: "Muvafaqyatli yangilandi"
    })
})

// delete region 
exports.deleteRegion = asyncHandler(async (req, res, next) => {
    let region = await pool.query(`SELECT * FROM regions WHERE id = $1 AND isdeleted = false`, [req.params.id])
    region = region.rows[0]
    if(!region){
        return next(new ErrorResponse('Server xatolik. Viloyat topilmadi', 404))
    }

    const deleteRegion = await pool.query(`UPDATE regions SET isdeleted = $1 WHERE id = $2 RETURNING *`, [true, req.params.id])

    if(!deleteRegion.rows[0]){
        return next(new ErrorResponse('Server xatolik. Viloyat ochirilmadi', 500))
    }

    return res.status(200).json({
        success: true, 
        data: "Muvaffaqiyatli ochirildi"
    })
})