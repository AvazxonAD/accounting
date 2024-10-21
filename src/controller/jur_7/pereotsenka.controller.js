const { errorCatch } = require('../../helpers/errorCatch')
const { resFunc } = require('../../helpers/resFunc')
const { validationResponse } = require('../../helpers/response-for-validation')
const { pereotsenkaValidation } = require('../../helpers/validation/jur_7/jur7.validation')
const { getByNamePereotsenkaService, pereotsenkaCreateService, getPereotssenkaService, getByIdPereotsenkaService, updatePereotsenkaService, deletePereotsenkaService } = require('../../service/jur_7/pereotsenka.service')
const { queryValidation } = require('../../helpers/validation/other/query.validation')


const pereotsenkaCreate = async (req, res) => {
    try {
        const data = validationResponse(pereotsenkaValidation, req.body)
        await getByNamePereotsenkaService(data.name)
        const result = await pereotsenkaCreateService(data)
        resFunc(res, 200, result)
    } catch (error) {
        errorCatch(error, res)
    }
}

const getPereotsenka = async (req, res) => {
    try {
        const { page, limit } = validationResponse(queryValidation, req.query)
        const offset = (page -1) * limit
        const {data, total} = await getPereotssenkaService(offset, limit)
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

const getByIdPereotsenka = async (req, res) => {
    try {
        const id = req.params.id
        const data = await getByIdPereotsenkaService(id, true)
        resFunc(res, 200, data)
    } catch (error) {
        errorCatch(error, res)
    }
}

const updatePereotsenka = async (req, res) => {
    try {
        const data = validationResponse(pereotsenkaValidation, req.body)
        const id = req.params.id
        const oldData = await getByIdPereotsenkaService(id)
        if(oldData.name !== data.name){
            await getByNamePereotsenkaService(data.name)
        }
        const result = await updatePereotsenkaService({...data, id})
        resFunc(res, 200, result)
    } catch (error) {
        errorCatch(error, res)
    }
}

const deletePereotsenka = async (req, res) => {
    try {
        const id = req.params.id
        await getByIdPereotsenkaService(id)
        await deletePereotsenkaService(id)
        resFunc(res, 200, 'delete success true')
    } catch (error) {
        errorCatch(error, res)
    }
}

module.exports = { pereotsenkaCreate, getPereotsenka, getByIdPereotsenka, updatePereotsenka, deletePereotsenka }