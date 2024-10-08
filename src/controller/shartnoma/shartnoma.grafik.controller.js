const pool = require("../../config/db");
const asyncHandler = require("../../middleware/asyncHandler");
const ErrorResponse = require("../../utils/errorResponse");
const {
  getByIdGrafikDB,
  getAllGrafikDB,
  updateShartnomaGrafikDB,
} = require("../../service/shartnoma/shartnoma.grafik.service");

const { sum } = require("../../utils/returnSumma");
const {
  shartnomaGarfikValidation,
} = require("../../helpers/validation/shartnoma/shartnoma.validation");
const { getByIdMainSchet } = require("../../service/spravochnik/main.schet.service");

const updateShartnomaGrafik = asyncHandler(async (req, res, next) => {
  const region_id = req.user.region_id;
  const main_schet_id = req.query.main_schet_id;
  const id = req.params.id;

  const grafik = await getByIdGrafikDB(region_id, main_schet_id, id);
  if (!grafik) {
    return next(new ErrorResponse("Server xatolik. Grafik topilmadi", 404));
  }

  const { error, value } = shartnomaGarfikValidation.validate(req.body);
  if (error) {
    return next(new ErrorResponse(error.details[0].message, 400));
  }

  const {
    oy_1,
    oy_2,
    oy_3,
    oy_4,
    oy_5,
    oy_6,
    oy_7,
    oy_8,
    oy_9,
    oy_10,
    oy_11,
    oy_12,
  } = value;
  const summa = sum(
    oy_1,
    oy_2,
    oy_3,
    oy_4,
    oy_5,
    oy_6,
    oy_7,
    oy_8,
    oy_9,
    oy_10,
    oy_11,
    oy_12,
  );
  if (summa !== grafik.summa) {
    return next(new ErrorResponse("Summa notogri kiritildi", 400));
  }

  await updateShartnomaGrafikDB({ ...value });

  return res.status(200).json({
    success: true,
    data: "Muvaffaqiyatli yangilandi",
  });
});

const getAllGrafik = asyncHandler(async (req, res, next) => {
  const region_id = req.user.region_id;
  const shartnoma = req.query.shartnoma
  const main_schet_id = req.query.main_schet_id;

  const main_schet = await getByIdMainSchet(region_id, main_schet_id);

  const result = await getAllGrafikDB(region_id, main_schet_id, shartnoma);

  return res.status(200).json({
    success: true,
    data: result,
  });
});

const getElementByIdGrafik = asyncHandler(async (req, res, next) => {
  const region_id = req.user.region_id;
  const main_schet_id = req.query.main_schet_id;
  const id = req.params.id;

  const main_schet = await getByIdMainSchet(region_id, main_schet_id);
  if (!main_schet) {
    return next(new ErrorResponse("Server xatolik. main_schet topilmadi", 404));
  }

  const result = await getByIdGrafikDB(region_id, main_schet_id, id, true);

  return res.status(200).json({
    success: true,
    data: result,
  });
});

module.exports = {
  getAllGrafik,
  getElementByIdGrafik,
  updateShartnomaGrafik,
};
