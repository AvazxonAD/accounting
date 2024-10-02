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


// create region
const createRegion = asyncHandler(async (req, res, next) => {
  if (req.user.region_id) {
<<<<<<< HEAD
    return next(new ErrorResponse('Siz uchun ruhsat yoq', 403))
=======
    return next(new ErrorResponse("Siz uchun ruhsat yoq", 403));
>>>>>>> 4504a75e40a2cbf0bdeb5a2345d66b57ab165846
  }
  const { error, value } = regionValidation.validate(req.body);
  if (error) {
    return next(new ErrorResponse(error.details[0].message, 400));
  }

  const test = await getByNameRegion(value.name);
  if (test) {
    return next(new ErrorResponse("Ushbu viloyat avval kiritilgan", 409));
  }

  await create_region(value.name);

  return res.status(201).json({
    success: true,
    data: "Muvafaqyatli kiritildi",
  });
});

// get all regions
const getAllReegions = asyncHandler(async (req, res, next) => {
  if (req.user.region_id) {
<<<<<<< HEAD
    return next(new ErrorResponse('Siz uchun ruhsat yoq', 403))
=======
    return next(new ErrorResponse("Siz uchun ruhsat yoq", 403));
>>>>>>> 4504a75e40a2cbf0bdeb5a2345d66b57ab165846
  }
  const result = await get_all_region();
  return res.status(200).json({
    success: true,
    data: result,
  });
});

// update region
const updateRegion = asyncHandler(async (req, res, next) => {
  if (req.user.region_id) {
<<<<<<< HEAD
    return next(new ErrorResponse('Siz uchun ruhsat yoq', 403))
=======
    return next(new ErrorResponse("Siz uchun ruhsat yoq", 403));
>>>>>>> 4504a75e40a2cbf0bdeb5a2345d66b57ab165846
  }
  const id = req.params.id;
  const region = await getByIdRegion(id);
  if (!region) {
    return next(new ErrorResponse("Server xatolik. Viloyat topilmadi", 404));
  }

  const { error, value } = regionValidation.validate(req.body);

  if (region.name !== value.name.trim()) {
    const test = await getByNameRegion(value.name);
    if (test) {
      return next(new ErrorResponse("Ushbu viloyat avval kiritilgan", 409));
    }
  }

  await update_region(id, value.name.trim());

  return res.status(200).json({
    success: true,
    data: "Muvafaqyatli yangilandi",
  });
});

// delete region
const deleteRegion = asyncHandler(async (req, res, next) => {
  if (req.user.region_id) {
<<<<<<< HEAD
    return next(new ErrorResponse('Siz uchun ruhsat yoq', 403))
=======
    return next(new ErrorResponse("Siz uchun ruhsat yoq", 403));
>>>>>>> 4504a75e40a2cbf0bdeb5a2345d66b57ab165846
  }
  const id = req.params.id;
  const region = await getByIdRegion(id);
  if (!region) {
    return next(new ErrorResponse("Server xatolik. Viloyat topilmadi", 404));
  }

  await delete_region(id);

  return res.status(200).json({
    success: true,
    data: "Muvaffaqiyatli ochirildi",
  });
});

const getElementById = asyncHandler(async (req, res, next) => {
  if (req.user.region_id) {
<<<<<<< HEAD
    return next(new ErrorResponse('Siz uchun ruhsat yoq', 403))
=======
    return next(new ErrorResponse("Siz uchun ruhsat yoq", 403));
>>>>>>> 4504a75e40a2cbf0bdeb5a2345d66b57ab165846
  }
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
