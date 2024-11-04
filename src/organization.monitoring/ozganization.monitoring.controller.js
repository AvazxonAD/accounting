const { getAllMonitoring, aktSverkaService } = require("./organization.monitoring.service");
const { organizationMonitoringValidation, aktSverkaValidation } = require("../utils/validation");;
const { getByIdMainSchetService } = require("../spravochnik/main.schet/main.schet.service");
const { errorCatch } = require("../utils/errorCatch");
const { validationResponse } = require("../utils/response-for-validation");
const { resFunc } = require("../utils/resFunc");
const { getByIdOrganizationService } = require('../spravochnik/organization/organization.service')
const { getByIdShartnomaService } = require('../shartnoma/shartnoma.service')

const getOrganizationMonitoring = async (req, res) => {
    try {
        const region_id = req.user.region_id
        const { page, limit, main_schet_id, from, to, spravochnik_organization_id } = validationResponse(organizationMonitoringValidation, req.query)
        const offset = (page - 1) * limit;
        await getByIdMainSchetService(region_id, main_schet_id);
        await getByIdOrganizationService(region_id, spravochnik_organization_id)
        const { total, data, summa_from_prixod, summa_from_rasxod, summa_to_prixod, summa_to_rasxod } = await getAllMonitoring(region_id, main_schet_id, offset, limit, from, to, spravochnik_organization_id);
        const pageCount = Math.ceil(total / limit);
        const meta = {
            pageCount: pageCount,
            count: total,
            currentPage: page,
            nextPage: page >= pageCount ? null : page + 1,
            backPage: page === 1 ? null : page - 1,
            summa_from_prixod,
            summa_from_rasxod,
            summa_to_prixod,
            summa_to_rasxod
        }
        resFunc(res, 200, data, meta)
    } catch (error) {
        errorCatch(error, res)
    }
}

const aktSverka = async (req, res) => {
    try {
        const region_id = req.user.region_id
        const { main_schet_id, shartnoma_id } = validationResponse(aktSverkaValidation, req.query)
        await getByIdMainSchetService(region_id, main_schet_id);
        await getByIdShartnomaService(region_id, main_schet_id, shartnoma_id)
        const data = await aktSverkaService(region_id, main_schet_id, shartnoma_id)
        res.end(data)
    } catch (error) {
        errorCatch(error, res)
    }
}

module.exports = {
    getOrganizationMonitoring,
    aktSverka
};
