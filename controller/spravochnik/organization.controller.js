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

    let { name, bank_klient, raschet_schet, raschet_schet_gazna, mfo, inn, okonx} = req.body;
    
    checkNotNull(name, bank_klient, raschet_schet, raschet_schet_gazna, mfo, inn);
    checkValueString(name, bank_klient, raschet_schet, raschet_schet_gazna, mfo, inn)
    name = name.trim();
    bank_klient = bank_klient.trim()

    const test = await pool.query(`SELECT * FROM spravochnik_organization WHERE inn = $1 AND user_id = $2 AND isdeleted = false
    `, [inn, req.user.region_id]);
    if (test.rows.length > 0) {
        return next(new ErrorResponse('Ushbu malumot avval kiritilgan', 409));
    }

    const result = await pool.query(`INSERT INTO spravochnik_organization(
        name, bank_klient, raschet_schet, 
        raschet_schet_gazna, mfo, inn, user_id, okonx
        ) VALUES($1, $2, $3, $4, $5, $6, $7, $8) 
        RETURNING *
    `, [name, bank_klient, raschet_schet, raschet_schet_gazna, mfo, inn, req.user.region_id, okonx]);
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
    
    const result = await pool.query(`SELECT id, name, bank_klient, raschet_schet, raschet_schet_gazna, mfo, inn, okonx
        FROM spravochnik_organization  
        WHERE isdeleted = false AND user_id = $1 ORDER BY id
        OFFSET $2
        LIMIT $3
    `, [req.user.region_id, offset, limit])

    const totalQuery = await pool.query(`SELECT COUNT(id) AS total FROM spravochnik_organization WHERE isdeleted = false AND user_id = $1`, [req.user.region_id]);
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

    let { name, bank_klient, raschet_schet, raschet_schet_gazna, mfo, inn , okonx} = req.body;
    
    checkNotNull(name, bank_klient, raschet_schet, raschet_schet_gazna, mfo, inn);
    checkValueString(name, bank_klient, raschet_schet, raschet_schet_gazna, mfo, inn)
    name = name.trim();
    bank_klient = bank_klient.trim()

    let partner = await pool.query(`SELECT * FROM spravochnik_organization WHERE id = $1 AND isdeleted = false`, [req.params.id])
    partner = partner.rows[0]
    if(!partner){
        return next(new ErrorResponse('Server xatolik. Hamkor topilmadi', 500))
    }

    if(partner.inn !== inn){
        const test = await pool.query(`SELECT * FROM spravochnik_organization WHERE inn = $1 AND user_id = $2 AND isdeleted = false
        `, [inn, req.user.region_id]);
        if (test.rows.length > 0) {
            return next(new ErrorResponse('Ushbu malumot avval kiritilgan', 409));
        }
    }

    const result = await pool.query(`UPDATE spravochnik_organization 
        SET name = $1, bank_klient = $2, raschet_schet = $3, raschet_schet_gazna = $4, mfo = $5, inn = $6, okonx = $9
        WHERE user_id = $7 AND id = $8
        RETURNING *
    `, [name, bank_klient, raschet_schet, raschet_schet_gazna, mfo, inn, req.user.region_id, req.params.id, okonx]);
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
    let value = await pool.query(`SELECT * FROM spravochnik_organization WHERE id = $1 AND isdeleted = false AND user_id = $2
    `, [req.params.id, req.user.region_id])
    value = value.rows[0]
    if(!value){
        return next(new ErrorResponse('Server xatolik. Malumot topilmadi', 404))
    }

    const deleteValue = await pool.query(`UPDATE spravochnik_organization SET isdeleted = $1 WHERE id = $2 RETURNING *`, [true, req.params.id])

    if(!deleteValue.rows[0]){
        return next(new ErrorResponse('Server xatolik. Malumot ochirilmadi', 500))
    }

    return res.status(200).json({
        success: true, 
        data: "Muvaffaqiyatli ochirildi"
    })
})


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
        checkNotNull(rowData.name, rowData.bank_klient, rowData.raschet_schet, rowData.raschet_schet_gazna, rowData.mfo, rowData.inn);

        const test = await pool.query(`SELECT * FROM spravochnik_organization WHERE inn = $1 AND user_id = $2 AND isdeleted = false`, [rowData.inn, req.user.region_id]);
        if (test.rows.length > 0) {
            return next(new ErrorResponse('Ushbu malumot avval kiritilgan', 409));
        }
    }

    for (let rowData of data) {
        const result = await pool.query(`INSERT INTO spravochnik_organization(
            name, bank_klient, raschet_schet, 
            raschet_schet_gazna, mfo, inn, user_id, okonx
        ) VALUES($1, $2, $3, $4, $5, $6, $7, $8) 
        RETURNING *`, 
        [rowData.name, rowData.bank_klient, rowData.raschet_schet, rowData.raschet_schet_gazna, rowData.mfo, rowData.inn, req.user.region_id, rowData.okonx]);

        if (!result.rows[0]) {
            return next(new ErrorResponse('Server xatolik. Malumot kiritilmadi', 500));
        }
    }

    return res.status(200).json({
        success: true,
        data: "Muvaffaqiyatli kiritildi"
    });
});