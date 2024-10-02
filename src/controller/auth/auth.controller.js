const asyncHandler = require("../../middleware/asyncHandler");
const ErrorResponse = require("../../utils/errorResponse");
const generateToken = require("../../utils/auth/generate.token");
const { getLogger, postLogger, putLogger, deleteLogger } = require('../../helpers/log_functions/logger');
const bcrypt = require("bcrypt");
const {
  authValidation,
  authUpdateValidation,
} = require("../../helpers/validation/auth/auth.validation");
const {
  getByLoginAuth,
  getByIdAuth,
  updateAuth,
  getProfileAuth,
} = require("../../service/auth/auth.db");
const {
  getByIdMainSchet,
  getByBudjet_idMain_schet,
} = require("../../service/spravochnik/main.schet.db");
const { getAllBudjet } = require('../../service/spravochnik/budjet.name.db');
const { get_all_region } = require('../../service/auth/region.db');

// login
const login = asyncHandler(async (req, res, next) => {
  const { error, value } = authValidation.validate(req.body);
  if (error) {
    postLogger.error(`Validation error: ${error.details[0].message}. UserId: ${req.user.id}`);
    return next(new ErrorResponse(error.details[0].message), 400);
  }
  
  const user = await getByLoginAuth(value.login);
  if (!user) {
    postLogger.error(`User not found. Login attempt: ${value.login}`);
    return next(new ErrorResponse("login yoki parol xato kiritildi", 403));
  }
  
  const matchPassword = await bcrypt.compare(value.password, user.password);
  if (!matchPassword) {
    postLogger.error(`Incorrect password attempt. UserId: ${user.id}`);
    return next(new ErrorResponse("login yoki parol xato kiritildi", 403));
  }

  let main_schet = null;
  if (value.main_schet_id) {
    main_schet = await getByIdMainSchet(user.region_id, value.main_schet_id);
    if (!main_schet) {
      postLogger.warn(`Invalid main_schet_id provided. UserId: ${user.id}`);
      return next(new ErrorResponse("Shot raqami raqami notog`ri kiritildi", 400));
    }
  }
  
  const token = generateToken(user);
  postLogger.info(`Foydalanuvchi muvaffaqiyatli tizimga kirdi. UserId: ${user.id}`);
  
  return res.status(200).json({
    success: true,
    data: {
      user,
      main_schet,
      token,
    },
  });
});

// update
const update = asyncHandler(async (req, res, next) => {
  const { error, value } = authUpdateValidation.validate(req.body);
  const id = req.user.id;

  const user = await getByIdAuth(id);
  if (!user) {
    putLogger.error(`User not found. UserId: ${id}`);
    return next(new ErrorResponse("Foydalanuvchi topilmadi", 404));
  }

  if (value.oldPassword || value.newPassword) {
    const oldPassword = value.oldPassword.trim();
    const newPassword = value.newPassword.trim();

    const matchPassword = await bcrypt.compare(oldPassword, user.password);
    if (!matchPassword) {
      putLogger.error(`Old password incorrect. UserId: ${req.user.id}`);
      return next(new ErrorResponse("Eski parol xato kiritildi", 403));
    }
    const newHashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = newHashedPassword;
  }

  if (value.fio) {
    const fio = value.fio.trim();
    user.fio = fio;
  }

  if (value.login) {
    const login = value.login.trim();
    if (login !== user.login) {
      const test = await getByLoginAuth(login);
      if (test) {
        putLogger.warn(`Login already in use. UserId: ${req.user.id}`);
        return next(new ErrorResponse("Login avval ishlatilgan", 400));
      }
      user.login = login;
    }
  }

  await updateAuth(user.login, user.password, user.fio, id);
  putLogger.info(`User profile updated. UserId: ${req.user.id}`);
  
  return res.status(200).json({
    success: true,
    data: "Muvaffaqyatli yangilandi",
  });
});

// get profile
const getProfile = asyncHandler(async (req, res, next) => {
  const user = await getProfileAuth(req.user.id);
  
  if (!user) {
    getLogger.error(`Profile not found. UserId: ${req.user.id}`);
    return next(new ErrorResponse("Server xatolik. Foydalanuvchi topilmadi", 404));
  }

  getLogger.info(`User profile retrieved. UserId: ${req.user.id}`);
  
  return res.status(200).json({
    success: true,
    data: user,
  });
});

// select budget
const select_budget = asyncHandler(async (req, res, next) => {
  const region_id = req.query.region_id;
  const result = await getByBudjet_idMain_schet(req.params.id, region_id);
  
  if (!result) {
    getLogger.error(`Budget not found. UserId: ${req.user.id}`);
    return next(new ErrorResponse("Budjet topilmadi", 404));
  }

  getLogger.info(`Budget selected. UserId: ${req.user.id}`);
  
  return res.status(200).json({
    success: true,
    data: result,
  });
});

// for login
const forLogin = asyncHandler(async (req, res, next) => {
  const all_budjet = await getAllBudjet();
  const all_region = await get_all_region();
  
  getLogger.info(`All budgets and regions retrieved. UserId: ${req.user.id}`);
  
  return res.status(200).json({
    success: true,
    data: { all_budjet, all_region }
  });
});

module.exports = {
  login,
  update,
  getProfile,
  select_budget,
  forLogin
};
