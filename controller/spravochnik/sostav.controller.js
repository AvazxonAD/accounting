const pool = require("../../config/db");
const asyncHandler = require("../../middleware/asyncHandler");
const ErrorResponse = require("../../utils/errorResponse");
const { checkNotNull, checkValueString } = require('../../utils/check.functions');
const xlsx = require('xlsx')

// create 
exports.create = asyncHandler(async (req, res, next) => {
    if(!req.user.region_id){
        return next(new ErrorResponse('Siz uchun ruhsat etilmagan', 403))
    }

    let { name, rayon } = req.body;
    
    checkNotNull(name, rayon);
    checkValueString(name, rayon)
    name = name.trim();
    rayon = rayon.trim()

    const test = await pool.query(`SELECT * FROM spravochnik_sostav WHERE name = $1 AND rayon = $2 AND user_id = $3 AND isdeleted = false
    `, [name, rayon, req.user.region_id]);
    if (test.rows.length > 0) {
        return next(new ErrorResponse('Ushbu malumot avval kiritilgan', 409));
    }

    const result = await pool.query(`INSERT INTO spravochnik_sostav(name, rayon, user_id) VALUES($1, $2, $3) RETURNING *
    `, [name, rayon, req.user.region_id]);
    if (!result.rows[0]) {
        return next(new ErrorResponse('Server xatolik. Malumot kiritilmadi', 500));
    }

    return res.status(201).json({
        success: true,
        data: "Muvafaqyatli kiritildi"
    });
});


// get all
exports.getAll = asyncHandler(async (req, res, next) => {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;

    if (limit <= 0 || page <= 0) {
        return next(new ErrorResponse("Limit va page musbat sonlar bo'lishi kerak", 400));
    }

    const offset = (page - 1) * limit;
    if(!req.user.region_id){
        return next(new ErrorResponse('Siz uchun ruhsat etilmagan', 403))
    }
    
    const result = await pool.query(`SELECT id, name, rayon FROM spravochnik_sostav  
        WHERE isdeleted = false AND user_id = $1 ORDER BY id
        OFFSET $2 
        LIMIT $3 
    `, [req.user.region_id, offset, limit])

    const totalQuery = await pool.query(`SELECT COUNT(id) AS total FROM spravochnik_sostav WHERE isdeleted = false AND user_id = $1`, [req.user.region_id]);
    const total = parseInt(totalQuery.rows[0].total);
    const pageCount = Math.ceil(total / limit);

    return res.status(200).json({
        success: true,
        pageCount: pageCount,
        count: total,
        currentPage: page, 
        nextPage: page >= pageCount ? null : page + 1,
        backPage: page === 1 ? null : page - 1,
        data: result.rows
    })
})

// update
exports.update = asyncHandler(async (req, res, next) => {
    if(!req.user.region_id){
        return next(new ErrorResponse('Siz uchun ruhsat etilmagan', 403))
    }

    let { name, rayon } = req.body;
    
   checkNotNull(name, rayon);
    checkValueString( name, rayon)
    name = name.trim();
    rayon = rayon.trim()

    const test = await pool.query(`SELECT * FROM spravochnik_sostav WHERE name = $1 AND rayon = $2 AND user_id = $3 AND isdeleted = false
    `, [name, rayon, req.user.region_id]);
    if (test.rows.length > 0) {
        return next(new ErrorResponse('Ushbu malumot avval kiritilgan', 409));
    }

    const result = await pool.query(`UPDATE  spravochnik_sostav SET name = $1, rayon = $2
        WHERE user_id = $3 AND id = $4
        RETURNING *
    `, [name, rayon, req.user.region_id, req.params.id]);
    if (!result.rows[0]) {
        return next(new ErrorResponse('Server xatolik. Malumot Yangilanmadi', 500));
    }

    return res.status(201).json({
        success: true,
        data: "Muvafaqyatli yangilandi"
    });
})

// delete value
exports.deleteValue = asyncHandler(async (req, res, next) => {
    let value = await pool.query(`SELECT * FROM spravochnik_sostav WHERE id = $1 AND isdeleted = false AND user_id = $2
    `, [req.params.id, req.user.region_id])
    value = value.rows[0]
    if(!value){
        return next(new ErrorResponse('Server xatolik. Malumot topilmadi', 404))
    }

    const deleteValue = await pool.query(`UPDATE spravochnik_sostav SET isdeleted = $1 WHERE id = $2 RETURNING *`, [true, req.params.id])

    if(!deleteValue.rows[0]){
        return next(new ErrorResponse('Server xatolik. Malumot ochirilmadi', 500))
    }

    return res.status(200).json({
        success: true, 
        data: "Muvaffaqiyatli ochirildi"
    })
})

// import to excel 
exports.importToExcel = asyncHandler(async (req, res, next) => {
    if (!req.file) {
        return next(new ErrorResponse("Fayl yuklanmadi", 400));
    }
    
    const filePath = req.file.path;
    
    const workbook = xlsx.readFile(filePath);
    
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    
    const data = xlsx.utils.sheet_to_json(sheet).map(row => {
        const newRow = {};
        for (const key in row) {
            newRow[key.trim()] = row[key];
        }
        return newRow;
    });

    for (const rowData of data) {
        checkNotNull(rowData.name, rowData.rayon)
        checkValueString(rowData.name, rowData.rayon)
        const name = rowData.name.trim()
        const rayon = rowData.rayon.trim()

        const test = await pool.query(`SELECT * FROM spravochnik_sostav WHERE user_id = $1 AND name = $2 AND rayon = $3 AND isdeleted = false`, [req.user.region_id, name, rayon])
        if (test.rows[0]) {
            return next(new ErrorResponse(`Ushbu malumot kiritilgan: ${name}`, 400));
        }

    }

    for(let rowData of data){
        const result = await pool.query(`INSERT INTO spravochnik_sostav(name, rayon, user_id) VALUES($1, $2, $3) RETURNING *
        `, [rowData.name, rowData.rayon, req.user.region_id]);
        if (!result.rows[0]) {
            return next(new ErrorResponse('Server xatolik. Malumot kiritilmadi', 500));
        }
    }

    return res.status(200).json({
        success: true,
        data: "Muvaffaqiyatli kiritildi"
    })
})