const ErrorResponse = require('../../utils/errorResponse')
const { showServicesValidation } = require('../../helpers/validation/show.services/show.services.validation')
const { getByIdOperatsii } = require('../../service/spravochnik/operatsii.service')
const { getByIdOrganization } = require('../../service/spravochnik/organization.service')
const { getByIdShartnomaDB } = require('../../service/shartnoma/shartnoma.service')
const { getByIdPodrazlanie } = require('../../service/spravochnik/podrazdelenie.service')
const { getByIdSostav } = require('../../service/spravochnik/sostav.service')
const { getByIdtype_operatsii } = require('../../service/spravochnik/type_operatsii.service')
const { resFunc } = require('../../helpers/resFunc')
const { validationResponse } = require('../../helpers/response-for-validation')
const { 
    createChildService, 
    createRegionService
} = require('../../service/show.services/show.services.service')

const createController = async (req, res) => {
    try {
        const region_id = req.user.region_id
        const user_id = req.user.id
        const main_schet_id = req.query.main_schet_id
        const data = validationResponse(showServicesValidation, req.body)
        await getByIdOperatsii(data.spravochnik_operatsii_own_id, 'show_service')
        await getByIdOrganization(region_id, data.id_spravochnik_organization)
        if (data.shartnomalar_organization_id) {
            await getByIdShartnomaDB(region_id, main_schet_id, data.shartnomalar_organization_id)
        }
        for (let child of data.childs) {
            await getByIdOperatsii(child.spravochnik_operatsii_id)
            if (data.id_spravochnik_podrazdelenie) {
                await getByIdPodrazlanie(region_id, data.id_spravochnik_podrazdelenie)
            }
            if (data.id_spravochnik_sostav) {
                await getByIdSostav(region_id, data.id_spravochnik_sostav)
            }
            if (data.id_spravochnik_type_operatsii) {
                await getByIdtype_operatsii(region_id, data.id_spravochnik_type_operatsii)
            }
        }
        await createRegionService(data, main_schet_id, user_id)
    } catch (error) {
        resFunc(res, error.statusCode, error.message)
    }
}

module.exports = {
    createController
}