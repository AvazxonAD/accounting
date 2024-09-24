const pool = require("../../config/db");
const asyncHandler = require("../../middleware/asyncHandler");
const ErrorResponse = require("../../utils/errorResponse");
const {
  checkValueString,
  checkValueNumber,
} = require("../../utils/check.functions");
const bcrypt = require("bcrypt");
const { getByIdRole } = require("../../service/role.db");
const { getByIdRegion } = require("../../service/region.db");
const { getByLoginAuth } = require("../../service/auth.db");
const {
  create_user,
  getAllRegionUsers,
  getByIdUser,
  update_user,
} = require("../../service/user.db");

// create user
const createUser = asyncHandler(async (req, res, next) => {
  let { login, password, fio, region_id, role_id } = req.body;

  checkValueString(login, password, fio);
  checkValueNumber(role_id);

  const role = await getByIdRole(role_id);
  if (!role) {
    return next(new ErrorResponse("Server xatolik. Role topilmadi", 404));
  }

  if (region_id) {
    checkValueNumber(region_id);
    const region = await getByIdRegion(region_id);
    if (!region) {
      return next(new ErrorResponse("Server xatolik. Viloyat topilmadi", 404));
    }
  } else {
    region_id = req.user.region_id;
  }

  login = login.trim();
  password = password.trim();
  fio = fio.trim();
  const hashedPassword = await bcrypt.hash(password, 10);

  const test = await getByLoginAuth(login);
  if (test) {
    return next(new ErrorResponse("Ushbu login avval kiritilgan", 409));
  }

  const result = await create_user(
    login,
    hashedPassword,
    fio,
    role_id,
    region_id,
  );
  if (!result) {
    return next(new ErrorResponse("Server xatolik. Malumot kiritilmadi", 500));
  }

  return res.status(201).json({
    success: true,
    data: "Muvafaqyatli kiritildi",
  });
});

// get all users
const getAllUsers = asyncHandler(async (req, res, next) => {
  let user_id = null;
  const region_id = req.user.region_id;
  const id = req.params.id;

  if (!region_id) {
    checkValueNumber(Number(id));
    user_id = id;
  }
  if (region_id) {
    user_id = region_id;
  }
  users = await getAllRegionUsers(user_id);

  return res.status(200).json({
    success: true,
    data: users,
  });
});

// update user
const updateUser = asyncHandler(async (req, res, next) => {
  let { login, password, fio, region_id, role_id } = req.body;
  const id = req.params.id;

  const oldUser = await getByIdUser(id);
  if (!oldUser) {
    return next(new ErrorResponse("Server xatolik. User topilmadi", 404));
  }

  checkValueString(login, password, fio);
  checkValueNumber(role_id);

  const role = await getByIdRole(role_id);
  if (!role) {
    return next(new ErrorResponse("Server xatolik. Role topilmadi", 404));
  }

  if (region_id) {
    checkValueNumber(region_id);
    const region = await getByIdRegion(region_id);
    if (!region) {
      return next(new ErrorResponse("Server xatolik. Viloyat topilmadi", 404));
    }
  } else {
    region_id = req.user.region_id;
  }

  login = login.trim();
  password = password.trim();
  fio = fio.trim();
  const hashedPassword = await bcrypt.hash(password, 10);

  if (oldUser.login !== login) {
    const test = await getByLoginAuth(login);
    if (test) {
      return next(new ErrorResponse("Ushbu login avval kiritilgan", 409));
    }
  }

  const updateUser = await update_user(
    login,
    hashedPassword,
    fio,
    role_id,
    region_id,
    id,
  );
  if (!updateUser) {
    return next(new ErrorResponse("Server xatolik. Malumot yangilanmadi", 500));
  }

  return res.status(201).json({
    success: true,
    data: "Muvafaqyatli yangilandi",
  });
});

// delete user
const deleteUser = asyncHandler(async (req, res, next) => {
  let user = await pool.query(
    `SELECT users.id, users.region_id, users.role_id, role.name AS role_name 
        FROM users 
        JOIN role ON role.id = users.role_id
        WHERE users.id = $1`,
    [req.user.id],
  );
  user = user.rows[0];

  if (user.role_name !== "super_admin" && user.role_name !== "region_admin") {
    return next(new ErrorResponse("Siz uchun ruhsat etilmagan", 403));
  }

  let deleteUser = null;
  if (!user.region_id) {
    deleteUser = await pool.query(
      `SELECT * FROM users WHERE id = $1 AND isdeleted = false`,
      [req.params.id],
    );
    deleteUser = deleteUser.rows[0];
  } else {
    deleteUser = await pool.query(
      `SELECT * FROM users WHERE id = $1 AND isdeleted = false AND region_id = $2`,
      [req.params.id, user.region_id],
    );
    deleteUser = deleteUser.rows[0];
  }

  if (!deleteUser) {
    return next(new ErrorResponse("Server xatolik. User topilmadi", 404));
  }

  const deleteRegion = await pool.query(
    `UPDATE users SET isdeleted = $1 WHERE id = $2 RETURNING *`,
    [true, req.params.id],
  );

  if (!deleteRegion.rows[0]) {
    return next(new ErrorResponse("Server xatolik. User ochirilmadi", 500));
  }

  return res.status(200).json({
    success: true,
    data: "Muvaffaqiyatli ochirildi",
  });
});

const getElementById = asyncHandler(async (req, res, next) => {
  const user = await getByIdUser(req.params.id);
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
};
