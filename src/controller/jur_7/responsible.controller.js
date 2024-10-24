const { errorCatch } = require('../../helpers/errorCatch')
const { resFunc } = require('../../helpers/resFunc')
const { validationResponse } = require('../../helpers/response-for-validation')
const { responsibleValidation } = require('../../helpers/validation/jur_7/jur7.validation')
const {
    responsibleCreateService,
    getResponsibleService,
    getByIdResponsibleService,
    updateResponsibleService,
    deleteResponsibleService
} = require('../../service/jur_7/responsible.service')
const { queryValidation } = require('../../helpers/validation/other/query.validation')
const { getByIdpodrazdelenieService } = require('../../service/jur_7/podrazdelenie.service')

const responsibleCreate = async (req, res) => {
    try {
        const user_id = req.user.id
        const region_id = req.user.region_id
        const data = validationResponse(responsibleValidation, req.body)
        await getByIdpodrazdelenieService(region_id, data.spravochnik_podrazdelenie_jur7_id)
        const result = await responsibleCreateService({ ...data, user_id })
        resFunc(res, 200, result)
    } catch (error) {
        errorCatch(error, res)
    }
}

const getResponsible = async (req, res) => {
    try {
        const region_id = req.user.region_id
        const { page, limit } = validationResponse(queryValidation, req.query)
        const offset = (page - 1) * limit
        const { data, total } = await getResponsibleService(region_id, offset, limit)
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

const getByIdResponsible = async (req, res) => {
    try {
        const region_id = req.user.region_id
        const id = req.params.id
        const data = await getByIdResponsibleService(id, region_id, true)
        resFunc(res, 200, data)
    } catch (error) {
        errorCatch(error, res)
    }
}

const updateResponsible = async (req, res) => {
    try {
        const region_id = req.user.region_id
        const data = validationResponse(responsibleValidation, req.body)
        const id = req.params.id
        const oldData = await getByIdResponsibleService(id, region_id)
        if (oldData.spravochnik_podrazdelenie_jur7_id !== data.spravochnik_podrazdelenie_jur7_id) {
            await getByIdpodrazdelenieService(region_id, data.spravochnik_podrazdelenie_jur7_id)
        }
        const result = await updateResponsibleService({ ...data, id })
        resFunc(res, 200, result)
    } catch (error) {
        errorCatch(error, res)
    }
}

const deleteResponsible = async (req, res) => {
    try {
        const region_id = req.user.region_id
        const id = req.params.id
        await getByIdResponsibleService(id, region_id)
        await deleteResponsibleService(id)
        resFunc(res, 200, 'delete success true')
    } catch (error) {
        errorCatch(error, res)
    }
}

module.exports = { responsibleCreate, getResponsible, getByIdResponsible, updateResponsible, deleteResponsible }
