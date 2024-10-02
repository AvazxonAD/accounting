const asyncHandler = require("../../middleware/asyncHandler");
const ErrorResponse = require("../../utils/errorResponse");

const {
  queryValidation,
} = require("../../helpers/validation/bank/bank.prixod.validation");
const {
  jur3Validation,
} = require("../../helpers/validation/bajarilgan_ishlar/jur_3.validation");
const { getByIdMainSchet } = require("../../service/spravochnik/main.schet.db");
const {
  getByIdOrganization,
} = require("../../service/spravochnik/organization.db");
const { getByIdShartnomaDB } = require("../../service/shartnoma/shartnoma.db");
const { getByIdOperatsii } = require("../../service/spravochnik/operatsii.db");
const {
  getByIdPodrazlanie,
} = require("../../service/spravochnik/podrazdelenie.db");
const { getByIdSostav } = require("../../service/spravochnik/sostav.db");
const {
  getByIdtype_operatsii,
} = require("../../service/spravochnik/type_operatsii.db");
const { returnAllChildSumma } = require("../../utils/returnSumma");
const { getLogger, postLogger, putLogger, deleteLogger } = require('../../helpers/log_functions/logger');

const {
  createJur3DB,
  createJur3ChildDB,
  getAllJur3DB,
  getAllJur3ChildDB,
  getElementByIdJur_3DB,
  deleteJur3ChildDB,
  updateJur3DB,
  deleteJur3DB,
} = require("../../service/bajarilgan_ishlar/jur_3.db");

// jur_3 create
const jur_3_create = asyncHandler(async (req, res, next) => {
  const { error, value } = jur3Validation.validate(req.body);
  if (error) {
    return next(new ErrorResponse(error.details[0].message, 400));
  }

  const region_id = req.user.region_id;
  const user_id = req.user.id;
  const main_schet_id = req.query.main_schet_id;

  const main_schet = await getByIdMainSchet(region_id, main_schet_id);
  if (!main_schet) {
    return next(new ErrorResponse("Server xatoli. Schet topilmadi"));
  }

  const spravochnik_operatsii_own = await getByIdOperatsii(
    value.spravochnik_operatsii_own_id,
    "Akt_priyom_peresdach",
  );
  if (!spravochnik_operatsii_own) {
    return next(
      new ErrorResponse(
        "Server xatolik. spravochnik_operatsii_own topilmadi",
        404,
      ),
    );
  }
  const organization = await getByIdOrganization(
    region_id,
    value.id_spravochnik_organization,
  );
  if (!organization) {
    return next(new ErrorResponse("spravochnik_organization topilmadi", 404));
  }

  if (value.shartnomalar_organization_id) {
    const shartnoma = await getByIdShartnomaDB(
      region_id,
      main_schet_id,
      value.shartnomalar_organization_id,
    );
    if (!shartnoma || !shartnoma.pudratchi_bool) {
      return next(
        new ErrorResponse("shartnomalar_organization topilmadi", 404),
      );
    }
  }

  for (let child of value.childs) {
    const spravochnik_operatsii = await getByIdOperatsii(
      child.spravochnik_operatsii_id,
      "Akt_priyom_peresdach",
    );
    if (!spravochnik_operatsii) {
      return next(new ErrorResponse("spravochnik_operatsii topilmadi", 404));
    }
    if (child.id_spravochnik_podrazdelenie) {
      const spravochnik_podrazdelenie = await getByIdPodrazlanie(
        region_id,
        child.id_spravochnik_podrazdelenie,
      );
      if (!spravochnik_podrazdelenie) {
        return next(
          new ErrorResponse("spravochnik_podrazdelenie topilmadi", 404),
        );
      }
    }
    if (child.id_spravochnik_sostav) {
      const spravochnik_sostav = await getByIdSostav(
        region_id,
        child.id_spravochnik_sostav,
      );
      if (!spravochnik_sostav) {
        return next(new ErrorResponse("spravochnik_sostav topilmadi", 404));
      }
    }
    if (child.id_spravochnik_type_operatsii) {
      const spravochnik_type_operatsii = await getByIdtype_operatsii(
        region_id,
        child.id_spravochnik_type_operatsii,
      );
      if (!spravochnik_type_operatsii) {
        return next(
          new ErrorResponse("spravochnik_type_operatsii topilmadi", 404),
        );
      }
    }
  }

  const summa = returnAllChildSumma(value.childs);

  const result = await createJur3DB({
    ...value,
    main_schet_id,
    user_id,
    summa,
  });

  for (let child of value.childs) {
    await createJur3ChildDB({
      ...child,
      main_schet_id,
      user_id,
      spravochnik_operatsii_own_id: value.spravochnik_operatsii_own_id,
      bajarilgan_ishlar_jur3_id: result.id,
    });
  }

  postLogger.info(`Jur3 doc muvaffaqiyatli kiritildi. UserId : ${user_id}`)
  res.status(201).json({
    success: true,
    data: "Muvaffaqiyatli kiritildi",
  });
});

