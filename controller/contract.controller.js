const asyncHandler = require("../middleware/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const pool = require('../config/db')
const { returnDate, returnStringDate } = require('../utils/date.function')

// create contract 
exports.create_contract = asyncHandler(async (req, res, next) => {
    const { contract_status, contract_number, contract_date, contract_summa, contract_info, bank_id, account_number_id, shot_id, counterparty_id } = req.body;

    if (!contract_status || !contract_number || !contract_date || !contract_summa || !contract_info) {
        return next(new ErrorResponse('So`rovlar bo`sh qolishi mumkin emas', 400));
    }

    if (typeof contract_status !== "boolean" || typeof contract_number !== "number" || typeof contract_date !== "string" || typeof contract_summa !== "number" || typeof contract_info !== "string" || typeof bank_id !== "number" || typeof account_number_id !== "number" || typeof shot_id !== "number" || typeof counterparty_id !== "number") {
        return next(new ErrorResponse('Malumotlar tog`ri formatda kiritilishi kerak', 400));
    }

    const counterparty = await pool.query(`SELECT * FROM contracts WHERE id = $1`, [counterparty_id]);
    if (!counterparty.rows[0]) {
        return next(new ErrorResponse('Server xatolik kontragent topilmadi', 400));
    }

    let shot = await pool.query(`SELECT * FROM shots WHERE id = $1 AND user_id = $2`, [shot_id, req.user.id]);
    shot = shot.rows[0];
    if (!shot) {
        return next(new ErrorResponse('Server xatolik shot topilmadi', 400));
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
            contract_status, contract_number, contract_date, contract_summa, 
            contract_info, bank_id, account_number_id, shot_id, counterparty_id, user_id
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
    `, [contract_status, contract_number, date, contract_summa, contract_info, bank_id, account_number_id, shot_id, counterparty_id, req.user.id]);

    let update_shot_balance = 0;
    if (contract_status) {
        update_shot_balance = shot.shot_balance + contract_summa;
    } else {
        update_shot_balance = shot.shot_balance - contract_summa;
    }

    await pool.query(`UPDATE shots SET shot_balance = $1 WHERE id = $2`, [update_shot_balance, shot_id]);

    return res.status(200).json({
        success: true,
        data: contract.rows[0]
    });
});

// get all contracts 
exports.getAllContracts = asyncHandler(async (req, res, next) => {
    let contracts = await pool.query(`SELECT * FROM contracts WHERE user_id = $1 ORDER BY id`, [req.user.id]);
    contracts = contracts.rows;

    if (contracts.length === 0) {
        return next(new ErrorResponse('Malumot topilmadi', 500));
    }

    const result = [];

    for (let contract of contracts) {
        const counterparty = await pool.query(`SELECT * FROM counterparties WHERE id = $1`, [contract.counterparty_id]);
        const bank = await pool.query(`SELECT * FROM banks WHERE id = $1`, [contract.bank_id]);
        const account_number = await pool.query(`SELECT * FROM account_numbers WHERE id = $1`, [contract.account_number_id]);
        const shot = await pool.query(`SELECT * FROM shots WHERE id = $1`, [contract.shot_id]);

        const object = {};
        object.contract_id = contract.id
        object.counterparty_name = counterparty.rows[0]?.name || '';
        object.counterparty_mfo = counterparty.rows[0]?.mfo || '';
        object.counterparty_bank_name = counterparty.rows[0]?.bank_name || '';
        object.counterparty_account_number = counterparty.rows[0]?.account_number || '';
        object.counterparty_inn = counterparty.rows[0]?.inn || '';
        object.bank_name = bank.rows[0]?.name || '';
        object.bank_mfo = bank.rows[0]?.mfo || '';
        object.account_number = account_number.rows[0]?.account_number || '';
        object.shot_number = shot.rows[0]?.shot_number || '';
        object.contract_number = contract.contract_number
        object.contract_date = returnStringDate(contract.contract_date)
        object.contract_summa = contract.contract_summa
        object.contract_info = contract.contract_info

        result.push(object);
    }

    return res.status(200).json({
        success: true,
        data: result
    });
});

// get element by id 
exports.getElementById = asyncHandler(async (req, res, next) => {
    let contract = await pool.query(`SELECT * FROM contracts WHERE id = $1`, [req.params.id]);
    contract = contract.rows[0];

    if (!contract) {
        return next(new ErrorResponse('Malumot topilmadi', 500));
    }

    const result = [];

    const counterparty = await pool.query(`SELECT * FROM counterparties WHERE id = $1`, [contract.counterparty_id]);
    const bank = await pool.query(`SELECT * FROM banks WHERE id = $1`, [contract.bank_id]);
    const account_number = await pool.query(`SELECT * FROM account_numbers WHERE id = $1`, [contract.account_number_id]);
    const shot = await pool.query(`SELECT * FROM shots WHERE id = $1`, [contract.shot_id]);

    const object = {};
    object.contract_id = contract.id
    object.counterparty_name = counterparty.rows[0]?.name || '';
    object.counterparty_mfo = counterparty.rows[0]?.mfo || '';
    object.counterparty_bank_name = counterparty.rows[0]?.bank_name || '';
    object.counterparty_account_number = counterparty.rows[0]?.account_number || '';
    object.counterparty_inn = counterparty.rows[0]?.inn || '';
    object.bank_name = bank.rows[0]?.name || '';
    object.bank_mfo = bank.rows[0]?.mfo || '';
    object.account_number = account_number.rows[0]?.account_number || '';
    object.shot_number = shot.rows[0]?.shot_number || '';
    object.contract_number = contract.contract_number
    object.contract_date = returnStringDate(contract.contract_date)
    object.contract_summa = contract.contract_summa
    object.contract_info = contract.contract_info

    return res.status(200).json({
        success: true,
        data: object
    });
})