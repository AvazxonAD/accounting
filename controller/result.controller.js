const asyncHandler = require("../middleware/asyncHandler");
const { returnDate } = require("../utils/date.function");
const ErrorResponse = require("../utils/errorResponse");

// atchot hat
exports.atchotHat = asyncHandler(async (req, res, next) => {
    let { date1, date2 } = req.body
    if (!date1 || !date2) {
        return next(new ErrorResponse(`So'rovlar bosh qolishi mumkin emas`, 400))
    }

    date1 = returnDate(date1)
    date2 = returnDate(date2)
    if (!date1 || !date2) {
        return next(new ErrorResponse('Sana notog`ri formatda kiritildi. Tog`ri format : kun.oy.yil. Masalan : 01.12.2024', 400))
    }

    let shot = await pool.query(`SELECT * FROM shots WHERE user_id = $1, AND default_value = $2`, [req.user.id, true])
    shot = shot.rows[0]
    if (!shot) {
        return next(new ErrorResponse('Server xatolik shot topilmadi', 400))
    }
    const debit = await pool.query(`SELECT id, contract_summa, goal_shot_number 
        FROM contracts WHERE contract_status = $1 AND user_id = $2 AND contract_date BETWEEN $3 AND $4
    `, [true, req.user.id, date1, date2])
    
    const kridit = await pool.query(`SELECT id, contract_summa, goal_shot_number 
        ROM contracts WHERE contract_status = $1 AND user_id = $2 AND contract_date BETWEEN $3 AND $4
    `, [false, req.user.id, date1, date2])

    return res.status(200).json({
        success: true, 
        data: {
            debit: debit.rows,
            kridit: kridit.rows
        }
    })
})