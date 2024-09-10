const pool = require("../config/db");
const asyncHandler = require("../middleware/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const return_id = require('../utils/auth/return_id')
const { returnDate } = require('../utils/date.function')

// get  result_1 
exports.get_result_1 = asyncHandler(async (req, res, next) => {
    const user_id = await return_id(req.user);
    if (!user_id) {
        return next(new ErrorResponse('Server xatolik', 500));
    }

    let { date1, date2 } = req.body

    date1 = returnDate(date1);
    date2 = returnDate(date2)
    if (!date1 || !date2) {
        return next(new ErrorResponse('Sana formati noto`g`ri kiritildi. To`g`ri format: kun.oy.yil', 400));
    }

    const default_value = await pool.query(`SELECT * FROM requisites WHERE user_id = $1 AND default_value = $2`, [user_id, true])

    const expenses = await pool.query(`SELECT * FROM expenses WHERE user_id = $1 AND createdat BEETWEN $2 AND $3 AND shot_number = $4
        `, [user_id, date1, date2, default_value.rows[0].shot_number])

    return res.status(200).json({
        success: true, 
        data: expenses.rows
    })
}) 