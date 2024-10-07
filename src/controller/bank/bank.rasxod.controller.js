const asyncHandler = require("../../middleware/asyncHandler");
const ErrorResponse = require("../../utils/errorResponse");
const pool = require("../../config/db");

const { getByIdMainSchet } = require("../../service/spravochnik/main.schet.service");
const {
  getByIdOrganization,
} = require("../../service/spravochnik/organization.service");
const {
  getByIdAndOrganizationIdShartnoma,
} = require("../../service/shartnoma/shartnoma.service");
const { getByIdOperatsii } = require("../../service/spravochnik/operatsii.service");
const {
  getByIdPodrazlanie,
} = require("../../service/spravochnik/podrazdelenie.service");
const { getByIdSostav } = require("../../service/spravochnik/sostav.service");
const {
  getByIdtype_operatsii,
} = require("../../service/spravochnik/type_operatsii.service");

const {
  bankRasxodValidation,
  bankRasxodChildValidation,
} = require("../../helpers/validation/bank/bank.rasxod.validation");

const { returnAllChildSumma } = require("../../utils/returnSumma");

const {
  createBankRasxodDb,
  createBankRasxodChild,
  getByIdRasxod,
  updateRasxod,
  getAllRasxodChildDb,
  getAllBankRasxodByFromAndTo,
  getElementByIdRasxod,
  getElemenByIdRasxodChild,
  deleteRasxodChild,
  deleteBankRasxod,
} = require("../../service/bank/bank.rasxod.service");

const {
  queryValidation,
} = require("../../helpers/validation/bank/bank.prixod.validation");
const { getLogger, postLogger, putLogger, deleteLogger } = require('../../helpers/log_functions/logger');

// bank rasxod
const bank_rasxod = asyncHandler(async (req, res, next) => {
  const main_schet_id = req.query.main_schet_id;
  const region_id = req.user.region_id;
  const user_id = req.user.id;

  const { error, value } = bankRasxodValidation.validate(req.body);
  if (error) {
    return next(new ErrorResponse(error.details[0].message, 400));
  }

  const main_schet = await getByIdMainSchet(region_id, main_schet_id);
  if (!main_schet) {
    return next(new ErrorResponse("Server xatoli. Schet topilmadi", 404));
  }

  const organization = await getByIdOrganization(
    region_id,
    value.id_spravochnik_organization,
  );
  if (!organization) {
    return next(new ErrorResponse("Hamkor korxona topilmadi", 404));
  }

  if (value.id_shartnomalar_organization) {
    const contract = await getByIdAndOrganizationIdShartnoma(
      region_id,
      main_schet_id,
      value.id_shartnomalar_organization,
      value.id_spravochnik_organization,
    );
    if (!contract) {
      return next(new ErrorResponse("Shartnoma topilmadi", 404));
    }
  }

  const spravochnik_operatsii = await getByIdOperatsii(
    value.spravochnik_operatsii_own_id,
    "bank_rasxod",
  );
  if (!spravochnik_operatsii) {
    return next(
      new ErrorResponse(
        "Server xatolik. spravochnik_operatsii_own  topilmadi",
        404,
      ),
    );
  }

  for (let child of value.childs) {
    const { error, value } = bankRasxodChildValidation.validate(child);
    if (error) {
      return next(new ErrorResponse(error.details[0].message, 400));
    }

    const spravochnik_operatsii = await getByIdOperatsii(
      value.spravochnik_operatsii_id,
      "bank_rasxod",
    );
    if (!spravochnik_operatsii) {
      return next(new ErrorResponse("spravochnik_operatsii topilmadi", 404));
    }
    if (value.id_spravochnik_podrazdelenie) {
      const spravochnik_podrazdelenie = await getByIdPodrazlanie(
        region_id,
        value.id_spravochnik_podrazdelenie,
      );
      if (!spravochnik_podrazdelenie) {
        return next(
          new ErrorResponse("spravochnik_podrazdelenie topilmadi", 404),
        );
      }
    }
    if (value.id_spravochnik_sostav) {
      const spravochnik_sostav = await getByIdSostav(
        region_id,
        value.id_spravochnik_sostav,
      );
      if (!spravochnik_sostav) {
        return next(new ErrorResponse("spravochnik_sostav topilmadi", 404));
      }
    }
    if (value.id_spravochnik_type_operatsii) {
      const spravochnik_type_operatsii = await getByIdtype_operatsii(
        region_id,
        value.id_spravochnik_type_operatsii,
      );
      if (!spravochnik_type_operatsii) {
        return next(
          new ErrorResponse("spravochnik_type_operatsii topilmadi", 404),
        );
      }
    }
  }

  const summa = returnAllChildSumma(value.childs);
  const rasxod = await createBankRasxodDb({
    ...value,
    main_schet_id,
    user_id,
    summa,
  });

  for (let child of value.childs) {
    await createBankRasxodChild({
      ...child,
      jur2_schet: main_schet.jur2_schet,
      jur2_subschet: main_schet.jur2_subschet,
      main_schet_id,
      rasxod_id: rasxod.id,
      user_id,
      spravochnik_operatsii_own_id: value.spravochnik_operatsii_own_id,
    });
  }

  postLogger.info(`Bank rasxod doc kiritildi. UserId: ${req.user.id}`)
  return res.status(201).json({
    success: true,
    data: "Muvaffaqiyatli kiritildi",
  });
});

