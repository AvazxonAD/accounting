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
    return next(new ErrorResponse(error.details[0].message, 406));
  }
  const user_region_id = req.user.region_id

  let { login, password, fio, region_id, role_id } = value;

  const role = await getByIdRole(role_id);
  if (!role) {
    return next(new ErrorResponse("Server xatolik. Role topilmadi", 404));
  }

  login = login.trim();
  password = password.trim();
  fio = fio.trim();
  const hashedPassword = await bcrypt.hash(value.password, 10);

  const test = await getByLoginAuth(value.login);
  if (test) {
    return next(new ErrorResponse("Ushbu login avval kiritilgan", 409));
  }
  if(user_region_id){
    if(user_region_id !== region_id){
      return next(new ErrorResponse('region id notogri', 403))
    }
  }

  await create_user(login, hashedPassword, fio, role_id, region_id);

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
  }
  if (!region_id) {
    users = await getAllUsersDB();
  }

  return res.status(200).json({
    success: true,
    data: users,
  });
});

const getRegionAllUsers = asyncHandler(async (req, res, next) => {
  const region_id = req.user.region_id
  if (region_id) {
    return next(new ErrorResponse("Siz uchun ruhsat etilmagan", 403));
  }

  const users = await getAllRegionUsers(region_id);

  return res.status(200).json({
    success: true,
    data: users,
  });
});

// update user
const updateUser = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  let user_region_id = req.user.region_id
  if(!user_region_id){
    user_region_id = req.query.region_id
  }
  const oldUser = await getByIdUser(id, user_region_id);
  if (!oldUser) {
    return next(new ErrorResponse("Server xatolik. User topilmadi", 404));
  }

  const { error, value } = userValidation.validate(req.body);
  if (error) {
    return next(new ErrorResponse(error.details[0].message, 406));
  }

  let { login, password, fio, region_id, role_id } = value;

  const role = await getByIdRole(role_id);
  if (!role) {
    return next(new ErrorResponse("Server xatolik. Role topilmadi", 404));
  }

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

  await update_user(login, hashedPassword, fio, role_id, region_id, id);

  return res.status(201).json({
    success: true,
    data: "Muvafaqyatli yangilandi",
  });
});

// delete user
const deleteUser = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const deleteUser = await getByIdUser(id);
  if (!deleteUser) {
    return next(new ErrorResponse("Server xatolik. User topilmadi", 404));
  }

  await deleteUserDb(id);

  return res.status(200).json({
    success: true,
    data: "Muvaffaqiyatli ochirildi",
  });
});

const getElementById = asyncHandler(async (req, res, next) => {
  let region_id = req.user.region_id
  if(!region_id){
    region_id = req.query.region_id
  }

  const user = await getByIdUser(req.params.id, region_id);
  if (!user) {
    return next(new ErrorResponse("Server xatolik. User topilmadi", 404));
  }

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
