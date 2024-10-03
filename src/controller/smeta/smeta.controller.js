const pool = require("../../config/db");
const asyncHandler = require("../../middleware/asyncHandler");
const ErrorResponse = require("../../utils/errorResponse");
const {
  smetaValidation,
} = require("../../helpers/validation/smeta/smeta.validation");

const {
  getByAllSmeta,
  createSmeta,
  getAllSmeta,
  getTotalSmeta,
  getByIdSmeta,
  updateSmeta,
  deleteSmeta,
} = require("../../service/smeta/smeta.db");

// create
const create = asyncHandler(async (req, res, next) => {
  const { error, value } = smetaValidation.validate(req.body);
  if (error) {
    return next(new ErrorResponse(error.details[0].message, 400));
  }

  const { smeta_name, smeta_number, father_smeta_name } = value;

  const test = await getByAllSmeta(smeta_name, smeta_number, father_smeta_name);
  if (test) {
    return next(new ErrorResponse("Ushbu malumot avval kiritilgan", 409));
  }

  await createSmeta(smeta_name, smeta_number, father_smeta_name);

  return res.status(201).json({
    success: true,
    data: "Muvafaqyatli kiritildi",
  });
});

// get all
const getAll = asyncHandler(async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;

  if (limit <= 0 || page <= 0) {
    return next(
      new ErrorResponse("Limit va page musbat sonlar bo'lishi kerak", 400),
    );
  }

  const offset = (page - 1) * limit;

  const result = await getAllSmeta(offset, limit);

  const totalQuery = await getTotalSmeta();
  const total = parseInt(totalQuery.total);
  const pageCount = Math.ceil(total / limit);

  return res.status(200).json({
    success: true,
    meta: {
      pageCount: pageCount,
      count: total,
      currentPage: page,
      nextPage: page >= pageCount ? null : page + 1,
      backPage: page === 1 ? null : page - 1,
    },
    data: result,
  });
});

// get element by id
const getElementById = asyncHandler(async (req, res, next) => {
  const result = await getByIdSmeta(req.params.id, true);
  if (!result) {
    return next(new ErrorResponse("Server xatolik. Smeta topilmadi", 404));
  }

  return res.status(200).json({
    success: true,
    data: result,
  });
});

// update
const update = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const { error, value } = smetaValidation.validate(req.body);
  if (error) {
    return next(new ErrorResponse(error.details[0].message, 400));
  }
  const { smeta_name, smeta_number, father_smeta_name } = value;

  const smeta = await getByIdSmeta(id);
  if (!smeta) {
    return next(new ErrorResponse("Server xatolik. Smeta topilmadi", 404));
  }

  if (
    smeta.smeta_name !== smeta_name ||
    smeta.smeta_number !== smeta_number ||
    smeta.father_smeta_name !== father_smeta_name
  ) {
    const test = await getByAllSmeta(
      smeta_name,
      smeta_number,
      father_smeta_name,
    );
    if (test) {
      return next(new ErrorResponse("Ushbu malumot avval kiritilgan", 409));
    }
  }

  await updateSmeta(smeta_name, smeta_number, father_smeta_name, id);

  return res.status(201).json({
    success: true,
    data: "Muvafaqyatli yangilandi",
  });
});

// delete value
const deleteValue = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const value = await getByIdSmeta(id);
  if (!value) {
    return next(new ErrorResponse("Server xatolik. Malumot topilmadi", 404));
  }

  await deleteSmeta(id);

  return res.status(200).json({
    success: true,
    data: "Muvaffaqiyatli ochirildi",
  });
});

module.exports = {
  create,
  getAll,
  deleteValue,
  update,
  getElementById,
};
