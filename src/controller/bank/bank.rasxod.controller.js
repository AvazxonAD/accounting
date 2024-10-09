const { createBankRasxodDb, createBankRasxodChild, getByIdRasxodService, updateRasxodService, getBankRasxodService, deleteRasxodChild, deleteBankRasxod } = require("../../service/bank/bank.rasxod.service");
const asyncHandler = require("../../middleware/asyncHandler");
const ErrorResponse = require("../../utils/errorResponse");
const { getByIdMainSchetService } = require("../../service/spravochnik/main.schet.service");
const { getByIdOrganizationService } = require("../../service/spravochnik/organization.service");
const { getByIdAndOrganizationIdShartnoma } = require("../../service/shartnoma/shartnoma.service");
const { getByIdOperatsiiService } = require("../../service/spravochnik/operatsii.service");
const { getByIdPodrazlanieService } = require("../../service/spravochnik/podrazdelenie.service");
const { getByIdSostavService } = require("../../service/spravochnik/sostav.service");
const { getByIdTypeOperatsiiService } = require("../../service/spravochnik/type_operatsii.service");
const { bankRasxodValidation } = require("../../helpers/validation/bank/bank.rasxod.validation");
const { returnAllChildSumma } = require("../../utils/returnSumma");
const { queryValidation } = require("../../helpers/validation/bank/bank.prixod.validation");
const { getLogger, postLogger, putLogger, deleteLogger } = require('../../helpers/log_functions/logger');

// bank rasxod
const bank_rasxod = asyncHandler(async (req, res, next) => {
  const main_schet_id = req.query.main_schet_id;
  const region_id = req.user.region_id;
  const user_id = req.user.id;
  const data = validationResponse(bankRasxodValidation, req.body)
  await getByIdMainSchetService(region_id, main_schet_id);
  await getByIdOrganizationService(region_id, data.id_spravochnik_organization);
  if (data.id_shartnomalar_organization) {
    await getByIdAndOrganizationIdShartnoma(
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
    if (child.id_spravochnik_podotchet_litso) {
      await getByIdPodotchetService(region_id, child.id_spravochnik_podotchet_litso);
    }
  }
  const summa = returnAllChildSumma(data.childs);
  const rasxod = await createBankRasxodDb({ ...data, main_schet_id, user_id, provodki_boolean: true, summa, });
  const childs = []
  for (let child of data.childs) {
    const result = await createBankRasxodChild({ ...child, main_schet_id: main_schet_id, bank_rasxod_id: rasxod.id, user_id });
    childs.push(result)
  }
  rasxod.childs = childs
  postLogger.info(`Bank prixod doc yaratildi. UserId: ${req.user.id}`)
  resFunc(res, 201, rasxod)
});

// bank rasxod update
const bank_rasxod_update = asyncHandler(async (req, res, next) => {
  const main_schet_id = req.query.main_schet_id;
  const id = req.params.id;
  const region_id = req.user.region_id;
  const user_id = req.user.id;
  await getByIdRasxodService(region_id, main_schet_id, id);
  const data = validationResponse(bankRasxodValidation, req.body)
  await getByIdMainSchetService(region_id, main_schet_id);
  await getByIdOrganizationService(region_id, data.id_spravochnik_organization);
  if (data.id_shartnomalar_organization) {
    await getByIdAndOrganizationIdShartnoma(region_id, main_schet_id, data.id_shartnomalar_organization, data.id_spravochnik_organization);
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
      await getByIdPodotchetService(region_id, child.id_spravochnik_podotchet_litso);
    }
  }
  const summa = returnAllChildSumma(data.childs);
  const prixod = await updateRasxodService({ ...data, id, provodki_boolean: true, summa });
  await deleteRasxodChild(id);
  const childs = []
  for (let child of data.childs) {
    const result = await createBankPrixodServiceChild({ ...child, bank_prixod_id: id, user_id, spravochnik_operatsii_own_id: data.spravochnik_operatsii_own_id });
    childs.push(result)
  }
  prixod.childs = childs
  putLogger.info(`Bank prixod doc yangilandi. UserId: ${req.user.id}`)
  resFunc(res, 200, prixod)
});

