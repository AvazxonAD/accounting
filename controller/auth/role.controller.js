const pool = require("../../config/db");
const asyncHandler = require("../../middleware/asyncHandler");
const ErrorResponse = require("../../utils/errorResponse");
const { checkNotNull, checkValueString } = require('../../utils/check.functions');

// create role 
exports.createRole = asyncHandler(async (req, res, next) => {
    let { name } = req.body;

    checkNotNull(next, name);
    checkValueString(next, name)
    name = name.trim();

    if(name !== 'super_admin' && name !== 'region_admin' && name !== 'Bugalter' && name !== "Kassir"){
        return next(new ErrorResponse("Rol nomi notog`ri jonatildi", 400))
    }

    const test = await pool.query(`SELECT * FROM role WHERE name = $1`, [name]);
    if (test.rows.length > 0) {
        return next(new ErrorResponse('Ushbu malumot avval kiritilgan', 409));
    }

    const result = await pool.query(`INSERT INTO role(name) 
        VALUES($1) RETURNING *`, [name]);
    if (!result.rows[0]) {
        return next(new ErrorResponse('Server xatolik. Malumot kiritilmadi', 500));
    }

    return res.status(201).json({
        success: true,
        data: "Muvafaqyatli kiritildi"
    });
});

// get all role 
exports.getAllRole = asyncHandler(async (req, res, next) => {
    const role = await pool.query(`SELECT id, name FROM role WHERE isdeleted = false ORDER BY id`)
    return res.status(200).json({
        success: true,
        data: role.rows
    })
})

// update role 
exports.updateRole = asyncHandler(async (req, res, next) => {
    let role = await pool.query(`SELECT * FROM role WHERE id = $1`, [req.params.id])
    role = role.rows[0]
    if(!role){
        return next(new ErrorResponse('Server xatolik. Malumot topilmadi', 404))
    }

    let { name } = req.body 

    checkNotNull(next, name)
    checkValueString(next, name)
    name = name.trim()

    if(name !== 'super_admin' && name !== 'region_admin' && name !== 'Bugalter' && name !== "Kassir"){
        return next(new ErrorResponse("Rol nomi notog`ri jonatildi", 400))
    }

    if(role.name !== name){
        const test = await pool.query(`SELECT * FROM role WHERE name = $1`, [name])
        if(test.rows[0]){
            return next(new ErrorResponse('Ushbu malumot avval kiritilgan', 409))
        }
    }

    const updateRegion = await pool.query(`UPDATE role SET name = $1 WHERE id = $2 RETURNING *`, [name, req.params.id])
    if(!updateRegion.rows[0]){
        return next(new ErrorResponse('Server xatolik. Malumot yangilanmadi', 500))
    }

    return res.status(200).json({
        success: true,
        data: "Muvafaqyatli yangilandi"
    })
})

// delete role 
exports.deleteRole = asyncHandler(async (req, res, next) => {
    let role = await pool.query(`SELECT * FROM role WHERE id = $1 AND isdeleted = false`, [req.params.id])
    role = role.rows[0]
    if(!role){
        return next(new ErrorResponse('Server xatolik. Malumot topilmadi', 404))
    }

    const deleteRegion = await pool.query(`UPDATE role SET isdeleted = $1 WHERE id = $2 RETURNING *`, [true, req.params.id])

    if(!deleteRegion.rows[0]){
        return next(new ErrorResponse('Server xatolik. Malumot ochirilmadi', 500))
    }

    return res.status(200).json({
        success: true, 
        data: "Muvaffaqiyatli ochirildi"
    })
})