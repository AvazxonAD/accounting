const pool = require("../config/db");
const asyncHandler = require("../middleware/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const return_id = require('../utils/auth/return_id')
const { returnDate } = require('../utils/date.function')


// create revenue
exports.create_revenue = asyncHandler(async (req, res, next) => {
    const user_id = await return_id(req.user);
    if (!user_id) {
        return next(new ErrorResponse('Server xatolik', 500));
    }

    const { requisite_id, partner_id, contract_date, contract_summa, contract_number, goal_info, goal_id } = req.body;

    if (!requisite_id || !partner_id || !contract_date || !contract_summa || !contract_number || !goal_info) {
        return next(new ErrorResponse('So`rovlar bosh qolishi mumkin emas', 400));
    }

    if (typeof requisite_id !== "number" || typeof partner_id !== "number" || typeof contract_date !== "string" || typeof contract_summa !== "number" || typeof contract_number !== "string" || typeof goal_info !== "string") {
        return next(new ErrorResponse('Ma`lumotlar to`g`ri kiritilishi kerak', 400));
    }

    const date = returnDate(contract_date);
    if (!date) {
        return next(new ErrorResponse('Sana formati noto`g`ri kiritildi. To`g`ri format: kun.oy.yil', 400));
    }

    let requisite = await pool.query(`SELECT * FROM requisites WHERE id = $1 AND user_id = $2`, [requisite_id, user_id]);
    requisite = requisite.rows[0];
    if (!requisite) {
        return next(new ErrorResponse('Requisite topilmadi', 404));
    }

    let partner = await pool.query(`SELECT * FROM partners WHERE id = $1 AND user_id = $2`, [partner_id, user_id]);
    partner = partner.rows[0];
    if (!partner) {
        return next(new ErrorResponse('Partner topilmadi', 404));
    }

    let goal = await pool.query(`SELECT * FROM goals WHERE id = $1 AND user_id = $2`, [goal_id, user_id]);
    goal = goal.rows[0];
    if (!goal) {
        return next(new ErrorResponse('Goal topilmadi', 404));
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
            goal_id, 
            goal_info, 
            goal_short_name, 
            goal_schot, 
            goal_number, 
            contract_date, 
            contract_summa, 
            user_id
        ) 
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32) 
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
        partner.treasury_account_number, 
        partner.mfo, 
        partner.inn, 
        contract_number, 
        partner.smeta_number, 
        partner.contract_date, 
        partner.contract_summa, 
        partner.budget, 
        partner.address, 
        partner.boss, 
        partner.smeta_graph, 
        goal.id, 
        goal_info, 
        goal.short_name, 
        goal.schot, 
        goal.number,
        contract_date, 
        contract_summa, 
        user_id
    ]);

    if (result.rows[0]) {
        await pool.query(`UPDATE requisites SET balance = $1 WHERE user_id = $2 AND id = $3`, [( Number(requisite.balance) + Number(contract_summa) ), user_id, requisite.id]);
    }

    return res.status(200).json({
        success: true,
        data: "Muvaffaqiyatli pul otkazildi"
    });
});

// for create page 
exports.for_create_page = asyncHandler(async (req, res, next) => {
    const user_id = await return_id(req.user)
    if(!user_id){
        return next(new ErrorResponse('Server xatolik', 500))
    }

    let requisites = await pool.query(`SELECT id, name, inn, bank_name, mfo, treasury_account_number, account_number, balance, shot_number, budget 
        FROM requisites WHERE user_id = $1 ORDER BY default_value DESC`, [user_id])
    requisites = requisites.rows

    let requisite = await pool.query(`SELECT id, name, inn, bank_name, mfo, treasury_account_number, account_number, balance, shot_number, budget 
        FROM requisites WHERE user_id = $1 AND default_value = $2`, [user_id, true])
    requisite = requisite.rows[0]

    let goals = await pool.query(`SELECT id, name, short_name, schot, number FROM goals WHERE user_id = $1 AND shot_status = $2`, [user_id, true])
    goals = goals.rows
    
    let partners = await pool.query(`SELECT id, name, inn, bank_name, mfo, treasury_account_number, account_number, budget, contract_number, contract_date, contract_summa, smeta_number 
        FROM partners WHERE user_id = $1`, [user_id])
    partners = partners.rows

    return res.status(200).json({
        success: true,
        data: {
            requisite,
            requisites,
            goals,
            partners
        }
    })
})
