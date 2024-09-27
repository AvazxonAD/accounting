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
} = require("../../service/auth/role.db");

// create role
const createRole = asyncHandler(async (req, res, next) => {
  const { error, value } = roleValidation.validate(req.body);
  if (error) {
    return next(new ErrorResponse(error.details[0].message, 406));
  }
  const test = await getByNameRole(value.name);
  if (test) {
    return next(new ErrorResponse("Ushbu malumot avval kiritilgan", 409));
  }

  await create_role(value.name);

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

  const { error, value } = roleValidation.validate(req.body);
  if (error) {
    return next(new ErrorResponse(error.details[0].message, 406));
  }

  if (role.name !== value.name.trim()) {
    const test = await getByNameRole(value.name.trim());
    if (test) {
      return next(new ErrorResponse("Ushbu malumot avval kiritilgan", 409));
    }
  }

  await update_role(id, value.name);

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

  await delete_role(id);

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
