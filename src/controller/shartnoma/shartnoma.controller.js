const pool = require("../../config/db");
const asyncHandler = require("../../middleware/asyncHandler");
const ErrorResponse = require("../../utils/errorResponse");

const { getByIdSmeta } = require("../../service/smeta/smeta.service");
const { getByIdOrganization } = require("../../service//spravochnik/organization.service");
const { shartnomaValidation } = require("../../helpers/validation/shartnoma/shartnoma.validation");
const { createShartnomaGrafik } = require("../../service/shartnoma/shartnoma.grafik.service");
const { getByIdMainSchet } = require("../../service/spravochnik/main.schet.service.js");

const {
  createShartnoma,
  getAllShartnoma,
  getTotalShartnoma,
  updateShartnomaDB,
  getByIdOrganizationShartnoma,
  getByIdShartnomaDB,
  deleteShartnomaDB,
  forJur3DB
} = require("../../service/shartnoma/shartnoma.service");

const create = asyncHandler(async (req, res, next) => {
  const region_id = req.user.region_id;
  const user_id = req.user.id;
  const main_schet_id = req.query.main_schet_id;

  const { error, value } = shartnomaValidation.validate(req.body);
  if (error) {
    return next(new ErrorResponse(error.details[0].message, 400));
  }

  const main_schet = await getByIdMainSchet(region_id, main_schet_id);
  if (!main_schet) {
    return next(new ErrorResponse("Server xatolik. Main schet topilmadi", 404));
  }

  const test_smeta = await getByIdSmeta(value.smeta_id);
  if (!test_smeta) {
    return next(new ErrorResponse("Smeta topilmadi", 500));
  }

  const test_organization = await getByIdOrganization(
    region_id,
    value.spravochnik_organization_id,
  );
  if (!test_organization) {
    return next(new ErrorResponse("Hamkor topilmadi", 500));
  }

  const shartnoma = await createShartnoma({ ...value, user_id, main_schet_id });

  await createShartnomaGrafik(
    user_id,
    shartnoma.id,
    main_schet_id,
    value.grafik_year,
  );

  return res.status(201).json({
    success: true,
    data: "Muvafaqiyatli kiritildi",
  });
});

// get all
const getAll = asyncHandler(async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;
  const region_id = req.user.region_id;
  const main_schet_id = req.query.main_schet_id;

  if (limit <= 0 || page <= 0) {
    return next(
      new ErrorResponse("Limit va page musbat sonlar bo'lishi kerak", 400),
    );
  }

  const main_schet = await getByIdMainSchet(region_id, main_schet_id);
  if (!main_schet) {
    return next(new ErrorResponse("Server xatolik. Main schet topilmadi", 404));
  }

  const offset = (page - 1) * limit;

  const result = await getAllShartnoma(region_id, main_schet_id, offset, limit);
  const totalQuery = await getTotalShartnoma(region_id, main_schet_id);
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
  const region_id = req.user.region_id;
  const main_schet_id = req.query.main_schet_id;
  const id = req.params.id;

  const main_schet = await getByIdMainSchet(region_id, main_schet_id);
  if (!main_schet) {
    return next(new ErrorResponse("Server xatolik. Main schet topilmadi", 404));
  }

  const result = await getByIdShartnomaDB(region_id, main_schet_id, id, true);
  if (!result) {
    return next(new ErrorResponse("Server xatolik. Shartnoma topilmadi", 404));
  }

  return res.status(200).json({
    success: true,
    data: result,
  });
});

// update shartnoma
const update_shartnoma = asyncHandler(async (req, res, next) => {
  const region_id = req.user.region_id;
  const main_schet_id = req.query.main_schet_id;
  const id = req.params.id;

  const test = await getByIdShartnomaDB(region_id, main_schet_id, id);
  if (!test) {
    return next(new ErrorResponse("Server xatolik. Shartnoma topilmadi", 404));
  }

  const { error, value } = shartnomaValidation.validate(req.body);
  if (error) {
    return next(new ErrorResponse(error.details[0].message, 400));
  }

  const main_schet = await getByIdMainSchet(region_id, main_schet_id);
  if (!main_schet) {
    return next(new ErrorResponse("Server xatolik. Main schet topilmadi", 404));
  }

  const test_smeta = await getByIdSmeta(value.smeta_id);
  if (!test_smeta) {
    return next(new ErrorResponse("Smeta topilmadi", 500));
  }

  const test_organization = await getByIdOrganization(
    region_id,
    value.spravochnik_organization_id,
  );
  if (!test_organization) {
    return next(new ErrorResponse("Hamkor topilmadi", 500));
  }

  await updateShartnomaDB({ ...value, id });

  return res.status(201).json({
    success: true,
    data: "Muvafaqiyatli yangilandi",
  });
});

// delete shartnoma
const deleteShartnoma = asyncHandler(async (req, res, next) => {
  const region_id = req.user.region_id;
  const main_schet_id = req.query.main_schet_id;
  const id = req.params.id;

  const main_schet = await getByIdMainSchet(region_id, main_schet_id);
  if (!main_schet) {
    return next(new ErrorResponse("Server xatolik. Main schet topilmadi", 404));
  }

  const test = await getByIdShartnomaDB(region_id, main_schet_id, id);
  if (!test) {
    return next(new ErrorResponse("Server xatolik. Shartnoma topilmadi", 404));
  }

  await deleteShartnomaDB(id);

  return res.status(200).json({
    sucess: true,
    data: "Muvaffaqiyatli ochirildi",
  });
});

// get by organization id shartnoama
const getByIdOrganization_Shartnoma = asyncHandler(async (req, res, next) => {
  const result = await getByIdOrganizationShartnoma(
    req.user.region_id,
    req.query.main_schet_id,
    req.params.id,
  );
  return res.status(200).json({
    sucess: true,
    data: result,
  });
});

// for jur_3 
const  forJur3 = asyncHandler(async (req, res, next) => {
  const region_id = req.user.region_id;
  const main_schet_id = req.query.main_schet_id;
  const id = req.params.id;

  const main_schet = await getByIdMainSchet(region_id, main_schet_id);
  if (!main_schet) {
    return next(new ErrorResponse("Server xatolik. Main schet topilmadi", 404));
  }

  const result = await forJur3DB(region_id, main_schet_id);

  return res.status(200).json({
    success: true,
    data: result,
  });
})

module.exports = {
  create,
  getAll,
  getElementById,
  update_shartnoma,
  getByIdOrganization_Shartnoma,
  deleteShartnoma,
  forJur3
};
