const pool = require("../../config/db");
const asyncHandler = require("../../middleware/asyncHandler");
const ErrorResponse = require("../../utils/errorResponse");
const bcrypt = require("bcrypt");
const { getAdminRole } = require("../../service/auth/role.service");
const { getByIdRegion } = require("../../service/auth/region.service");
const { getByLoginAuth } = require("../../service/auth/auth.service");
const {
  userValidation,
} = require("../../helpers/validation/auth/user.validation");

const { getLogger, postLogger, putLogger, deleteLogger } = require('../../helpers/log_functions/logger');

const {
  create_user,
  getByIdUser,
  update_user,
  deleteUserDb,
  getAllUsersForSuperAdminDB,
} = require("../../service/auth/user.service");
const { get_all_role } = require('../../service/auth/role.service')
const { createAccess } = require('../../service/auth/access.service')

// create user for super admin
const createUserForSuperAdmin = asyncHandler(async (req, res, next) => {
  const { error, value } = userValidation.validate(req.body);
  if (error) {
    return next(new ErrorResponse(error.details[0].message, 400));
  }

  let { login, password, fio, region_id } = value;

  const role = await getAdminRole();
  if (!role) {
    return next(new ErrorResponse("Server xatolik. Rol topilmadi", 404));
  }

  login = login.trim();
  password = password.trim();
  fio = fio.trim();
  const hashedPassword = await bcrypt.hash(value.password, 10);

  const test = await getByLoginAuth(value.login);
  if (test) {
    return next(new ErrorResponse("Ushbu login avval kiritilgan", 409));
  }

  const region = await getByIdRegion(region_id);
  if (!region) {
    return next(new ErrorResponse("Server xatolik. Viloyat topilmadi", 404));
  }

  const user = await create_user(login, hashedPassword, fio, role.id, region_id);
  console.log(user)
  const roles = await get_all_role()
  for(let role of roles){
    await createAccess(role.id, user.id)
  }
  postLogger.info(`Foydalanuvchi yaratildi: ${login}. Foydalanuvchi ID: ${req.user.id}`);

  return res.status(201).json({
    success: true,
    data: "Muvafaqyatli kiritildi",
  });
});

// get all users for super admin 
const getAllUsersForSuperAdmin = asyncHandler(async (req, res, next) => {
  const role = await getAdminRole()
  const users = await getAllUsersForSuperAdminDB(role.id)

  return res.status(200).json({
    success: true,
    data: users,
  });
});


// update user for super admin 
const updateUserForSuperAdmin = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  const oldUser = await getByIdUser(id);
  if (!oldUser) {
    return next(new ErrorResponse("Server xatolik. User topilmadi", 404));
  }

  const { error, value } = userValidation.validate(req.body);
  if (error) {
    return next(new ErrorResponse(error.details[0].message, 400));
  }

  let { login, password, fio, region_id } = value;

  const region = await getByIdRegion(region_id);
  if (!region) {
    return next(new ErrorResponse("Server xatolik. Viloyat topilmadi", 404));
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

  await update_user(login, hashedPassword, fio, region_id, id);
  putLogger.info(`Foydalanuvchi yangilandi: ${login}. Foydalanuvchi ID: ${req.user.id}`);

  return res.status(200).json({
    success: true,
    data: "Muvafaqyatli yangilandi",
  });
});


// delete user for super admin 
const deleteUserForSuperAdmin = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  const userToDelete = await getByIdUser(id);
  if (!userToDelete) {
    return next(new ErrorResponse("Server xatolik. User topilmadi", 404));
  }
  if(userToDelete.role_name === 'super-admin'){
    return next(new ErrorResponse('Ochirish mumkin emas', 404))
  }

  await deleteUserDb(id);
  deleteLogger.info(`Foydalanuvchi ochirildi: ${userToDelete.login}. Foydalanuvchi ID: ${req.user.id}`);

  return res.status(200).json({
    success: true,
    data: "Muvafaqyatli ochirildi",
  });
});


// get user by ID for super admin 
const getElementByIdForSuperAdmin = asyncHandler(async (req, res, next) => {
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
  createUserForSuperAdmin,
  getAllUsersForSuperAdmin,
  updateUserForSuperAdmin,
  deleteUserForSuperAdmin,
  getElementByIdForSuperAdmin
};
