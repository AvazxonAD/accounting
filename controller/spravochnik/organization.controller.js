const pool = require("../../config/db");
const asyncHandler = require("../../middleware/asyncHandler");
const ErrorResponse = require("../../utils/errorResponse");
const { checkNotNull, checkValueString } = require('../../utils/check.functions');

// create 
exports.create = asyncHandler(async (req, res, next) => {
    if(!req.user.region_id){
        return next(new ErrorResponse('Siz uchun ruhsat etilmagan', 403))
    }

    let { name, bank_klient, raschet_schet, raschet_schet_gazna, mfo, inn } = req.body;
    
    checkNotNull(next, name, bank_klient, raschet_schet, raschet_schet_gazna, mfo, inn);
    checkValueString(next, name, bank_klient, raschet_schet, raschet_schet_gazna, mfo, inn)
    name = name.trim();
    bank_klient = bank_klient.trim()

    const test = await pool.query(`SELECT * FROM spravochnik_organization WHERE inn = $1 AND user_id = $2
    `, [inn, req.user.region_id]);
    if (test.rows.length > 0) {
        return next(new ErrorResponse('Ushbu malumot avval kiritilgan', 409));
    }

    const result = await pool.query(`INSERT INTO spravochnik_organization(
        name, bank_klient, raschet_schet, 
        raschet_schet_gazna, mfo, inn, user_id
        ) VALUES($1, $2, $3, $4, $5, $6, $7) 
        RETURNING *
    `, [name, bank_klient, raschet_schet, raschet_schet_gazna, mfo, inn, req.user.region_id]);
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
    
    const result = await pool.query(`SELECT id, name, bank_klient, raschet_schet, raschet_schet_gazna, mfo, inn 
        FROM spravochnik_organization  
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

    let { name, bank_klient, raschet_schet, raschet_schet_gazna, mfo, inn } = req.body;
    
    checkNotNull(next, name, bank_klient, raschet_schet, raschet_schet_gazna, mfo, inn);
    checkValueString(next, name, bank_klient, raschet_schet, raschet_schet_gazna, mfo, inn)
    name = name.trim();
    bank_klient = bank_klient.trim()

    const test = await pool.query(`SELECT * FROM spravochnik_organization WHERE inn = $1 AND user_id = $2
    `, [inn, req.user.region_id]);
    if (test.rows.length > 0) {
        return next(new ErrorResponse('Ushbu malumot avval kiritilgan', 409));
    }

    const result = await pool.query(`UPDATE spravochnik_organization 
        SET name = $1, bank_klient = $2, raschet_schet = $3, raschet_schet_gazna = $4, mfo = $5, inn = $6
        WHERE user_id = $7 AND id = $8
        RETURNING *
    `, [name, bank_klient, raschet_schet, raschet_schet_gazna, mfo, inn, req.user.region_id, req.params.id]);
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
    let value = await pool.query(`SELECT * FROM spravochnik_organization WHERE id = $1 AND isdeleted = false AND user_id = $2
    `, [req.params.id, req.user.region_id])
    value = value.rows[0]
    if(!value){
        return next(new ErrorResponse('Server xatolik. Malumot topilmadi', 404))
    }

    const deleteValue = await pool.query(`UPDATE spravochnik_organization SET isdeleted = $1 WHERE id = $2 RETURNING *`, [true, req.params.id])

    if(!deleteValue.rows[0]){
        return next(new ErrorResponse('Server xatolik. Malumot ochirilmadi', 500))
    }

    return res.status(200).json({
        success: true, 
        data: "Muvaffaqiyatli ochirildi"
    })
})