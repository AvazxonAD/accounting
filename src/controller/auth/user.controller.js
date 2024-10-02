const pool = require("../../config/db");
const asyncHandler = require("../../middleware/asyncHandler");
const ErrorResponse = require("../../utils/errorResponse");
const bcrypt = require("bcrypt");
const { getByIdRole } = require("../../service/auth/role.db");
const { getByIdRegion } = require("../../service/auth/region.db");
const { getByLoginAuth } = require("../../service/auth/auth.db");
const {
  userValidation,
} = require("../../helpers/validation/auth/user.validation");

const { getLogger, postLogger, putLogger, deleteLogger } = require('../../helpers/log_functions/logger');

const {
  create_user,
  getAllRegionUsers,
  getByIdUser,
  update_user,
  deleteUserDb,
  getAllUsersDB,
} = require("../../service/auth/user.db");

// create user
const createUser = asyncHandler(async (req, res, next) => {
  const { error, value } = userValidation.validate(req.body);
  if (error) {
    const user_id = req.user.id;
    postLogger.error(`Tekshirish xatosi: ${error.details[0].message}. Foydalanuvchi ID: ${user_id}`);
    return next(new ErrorResponse(error.details[0].message, 400));
  }
  
  const user_region_id = req.user.region_id;
  let { login, password, fio, region_id, role_id } = value;
  
  const role = await getByIdRole(role_id);
  if (!role) {
    const user_id = req.user.id;
    postLogger.error(`Server xatolik. Rol topilmadi. Foydalanuvchi ID: ${user_id}`);
    return next(new ErrorResponse("Server xatolik. Rol topilmadi", 404));
  }

  login = login.trim();
  password = password.trim();
  fio = fio.trim();
  const hashedPassword = await bcrypt.hash(value.password, 10);

  const test = await getByLoginAuth(value.login);
  if (test) {
    const user_id = req.user.id;
    postLogger.error(`Ushbu login avval kiritilgan: ${value.login}. Foydalanuvchi ID: ${user_id}`);
    return next(new ErrorResponse("Ushbu login avval kiritilgan", 409));
  }
  
  if (user_region_id && user_region_id !== region_id) {
    const user_id = req.user.id;
    postLogger.error(`Region ID noto'g'ri: ${region_id}. Foydalanuvchi ID: ${user_id}`);
    return next(new ErrorResponse("Region ID noto'g'ri", 403));
  }

  await create_user(login, hashedPassword, fio, role_id, region_id);
  const user_id = req.user.id;
  postLogger.info(`Foydalanuvchi yaratildi: ${login}. Foydalanuvchi ID: ${user_id}`);

  return res.status(201).json({
    success: true,
    data: "Muvafaqyatli kiritildi",
  });
});



// get all users
const getAllUsers = asyncHandler(async (req, res, next) => {
  const region_id = req.user.region_id;
  let users;

  if (region_id) {
    users = await getAllRegionUsers(region_id);
    getLogger.info(`Region foydalanuvchilari olingan. Region ID: ${region_id}. Foydalanuvchi ID: ${req.user.id}`);
  } else {
    users = await getAllUsersDB();
    getLogger.info(`Barcha foydalanuvchilar olingan. Foydalanuvchi ID: ${req.user.id}`);
  }

  return res.status(200).json({
    success: true,
    data: users,
  });
});


// get all users in a region
const getRegionAllUsers = asyncHandler(async (req, res, next) => {
  const region_id = req.user.region_id;
  if (!region_id) {
    putLogger.error(`Siz uchun ruhsat etilmagan. Foydalanuvchi ID: ${req.user.id}`);
    return next(new ErrorResponse("Siz uchun ruhsat etilmagan", 403));
  }

  const users = await getAllRegionUsers(region_id);
  putLogger.info(`Muvaffaqyatli foydalanuvchilar ro'yxati olindi. Region ID: ${region_id}. Foydalanuvchi ID: ${req.user.id}`);

  return res.status(200).json({
    success: true,
    data: users,
  });
});


// update user
const updateUser = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  let user_region_id = req.user.region_id;

  if (!user_region_id) {
    user_region_id = req.query.region_id;
  }

  const oldUser = await getByIdUser(id);
  if (!oldUser) {
    putLogger.error(`Server xatolik. User topilmadi. Foydalanuvchi ID: ${req.user.id}`);
    return next(new ErrorResponse("Server xatolik. User topilmadi", 404));
  }

  const { error, value } = userValidation.validate(req.body);
  if (error) {
    putLogger.error(`Tekshirish xatosi: ${error.details[0].message}. Foydalanuvchi ID: ${req.user.id}`);
    return next(new ErrorResponse(error.details[0].message, 400));
  }

  let { login, password, fio, region_id, role_id } = value;

  const role = await getByIdRole(role_id);
  if (!role) {
    putLogger.error(`Server xatolik. Role topilmadi. Foydalanuvchi ID: ${req.user.id}`);
    return next(new ErrorResponse("Server xatolik. Role topilmadi", 404));
  }

  const region = await getByIdRegion(region_id);
  if (!region) {
    putLogger.error(`Server xatolik. Viloyat topilmadi. Foydalanuvchi ID: ${req.user.id}`);
    return next(new ErrorResponse("Server xatolik. Viloyat topilmadi", 404));
  }

  login = login.trim();
  password = password.trim();
  fio = fio.trim();
  const hashedPassword = await bcrypt.hash(value.password, 10);

  if (oldUser.login !== login) {
    const test = await getByLoginAuth(login);
    if (test) {
      putLogger.error(`Ushbu login avval kiritilgan. Foydalanuvchi ID: ${req.user.id}`);
      return next(new ErrorResponse("Ushbu login avval kiritilgan", 409));
    }
  }

  await update_user(login, hashedPassword, fio, role_id, region_id, id);
  putLogger.info(`Foydalanuvchi yangilandi: ${login}. Foydalanuvchi ID: ${req.user.id}`);

  return res.status(200).json({
    success: true,
    data: "Muvafaqyatli yangilandi",
  });
});


// delete user
const deleteUser = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  let region_id = req.user.region_id;
  
  // Agar region_id bo'lsa, uni so'rov parametrlardan olish
  if (!region_id) {
    region_id = req.query.region_id;
  }

  const userToDelete = await getByIdUser(id);
  if (!userToDelete) {
    deleteLogger.error(`Server xatolik. User topilmadi. Foydalanuvchi ID: ${req.user.id}`);
    return next(new ErrorResponse("Server xatolik. User topilmadi", 404));
  }

  await deleteUserDb(id);
  deleteLogger.info(`Foydalanuvchi ochirildi: ${userToDelete.login}. Foydalanuvchi ID: ${req.user.id}`);

  return res.status(200).json({
    success: true,
    data: "Muvafaqyatli ochirildi",
  });
});


// get user by ID
const getElementById = asyncHandler(async (req, res, next) => {
  const user = await getByIdUser(req.params.id);

  if (!user) {
    getLogger.error(`Server xatolik. User topilmadi. Foydalanuvchi ID: ${req.user.id}`);
    return next(new ErrorResponse("Server xatolik. User topilmadi", 404));
  }

  getLogger.info(`Muvaffaqyatli foydalanuvchi ma'lumotlari olindi. Foydalanuvchi ID: ${req.user.id}`);

  return res.status(200).json({
    success: true,
    data: user,
  });
});


module.exports = {
  createUser,
  getAllUsers,
  updateUser,
  deleteUser,
  getElementById,
  getRegionAllUsers,
};
