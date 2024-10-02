const pool = require("../../config/db");
const asyncHandler = require("../../middleware/asyncHandler");
const ErrorResponse = require("../../utils/errorResponse");
const {
  regionValidation,
} = require("../../helpers/validation/auth/region.validation");
const {
  getByNameRegion,
  create_region,
  get_all_region,
  getByIdRegion,
  update_region,
  delete_region,
} = require("../../service/auth/region.db");

const { getLogger, postLogger, putLogger, deleteLogger } = require('../../helpers/log_functions/logger');

// create region
const createRegion = asyncHandler(async (req, res, next) => {
  if (req.user.region_id) {
    return next(new ErrorResponse("Siz uchun ruhsat yoq", 403));
  }
  const { error, value } = regionValidation.validate(req.body);
  if (error) {
    postLogger.error(`Validation error: ${error.details[0].message}. UserId: ${req.user.id}`);
    return next(new ErrorResponse(error.details[0].message, 400));
  }

  const test = await getByNameRegion(value.name);
  if (test) {
    postLogger.warn(`Region already exists: ${value.name}. UserId: ${req.user.id}`);
    return next(new ErrorResponse("Ushbu viloyat avval kiritilgan", 409));
  }

  await create_region(value.name);
  postLogger.info(`Region created: ${value.name}. UserId: ${req.user.id}`);
  getLogger.info(`Region creation request successful. RegionName: ${value.name}, UserId: ${req.user.id}`);

  return res.status(201).json({
    success: true,
    data: "Muvafaqyatli kiritildi",
  });
});

// get all regions
const getAllReegions = asyncHandler(async (req, res, next) => {
  if (req.user.region_id) {
    return next(new ErrorResponse("Siz uchun ruhsat yoq", 403));
  }
  const result = await get_all_region();
  getLogger.info(`All regions retrieved. UserId: ${req.user.id}`);
  
  return res.status(200).json({
    success: true,
    data: result,
  });
});

// update region
const updateRegion = asyncHandler(async (req, res, next) => {
  if (req.user.region_id) {
    return next(new ErrorResponse("Siz uchun ruhsat yoq", 403));
  }
  const id = req.params.id;
  const region = await getByIdRegion(id);
  if (!region) {
    return next(new ErrorResponse("Server xatolik. Viloyat topilmadi", 404));
  }

  const { error, value } = regionValidation.validate(req.body);
  if (error) {
    putLogger.error(`Validation error: ${error.details[0].message}. UserId: ${req.user.id}`);
    return next(new ErrorResponse(error.details[0].message, 400));
  }

  if (region.name !== value.name.trim()) {
    const test = await getByNameRegion(value.name);
    if (test) {
      putLogger.warn(`Region already exists: ${value.name}. UserId: ${req.user.id}`);
      return next(new ErrorResponse("Ushbu viloyat avval kiritilgan", 409));
    }
  }

  await update_region(id, value.name.trim());
  putLogger.info(`Region updated: ${value.name}. UserId: ${req.user.id}`);
  getLogger.info(`Region update request successful. RegionId: ${id}, NewName: ${value.name.trim()}, UserId: ${req.user.id}`);

  return res.status(200).json({
    success: true,
    data: "Muvafaqyatli yangilandi",
  });
});

// delete region
const deleteRegion = asyncHandler(async (req, res, next) => {
  if (req.user.region_id) {
    return next(new ErrorResponse("Siz uchun ruhsat yoq", 403));
  }
  const id = req.params.id;
  const region = await getByIdRegion(id);
  if (!region) {
    return next(new ErrorResponse("Server xatolik. Viloyat topilmadi", 404));
  }

  await delete_region(id);
  deleteLogger.info(`Region deleted. RegionId: ${id}. UserId: ${req.user.id}`);
  getLogger.info(`Region deletion request successful. RegionId: ${id}, UserId: ${req.user.id}`);

  return res.status(200).json({
    success: true,
    data: "Muvaffaqyatli ochirildi",
  });
});

// get region by ID
const getElementById = asyncHandler(async (req, res, next) => {
  if (req.user.region_id) {
    return next(new ErrorResponse("Siz uchun ruhsat yoq", 403));
  }
  const region = await getByIdRegion(req.params.id);
  if (!region) {
    getLogger.error(`Region not found. RegionId: ${req.params.id}. UserId: ${req.user.id}`);
    return next(new ErrorResponse("Server xatolik. Region topilmadi", 404));
  }

  getLogger.info(`Region retrieved. RegionId: ${req.params.id}. UserId: ${req.user.id}`);

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
