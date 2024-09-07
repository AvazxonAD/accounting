const pool = require("../config/db");
const asyncHandler = require("../middleware/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const return_id = require('../utils/auth/return_id')
const { returnStringDate } = require('../utils/date.function')

// create  expense 
exports.create_expense = asyncHandler(async (req, res, next) => {
    const user_id = await return_id(req.user)
    if(!user_id){
        return next(new ErrorResponse('Server xatolik', 500))
    }

    const { requisite_id, partner_id, date1, date2, conratc_summa, contract_number, goal_info, goal_id, position_id_1, position_id_2 } = req.body

    if ( !requisite_id || !partner_id  || !date1 || !date2 || !conratc_summa || !contract_number || !goal_info || !goal_number || !position_id_1 || !position_id_2) {
        return next(new ErrorResponse('So`rovlar bosh qolishi mumkin emas', 400))
    }

    if (typeof requisite_id !== "number" ||  typeof partner_id  !== "number" || typeof date1 !== "string" || typeof date2 !== "string" || typeof conratc_summa !== "number" || typeof contract_number !== "number" || typeof goal_info !== "string" || typeof goal_number !== "string" || typeof position_id_1 !== "number" || typeof position_id_2 !== "number") {
        return next(new ErrorResponse('Malumotlar tog`ri kiritilishi kerak', 400))
    }

    const date_1 = returnStringDate(date1)
    const date_2 = returnStringDate(date2)
    if(!date_1 || !date_2){
        return next(new ErrorResponse('Sana formati notogri kiritildi. Tog`ri format kun.oy.yil', 400))
    }

    const requisite = await pool.query(`SELECT * FROM requisites WHERE id = $1 AND user_id = $2`, [requisite_id, user_id])
    const partner = await pool.query(`SELECT * FROM partners WHERE id = $1 AND user_id = $2`, [partner_id, user_id])
    const position_1 = await pool.query(`SELECT * FROM positions WHERE id = $1 AND user_id = $2`, [position_id_1, user_id]) 
    const position_2 = await pool.query(`SELECT * FROM positions WHERE id = $1 AND user_id = $2`, [position_id_2, user_id]) 
    const goal = await pool.query(`SELECT * FROM goals WHERE id = $1 AND user_id = $2`, [goal_id, user_id])

    const result = await pool.query(`INSERT INTO requisites(inn, name, mfo, bank_name, account_number, treasury_account_number, shot_number, budget, user_id) 
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

// for create page 
exports.for_create_page = asyncHandler(async (req, res, next) => {
    const user_id = await return_id(req.user)
    if(!user_id){
        return next(new ErrorResponse('Server xatolik', 500))
    }

    let requisites = await pool.query(`SELECT id, name, inn, bank_name, mfo, treasury_account_number, account_number, balance, shot_number, budget FROM requisites WHERE user_id = $1`, [user_id])
    requisites = requisites.rows

    let positions = await pool.query(`SELECT id, position, fio FROM positions WHERE user_id = $1`, [user_id])
    positions = positions.rows

    let goals = await pool.query(`SELECT id, name, short_name, schot, number FROM goals WHERE user_id = $1`, [user_id])
    goals = goals.rows
    
    let partners = await pool.query(`SELECT id, name, inn, bank_name, mfo, treasury_account_number, account_number, budget, contract_number, contract_date, contract_summa, smeta_number 
        FROM partners WHERE user_id = $1`, [user_id])
    partners = partners.rows

    return res.status(200).json({
        success: true,
        data: {
            requisites,
            positions,
            goals,
            partners
        }
    })
})