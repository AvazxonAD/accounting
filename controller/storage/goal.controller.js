const pool = require("../../config/db");
const asyncHandler = require("../../middleware/asyncHandler");
const ErrorResponse = require("../../utils/errorResponse");
const xlsx = require('xlsx')

// goal create 
exports.goal_create = asyncHandler(async (req, res, next) => {
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
        `, [name, short_name, schot, number, shot_status, req.user.id]);

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
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;

    if (limit <= 0 || page <= 0) {
        return next(new ErrorResponse("Limit va page musbat sonlar bo'lishi kerak", 400));
    }
    const offset = (page - 1) * limit;

    let goals = await pool.query(`SELECT id, name, short_name, schot, number
        FROM goals WHERE user_id = $1 AND shot_status = $2 ORDER BY id OFFSET $3 LIMIT $4`, [req.user.id, true, offset, limit]);
    goals = goals.rows

    const totalQuery = await pool.query(`SELECT COUNT(id) AS total FROM goals WHERE user_id = $1 AND shot_status = $2`, [req.user.id, true]);
    const total = parseInt(totalQuery.rows[0].total);
    const pageCount = Math.ceil(total / limit);

    return res.status(200).json({
        success: true,
        pageCount: pageCount,
        count: total,
        currentPage: page,
        nextPage: page >= pageCount ? null : page + 1,
        backPage: page === 1 ? null : page - 1,
        data: goals
    })
})

// get all goal status false
exports.get_all_goal_status_false = asyncHandler(async (req, res, next) => {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;

    if (limit <= 0 || page <= 0) {
        return next(new ErrorResponse("Limit va page musbat sonlar bo'lishi kerak", 400));
    }
    const offset = (page - 1) * limit;

    let goals = await pool.query(`SELECT id, name, short_name, schot, number
        FROM goals WHERE user_id = $1 AND shot_status = $2 ORDER BY id OFFSET $3 LIMIT $4`, [req.user.id, false, offset, limit]);
    goals = goals.rows

    const totalQuery = await pool.query(`SELECT COUNT(id) AS total FROM goals WHERE user_id = $1 AND shot_status = $2`, [req.user.id, false]);
    const total = parseInt(totalQuery.rows[0].total);
    const pageCount = Math.ceil(total / limit);

    return res.status(200).json({
        success: true,
        pageCount: pageCount,
        count: total,
        currentPage: page,
        nextPage: page >= pageCount ? null : page + 1,
        backPage: page === 1 ? null : page - 1,
        data: goals
    })
})


// update  goal
exports.update_goal = asyncHandler(async (req, res, next) => {
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

    const result = await pool.query(`UPDATE goals SET name = $1, short_name = $2, schot = $3, number = $4, shot_status = $5 WHERE  id = $6 AND user_id = $7
        RETURNING *     
    `, [name, short_name, schot, number, shot_status, req.params.id, req.user.id])

    if (!result.rows[0]) {
        return next(new ErrorResponse('Server xatolik. Malumot yangilanmadi', 500))
    }

    return res.status(200).json({
        success: true,
        data: "Muvaffaqiyatli yangilandi"
    })
})

// delete goal
exports.delete_goal = asyncHandler(async (req, res, next) => {
    const goal = await pool.query(`DELETE FROM goals WHERE id = $1 AND user_id = $2 RETURNING * `, [req.params.id, req.user.id])

    if (!goal.rows[0]) {
        return next(new ErrorResponse('DELETE FALSE', 500))
    } else {
        return res.status(200).json({
            success: true,
            data: "DELETE TRUE"
        })
    }
})

// import to excel status true 
exports.importToExcelStatusTrue = asyncHandler(async (req, res, next) => {
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
        if (!data.name || !data.short_name || !data.schot || !data.number) {
            return next(new ErrorResponse('Iltimos, barcha maydonlarni to`ldiring', 400));
        }

        if (typeof data.name !== "string" || typeof data.short_name !== "string" || typeof data.schot !== "string" || typeof data.number !== "number") {
            return next(new ErrorResponse('Kiritilgan ma`lumotlar noto`g`ri formatda', 400));
        }
    }

    for (let data of rowData) {
        const goal = await pool.query(`
            INSERT INTO goals (name, short_name, schot, number, shot_status, user_id) 
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *     
        `, [data.name, data.short_name, data.schot, data.number, true, req.user.id]);

        if (!goal.rows[0]) {
            return next(new ErrorResponse('Server xatolik: Ma`lumotlar saqlanmadi', 500));
        }
    }

    return res.status(200).json({
        success: true,
        data: 'Muvaffaqiyatli kiritildi'
    })
})

// import to excel status false 
exports.importToExcelStatusFalse = asyncHandler(async (req, res, next) => {
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
        if (!data.name || !data.short_name || !data.schot || !data.number) {
            return next(new ErrorResponse('Iltimos, barcha maydonlarni to`ldiring', 400));
        }
    }

    for (let data of rowData) {
        if (!data.name || !data.short_name || !data.schot || !data.number) {
            continue;
        }
        const goal = await pool.query(`
            INSERT INTO goals (name, short_name, schot, number, shot_status, user_id) 
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *     
        `, [data.name, data.short_name, data.schot, data.number, false, req.user.id]);

        if (!goal.rows[0]) {
            return next(new ErrorResponse('Server xatolik: Ma`lumotlar saqlanmadi', 500));
        }
    }

    return res.status(200).json({
        success: true,
        data: 'Muvaffaqiyatli kiritildi'
    })
})