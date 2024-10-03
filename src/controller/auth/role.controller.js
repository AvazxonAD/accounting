const pool = require("../../config/db");
const asyncHandler = require("../../middleware/asyncHandler");
const ErrorResponse = require("../../utils/errorResponse");
const {
  roleValidation,
} = require("../../helpers/validation/auth/role.validation");
const {
  getByNameRole,
  create_role,
  get_all_role,
  getByIdRole,
  update_role,
  delete_role,
  getAdminRole
} = require("../../service/auth/role.db");

const { createAccess } = require('../../service/auth/access.db')
const { getAllUsersForSuperAdminDB } = require('../../service/auth/user.db')

const { getLogger, postLogger, putLogger, deleteLogger } = require('../../helpers/log_functions/logger');

// create role
const createRole = asyncHandler(async (req, res, next) => {
  const { error, value } = roleValidation.validate(req.body);
  if (error) {
    return next(new ErrorResponse(error.details[0].message, 400));
  }
  const test = await getByNameRole(value.name);
  if (test) {
    return next(new ErrorResponse("Ushbu ma'lumot avval kiritilgan", 409));
  }
  const name = value.name.trim()
  if (name === 'region-admin' || name === 'super-admin') {
    return next(new ErrorResponse("Ushbu rolni kiritish mumkin emas", 400))
  }
  const role = await create_role(value.name);
  const admin_role = await getAdminRole()
  const users = await getAllUsersForSuperAdminDB(admin_role.id)
  for(let user of users){
    await createAccess(role.id, user.id)
  }
  const user_id = req.user.id;
  postLogger.info(`Rol yaratildi: ${value.name}. Foydalanuvchi ID: ${user_id}`);

  return res.status(201).json({
    success: true,
    data: "Muvaffaqyatli kiritildi",
  });
});


// get all role
const getAllRole = asyncHandler(async (req, res, next) => {
  const roles = await get_all_role();

  const user_id = req.user.id;
  getLogger.info(`Barcha rollar olish muvaffaqiyatli. Foydalanuvchi ID: ${user_id}`);

  return res.status(200).json({
    success: true,
    data: roles,
  });
});

// update role
const updateRole = asyncHandler(async (req, res, next) => {
  if (req.user.region_id) {
    return next(new ErrorResponse("Siz uchun ruhsat yo'q", 403));
  }
  const id = req.params.id;
  const role = await getByIdRole(id);
  if (!role) {
    const user_id = req.user.id;
    return next(new ErrorResponse("Server xatolik. Malumot topilmadi", 404));
  }

  const { error, value } = roleValidation.validate(req.body);
  if (error) {
    const user_id = req.user.id;
    return next(new ErrorResponse(error.details[0].message, 400));
  }

  if (role.name !== value.name.trim()) {
    const test = await getByNameRole(value.name.trim());
    if (test) {
      const user_id = req.user.id;
      return next(new ErrorResponse("Ushbu malumot avval kiritilgan", 409));
    }
  }

  await update_role(id, value.name);
  const user_id = req.user.id;
  putLogger.info(`Rol yangilandi: ${value.name}. Foydalanuvchi ID: ${user_id}`);

  return res.status(200).json({
    success: true,
    data: "Muvafaqyatli yangilandi",
  });
});


// delete role
const deleteRole = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const role = await getByIdRole(id);
  if (!role) {
    return next(new ErrorResponse("Server xatolik. Malumot topilmadi", 404));
  }
  if (role.name === 'super-admin' || role.name === 'region-admin') {
    return next(new ErrorResponse('Ochirib bolmaydi', 400))
  }

  await delete_role(id);
  const user_id = req.user.id;
  deleteLogger.info(`Rol o'chirildi. RoleId: ${id}. Foydalanuvchi ID: ${user_id}`);

  return res.status(200).json({
    success: true,
    data: "Muvaffaqiyatli o'chirildi",
  });
});


// get role by ID
const getElementById = asyncHandler(async (req, res, next) => {
  if (req.user.region_id) {
    return next(new ErrorResponse("Siz uchun ruhsat yo'q", 403));
  }
  const role = await getByIdRole(req.params.id);
  if (!role) {
    const user_id = req.user.id;
    return next(new ErrorResponse("Server xatolik. Role topilmadi", 404));
  }

  const user_id = req.user.id;
  getLogger.info(`Role olindi. RoleId: ${req.params.id}. Foydalanuvchi ID: ${user_id}`);

  return res.status(200).json({
    success: true,
    data: role,
  });
});


module.exports = {
  createRole,
  updateRole,
  deleteRole,
  getAllRole,
  getElementById,
};
