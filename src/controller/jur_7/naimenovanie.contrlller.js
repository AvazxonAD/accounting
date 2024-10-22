const { errorCatch } = require('../../helpers/errorCatch');
const { resFunc } = require('../../helpers/resFunc');
const { validationResponse } = require('../../helpers/response-for-validation');
const { naimenovanieValidation } = require('../../helpers/validation/jur_7/jur7.validation');
const {
    createNaimenovanieService,
    getAllNaimenovanieService,
    getByIdNaimenovanieService,
    updateNaimenovanieService,
    deleteNaimenovanieService
} = require('../../service/jur_7/naimenovanie.service');
const { queryValidation } = require('../../helpers/validation/other/query.validation');
const { getByIdBudjetService } = require('../../service/spravochnik/budjet.name.service')
const { getByIdGroupService } = require('../../service/jur_7/group.jur7.service')

const createNaimenovanie = async (req, res) => {
    try {
        const region_id = req.user.region_id
        const user_id = req.user.id;
        const data = validationResponse(naimenovanieValidation, req.body);
        await getByIdBudjetService(data.spravochnik_budjet_name_id)
        await getByIdGroupService(region_id, data.group_jur7_id)
        const result = await createNaimenovanieService({ ...data, user_id });
        resFunc(res, 200, result);
    } catch (error) {
        errorCatch(error, res);
    }
};

const getNaimenovanie = async (req, res) => {
    try {
        const region_id = req.user.region_id
        const { page, limit } = validationResponse(queryValidation, req.query);
        const offset = (page - 1) * limit;
        const { data, total } = await getAllNaimenovanieService(region_id, offset, limit);
        const pageCount = Math.ceil(total / limit);
        const meta = {
            pageCount: pageCount,
            count: total,
            currentPage: page,
            nextPage: page >= pageCount ? null : page + 1,
            backPage: page === 1 ? null : page - 1
        };
        resFunc(res, 200, data, meta);
    } catch (error) {
        errorCatch(error, res);
    }
};

const getByIdNaimenovanie = async (req, res) => {
    try {
        const region_id = req.user.region_id
        const id = req.params.id;
        const data = await getByIdNaimenovanieService(region_id, id, true);
        resFunc(res, 200, data);
    } catch (error) {
        errorCatch(error, res);
    }
};

const updateNaimenovanie = async (req, res) => {
    try {
        const data = validationResponse(naimenovanieValidation, req.body);
        const id = req.params.id;
        const region_id = req.user.region_id
        await getByIdNaimenovanieService(region_id, id);
        const result = await updateNaimenovanieService({ ...data, id });
        resFunc(res, 200, result);
    } catch (error) {
        errorCatch(error, res);
    }
};

const deleteNaimenovanie = async (req, res) => {
    try {
        const region_id = req.user.region_id
        const id = req.params.id;
        await getByIdNaimenovanieService( region_id, id );
        await deleteNaimenovanieService(id);
        resFunc(res, 200, 'delete success true');
    } catch (error) {
        errorCatch(error, res);
    }
};

module.exports = { createNaimenovanie, getNaimenovanie, getByIdNaimenovanie, updateNaimenovanie, deleteNaimenovanie };
