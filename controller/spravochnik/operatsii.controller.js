const pool = require("../../config/db");
const asyncHandler = require("../../middleware/asyncHandler");
const ErrorResponse = require("../../utils/errorResponse");
const { checkValueString } = require('../../utils/check.functions');
const xlsx  = require('xlsx')
// create 
const create = asyncHandler(async (req, res, next) => {
    let { name, schet, sub_schet, type_schet } = req.body;
    
    checkValueString(name,  schet, sub_schet, type_schet)
    name = name.trim();
    
    if(type_schet !== 'kassa_prixod' && type_schet !== 'kassa_rasxod' && type_schet !== 'bank_prixod' && type_schet !== 'bank_rasxod'){
        return next(new ErrorResponse(`type_schet notog'ri jonatildi shablonlar: kassa_prixod, kassa_rasxod, bank_prixod, bank_rasxod`, 400))
    }

    const test = await pool.query(`SELECT * FROM spravochnik_operatsii WHERE name = $1 AND type_schet = $2 AND isdeleted = false
    `, [name, type_schet]);
    if (test.rows.length > 0) {
        return next(new ErrorResponse('Ushbu malumot avval kiritilgan', 409));
    }

    const result = await pool.query(`INSERT INTO spravochnik_operatsii(
        name,  schet, sub_schet, type_schet
        ) VALUES($1, $2, $3, $4) 
        RETURNING *
    `, [name,  schet, sub_schet, type_schet]);
    if (!result.rows[0]) {
        return next(new ErrorResponse('Server xatolik. Malumot kiritilmadi', 500));
    }

    return res.status(201).json({
        success: true,
        data: "Muvafaqyatli kiritildi"
    });
});

// get all
const getAll = asyncHandler(async (req, res, next) => {
    const query = req.query.type_schet
    if(!query){
        return next(new ErrorResponse('Type_schet topilmadi', 400))
    }

    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;

    if (limit <= 0 || page <= 0) {
        return next(new ErrorResponse("Limit va page musbat sonlar bo'lishi kerak", 400));
    }

    const offset = (page - 1) * limit;
    if(!req.user.region_id){
        return next(new ErrorResponse('Siz uchun ruhsat etilmagan', 403))
    }
    
    const result = await pool.query(`SELECT id, name, schet, sub_schet, type_schet 
        FROM spravochnik_operatsii  
        WHERE isdeleted = false AND type_schet = $1 ORDER BY id
        OFFSET $2
        LIMIT $3
    `, [query, offset, limit])

    const totalQuery = await pool.query(`SELECT COUNT(id) AS total FROM spravochnik_operatsii WHERE isdeleted = false AND type_schet = $1`, [query]);
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
const update = asyncHandler(async (req, res, next) => {
    let { name, schet, sub_schet, type_schet } = req.body;
    
    checkValueString(name,  schet, sub_schet, type_schet)
    name = name.trim();
    
    if(type_schet !== 'kassa_prixod' && type_schet !== 'kassa_rasxod' && type_schet !== 'bank_prixod' && type_schet !== 'bank_rasxod'){
        return next(new ErrorResponse(`type_schet notog'ri jonatildi shablonlar: kassa_prixod, kassa_rasxod, bank_prixod, bank_rasxod`, 400))
    }

    let operatsii = await pool.query(`SELECT * FROM spravochnik_operatsii WHERE id = $1 AND isdeleted = false
        `, [req.params.id]);
    operatsii = operatsii.rows[0]
    if(!operatsii){
        return next(new ErrorResponse("Server xatolik. Operatsi topilmadi", 404))
    }

    if(operatsii.name !== name || operatsii.type_schet !== type_schet){
        const test = await pool.query(`SELECT * FROM spravochnik_operatsii WHERE name = $1 AND type_schet = $2 AND isdeleted = false
        `, [name, type_schet]);
        if (test.rows.length > 0) {
            return next(new ErrorResponse('Ushbu malumot avval kiritilgan', 409));
        }
    }

    const result = await pool.query(`UPDATE spravochnik_operatsii 
        SET name = $1, schet = $2, sub_schet = $3, type_schet = $4
        WHERE id = $5
        RETURNING *
    `, [name, schet, sub_schet, type_schet,req.params.id]);
    if (!result.rows[0]) {
        return next(new ErrorResponse('Server xatolik. Malumot Yangilanmadi', 500));
    }

    return res.status(201).json({
        success: true,
        data: "Muvafaqyatli yangilandi"
    });
})

// delete value
const deleteValue = asyncHandler(async (req, res, next) => {
    let value = await pool.query(`SELECT * FROM spravochnik_operatsii WHERE id = $1 AND isdeleted = false
    `, [req.params.id])
    value = value.rows[0]
    if(!value){
        return next(new ErrorResponse('Server xatolik. Malumot topilmadi', 404))
    }

    const deleteValue = await pool.query(`UPDATE spravochnik_operatsii SET isdeleted = $1 WHERE id = $2 RETURNING *`, [true, req.params.id])

    if(!deleteValue.rows[0]){
        return next(new ErrorResponse('Server xatolik. Malumot ochirilmadi', 500))
    }

    return res.status(200).json({
        success: true, 
        data: "Muvaffaqiyatli ochirildi"
    })
})

// import to excel 
const importToExcel = asyncHandler(async (req, res, next) => {
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

        const test = await pool.query(`SELECT * FROM spravochnik_operatsii WHERE name = $1 AND type_schet = $2 AND isdeleted = false
        `, [rowData.name, rowData.type_schet]);
        if (test.rows.length > 0) {
            return next(new ErrorResponse('Ushbu malumot avval kiritilgan', 409));
        }

    }

    for(let rowData of data){
        const result = await pool.query(`INSERT INTO spravochnik_operatsii(
            name,  schet, sub_schet, type_schet
            ) VALUES($1, $2, $3, $4) 
            RETURNING *
        `, [rowData.name,  rowData.schet, rowData.sub_schet, rowData.type_schet]);
        if (!result.rows[0]) {
            return next(new ErrorResponse('Server xatolik. Malumot kiritilmadi', 500));
        }
    }

    return res.status(200).json({
        success: true,
        data: "Muvaffaqiyatli kiritildi"
    })
})

// get element by id 
const getElementById = asyncHandler(async (req, res, next) => {
    let value = await pool.query(`SELECT * FROM spravochnik_operatsii  WHERE id = $1`, [req.params.id])
    value = value.rows[0]
    if(!value){
        return next(new ErrorResponse('Server error. Malumot topilmadi'))
    }

    return res.status(200).json({
        success: true,
        data: value
    })
})


module.exports = {
    getElementById,
    create, 
    getAll, 
    deleteValue,
    update,
    importToExcel
}