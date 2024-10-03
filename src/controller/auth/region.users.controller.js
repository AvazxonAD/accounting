const pool = require("../../config/db");
const asyncHandler = require("../../middleware/asyncHandler");
const ErrorResponse = require("../../utils/errorResponse");
const bcrypt = require("bcrypt");
const { getByIdRole } = require("../../service/auth/role.service");
const { getByLoginAuth } = require("../../service/auth/auth.service");
const {
  userValidation,
} = require("../../helpers/validation/auth/user.validation");

const { getLogger, postLogger, putLogger, deleteLogger } = require('../../helpers/log_functions/logger');

const {
  create_user,
  getAllRegionUsersDB,
  getByIdUser,
  update_user,
  deleteUserDb,
} = require("../../service/auth/user.service");

// create user for region admin
const createUserForRegionAdmin = asyncHandler(async (req, res, next) => {
  const { error, value } = userValidation.validate(req.body);
  if (error) {
    return next(new ErrorResponse(error.details[0].message, 400));
  }

  let { login, password, fio, role_id } = value;
  const region_id  = req.user.region_id

  const role = await getByIdRole(role_id)
  if(!role){
    return next(new ErrorResponse("Server xatolik. role topilmadi", 404))
  }

  login = login.trim();
  password = password.trim();
  fio = fio.trim();
  const hashedPassword = await bcrypt.hash(value.password, 10);

  const test = await getByLoginAuth(value.login);
  if (test) {
    return next(new ErrorResponse("Ushbu login avval kiritilgan", 409));
  }

  await create_user(login, hashedPassword, fio, role.id, region_id);
  const user_id = req.user.id;
  postLogger.info(`Foydalanuvchi yaratildi: ${login}. Foydalanuvchi ID: ${user_id}`);

  return res.status(201).json({
    success: true,
    data: "Muvafaqyatli kiritildi",
  });
});

// get all users for regionadmin 
const getAllUsersForRegionAdmin = asyncHandler(async (req, res, next) => {
  const region_id = req.user.region_id

  const users = await getAllRegionUsersDB(region_id)
  return res.status(200).json({
    success: true,
    data: users,
  });
});


// update user for Region admin 
const updateUserForRegionAdmin = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  const oldUser = await getByIdUser(id);
  if (!oldUser) {
    return next(new ErrorResponse("Server xatolik. User topilmadi", 404));
  }

  const { error, value } = userValidation.validate(req.body);
  if (error) {
    return next(new ErrorResponse(error.details[0].message, 400));
  }

  let { login, password, fio, role_id } = value;

  const role = await getByIdRole(role_id)
  if(!role){
    return next(new ErrorResponse("Server xatolik. role topilmadi", 404))
  }

  login = login.trim();
  password = password.trim();
  fio = fio.trim();
  const hashedPassword = await bcrypt.hash(value.password, 10);

  if (oldUser.login !== login) {
    const test = await getByLoginAuth(login);
    if (test) {
      return next(new ErrorResponse("Ushbu login avval kiritilgan", 409));
    }
  }

  await update_user(login, hashedPassword, fio, role_id, id);
  putLogger.info(`Foydalanuvchi yangilandi: ${login}. Foydalanuvchi ID: ${req.user.id}`);

  return res.status(200).json({
    success: true,
    data: "Muvafaqyatli yangilandi",
  });
});


// delete user for Region admin 
const deleteUserForRegionAdmin = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  const userToDelete = await getByIdUser(id);
  if (!userToDelete) {
    return next(new ErrorResponse("Server xatolik. User topilmadi", 404));
  }
  if(userToDelete.role_name === 'region-admin' || userToDelete.role_name === 'super-admin'){
    return next(new ErrorResponse('Ochirish mumkin emas', 404))
  }

  await deleteUserDb(id);
  deleteLogger.info(`Foydalanuvchi ochirildi: ${userToDelete.login}. Foydalanuvchi ID: ${req.user.id}`);

  return res.status(200).json({
    success: true,
    data: "Muvafaqyatli ochirildi",
  });
});


// get user by ID for region admin 
const getElementByIdForRegionAdmin = asyncHandler(async (req, res, next) => {
  const user = await getByIdUser(req.params.id);

  if (!user) {
    return next(new ErrorResponse("Server xatolik. User topilmadi", 404));
  }

  getLogger.info(`Muvaffaqyatli foydalanuvchi ma'lumotlari olindi. Foydalanuvchi ID: ${req.user.id}`);

  return res.status(200).json({
    success: true,
    data: user,
  });
});

module.exports = {
  createUserForRegionAdmin,
  getAllUsersForRegionAdmin,
  updateUserForRegionAdmin,
  deleteUserForRegionAdmin,
  getElementByIdForRegionAdmin
};
