const pool = require("../../config/db");
const asyncHandler = require("../../middleware/asyncHandler");
const ErrorResponse = require("../../utils/errorResponse");
const { checkNotNull, checkValueString, checkValueNumber} = require('../../utils/check.functions');

// create 
exports.create = asyncHandler(async (req, res, next) => {
    if(!req.user.region_id){
        return next(new ErrorResponse('Siz uchun ruhsat etilmagan', 403))
    }

    let { account_number, spravochnik_budjet_name_id, tashkilot_nomi, tashkilot_bank, tashkilot_mfo, tashkilot_inn, account_name, jur1_schet, jur2_schet, jur3_schet, jur4_schet } = req.body;
    
    checkNotNull(next, account_number, spravochnik_budjet_name_id, tashkilot_nomi, tashkilot_bank, tashkilot_mfo, tashkilot_inn, account_name, jur1_schet, jur2_schet, jur3_schet, jur4_schet);
    checkValueString(next, account_number, tashkilot_nomi, tashkilot_bank, tashkilot_mfo, account_name, jur1_schet, jur2_schet, jur3_schet, jur4_schet)
    checkValueNumber(next, tashkilot_inn, spravochnik_budjet_name_id)

    const result = await pool.query(`INSERT INTO main_schet(account_number, spravochnik_budjet_name_id, tashkilot_nomi, tashkilot_bank, tashkilot_mfo, tashkilot_inn, account_name, jur1_schet, jur2_schet, jur3_schet, jur4_schet, user_id) 
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *
    `, [account_number, spravochnik_budjet_name_id, tashkilot_nomi, tashkilot_bank, tashkilot_mfo, tashkilot_inn, account_name, jur1_schet, jur2_schet, jur3_schet, jur4_schet, req.user.region_id]);
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
    
    const result = await pool.query(`
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
            main_schet.jur2_schet, 
            main_schet.jur3_schet, 
            main_schet.jur4_schet, 
            spravochnik_budjet_name.name AS budjet_name
        FROM main_schet
        JOIN spravochnik_budjet_name 
            ON spravochnik_budjet_name.id = main_schet.spravochnik_budjet_name_id
        WHERE main_schet.isdeleted = false 
            AND main_schet.user_id = $1 
        ORDER BY main_schet.id
    `, [req.user.region_id]);

    return res.status(200).json({
        success: true,
        data: result.rows
    })
})

exports.getAlLForLogin = asyncHandler(async (req, res, next) => {
    const result = await pool.query(`
        SELECT 
            main_schet.id, 
            main_schet.account_number, 
            main_schet.spravochnik_budjet_name_id, 
            spravochnik_budjet_name.name AS budjet_name
        FROM main_schet
        JOIN spravochnik_budjet_name 
            ON spravochnik_budjet_name.id = main_schet.spravochnik_budjet_name_id
        WHERE main_schet.isdeleted = false`);

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

    let { account_number, spravochnik_budjet_name_id, tashkilot_nomi, tashkilot_bank, tashkilot_mfo, tashkilot_inn, account_name, jur1_schet, jur2_schet, jur3_schet, jur4_schet } = req.body;
    
    checkNotNull(next, account_number, spravochnik_budjet_name_id, tashkilot_nomi, tashkilot_bank, tashkilot_mfo, tashkilot_inn, account_name, jur1_schet, jur2_schet, jur3_schet, jur4_schet);
    checkValueString(next, account_number, tashkilot_nomi, tashkilot_bank, tashkilot_mfo, account_name, jur1_schet, jur2_schet, jur3_schet, jur4_schet)
    checkValueNumber(next, tashkilot_inn, spravochnik_budjet_name_id)

    const result = await pool.query(`UPDATE  main_schet SET 
        account_number = $1, 
        spravochnik_budjet_name_id = $2, 
        tashkilot_nomi = $3, 
        tashkilot_bank = $4, 
        tashkilot_mfo = $5, 
        tashkilot_inn = $6, 
        account_name = $7, 
        jur1_schet = $8, 
        jur2_schet = $9, 
        jur3_schet = $10, 
        jur4_schet = $11
        WHERE user_id = $12 AND id = $13
        RETURNING *
    `, [account_number, spravochnik_budjet_name_id, tashkilot_nomi, tashkilot_bank, tashkilot_mfo, tashkilot_inn, account_name, jur1_schet, jur2_schet, jur3_schet, jur4_schet, req.user.region_id, req.params.id]);
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