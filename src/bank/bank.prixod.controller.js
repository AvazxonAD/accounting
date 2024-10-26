const { createBankPrixodService, createBankPrixodServiceChild, bankPrixodUpdateService, deleteBankPrixodChild, getPrixodService, getByIdPrixodService, deleteBankPrixod } = require("./bank.prixod.service");
const asyncHandler = require("../middleware/asyncHandler");
const { bankPrixodValidation, bankQueryValidation } = require("../utils/validation");;
const { getLogger, postLogger, putLogger, deleteLogger } = require('../utils/logger');
const { returnAllChildSumma } = require("../utils/returnSumma");
const { getByIdShartnomaService } = require("../shartnoma/shartnoma.service");
const { getByIdMainSchetService } = require("../spravochnik/main.schet/main.schet.service");
const { getByIdOrganizationService } = require("../spravochnik/organization/organization.service");
const { getByIdOperatsiiService } = require("../spravochnik/operatsii/operatsii.service");
const { getByIdPodrazlanieService, } = require("../spravochnik/podrazdelenie/podrazdelenie.service");
const { getByIdSostavService } = require("../spravochnik/sostav/sostav.service");
const { getByIdTypeOperatsiiService, } = require("../spravochnik/type.operatsii/type_operatsii.service");
const { getByIdPodotchetService, } = require("../spravochnik/podotchet/podotchet.litso.service");
const { validationResponse } = require("../utils/response-for-validation");
const { resFunc } = require("../utils/resFunc");

// bank prixod create
const create = asyncHandler(async (req, res) => {
  const main_schet_id = req.query.main_schet_id;
  const region_id = req.user.region_id;
  const user_id = req.user.id;
  const data = validationResponse(bankPrixodValidation, req.body)
  await getByIdMainSchetService(region_id, main_schet_id);
  await getByIdOrganizationService(region_id, data.id_spravochnik_organization);
  if (data.id_shartnomalar_organization) {
    await getByIdShartnomaService(
      region_id,
      main_schet_id,
      data.id_shartnomalar_organization,
      data.id_spravochnik_organization
    );
  }
  for (let child of data.childs) {
    await getByIdOperatsiiService(child.spravochnik_operatsii_id, "bank_prixod");
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
      await getByIdPodotchetService(region_id, child.id_spravochnik_podotchet_litso);
    }
  }
  const summa = returnAllChildSumma(data.childs);
  const result = await createBankPrixodService({ ...data, main_schet_id, user_id, provodki_boolean: true, summa, });
  postLogger.info(`Bank prixod doc yaratildi. UserId: ${req.user.id}`)
  resFunc(res, 201, result)
});

// bank prixod update
const bank_prixod_update = asyncHandler(async (req, res) => {
  const main_schet_id = req.query.main_schet_id;
  const id = req.params.id;
  const region_id = req.user.region_id;
  const user_id = req.user.id;
  await getByIdPrixodService(region_id, main_schet_id, id);
  const data = validationResponse(bankPrixodValidation, req.body)
  await getByIdMainSchetService(region_id, main_schet_id);
  await getByIdOrganizationService(region_id, data.id_spravochnik_organization);
  if (data.id_shartnomalar_organization) {
    await getByIdShartnomaService(region_id, main_schet_id, data.id_shartnomalar_organization, data.id_spravochnik_organization);
  }
  for (let child of data.childs) {
    await getByIdOperatsiiService(child.spravochnik_operatsii_id, "bank_prixod");
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
      await getByIdPodotchetService(region_id, child.id_spravochnik_podotchet_litso);
    }
  }
  const summa = returnAllChildSumma(data.childs);
  const prixod = await bankPrixodUpdateService({ ...data, id, provodki_boolean: true, summa, user_id });
  putLogger.info(`Bank prixod doc yangilandi. UserId: ${req.user.id}`)
  resFunc(res, 200, prixod)
});

// delete bank_prixod
const delete_bank_prixod = asyncHandler(async (req, res) => {
  const main_schet_id = req.query.main_schet_id;
  const region_id = req.user.region_id;
  const id = req.params.id;
  await getByIdMainSchetService(region_id, main_schet_id);
  await getByIdPrixodService(region_id, main_schet_id, id);
  await deleteBankPrixod(id);
  deleteLogger.info(`Bank prixod doc ochirildi. UserId: ${req.user.id}`)
  resFunc(res, 200, 'delete success true')
});

// get element by id bank prixod
const getElementByIdBankPrixod = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const main_schet_id = req.query.main_schet_id;
  const region_id = req.user.region_id;
  await getByIdMainSchetService(region_id, main_schet_id)
  const prixod = await getByIdPrixodService(region_id, main_schet_id, id, true);
  postLogger.info(`Bank prixod doc olindi. UserId: ${req.user.id}`)
  resFunc(res, 200, prixod)
});

// get all bank prixod
const getAllBankPrixod = asyncHandler(async (req, res) => {
  const region_id = req.user.region_id;
  const { page, limit, from, to, main_schet_id } = validationResponse(bankQueryValidation, req.query)
  const offset = (page - 1) * limit;
  await getByIdMainSchetService(region_id, main_schet_id);
  const { data, summa, total } = await getPrixodService(region_id, main_schet_id, offset, limit, from, to,);
  const pageCount = Math.ceil(total / limit);
  getLogger.info(`Bank prixod doclar olindi. UserId: ${req.user.id}`)
  const meta = {
    pageCount: pageCount,
    count: total,
    currentPage: page,
    nextPage: page >= pageCount ? null : page + 1,
    backPage: page === 1 ? null : page - 1,
    summa
  }
  resFunc(res, 200, data, meta)
});

module.exports = {
  create,
  getElementByIdBankPrixod,
  bank_prixod_update,
  getAllBankPrixod,
  delete_bank_prixod,
};
