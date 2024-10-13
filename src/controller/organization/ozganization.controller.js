const { getAllMonitoring } = require("../../service/organization/organization.service");
const { organizationMonitoringValidation } = require("../../helpers/validation/other/query.validation");
const { getByIdMainSchetService } = require("../../service/spravochnik/main.schet.service");
const { errorCatch } = require("../../helpers/errorCatch");
const { validationResponse } = require("../../helpers/response-for-validation");
const { resFunc } = require("../../helpers/resFunc");


const getOrganizationMonitoring = async (req, res) => {
    try {
        const region_id = req.user.region_id
        const { page, limit, main_schet_id, from, to, spravochnik_organization_id } = validationResponse(organizationMonitoringValidation, req.query)
        const offset = (page - 1) * limit;
        await getByIdMainSchetService(region_id, main_schet_id);
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

module.exports = {
    getOrganizationMonitoring
};
