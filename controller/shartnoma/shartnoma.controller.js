const pool = require("../../config/db");
const asyncHandler = require("../../middleware/asyncHandler");
const ErrorResponse = require("../../utils/errorResponse");
const { checkValueString, checkValueNumber } = require('../../utils/check.functions');

const create = asyncHandler(async (req, res, next) => {
    let { doc_num, doc_date, summa, opisanie, smeta_id, smeta_2, spravochnik_organization_id } = req.body;

    checkValueString(doc_num, doc_date, opisanie, smeta_2);
    checkValueNumber(summa, spravochnik_organization_id);

    const test_smeta = await pool.query(`SELECT * FROM smeta WHERE id = $1 AND isdeleted = false`, [smeta_id]);
    if (!test_smeta.rows[0]) {
        return next(new ErrorResponse('Smeta topilmadi', 500));
    }

    const test_organization = await pool.query(
        `SELECT * FROM spravochnik_organization WHERE id = $1 AND isdeleted = false AND user_id = $2`,
        [spravochnik_organization_id, req.user.region_id]
    );
    if (!test_organization.rows[0]) {
        return next(new ErrorResponse('Hamkor topilmadi', 500));
    }

    let shartnoma = await pool.query(
        `INSERT INTO shartnomalar_organization(doc_num, doc_date, summa, opisanie, smeta_id, user_id, smeta_2, spravochnik_organization_id)
         VALUES($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [doc_num, doc_date, summa, opisanie, smeta_id, req.user.region_id, smeta_2, spravochnik_organization_id]
    );
    shartnoma = shartnoma.rows[0];
    if (!shartnoma) {
        return next(new ErrorResponse('Malumot kiritilmadi', 500));
    }

    await pool.query(
        `INSERT INTO shartnoma_grafik(id_shartnomalar_organization, user_id) VALUES($1, $2)`,
        [shartnoma.id, req.user.region_id]
    );

    return res.status(201).json({
        success: true,
        data: 'Muvafaqiyatli kiritildi'
    });
});

// get all
const getAll = asyncHandler(async (req, res, next) => {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;

    if (limit <= 0 || page <= 0) {
        return next(new ErrorResponse("Limit va page musbat sonlar bo'lishi kerak", 400));
    }

    const offset = (page - 1) * limit;
    if(!req.user.region_id){
        return next(new ErrorResponse('Siz uchun ruhsat etilmagan', 403))
    }
    
    const result = await pool.query(`
        SELECT 
            shartnomalar_organization.id, 
            shartnomalar_organization.doc_num, 
            shartnomalar_organization.doc_date, 
            shartnomalar_organization.summa,
            shartnomalar_organization.opisanie,
            shartnomalar_organization.smeta_id,
            shartnomalar_organization.smeta_2,
            smeta.smeta_name,
            smeta.smeta_number,
            shartnomalar_organization.spravochnik_organization_id,
            spravochnik_organization.name AS organization_name,
            spravochnik_organization.okonx,
            spravochnik_organization.bank_klient,
            spravochnik_organization.raschet_schet,
            spravochnik_organization.raschet_schet_gazna,
            spravochnik_organization.mfo,
            spravochnik_organization.inn
        FROM 
            shartnomalar_organization
        JOIN 
            smeta ON smeta.id = shartnomalar_organization.smeta_id
        JOIN 
            spravochnik_organization ON spravochnik_organization.id = shartnomalar_organization.spravochnik_organization_id
        WHERE 
            shartnomalar_organization.isdeleted = false 
            AND shartnomalar_organization.user_id = $3
        ORDER BY 
            shartnomalar_organization.id
        OFFSET $1 
        LIMIT $2
    `, [offset, limit, req.user.region_id]);
    
    const totalQuery = await pool.query(`SELECT COUNT(id) AS total FROM smeta WHERE isdeleted = false`);
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


// update shartnoma 
const update_shartnoma = asyncHandler(async (req, res, next) => {

    const shartnoma = await pool.query(`SELECT * FROM shartnomalar_organization WHERE user_id = $1 AND id = $2`, [req.user.region_id, req.params.id])
    if(!shartnoma.rows[0]){
        return next(new ErrorResponse('Server xatolik. Shartnoma topilmadi', 500))
    }

    let { doc_num, doc_date, summa, opisanie, smeta_id, smeta_2, spravochnik_organization_id } = req.body;

    checkValueString(doc_num, doc_date, opisanie, smeta_2);
    checkValueNumber(summa, spravochnik_organization_id);

    const test_smeta = await pool.query(`SELECT * FROM smeta WHERE id = $1 AND isdeleted = false`, [smeta_id]);
    if (!test_smeta.rows[0]) {
        return next(new ErrorResponse('Smeta topilmadi', 500));
    }

    const test_organization = await pool.query(
        `SELECT * FROM spravochnik_organization WHERE id = $1 AND isdeleted = false AND user_id = $2`,
        [spravochnik_organization_id, req.user.region_id]
    );
    if (!test_organization.rows[0]) {
        return next(new ErrorResponse('Hamkor topilmadi', 500));
    }

    let updateShartnoma = await pool.query(
        `UPDATE shartnomalar_organization SET 
            doc_num = $1, 
            doc_date $2, 
            summa = $3, 
            opisanie = $4, 
            smeta_id = $5, 
            smeta_2 = $6, 
            spravochnik_organization_id = $7
        WHERE id = $8
        RETURNING *`,
        [doc_num, doc_date, summa, opisanie, smeta_id, smeta_2, spravochnik_organization_id, req.params.id]
    );
    if (!updateShartnoma.rows[0]) {
        return next(new ErrorResponse('Malumot kiritilmadi', 500));
    }

    await pool.query(
        `INSERT INTO shartnoma_grafik(id_shartnomalar_organization, user_id) VALUES($1, $2)`,
        [shartnoma.id, req.user.region_id]
    );

    return res.status(201).json({
        success: true,
        data: 'Muvafaqiyatli kiritildi'
    });
})

// get element by id 
const getElementById = asyncHandler(async (req, res, next) => {
    const id = req.params.id
    if(!id){
        return next(new ErrorResponse("Server xatolik. ID topilmadi", 404))
    }

    const result = await pool.query(`
        SELECT 
            shartnomalar_organization.id, 
            shartnomalar_organization.doc_num, 
            shartnomalar_organization.doc_date, 
            shartnomalar_organization.summa,
            shartnomalar_organization.opisanie,
            shartnomalar_organization.smeta_id,
            shartnomalar_organization.smeta_2,
            smeta.smeta_name,
            smeta.smeta_number,
            shartnomalar_organization.spravochnik_organization_id,
            spravochnik_organization.name AS organization_name,
            spravochnik_organization.okonx,
            spravochnik_organization.bank_klient,
            spravochnik_organization.raschet_schet,
            spravochnik_organization.raschet_schet_gazna,
            spravochnik_organization.mfo,
            spravochnik_organization.inn
        FROM 
            shartnomalar_organization
        JOIN 
            smeta ON smeta.id = shartnomalar_organization.smeta_id
        JOIN 
            spravochnik_organization ON spravochnik_organization.id = shartnomalar_organization.spravochnik_organization_id
        WHERE 
            shartnomalar_organization.isdeleted = false 
            AND shartnomalar_organization.user_id = $1
            AND shartnomalar_organization.id = $2
    `, [ req.user.region_id, id ]);
    
    return res.status(200).json({
        success: true,
        data: result.rows[0]
    })
})

// delete shartnoma 
exports.deleteShartnoma = asyncHandler(async (req, res, next) => {
    const shartnoma = await pool.query(`SELECT * FROM shartnomalar_organization WHERE id = $1 AND user_id = $2 AND isdeleted = false
    `,[req.params.id, req.user.region_id])
    if(!shartnoma.rows[0]){
        return next(new ErrorResponse('Server xatolik. Shartnoma topilmadi',404))
    }
})

module.exports = {
    create, 
    getAll,
    getElementById
}