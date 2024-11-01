const {
    createDocumentJur7,
    getAllDocumentJur7,
    getDocumentJur7ById,
    updateDocumentJur7DB,
    deleteDocumentJur7DB,
} = require("./doc_prixod_jur7.service");
const { docPrixodJur7Validation, jur7PrixodValidation } = require("../utils/validation");;
const { returnAllChildSumma } = require("../utils/returnSumma");
const { validationResponse } = require("../utils/response-for-validation");
const { resFunc } = require("../utils/resFunc");
const { errorCatch } = require("../utils/errorCatch");
const { getByIdOrganizationService } = require('../spravochnik/organization/organization.service')
const { getByIdResponsibleService } = require('./responsible.service')
const { getByIdShartnomaServiceForJur7 } = require('../shartnoma/shartnoma.service')
const { getByIdNaimenovanieService } = require('./naimenovanie.service')

// doc jur7 yaratish
const docJur7Create = async (req, res) => {
    try {
        const user_id = req.user.id;
        const region_id = req.user.region_id;
        const data = validationResponse(docPrixodJur7Validation, req.body);
        await getByIdOrganizationService(region_id, data.kimdan_id)
        await getByIdResponsibleService(data.kimga_id, region_id)
        if(data.id_shartnomalar_organization){
            await getByIdShartnomaServiceForJur7(region_id, data.id_shartnomalar_organization, data.kimdan_id)
        }
        for (let child of data.childs) {
            await getByIdNaimenovanieService(region_id, child.naimenovanie_tovarov_jur7_id)
        }
        const summa = returnAllChildSumma(data.childs);
        const doc_jur7 = await createDocumentJur7({ ...data, user_id, summa });
        resFunc(res, 201, doc_jur7);
    } catch (error) {
        errorCatch(error, res);
    }
}

// barcha doc jur7 olish
const getAllDocJur7 = async (req, res) => {
    try {
        const region_id = req.user.region_id;
        const { page, limit, from, to } = validationResponse(jur7PrixodValidation, req.query);
        const offset = (page - 1) * limit;
        console.log(page, limit, from, to )
        const { data, total, summa } = await getAllDocumentJur7(region_id, from, to, offset, limit);
        const pageCount = Math.ceil(total / limit);
        const meta = {
            pageCount: pageCount,
            count: total,
            currentPage: page,
            nextPage: page >= pageCount ? null : page + 1,
            backPage: page === 1 ? null : page - 1,
            summa,
        };
        resFunc(res, 200, data, meta);
    } catch (error) {
        errorCatch(error, res);
    }
}

// doc jur7 yangilash
const updateDocJur7 = async (req, res) => {
    try {
        const region_id = req.user.region_id;
        const id = req.params.id;
        const user_id = req.user.id;
        await getDocumentJur7ById(region_id, id);
        const data = validationResponse(docPrixodJur7Validation, req.body);
        await getByIdOrganizationService(region_id, data.kimdan_id)
        await getByIdResponsibleService(data.kimga_id, region_id)
        await getByIdShartnomaServiceForJur7(region_id, data.id_shartnomalar_organization, data.kimdan_id)
        for (let child of data.childs) {
            await getByIdNaimenovanieService(region_id, child.naimenovanie_tovarov_jur7_id)
        }
        const summa = returnAllChildSumma(data.childs);
        const doc_jur7 = await updateDocumentJur7DB({ ...data, id, summa });
        resFunc(res, 200, doc_jur7);
    } catch (error) {
        errorCatch(error, res);
    }
}

// doc jur7 o'chirish
const deleteDocJur7 = async (req, res) => {
    try {
        const region_id = req.user.region_id;
        const id = req.params.id;
        await getDocumentJur7ById(region_id, id);
        await deleteDocumentJur7DB(id);
        resFunc(res, 200, 'delete success true');
    } catch (error) {
        errorCatch(error, res);
    }
}

// id bo'yicha doc jur7 olish
const getElementByIdDocJur7 = async (req, res) => {
    try {
        const region_id = req.user.region_id;
        const id = req.params.id;
        const result = await getDocumentJur7ById(region_id, id, true);
        resFunc(res, 200, result);
    } catch (error) {
        errorCatch(error, res);
    }
}

module.exports = {
    docJur7Create,
    getAllDocJur7,
    updateDocJur7,
    deleteDocJur7,
    getElementByIdDocJur7
};

