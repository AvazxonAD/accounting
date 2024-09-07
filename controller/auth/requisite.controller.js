const pool = require("../../config/db");
const asyncHandler = require("../../middleware/asyncHandler");
const ErrorResponse = require("../../utils/errorResponse");
const return_id = require('../../utils/auth/return_id')

// create requisite 
exports.create_requsite = asyncHandler(async (req, res, next) => {
    const user_id = await return_id(req.user)
    if(!user_id){
        return next(new ErrorResponse('Server xatolik', 500))
    }

    const { inn, name, mfo, bank_name, account_number, treasury_account_number, shot_number, budget} = req.body

    if (!inn || !name || !mfo || !bank_name || !account_number || !treasury_account_number || !shot_number || !budget) {
        return next(new ErrorResponse('So`rovlar bosh qolishi mumkin emas', 400))
    }

    if (typeof inn !== "string" || inn.length !== 9 || typeof name !== "string" || typeof mfo !== "string" || typeof bank_name !== "string" || typeof account_number !== "string" || typeof treasury_account_number !== "string" || typeof shot_number !== "number" || typeof budget !== "string") {
        return next(new ErrorResponse('Malumotlar tog`ri kiritilishi kerak', 400))
    }

    const requisite = await pool.query(`INSERT INTO requisites(inn, name, mfo, bank_name, account_number, treasury_account_number, shot_number, budget, user_id) 
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *     
    `, [inn, name, mfo, bank_name, account_number, treasury_account_number, shot_number, budget, user_id])

    if(!requisite.rows[0]){
        return next(new ErrorResponse('Server xatolik', 500))
    }


    return res.status(200).json({
        success: true,
        data: "Create true"
    })
})

// get all requisites 
exports.get_all_requisites = asyncHandler(async (req, res, next) => {
    const user_id = await return_id(req.user)
    if(!user_id){
        return next(new ErrorResponse('Server xatolik', 500))
    }

    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;

    if (limit <= 0 || page <= 0) {
        return next(new ErrorResponse("Limit va page musbat sonlar bo'lishi kerak", 400));
    }
    const offset = (page - 1) * limit;

    let requisites = await pool.query(`SELECT id, inn, name, mfo, bank_name, account_number, treasury_account_number, shot_number, budget, balance
        FROM requisites WHERE user_id = $1 ORDER BY default_value DESC OFFSET $2 LIMIT $3`, [user_id, offset, limit]);
    requisites = requisites.rows

    const totalQuery = await pool.query(`SELECT COUNT(id) AS total FROM requisites WHERE user_id = $1`, [user_id]);
    const total = parseInt(totalQuery.rows[0].total);
    const pageCount = Math.ceil(total / limit);

    return res.status(200).json({
        success: true,
        pageCount: pageCount,
        count: total,
        currentPage: page, 
        nextPage: page >= pageCount ? null : page + 1,
        backPage: page === 1 ? null : page - 1,
        data: requisites
    })
})

// update  requisite
exports.update_requisite = asyncHandler(async (req, res, next) => {
    const user_id = await return_id(req.user)
    if(!user_id){
        return next(new ErrorResponse('Server xatolik', 500))
    }

    let requisite = await pool.query(`SELECT * FROM requisites WHERE id = $1 AND user_id = $2`, [req.params.id, user_id])
    requisite = requisite.rows[0]
    if(!requisite){
        return next(new ErrorResponse('Server error requisite is not defined', 500))
    }

    const { inn, name, mfo, bank_name, account_number, treasury_account_number, shot_number, budget} = req.body

    if (!inn || !name || !mfo || !bank_name || !account_number || !treasury_account_number || !shot_number || !budget) {
        return next(new ErrorResponse('So`rovlar bosh qolishi mumkin emas', 400))
    }

    if (typeof inn !== "string" || inn.length !== 9 || typeof name !== "string" || typeof mfo !== "string" || typeof bank_name !== "string" || typeof account_number !== "string" || typeof treasury_account_number !== "string" || typeof shot_number !== "number" || typeof budget !== "string") {
        return next(new ErrorResponse('Malumotlar tog`ri kiritilishi kerak', 400))
    }

    const result = await pool.query(`UPDATE requisites SET inn = $1, name = $2, mfo = $3, bank_name = $4, account_number = $5, treasury_account_number= $6, shot_number = $7, budget = $8 WHERE  id = $9
        RETURNING *     
    `, [inn, name, mfo, bank_name, account_number, treasury_account_number, shot_number, budget, req.params.id])

    if(!result.rows[0]){
        return next(new ErrorResponse('Server xatolik', 500))
    }

    return res.status(200).json({
        success: true,
        data: "Muvaffaqiyatli yangilandi"
    })
})


// delete requisite
exports.delete_counterparty = asyncHandler(async (req, res, next) => {
    const user_id = await return_id(req.user)
    if(!user_id){
        return next(new ErrorResponse('Server xatolik', 500))
    }

    const requisite = await pool.query(`DELETE FROM requisites WHERE id = $1 AND user_id = $2 RETURNING * `, [req.params.id, user_id])

    if (!requisite.rows[0]) {
        return next(new ErrorResponse('DELETE FALSE', 500))
    } else {
        return res.status(200).json({
            success: true,
            data: "DELETE TRUE"
        })
    }
})

// default requisite 
exports.default_value = asyncHandler(async (req, res, next) => {
    const user_id = await return_id(req.user)
    if(!user_id){
        return next(new ErrorResponse('Server xatolik', 500))
    }

    const requisite = await pool.query(`SELECT * FROM requisites WHERE id = $1 AND user_id = $2`, [req.params.id, user_id])
    if(!requisite.rows[0]){
        return next(new ErrorResponse('Server xatolik', 500))
    }

    await pool.query(`UPDATE requisites SET default_value = $1 WHERE user_id = $2`, [false, user_id])
    await pool.query(`UPDATE requisites SET default_value = $1 WHERE user_id = $2 AND id = $3`, [true, user_id, req.params.id])

    return res.status(200).json({
        success: true,
        data: "Muvaffaqiyatli yangilandi"
    })
})


// get default value 
exports.get_default_value = asyncHandler(async (req, res, next) => {
    const user_id = await return_id(req.user)
    if(!user_id){
        return next(new ErrorResponse('Server xatolik', 500))
    }
    
    let requisite = await pool.query(`SELECT id, inn, name, mfo, bank_name, account_number, treasury_account_number, shot_number, budget, balance
        FROM requisites WHERE user_id = $1 AND default_value = $2`, [user_id, true]);
    requisite = requisite.rows[0]

    return res.status(200).json({
        success: true,
        data: requisite
    })
})