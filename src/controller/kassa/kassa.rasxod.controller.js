const {
  kassaRasxodCreateDB,
  kassaRasxodChild,
  getAllKassaRasxodDb,
  getElementById,
  updateKassaRasxodDB,
  deleteKassaRasxodChild,
  deleteKassaRasxodDB,
} = require("../../service/kassa/kassa.rasxod.service");
const asyncHandler = require("../../middleware/asyncHandler");
const ErrorResponse = require("../../utils/errorResponse");
const { kassaValidation } = require("../../helpers/validation/kassa/kassa.validation");
const { queryValidation } = require("../../helpers/validation/bank/bank.prixod.validation");
const { getByIdMainSchetService } = require("../../service/spravochnik/main.schet.service");
const { getByIdPodotchetService } = require("../../service/spravochnik/podotchet.litso.service");
const { getByIdOperatsiiService } = require("../../service/spravochnik/operatsii.service");
const { getByIdPodrazlanieService } = require("../../service/spravochnik/podrazdelenie.service");
const { getByIdSostavService } = require("../../service/spravochnik/sostav.service");
const { getByIdTypeOperatsiiService } = require("../../service/spravochnik/type_operatsii.service");
const { returnAllChildSumma } = require("../../utils/returnSumma");
const { validationResponse } = require("../../helpers/response-for-validation");
const { resFunc } = require("../../helpers/resFunc");

// kassa rasxod rasxod
const kassaRasxodCreate = asyncHandler(async (req, res, next) => {
  const main_schet_id = req.query.main_schet_id;
  const user_id = req.user.id;
  const region_id = req.user.region_id;
  const data = validationResponse(kassaValidation, req.body)
  await getByIdMainSchetService(region_id, main_schet_id);
  if (data.id_podotchet_litso) {
    await getByIdPodotchetService(region_id, data.id_podotchet_litso);
  }
  for (let child of data.childs) {
    await getByIdOperatsiiService(child.spravochnik_operatsii_id, "kassa_rasxod");
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
  const kassa_rasxod = await kassaRasxodCreateDB({ ...data, user_id, main_schet_id, summa });
  const childs = []
  for (let child of data.childs) {
    const result = await kassaRasxodChild({ ...child, user_id, main_schet_id, kassa_rasxod_id: kassa_rasxod.id });
    childs.push(result)
  }
  resFunc(res, 200, kassa_rasxod)
});

// get all kassa rasxod
const getAllKassaRasxod = asyncHandler(async (req, res, next) => {
  const { main_schet_id, page, limit, from, to } = validationResponse(queryValidation, req.body)
  const region_id = req.user.region_id;
  await getByIdMainSchetService(region_id, main_schet_id);
  const offset = (page - 1) * limit;
  const { data, total, summa } = await getAllKassaRasxodDb(region_id, main_schet_id, from, to, offset, limit);
  const pageCount = Math.ceil(total / limit);
  const meta = {
    pageCount: pageCount,
    count: total,
    currentPage: page,
    nextPage: page >= pageCount ? null : page + 1,
    backPage: page === 1 ? null : page - 1,
    summa,
  }
  resFunc(res, 200, data, meta)
});

// kassa rasxod update
const updateKassaRasxodBank = asyncHandler(async (req, res, next) => {
  const main_schet_id = req.query.main_schet_id;
  const region_id = req.user.region_id;
  const id = req.params.id;
  const user_id = req.user.id;
  await getElementById(region_id, main_schet_id, id);
  await getByIdMainSchetService(region_id, main_schet_id);
  if (data.id_podotchet_litso) {
    await getByIdPodotchetService(region_id, data.id_podotchet_litso);
  }
  for (let child of data.childs) {
    await getByIdOperatsiiService(child.spravochnik_operatsii_id, "kassa_rasxod");
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
  const rasxod = await updateKassaRasxodDB({ ...value, id, summa });

  await deleteKassaRasxodChild(id);

  for (let child of value.childs) {
    await kassaRasxodChild({
      ...child,
      user_id,
      main_schet_id,
      kassa_rasxod_id: id
    });
  }

  res.status(201).json({
    success: true,
    data: "Muvaffaqiyatli yangilandi",
  });
});

// delete kassa rasxod rasxod
const deleteKassaRasxodRasxod = asyncHandler(async (req, res, next) => {
  const main_schet_id = req.query.main_schet_id;
  const region_id = req.user.region_id;
  const id = req.params.id;

  const main_schet = await getByIdMainSchetService(region_id, main_schet_id);
  if (!main_schet) {
    return next(new ErrorResponse("Server xatoli. Schet topilmadi", 404));
  }

  const test = await getElementById(region_id, main_schet_id, id);
  if (!test) {
    return next(
      new ErrorResponse("Server xatolik. Rasxod document topilmadi", 404),
    );
  }

  await deleteKassaRasxodDB(id);

  return res.status(200).json({
    success: true,
    data: "Muvaffaqiyatli ochirildi",
  });
});

// get element by id kassa rasxod
const getElementByIdKassaRasxod = asyncHandler(async (req, res, next) => {
  const main_schet_id = req.query.main_schet_id;
  const region_id = req.user.region_id;
  const id = req.params.id;

  const result = await getElementById(region_id, main_schet_id, id, true);
  if (!result) {
    return next(
      new ErrorResponse("Server xatolik. Rasxod document topilmadi", 404),
    );
  }

  const rasxod_childs = await getAllKassaRasxodChild(
    region_id,
    main_schet_id,
    result.id,
  );

  let object = { ...result };
  object.summa = Number(object.summa);
  object.childs = rasxod_childs.map((item) => {
    item.summa = Number(item.summa);
    return item;
  });

  return res.status(200).json({
    success: true,
    data: object,
  });
});

module.exports = {
  kassaRasxodCreate,
  getAllKassaRasxod,
  updateKassaRasxodBank,
  deleteKassaRasxodRasxod,
  getElementByIdKassaRasxod,
};
