const ErrorResponse = require('../../utils/errorResponse')
const { showServicesValidation } = require('../../helpers/validation/show services/show.services.validation')
const { getByIdOperatsii } = require('../../service/spravochnik/operatsii.service')
const { getByIdOrganization } = require('../../service/spravochnik/organization.service')
const { getByIdShartnomaDB } = require('../../service/shartnoma/shartnoma.service')
const { getByIdPodrazlanie } = require('../../service/spravochnik/podrazdelenie.service')
const { getByIdSostav } = require('../../service/spravochnik/sostav.service')
const { getByIdOperatsii, getByIdtype_operatsii } = require('../../service/spravochnik/type_operatsii.service')

const createController = async () => {
    try {
        const region_id = req.user.region_id
        const { error, value } = showServicesValidation.validate(req.body)
        if (error) {
            return new ErrorResponse(error.details[0].message, 400)
        }
        const spravochnik_operatsii = await getByIdOperatsii(value.spravochnik_operatsii_own_id, 'show services')
        if (!spravochnik_operatsii) {
            return new ErrorResponse('spravochnik_operatsii is not defined', 404)
        }
        const spravochnik_organization = await getByIdOrganization(region_id, value.id_spravochnik_organization)
        if (!spravochnik_organization) {
            return new ErrorResponse('spravochnik_organization is not defined', 404)
        }
        if (value.shartnomalar_organization_id) {
            const shartnomalar_organization = await getByIdShartnomaDB(region_id, value.shartnomalar_organization_id)
            if (!shartnomalar_organization) {
                return new ErrorResponse('shartnomalar_organization is not defined', 404)
            }
        }
        for (let child of value.childs) {
            const spravochnik_operatsii = await getByIdOperatsii(child.spravochnik_operatsii_id)
            if (!spravochnik_operatsii) {
                return new ErrorResponse(`spravochnik_operatsii is not defined`, 404)
            }
            if (value.id_spravochnik_podrazdelenie) {
                const spravochnik_podrazdelenie = await getByIdPodrazlanie(region_id, value.id_spravochnik_podrazdelenie)
                if (!spravochnik_podrazdelenie) {
                    return new ErrorResponse('spravochnik_podrazdelenie is not defined', 404)
                }
            }
            if (value.id_spravochnik_sostav) {
                const spravochnik_sostav = await getByIdSostav(region_id, value.id_spravochnik_sostav)
                if (!spravochnik_sostav) {
                    return new ErrorResponse(`spravochnik_sostav is not defined`, 404)
                }
            }
            if (value.id_spravochnik_type_operatsii) {
                const spravochnik_type_operatsii = await getByIdtype_operatsii(region_id, value.id_spravochnik_type_operatsii)
                if(!spravochnik_type_operatsii){
                    return new ErrorResponse(`spravochnik_type_operatsii is not defined`, 404)
                }
            }
        }
        const summa 
    } catch (err) {
        console.log(`show services createController :  ${err}`)
        return new ErrorResponse(`show services createController :  ${err.message}`)
    }
}