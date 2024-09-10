const pool = require("../../config/db");
const asyncHandler = require("../../middleware/asyncHandler");
const ErrorResponse = require("../../utils/errorResponse");
const findRequisites = require('../../utils/auth/find_requisite')
const client = require('../../config/redis.db')

// create requisite 
exports.create_requsite = asyncHandler(async (req, res, next) => {

    const { inn, name, mfo, bank_name, account_number, treasury_account_number, shot_number, budget} = req.body

    if (!inn || !name || !mfo || !bank_name || !account_number || !treasury_account_number || !shot_number || !budget) {
        return next(new ErrorResponse('So`rovlar bosh qolishi mumkin emas', 400))
    }

    if (typeof inn !== "string" || typeof name !== "string" || typeof mfo !== "string" || typeof bank_name !== "string" || typeof account_number !== "string" || typeof treasury_account_number !== "string" || typeof shot_number !== "number" || typeof budget !== "string") {
        return next(new ErrorResponse('Malumotlar tog`ri kiritilishi kerak', 400))
    }

    if(inn.length !== 9){
        return next(new ErrorResponse(''))
    }

    const requisite = await pool.query(`INSERT INTO requisites(inn, name, mfo, bank_name, account_number, treasury_account_number, shot_number, budget, user_id) 
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *     
    `, [inn, name, mfo, bank_name, account_number, treasury_account_number, shot_number, budget, req.user.id])

    if(!requisite.rows[0]){
        return next(new ErrorResponse('Server xatolik. Rekvizit topilmadi', 500))
    }

    return res.status(200).json({
        success: true,
        data: "Create true"
    })
})

// get all requisites 
exports.get_all_requisites = asyncHandler(async (req, res, next) => {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;

    if (limit <= 0 || page <= 0) {
        return next(new ErrorResponse("Limit va page musbat sonlar bo'lishi kerak", 400));
    }
    const offset = (page - 1) * limit;

    let requisites = await pool.query(`SELECT id, inn, name, mfo, bank_name, account_number, treasury_account_number, shot_number, budget, balance
        FROM requisites WHERE user_id = $1 ORDER BY id OFFSET $2 LIMIT $3`, [req.user.id, offset, limit]);
    requisites = requisites.rows

    const totalQuery = await pool.query(`SELECT COUNT(id) AS total FROM requisites WHERE user_id = $1`, [req.user.id]);
    const total = parseInt(totalQuery.rows[0].total);
    const pageCount = Math.ceil(total / limit);

    return res.status(200).json({
        success: true,
        pageCount: pageCount,
        count: total,
        currentPage: page, 
        nextPage: page >= pageCount ? null : page + 1,
        backPage: page === 1 ? null : page - 1,
        data: requisites
    })
})

// update  requisite
exports.update_requisite = asyncHandler(async (req, res, next) => {
    let requisite = await pool.query(`SELECT * FROM requisites WHERE id = $1 AND user_id = $2`, [req.params.id, req.user.id])
    requisite = requisite.rows[0]
    if(!requisite){
        return next(new ErrorResponse('Server error requisite is not defined', 500))
    }

    const { inn, name, mfo, bank_name, account_number, treasury_account_number, shot_number, budget} = req.body

    if (!inn || !name || !mfo || !bank_name || !account_number || !treasury_account_number || !shot_number || !budget) {
        return next(new ErrorResponse('So`rovlar bosh qolishi mumkin emas', 400))
    }

    if (typeof inn !== "string" || inn.length !== 9 || typeof name !== "string" || typeof mfo !== "string" || typeof bank_name !== "string" || typeof account_number !== "string" || typeof treasury_account_number !== "string" || typeof shot_number !== "number" || typeof budget !== "string") {
        return next(new ErrorResponse('Malumotlar tog`ri kiritilishi kerak', 400))
    }

    const result = await pool.query(`UPDATE requisites SET inn = $1, name = $2, mfo = $3, bank_name = $4, account_number = $5, treasury_account_number= $6, shot_number = $7, budget = $8 WHERE  id = $9
        RETURNING *     
    `, [inn, name, mfo, bank_name, account_number, treasury_account_number, shot_number, budget, req.params.id])

    if(!result.rows[0]){
        return next(new ErrorResponse('Server xatolik', 500))
    }

    return res.status(200).json({
        success: true,
        data: "Muvaffaqiyatli yangilandi"
    })
})


// delete requisite
exports.delete_counterparty = asyncHandler(async (req, res, next) => {
    const requisite = await pool.query(`DELETE FROM requisites WHERE id = $1 AND user_id = $2 RETURNING * `, [req.params.id, req.user.id])

    if (!requisite.rows[0]) {
        return next(new ErrorResponse('DELETE FALSE', 500))
    } else {
        return res.status(200).json({
            success: true,
            data: "DELETE TRUE"
        })
    }
})

