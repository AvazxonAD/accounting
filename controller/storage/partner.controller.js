const pool = require("../../config/db");
const asyncHandler = require("../../middleware/asyncHandler");
const ErrorResponse = require("../../utils/errorResponse");
const xlsx = require('xlsx')

// create partner 
exports.create_partner = asyncHandler(async (req, res, next) => {
    const { inn, name, mfo, bank_name, account_number} = req.body

    if (!inn || !name || !mfo || !bank_name || !account_number) {
        return next(new ErrorResponse('So`rovlar bosh qolishi mumkin emas', 400))
    }

    if (typeof inn !== "string" || typeof name !== "string" || typeof mfo !== "string" || typeof bank_name !== "string" || typeof account_number !== "string") {
        return next(new ErrorResponse('Malumotlar tog`ri kiritilishi kerak', 400))
    }

    if (inn.length !== 9) {
        return next(new ErrorResponse('Inn raqami 9 xonalik bolishi kerak', 400))
    }

    if (account_number.length !== 20) {
        return next(new ErrorResponse('Inn raqami 20 xonalik bolishi kerak', 400))
    }

    const test = await pool.query(`SELECT * FROM partners WHERE user_id = $1 AND inn = $2`, [req.user.id, inn])

    if (test.rows[0]) {
        return next(new ErrorResponse('Bu kontragent avval kiritilgan', 400))
    }

    const partner = await pool.query(`INSERT INTO partners(inn, name, mfo, bank_name, account_number, user_id) 
            VALUES($1, $2, $3, $4, $5, $6)
            RETURNING *     
    `, [inn, name, mfo, bank_name, account_number, req.user.id])

    if (!partner.rows[0]) {
        return next(new ErrorResponse('Server xatolik. Malumot qoshilmadi', 500))
    }

    return res.status(200).json({
        success: true,
        data: "Create true"
    })
})

// get all partner 
exports.get_all_partner = asyncHandler(async (req, res, next) => {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;

    if (limit <= 0 || page <= 0) {
        return next(new ErrorResponse("Limit va page musbat sonlar bo'lishi kerak", 400));
    }
    const offset = (page - 1) * limit;

    let partners = await pool.query(`SELECT id, inn, name, mfo, bank_name, account_number
        FROM partners WHERE user_id = $1 ORDER BY id OFFSET $2 LIMIT $3`, [req.user.id, offset, limit]);
    partners = partners.rows

    const totalQuery = await pool.query(`SELECT COUNT(id) AS total FROM partners WHERE user_id = $1`, [req.user.id]);
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
    const partner = await pool.query(`SELECT * FROM partners WHERE id = $1 AND user_id = $2`, [req.params.id, req.user.id])
    if (!partner.rows[0]) {
        return next(new ErrorResponse('Server xatolik. Kontragent topilmadi', 500))
    }

    const { inn, name, mfo, bank_name, account_number } = req.body

    if (!inn || !name || !mfo || !bank_name || !account_number) {
        return next(new ErrorResponse('So`rovlar bosh qolishi mumkin emas', 400))
    }

    if (typeof inn !== "string" || inn.length !== 9 || typeof name !== "string" || typeof mfo !== "string" || typeof bank_name !== "string" || typeof account_number !== "string") {
        return next(new ErrorResponse('Malumotlar tog`ri kiritilishi kerak', 400))
    }

    if (partner.rows[0].inn !== inn) {
        const test = await pool.query(`SELECT * FROM partners WHERE user_id = $1 AND inn = $2`, [req.user.id, inn])
        if (test.rows[0]) {
            return next(new ErrorResponse('Bu kontragent avval kiritilgan', 400))
        }
    }

    const result = await pool.query(`UPDATE partners SET inn = $1, name = $2, mfo = $3, bank_name = $4, account_number = $5 WHERE  id = $6 AND user_id = $7
        RETURNING *     
    `, [inn, name, mfo, bank_name, account_number, req.params.id, req.user.id])

    if (!result.rows[0]) {
        return next(new ErrorResponse('Server xatolik. Malumot yangilanmadi', 500))
    }

    return res.status(200).json({
        success: true,
        data: "Muvaffaqiyatli yangilandi"
    })
})

// delete partner
exports.delete_partner = asyncHandler(async (req, res, next) => {
    const partner = await pool.query(`DELETE FROM partners WHERE id = $1 AND user_id = $2 RETURNING * `, [req.params.id, req.user.id])

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
    if (!inn) {
        return next(new ErrorResponse('So`rovlar bo`sh qolishi mumkin emas', 400))
    }

    let partner = await pool.query(`SELECT id, inn, name, mfo, bank_name, account_number
        FROM partners WHERE user_id = $1 AND inn = $2`, [req.user.id, inn]);
    partner = partner.rows[0]

    return res.status(200).json({
        success: true,
        data: partner ? partner : null
    })
})

// import to excel 
exports.importToExcel = asyncHandler(async (req, res, next) => {
    if (!req.file) {
        return next(new ErrorResponse("Fayl yuklanmadi", 400));
    }
    const filePath = req.file.path

    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const rowData = xlsx.utils.sheet_to_json(sheet, { defval: null }).map(row => {
        const newRow = {};
        for (const key in row) {
            newRow[key.trim()] = row[key] !== undefined ? row[key] : null;
        }
        return newRow;
    });

    for (let data of rowData) {
        if (!data.inn || !data.name || !data.mfo || !data.bank_name || !data.account_number) {
            return next(new ErrorResponse('So`rovlar bosh qolishi mumkin emas', 400))
        }

        if (typeof data.inn !== "number" || typeof data.name !== "string" || typeof data.mfo !== "string" || typeof data.bank_name !== "string" || typeof data.account_number !== "string") {
            return next(new ErrorResponse('Malumotlar tog`ri kiritilishi kerak', 400))
        }

        if (String(data.inn).length !== 9) {
            return next(new ErrorResponse('Inn raqami 9 xonalik bolishi kerak', 400))
        } 

        if (String(data.account_number).length !== 20) {
            return next(new ErrorResponse('Xisob raqami 20 xonalik bolishi kerak', 400))
        }

        const test = await pool.query(`SELECT * FROM partners WHERE user_id = $1 AND inn = $2`, [req.user.id, data.inn])

        if (test.rows[0]) {
            return next(new ErrorResponse(`Bu kontragent avval kiritilgan. Inn : ${data.inn}`, 400))
        }
    }

    for(let data of rowData){
        
        const partner = await pool.query(`INSERT INTO partners(inn, name, mfo, bank_name, account_number, user_id) 
            VALUES($1, $2, $3, $4, $5, $6)
            RETURNING *     
        `, [data.inn, data.name, data.mfo, data.bank_name, data.account_number, req.user.id])

        if (!partner.rows[0]) {
            return next(new ErrorResponse('Server xatolik. Malumot kiritilmadi', 500))
        }
    }
    
    return res.status(200).json({
        success: true,
        data: 'Muvaffaqiyatli kiritildi'
    })
})