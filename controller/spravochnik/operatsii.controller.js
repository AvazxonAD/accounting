const pool = require("../../config/db");
const asyncHandler = require("../../middleware/asyncHandler");
const ErrorResponse = require("../../utils/errorResponse");
const { checkNotNull, checkValueString } = require('../../utils/check.functions');

// create 
exports.create = asyncHandler(async (req, res, next) => {
    if(!req.user.region_id){
        return next(new ErrorResponse('Siz uchun ruhsat etilmagan', 403))
    }

    let { name, schet, sub_schet, type_schet } = req.body;
    
    checkNotNull(next, name,  schet, sub_schet, type_schet);
    checkValueString(next, name,  schet, sub_schet, type_schet)
    name = name.trim();
    
    if(type_schet !== 'kassa_prixod' && type_schet !== 'kassa_rasxod' && type_schet !== 'bank_prixod' && type_schet !== 'bank_rasxod'){
        return next(new ErrorResponse(`type_schet notog'ri jonatildi shablonlar: kassa_prixod, kassa_rasxod, bank_prixod, bank_rasxod`, 400))
    }

    const test = await pool.query(`SELECT * FROM spravochnik_operatsii WHERE name = $1 AND type_schet = $2
    `, [name, type_schet]);
    if (test.rows.length > 0) {
        return next(new ErrorResponse('Ushbu malumot avval kiritilgan', 409));
    }

    const result = await pool.query(`INSERT INTO spravochnik_operatsii(
        name,  schet, sub_schet, type_schet
        ) VALUES($1, $2, $3, $4) 
        RETURNING *
    `, [name,  schet, sub_schet, type_schet]);
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
    const query = req.query.type_schet
    if(!query){
        return next(new ErrorResponse('Type_schet topilmadi', 400))
    }

    if(!req.user.region_id){
        return next(new ErrorResponse('Siz uchun ruhsat etilmagan', 403))
    }
    
    const result = await pool.query(`SELECT id, name, schet, sub_schet 
        FROM spravochnik_operatsii  
        WHERE isdeleted = false AND type_schet = $1 ORDER BY id
    `, [query])
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

    let { name, schet, sub_schet, type_schet } = req.body;
    
    checkNotNull(next, name,  schet, sub_schet, type_schet);
    checkValueString(next, name,  schet, sub_schet, type_schet)
    name = name.trim();
    
    if(type_schet !== 'kassa_prixod' && type_schet !== 'kassa_rasxod' && type_schet !== 'bank_prixod' && type_schet !== 'bank_rasxod'){
        return next(new ErrorResponse(`type_schet notog'ri jonatildi shablonlar: kassa_prixod, kassa_rasxod, bank_prixod, bank_rasxod`, 400))
    }

    const test = await pool.query(`SELECT * FROM spravochnik_operatsii WHERE name = $1 AND type_schet = $2
    `, [name, type_schet]);
    if (test.rows.length > 0) {
        return next(new ErrorResponse('Ushbu malumot avval kiritilgan', 409));
    }

    const result = await pool.query(`UPDATE spravochnik_operatsii 
        SET name = $1, schet = $2, sub_schet = $3, type_schet = $4
        WHERE id = $5
        RETURNING *
    `, [name, schet, sub_schet, type_schet,req.params.id]);
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
    let value = await pool.query(`SELECT * FROM spravochnik_operatsii WHERE id = $1 AND isdeleted = false
    `, [req.params.id])
    value = value.rows[0]
    if(!value){
        return next(new ErrorResponse('Server xatolik. Malumot topilmadi', 404))
    }

    const deleteValue = await pool.query(`UPDATE spravochnik_operatsii SET isdeleted = $1 WHERE id = $2 RETURNING *`, [true, req.params.id])

    if(!deleteValue.rows[0]){
        return next(new ErrorResponse('Server xatolik. Malumot ochirilmadi', 500))
    }

    return res.status(200).json({
        success: true, 
        data: "Muvaffaqiyatli ochirildi"
    })
})