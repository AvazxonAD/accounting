const pool = require("../../config/db");
const asyncHandler = require("../../middleware/asyncHandler");
const ErrorResponse = require("../../utils/errorResponse");
const {
  checkValueString,
  checkValueNumber,
} = require("../../utils/check.functions");
const {
  getByAllSmeta,
  createSmeta,
  getAllSmeta,
  getTotalSmeta,
  getByIdSmeta,
  updateSmeta,
  deleteSmeta,
} = require("../../service/smeta.db");

// create
const create = asyncHandler(async (req, res, next) => {
  let { smeta_name, smeta_number, father_smeta_name } = req.body;

  checkValueString(smeta_name, father_smeta_name);
  checkValueNumber(smeta_number);

  smeta_name = smeta_name.trim();
  father_smeta_name = father_smeta_name.trim();

  const test = await getByAllSmeta(smeta_name, smeta_number, father_smeta_name);
  if (test) {
    return next(new ErrorResponse("Ushbu malumot avval kiritilgan", 409));
  }

  const result = await createSmeta(smeta_name, smeta_number, father_smeta_name);
  if (!result) {
    return next(new ErrorResponse("Server xatolik. Malumot kiritilmadi", 500));
  }

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
    pageCount: pageCount,
    count: total,
    currentPage: page,
    nextPage: page >= pageCount ? null : page + 1,
    backPage: page === 1 ? null : page - 1,
    data: result,
  });
});

// get element by id
const getElementById = asyncHandler(async (req, res, next) => {
  const result = await getByIdSmeta(req.params.id);
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
  let { smeta_name, smeta_number, father_smeta_name } = req.body;
  const id = req.params.id;

  checkValueString(smeta_name, father_smeta_name);
  checkValueNumber(smeta_number);
  smeta_name = smeta_name.trim();
  father_smeta_name = father_smeta_name.trim();

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

  const result = await updateSmeta(
    smeta_name,
    smeta_number,
    father_smeta_name,
    id,
  );
  if (!result) {
    return next(new ErrorResponse("Server xatolik. Malumot Yangilanmadi", 500));
  }

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

  const deleteValue = await deleteSmeta(id);
  if (!deleteValue) {
    return next(new ErrorResponse("Server xatolik. Malumot ochirilmadi", 500));
  }

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
