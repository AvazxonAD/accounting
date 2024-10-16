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
const { getByBudjetIdMainSchetService } = require("../../service/spravochnik/main.schet.service");
const { authValidation, authUpdateValidation } = require("../../helpers/validation/auth/auth.validation");
const { getBudjetService } = require('../../service/spravochnik/budjet.name.service');
const { getRegionService } = require('../../service/auth/region.service');
const { resFunc } = require("../../helpers/resFunc");
const { validationResponse } = require("../../helpers/response-for-validation");

// login
const login = asyncHandler(async (req, res, next) => {
  const { login, password } = validationResponse(authValidation, req.body)
  const user = await getByLoginUserService(login);
  if(!user){
    throw new ErrorResponse('User not found', 404)
  }
  const matchPassword = await bcrypt.compare(password, user.password);
  if (!matchPassword) {
    return next(new ErrorResponse("Incorrect login or password", 403));
  }
  const token = generateToken(user);
  delete user.password 
  postLogger.info(`Foydalanuvchi muvaffaqiyatli tizimga kirdi. Foydalanuvchi ID: ${user.id}`);
  const data = { user, token }
  resFunc(res, 200, data)
});

// update
const update = asyncHandler(async (req, res, next) => {
  const { login, fio, newPassword, oldPassword } = validationResponse(authUpdateValidation, req.body)
  const id = req.user.id;
  const user = await getByIdUserService(id);
  if (!user) {
    return next(new ErrorResponse("user not found", 404));
  }
  if (oldPassword || newPassword) {
    const matchPassword = await bcrypt.compare(oldPassword, user.password);
    if (!matchPassword) {
      return next(new ErrorResponse("The old password was entered incorrectly", 403));
    }
    const newHashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = newHashedPassword;
  }
  if (fio) {
    user.fio = fio;
  }
  if (login) {
    if (login !== user.login) {
      const test = await getByLoginUserService(login);
      if (test) {
        return next(new ErrorResponse("Login avval ishlatilgan", 400));
      }
      user.login = login;
    }
  }
  const result = await updateAuth(user.login, user.password, user.fio, id);
  putLogger.info(`Foydalanuvchi profili yangilandi. Foydalanuvchi ID: ${req.user.id}`);
  resFunc(res, 200, result)
});

// get profile
const getProfile = asyncHandler(async (req, res, next) => {
  const user = await getProfileAuth(req.user.id);
  getLogger.info(`Foydalanuvchi profili olindi. Foydalanuvchi ID: ${req.user.id}`);
  resFunc(res, 200, user)
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
  const all_budjet = await getBudjetService();
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
