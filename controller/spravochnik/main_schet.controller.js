const pool = require("../../config/db");
const asyncHandler = require("../../middleware/asyncHandler");
const ErrorResponse = require("../../utils/errorResponse");
const {checkValueString, checkValueNumber} = require('../../utils/check.functions');

// create 
const create = asyncHandler(async (req, res, next) => {
    let { account_number, spravochnik_budjet_name_id, tashkilot_nomi, tashkilot_bank, tashkilot_mfo, tashkilot_inn, account_name, jur1_schet, jur1_subschet, jur2_schet, jur2_subschet, jur3_schet, jur3_subschet, jur4_subschet, jur4_schet } = req.body;
    
    checkValueString(account_number, tashkilot_nomi, tashkilot_bank, tashkilot_mfo, account_name, jur1_schet, jur2_schet, jur3_schet, jur4_schet)
    checkValueNumber(tashkilot_inn, spravochnik_budjet_name_id)

    if(tashkilot_inn.toString().length !== 9){
        return next(new ErrorResponse('Inn raqami 9 xonalik raqam bolishi kerak', 400))
    }

    const test = await pool.query(`SELECT * FROM spravochnik_budjet_name WHERE id = $1 AND isdeleted = false`, [spravochnik_budjet_name_id])
    if(!test.rows[0]){
        return next(new ErrorResponse('Server xatolik. Budjet topilmadi', 404))
    }

    if(jur1_schet.length > 5 || jur2_schet.length > 5 || jur3_schet.length > 5 || jur4_schet.length > 5){
        return next(new ErrorResponse('Schet raqamining xonalari soni 5 tadan oshmasligi kerak', 400))
    }

    if(jur1_subschet.length > 7 || jur2_subschet.length > 7 || jur3_subschet.length > 7 || jur4_subschet.length > 7){
        return next(new ErrorResponse('Sub schet raqamining xonalari soni 7 tadan oshmasligi kerak', 400))
    }

    const result = await pool.query(`INSERT INTO main_schet(account_number, spravochnik_budjet_name_id, tashkilot_nomi, tashkilot_bank, tashkilot_mfo, tashkilot_inn, account_name, jur1_schet, jur1_subschet, jur2_schet, jur2_subschet, jur3_schet, jur3_subschet, jur4_subschet, jur4_schet, user_id) 
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *
    `, [account_number, spravochnik_budjet_name_id, tashkilot_nomi, tashkilot_bank, tashkilot_mfo, tashkilot_inn, account_name, jur1_schet, jur1_subschet, jur2_schet, jur2_subschet, jur3_schet, jur3_subschet, jur4_subschet, jur4_schet, req.user.region_id]);
    if (!result.rows[0]) {
        return next(new ErrorResponse('Server xatolik. Malumot kiritilmadi', 500));
    }

    return res.status(201).json({
        success: true,
        data: "Muvafaqyatli kiritildi"
    });
});

// get all
const getAll = asyncHandler(async (req, res, next) => {
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
            main_schet.jur1_subschet,
            main_schet.jur2_schet, 
            main_schet.jur2_subschet,
            main_schet.jur3_schet,
            main_schet.jur3_subschet, 
            main_schet.jur4_schet,
            main_schet.jur4_subschet, 
            spravochnik_budjet_name.name AS budjet_name,
            spravochnik_budjet_name.id AS spravochnik_budjet_name_id 
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

// update
const update = asyncHandler(async (req, res, next) => {

    const testMain_schet = await pool.query(`SELECT * FROM main_schet WHERE user_id = $1 AND id = $2 AND isdeleted = false`)
    if(!testMain_schet.rows[0]){
        return next(new ErrorResponse("Server xatolik. Schet topilmadi", 404))
    }

    let { account_number, spravochnik_budjet_name_id, tashkilot_nomi, tashkilot_bank, tashkilot_mfo, tashkilot_inn, account_name, jur1_schet, jur1_subschet, jur2_schet, jur2_subschet, jur3_schet, jur3_subschet, jur4_subschet, jur4_schet } = req.body;
    
    checkValueString(account_number, tashkilot_nomi, tashkilot_bank, tashkilot_mfo, account_name, jur1_schet, jur2_schet, jur3_schet, jur4_schet)
    checkValueNumber(tashkilot_inn, spravochnik_budjet_name_id)
    
    if(tashkilot_inn.toString().length !== 9){
        return next(new ErrorResponse('Inn raqami 9 xonalik raqam bolishi kerak', 400))
    }

    if(jur1_schet.length > 5 || jur2_schet.length > 5 || jur3_schet.length > 5 || jur4_schet.length > 5){
        return next(new ErrorResponse('Schet raqamining xonalari soni 5 tadan oshmasligi kerak', 400))
    }

    if(jur1_subschet.length > 7 || jur2_subschet.length > 7 || jur3_subschet.length > 7 || jur4_subschet.length > 7){
        return next(new ErrorResponse('Sub schet raqamining xonalari soni 7 tadan oshmasligi kerak', 400))
    }

    const test = await pool.query(`SELECT * FROM spravochnik_budjet_name WHERE id = $1 AND isdeleted = false`, [spravochnik_budjet_name_id])
    if(!test.rows[0]){
        return next(new ErrorResponse('Server xatolik. Budjet topilmadi', 404))
    }

    const result = await pool.query(`UPDATE  main_schet SET 
        account_number = $1, 
        spravochnik_budjet_name_id = $2, 
        tashkilot_nomi = $3, 
        tashkilot_bank = $4, 
        tashkilot_mfo = $5, 
        tashkilot_inn = $6, 
        account_name = $7, 
        jur1_schet = $8, 
        jur1_subschet = $9, 
        jur2_schet = $10, 
        jur2_subschet = $11, 
        jur3_schet = $12, 
        jur3_subschet = $13, 
        jur4_subschet = $14, 
        jur4_schet = $15
        WHERE id = $16
        RETURNING *
    `, [account_number, spravochnik_budjet_name_id, tashkilot_nomi, tashkilot_bank, tashkilot_mfo, tashkilot_inn, account_name, jur1_schet, jur1_subschet, jur2_schet, jur2_subschet, jur3_schet, jur3_subschet, jur4_subschet, jur4_schet, req.params.id]);
    if (!result.rows[0]) {
        return next(new ErrorResponse('Server xatolik. Malumot Yangilanmadi', 500));
    }

    return res.status(201).json({
        success: true,
        data: "Muvafaqyatli yangilandi"
    });
})

// delete value
const deleteValue = asyncHandler(async (req, res, next) => {
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

// get element by id 
const getElementById = asyncHandler(async (req, res, next) => {
    let value = await pool.query(`SELECT * FROM main_schet WHERE id = $1 AND user_id = $2 AND isdeleted = false`, [req.params.id, req.user.region_id])
    value = value.rows[0]
    if(!value){
        return next(new ErrorResponse('Server error. main_schet topilmadi'))
    }

    return res.status(200).json({
        success: true,
        data: value
    })
})

module.exports = {
    getElementById,
    create, 
    getAll, 
    deleteValue,
    update
}