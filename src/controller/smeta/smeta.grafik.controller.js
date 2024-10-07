const pool = require("../../config/db");
const asyncHandler = require("../../middleware/asyncHandler");
const ErrorResponse = require("../../utils/errorResponse");
const { sum } = require("../../utils/returnSumma");
const {
  smetaGrafikValidation,
  smetaGrafikUpdateValidation,
} = require("../../helpers/validation/smeta/smeta.validation");
const { getByIdSmeta } = require("../../service/smeta/smeta.service");
const { getByIdBudjet } = require("../../service/spravochnik/budjet.name.service");
const {
  getByAllSmetaGrafik,
  createSmetaGrafik,
  getAllSmetaGrafik,
  getElementByIdGrafik,
  updateSmetaGrafikDB,
  deleteSmetaGrafik,
} = require("../../service/smeta/smeta.grafik.service");

// create
const create = asyncHandler(async (req, res, next) => {
  const region_id = req.user.region_id;
  const user_id = req.user.id;
  const { error, value } = smetaGrafikValidation.validate(req.body);
  if (error) {
    return next(new ErrorResponse(error.details[0].message, 400));
  }

  let { smeta_id, spravochnik_budjet_name_id, year } = value;

  const smeta = await getByIdSmeta(smeta_id);
  if (!smeta) {
    return next(new ErrorResponse("Server xatolik smeta topilmadi", 500));
  }

  const budjet = await getByIdBudjet(spravochnik_budjet_name_id);
  if (!budjet) {
    return next(new ErrorResponse("Server xatolik budjet topilmadi", 500));
  }

  const test = await getByAllSmetaGrafik(
    region_id,
    smeta_id,
    spravochnik_budjet_name_id,
    year,
  );
  if (test) {
    return next(new ErrorResponse("Ushbu malumot avval kiritilgan", 409));
  }

  await createSmetaGrafik(user_id, smeta_id, spravochnik_budjet_name_id, year);

  return res.status(201).json({
    success: true,
    data: "Muvafaqyatli kiritildi",
  });
});

// get all smeta grafik 
const getSmetaGrafik = asyncHandler(async (req, res, next) => {
  const region_id = req.user.region_id;
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;

  if (limit <= 0 || page <= 0) {
    return next(
      new ErrorResponse("Limit va page musbat sonlar bo'lishi kerak", 400),
    );
  }

  const offset = (page - 1) * limit;

  const result = await getAllSmetaGrafik(region_id, offset, limit);

  const formattedResult = result.map((row) => ({
    ...row,
    itogo: Number(row.itogo),
    oy_1: Number(row.oy_1),
    oy_2: Number(row.oy_2),
    oy_3: Number(row.oy_3),
    oy_4: Number(row.oy_4),
    oy_5: Number(row.oy_5),
    oy_6: Number(row.oy_6),
    oy_7: Number(row.oy_7),
    oy_8: Number(row.oy_8),
    oy_9: Number(row.oy_9),
    oy_10: Number(row.oy_10),
    oy_11: Number(row.oy_11),
    oy_12: Number(row.oy_12),
    year: parseInt(row.year),
  }));

  const totalQuery = await pool.query(
    `SELECT COUNT(id) AS total FROM smeta WHERE isdeleted = false`,
  );
  const total = parseInt(totalQuery.rows[0].total);
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
    data: formattedResult,
  });
});

// get elament by id
const getElemnetById = asyncHandler(async (req, res, next) => {
  const region_id = req.user.region_id;
  const id = req.params.id;

  const result = await getElementByIdGrafik(region_id, id, true);

  if (!result) {
    return next(new ErrorResponse("Server xatoilik. Grafik topilmadi", 500));
  }

  const object = { ...result };
  object.itogo = Number(object.itogo);
  object.oy_1 = Number(object.oy_1);
  object.oy_2 = Number(object.oy_2);
  object.oy_3 = Number(object.oy_3);
  object.oy_4 = Number(object.oy_4);
  object.oy_5 = Number(object.oy_5);
  object.oy_6 = Number(object.oy_6);
  object.oy_7 = Number(object.oy_7);
  object.oy_8 = Number(object.oy_8);
  object.oy_9 = Number(object.oy_9);
  object.oy_10 = Number(object.oy_10);
  object.oy_11 = Number(object.oy_11);
  object.oy_12 = Number(object.oy_12);
  object.year = parseInt(object.year);

  return res.status(200).json({
    success: true,
    data: object,
  });
});

// update
const update = asyncHandler(async (req, res, next) => {
  const region_id = req.user.region_id;
  const id = req.params.id;

  const test = await getElementByIdGrafik(region_id, id);
  if (!test) {
    return next(new ErrorResponse("Server xatolik. Grafik topilmadi", 500));
  }

  const { error, value } = smetaGrafikUpdateValidation.validate(req.body);
  if (error) {
    return next(new ErrorResponse(error.details[0].message, 400));
  }

  const itogo = sum(
    value.oy_1,
    value.oy_2,
    value.oy_3,
    value.oy_4,
    value.oy_5,
    value.oy_6,
    value.oy_7,
    value.oy_8,
    value.oy_9,
    value.oy_10,
    value.oy_11,
    value.oy_12,
  );

  await updateSmetaGrafikDB({ ...value, id, itogo });

  return res.status(201).json({
    success: true,
    data: "Muvafaqyatli yangilandi",
  });
});

// delete value
const deleteValue = asyncHandler(async (req, res, next) => {
  const region_id = req.user.region_id;
  const id = req.params.id;

  const test = await getElementByIdGrafik(region_id, id);
  if (!test) {
    return next(new ErrorResponse("Server xatolik. Malumot topilmadi", 404));
  }

  await deleteSmetaGrafik(id);

  return res.status(200).json({
    success: true,
    data: "Muvaffaqiyatli ochirildi",
  });
});

module.exports = {
  create,
  getSmetaGrafik,
  deleteValue,
  update,
  getElemnetById,
};
