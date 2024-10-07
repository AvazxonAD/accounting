const ErrorResponse = require('../../utils/errorResponse')
const { showServicesValidation } = require('../../helpers/validation/show.services/show.services.validation')
const { getByIdOperatsii } = require('../../service/spravochnik/operatsii.service')
const { getByIdOrganization } = require('../../service/spravochnik/organization.service')
const { getByIdShartnomaService } = require('../../service/shartnoma/shartnoma.service')
const { getByIdPodrazlanie } = require('../../service/spravochnik/podrazdelenie.service')
const { getByIdSostav } = require('../../service/spravochnik/sostav.service')
const { getByIdtype_operatsii } = require('../../service/spravochnik/type_operatsii.service')
const { resFunc } = require('../../helpers/resFunc')
const { validationResponse } = require('../../helpers/response-for-validation')
const { errorCatch } = require('../../helpers/errorCatch')
const { getByIdMainSchet } = require('../../service/spravochnik/main.schet.service')
const {
    createShowServiceChildService,
    createShowServiceService,
    getShowServiceService
} = require('../../service/show.services/show.services.service')
const { returnAllChildSumma } = require('../../utils/returnSumma')

const createController = async (req, res) => {
    try {
        const region_id = req.user.region_id
        const user_id = req.user.id
        const main_schet_id = req.query.main_schet_id
        const data = validationResponse(showServicesValidation, req.body)
        await getByIdMainSchet(region_id, main_schet_id)
        await getByIdOperatsii(data.spravochnik_operatsii_own_id, 'show_service')
        await getByIdOrganization(region_id, data.id_spravochnik_organization)
        if (data.shartnomalar_organization_id) {
            await getByIdShartnomaService(region_id, main_schet_id, data.shartnomalar_organization_id, data.id_spravochnik_organization)
        }
        for (let child of data.childs) {
            await getByIdOperatsii(child.spravochnik_operatsii_id, 'show_service')
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
        const summa = returnAllChildSumma(data.childs)
        console.log(summa)
        const doc = await createShowServiceService({ ...data, main_schet_id, user_id, summa })
        const childs = []
        for (let child of data.childs) {
            const result = await createShowServiceChildService({
                ...child,
                main_schet_id,
                user_id,
                spravochnik_operatsii_own_id: data.spravochnik_operatsii_own_id,
                kursatilgan_hizmatlar_jur152_id: doc.id
            })
            childs.push(result)
        }
        let object = { ...doc }
        object.childs = childs
        resFunc(res, 201, object)
    } catch (error) {
        errorCatch(error, res)
    }
}

const getShowService = async (req, res) => {
    try {
        const region_id = req.user.region_id
        const { main_schet_id, from, to } = req.query

        const result = await getShowServiceService(region_id, main_schet_id)

        return resFunc(res, 200, result)

    } catch (error) {
        errorCatch(error, res)
    }
}


module.exports = {
    createController,
    getShowService
}