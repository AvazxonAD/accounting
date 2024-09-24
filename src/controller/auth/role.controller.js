const pool = require("../../config/db");
const asyncHandler = require("../../middleware/asyncHandler");
const ErrorResponse = require("../../utils/errorResponse");
const { checkValueString } = require("../../utils/check.functions");
const {
  getByNameRole,
  create_role,
  get_all_role,
  getByIdRole,
  update_role,
  delete_role,
} = require("../../service/role.db");

// create role
const createRole = asyncHandler(async (req, res, next) => {
  let { name } = req.body;

  checkValueString(name);
  name = name.trim();

  if (
    name !== "super_admin" &&
    name !== "region_admin" &&
    name !== "Bugalter" &&
    name !== "Kassir"
  ) {
    return next(new ErrorResponse("Rol nomi notog`ri jonatildi", 400));
  }

  const test = await getByNameRole(name);
  if (test) {
    return next(new ErrorResponse("Ushbu malumot avval kiritilgan", 409));
  }

  const result = await create_role(name);
  if (!result) {
    return next(new ErrorResponse("Server xatolik. Malumot kiritilmadi", 500));
  }

  return res.status(201).json({
    success: true,
    data: "Muvafaqyatli kiritildi",
  });
});

// get all role
const getAllRole = asyncHandler(async (req, res, next) => {
  const roles = await get_all_role();
  return res.status(200).json({
    success: true,
    data: roles,
  });
});

// update role
const updateRole = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const role = await getByIdRole(id);
  if (!role) {
    return next(new ErrorResponse("Server xatolik. Malumot topilmadi", 404));
  }

  let { name } = req.body;

  checkValueString(name);
  name = name.trim();

  if (
    name !== "super_admin" &&
    name !== "region_admin" &&
    name !== "Bugalter" &&
    name !== "Kassir"
  ) {
    return next(new ErrorResponse("Rol nomi notog`ri jonatildi", 400));
  }

  if (role.name !== name) {
    const test = await getByNameRole(name);
    if (test) {
      return next(new ErrorResponse("Ushbu malumot avval kiritilgan", 409));
    }
  }

  const result = await update_role(id, name);
  if (!result) {
    return next(new ErrorResponse("Server xatolik. Malumot yangilanmadi", 500));
  }

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

  const deleteRole = await delete_role(id);

  if (!deleteRole) {
    return next(new ErrorResponse("Server xatolik. Malumot ochirilmadi", 500));
  }

  return res.status(200).json({
    success: true,
    data: "Muvaffaqiyatli ochirildi",
  });
});

const getElementById = asyncHandler(async (req, res, next) => {
  const role = await getByIdRole(req.params.id);
  if (!role) {
    return next(new ErrorResponse("Server xatolik. Role topilmadi", 404));
  }
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
