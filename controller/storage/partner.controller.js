const pool = require("../../config/db");
const asyncHandler = require("../../middleware/asyncHandler");
const ErrorResponse = require("../../utils/errorResponse");
const return_id = require('../../utils/auth/return_id')

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

    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;

    if (limit <= 0 || page <= 0) {
        return next(new ErrorResponse("Limit va page musbat sonlar bo'lishi kerak", 400));
    }
    const offset = (page - 1) * limit;

    let partners = await pool.query(`SELECT id, inn, name, mfo, bank_name, account_number, treasury_account_number, contract_date, contract_number, contract_summa, smeta_number, address, partner_boss, smeta_graph, budget
        FROM partners WHERE user_id = $1 ORDER BY id OFFSET $2 LIMIT $3`, [user_id, offset, limit]);
    partners = partners.rows

    const totalQuery = await pool.query(`SELECT COUNT(id) AS total FROM partners WHERE user_id = $1`, [user_id]);
    const total = parseInt(totalQuery.rows[0].total);
    const pageCount = Math.ceil(total / limit);

    return res.status(200).json({
        success: true,
        pageCount: pageCount,
        count: total,
        currentPage: page, 
        nextPage: page >= pageCount ? null : page + 1,
        backPage: page === 1 ? null : page - 1,
        data: partners
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

// search partner by inn 
exports.search_partner_by_inn = asyncHandler(async (req, res, next) => {
    const { inn } = req.body
    if(!inn){
        return next(new ErrorResponse('So`rovlar bo`sh qolishi mumkin emas', 400))
    }

    const user_id = await return_id(req.user)
    if (!user_id) {
        return next(new ErrorResponse('Server xatolik', 500))
    }

    let partner = await pool.query(`SELECT id, inn, name, mfo, bank_name, account_number, treasury_account_number, contract_date, contract_number, contract_summa, smeta_number, address, partner_boss, smeta_graph, budget
        FROM partners WHERE user_id = $1 AND inn = $2`, [user_id, inn]);
        partner = partner.rows[0]

    return res.status(200).json({
        success: true,
        data: partner ? partner : null
    })
})
