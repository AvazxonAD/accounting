const pool = require("../config/db");
const asyncHandler = require("../middleware/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const return_id = require('../utils/auth/return_id')

// create partner 
exports.create_partner = asyncHandler(async (req, res, next) => {
    const user_id = await return_id(req.user)
    if (!user_id) {
        return next(new ErrorResponse('Server xatolik', 500))
    }

    const { inn, name, mfo, bank_name, account_number, treasury_account_number, contract_date, contract_number, contract_summa, smeta_number, address, partner_boss, smeta_graph, budget } = req.body

    if (!inn || !name || !mfo || !bank_name || !account_number || smeta_graph === undefined || !budget) {
        return next(new ErrorResponse('So`rovlar bosh qolishi mumkin emas', 400))
    }

    if (typeof inn !== "string" || inn.length !== 9 || typeof name !== "string" || typeof mfo !== "string" || typeof bank_name !== "string" || typeof account_number !== "string" || typeof smeta_graph !== "boolean" || typeof budget !== "string") {
        return next(new ErrorResponse('Malumotlar tog`ri kiritilishi kerak', 400))
    }

    const test = await pool.query(`SELECT * FROM partners WHERE user_id = $1 AND inn = $2`, [user_id, inn])

    if (test.rows[0]) {
        return next(new ErrorResponse('Bu kontragent avval kiritilgan', 400))
    }

    const requisite = await pool.query(`INSERT INTO partners(inn, name, mfo, bank_name, account_number, treasury_account_number, contract_date, contract_number, contract_summa, smeta_number, address, partner_boss, smeta_graph, budget, user_id) 
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
            RETURNING *     
    `, [inn, name, mfo, bank_name, account_number, treasury_account_number, contract_date, contract_number, contract_summa, smeta_number, address, partner_boss, smeta_graph, budget, user_id])

    if (!requisite.rows[0]) {
        return next(new ErrorResponse('Server xatolik', 500))
    }


    return res.status(200).json({
        success: true,
        data: "Create true"
    })
})

// get all partner 
exports.get_all_partner = asyncHandler(async (req, res, next) => {
    const user_id = await return_id(req.user)
    if (!user_id) {
        return next(new ErrorResponse('Server xatolik', 500))
    }

    let requisites = await pool.query(`SELECT id, inn, name, mfo, bank_name, account_number, treasury_account_number, contract_date, contract_number, contract_summa, smeta_number, address, partner_boss, smeta_graph, budget
        FROM partners WHERE user_id = $1 ORDER BY id`, [user_id]);
    requisites = requisites.rows

    return res.status(200).json({
        success: true,
        data: requisites
    })
})

// update  partner
exports.update_partner = asyncHandler(async (req, res, next) => {
    const user_id = await return_id(req.user)
    if (!user_id) {
        return next(new ErrorResponse('Server xatolik', 500))
    }

    const partner = await pool.query(`SELECT * FROM partners WHERE id = $1 AND user_id = $2`, [req.params.id, user_id])
    if (!partner.rows[0]) {
        return next(new ErrorResponse('Server xatolik', 500))
    }

    const { inn, name, mfo, bank_name, account_number, treasury_account_number, contract_date, contract_number, contract_summa, smeta_number, address, partner_boss, smeta_graph, budget } = req.body

    if (!inn || !name || !mfo || !bank_name || !account_number || smeta_graph === undefined || !budget) {
        return next(new ErrorResponse('So`rovlar bosh qolishi mumkin emas', 400))
    }

    if (typeof inn !== "string" || inn.length !== 9 || typeof name !== "string" || typeof mfo !== "string" || typeof bank_name !== "string" || typeof account_number !== "string" || typeof smeta_graph !== "boolean" || typeof budget !== "string") {
        return next(new ErrorResponse('Malumotlar tog`ri kiritilishi kerak', 400))
    }

    if (partner.rows[0].inn !== inn) {
        const test = await pool.query(`SELECT * FROM partners WHERE user_id = $1 AND inn = $2`, [user_id, inn])
        if (test.rows[0]) {
            return next(new ErrorResponse('Bu kontragent avval kiritilgan', 400))
        }
    }

    const result = await pool.query(`UPDATE partners SET inn = $1, name = $2, mfo = $3, bank_name = $4, account_number = $5, treasury_account_number= $6, contract_date = $7, contract_number = $8, contract_summa = $9, smeta_number = $10, address = $11, partner_boss = $12, smeta_graph = $13, budget = $14 WHERE  id = $15
        RETURNING *     
    `, [inn, name, mfo, bank_name, account_number, treasury_account_number, contract_date, contract_number, contract_summa, smeta_number, address, partner_boss, smeta_graph, budget, req.params.id])

    if (!result.rows[0]) {
        return next(new ErrorResponse('Server xatolik', 500))
    }

    return res.status(200).json({
        success: true,
        data: "Muvaffaqiyatli yangilandi"
    })
})

// delete partner
exports.delete_partner = asyncHandler(async (req, res, next) => {
    const user_id = await return_id(req.user)
    if (!user_id) {
        return next(new ErrorResponse('Server xatolik', 500))
    }

    const partner = await pool.query(`DELETE FROM partners WHERE id = $1 AND user_id = $2 RETURNING * `, [req.params.id, user_id])

    if (!partner.rows[0]) {
        return next(new ErrorResponse('DELETE FALSE', 500))
    } else {
        return res.status(200).json({
            success: true,
            data: "DELETE TRUE"
        })
    }
})

// goal create 
exports.goal_create = asyncHandler(async (req, res, next) => {
    const user_id = await return_id(req.user);

    if (!user_id) {
        return next(new ErrorResponse('Server xatolik: foydalanuvchi aniqlanmadi', 500));
    }

    const { name, short_name, schot, number, shot_status } = req.body;

    if (!name || !short_name || !schot || !number || shot_status === undefined) {
        return next(new ErrorResponse('Iltimos, barcha maydonlarni to`ldiring', 400));
    }

    if (typeof name !== "string" || typeof short_name !== "string" || typeof schot !== "string" || typeof number !== "number" || typeof shot_status !== "boolean") {
        return next(new ErrorResponse('Kiritilgan ma`lumotlar noto`g`ri formatda', 400));
    }
    const goal = await pool.query(`
            INSERT INTO goals (name, short_name, schot, number, shot_status, user_id) 
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *     
        `, [name, short_name, schot, number, shot_status, user_id]);

    if (!goal.rows[0]) {
        return next(new ErrorResponse('Server xatolik: Ma`lumotlar saqlanmadi', 500));
    }

    return res.status(201).json({
        success: true,
        data: "Ma`lumot muvaffaqiyatli saqlandi"
    });
});

// get all goal status true 
exports.get_all_goal_status_true = asyncHandler(async (req, res, next) => {
    const user_id = await return_id(req.user)
    if (!user_id) {
        return next(new ErrorResponse('Server xatolik', 500))
    }

    let goals = await pool.query(`SELECT id, name, short_name, schot, number
        FROM goals WHERE user_id = $1 AND shot_status = $2 ORDER BY id`, [user_id, true]);
        goals = goals.rows

    return res.status(200).json({
        success: true,
        data: goals
    })
})

// get all goal status false
exports.get_all_goal_status_false = asyncHandler(async (req, res, next) => {
    const user_id = await return_id(req.user)
    if (!user_id) {
        return next(new ErrorResponse('Server xatolik', 500))
    }

    let goals = await pool.query(`SELECT id, name, short_name, schot, number
        FROM goals WHERE user_id = $1 AND shot_status = $2 ORDER BY id`, [user_id, false]);
        goals = goals.rows

    return res.status(200).json({
        success: true,
        data: goals
    })
})


// update  goal
exports.update_goal = asyncHandler(async (req, res, next) => {
    const user_id = await return_id(req.user);

    if (!user_id) {
        return next(new ErrorResponse('Server xatolik: foydalanuvchi aniqlanmadi', 500));
    }

    const goal = await pool.query(`SELECT * FROM goals WHERE id = $1 AND user_id = $2`, [req.params.id, user_id])
    if (!goal.rows[0]) {
        return next(new ErrorResponse('Server xatolik', 500))
    }

    const { name, short_name, schot, number, shot_status } = req.body;

    if (!name || !short_name || !schot || !number || shot_status === undefined) {
        return next(new ErrorResponse('Iltimos, barcha maydonlarni to`ldiring', 400));
    }

    if (typeof name !== "string" || typeof short_name !== "string" || typeof schot !== "string" || typeof number !== "number" || typeof shot_status !== "boolean") {
        return next(new ErrorResponse('Kiritilgan ma`lumotlar noto`g`ri formatda', 400));
    }

    const result = await pool.query(`UPDATE goals SET name = $1, short_name = $2, schot = $3, number = $4, shot_status = $5 WHERE  id = $6
        RETURNING *     
    `, [name, short_name, schot, number, shot_status, req.params.id])

    if (!result.rows[0]) {
        return next(new ErrorResponse('Server xatolik', 500))
    }

    return res.status(200).json({
        success: true,
        data: "Muvaffaqiyatli yangilandi"
    })
})

// delete goal
exports.delete_goal = asyncHandler(async (req, res, next) => {
    const user_id = await return_id(req.user)
    if (!user_id) {
        return next(new ErrorResponse('Server xatolik', 500))
    }

    const goal = await pool.query(`DELETE FROM goals WHERE id = $1 AND user_id = $2 RETURNING * `, [req.params.id, user_id])

    if (!goal.rows[0]) {
        return next(new ErrorResponse('DELETE FALSE', 500))
    } else {
        return res.status(200).json({
            success: true,
            data: "DELETE TRUE"
        })
    }
})