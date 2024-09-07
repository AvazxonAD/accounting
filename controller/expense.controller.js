const pool = require("../config/db");
const asyncHandler = require("../middleware/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const return_id = require('../utils/auth/return_id')
const { returnStringDate, returnDate } = require('../utils/date.function')

// create  expense 
exports.create_expense = asyncHandler(async (req, res, next) => {
    console.log(req.body)
    const user_id = await return_id(req.user)
    if(!user_id){
        return next(new ErrorResponse('Server xatolik', 500))
    }

    const { requisite_id, partner_id, date1, date2, conratc_summa, contract_number, goal_info, goal_id, position_id_1, position_id_2 } = req.body

    if ( !requisite_id || !partner_id  || !date1 || !date2 || !conratc_summa || !contract_number || !goal_info || !position_id_1 || !position_id_2) {
        return next(new ErrorResponse('So`rovlar bosh qolishi mumkin emas', 400))
    }

    if (typeof requisite_id !== "number" ||  typeof partner_id  !== "number" || typeof date1 !== "string" || typeof date2 !== "string" || typeof conratc_summa !== "number" || typeof contract_number !== "string" || typeof goal_info !== "string" || typeof position_id_1 !== "number" || typeof position_id_2 !== "number") {
        return next(new ErrorResponse('Malumotlar tog`ri kiritilishi kerak', 400))
    }

    const date_1 = returnDate(date1)
    const date_2 = returnDate(date2)
    if(!date_1 || !date_2){
        return next(new ErrorResponse('Sana formati notogri kiritildi. Tog`ri format kun.oy.yil', 400))
    }

    let requisite = await pool.query(`SELECT * FROM requisites WHERE id = $1 AND user_id = $2`, [requisite_id, user_id])
    requisite = requisite.rows[0]
    let partner = await pool.query(`SELECT * FROM partners WHERE id = $1 AND user_id = $2`, [partner_id, user_id])
    partner = partner.rows[0]
    let  position_1 = await pool.query(`SELECT * FROM positions WHERE id = $1 AND user_id = $2`, [position_id_1, user_id]) 
    position_1 = position_1.rows[0]
    let position_2 = await pool.query(`SELECT * FROM positions WHERE id = $1 AND user_id = $2`, [position_id_2, user_id]) 
    position_2 = position_2.rows[0]
    let goal = await pool.query(`SELECT * FROM goals WHERE id = $1 AND user_id = $2`, [goal_id, user_id])
    goal = goal.rows[0]

    const result = await pool.query(`INSERT INTO expense(
        inn, 
        name, mfo, bank_name, account_number, treasury_account_number, shot_number, budget, user_id) 
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

// for create page 
exports.for_create_page = asyncHandler(async (req, res, next) => {
    const user_id = await return_id(req.user)
    if(!user_id){
        return next(new ErrorResponse('Server xatolik', 500))
    }

    let requisites = await pool.query(`SELECT id, name, inn, bank_name, mfo, treasury_account_number, account_number, balance, shot_number, budget 
        FROM requisites WHERE user_id = $1 ORDER BY default_value DESC`, [user_id])
    requisites = requisites.rows

    let requisite = await pool.query(`SELECT id, name, inn, bank_name, mfo, treasury_account_number, account_number, balance, shot_number, budget 
        FROM requisites WHERE user_id = $1 AND default_value = $2`, [user_id, true])
    requisite = requisite.rows[0]

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
            requisite,
            requisites,
            positions,
            goals,
            partners
        }
    })
})