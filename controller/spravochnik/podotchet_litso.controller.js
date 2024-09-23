const pool = require("../../config/db");
const asyncHandler = require("../../middleware/asyncHandler");
const ErrorResponse = require("../../utils/errorResponse");
const { checkValueString } = require('../../utils/check.functions');
const xlsx = require('xlsx');
const { getByAllPodotChet, createPodotChet, getAllPodotChet, totalPodotChet, getByIdPodotchet, updatePodotchet, deletePodotchet } = require("../../service/podotchet_lito.db");

// create 
const create = asyncHandler(async (req, res, next) => {
    let { name, rayon } = req.body;
    const user_id = req.user.region_id

    checkValueString(name, rayon)
    name = name.trim()
    rayon = rayon.trim()

    const test = await getByAllPodotChet(name, rayon, user_id)
    if (test) {
        return next(new ErrorResponse('Ushbu malumot avval kiritilgan', 409));
    }

    const result = await createPodotChet(name, rayon, user_id)
    if (!result) {
        return next(new ErrorResponse('Server xatolik. Malumot kiritilmadi', 500));
    }

    return res.status(201).json({
        success: true,
        data: "Muvafaqyatli kiritildi"
    });
});

// get all
const getAll = asyncHandler(async (req, res, next) => {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const user_id = req.user.region_id

    if (limit <= 0 || page <= 0) {
        return next(new ErrorResponse("Limit va page musbat sonlar bo'lishi kerak", 400));
    }

    const offset = (page - 1) * limit;

    const result = await getAllPodotChet(user_id, offset, limit)

    const totalQuery = await totalPodotChet(user_id)
    const total = parseInt(totalQuery.total);
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
    let { name, rayon } = req.body;

    checkValueString(name, rayon)
    name = name.trim()
    rayon = rayon.trim()

    const user_id = req.user.region_id
    const id = req.params.id

    const podotchet_litso = await getByIdPodotchet(user_id, id)
    if (!podotchet_litso) {
        return next(new ErrorResponse("Server xatolik. Podotchet_litso topilmadi", 404))
    }

    if (podotchet_litso.name !== name || podotchet_litso.rayon !== rayon) {
        const test = await getByAllPodotChet(name, rayon, user_id)
        if (test) {
            return next(new ErrorResponse('Ushbu malumot avval kiritilgan', 409));
        }
    }

    const result = await updatePodotchet(name, rayon, user_id, id)
    if (!result) {
        return next(new ErrorResponse('Server xatolik. Malumot Yangilanmadi', 500));
    }

    return res.status(201).json({
        success: true,
        data: "Muvafaqyatli yangilandi"
    });
})

// delete value
const deleteValue = asyncHandler(async (req, res, next) => {
    const user_id = req.user.region_id
    const id = req.params.id

    const value = await getByIdPodotchet(user_id, id)
    if (!value) {
        return next(new ErrorResponse('Server xatolik. Malumot topilmadi', 404))
    }

    const deleteValue = await deletePodotchet(id)

    if (!deleteValue) {
        return next(new ErrorResponse('Server xatolik. Malumot ochirilmadi', 500))
    }

    return res.status(200).json({
        success: true,
        data: "Muvaffaqiyatli ochirildi"
    })
})

// get element by id 
const getElementById = asyncHandler(async (req, res, next) => {
    const value = await getByIdPodotchet(req.user.region_id, req.params.id)
    if (!value) {
        return next(new ErrorResponse('Server error. spravochnik_podotchet_litso topilmadi'))
    }

    return res.status(200).json({
        success: true,
        data: value
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
        checkValueString(rowData.name, rowData.rayon)
        const name = rowData.name.trim()
        const rayon = rowData.rayon.trim()

        const test = await pool.query(`SELECT * FROM spravochnik_podotchet_litso WHERE user_id = $1 AND name = $2 AND rayon = $3 AND isdeleted = false`, [req.user.region_id, name, rayon])
        if (test.rows[0]) {
            return next(new ErrorResponse(`Ushbu malumot kiritilgan: ${name}`, 400));
        }

    }

    for (let rowData of data) {
        const result = await pool.query(`INSERT INTO spravochnik_podotchet_litso(name, rayon, user_id) VALUES($1, $2, $3) RETURNING *
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



module.exports = {
    getElementById,
    create,
    getAll,
    deleteValue,
    update,
    importToExcel
}