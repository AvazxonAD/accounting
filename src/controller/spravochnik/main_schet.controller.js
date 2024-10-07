const pool = require("../../config/db");
const asyncHandler = require("../../middleware/asyncHandler");
const ErrorResponse = require("../../utils/errorResponse");
const { getByIdBudjet } = require("../../service/spravochnik/budjet.name.service");
const { mainSchetValidator, queryMainSchetValidation } = require("../../helpers/validation/spravochnik/main_schet.validation");
const {
  createMain_schet,
  getByIdMainSchet,
  getAllMain_schet,
  updateMain_schet,
  deleteMain_schet,
  checkMainSchetDB,
  getByAndAccountNumber,
  getByBudjetIdMainSchetService
} = require("../../service/spravochnik/main.schet.service");
const { resFunc } = require("../../helpers/resFunc");

// create
const create = asyncHandler(async (req, res, next) => {
  const { error, value } = mainSchetValidator.validate(req.body);
  if (error) {
    return next(new ErrorResponse(error.details[0].message), 400);
  }
  if (value.tashkilot_inn.toString().length !== 9) {
    return next(
      new ErrorResponse("Inn raqami 9 xonalik raqam bolishi kerak", 400),
    );
  }
  const test_budjet = await getByIdBudjet(value.spravochnik_budjet_name_id);
  if (!test_budjet) {
    return next(new ErrorResponse("Server xatolik. Budjet topilmadi", 404));
  }
  const test_account_number = await getByAndAccountNumber(value.account_number)
  if (test_account_number) {
    return next(new ErrorResponse("Ushbu hisob raqami avval kiritilgan", 400))
  }
  await createMain_schet({
    ...value,
    user_id: req.user.id,
  });
  return res.status(201).json({
    success: true,
    data: "Muvafaqyatli kiritildi",
  });
});

// get all
const getAll = asyncHandler(async (req, res, next) => {
  const { error, value } = queryMainSchetValidation.validate(req.query);
  if (error) {
    return next(new ErrorResponse(error.details[0].message, 400));
  }

  const limit = parseInt(value.limit) || 10;
  const page = parseInt(value.page) || 1;
  const offset = (page - 1) * limit;

  if (limit <= 0 || page <= 0) {
    return next(
      new ErrorResponse("Limit va page musbat sonlar bo'lishi kerak", 400),
    );
  }

  const result = await getAllMain_schet(req.user.region_id, offset, limit);

  const total = Number(result.total.count);
  const pageCount = Math.ceil(total / limit);

  return res.status(200).send({
    success: true,
    meta: {
      pageCount: pageCount,
      count: total,
      currentPage: page,
      nextPage: page >= pageCount ? null : page + 1,
      backPage: page === 1 ? null : page - 1,
    },
    data: result.main_schet_rows,
  });
});

// update
const update = asyncHandler(async (req, res, next) => {
  const region_id = req.user.region_id;
  const id = req.params.id;

  const testMain_schet = await getByIdMainSchet(region_id, id);
  if (!testMain_schet) {
    return next(new ErrorResponse("Server xatolik. Schet topilmadi", 404));
  }

  const { error, value } = mainSchetValidator.validate(req.body);
  if (error) {
    return next(new ErrorResponse(error.details[0].message, 400));
  }
  if (value.account_number !== testMain_schet.account_number) {
    const test_account_number = await getByAndAccountNumber(value.account_number)
    if (test_account_number) {
      return next(new ErrorResponse("Ushbu hisob raqami avval kiritilgan", 400))
    }
  }
  const test_budjet = await getByIdBudjet(value.spravochnik_budjet_name_id);
  if (!test_budjet) {
    return next(new ErrorResponse("Server xatolik. Budjet topilmadi", 404));
  }

  await updateMain_schet({
    ...value,
    id,
  });

  return res.status(201).json({
    success: true,
    data: "Muvafaqyatli yangilandi",
  });
});

// delete value
const deleteValue = asyncHandler(async (req, res, next) => {
  const region_id = req.user.region_id;
  const id = req.params.id;

  const value = await getByIdMainSchet(region_id, id);
  if (!value) {
    return next(new ErrorResponse("Server xatolik. Malumot topilmadi", 404));
  }

  const test = await checkMainSchetDB(id)
  if (!test) {
    return next(new ErrorResponse('There are documents linked to this account', 400))
  }
  await deleteMain_schet(id);

  return res.status(200).json({
    success: true,
    data: "Muvaffaqiyatli ochirildi",
  });
});

// get element by id
const getElementById = asyncHandler(async (req, res, next) => {
  const value = await getByIdMainSchet(req.user.region_id, req.params.id, true);
  if (!value) {
    return next(new ErrorResponse("Server error. main_schet topilmadi", 404));
  }

  return res.status(200).json({
    success: true,
    data: value,
  });
});

// get by budjet id 
const getByBudjetIdMainSchet = asyncHandler(async (req, res, next) => {
  const region_id = req.query.region_id;
  const budjet_id = req.query.budjet_id;
  const result = await getByBudjetIdMainSchetService(budjet_id, region_id);
  resFunc(res, 200, result)
});


module.exports = {
  getElementById,
  create,
  getAll,
  deleteValue,
  update,
  getByBudjetIdMainSchet
};
