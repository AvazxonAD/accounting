const asyncHandler = require("../../middleware/asyncHandler");
const ErrorResponse = require("../../utils/errorResponse");
const pool = require('../../config/db')

// create goal 
exports.createGoal = asyncHandler(async (req, res, next) => {
    const { shot_number, info, number } = req.body
    if (!shot_number || !info || !number) {
        return next(new ErrorResponse('So`rovlar bo`sh qolishi mumkin emas'))
    }

    if (!Number.isInteger(shot_number) || typeof info !== "string" || !Number.isInteger(number)) {
        return next(new ErrorResponse('Malumotlar tog`ri formatda kiritilishi zarur', 400))
    }

    const test = await pool.query(`SELECT * FROM goals WHERE user_id = $1 AND number = $2`, [req.user.id, number])
    if (test.rows[0]) {
        return next(new ErrorResponse(`Ushbu smeta raqami avval kirtilgan: ${number}`, 400))
    }

    await pool.query(`INSERT INTO goals(shot_number, info, number, user_id) VALUES($1, $2, $3, $4)
    `, [shot_number, info, number, req.user.id])

    return res.status(200).json({
        success: true,
        data: "Muvaffaqiyatli kirtildi"
    })
})


// get all  goal 
exports.getAllGoal = asyncHandler(async (req, res, next) => {
    let goals = await pool.query(`SELECT id, shot_number, number, info FROM goals WHERE user_id = $1`, [req.user.id])
    goals = goals.rows

    return res.status(200).json({
        success: true,
        data: goals
    })
})

// update goal
exports.updateGoal = asyncHandler(async (req, res, next) => {
    let goal = await pool.query(`SELECT * FROM goals WHERE id = $1`, [req.params.id])
    goal = goal.rows[0]
    if (!goal) {
        return next(new ErrorResponse('Server xatolik', 500))
    }
    const { shot_number, info, number } = req.body
    if (!shot_number || !info || !number) {
        return next(new ErrorResponse('So`rovlar bo`sh qolishi mumkin emas'))
    }

    if (!Number.isInteger(shot_number) || typeof info !== "string" || !Number.isInteger(number)) {
        return next(new ErrorResponse('Malumotlar tog`ri formatda kiritilishi zarur', 400))
    }

    if (number !== goal.number) {
        const test = await pool.query(`SELECT * FROM goals WHERE user_id = $1 AND number = $2`, [req.user.id, number])
        if (test.rows[0]) {
            return next(new ErrorResponse(`Ushbu smeta raqami avval kirtilgan: ${number}`, 400))
        }
    }
    await pool.query(`UPDATE goals SET shot_number = $1, info = $2, number = $3 WHERE  id = $4 
    `, [shot_number, info.trim(), number, req.params.id])

    return res.status(200).json({
        success: true,
        data: "Muvaffaqiyatli kiritildi"
    })
})

// delete goal
exports.deleteGoal = asyncHandler(async (req, res, next) => {
    const goal = await pool.query(`DELETE FROM goals WHERE id = $1 RETURNING * `, [req.params.id])

    if (!goal.rows[0]) {
        return next(new ErrorResponse('DELETE FALSE', 500))
    } else {
        return res.status(200).json({
            success: true,
            data: "DELETE TRUE"
        })
    }
})