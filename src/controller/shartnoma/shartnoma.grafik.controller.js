const pool = require("../../config/db");
const asyncHandler = require("../../middleware/asyncHandler");
const ErrorResponse = require("../../utils/errorResponse");
const { getByIdGrafikDB, getAllGrafikDB } = require('../../service/shartnoma/shartnoma.grafik.db')
const { getByIdMainSchet } = require('../../service/spravochnik/main.schet.db')

const updateShartnomaGrafik = asyncHandler(async (req, res, next) => {
    const region_id = req.user.region_id
    const main_schet_id = req.query.main_schet_id
    const id = req.params.id

    const grafik = await getByIdGrafikDB(region_id, main_schet_id, id)
    if (!grafik) {
        return next(new ErrorResponse("Server xatolik. Grafik topilmadi", 404))
    }
})


const getAllGrafik = asyncHandler(async (req, res, next) => {
    const region_id = req.user.region_id
    const main_schet_id = req.query.main_schet_id

    const main_schet = await getByIdMainSchet(region_id, main_schet_id)
    if(!main_schet){
        return next(new ErrorResponse("Server xatolik. main_schet topilmadi", 404))
    }

    const result = await getAllGrafikDB(region_id, main_schet_id)

    return res.status(200).json({
        success: true,
        data: result
    })
})
module.exports = {
    getAllGrafik
}