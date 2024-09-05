const asyncHandler = require("../middleware/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const pool = require('../config/db')
const { returnDate, returnStringDate } = require('../utils/date.function')
const returnSumma = require('../utils/returnSumma')

// create contract 
exports.create_contract = asyncHandler(async (req, res, next) => {
    const { contract_status, contract_number, contract_date, contract_summa, contract_info, counterparty_id, goal_id } = req.body;

    if (!contract_status || !contract_number || !contract_date || !contract_summa || !contract_info || !counterparty_id, !goal_id) {
        return next(new ErrorResponse('So`rovlar bo`sh qolishi mumkin emas', 400));
    }

    if (typeof contract_status !== "boolean" || typeof contract_number !== "number" || typeof contract_date !== "string" || typeof contract_summa !== "number" || typeof contract_info !== "string" || typeof counterparty_id !== "number" || typeof goal_id !== "number") {
        return next(new ErrorResponse('Malumotlar tog`ri formatda kiritilishi kerak', 400));
    }

    let counterparty = await pool.query(`SELECT * FROM counterparties WHERE id = $1 AND user_id = $2`, [counterparty_id, req.user.id]);
    counterparty = counterparty.rows[0]
    let goal = await pool.query(`SELECT * FROM goals WHERE id = $1 AND user_id = $2`, [goal_id, req.user.id])
    goal = goal.rows[0]
    if (!counterparty || !goal) {
        return next(new ErrorResponse('Server xatolik', 400));
    }

    let shot = await pool.query(`SELECT * FROM shots WHERE default_value = $1 AND user_id = $2`, [true, req.user.id]);
    shot = shot.rows[0];
    let bank = await pool.query(`SELECT * FROM banks WHERE default_value = $1 AND user_id = $2`, [true, req.user.id]);
    bank = bank.rows[0]; 
    let account_number = await pool.query(`SELECT * FROM account_numbers WHERE default_value = $1 AND user_id = $2`, [true, req.user.id]);
    account_number = account_number.rows[0];
    
    if (!shot || !bank || !account_number) {
        return next(new ErrorResponse('Rekvizitlar topilmadi', 400));
    }

    if (!contract_status) {
        if (shot.shot_balance < contract_summa) {
            return next(new ErrorResponse(`Ushbu shotda ${shot.shot_number} buncha ${contract_summa} mablag' mavjud emas`, 400));
        }
    }

    const date = returnDate(contract_date.trim());
    if (!date) {
        return next(new ErrorResponse('Sana notog`ri formatda kiritildi tog`ri format : kun.oy.yil. Masalan : 01.12.2024', 400));
    }

    const contract = await pool.query(`
        INSERT INTO contracts (
            contract_status, 
            contract_number, 
            contract_date, 
            contract_summa, 
            contract_info, 
            bank_id, 
            bank_name,
            bank_mfo,
            account_number_id,
            account_number, 
            shot_id, 
            shot_number,
            counterparty_id, 
            counterparty_name,
            counterparty_account_number,
            counterparty_inn,
            counterparty_mfo,
            counterparty_bank_name,
            goal_shot_number,
            goal_number,
            goal_info,
            user_id
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)
        RETURNING *
    `, [
        contract_status, 
        contract_number, 
        date, 
        contract_summa, 
        contract_info, 
        bank.id,
        bank.name,
        bank.mfo, 
        account_number.id,
        account_number.account_number,
        shot.id,
        shot.shot_number, 
        counterparty.id,
        counterparty.name,
        counterparty.account_number,
        counterparty.inn,
        counterparty.mfo,
        counterparty.bank_name,
        goal.shot_number,
        goal.number,
        goal.info,
        req.user.id
    ]);

    let update_shot_balance = 0;

    if (contract_status) {
        update_shot_balance = Number(shot.shot_balance) + contract_summa;
    } else {
        update_shot_balance = Number(shot.shot_balance) - contract_summa;
    }

    await pool.query(`UPDATE shots SET shot_balance = $1 WHERE id = $2`, [update_shot_balance, shot.id]);

    return res.status(200).json({
        success: true,
        data: contract.rows[0]
    });
});


// get all contracts 
exports.getAllContracts = asyncHandler(async (req, res, next) => {
    let contracts = await pool.query(`SELECT id, contract_date, contract_number, counterparty_name 
        FROM contracts WHERE user_id = $1 ORDER BY id`, [req.user.id]);
    contracts = contracts.rows;

    if (contracts.length === 0) {
        return next(new ErrorResponse('Malumot topilmadi', 500));
    }

    const result = contracts.map(contract => {
        contract.contract_date = returnStringDate(contract.contract_date)
        return contract
    })

    return res.status(200).json({
        success: true,
        data: result
    });
});

// get element by id 
exports.getElementById = asyncHandler(async (req, res, next) => {
    let contract = await pool.query(`SELECT 
        id, 
        counterparty_name, 
        counterparty_account_number, 
        counterparty_inn,
        counterparty_bank_name,  
        counterparty_mfo,
        contract_number,
        contract_date,
        contract_summa,
        contract_info,
        bank_name,
        bank_mfo,
        account_number,
        shot_number
        FROM contracts WHERE id = $1`, [req.params.id]);
    contract = contract.rows[0];

    if (!contract) {
        return next(new ErrorResponse('Malumot topilmadi', 500));
    }

    const object = {...contract};
    object.contract_date = returnStringDate(contract.contract_date)
    object.contract_summa = returnSumma(contract.contract_summa)
    
    return res.status(200).json({
        success: true,
        data: object
    });
})

// for contract 
exports.forContractCreate = asyncHandler(async (req, res, next) => {
    const user = await pool.query(`SELECT id, name, inn FROM users WHERE id = $1`, [req.user.id])
    const golas = await pool.query(`SELECT id, shot_number, number, info FROM goals WHERE user_id = $1`, [req.user.id])
    const counterparties = await pool.query(`SELECT id, account_number, bank_name, mfo, name, inn 
        FROM counterparties WHERE user_id = $1`, [req.user.id])

    return res.status(200).json({
        success: true,
        data: {
            user: user.rows[0],
            golas: golas.rows,
            counterparties: counterparties.rows
        }
    })
})