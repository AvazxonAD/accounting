const ErrorResponse = require('../../utils/errorResponse')
const { showServicesValidation } = require('../../helpers/validation/show.services/show.services.validation')
const { getByIdOperatsii } = require('../../service/spravochnik/operatsii.service')
const { getByIdOrganization } = require('../../service/spravochnik/organization.service')
const { getByIdShartnomaService, getByIdAndOrganizationIdShartnoma } = require('../../service/shartnoma/shartnoma.service')
const { getByIdPodrazlanie } = require('../../service/spravochnik/podrazdelenie.service')
const { getByIdSostav } = require('../../service/spravochnik/sostav.service')
const { getByIdtype_operatsii } = require('../../service/spravochnik/type_operatsii.service')
const { resFunc } = require('../../helpers/resFunc')
const { validationResponse } = require('../../helpers/response-for-validation')
const { errorCatch } = require('../../helpers/errorCatch')
const { getByIdMainSchet } = require('../../service/spravochnik/main.schet.service')
const { returnAllChildSumma } = require('../../utils/returnSumma')
const { queryValidation } = require('../../helpers/validation/bank/bank.prixod.validation')
const { getLogger, postLogger, putLogger, deleteLogger } = require('../../helpers/log_functions/logger');
const {
    createShowServiceChildService,
    createShowServiceService,
    getShowServiceService,
    showServiceChildService,
    getByIdShowServiceService,
    updateShowServiceService,
    deleteShowServiceChildService,
    deleteShowServiceService
} = require('../../service/show.services/show.services.service')

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
            const contract = await getByIdShartnomaService(region_id, main_schet_id, data.shartnomalar_organization_id, data.id_spravochnik_organization)
            if(contract.pudratchi_bool){
                throw new ErrorResponse(`contract not found`, 404)
            }
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

// get show service 
const getShowService = async (req, res) => {
    try {
        const region_id = req.user.region_id;
        const main_schet_id = req.query.main_schet_id;
    
        await getByIdMainSchet(region_id, main_schet_id);
        const data = validationResponse(queryValidation, req.query)
    
        const limit = parseInt(data.limit) || 10;
        const page = parseInt(data.page) || 1;
        const from = data.from;
        const to = data.to;
    
        if (limit <= 0 || page <= 0) {
            throw new ErrorResponse("Limit va page musbat sonlar bo'lishi kerak", 400)
        }
        const offset = (page - 1) * limit;
    
        const parents = await getShowServiceService(
            region_id,
            main_schet_id,
            from,
            to,
            offset,
            limit,
        );
        const resultArray = [];
        for (let result of parents.data) {
            const childs = await showServiceChildService(region_id, main_schet_id, result.id);
            let object = { ...result };
            object.childs = childs;
            resultArray.push(object);
        }
        const total = parents.total_count;
        const pageCount = Math.ceil(total / limit);
        const summa = parents.summa;
        getLogger.info(`show servise doclar muvaffaqiyatli olindi. UserId : ${req.user.id}`)
        const meta = {
            pageCount: pageCount,
            count: total,
            currentPage: page,
            nextPage: page >= pageCount ? null : page + 1,
            backPage: page === 1 ? null : page - 1,
            summa,
        }
        resFunc(res, 200, resultArray, meta)
    } catch (error) {
        errorCatch(error, res)
    }
}

// get by id show service
const getByIdShowService = async (req, res) => {
    try {
        const main_schet_id = req.query.main_schet_id;
        const region_id = req.user.region_id;
        const id = req.params.id;
        const user_id = req.user.id
    
        await getByIdMainSchet(region_id, main_schet_id);
    
        const result = await getByIdShowServiceService(region_id, main_schet_id, id, true);
    
        const object = { ...result };
        object.childs = await showServiceChildService(region_id, main_schet_id, object.id);
    
        getLogger.info(`show servise doc muvaffaqiyatli olindi. UserId : ${user_id}`)
        resFunc(res, 200, object)
    } catch (error) {
        errorCatch(error, res)
    }
}

// update show service
const updateShowService = async (req, res) => {
    try {
        const region_id = req.user.region_id;
        const user_id = req.user.id;
        const main_schet_id = req.query.main_schet_id;
        const id = req.params.id;
        const data = validationResponse(showServicesValidation, req.body)
        await getByIdMainSchet(region_id, main_schet_id);    
        await getByIdShowServiceService(region_id, main_schet_id, id);
        await getByIdOperatsii( data.spravochnik_operatsii_own_id, "show_service");
        await getByIdOrganization(region_id, data.id_spravochnik_organization);
        if (data.shartnomalar_organization_id) {
            const contract = await getByIdAndOrganizationIdShartnoma(
                region_id,
                main_schet_id,
                data.id_spravochnik_organization,
                data.shartnomalar_organization_id
            );
            if(contract.pudratchi_bool) throw new ErrorResponse(`contract not found`, 404)
            
        }
        for (let child of data.childs) {
            await getByIdOperatsii( child.spravochnik_operatsii_id, "show_service" );
            if (child.id_spravochnik_podrazdelenie) {
                await getByIdPodrazlanie( region_id, child.id_spravochnik_podrazdelenie );
            }
            if (child.id_spravochnik_sostav) {
                await getByIdSostav( region_id, child.id_spravochnik_sostav );
            }
            if (child.id_spravochnik_type_operatsii) {
                await getByIdtype_operatsii( region_id, child.id_spravochnik_type_operatsii );
            }
        }
    
        const summa = returnAllChildSumma(data.childs);
    
        const service = await updateShowServiceService({ ...data, id, summa });
        await deleteShowServiceChildService(id);
        const childs = []
        for (let child of data.childs) {
            const result = await createShowServiceChildService({
                ...child,
                main_schet_id,
                user_id,
                spravochnik_operatsii_own_id: data.spravochnik_operatsii_own_id,
                kursatilgan_hizmatlar_jur152_id: id,
            });
            childs.push(result)
        }
        let object = {...service}
        object.childs = childs
    
        putLogger.info(`show servise doc muvaffaqiyatli yangilandi. UserId : ${user_id}`)
        return resFunc(res, 200, object)
    } catch (error) {
        errorCatch(error, res)
    }
}

// delete show service 
const deleteShowService = async (req, res) => {
    const main_schet_id = req.query.main_schet_id;
    const region_id = req.user.region_id;
    const id = req.params.id;
    const user_id = req.user.id

    await getByIdMainSchet(region_id, main_schet_id);

    await getByIdShowServiceService(region_id, main_schet_id, id);

    await deleteShowServiceService(id);

    deleteLogger.info(`show servise doc muvaffaqiyatli ochirildi. UserId : ${user_id}`)
    return resFunc(res, 200, 'deleted success')
}


module.exports = {
    createController,
    getShowService,
    getByIdShowService,
    updateShowService,
    deleteShowService
}