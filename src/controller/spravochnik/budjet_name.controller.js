const pool = require("../../config/db");
const asyncHandler = require("../../middleware/asyncHandler");
const ErrorResponse = require("../../utils/errorResponse");
const {
  budjetValidation,
} = require("../../helpers/validation/spravochnik/budejet.validation");

const {
  getByNameBudjet,
  createBudjet,
  getAllBudjet,
  getByIdBudjet,
  updateBudjet,
  deleteBudjet,
} = require("../../service/spravochnik/budjet.name.service");

// create
const create = asyncHandler(async (req, res, next) => {
  const { error, value } = budjetValidation.validate(req.body);
  if (error) {
    return next(new ErrorResponse(error.details[0], 400));
  }

  const test = await getByNameBudjet(value.name);
  if (test) {
    return next(new ErrorResponse("Ushbu budjet nomi avval kiritilgan", 409));
  }

  await createBudjet(value.name);

  return res.status(201).json({
    success: true,
    data: "Muvafaqyatli kiritildi",
  });
});

// get all
const getAll = asyncHandler(async (req, res, next) => {
  const result = await getAllBudjet();
  return res.status(200).json({
    success: true,
    data: result,
  });
});

// update
const update = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  let oldBudjet = await getByIdBudjet(req.params.id);
  if (!oldBudjet) {
    return next(new ErrorResponse("Server xatolik. Budjet topilmadi", 404));
  }

  const { error, value } = budjetValidation.validate(req.body);
  if (error) {
    return next(new ErrorResponse(error.details[0].message, 400));
  }

  if (oldBudjet.name !== value.name) {
    const test_name = await getByNameBudjet(value.name);
    if (test_name) {
      return next(new ErrorResponse("Ushbu budjet nomi avval kiritilgan", 409));
    }
  }

  await updateBudjet(value.name, id);

  return res.status(200).json({
    success: true,
    data: "Muvafaqyatli yangilandi",
  });
});

// delete value
const deleteValue = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  const oldBudjet = await getByIdBudjet(id);
  if (!oldBudjet) {
    return next(new ErrorResponse("Server xatolik. Budjet topilmadi", 404));
  }

  await deleteBudjet(id);

  return res.status(200).json({
    success: true,
    data: "Muvaffaqiyatli ochirildi",
  });
});

// get element by id
const getElementById = asyncHandler(async (req, res, next) => {
  let result = await getByIdBudjet(req.params.id, true);
  if (!result) {
    return next(
      new ErrorResponse("Server error. spravochnik_budjet_name topilmadi"),
    );
  }

  return res.status(200).json({
    success: true,
    data: result,
  });
});

module.exports = {
  getElementById,
  create,
  getAll,
  deleteValue,
  update,
};
