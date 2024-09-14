const pool = require("../../config/db");
const asyncHandler = require("../../middleware/asyncHandler");
const ErrorResponse = require("../../utils/errorResponse");
const returnSumma = require('../../utils/returnSumma')

// create_expense function
exports.create_expense = asyncHandler(async (req, res, next) => {
    const { partner_id, date, contract_summa, contract_number, goal_info, goal_id, position_id_1, position_id_2 } = req.body;

    if (!partner_id || !date || !contract_summa || !contract_number || !goal_info || !position_id_1 || !position_id_2) {
        return next(new ErrorResponse('So`rovlar bosh qolishi mumkin emas', 400));
    }

    if (typeof partner_id !== "number" || typeof date !== "string" || typeof contract_summa !== "number" || typeof contract_number !== "string" || typeof goal_info !== "string" || typeof position_id_1 !== "number" || typeof position_id_2 !== "number" || typeof goal_id !== "number") {
        return next(new ErrorResponse('Ma`lumotlar to`g`ri kiritilishi kerak', 400));
    }

    let requisite = await pool.query(`SELECT * FROM requisites WHERE default_value = $1 AND user_id = $2`, [true, req.user.id]);
    requisite = requisite.rows[0];
    if (!requisite) {
        return next(new ErrorResponse('Requisite topilmadi', 404));
    }

    if(requisite.balance < contract_summa || !requisite.balance){
        return next(new ErrorResponse(`Ushbu xisob raqamda: ${returnSumma(requisite.account_number)} buncha: ${returnSumma(contract_summa)} mablag' mavjud emas`, 400));
    }

    let partner = await pool.query(`SELECT * FROM partners WHERE id = $1 AND user_id = $2`, [partner_id, req.user.id]);
    partner = partner.rows[0];
    if (!partner) {
        return next(new ErrorResponse('Partner topilmadi', 404));
    }

    let position_1 = await pool.query(`SELECT * FROM positions WHERE id = $1 AND user_id = $2`, [position_id_1, req.user.id]);
    position_1 = position_1.rows[0];
    if (!position_1) {
        return next(new ErrorResponse('Position 1 topilmadi', 404));
    }

    let position_2 = await pool.query(`SELECT * FROM positions WHERE id = $1 AND user_id = $2`, [position_id_2, req.user.id]);
    position_2 = position_2.rows[0];
    if (!position_2) {
        return next(new ErrorResponse('Position 2 topilmadi', 404));
    }

    let goal = await pool.query(`SELECT * FROM goals WHERE id = $1 AND user_id = $2`, [goal_id, req.user.id]);
    goal = goal.rows[0];
    if (!goal) {
        return next(new ErrorResponse('Goal topilmadi', 404));
    }

    const result = await pool.query(`
        INSERT INTO expenses(
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
            partner_mfo, 
            partner_inn, 
            goal_id, 
            goal_info, 
            goal_short_name, 
            goal_schot, 
            goal_number, 
            position_id_1, 
            position_name_1, 
            position_fio_1, 
            position_id_2, 
            position_name_2, 
            position_fio_2, 
            contract_number, 
            date, 
            contract_summa, 
            user_id
        ) 
        VALUES(
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, 
            $21, $22, $23, $24, $25, $26, $27, $28, $29, $30
            ) 
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
        goal.id, 
        goal_info, 
        goal.short_name, 
        goal.schot, 
        goal.number, 
        position_1.id, 
        position_1.position_name, 
        position_1.fio, 
        position_2.id, 
        position_2.position_name, 
        position_2.fio, 
        contract_number, 
        date, 
        contract_summa, 
        req.user.id
    ]);

    if(result.rows[0]){
        await pool.query(`UPDATE requisites SET balance = $1 WHERE user_id = $2 AND id = $3`, [Number(requisite.balance) - Number(contract_summa), req.user.id, requisite.id]);
    }

    return res.status(200).json({
        success: true,
        data: "Muvaffaqiyatli pul o'tkazildi"
    });
});

// for create page 
exports.for_create_page = asyncHandler(async (req, res, next) => {
    let requisite = await pool.query(`
        SELECT id, name, inn, bank_name, mfo, account_number, shot_number, budget 
        FROM requisites WHERE user_id = $1 AND default_value = $2`, [req.user.id, true])
    requisite = requisite.rows[0];

    let positions = await pool.query(`
        SELECT id, position_name, fio 
        FROM positions 
        WHERE user_id = $1 AND (boss IS NULL OR boss = $2) AND (accountant IS NULL OR accountant = $3)`, 
        [req.user.id, false, false])
    positions = positions.rows;

    let goals = await pool.query(`
        SELECT id, name, short_name, schot, number 
        FROM goals WHERE user_id = $1 AND shot_status = $2`, [req.user.id, false])
    goals = goals.rows;

    let partners = await pool.query(`
        SELECT id, name, inn, bank_name, mfo, account_number 
        FROM partners WHERE user_id = $1`, [req.user.id])
    partners = partners.rows;

    const boss = await pool.query(`
        SELECT id, fio, position_name, boss 
        FROM positions WHERE user_id = $1 AND boss = $2`, [req.user.id, true]);

    const accountant = await pool.query(`
        SELECT id, fio, position_name, accountant 
        FROM positions WHERE user_id = $1 AND accountant = $2`, [req.user.id, true]);

    const default_positions = [...boss.rows, ...accountant.rows];

    return res.status(200).json({
        success: true,
        data: {
            requisite,
            default_positions,
            positions,
            goals,
            partners
        }
    });
});