// bank rasxod update
const bank_rasxod_update = asyncHandler(async (req, res, next) => {
  const main_schet_id = req.query.main_schet_id;
  const region_id = req.user.region_id;
  const user_id = req.user.id;
  const id = req.params.id;
  const bank_rasxod = await getByIdRasxod(region_id, main_schet_id, id);
  if (!bank_rasxod) {
    return next(new ErrorResponse("Prixod document topilmadi", 404));
  }

  const { error, value } = bankRasxodValidation.validate(req.body);
  if (error) {
    return next(new ErrorResponse(error.details[0].message, 400));
  }

  const main_schet = await getByIdMainSchet(region_id, main_schet_id);
  if (!main_schet) {
    return next(new ErrorResponse("Server xatoli. Schet topilmadi", 404));
  }

  const organization = await getByIdOrganization(
    region_id,
    value.id_spravochnik_organization,
  );
  if (!organization) {
    return next(new ErrorResponse("Hamkor korxona topilmadi", 404));
  }

  if (value.id_shartnomalar_organization) {
    const contract = await getByIdAndOrganizationIdShartnoma(
      region_id,
      main_schet_id,
      value.id_shartnomalar_organization,
      value.id_spravochnik_organization,
    );
    if (!contract) {
      return next(new ErrorResponse("Shartnoma topilmadi", 404));
    }
  }

  const spravochnik_operatsii = await getByIdOperatsii(
    value.spravochnik_operatsii_own_id,
    "bank_rasxod",
  );
  if (!spravochnik_operatsii) {
    return next(
      new ErrorResponse(
        "Server xatolik. spravochnik_operatsii_own  topilmadi",
        404,
      ),
    );
  }

  for (let child of value.childs) {
    const { error, value } = bankRasxodChildValidation.validate(child);
    if (error) {
      return next(new ErrorResponse(error.details[0].message, 400));
    }

    const spravochnik_operatsii = await getByIdOperatsii(
      value.spravochnik_operatsii_id,
      "bank_rasxod",
    );
    if (!spravochnik_operatsii) {
      return next(new ErrorResponse("spravochnik_operatsii topilmadi", 404));
    }
    if (value.id_spravochnik_podrazdelenie) {
      const spravochnik_podrazdelenie = await getByIdPodrazlanie(
        region_id,
        value.id_spravochnik_podrazdelenie,
      );
      if (!spravochnik_podrazdelenie) {
        return next(
          new ErrorResponse("spravochnik_podrazdelenie topilmadi", 404),
        );
      }
    }
    if (value.id_spravochnik_sostav) {
      const spravochnik_sostav = await getByIdSostav(
        region_id,
        value.id_spravochnik_sostav,
      );
      if (!spravochnik_sostav) {
        return next(new ErrorResponse("spravochnik_sostav topilmadi", 404));
      }
    }
    if (value.id_spravochnik_type_operatsii) {
      const spravochnik_type_operatsii = await getByIdtype_operatsii(
        region_id,
        value.id_spravochnik_type_operatsii,
      );
      if (!spravochnik_type_operatsii) {
        return next(
          new ErrorResponse("spravochnik_type_operatsii topilmadi", 404),
        );
      }
    }
  }
  const summa = returnAllChildSumma(value.childs);
  await updateRasxod({
    ...value,
    id,
    summa,
  });

  await deleteRasxodChild(id);

  for (let child of value.childs) {
    await createBankRasxodChild({
      ...child,
      jur2_schet: main_schet.jur2_schet,
      jur2_subschet: main_schet.jur2_subschet,
      main_schet_id,
      rasxod_id: id,
      user_id,
      spravochnik_operatsii_own_id: value.spravochnik_operatsii_own_id,
    });
  }

  putLogger.info(`Bank rasxod doc yangilandi. UserId: ${req.user.id}`)
  return res.status(200).json({
    success: true,
    data: "Muvaffaqiyatli yangilandi",
  });
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

  all_rasxod = await getAllBankRasxodByFromAndTo(
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
  const main_schet = await getByIdMainSchet(region_id, main_schet_id);
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
