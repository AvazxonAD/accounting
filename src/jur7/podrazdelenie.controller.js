const { errorCatch } = require('../utils/errorCatch')
const { resFunc } = require('../utils/resFunc')
const { validationResponse } = require('../utils/response-for-validation')
const { podrazdelenieValidation } = require("../utils/validation");
const {
    podrazdelenieCreateService,
    getpodrazdelenieService,
    getByIdpodrazdelenieService,
    updatepodrazdelenieService,
    deletepodrazdelenieService,
    getByNamePodrazdelenieService
} = require('./podrazdelenie.service')
const { queryValidation } = require("../utils/validation");

const podrazdelenieCreate = async (req, res) => {
    try {
        const user_id = req.user.id
        const region_id = req.user.region_id
        const data = validationResponse(podrazdelenieValidation, req.body)
        await getByNamePodrazdelenieService(region_id, data.name)
        const result = await podrazdelenieCreateService({...data, user_id})
        resFunc(res, 200, result)
    } catch (error) {
        errorCatch(error, res)
    }
}

const getpodrazdelenie = async (req, res) => {
    try {
        const region_id = req.user.region_id
        const { page, limit } = validationResponse(queryValidation, req.query)
        const offset = (page - 1) * limit
        const { data, total } = await getpodrazdelenieService(region_id, offset, limit)
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

const getByIdpodrazdelenie = async (req, res) => {
    try {
        const region_id = req.user.region_id
        const id = req.params.id
        const data = await getByIdpodrazdelenieService(region_id, id, true)
        resFunc(res, 200, data)
    } catch (error) {
        errorCatch(error, res)
    }
}

const updatepodrazdelenie = async (req, res) => {
    try {
        const region_id = req.user.region_id
        const data = validationResponse(podrazdelenieValidation, req.body)
        const id = req.params.id
        const oldData = await getByIdpodrazdelenieService(region_id, id)
        if(oldData.name !== data.name){
            await getByNamePodrazdelenieService(region_id, data.name)
        }
        const result = await updatepodrazdelenieService({ ...data, id })
        resFunc(res, 200, result)
    } catch (error) {
        errorCatch(error, res)
    }
}

const deletepodrazdelenie = async (req, res) => {
    try {
        const region_id = req.user.region_id
        const id = req.params.id
        await getByIdpodrazdelenieService(region_id, id)
        await deletepodrazdelenieService(id)
        resFunc(res, 200, 'delete success true')
    } catch (error) {
        errorCatch(error, res)
    }
}

module.exports = { podrazdelenieCreate, getpodrazdelenie, getByIdpodrazdelenie, updatepodrazdelenie, deletepodrazdelenie }