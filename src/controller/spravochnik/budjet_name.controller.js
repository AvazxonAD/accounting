const pool = require("../../config/db");
const asyncHandler = require("../../middleware/asyncHandler");
const ErrorResponse = require("../../utils/errorResponse");
const {
  checkValueString,
  checkValueNumber,
} = require("../../utils/check.functions");
const {
  getByNameBudjet,
  createBudjet,
  getAllBudjet,
  getByIdBudjet,
  updateBudjet,
  deleteBudjet,
} = require("../../service/spravochnik/budjet.name.db");

// create
const create = asyncHandler(async (req, res, next) => {
  let { name } = req.body;

  checkValueString(name);
  name = name.trim();

  const test = await getByNameBudjet(name);
  if (test) {
    return next(new ErrorResponse("Ushbu budjet nomi avval kiritilgan", 409));
  }

  const result = createBudjet(name);
  if (!result) {
    return next(new ErrorResponse("Server xatolik. Budjet kiritilmadi", 500));
  }

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
  const id = Number(req.params.id);
  checkValueNumber(id);

  let oldBudjet = await getByIdBudjet(req.params.id);
  if (!oldBudjet) {
    return next(new ErrorResponse("Server xatolik. Budjet topilmadi", 404));
  }

  let { name } = req.body;

  checkValueString(name);
  name = name.trim();

  if (oldBudjet.name !== name) {
    const test_name = await getByNameBudjet(name);
    if (test_name) {
      return next(new ErrorResponse("Ushbu budjet nomi avval kiritilgan", 409));
    }
  }

  const result = await updateBudjet(name, id);
  if (!result) {
    return next(new ErrorResponse("Server xatolik. Budjet yangilanmadi", 500));
  }

  return res.status(200).json({
    success: true,
    data: "Muvafaqyatli yangilandi",
  });
});

// delete value
const deleteValue = asyncHandler(async (req, res, next) => {
  const id = Number(req.params.id);
  checkValueNumber(id);

  const oldBudjet = await getByIdBudjet(id);
  if (!oldBudjet) {
    return next(new ErrorResponse("Server xatolik. Budjet topilmadi", 404));
  }

  const deleteValue = await deleteBudjet(id);

  if (!deleteValue) {
    return next(new ErrorResponse("Server xatolik. Budjet ochirilmadi", 500));
  }

  return res.status(200).json({
    success: true,
    data: "Muvaffaqiyatli ochirildi",
  });
});

// get element by id
const getElementById = asyncHandler(async (req, res, next) => {
  const id = Number(req.params.id);
  checkValueNumber(id);

  let result = await getByIdBudjet(id);
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
