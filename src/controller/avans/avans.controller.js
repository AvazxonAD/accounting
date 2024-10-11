const {
  createJur4ChildDB,
  createJur4DB,
  getAllJur4DB,
  getByIdJur4DB,
  updateJur4DB,
  deleteJur4ChildDB,
  deleteJur4DB
} = require('../../service/avans/jur4.service')
const ErrorResponse = require("../../utils/errorResponse");
const { queryValidation } = require("../../helpers/validation/bank/bank.prixod.validation");
const { jur4Validation } = require("../../helpers/validation/avans_otchetlar/jur4.validation");
const { getByIdMainSchetService } = require("../../service/spravochnik/main.schet.service");
const { getByIdPodotchetService } = require("../../service/spravochnik/podotchet.litso.service");
const { getByIdOperatsiiService } = require("../../service/spravochnik/operatsii.service");
const { getByIdPodrazlanieService } = require("../../service/spravochnik/podrazdelenie.service");
const { getByIdSostavService } = require("../../service/spravochnik/sostav.service");
const { getByIdTypeOperatsiiService } = require("../../service/spravochnik/type_operatsii.service");
const { returnAllChildSumma } = require("../../utils/returnSumma");
const { getLogger, postLogger, putLogger, deleteLogger } = require('../../helpers/log_functions/logger');
const { validationResponse } = require('../../helpers/response-for-validation');
const { resFunc } = require('../../helpers/resFunc');
const { errorCatch } = require('../../helpers/errorCatch')

// jur 4 create
const jur_4_create = async (req, res) => {
  try {
    const region_id = req.user.region_id;
    const user_id = req.user.id;
    const main_schet_id = req.query.main_schet_id;
    await getByIdMainSchetService(region_id, main_schet_id);
    const data = validationResponse(jur4Validation, req.body)
    await getByIdPodotchetService(region_id, data.spravochnik_podotchet_litso_id)
    await getByIdOperatsiiService(data.spravochnik_operatsii_own_id, 'avans_otchet')
    for (let child of data.childs) {
      if (child.spravochnik_operatsii_id) {
        await getByIdOperatsiiService(child.spravochnik_operatsii_id, 'avans_otchet')
      }
      if (child.id_spravochnik_podrazdelenie) {
        await getByIdPodrazlanieService(region_id, child.id_spravochnik_podrazdelenie)
      }
      if (child.id_spravochnik_sostav) {
        await getByIdSostavService(region_id, child.id_spravochnik_sostav)
      }
      if (child.id_spravochnik_type_operatsii) {
        await getByIdTypeOperatsiiService(region_id, child.id_spravochnik_type_operatsii)
      }
    }
    const summa = returnAllChildSumma(data.childs)
    const result = await createJur4DB({ ...data, main_schet_id, user_id, summa })
    const childs = []
    for (let child of data.childs) {
      const child_data = await createJur4ChildDB({ ...child, user_id, main_schet_id, avans_otchetlar_jur4_id: result.id, spravochnik_operatsii_own_id: data.spravochnik_operatsii_own_id })
      childs.push(child_data)
    }
    result.childs = childs
    postLogger.info(`Jur4 doc muvaffaqiyatli kiritildi. UserId : ${user_id}`)
    resFunc(res, 200, result)
  } catch (error) {
    errorCatch(error, res)
  }
}

// jur 4 get all
const getAllJur_4 = async (req, res) => {
  try {
    const region_id = req.user.region_id;
    const user_id = req.user.id
    const { page, limit, from, to, main_schet_id } = validationResponse(queryValidation, req.query)  
    const offset = (page - 1) * limit;
    const {data, total, summa} = await getAllJur4DB(region_id, main_schet_id, from, to, offset, limit)
    await getByIdMainSchetService(region_id, main_schet_id);
    const pageCount = Math.ceil(total / limit);
    getLogger.info(`Jur4 doclar muvaffaqiyatli olindi. UserId : ${user_id}`)
    const meta = {
      pageCount: pageCount,
      count: total,
      currentPage: page,
      nextPage: page >= pageCount ? null : page + 1,
      backPage: page === 1 ? null : page - 1,
      summa
    }
    resFunc(res, 200, data, meta)
  } catch (error) {
    errorCatch(error, res)
  }
}

// jur 4 update
const jur_4_update = async (req, res) => {
  try {
    const region_id = req.user.region_id;
    const user_id = req.user.id;
    const main_schet_id = req.query.main_schet_id;
    const id = req.params.id
    await getByIdMainSchetService(region_id, main_schet_id);
    await getByIdJur4DB(region_id, main_schet_id, id)   
    const data = validationResponse(jur4Validation, req.body)
    await getByIdPodotchetService(region_id, data.spravochnik_podotchet_litso_id)
    await getByIdOperatsiiService(data.spravochnik_operatsii_own_id, 'avans_otchet')
    for (let child of data.childs) {
      if (child.spravochnik_operatsii_id) {
        await getByIdOperatsiiService(child.spravochnik_operatsii_id, 'avans_otchet')
      }
      if (child.id_spravochnik_podrazdelenie) {
        await getByIdPodrazlanieService(region_id, child.id_spravochnik_podrazdelenie)
      }
      if (child.id_spravochnik_sostav) {
        await getByIdSostavService(region_id, child.id_spravochnik_sostav)
      }
      if (child.id_spravochnik_type_operatsii) {
        await getByIdTypeOperatsiiService(region_id, child.id_spravochnik_type_operatsii)
      }
    }
    const summa = returnAllChildSumma(data.childs)
    const result = await updateJur4DB({ ...data, id, summa })
    await deleteJur4ChildDB(id)
    const childs = []
    for (let child of data.childs) {
      const result = await createJur4ChildDB({...child, user_id, main_schet_id, avans_otchetlar_jur4_id: id, spravochnik_operatsii_own_id: data.spravochnik_operatsii_own_id})
      childs.push(result)
    }
    result.childs = childs
    putLogger.info(`Jur4 doc muvaffaqiyatli yangilandi. UserId : ${user_id}`)
    resFunc(res, 200, result)
  } catch (error) {
    errorCatch(error, res)
  }
}

// delete jur 4
const delete_jur_4 = async (req, res) => {
  try {
    const region_id = req.user.region_id;
    const main_schet_id = req.query.main_schet_id;
    const id = req.params.id
    const user_id = req.user.id
    await getByIdMainSchetService(region_id, main_schet_id);
    await getByIdJur4DB(region_id, main_schet_id, id)
    await deleteJur4DB(id)
    deleteLogger.info(`Jur4 doc muvaffaqiyatli ochirildi. UserId : ${user_id}`)
    resFunc(res, 200, 'delete success true')
  } catch (error) {
    errorCatch(error, res)
  }
}

// get element by id jur 4
const getElementByIdjur_4 = async (req, res) => {
  try {
    const region_id = req.user.region_id;
    const main_schet_id = req.query.main_schet_id;
    const id = req.params.id
    const user_id = req.user.id
    await getByIdMainSchetService(region_id, main_schet_id);  
    const result = await getByIdJur4DB(region_id, main_schet_id, id, true)
    postLogger.info(`Jur4 doc muvaffaqiyatli olindi. UserId : ${user_id}`)
    resFunc(res, 200, result)
  } catch (error) {
    errorCatch(error, res)
  }
}

module.exports = {
  jur_4_create,
  getAllJur_4,
  jur_4_update,
  delete_jur_4,
  getElementByIdjur_4,
};
