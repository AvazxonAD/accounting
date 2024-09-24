const pool = require("../../config/db");
const asyncHandler = require("../../middleware/asyncHandler");
const ErrorResponse = require("../../utils/errorResponse");
const { checkValueString } = require("../../utils/check.functions");
const {
  getByNameRegion,
  create_region,
  get_all_region,
  getByIdRegion,
  update_region,
  delete_region,
} = require("../../service/region.db");

// create region
const createRegion = asyncHandler(async (req, res, next) => {
  let { name } = req.body;

  checkValueString(name);
  name = name.trim();

  const test = await getByNameRegion(name);
  if (test) {
    return next(new ErrorResponse("Ushbu viloyat avval kiritilgan", 409));
  }

  const result = await create_region(name);
  if (!result) {
    return next(new ErrorResponse("Server xatolik. Malumot kiritilmadi", 500));
  }

  return res.status(201).json({
    success: true,
    data: "Muvafaqyatli kiritildi",
  });
});

// get all regions
const getAllReegions = asyncHandler(async (req, res, next) => {
  const result = await get_all_region();
  return res.status(200).json({
    success: true,
    data: result,
  });
});

// update region
const updateRegion = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const region = getByIdRegion(id);
  if (!region) {
    return next(new ErrorResponse("Server xatolik. Viloyat topilmadi", 404));
  }

  let { name } = req.body;

  checkValueString(name);
  name = name.trim();

  if (region.name !== name) {
    const test = await getByNameRegion(name);
    if (test) {
      return next(new ErrorResponse("Ushbu viloyat avval kiritilgan", 409));
    }
  }

  const result = await update_region(id, name);
  if (!result) {
    return next(new ErrorResponse("Server xatolik. Malumot yangilamadi", 500));
  }

  return res.status(200).json({
    success: true,
    data: "Muvafaqyatli yangilandi",
  });
});

// delete region
const deleteRegion = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const region = await getByIdRegion(id);
  if (!region) {
    return next(new ErrorResponse("Server xatolik. Viloyat topilmadi", 404));
  }

  const deleteRegion = await delete_region(id);

  if (!deleteRegion) {
    return next(new ErrorResponse("Server xatolik. Viloyat ochirilmadi", 500));
  }

  return res.status(200).json({
    success: true,
    data: "Muvaffaqiyatli ochirildi",
  });
});

const getElementById = asyncHandler(async (req, res, next) => {
  const region = await getByIdRegion(req.params.id);
  if (!region) {
    return next(new ErrorResponse("Server xatolik. Region topilmadi", 404));
  }
  return res.status(200).json({
    success: true,
    data: region,
  });
});

module.exports = {
  createRegion,
  getAllReegions,
  updateRegion,
  deleteRegion,
  getElementById,
};
