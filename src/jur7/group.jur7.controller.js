const { errorCatch } = require('../utils/errorCatch')
const { resFunc } = require('../utils/resFunc')
const { validationResponse } = require('../utils/response-for-validation')
const { groupValidation } = require("../utils/validation");
const {
    groupCreateService,
    getGroupService,
    getByIdGroupService,
    updateGroupService,
    deleteGroupService
} = require('./group.jur7.service')
const { getByIdPereotsenkaService } = require('./pereotsenka.service')
const { queryValidation } = require("../utils/validation");

const groupCreate = async (req, res) => {
    try {
        const user_id = req.user.id
        const data = validationResponse(groupValidation, req.body)
        await getByIdPereotsenkaService(data.pereotsenka_jur7_id)
        const result = await groupCreateService({...data, user_id})
        resFunc(res, 200, result)
    } catch (error) {
        errorCatch(error, res)
    }
}

const getgroup = async (req, res) => {
    try {
        const region_id = req.user.region_id
        const { page, limit } = validationResponse(queryValidation, req.query)
        const offset = (page - 1) * limit
        const { data, total } = await getGroupService(region_id, offset, limit)
        const pageCount = Math.ceil(total / limit);
        const meta = {
            pageCount: pageCount,
            count: total,
            currentPage: page,
            nextPage: page >= pageCount ? null : page + 1,
            backPage: page === 1 ? null : page - 1
        }
        resFunc(res, 200, data, meta)
    } catch (error) {
        errorCatch(error, res)
    }
}

const getByIdgroup = async (req, res) => {
    try {
        const region_id = req.user.region_id
        const id = req.params.id
        const data = await getByIdGroupService(region_id, id, true)
        resFunc(res, 200, data)
    } catch (error) {
        errorCatch(error, res)
    }
}

const updategroup = async (req, res) => {
    try {
        const region_id = req.user.region_id
        const data = validationResponse(groupValidation, req.body)
        const id = req.params.id
        await getByIdGroupService(region_id, id)
        await getByIdPereotsenkaService(data.pereotsenka_jur7_id)
        const result = await updateGroupService({ ...data, id })
        resFunc(res, 200, result)
    } catch (error) {
        errorCatch(error, res)
    }
}

const deletegroup = async (req, res) => {
    try {
        const region_id = req.user.region_id
        const id = req.params.id
        await getByIdGroupService(region_id, id)
        await deleteGroupService(id)
        resFunc(res, 200, 'delete success true')
    } catch (error) {
        errorCatch(error, res)
    }
}

module.exports = { groupCreate, getgroup, getByIdgroup, updategroup, deletegroup }