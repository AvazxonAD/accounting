const pool = require("../../config/db");
const asyncHandler = require("../../middleware/asyncHandler");
const ErrorResponse = require("../../utils/errorResponse");


// create bank
exports.createBank = asyncHandler(async (req, res, next) => {
    const { name, MFO } = req.body
    if( !name || !MFO){
        return next(new ErrorResponse('So`rovlar bosh qolishi mumkin emas', 400))
    }      

    if(typeof name !== "string" || typeof MFO !== "string"){
        return next(new ErrorResponse('Malumotlar tog`ri kiritilishi kerak', 400))
    }

    if(MFO.length !== 5){
        return next(new ErrorResponse('MFO raqami 5 xonali bolishi kerak', 400))
    }

    const test = await pool.query(`SELECT * FROM banks WHERE user_id = $1 AND mfo = $2`, [req.user.id, MFO.trim()])
    if(test.rows[0]){
        return next(new ErrorResponse('Bu bank avval kiritilgan', 400))
    }

    const bank = await pool.query(`INSERT INTO banks(name, mfo, user_id) VALUES($1, $2, $3)
        RETURNING *     
    `, [name, MFO.trim(), req.user.id])

    return res.status(200).json({
        success: true,
        data: bank.rows[0]
    })
})

// get all  bank
exports.getAllBank = asyncHandler(async (req, res, next) => {
    let banks = await pool.query(`SELECT * FROM banks WHERE user_id = $1`, [req.user.id])
    banks = banks.rows
    
    if(banks.length === 0 ){
        return next(new ErrorResponse('Malumot topilmadi', 500))
    }

    return res.status(200).json({
        success: true,
        data: banks
    })
})

// update bank 
exports.updateBank = asyncHandler(async (req, res, next) => {
    let bank = await pool.query(`SELECT * FROM banks WHERE id = $1`, [req.params.id])
    bank = bank.rows[0]
    const { name, MFO } = req.body
    if( !name || !MFO){
        return next(new ErrorResponse('So`rovlar bosh qolishi mumkin emas', 400))
    }      

    if(typeof name !== "string" || typeof MFO !== "string"){
        return next(new ErrorResponse('Malumotlar tog`ri kiritilishi kerak', 400))
    }

    if(MFO.length !== 5){
        return next(new ErrorResponse('MFO raqami 5 xonali bolishi kerak', 400))
    }

    if(bank.mfo !== MFO){
        const test = await pool.query(`SELECT * FROM banks WHERE user_id = $1 AND mfo = $2`, [req.user.id, MFO.trim()])
        if(test.rows[0]){
            return next(new ErrorResponse('Bu bank avval kiritilgan', 400))
        }
    }

    const result = await pool.query(`UPDATE banks SET name = $1, mfo = $2 WHERE  id = $3 
        RETURNING *     
    `, [name, MFO.trim(), req.params.id])

    return res.status(200).json({
        success: true,
        data: result.rows[0]
    })
})

// delete bank 
exports.deleteBank = asyncHandler(async (req, res, next) => {
    const bank =  await pool.query(`DELETE FROM banks WHERE id = $1 RETURNING * `, [req.params.id])

    if( !bank.rows[0] ){
        return next(new ErrorResponse('DELETE FALSE', 500))
    }else{
        return res.status(200).json({
            success: true,
            data: "DELETE TRUE"
        })
    }
})