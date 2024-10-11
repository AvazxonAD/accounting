const {
  createShartnoma,
  getAllShartnoma,
  updateShartnomaDB,
  getByIdShartnomaService,
  deleteShartnomaDB,
} = require("../../service/shartnoma/shartnoma.service");
const ErrorResponse = require("../../utils/errorResponse");
const { getByIdSmeta } = require("../../service/smeta/smeta.service");
const { getByIdOrganizationService } = require("../../service//spravochnik/organization.service");
const { shartnomaValidation } = require("../../helpers/validation/shartnoma/shartnoma.validation");
const { createShartnomaGrafik } = require("../../service/shartnoma/shartnoma.grafik.service");
const { getByIdMainSchetService } = require("../../service/spravochnik/main.schet.service.js");
const { validationResponse } = require('../../helpers/response-for-validation.js')
const { errorCatch } = require("../../helpers/errorCatch.js");
const { resFunc } = require("../../helpers/resFunc.js");

// create contract 
const create = async (req, res) => {
  try {
    const region_id = req.user.region_id;
    const user_id = req.user.id;
    const main_schet_id = req.query.main_schet_id;
    const data = validationResponse(shartnomaValidation, req.body)
    await getByIdMainSchetService(region_id, main_schet_id)
    await getByIdSmeta(data.smeta_id);
    if (data.smeta2_id) {
      await getByIdSmeta(data.smeta2_id)
    }
    await getByIdOrganizationService( region_id,data.spravochnik_organization_id);
    const shartnoma = await createShartnoma({ ...data, user_id, main_schet_id });
    await createShartnomaGrafik(user_id, shartnoma.id, main_schet_id, data.grafik_year);
    resFunc(res,)
  } catch (error) {
    errorCatch(error, res)
  }
}

// get all
const getAll = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const region_id = req.user.region_id;
    const main_schet_id = req.query.main_schet_id;
    const organization_id = req.query.organization
    const pudratchi_bool = req.query.pudratchi

    if (limit <= 0 || page <= 0) {
      return next(new ErrorResponse("Limit va page musbat sonlar bo'lishi kerak", 400));
    }
    await getByIdMainSchetService(region_id, main_schet_id);
    const offset = (page - 1) * limit;

    const result = await getAllShartnoma(region_id, main_schet_id, offset, limit, organization_id, pudratchi_bool);
    const total = parseInt(result.total_count);
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
      data: result.data ? result.data : [],
    });
  } catch (error) {
    errorCatch(error, res)
  }
}

// get element by id
const getElementById = async (req, res) => {
  const region_id = req.user.region_id;
  const main_schet_id = req.query.main_schet_id;
  const id = req.params.id;

  const main_schet = await getByIdMainSchetService(region_id, main_schet_id);
  if (!main_schet) {
    return next(new ErrorResponse("Server xatolik. Main schet topilmadi", 404));
  }

  const result = await getByIdShartnomaService(region_id, main_schet_id, id, true);
  if (!result) {
    return next(new ErrorResponse("Server xatolik. Shartnoma topilmadi", 404));
  }

  return res.status(200).json({
    success: true,
    data: result,
  });
}

// update shartnoma
const update_shartnoma = async (req, res) => {
  try {
    const region_id = req.user.region_id;
    const main_schet_id = req.query.main_schet_id;
    const id = req.params.id;

    const test = await getByIdShartnomaService(region_id, main_schet_id, id);

    const { error, value } = shartnomaValidation.validate(req.body);
    if (error) {
      return next(new ErrorResponse(error.details[0].message, 400));
    }

    const main_schet = await getByIdMainSchetService(region_id, main_schet_id);
    if (!main_schet) {
      return next(new ErrorResponse("Server xatolik. Main schet topilmadi", 404));
    }

    const test_smeta = await getByIdSmeta(value.smeta_id);
    if (!test_smeta) {
      return next(new ErrorResponse("Smeta topilmadi", 500));
    }

    const test_organization = await getByIdOrganizationService(
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
  } catch (error) {
    errorCatch(error, res)
  }
}

// delete shartnoma
const deleteShartnoma = async (req, res) => {
  const region_id = req.user.region_id;
  const main_schet_id = req.query.main_schet_id;
  const id = req.params.id;

  const main_schet = await getByIdMainSchetService(region_id, main_schet_id);
  if (!main_schet) {
    return next(new ErrorResponse("Server xatolik. Main schet topilmadi", 404));
  }

  const test = await getByIdShartnomaService(region_id, main_schet_id, id);
  if (!test) {
    return next(new ErrorResponse("Server xatolik. Shartnoma topilmadi", 404));
  }

  await deleteShartnomaDB(id);

  return res.status(200).json({
    sucess: true,
    data: "Muvaffaqiyatli ochirildi",
  });
}

module.exports = {
  create,
  getAll,
  getElementById,
  update_shartnoma,
  deleteShartnoma,
};
