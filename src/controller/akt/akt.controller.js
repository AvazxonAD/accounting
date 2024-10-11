const {
  createJur3DB,
  createJur3ChildDB,
  getAllJur3DB,
  getElementByIdJur_3DB,
  deleteJur3ChildDB,
  updateJur3DB,
  deleteJur3DB,
} = require("../../service/akt/akt.service");
const ErrorResponse = require("../../utils/errorResponse");
const { queryValidation } = require("../../helpers/validation/bank/bank.prixod.validation");
const { jur3Validation } = require("../../helpers/validation/bajarilgan_ishlar/jur_3.validation");
const { getByIdMainSchetService } = require("../../service/spravochnik/main.schet.service");
const { getByIdOrganizationService } = require("../../service/spravochnik/organization.service");
const { getByIdShartnomaService } = require("../../service/shartnoma/shartnoma.service");
const { getByIdOperatsiiService } = require("../../service/spravochnik/operatsii.service");
const { getByIdPodrazlanieService } = require("../../service/spravochnik/podrazdelenie.service");
const { getByIdSostavService } = require("../../service/spravochnik/sostav.service");
const { getByIdTypeOperatsiiService } = require("../../service/spravochnik/type_operatsii.service");
const { returnAllChildSumma } = require("../../utils/returnSumma");
const { getLogger, postLogger, putLogger, deleteLogger } = require('../../helpers/log_functions/logger');
const { resFunc } = require('../../helpers/resFunc');
const { validationResponse } = require("../../helpers/response-for-validation");
const { errorCatch } = require("../../helpers/errorCatch");

// jur_3 create 
const jur_3_create = async (req, res) => {
  try {
    const data = validationResponse(jur3Validation, req.body)
    const region_id = req.user.region_id;
    const user_id = req.user.id;
    const main_schet_id = req.query.main_schet_id;
    await getByIdMainSchetService(region_id, main_schet_id);
    await getByIdOperatsiiService(data.spravochnik_operatsii_own_id, "Akt_priyom_peresdach");
    await getByIdOrganizationService(region_id, data.id_spravochnik_organization,);
    if (data.shartnomalar_organization_id) {
      const shartnoma = await getByIdShartnomaService(region_id, main_schet_id, data.shartnomalar_organization_id, data.id_spravochnik_organization);
      if (!shartnoma.pudratchi_bool) {
        throw new ErrorResponse("conrtact not found", 404)
      }
    }
    for (let child of data.childs) {
      await getByIdOperatsiiService(child.spravochnik_operatsii_id, "Akt_priyom_peresdach");
      if (child.id_spravochnik_podrazdelenie) {
        await getByIdPodrazlanieService(region_id, child.id_spravochnik_podrazdelenie);
      }
      if (child.id_spravochnik_sostav) {
        await getByIdSostavService(region_id, child.id_spravochnik_sostav);
      }
      if (child.id_spravochnik_type_operatsii) {
        await getByIdTypeOperatsiiService(region_id, child.id_spravochnik_type_operatsii);
      }
    }
    const summa = returnAllChildSumma(data.childs);
    const result = await createJur3DB({ ...data, main_schet_id, user_id, summa });
    const childs = []
    for (let child of data.childs) {
      const child_data = await createJur3ChildDB({ ...child, main_schet_id, user_id, spravochnik_operatsii_own_id: data.spravochnik_operatsii_own_id, bajarilgan_ishlar_jur3_id: result.id });
      childs.push(child_data)
    }
    result.childs = childs
    postLogger.info(`Jur3 doc muvaffaqiyatli kiritildi. UserId : ${user_id}`)
    return resFunc(res, 201, result);
  } catch (error) {
    errorCatch(error, res)
  }
}

