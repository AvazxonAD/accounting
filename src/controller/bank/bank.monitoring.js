const asyncHandler = require("../../middleware/asyncHandler");
const ErrorResponse = require("../../utils/errorResponse");
const { getAllMonitoring } = require('../../service/bank/bank.monitoring')


const getAllBankMonitoring = asyncHandler(async (req, res, next) => {
    const main_schet_id = req.query.main_schet_id
    const region_id = req.user.region_id
    const result = await getAllMonitoring(region_id, main_schet_id)
    
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