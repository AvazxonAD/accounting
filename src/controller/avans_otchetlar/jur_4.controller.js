const asyncHandler = require("../../middleware/asyncHandler");
const ErrorResponse = require("../../utils/errorResponse");

const { queryValidation } = require("../../helpers/validation/bank/bank.prixod.validation");
const { jur4Validation } = require("../../helpers/validation/avans_otchetlar/jur4.validation");
const { getByIdMainSchet } = require("../../service/spravochnik/main.schet.service");
const { getByIdPodotchet } = require("../../service/spravochnik/podotchet.litso.service");
const { getByIdOperatsii } = require("../../service/spravochnik/operatsii.service");
const { getByIdPodrazlanie } = require("../../service/spravochnik/podrazdelenie.service");
const { getByIdSostav } = require("../../service/spravochnik/sostav.service");
const { getByIdtype_operatsii } = require("../../service/spravochnik/type_operatsii.service");
const { returnAllChildSumma } = require("../../utils/returnSumma");
const { getLogger, postLogger, putLogger, deleteLogger } = require('../../helpers/log_functions/logger');

const {
  createJur4ChildDB,
  createJur4DB,
  getAllJur4ChildDB,
  getAllJur4DB,
  getByIdJur4DB,
  updateJur4DB,
  deleteJur4ChildDB,
  deleteJur4DB
} = require('../../service/avans_otchetlar/jur4.service')

// jur 4 create
const jur_4_create = asyncHandler(async (req, res, next) => {
  const region_id = req.user.region_id;
  const user_id = req.user.id;
  const main_schet_id = req.query.main_schet_id;

  const main_schet = await getByIdMainSchet(region_id, main_schet_id);
  if (!main_schet) {
    return next(new ErrorResponse("Server xatoli. Schet topilmadi"));
  }

  const { error, value } = jur4Validation.validate(req.body)
  if (error) {
    return next(new ErrorResponse(error.details[0].message, 400))
  }

  const podotchet_litso = await getByIdPodotchet(region_id, value.spravochnik_podotchet_litso_id)
  if (!podotchet_litso) {
    return next(new ErrorResponse("podotchet_litso topilmadi", 404));
  }
  const spravochnik_operatsii_own = await getByIdOperatsii(value.spravochnik_operatsii_own_id, 'avans_otchet')
  if (!spravochnik_operatsii_own) {
    return next(new ErrorResponse('Server xatolik. spravochnik_operatsii_own topilmadi', 404))
  }

  for (let child of value.childs) {
    if (child.spravochnik_operatsii_id) {
      const spravochnik_operatsii = await getByIdOperatsii(child.spravochnik_operatsii_id, 'avans_otchet')
      if (!spravochnik_operatsii) {
        return next(new ErrorResponse("spravochnik_operatsii topilmadi", 404));
      }
    }
    if (child.id_spravochnik_podrazdelenie) {
      const spravochnik_podrazdelenie = await getByIdPodrazlanie(region_id, child.id_spravochnik_podrazdelenie)
      if (!spravochnik_podrazdelenie) {
        return next(new ErrorResponse("spravochnik_podrazdelenie topilmadi", 404));
      }
    }
    if (child.id_spravochnik_sostav) {
      const spravochnik_sostav = await getByIdSostav(region_id, child.id_spravochnik_sostav)
      if (!spravochnik_sostav) {
        return next(new ErrorResponse("spravochnik_sostav topilmadi", 404));
      }
    }
    if (child.id_spravochnik_type_operatsii) {
      const spravochnik_type_operatsii = await getByIdtype_operatsii(region_id, child.id_spravochnik_type_operatsii)
      if (!spravochnik_type_operatsii) {
        return next(new ErrorResponse("spravochnik_type_operatsii topilmadi", 404));
      }
    }
  }

  const summa = returnAllChildSumma(value.childs)
  const result = await createJur4DB({ ...value, main_schet_id, user_id, summa })

  for (let child of value.childs) {
    await createJur4ChildDB({
      ...child,
      user_id,
      main_schet_id,
      avans_otchetlar_jur4_id: result.id,
      spravochnik_operatsii_own_id: value.spravochnik_operatsii_own_id
    })
  }

  postLogger.info(`Jur4 doc muvaffaqiyatli kiritildi. UserId : ${user_id}`)
  res.status(201).json({
    success: true,
    data: "Muvaffaqiyatli kiritildi",
  });
});