// get default requisite 
exports.get_default_requisite = asyncHandler(async (req, res, next) => {   
    await client.connect()

    const key = `requisite:${req.user.id}`

    const redisRequisite = await client.get(key)
    if(redisRequisite){
        const result = JSON.parse(redisRequisite)
        await client.disconnect()
        return res.status(200).json({
            success: true, 
            data: result
        })    
    }
    let requisite = await pool.query(`SELECT id, inn, name, mfo, bank_name, account_number, treasury_account_number, shot_number, budget, balance
        FROM requisites WHERE user_id = $1 AND default_value = $2`, [req.user.id, true]);
    requisite = requisite.rows[0]

    if(requisite){
        await client.set(key, JSON.stringify(requisite))
    }

    await client.disconnect()

    return res.status(200).json({
        success: true,
        data: requisite ? requisite : null
    })
})

// change requisite by id
exports.change_requisite_by_id = asyncHandler(async (req, res, next) => {
    const requisite = await pool.query(`SELECT * FROM requisites WHERE id = $1 AND user_id = $2`, [req.params.id, req.user.id])
    if(!requisite.rows[0]){
        return next(new ErrorResponse('Server xatolik', 500))
    }

    await pool.query(`UPDATE requisites SET default_value = $1 WHERE user_id = $2`, [false, req.user.id])
    let result = await pool.query(`UPDATE requisites SET default_value = $1 WHERE user_id = $2 AND id = $3 RETURNING * `, [true, req.user.id, req.params.id])
    result = result.rows[0]
    if(!result){
        return next(new ErrorResponse('Server xatolik malumot yangilanmadi', 500))
    }

    await client.connect()

    const key = `requisite:${req.user.id}`
    await client.set(key, JSON.stringify(result))
    await client.disconnect()
    
    return res.status(200).json({
        success: true,
        data: "Muvaffaqiyatli yangilandi"
    })
})

// change requisite by button
exports.change_requisite_by_button = asyncHandler(async (req, res, next) => {
    const {right, left} = req.body
    if(!right && !left){
        return next(new ErrorResponse('So`rovlar bosh qolishi mumkin emas', 400))
    }

    if(typeof right !== "boolean" || typeof left !== "boolean"){
        return next (new ErrorResponse('Malumotlar tog`ri formatda kiritilishi kerak', 400))
    }

    const old = await pool.query(`SELECT * FROM requisites WHERE id = $1 AND user_id = $2 AND default_value = $3
    `, [req.params.id, req.user.id, true])
    if(!old.rows[0]){
        return next(new ErrorResponse('Server xatolik. Rewkvizit topilmadi', 500))
    }

    const requisite = await findRequisites(right, left, old.rows[0].id, req.user.id)

    if(!requisite){
        return next(new ErrorResponse('Rekvizit topilmadi', 500))
    }

    await pool.query(`UPDATE requisites SET default_value = $1 WHERE user_id = $2`, [false, req.user.id])
    let result = await pool.query(`UPDATE requisites SET default_value = $1 WHERE user_id = $2 AND id = $3 RETURNING * 
    `, [true, req.user.id, requisite.id])
    result = result.rows[0]

    if(!result){
        return next(new ErrorResponse("Server xatolik. Malumot yangilanmadi", 500))
    }
    
    await client.connect()

    const key = `requisite:${req.user.id}`
    await client.set(key, JSON.stringify(result))
    await client.disconnect()

    return res.status(200).json({
        success: true,
        data: "Muvaffaqiyatli yangilandi"
    })

})

// get  date 
exports.get_date = asyncHandler(async (req, res, next) => {
    await client.connect()
    const key = `date:${req.user.id}`
    const data = await client.get(key)
    await client.disconnect()
    if(data){
        const result = JSON.parse(data)
        return res.status(200).json({
            success: true,
            data: result
        })
    }else {
        return res.status(200).json({
            success: true,
            data: new Date()
        })
    }
})

// set date 
exports.set_date = asyncHandler(async (req, res, next) => {
    const { date } = req.body;
    
    if (!date) {
        return next(new ErrorResponse('So`rovlar bo`sh qolishi mumkin emas', 400));
    }

    if (typeof date !== "string") {
        return next(new ErrorResponse('Malumotlar tog`ri kiritilishi kerak', 400));
    }

    const result = { date };

    const key = `date:${req.user.id}`;

    await client.connect();

    const response = await client.set(key, JSON.stringify(result));

    if (!response) {
        return next(new ErrorResponse('Serverga saqlashda xatolik', 500));
    }

    await client.disconnect();

    return res.status(200).json({
        success: true,
        data: "Muvaffaqiyatli saqlandi"
    });
});
