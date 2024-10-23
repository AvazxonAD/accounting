const {
    createDocumentJur7,
    createDocumentJur7Child,
    getAllDocumentJur7,
    getDocumentJur7ById,
    updateDocumentJur7DB,
    deleteDocumentJur7Child,
    deleteDocumentJur7DB,
} = require("../../service/jur_7/doc_jur7.service");
const { documentJur7Validation, queryValidation } = require("../../helpers/validation/jur_7/jur7.validation");
const { getByIdMainSchetService } = require("../../service/spravochnik/main.schet.service");
const { getByIdPodotchetService } = require("../../service/spravochnik/podotchet.litso.service");
const { getByIdOperatsiiService } = require("../../service/spravochnik/operatsii.service");
const { getByIdPodrazlanieService } = require("../../service/spravochnik/podrazdelenie.service");
const { getByIdSostavService } = require("../../service/spravochnik/sostav.service");
const { getByIdTypeOperatsiiService } = require("../../service/spravochnik/type_operatsii.service");
const { returnAllChildSumma } = require("../../utils/returnSumma");
const { validationResponse } = require("../../helpers/response-for-validation");
const { resFunc } = require("../../helpers/resFunc");
const { errorCatch } = require("../../helpers/errorCatch");
const { getByIdOrganizationService } = require('../../service/spravochnik/organization.service')
const { getByIdResponsibleService } = require('../../service/jur_7/responsible.service')
const { getByIdShartnomaServiceForJur7 } = require('../../service/shartnoma/shartnoma.service')
const { getByIdNaimenovanieService } = require('../../service/jur_7/naimenovanie.service')

// doc jur7 yaratish
const docJur7Create = async (req, res) => {
    try {
        const user_id = req.user.id;
        const region_id = req.user.region_id;
        const data = validationResponse(documentJur7Validation, req.body);
        await getByIdOrganizationService(region_id, data.kimdan_id)
        await getByIdResponsibleService(data.kimga_id, region_id)
        await getByIdShartnomaServiceForJur7(region_id, data.id_shartnomalar_organization, data.kimdan_id)
        for (let child of data.childs) {
            await getByIdNaimenovanieService(region_id, child.naimenovanie_tovarov_jur7_id)
        }
        const summa = returnAllChildSumma(data.childs);
        const doc_jur7 = await createDocumentJur7({ ...data, user_id, summa });
        const childs = [];
        for (let child of data.childs) {
            const result = await createDocumentJur7Child({ ...child, user_id, doc_jur7_id: doc_jur7.id });
            childs.push(result);
        }
        doc_jur7.childs = childs;
        resFunc(res, 201, doc_jur7);
    } catch (error) {
        errorCatch(error, res);
    }
}

// barcha doc jur7 olish
const getAllDocJur7 = async (req, res) => {
    try {
        const region_id = req.user.region_id;
        const { page, limit, from, to } = validationResponse(queryValidation, req.query);
        const offset = (page - 1) * limit;
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
        const data = validationResponse(documentJur7Validation, req.body);
        await getByIdOrganizationService(region_id, data.kimdan_id)
        await getByIdResponsibleService(data.kimga_id, region_id)
        await getByIdShartnomaServiceForJur7(region_id, data.id_shartnomalar_organization, data.kimdan_id)
        for (let child of data.childs) {
            await getByIdNaimenovanieService(region_id, child.naimenovanie_tovarov_jur7_id)
        }
        const summa = returnAllChildSumma(data.childs);
        const doc_jur7 = await updateDocumentJur7DB({ ...data, id, summa });
        await deleteDocumentJur7Child(id);
        const childs = [];
        for (let child of data.childs) {
            const result = await createDocumentJur7Child({ ...child, user_id, doc_jur7_id: doc_jur7.id });
            childs.push(result);
        }
        doc_jur7.childs = childs;
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
const { query } = require("express"); const { getByIdOrganization } = require("../spravochnik/organization.controller");
const { getByIdShartnomaService } = require("../../service/shartnoma/shartnoma.service");

