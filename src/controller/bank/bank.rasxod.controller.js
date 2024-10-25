const { createBankRasxodDb, createBankRasxodChild, getByIdRasxodService, updateRasxodService, getBankRasxodService, deleteRasxodChild, deleteBankRasxod, getFioBankRasxodService } = require("../../service/bank/bank.rasxod.service");
const { getByIdMainSchetService } = require("../../service/spravochnik/main.schet.service");
const { getByIdOrganizationService } = require("../../service/spravochnik/organization.service");
const { getByIdShartnomaService } = require("../../service/shartnoma/shartnoma.service");
const { getByIdOperatsiiService } = require("../../service/spravochnik/operatsii.service");
const { getByIdPodrazlanieService } = require("../../service/spravochnik/podrazdelenie.service");
const { getByIdSostavService } = require("../../service/spravochnik/sostav.service");
const { getByIdTypeOperatsiiService } = require("../../service/spravochnik/type_operatsii.service");
const { bankRasxodValidation } = require("../../helpers/validation/bank/bank.rasxod.validation");
const { returnAllChildSumma } = require("../../utils/returnSumma");
const { queryValidation } = require("../../helpers/validation/bank/bank.prixod.validation");
const { getLogger, postLogger, putLogger, deleteLogger } = require('../../helpers/log_functions/logger');
const { errorCatch } = require('../../helpers/errorCatch')
const { validationResponse } = require('../../helpers/response-for-validation');
const { getByIdPodotchetService } = require("../../service/spravochnik/podotchet.litso.service");
const { resFunc } = require('../../helpers/resFunc')

// bank rasxod
const bank_rasxod = async (req, res) => {
  try {
    const main_schet_id = req.query.main_schet_id;
    const region_id = req.user.region_id;
    const user_id = req.user.id;
    const data = validationResponse(bankRasxodValidation, req.body)
    await getByIdMainSchetService(region_id, main_schet_id);
    await getByIdOrganizationService(region_id, data.id_spravochnik_organization);
    if (data.id_shartnomalar_organization) {
      await getByIdShartnomaService(
        region_id,
        main_schet_id,
        data.id_shartnomalar_organization,
        data.id_spravochnik_organization,
      );
    }
    for (let child of data.childs) {
      await getByIdOperatsiiService(child.spravochnik_operatsii_id, "bank_rasxod");
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
    const rasxod = await createBankRasxodDb({ ...data, main_schet_id, user_id, summa, });
    const childs = []
    for (let child of data.childs) {
      const result = await createBankRasxodChild({ ...child, main_schet_id, bank_rasxod_id: rasxod.id, user_id });
      childs.push(result)
    }
    rasxod.childs = childs
    postLogger.info(`Bank rasxod doc yaratildi. UserId: ${req.user.id}`)
    resFunc(res, 201, rasxod)
  } catch (error) {
    errorCatch(error, res)
  }
}

// bank rasxod update
const bank_rasxod_update = async (req, res) => {
  try {
    const main_schet_id = req.query.main_schet_id;
    const id = req.params.id;
    const region_id = req.user.region_id;
    const user_id = req.user.id;
    await getByIdRasxodService(region_id, main_schet_id, id);
    const data = validationResponse(bankRasxodValidation, req.body)
    await getByIdMainSchetService(region_id, main_schet_id);
    await getByIdOrganizationService(region_id, data.id_spravochnik_organization);
    if (data.id_shartnomalar_organization) {
      await getByIdShartnomaService(region_id, main_schet_id, data.id_shartnomalar_organization, data.id_spravochnik_organization);
    }
    for (let child of data.childs) {
      await getByIdOperatsiiService(child.spravochnik_operatsii_id, "bank_rasxod");
      if (child.id_spravochnik_podrazdelenie) {
        await getByIdPodrazlanieService(region_id, child.id_spravochnik_podrazdelenie);
      }
      if (child.id_spravochnik_sostav) {
        await getByIdSostavService(region_id, child.id_spravochnik_sostav,);
      }
      if (child.id_spravochnik_type_operatsii) {
        await getByIdTypeOperatsiiService(region_id, child.id_spravochnik_type_operatsii);
      }
    }
    const summa = returnAllChildSumma(data.childs);
    const prixod = await updateRasxodService({ ...data, id, provodki_boolean: true, summa });
    await deleteRasxodChild(id);
    const childs = []
    for (let child of data.childs) {
      const result = await createBankRasxodChild({ ...child, bank_rasxod_id: id, user_id, main_schet_id });
      childs.push(result)
    }
    prixod.childs = childs
    putLogger.info(`Bank rasxod doc yangilandi. UserId: ${req.user.id}`)
    resFunc(res, 200, prixod)
  } catch (error) {
    errorCatch(error, res)
  }
}

// get all bank rasxod
const getAllBankRasxod = async (req, res) => {
  try {
    const region_id = req.user.region_id;
    const { page, limit, from, to, main_schet_id } = validationResponse(queryValidation, req.query)
    const offset = (page - 1) * limit;
    await getByIdMainSchetService(region_id, main_schet_id);
    const { data, summa, total } = await getBankRasxodService(region_id, main_schet_id, offset, limit, from, to,);
    const pageCount = Math.ceil(total / limit);
    getLogger.info(`Bank rasxod doclar olindi. UserId: ${req.user.id}`)
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

// get element by id bank rasxod
const getElementByIdBankRasxod = async (req, res) => {
  try {
    const id = req.params.id;
    const main_schet_id = req.query.main_schet_id;
    const region_id = req.user.region_id;
    await getByIdMainSchetService(region_id, main_schet_id)
    const prixod = await getByIdRasxodService(region_id, main_schet_id, id, true);
    postLogger.info(`Bank rasxod doc olindi. UserId: ${req.user.id}`)
    resFunc(res, 200, prixod)
  } catch (error) {
    errorCatch(error, res)
  }
}

// delete bank_rasxod
const delete_bank_rasxod = async (req, res) => {
  try {
    const main_schet_id = req.query.main_schet_id;
    const region_id = req.user.region_id;
    const id = req.params.id;
    await getByIdMainSchetService(region_id, main_schet_id);
    await getByIdRasxodService(region_id, main_schet_id, id);
    await deleteBankRasxod(id);
    deleteLogger.info(`Bank rasxod doc ochirildi. UserId: ${req.user.id}`)
    resFunc(res, 200, 'delete success true')
  } catch (error) {
    errorCatch(error, res)
  }
}

const getFioBankRasxod = async (req, res) => {
  try {
    const region_id  = req.user.region_id
    const main_schet_id = req.query.main_schet_id
    await getByIdMainSchetService(region_id, main_schet_id)
    const result = await getFioBankRasxodService(region_id, main_schet_id)
    resFunc(res, 200, result)
  } catch (error) {
    errorCatch(error, res)
  }
} 

module.exports = {
  delete_bank_rasxod,
  getElementByIdBankRasxod,
  getAllBankRasxod,
  bank_rasxod,
  bank_rasxod_update,
  getFioBankRasxod
};