// get all bank rasxod
const getAllBankRasxod = asyncHandler(async (req, res, next) => {
  const region_id = req.user.region_id;
  let all_rasxod = null;
  let totalQuery = null;
  let summa = null;

  const { error, value } = queryValidation.validate(req.query);
  if (error) {
    return next(new ErrorResponse(error.details[0].message, 400));
  }

  const limit = parseInt(value.limit) || 10;
  const page = parseInt(value.page) || 1;
  const from = value.from;
  const to = value.to;

  if (limit <= 0 || page <= 0) {
    return next(
      new ErrorResponse("Limit va page musbat sonlar bo'lishi kerak", 400),
    );
  }

  const offset = (page - 1) * limit;

  all_rasxod = await getBankRasxodService(
    region_id,
    value.main_schet_id,
    offset,
    limit,
    from,
    to,
  );
  totalQuery = all_rasxod.totalQuery;
  summa = Number(all_rasxod.summa);

  const resultArray = [];

  for (let rasxod of all_rasxod.rasxod_rows) {
    const rasxod_child = await getAllRasxodChildDb(region_id, rasxod.id);
    let object = { ...rasxod };
    object.summa = Number(object.summa);
    object.childs = rasxod_child.map((item) => {
      let result = { ...item };
      result.summa = Number(result.summa);
      return result;
    });
    resultArray.push(object);
  }

  const total = Number(totalQuery.count);
  const pageCount = Math.ceil(total / limit);
  return res.status(200).json({
    success: true,
    meta: {
      pageCount: pageCount,
      count: total,
      currentPage: page,
      nextPage: page >= pageCount ? null : page + 1,
      backPage: page === 1 ? null : page - 1,
      summa,
    },
    data: resultArray,
  });
});

// get element by id bank rasxod
const getElementByIdBankRasxod = asyncHandler(async (req, res, next) => {
  const main_schet_id = req.query.main_schet_id;
  const id = req.params.id;
  const region_id = req.user.region_id;
  const rasxod = await getElementByIdRasxod(region_id, main_schet_id, id, true);
  if (!rasxod) {
    return next(
      new ErrorResponse("Server xatolik. Rasxod document topilmadi", 404),
    );
  }

  const rasxod_child = await getElemenByIdRasxodChild(region_id, rasxod.id);
  let object = { ...rasxod };
  object.summa = Number(object.summa);
  object.childs = rasxod_child.map((item) => {
    let result = { ...item };
    result.summa = Number(result.summa);
    return result;
  });

  getLogger.info(`Bank rasxod doclar olindi. UserId: ${req.user.id}`)
  return res.status(200).json({
    success: true,
    data: object,
  });
});

// delete bank_rasxod
const delete_bank_rasxod = asyncHandler(async (req, res, next) => {
  const main_schet_id = req.query.main_schet_id;
  const region_id = req.user.region_id;
  const id = req.params.id;
  const main_schet = await getByIdMainSchetService(region_id, main_schet_id);
  if (!main_schet) {
    return next(new ErrorResponse("Server xatolik. Main schet topilmadi", 500));
  }

  const test = await getElementByIdRasxod(region_id, main_schet_id, id);
  if (!test) {
    return next(new ErrorResponse("Server xatolik. Rasxod doc topilmadi", 404));
  }

  await deleteBankRasxod(id);

  return res.status(200).json({
    success: true,
    data: "Muvaffaqiyatli ochirildi",
  });
});

module.exports = {
  delete_bank_rasxod,
  getElementByIdBankRasxod,
  getAllBankRasxod,
  bank_rasxod,
  bank_rasxod_update,
};
