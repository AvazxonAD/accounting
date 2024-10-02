const asyncHandler = require("../../middleware/asyncHandler");
const ErrorResponse = require("../../utils/errorResponse");
const generateToken = require("../../utils/auth/generate.token");
const bcrypt = require("bcrypt");
const {
  authValidation,
  authUpdateValidation,
} = require("../../helpers/validation/auth/auth.validation");

const {
  getByLoginAuth,
  getByIdAuth,
  updateAuth,
  getProfileAuth,
} = require("../../service/auth/auth.db");

const {
  getByIdMainSchet,
  getByBudjet_idMain_schet,
} = require("../../service/spravochnik/main.schet.db");

const { getAllBudjet } = require('../../service/spravochnik/budjet.name.db')
const { get_all_region } = require('../../service/auth/region.db')

// login
const login = asyncHandler(async (req, res, next) => {
  const { error, value } = authValidation.validate(req.body);
  if (error) {
    return next(new ErrorResponse(error.details[0].message), 406);
  }
  const user = await getByLoginAuth(value.login);
  if (!user) {
    return next(new ErrorResponse("login yoki parol xato kiritildi", 403));
  }
  const matchPassword = await bcrypt.compare(value.password, user.password);
  if (!matchPassword) {
    return next(new ErrorResponse("login yoki parol xato kiritildi", 403));
  }
  let main_schet = null;

  if (value.main_schet_id) {
    main_schet = await getByIdMainSchet(user.region_id, value.main_schet_id);
    if (!main_schet) {
      return next(
        new ErrorResponse("Shot raqami raqami notog`ri kiritildi", 400),
      );
    }
  }
  const token = generateToken(user);
  return res.status(200).json({
    success: true,
    data: {
      user,
      main_schet,
      token,
    },
  });
});

// update
const update = asyncHandler(async (req, res, next) => {
  const { error, value } = authUpdateValidation.validate(req.body);
  const id = req.user.id;

  const user = await getByIdAuth(id);

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
      const test = await getByLoginAuth(login);
      if (test) {
        return next(new ErrorResponse("Login avval ishlatilgan", 400));
      }
      user.login = login;
    }
  }

  await updateAuth(user.login, user.password, user.fio, id);

  return res.status(200).json({
    success: true,
    data: "Muvaffaqiyatli yangilandi",
  });
});

// get profile
const getProfile = asyncHandler(async (req, res, next) => {
  const user = await getProfileAuth(req.user.id);

  if (!user) {
    return next(
      new ErrorResponse("Server xatolik. Foydalanuvchi topilmadi", 404),
    );
  }

  return res.status(200).json({
    success: true,
    data: user,
  });
});

// select budget
const select_budget = asyncHandler(async (req, res, next) => {
  const region_id = req.query.region_id
  const result = await getByBudjet_idMain_schet(req.params.id, region_id);

  return res.status(200).json({
    success: true,
    data: result,
  });
});


const forLogin = asyncHandler(async (req, res, next) => {
  const all_budjet = await getAllBudjet()
  const all_region = await get_all_region()

  return res.status(200).json({
    success: true,
    data: { all_budjet, all_region }
  })
})


module.exports = {
  login,
  update,
  getProfile,
  select_budget,
  forLogin
};