// jur_3 get all
const jur_3_get_all = async (req, res) => {
    try {
    const region_id = req.user.region_id;
    const { page, limit, from, to, main_schet_id } = validationResponse(queryValidation, req.query)
    await getByIdMainSchetService(region_id, main_schet_id);
    const offset = (page - 1) * limit;
    const { data, total, summa } = await getAllJur3DB(region_id, main_schet_id, from, to, offset, limit);
    const pageCount = Math.ceil(total / limit);
    getLogger.info(`Jur3 doclar muvaffaqiyatli olindi. UserId : ${req.user.id}`)
    const meta = {
      pageCount: pageCount,
      count: total,
      currentPage: page,
      nextPage: page >= pageCount ? null : page + 1,
      backPage: page === 1 ? null : page - 1,
      summa,
    }
    resFunc(res, 200, data, meta)
  } catch (error) {
    errorCatch(error, res)
  }
}

// jur_3 update
const jur_3_update = async (req, res) => {
  try {
    const region_id = req.user.region_id;
    const user_id = req.user.id;
    const main_schet_id = req.query.main_schet_id;
    const id = req.params.id;
    await getElementByIdJur_3DB(region_id, main_schet_id, id);
    await getByIdMainSchetService(region_id, main_schet_id);
    const data = validationResponse(jur3Validation, req.body)
    await getByIdOperatsiiService(data.spravochnik_operatsii_own_id, "Akt_priyom_peresdach");
    await getByIdOrganizationService(region_id, data.id_spravochnik_organization,);
    if (data.shartnomalar_organization_id) {
      const shartnoma = await getByIdShartnomaService(region_id, main_schet_id, data.shartnomalar_organization_id, data.id_spravochnik_organization);
      if (!shartnoma.pudratchi_bool) {
        throw new ErrorResponse("conrtact not found", 404)
      }
    }
    for (let child of data.childs) {
      await getByIdOperatsiiService(child.spravochnik_operatsii_id, "Akt_priyom_peresdach");
      if (child.id_spravochnik_podrazdelenie) {
        await getByIdPodrazlanieService(region_id, child.id_spravochnik_podrazdelenie);
      }
      if (child.id_spravochnik_sostav) {
        await getByIdSostavService(region_id, child.id_spravochnik_sostav);
      }
      if (child.id_spravochnik_type_operatsii) {
        await getByIdTypeOperatsiiService(region_id, child.id_spravochnik_type_operatsii);
      }
    }
    const summa = returnAllChildSumma(data.childs);
    const akt = await updateJur3DB({ ...data, id, summa });
    const childs = []
    await deleteJur3ChildDB(id);
    for (let child of data.childs) {
      const child_data = await createJur3ChildDB({ ...child, main_schet_id, user_id, spravochnik_operatsii_own_id: data.spravochnik_operatsii_own_id, bajarilgan_ishlar_jur3_id: id});
      childs.push(child_data)
    }
    akt.childs = childs 
    putLogger.info(`Jur3 doc muvaffaqiyatli yangilandi. UserId : ${user_id}`)
    resFunc(res, 200, akt)
  } catch (error) {
    errorCatch(error, res)
  }
}

// delete jur_3
const deleteJur_3 = async (req, res) => {
  try {
    const main_schet_id = req.query.main_schet_id;
    const region_id = req.user.region_id;
    const id = req.params.id;
    const user_id = req.user.id
    await getByIdMainSchetService(region_id, main_schet_id);
    await getElementByIdJur_3DB(region_id, main_schet_id, id);
    await deleteJur3DB(id);
    deleteLogger.info(`Jur3 doc muvaffaqiyatli ochirildi. UserId : ${user_id}`)
    return resFunc(res, 200, 'deleted success')
  } catch (error) {
    errorCatch(error, res)
  }
}

// get element by id jur_3
const getElementByIdJur_3 = async (req, res) => {
  try {
    const main_schet_id = req.query.main_schet_id;
    const region_id = req.user.region_id;
    const id = req.params.id;
    const user_id = req.user.id
    await getByIdMainSchetService(region_id, main_schet_id);
    const result = await getElementByIdJur_3DB(region_id, main_schet_id, id, true);
    getLogger.info(`Jur3 doc muvaffaqiyatli olindi. UserId : ${user_id}`)
    resFunc(res, 200, result)
  } catch (error) {
    errorCatch(error, res)
  }
}

module.exports = {
  jur_3_create,
  jur_3_get_all,
  jur_3_update,
  getElementByIdJur_3,
  deleteJur_3,
};
