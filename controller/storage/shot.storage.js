const pool = require("../../config/db");
const asyncHandler = require("../../middleware/asyncHandler");
const ErrorResponse = require("../../utils/errorResponse");


// create  shot number
exports.create_shot_number = asyncHandler(async (req, res, next) => {
    const { shot_number} = req.body
    if( !shot_number ){
        return next(new ErrorResponse('So`rovlar bo`sh qolishi mumkin emas', 400))
    }      

    if( typeof shot_number !== "number"){
        return next(new ErrorResponse('Malumotlar tog`ri kiritilishi kerak', 400))
    }

    const test = await pool.query(`SELECT * FROM shots WHERE user_id = $1 AND shot_number = $2
        `, [req.user.id, shot_number])
    if(test.rows[0]){
        return next(new ErrorResponse('Ushbu shot raqami kiritilgan', 400))
    }

    const bank = await pool.query(`INSERT INTO shots(shot_number, user_id) VALUES($1, $2)
        RETURNING *     
    `, [shot_number, req.user.id])

    return res.status(200).json({
        success: true,
        data: bank.rows[0]
    })
})

// get all shot numbers 
exports.getAllShotNumbers = asyncHandler(async (req, res, next) => {
    let shots = await pool.query(`SELECT * FROM shots WHERE user_id = $1`, [req.user.id])
    shots = shots.rows
    
    if(shots.length === 0){
        return next(new ErrorResponse('Malumot topilmadi', 500))
    }
    return res.status(200).json({
        success: true,
        data: shots
    })
})

// update  shot number
exports.update_shot_number = asyncHandler(async (req, res, next) => {
    let shoNumber = await pool.query(`SELECT * FROM shots WHERE id = $1`, [req.params.id])
    shoNumber = shoNumber.rows[0]
    if(!shoNumber){
        return next(new ErrorResponse('Server xatolik', 500))
    }

    const { shot_number } = req.body
    if( !shot_number ){
        return next(new ErrorResponse('So`rovlar bosh qolishi mumkin emas', 400))
    }      

    if(typeof shot_number !== "number"){
        return next(new ErrorResponse('Malumotlar tog`ri kiritilishi kerak', 400))
    }

    const test = await pool.query(`SELECT * FROM shots WHERE user_id = $1 AND shot_number = $2`, [req.user.id, shot_number])
    if(test.rows[0]){
        return next(new ErrorResponse('Bu shot raqami avval kiritilgan', 400))
    }

    const result = await pool.query(`UPDATE shots SET shot_number = $1 WHERE  id = $2
        RETURNING *     
    `, [shot_number, req.params.id])

    return res.status(200).json({
        success: true,
        data: result.rows
    })
})

// delete shot number
exports.delete_shot_number = asyncHandler(async (req, res, next) => {
    const shot_number =  await pool.query(`DELETE FROM shots WHERE id = $1 RETURNING * `, [req.params.id])

    if( !shot_number.rows[0] ){
        return next(new ErrorResponse('DELETE FALSE', 500))
    }else{
        return res.status(200).json({
            success: true,
            data: "DELETE TRUE"
        })
    }
})