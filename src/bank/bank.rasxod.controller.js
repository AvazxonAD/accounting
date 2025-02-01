const { createBankRasxodDb, createBankRasxodChild, getByIdRasxodService, updateRasxodService, getBankRasxodService, deleteRasxodChild, deleteBankRasxod, getFioBankRasxodService } = require("./bank.rasxod.service");
const { getByIdMainSchetService } = require("../spravochnik/main.schet/main.schet.service");
const { OrganizationDB } = require("../spravochnik/organization/db.js");
const { getByIdShartnomaService } = require("../shartnoma/shartnoma.service");
const { getByIdOperatsiiService, getOperatsiiByChildArray } = require("../spravochnik/operatsii/operatsii.service");
const { getByIdPodrazlanieService } = require("../spravochnik/podrazdelenie/podrazdelenie.service");
const { getByIdSostavService } = require("../spravochnik/sostav/sostav.service");
const { getByIdTypeOperatsiiService } = require("../spravochnik/type.operatsii/type_operatsii.service");
const { bankRasxodValidation } = require("../utils/validation");;
const { bankRasxodPayment } = require("../utils/validation");;
const { returnAllChildSumma } = require("../utils/returnSumma");
const { bankQueryValidation } = require("../utils/validation");;
const { errorCatch } = require('../utils/errorCatch')
const { validationResponse } = require('../utils/response-for-validation');
const { getByIdPodotchetService } = require("../spravochnik/podotchet/podotchet.litso.service");
const { resFunc } = require('../utils/resFunc')
const { checkSchetsEquality } = require('../utils/need.functios');
const ErrorResponse = require("../utils/errorResponse");
const { MainSchetService } = require('../spravochnik/main.schet/services.js');

// bank rasxod
const bank_rasxod = async (req, res) => {
  try {
    const main_schet_id = req.query.main_schet_id;
    const region_id = req.user.region_id;
    const user_id = req.user.id;
    const data = validationResponse(bankRasxodValidation, req.body)
    const main_schet = await getByIdMainSchetService(region_id, main_schet_id);
    const organization = await OrganizationDB.getByIdorganization([region_id, data.id_spravochnik_organization]);
    if (!organization) {
      return res.status(404).json({
        message: "organization not found"
      })
    }
    if (data.id_shartnomalar_organization) {
      await getByIdShartnomaService(
        region_id,
        main_schet.spravochnik_budjet_name_id,
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
      if (child.id_spravochnik_podotchet_litso) {
        await getByIdPodotchetService(region_id, child.id_spravochnik_podotchet_litso)
      }
    }
    const operatsiis = await getOperatsiiByChildArray(data.childs, 'bank_rasxod')
    if (!checkSchetsEquality(operatsiis)) {
      return res.eror(req.i18n.t('schetDifferentError'), 400);
    }
    const summa = returnAllChildSumma(data.childs);
    const rasxod = await createBankRasxodDb({ ...data, main_schet_id, user_id, summa, });
    const childs = []
    for (let child of data.childs) {
      const result = await createBankRasxodChild({ ...child, main_schet_id, bank_rasxod_id: rasxod.id, user_id });
      childs.push(result)
    }
    rasxod.childs = childs
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
    const main_schet = await getByIdMainSchetService(region_id, main_schet_id);
    await OrganizationDB.getByIdorganization([region_id, data.id_spravochnik_organization]);
    if (data.id_shartnomalar_organization) {
      await getByIdShartnomaService(region_id, main_schet.spravochnik_budjet_name_id, data.id_shartnomalar_organization, data.id_spravochnik_organization);
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
      if (child.id_spravochnik_podotchet_litso) {
        await getByIdPodotchetService(region_id, child.id_spravochnik_podotchet_litso)
      }
    }
    const operatsiis = await getOperatsiiByChildArray(data.childs, 'bank_rasxod')
    if (!checkSchetsEquality(operatsiis)) {
      return res.eror(req.i18n.t('schetDifferentError'), 400);
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
    resFunc(res, 200, prixod)
  } catch (error) {
    errorCatch(error, res)
  }
}

// get all bank rasxod
const getAllBankRasxod = async (req, res) => {
  try {
    const region_id = req.user.region_id;
    const { page, limit, from, to, main_schet_id } = validationResponse(bankQueryValidation, req.query)
    const offset = (page - 1) * limit;
    await getByIdMainSchetService(region_id, main_schet_id);
    const { data, summa, total } = await getBankRasxodService(region_id, main_schet_id, offset, limit, from, to,);
    const pageCount = Math.ceil(total / limit);
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
    resFunc(res, 200, 'delete success true')
  } catch (error) {
    errorCatch(error, res)
  }
}

const getFioBankRasxod = async (req, res) => {
  try {
    const region_id = req.user.region_id
    const main_schet_id = req.query.main_schet_id
    await getByIdMainSchetService(region_id, main_schet_id)
    const result = await getFioBankRasxodService(region_id, main_schet_id)
    resFunc(res, 200, result)
  } catch (error) {
    errorCatch(error, res)
  }
}

const paymentBankRasxod = async (req, res) => {
  try {
    const region_id = req.user.region_id;
    const { error, value } = bankRasxodPayment.validate(req);
    if (error) {
      return res.error(error.details[0].message, 400);
    }
    const { main_schet_id } = value.query;
    const main_schet = await MainSchetService.getByIdMainScet({ id: main_schet_id, region_id })
    if(!main_schet){
      return res.error(req.i18n.t('mainSchetNotFound'), 404);
    }
    
  } catch (error) {
    return res.error()
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