// jur_3 get all
const jur_3_get_all = asyncHandler(async (req, res, next) => {
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

  const parents = await getAllJur3DB(
    region_id,
    main_schet_id,
    from,
    to,
    offset,
    limit,
  );
  const resultArray = [];
  for (let result of parents.rows) {
    const childs = await getAllJur3ChildDB(region_id, main_schet_id, result.id);

    let object = { ...result };
    object.childs = childs;
    resultArray.push(object);
  }

  const total = parents.total;
  const pageCount = Math.ceil(total / limit);
  const summa = parents.summa;

  getLogger.info(`Jur3 doclar muvaffaqiyatli olindi. UserId : ${user_id}`)
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

// jur_3 update
const jur_3_update = asyncHandler(async (req, res, next) => {
  const { error, value } = jur3Validation.validate(req.body);
  if (error) {
    return next(new ErrorResponse(error.details[0].message, 400));
  }

  const region_id = req.user.region_id;
  const user_id = req.user.id;
  const main_schet_id = req.query.main_schet_id;
  const id = req.params.id;

  const main_schet = await getByIdMainSchet(region_id, main_schet_id);
  if (!main_schet) {
    return next(new ErrorResponse("Server xatoli. Schet topilmadi"));
  }

  const old_value = await getElementByIdJur_3DB(region_id, main_schet_id, id);
  if (!old_value) {
    return next(new ErrorResponse("Server xatolik. Malumot topilmadi", 404));
  }

  const spravochnik_operatsii_own = await getByIdOperatsii(
    value.spravochnik_operatsii_own_id,
    "Akt_priyom_peresdach",
  );
  if (!spravochnik_operatsii_own) {
    return next(
      new ErrorResponse(
        "Server xatolik. spravochnik_operatsii_own topilmadi",
        404,
      ),
    );
  }
  const organization = await getByIdOrganization(
    region_id,
    value.id_spravochnik_organization,
  );
  if (!organization) {
    return next(new ErrorResponse("spravochnik_organization topilmadi", 404));
  }

  if (value.shartnomalar_organization_id) {
    const shartnoma = await getByIdShartnomaDB(
      region_id,
      main_schet_id,
      value.shartnomalar_organization_id,
    );
    if (!shartnoma || !shartnoma.pudratchi_bool) {
      return next(
        new ErrorResponse("shartnomalar_organization topilmadi", 404),
      );
    }
  }

  for (let child of value.childs) {
    const spravochnik_operatsii = await getByIdOperatsii(
      child.spravochnik_operatsii_id,
      "Akt_priyom_peresdach",
    );
    if (!spravochnik_operatsii) {
      return next(new ErrorResponse("spravochnik_operatsii topilmadi", 404));
    }
    if (child.id_spravochnik_podrazdelenie) {
      const spravochnik_podrazdelenie = await getByIdPodrazlanie(
        region_id,
        child.id_spravochnik_podrazdelenie,
      );
      if (!spravochnik_podrazdelenie) {
        return next(
          new ErrorResponse("spravochnik_podrazdelenie topilmadi", 404),
        );
      }
    }
    if (child.id_spravochnik_sostav) {
      const spravochnik_sostav = await getByIdSostav(
        region_id,
        child.id_spravochnik_sostav,
      );
      if (!spravochnik_sostav) {
        return next(new ErrorResponse("spravochnik_sostav topilmadi", 404));
      }
    }
    if (child.id_spravochnik_type_operatsii) {
      const spravochnik_type_operatsii = await getByIdtype_operatsii(
        region_id,
        child.id_spravochnik_type_operatsii,
      );
      if (!spravochnik_type_operatsii) {
        return next(
          new ErrorResponse("spravochnik_type_operatsii topilmadi", 404),
        );
      }
    }
  }

  const summa = returnAllChildSumma(value.childs);

  await updateJur3DB({ ...value, id });
  await deleteJur3ChildDB(id);

  for (let child of value.childs) {
    await createJur3ChildDB({
      ...child,
      main_schet_id,
      user_id,
      spravochnik_operatsii_own_id: value.spravochnik_operatsii_own_id,
      bajarilgan_ishlar_jur3_id: id,
    });
  }

  putLogger.info(`Jur3 doc muvaffaqiyatli yangilandi. UserId : ${user_id}`)
  res.status(201).json({
    success: true,
    data: "Muvaffaqiyatli yangilandi",
  });
});

// delete jur_3
const deleteJur_3 = asyncHandler(async (req, res, next) => {
  const main_schet_id = req.query.main_schet_id;
  const region_id = req.user.region_id;
  const id = req.params.id;

  const main_schet = await getByIdMainSchet(region_id, main_schet_id);
  if (!main_schet) {
    return next(new ErrorResponse("Server xatoli. Schet topilmadi"));
  }

  const test = await getElementByIdJur_3DB(region_id, main_schet_id, id);
  if (!test) {
    return next(
      new ErrorResponse(
        "Server xatolik. Bajarilgan ishlar document topilmadi",
        404,
      ),
    );
  }

  await deleteJur3ChildDB(id);
  await deleteJur3DB(id);

  deleteLogger.info(`Jur3 doc muvaffaqiyatli ochirildi. UserId : ${user_id}`)
  return res.status(200).json({
    success: true,
    data: "Muvaffaqiyatli ochirildi",
  });
});

// get element by id jur_3
const getElementByIdJur_3 = asyncHandler(async (req, res, next) => {
  const main_schet_id = req.query.main_schet_id;
  const region_id = req.user.region_id;
  const id = req.params.id;

  const main_schet = await getByIdMainSchet(region_id, main_schet_id);
  if (!main_schet) {
    return next(new ErrorResponse("Server xatoli. Schet topilmadi"));
  }

  const result = await getElementByIdJur_3DB(region_id, main_schet_id, id);

  if (!result) {
    return next(
      new ErrorResponse(
        "Server xatolik. Bajarilgan ishlar document topilmadi",
        404,
      ),
    );
  }

  const object = { ...result };
  object.childs = await getAllJur3ChildDB(region_id, main_schet_id, object.id);

  getLogger.info(`Jur3 doc muvaffaqiyatli olindi. UserId : ${user_id}`)
  return res.status(200).json({
    success: true,
    data: object,
  });
});

module.exports = {
  jur_3_create,
  jur_3_get_all,
  jur_3_update,
  getElementByIdJur_3,
  deleteJur_3,
};
