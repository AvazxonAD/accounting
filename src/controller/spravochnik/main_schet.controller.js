const pool = require("../../config/db");
const asyncHandler = require("../../middleware/asyncHandler");
const ErrorResponse = require("../../utils/errorResponse");
const { checkValueString, checkValueNumber } = require('../../utils/check.functions');
const { getByIdBudjet } = require("../../service/budjet.name.db");
const {
    createMain_schet,
    getByIdMainSchet,
    getAllMain_schet,
    updateMain_schet,
    deleteMain_schet
} = require('../../service/main.schet.db')

// create 
const create = asyncHandler(async (req, res, next) => {
    let { account_number, spravochnik_budjet_name_id, tashkilot_nomi, tashkilot_bank, tashkilot_mfo, tashkilot_inn, account_name, jur1_schet, jur1_subschet, jur2_schet, jur2_subschet, jur3_schet, jur3_subschet, jur4_subschet, jur4_schet } = req.body;

    checkValueString(account_number, tashkilot_nomi, tashkilot_bank, tashkilot_mfo, account_name, jur1_schet, jur2_schet, jur3_schet, jur4_schet)
    checkValueNumber(tashkilot_inn, spravochnik_budjet_name_id)

    if (tashkilot_inn.toString().length !== 9) {
        return next(new ErrorResponse('Inn raqami 9 xonalik raqam bolishi kerak', 400))
    }

    const test_budjet = await getByIdBudjet(spravochnik_budjet_name_id)
    if (!test_budjet) {
        return next(new ErrorResponse('Server xatolik. Budjet topilmadi', 404))
    }

    if (jur1_schet.length > 5 || jur2_schet.length > 5 || jur3_schet.length > 5 || jur4_schet.length > 5) {
        return next(new ErrorResponse('Schet raqamining xonalari soni 5 tadan oshmasligi kerak', 400))
    }

    if (jur1_subschet.length > 7 || jur2_subschet.length > 7 || jur3_subschet.length > 7 || jur4_subschet.length > 7) {
        return next(new ErrorResponse('Sub schet raqamining xonalari soni 7 tadan oshmasligi kerak', 400))
    }

    const result = await createMain_schet(account_number, spravochnik_budjet_name_id, tashkilot_nomi, tashkilot_bank, tashkilot_mfo, tashkilot_inn, account_name, jur1_schet, jur1_subschet, jur2_schet, jur2_subschet, jur3_schet, jur3_subschet, jur4_subschet, jur4_schet, req.user.region_id)
    if (!result) {
        return next(new ErrorResponse('Server xatolik. Malumot kiritilmadi', 500));
    }

    return res.status(201).json({
        success: true,
        data: "Muvafaqyatli kiritildi"
    });
});

// get all
const getAll = asyncHandler(async (req, res, next) => {
    const result = await getAllMain_schet(req.user.region_id)

    return res.status(200).json({
        success: true,
        data: result
    })
})

// update
const update = asyncHandler(async (req, res, next) => {
    const user_id = req.user.region_id
    const id = req.params.id

    const testMain_schet = await getByIdMainSchet(user_id, id)
    if (!testMain_schet) {
        return next(new ErrorResponse("Server xatolik. Schet topilmadi", 404))
    }

    let { account_number, spravochnik_budjet_name_id, tashkilot_nomi, tashkilot_bank, tashkilot_mfo, tashkilot_inn, account_name, jur1_schet, jur1_subschet, jur2_schet, jur2_subschet, jur3_schet, jur3_subschet, jur4_subschet, jur4_schet } = req.body;

    checkValueString(account_number, tashkilot_nomi, tashkilot_bank, tashkilot_mfo, account_name, jur1_schet, jur2_schet, jur3_schet, jur4_schet)
    checkValueNumber(tashkilot_inn, spravochnik_budjet_name_id)

    if (tashkilot_inn.toString().length !== 9) {
        return next(new ErrorResponse('Inn raqami 9 xonalik raqam bolishi kerak', 400))
    }

    if (jur1_schet.length > 5 || jur2_schet.length > 5 || jur3_schet.length > 5 || jur4_schet.length > 5) {
        return next(new ErrorResponse('Schet raqamining xonalari soni 5 tadan oshmasligi kerak', 400))
    }

    if (jur1_subschet.length > 7 || jur2_subschet.length > 7 || jur3_subschet.length > 7 || jur4_subschet.length > 7) {
        return next(new ErrorResponse('Sub schet raqamining xonalari soni 7 tadan oshmasligi kerak', 400))
    }

    const test_budjet = await getByIdBudjet(spravochnik_budjet_name_id)
    if (!test_budjet) {
        return next(new ErrorResponse('Server xatolik. Budjet topilmadi', 404))
    }

    const result = updateMain_schet(account_number, spravochnik_budjet_name_id, tashkilot_nomi, tashkilot_bank, tashkilot_mfo, tashkilot_inn, account_name, jur1_schet, jur1_subschet, jur2_schet, jur2_subschet, jur3_schet, jur3_subschet, jur4_subschet, jur4_schet, id)
    if (!result) {
        return next(new ErrorResponse('Server xatolik. Malumot Yangilanmadi', 500));
    }

    return res.status(201).json({
        success: true,
        data: "Muvafaqyatli yangilandi"
    });
})

// delete value
const deleteValue = asyncHandler(async (req, res, next) => {
    const user_id = req.user.region_id
    const id = req.params.id

    const value = await getByIdMainSchet(user_id, id)
    if (!value) {
        return next(new ErrorResponse('Server xatolik. Malumot topilmadi', 404))
    }

    const deleteValue = await deleteMain_schet(id)
    if (!deleteValue) {
        return next(new ErrorResponse('Server xatolik. Malumot ochirilmadi', 500))
    }

    return res.status(200).json({
        success: true,
        data: "Muvaffaqiyatli ochirildi"
    })
})

// get element by id 
const getElementById = asyncHandler(async (req, res, next) => {
    const value = await getByIdMainSchet(req.user.region_id, req.params.id)
    if (!value) {
        return next(new ErrorResponse('Server error. main_schet topilmadi', 404))
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