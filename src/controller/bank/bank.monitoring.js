const asyncHandler = require("../../middleware/asyncHandler");
const ErrorResponse = require("../../utils/errorResponse");
const {
    getAllMonitoring,
    getAllByFromMonitoring,
    getAllByToMonitoring,
    getAllByFromAndToMonitoring
} = require('../../service/bank/bank.monitoring')


const getAllBankMonitoring = asyncHandler(async (req, res, next) => {
    let result = null
    const main_schet_id = req.query.main_schet_id
    const region_id = req.user.region_id
    const { from, to } = req.query
    if (!from && !to) {
        result = await getAllMonitoring(region_id, main_schet_id)
    }
    if (!from && !to) {
        result = await getAllByFromMonitoring(region_id, main_schet_id, from)
    }
    if(from && !to){
        result = await getAllByToMonitoring(region_id, main_schet_id, to)
    }
    if(from && to){
        result = await getAllByFromAndToMonitoring(region_id, main_schet_id, from, to)
    }

    return res.status(200).json({
        success: true,
        meta: {
            total_sum: result.total_sum,
            prixod_sum: result.prixod_sum,
            rasxod_sum: result.rasxod_sum
        },
        data: result.rows
    })
})


module.exports = {
    getAllBankMonitoring
}