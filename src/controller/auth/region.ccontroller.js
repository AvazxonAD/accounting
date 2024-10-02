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
    return next(new ErrorResponse("Siz uchun ruhsat yo'q", 403));
  }
  const { error, value } = regionValidation.validate(req.body);
  if (error) {
    postLogger.error(`Tasdiqlash xatosi: ${error.details[0].message}. Foydalanuvchi ID: ${req.user.id}`);
    return next(new ErrorResponse(error.details[0].message, 400));
  }

  const test = await getByNameRegion(value.name);
  if (test) {
    postLogger.warn(`Viloyat allaqachon mavjud: ${value.name}. Foydalanuvchi ID: ${req.user.id}`);
    return next(new ErrorResponse("Ushbu viloyat avval kiritilgan", 409));
  }

  await create_region(value.name);
  postLogger.info(`Viloyat yaratildi: ${value.name}. Foydalanuvchi ID: ${req.user.id}`);
  getLogger.info(`Viloyat yaratish so'rovi muvaffaqiyatli. Viloyat nomi: ${value.name}, Foydalanuvchi ID: ${req.user.id}`);

  return res.status(201).json({
    success: true,
    data: "Muvaffaqiyatli kiritildi",
  });
});

// get all regions
const getAllReegions = asyncHandler(async (req, res, next) => {
  if (req.user.region_id) {
    return next(new ErrorResponse("Siz uchun ruhsat yo'q", 403));
  }
  const result = await get_all_region();
  getLogger.info(`Barcha mintaqalar olindi. Foydalanuvchi ID: ${req.user.id}`);
  
  return res.status(200).json({
    success: true,
    data: result,
  });
});

// update region
const updateRegion = asyncHandler(async (req, res, next) => {
  if (req.user.region_id) {
    return next(new ErrorResponse("Siz uchun ruhsat yo'q", 403));
  }
  const id = req.params.id;
  const region = await getByIdRegion(id);
  if (!region) {
    return next(new ErrorResponse("Server xatolik. Viloyat topilmadi", 404));
  }

  const { error, value } = regionValidation.validate(req.body);
  if (error) {
    putLogger.error(`Tasdiqlash xatosi: ${error.details[0].message}. Foydalanuvchi ID: ${req.user.id}`);
    return next(new ErrorResponse(error.details[0].message, 400));
  }

  if (region.name !== value.name.trim()) {
    const test = await getByNameRegion(value.name);
    if (test) {
      putLogger.warn(`Viloyat allaqachon mavjud: ${value.name}. Foydalanuvchi ID: ${req.user.id}`);
      return next(new ErrorResponse("Ushbu viloyat avval kiritilgan", 409));
    }
  }

  await update_region(id, value.name.trim());
  putLogger.info(`Viloyat yangilandi: ${value.name}. Foydalanuvchi ID: ${req.user.id}`);
  getLogger.info(`Viloyat yangilash so'rovi muvaffaqiyatli. Viloyat ID: ${id}, Yangi nom: ${value.name.trim()}, Foydalanuvchi ID: ${req.user.id}`);

  return res.status(200).json({
    success: true,
    data: "Muvaffaqiyatli yangilandi",
  });
});

// delete region
const deleteRegion = asyncHandler(async (req, res, next) => {
  if (req.user.region_id) {
    return next(new ErrorResponse("Siz uchun ruhsat yo'q", 403));
  }
  const id = req.params.id;
  const region = await getByIdRegion(id);
  if (!region) {
    return next(new ErrorResponse("Server xatolik. Viloyat topilmadi", 404));
  }

  await delete_region(id);
  deleteLogger.info(`Viloyat o'chirildi. Viloyat ID: ${id}. Foydalanuvchi ID: ${req.user.id}`);
  getLogger.info(`Viloyatni o'chirish so'rovi muvaffaqiyatli. Viloyat ID: ${id}, Foydalanuvchi ID: ${req.user.id}`);

  return res.status(200).json({
    success: true,
    data: "Muvaffaqiyatli o'chirildi",
  });
});


// get region by ID
const getElementById = asyncHandler(async (req, res, next) => {
  if (req.user.region_id) {
    return next(new ErrorResponse("Siz uchun ruhsat yo'q", 403));
  }
  const region = await getByIdRegion(req.params.id);
  if (!region) {
    getLogger.error(`Viloyat topilmadi. Viloyat ID: ${req.params.id}. Foydalanuvchi ID: ${req.user.id}`);
    return next(new ErrorResponse("Server xatolik. Viloyat topilmadi", 404));
  }

  getLogger.info(`Viloyat olindi. Viloyat ID: ${req.params.id}. Foydalanuvchi ID: ${req.user.id}`);

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