// jur 4 get all
const getAllJur_4 = asyncHandler(async (req, res, next) => {
  const region_id = req.user.region_id;
  const main_schet_id = req.query.main_schet_id;

  const main_schet = await getByIdMainSchet(region_id, main_schet_id);
  if (!main_schet) {
    return next(new ErrorResponse("Server xatoli. Schet topilmadi"));
  }

  const { error, value } = queryValidation.validate(req.query);
  if (error) {
    return next(new ErrorResponse(error.details[0].message), 400);
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

  const results = await getAllJur4DB(region_id, main_schet_id, from, to, offset, limit)

  const resultArray = [];

  for (let result of results.rows) {
    const prixod_child = await getAllJur4ChildDB(region_id, main_schet_id, result.id)

    let object = { ...result };
    object.childs = prixod_child;
    resultArray.push(object);
  }

  const total = results.total;
  const pageCount = Math.ceil(total / limit);
  const summa = results.summa;

  getLogger.info(`Jur4 doclar muvaffaqiyatli olindi. UserId : ${user_id}`)
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

// jur 4 update
const jur_4_update = asyncHandler(async (req, res, next) => {
  const region_id = req.user.region_id;
  const user_id = req.user.id;
  const main_schet_id = req.query.main_schet_id;
  const id = req.params.id

  const main_schet = await getByIdMainSchet(region_id, main_schet_id);
  if (!main_schet) {
    return next(new ErrorResponse("Server xatoli. Schet topilmadi"));
  }

  const test = await getByIdJur4DB(region_id, main_schet_id, id)
  if(!test){
    return next(new ErrorResponse("Server xatolik. Malumot topilmadi", 404))
  }

  const { error, value } = jur4Validation.validate(req.body)
  if (error) {
    return next(new ErrorResponse(error.details[0].message, 400))
  }

  const podotchet_litso = await getByIdPodotchet(region_id, value.spravochnik_podotchet_litso_id)
  if (!podotchet_litso) {
    return next(new ErrorResponse("podotchet_litso topilmadi", 404));
  }
  const spravochnik_operatsii_own = await getByIdOperatsii(value.spravochnik_operatsii_own_id, 'avans_otchet')
  if (!spravochnik_operatsii_own) {
    return next(new ErrorResponse('Server xatolik. spravochnik_operatsii_own topilmadi', 404))
  }

  for (let child of value.childs) {
    if (child.spravochnik_operatsii_id) {
      const spravochnik_operatsii = await getByIdOperatsii(child.spravochnik_operatsii_id, 'avans_otchet')
      if (!spravochnik_operatsii) {
        return next(new ErrorResponse("spravochnik_operatsii topilmadi", 404));
      }
    }
    if (child.id_spravochnik_podrazdelenie) {
      const spravochnik_podrazdelenie = await getByIdPodrazlanie(region_id, child.id_spravochnik_podrazdelenie)
      if (!spravochnik_podrazdelenie) {
        return next(new ErrorResponse("spravochnik_podrazdelenie topilmadi", 404));
      }
    }
    if (child.id_spravochnik_sostav) {
      const spravochnik_sostav = await getByIdSostav(region_id, child.id_spravochnik_sostav)
      if (!spravochnik_sostav) {
        return next(new ErrorResponse("spravochnik_sostav topilmadi", 404));
      }
    }
    if (child.id_spravochnik_type_operatsii) {
      const spravochnik_type_operatsii = await getByIdtype_operatsii(region_id, child.id_spravochnik_type_operatsii)
      if (!spravochnik_type_operatsii) {
        return next(new ErrorResponse("spravochnik_type_operatsii topilmadi", 404));
      }
    }
  }

  const summa = returnAllChildSumma(value.childs)
  await updateJur4DB({ ...value, id, summa})
  await deleteJur4ChildDB(id)

  for (let child of value.childs) {
    await createJur4ChildDB({
      ...child,
      user_id,
      main_schet_id,
      avans_otchetlar_jur4_id: id,
      spravochnik_operatsii_own_id: value.spravochnik_operatsii_own_id
    })
  }

  putLogger.info(`Jur4 doc muvaffaqiyatli yangilandi. UserId : ${user_id}`)
  res.status(201).json({
    success: true,
    data: "Muvaffaqiyatli yangilandi",
  });
});

// delete jur 4
const delete_jur_4 = asyncHandler(async (req, res, next) => {
  const region_id = req.user.region_id;
  const main_schet_id = req.query.main_schet_id;
  const id = req.params.id

  const main_schet = await getByIdMainSchet(region_id, main_schet_id);
  if (!main_schet) {
    return next(new ErrorResponse("Server xatoli. Schet topilmadi"));
  }

  const test = await getByIdJur4DB(region_id, main_schet_id, id)
  if (!test) {
    return next(new ErrorResponse("Server xatolik. Prixod documentlar topilmadi", 404));
  }

  await deleteJur4ChildDB(id)
  await deleteJur4DB(id)

  deleteLogger.info(`Jur4 doc muvaffaqiyatli ochirildi. UserId : ${user_id}`)
  return res.status(200).json({
    success: true,
    data: "Muvaffaqiyatli ochirildi",
  });
});

// get element by id jur 4
const getElementByIdjur_4 = asyncHandler(async (req, res, next) => {
  const region_id = req.user.region_id;
  const main_schet_id = req.query.main_schet_id;
  const id = req.params.id

  const main_schet = await getByIdMainSchet(region_id, main_schet_id);
  if (!main_schet) {
    return next(new ErrorResponse("Server xatoli. Schet topilmadi"));
  }

  const result = await getByIdJur4DB(region_id, main_schet_id, id, true)
  if (!result) {
    return next(new ErrorResponse("Server xatolik. Prixod documentlar topilmadi", 404));
  }

  const prixod_childs = await getAllJur4ChildDB(region_id, main_schet_id, id)
  let object = { ...result };
  object.childs = prixod_childs;

  postLogger.info(`Jur4 doc muvaffaqiyatli olindi. UserId : ${user_id}`)
  return res.status(200).json({
    success: true,
    data: object,
  });
});

module.exports = {
  jur_4_create,
  getAllJur_4,
  jur_4_update,
  delete_jur_4,
  getElementByIdjur_4,
};
