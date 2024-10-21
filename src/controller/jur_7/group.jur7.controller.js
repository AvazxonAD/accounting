const { errorCatch } = require('../../helpers/errorCatch')
const { resFunc } = require('../../helpers/resFunc')
const { validationResponse } = require('../../helpers/response-for-validation')
const { groupValidation } = require('../../helpers/validation/jur_7/jur7.validation')
const {
    groupCreateService,
    getGroupService,
    getByIdGroupService,
    updateGroupService,
    deleteGroupService
} = require('../../service/jur_7/group.jur7.service')
const { getByIdPereotsenkaService } = require('../../service/jur_7/pereotsenka.service')
const { queryValidation } = require('../../helpers/validation/other/query.validation')

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
        const data = await getByIdGroupService(id, region_id, true)
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
        await getByIdGroupService(id, region_id)
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
        await getByIdGroupService(id, region_id)
        await deleteGroupService(id)
        resFunc(res, 200, 'delete success true')
    } catch (error) {
        errorCatch(error, res)
    }
}

module.exports = { groupCreate, getgroup, getByIdgroup, updategroup, deletegroup }