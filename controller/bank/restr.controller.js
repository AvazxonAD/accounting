const pool = require("../../config/db");
const asyncHandler = require("../../middleware/asyncHandler");
const ErrorResponse = require("../../utils/errorResponse");
const return_id = require('../../utils/auth/return_id')
const { returnDate } = require('../../utils/date.function')

// get revenue restr 
exports.get_revenue_restr = asyncHandler(async (req, res, next) => {

    const user_id = await return_id(req.user)
    if(!user_id){
        return next(new ErrorResponse('Server xatolik user topilmadi', 500))
    }

    let {date1, date2, requisite_id} = req.body

    if(!date1 || !date2){
        return next(new ErrorResponse('So`rovlar bo`sh qolishi mumkin emas', 400))
    }

    date1 = returnDate(date1)
    date2 = returnDate(date2)
    if(!date1 || !date2){
        return next(new ErrorResponse('Sana notog`ri formatda kiritildi. Tog`ri format : kun.oy.yil. Masalan: 12.12.2024'))
    }

    if(!requisite_id){
        requisite_id = await pool.query(`SELECT id FROM requisites WHERE user_id = $1 AND default_value = $2`, [user_id, true])
        if(!requisite_id.rows[0]){
            return next(new ErrorResponse('Server xatolik rekvizit topilmadi', 400))
        }
        requisite_id = requisite_id.rows[0].id 
    }

    const revenues = await pool.query(`SELECT id, contract_number, contract_date, partner_name, contract_summa, goal_info
        FROM revenues 
        WHERE user_id = $1 AND requisite_id = $2 AND contract_date BETWEEN $3 AND $4
    `, [user_id, requisite_id, date1, date2])

    return res.status(200).json({
        success: true,
        data: revenues.rows
    })
})

// for revenue restr page 
exports.for_revenue_restr_page = asyncHandler(async (req, res, next) => {

    const user_id = await return_id(req.user)
    if(!user_id){
        return next(new ErrorResponse('Server xatolik  user topilmadi', 500))
    }

    const requisites = await pool.query(`SELECT id, account_number, balance FROM requisites WHERE user_id = $1 ORDER BY default_value DESC`, [user_id])  
    const requisite = await pool.query(`SELECT id, account_number, balance FROM requisites WHERE user_id = $1 AND default_value = $2`, [user_id, true])

    return res.status(200).json({
        success: true,
        data: {
            requisites: requisites.rows,
            requisite: requisite.rows[0]
        }
    })
})