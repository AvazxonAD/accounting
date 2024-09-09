const asyncHandler = require('../../middleware/asyncHandler');
const ErrorResponse = require('../../utils/errorResponse');
const pool = require('../../config/db');

// position create 
exports.position_create = asyncHandler(async (req, res, next) => {
    const user_id = await return_id(req.user);

    if (!user_id) {
        return next(new ErrorResponse('Server xatolik: foydalanuvchi aniqlanmadi', 500));
    }

    const { position_name, fio, rol } = req.body;

    if (!position_name || !fio || !rol) {
        return next(new ErrorResponse('Iltimos, barcha maydonlarni to`ldiring', 400));
    }

    if (typeof position_name !== "string" || typeof fio !== "string" || typeof rol !== "string") {
        return next(new ErrorResponse('Kiritilgan ma`lumotlar noto`g`ri formatda', 400));
    }

    let workerColumn = '';
    if (rol === "Raxbar") {
        workerColumn = 'boss';
    } else if (rol === 'Bosh hisobchi') {
        workerColumn = 'accountant';
    } else if (rol === 'Kadrlar boshlugi') {
        workerColumn = 'kadr';
    } else {
        return next(new ErrorResponse('Noto`g`ri rol kiritildi', 400));
    }

    const query = `
        INSERT INTO positions (position_name, fio, ${workerColumn}, user_id) 
        VALUES ($1, $2, true, $3)
        RETURNING *
    `;

    const result = await pool.query(query, [position_name, fio, user_id]);

    if (!result.rows[0]) {
        return next(new ErrorResponse('Server xatolik: Ma`lumotlar saqlanmadi', 500));
    }

    return res.status(201).json({
        success: true,
        data: "Ma`lumot muvaffaqiyatli saqlandi"
    });
});


// get all positions
exports.get_all_positions = asyncHandler(async (req, res, next) => {
    const user_id = await return_id(req.user)
    if (!user_id) {
        return next(new ErrorResponse('Server xatolik', 500))
    }

    let result = await pool.query(`SELECT id, position_name, fio
        FROM positions WHERE user_id = $1 ORDER BY id`, [user_id]);

    result = result.rows

    return res.status(200).json({
        success: true,
        data: result
    })
})

// update  position
exports.update_position = asyncHandler(async (req, res, next) => {
    const user_id = await return_id(req.user);

    if (!user_id) {
        return next(new ErrorResponse('Server xatolik: foydalanuvchi aniqlanmadi', 500));
    }

    const { position_name, fio, rol } = req.body;

    if (!position_name || !fio || !rol) {
        return next(new ErrorResponse('Iltimos, barcha maydonlarni to`ldiring', 400));
    }

    if (typeof position_name !== "string" || typeof fio !== "string" || typeof rol !== "string") {
        return next(new ErrorResponse('Kiritilgan ma`lumotlar noto`g`ri formatda', 400));
    }

    let workerColumn = '';
    if (rol === "Raxbar") {
        workerColumn = 'boss';
    } else if (rol === 'Bosh hisobchi') {
        workerColumn = 'accountant';
    } else if (rol === 'Kadrlar boshlugi') {
        workerColumn = 'kadr';
    } else {
        return next(new ErrorResponse('Noto`g`ri rol kiritildi', 400));
    }

    // Barcha worker ustunlarini tozalash
    await pool.query(`
        UPDATE positions 
        SET boss = $1, manager = $2, kadr = $3, accountant = $4, mib = $5, inspector = $6
        WHERE id = $7 AND user_id = $8
    `, [false, false, false, false, false, false, req.params.id, user_id]);

    // Yangilangan ma'lumotlarni saqlash
    const result = await pool.query(`
        UPDATE positions 
        SET position_name = $1, fio = $2, ${workerColumn} = true
        WHERE id = $3 AND user_id = $4
        RETURNING *
    `, [position_name, fio, req.params.id, user_id]);

    if (!result.rows[0]) {
        return next(new ErrorResponse('Server xatolik: Yangilash amalga oshmadi', 500));
    }

    return res.status(200).json({
        success: true,
        data: "Muvaffaqiyatli yangilandi"
    });
});

// delete position
exports.delete_position = asyncHandler(async (req, res, next) => {
    const user_id = await return_id(req.user)
    if (!user_id) {
        return next(new ErrorResponse('Server xatolik', 500))
    }

    const position = await pool.query(`DELETE FROM positions WHERE id = $1 AND user_id = $2 RETURNING * `, [req.params.id, user_id])

    if (!position.rows[0]) {
        return next(new ErrorResponse('DELETE FALSE', 500))
    } else {
        return res.status(200).json({
            success: true,
            data: "DELETE TRUE"
        })
    }
})   