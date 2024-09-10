const pool = require("../config/db");
const asyncHandler = require("../middleware/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const return_id = require('../utils/auth/return_id')


// create revenue
exports.create_revenue = asyncHandler(async (req, res, next) => {
    const { revenues, requisite_id } = req.body;

    let requisite = await pool.query(`SELECT * FROM requisites WHERE id = $1 AND user_id = $2`, [requisite_id, req.user.id]);
    requisite = requisite.rows[0];
    if (!requisite) {
        return next(new ErrorResponse('Requisite topilmadi', 404));
    }

    for (let revenue of revenues) {

        if (!revenue.partner_id || !revenue.contract_date || !revenue.contract_summa || !revenue.contract_number || !revenue.goal_info || !revenue.goals) {
            return next(new ErrorResponse('So`rovlar bosh qolishi mumkin emas', 400));
        }

        for(let goal of revenue.goals){
            if(!goal.id || !goal){
                return next(new ErrorResponse('So`rovlar bo`sh qolishi mumkin emas', 400))
            }
        }

        if (typeof revenue.partner_id !== "number" || typeof revenue.contract_date !== "string" || typeof revenue.contract_summa !== "number" || typeof revenue.goals !== "object" || typeof revenue.contract_number !== "string" || typeof revenue.goal_info !== "string") {
            return next(new ErrorResponse('Ma`lumotlar to`g`ri kiritilishi kerak', 400));
        }

        let partner = await pool.query(`SELECT * FROM partners WHERE id = $1 AND user_id = $2`, [revenue.partner_id, req.user.id]);
        partner = partner.rows[0];
        if (!partner) {
            return next(new ErrorResponse('Partner topilmadi', 404));
        }

        for (let goal of revenue.goals) {
            let test = await pool.query(`SELECT * FROM goals WHERE id = $1 AND user_id = $2`, [goal.id, req.user.id]);
            test = test.rows[0];
            if (!goal) {
                return next(new ErrorResponse('To`lov maqsadi topilmadi', 404));
            }
        }
    }

    for (let revenue of revenues) {

        let partner = await pool.query(`SELECT * FROM partners WHERE id = $1 AND user_id = $2`, [revenue.partner_id, user_id]);
        partner = partner.rows[0];
        const result_goals = []

        for(let goal of revenue.goals){
            const goal_obj = await pool.query(`SELECT id, name, short_name, schot, shot_number FROM goals WHERE user_id = $1 AND id = $2`, [req.user.id, goal.id])
            result_goals.push(goal_obj.rows[0])
        }

        const result = await pool.query(`
            INSERT INTO revenues(
                requisite_id, 
                inn, 
                name, 
                mfo, 
                bank_name, 
                account_number, 
                treasury_account_number, 
                shot_number, 
                budget, 
                partner_id, 
                partner_name, 
                partner_bank_name, 
                partner_account_number, 
                partner_treasury_account_number, 
                partner_mfo, 
                partner_inn, 
                contract_number, 
                partner_smeta_number, 
                partner_contract_date, 
                partner_contract_summa, 
                partner_budget, 
                partner_address, 
                partner_boss, 
                partner_smeta_graph, 
                goal_info, 
                contract_date, 
                contract_summa, 
                user_id
            ) 
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28) 
            RETURNING *`,
            [
                requisite.id,
                requisite.inn,
                requisite.name,
                requisite.mfo,
                requisite.bank_name,
                requisite.account_number,
                requisite.treasury_account_number,
                requisite.shot_number,
                requisite.budget,
                partner.id,
                partner.name,
                partner.bank_name,
                partner.account_number,
                partner.mfo,
                partner.inn,
                revenue.goal_info,
                revenue.contract_date,
                revenue.contract_summa,
                req.user.id
            ]);

        if (result.rows[0]) {
            await pool.query(`UPDATE requisites SET balance = $1 WHERE user_id = $2 AND id = $3`, [Number(requisite.balance) + Number(revenue.contract_summa), req.user.id, requisite.id]);
        }
    }

    return res.status(200).json({
        success: true,
        data: "Muvaffaqiyatli pul otkazildi"
    });
});

// for create page 
exports.for_create_page = asyncHandler(async (req, res, next) => {
    const user_id = await return_id(req.user)
    if (!user_id) {
        return next(new ErrorResponse('Server xatolik', 500))
    }

    let requisite = await pool.query(`SELECT id, name, inn, bank_name, mfo, treasury_account_number, account_number, balance, shot_number, budget 
        FROM requisites WHERE user_id = $1 AND default_value = $2`, [user_id, true])
    requisite = requisite.rows[0]

    let goals = await pool.query(`SELECT id, name, short_name, schot, number FROM goals WHERE user_id = $1 AND shot_status = $2`, [user_id, true])
    goals = goals.rows

    let partners = await pool.query(`SELECT id, name, inn, bank_name, mfo, account_number
        FROM partners WHERE user_id = $1`, [user_id])
    partners = partners.rows

    return res.status(200).json({
        success: true,
        data: {
            requisite,
            goals,
            partners
        }
    })
})
