const pool = require("../config/db");
const asyncHandler = require("../middleware/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const return_id = require('../utils/auth/return_id')

// create partner 
exports.create_partner = asyncHandler(async (req, res, next) => {
    const user_id = await return_id(req.user)
    if(!user_id){
        return next(new ErrorResponse('Server xatolik', 500))
    }
    console.log(req.body)

    const { inn, name, mfo, bank_name, account_number, treasury_account_number, contract_date, contract_number, contract_summa, smeta_number, address, partner_boss, smeta_graph, budget} = req.body

    if (!inn || !name || !mfo || !bank_name || !account_number  || smeta_graph === undefined || !budget) {
        return next(new ErrorResponse('So`rovlar bosh qolishi mumkin emas', 400))
    }

    if (typeof inn !== "string" || inn.length !== 9 || typeof name !== "string" || typeof mfo !== "string" || typeof bank_name !== "string" || typeof account_number !== "string"  || typeof smeta_graph !== "number" || typeof budget !== "string") {
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

    let requisites = await pool.query(`SELECT id, inn, name, mfo, bank_name, account_number, treasury_account_number, shot_number, budget
        FROM requisites WHERE user_id = $1 ORDER BY id`, [user_id]);
    requisites = requisites.rows

    return res.status(200).json({
        success: true,
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
        data: result.rows
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