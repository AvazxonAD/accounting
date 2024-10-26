const { accessValidation } = require("../utils/validation");
const { validationResponse } = require('../utils/response-for-validation')
const { getByIdRoleService } = require('./role.service')
const {
    getByRoleIdAccessService,
    getByIdAccessService,
    updateAccessDB
} = require('./access.service')
const { resFunc } = require('../utils/resFunc')
const { errorCatch } = require('../utils/errorCatch')

const updateAccess = async (req, res) => {
    try {
        const data = validationResponse(accessValidation, req.body)
        const region_id = req.user.region_id
        const access_id = req.params.id
        const role_id = req.query.role_id
        await getByIdAccessService(region_id, access_id, role_id)
        const result = await updateAccessDB({ ...data, access_id })
        resFunc(res, 200, result)
    } catch (error) {
        errorCatch(error, res)
    }
}

const getByIdAccess = async (req, res) => {
    try {
        const region_id = req.user.region_id
        const role_id = req.params.id
        await getByIdRoleService(role_id)
        const access = await getByRoleIdAccessService(region_id, role_id)
        resFunc(res, 200, access)
    } catch (error) {
        errorCatch(error, res)
    }
}

module.exports = {
    getByIdAccess,
    updateAccess
}