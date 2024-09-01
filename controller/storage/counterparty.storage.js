const pool = require("../../config/db");
const asyncHandler = require("../../middleware/asyncHandler");
const ErrorResponse = require("../../utils/errorResponse");


// create counterparty
exports.create_counterparty = asyncHandler(async (req, res, next) => {
    const { counterparties } = req.body
    if(!counterparties || counterparties.length === 0){
        return next(new ErrorResponse('So`rovlar bo`sh qolishi mumkin emas', 400))
    }
    
    for(let counterparty of counterparties){
        if( !counterparty.inn || !counterparty.name || !counterparty.mfo || !counterparty.bank_name || !counterparty.account_number ){
            return next(new ErrorResponse('So`rovlar bosh qolishi mumkin emas', 400))
        }      
    
        if( typeof counterparty.inn !== "string" || typeof counterparty.name !== "string" || typeof counterparty.mfo !== "string" || typeof counterparty.bank_name !== "string" || typeof counterparty.account_number !== "string"){
            return next(new ErrorResponse('Malumotlar tog`ri kiritilishi kerak', 400))
        }
    
        const test = await pool.query(`SELECT * FROM counterparties  WHERE inn = $1 AND user_id = $2
            `, [counterparty.inn, req.user.id])
        if(test.rows[0]){
            return next(new ErrorResponse('Ushbu kontragent avval kiritilgan kiritilgan', 400))
        }
    }

    for (const counterparty of counterparties) {
        await pool.query(`INSERT INTO counterparties(inn, name, mfo, bank_name, account_number, user_id) 
            VALUES($1, $2, $3, $4, $5, $6)
            RETURNING *     
        `, [counterparty.inn, counterparty.name, counterparty.mfo, counterparty.bank_name, counterparty.account_number, req.user.id])
    }

    return res.status(200).json({
        success: true,
        data: "Create true"
    })
})

// get all counterparties 
exports.get_all_counterparty = asyncHandler(async (req, res, next) => {
    let counterparties = await pool.query(`SELECT * FROM counterparties WHERE user_id = $1 ORDER BY id`, [req.user.id])
    counterparties = counterparties.rows
    
    if(counterparties.length === 0){
        return next(new ErrorResponse('Malumot topilmadi', 500))
    }
    return res.status(200).json({
        success: true,
        data: counterparties
    })
})

// update  counterparty
exports.update_counterparty = asyncHandler(async (req, res, next) => {
    let counterparty = await pool.query(`SELECT * FROM counterparties WHERE id = $1`, [req.params.id])
    counterparty = counterparty.rows[0]
    const { inn, name, mfo, bank_name, account_number } = req.body
    if( !inn || !name || !mfo || !bank_name || !account_number ){
        return next(new ErrorResponse('So`rovlar bosh qolishi mumkin emas', 400))
    }      

    if( typeof inn !== "string" || typeof name !== "string" || typeof mfo !== "string" || typeof bank_name !== "string" || typeof account_number !== "string"){
        return next(new ErrorResponse('Malumotlar tog`ri kiritilishi kerak', 400))
    }

    const test = await pool.query(`SELECT * FROM counterparties  WHERE inn = $1 AND user_id = $2
        `, [inn, req.user.id])
    if(test.rows[0]){
        return next(new ErrorResponse('Ushbu kontragent avval kiritilgan kiritilgan', 400))
    }

    const result = await pool.query(`UPDATE counterparties SET inn = $1, name = $2, mfo = $3, bank_name = $4, account_number = $5 WHERE  id = $6
        RETURNING *     
    `, [inn, name, mfo, bank_name, account_number, req.params.id])

    return res.status(200).json({
        success: true,
        data: result.rows
    })
})

// delete counterparty
exports.delete_counterparty = asyncHandler(async (req, res, next) => {
    const counterparty =  await pool.query(`DELETE FROM counterparties WHERE id = $1 RETURNING * `, [req.params.id])

    if( !counterparty.rows[0] ){
        return next(new ErrorResponse('DELETE FALSE', 500))
    }else{
        return res.status(200).json({
            success: true,
            data: "DELETE TRUE"
        })
    }
})