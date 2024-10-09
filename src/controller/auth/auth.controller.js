const {
  getByLoginUserService,
  getByIdUserService,
  updateAuth,
  getProfileAuth,
} = require("../../service/auth/auth.service");
const asyncHandler = require("../../middleware/asyncHandler");
const ErrorResponse = require("../../utils/errorResponse");
const generateToken = require("../../utils/auth/generate.token");
const { getLogger, postLogger, putLogger } = require('../../helpers/log_functions/logger');
const bcrypt = require("bcrypt");
const { getByIdMainSchet, getByBudjetIdMainSchetService } = require("../../service/spravochnik/main.schet.service");
const { authValidation, authUpdateValidation } = require("../../helpers/validation/auth/auth.validation");
const { getAllBudjet } = require('../../service/spravochnik/budjet.name.service');
const { getRegionService } = require('../../service/auth/region.service');
const { resFunc } = require("../../helpers/resFunc");
const { validationResponse } = require("../../helpers/response-for-validation");

// login
const login = asyncHandler(async (req, res, next) => {
  const { login, password } = validationResponse(authValidation, req.body)
  const user = await getByLoginUserService(login);
  const matchPassword = await bcrypt.compare(password, user.password);
  if (!matchPassword) {
    return next(new ErrorResponse("Incorrect login or password", 403));
  }
  const token = generateToken(user);
  postLogger.info(`Foydalanuvchi muvaffaqiyatli tizimga kirdi. Foydalanuvchi ID: ${user.id}`);
  const data = { user, token }
  resFunc(res, 200, data)
});

// update
const update = asyncHandler(async (req, res, next) => {
  const { error, value } = authUpdateValidation.validate(req.body);
  const id = req.user.id;

  const user = await getByIdUserService(id);
  if (!user) {
    return next(new ErrorResponse("Foydalanuvchi topilmadi", 404));
  }

  if (value.oldPassword || value.newPassword) {
    const oldPassword = value.oldPassword.trim();
    const newPassword = value.newPassword.trim();

    const matchPassword = await bcrypt.compare(oldPassword, user.password);
    if (!matchPassword) {
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
      const test = await getByLoginUserService(login);
      if (test) {
        return next(new ErrorResponse("Login avval ishlatilgan", 400));
      }
      user.login = login;
    }
  }

  await updateAuth(user.login, user.password, user.fio, id);
  putLogger.info(`Foydalanuvchi profili yangilandi. Foydalanuvchi ID: ${req.user.id}`);

  return res.status(200).json({
    success: true,
    data: "Muvaffaqiyatli yangilandi",
  });
});

// get profile
const getProfile = asyncHandler(async (req, res, next) => {
  const user = await getProfileAuth(req.user.id);

  if (!user) {
    return next(new ErrorResponse("Server xatolik. Foydalanuvchi topilmadi", 404));
  }

  getLogger.info(`Foydalanuvchi profili olindi. Foydalanuvchi ID: ${req.user.id}`);

  return res.status(200).json({
    success: true,
    data: user,
  });
});

// select budget
const select_budget = asyncHandler(async (req, res, next) => {
  const region_id = req.query.region_id;
  const result = await getByBudjetIdMainSchetService(req.params.id, region_id);

  if (!result) {
    return next(new ErrorResponse("Budjet topilmadi", 404));
  }

  return res.status(200).json({
    success: true,
    data: result,
  });
});

// for login
const forLogin = asyncHandler(async (req, res, next) => {
  const all_budjet = await getAllBudjet();
  const all_region = await getRegionService();
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
