const pool = require("../../config/db");
const asyncHandler = require("../../middleware/asyncHandler");
const ErrorResponse = require("../../utils/errorResponse");


// create account number
exports.create_account_number = asyncHandler(async (req, res, next) => {
    const { account_number} = req.body
    if( !account_number ){
        return next(new ErrorResponse('So`rovlar bo`sh qolishi mumkin emas', 400))
    }      

    if( typeof account_number !== "string" || account_number.length !== 20){
        return next(new ErrorResponse('Malumotlar tog`ri kiritilishi kerak', 400))
    }

    const test = await pool.query(`SELECT * FROM account_numbers WHERE user_id = $1 AND account_number = $2
        `, [req.user.id, account_number])
    if(test.rows[0]){
        return next(new ErrorResponse('Ushbu shot raqami kiritilgan', 400))
    }

    const accountNumber = await pool.query(`INSERT INTO account_numbers(account_number, user_id) VALUES($1, $2)
        RETURNING *     
    `, [account_number, req.user.id])

    return res.status(200).json({
        success: true,
        data: accountNumber.rows[0]
    })
})

// get all shot numbers 
exports.getAllShotNumbers = asyncHandler(async (req, res, next) => {
    let account_numbers = await pool.query(`SELECT * FROM account_numbers WHERE user_id = $1`, [req.user.id])
    account_numbers = account_numbers.rows
    
    if(account_numbers.length === 0){
        return next(new ErrorResponse('Malumot topilmadi', 500))
    }
    return res.status(200).json({
        success: true,
        data: account_numbers
    })
})

// update  shot number
exports.update_account_number = asyncHandler(async (req, res, next) => {
    let accountNumber = await pool.query(`SELECT * FROM account_numbers WHERE id = $1`, [req.params.id])
    accountNumber = accountNumber.rows[0]
    if(!accountNumber){
        return next(new ErrorResponse('Server xatolik', 500))
    }

    const { account_number } = req.body
    if( !account_number ){
        return next(new ErrorResponse('So`rovlar bosh qolishi mumkin emas', 400))
    }      

    if(typeof account_number !== "string"){
        return next(new ErrorResponse('Malumotlar tog`ri kiritilishi kerak', 400))
    }

    const test = await pool.query(`SELECT * FROM account_numbers WHERE user_id = $1 AND account_number = $2`, [req.user.id, account_number])
    if(test.rows[0]){
        return next(new ErrorResponse('Bu xisob raqami raqami avval kiritilgan', 400))
    }

    const result = await pool.query(`UPDATE account_numbers SET account_number = $1 WHERE  id = $2
        RETURNING *     
    `, [account_number, req.params.id])

    return res.status(200).json({
        success: true,
        data: result.rows
    })
})

// delete account number
exports.delete_account_number = asyncHandler(async (req, res, next) => {
    const account_number =  await pool.query(`DELETE FROM account_numbers WHERE id = $1 RETURNING * `, [req.params.id])

    if( !account_number.rows[0] ){
        return next(new ErrorResponse('DELETE FALSE', 500))
    }else{
        return res.status(200).json({
            success: true,
            data: "DELETE TRUE"
        })
    }
})