const asyncHandler = require('../../middleware/asyncHandler')
const { accessValidation } = require('../../helpers/validation/auth/access.validation')
const ErrorResponse = require('../../utils/errorResponse')

const { 
    getByRoleIdAccessDB, 
    getByIdAccessDB,
    updateAccessDB
} = require('../../service/auth/access.service')

const updateAccess = asyncHandler(async (req, res, next) => {
    const { error, value } = accessValidation.validate(req.body)
    if (error) {
        return next(new ErrorResponse(error.details[0].message, 400))
    }
    const region_id = req.user.region_id 
    const access_id = req.params.id

    const test = await getByIdAccessDB(region_id, access_id)
    if(!test){
        return next(new ErrorResponse("Server xatolik. Malumot topilmadi", 404))
    }
    
    await updateAccessDB({ ...value, access_id})

    return res.status(200).json({
        success: true,
        data: "Muvaffaqiyatli yangilandi"
    })
})

const getByIdAccess = asyncHandler(async (req, res, next) => {
    const region_id = req.user.region_id
    const role_id = req.params.id
    const access = await getByRoleIdAccessDB(region_id, role_id)
   
    return res.status(200).json({
        success: true,
        data: access
    })
})

module.exports = {
    getByIdAccess,
    updateAccess
}