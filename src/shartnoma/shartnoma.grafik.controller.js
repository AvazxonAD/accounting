const { getByIdGrafikDB, getAllGrafikDB, updateShartnomaGrafikDB } = require("../shartnoma/shartnoma.grafik.service");
const ErrorResponse = require("../utils/errorResponse");
const { sum } = require("../utils/returnSumma");
const { shartnomaGarfikValidation, ShartnomaqueryValidation } = require("../utils/validation");;
const { getByIdMainSchetService } = require("../spravochnik/main.schet/main.schet.service");
const { errorCatch } = require("../utils/errorCatch");
const { resFunc } = require("../utils/resFunc");
const { validationResponse } = require('../utils/response-for-validation')

// update conctract grafik 
const updateShartnomaGrafik = async (req, res) => {
  try {
    const region_id = req.user.region_id;
    const main_schet_id = req.query.main_schet_id;
    const id = req.params.id;
    const grafik = await getByIdGrafikDB(region_id, main_schet_id, id);
    const data = validationResponse(shartnomaGarfikValidation, req.body)
    const { oy_1, oy_2, oy_3, oy_4, oy_5, oy_6, oy_7, oy_8, oy_9, oy_10, oy_11, oy_12 } = data
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
      oy_12
    );
    if ((Math.round((summa + Number.EPSILON) * 100) / 100) !== grafik.summa) {
      throw new ErrorResponse("The amount was entered incorrectly", 400)
    }
    const result = await updateShartnomaGrafikDB({ ...data, id });
    resFunc(res, 200, result);
  } catch (error) {
    errorCatch(error, res)
  }
}

const getAllGrafik = async (req, res) => {
  try {
    const region_id = req.user.region_id;
    const { organization, main_schet_id, page, limit } = validationResponse(ShartnomaqueryValidation, req.query)
    const offset = (page - 1) * limit;
    await getByIdMainSchetService(region_id, main_schet_id);
    const { data, total } = await getAllGrafikDB(region_id, main_schet_id, organization, limit, offset);
    const pageCount = Math.ceil(total / limit);
    const meta = {
      pageCount: pageCount,
      count: total,
      currentPage: page,
      nextPage: page >= pageCount ? null : page + 1,
      backPage: page === 1 ? null : page - 1,
    }
    resFunc(res, 200, data, meta)
  } catch (error) {
    errorCatch(error, res)
  }
}

const getElementByIdGrafik = async (req, res) => {
  try {
    const region_id = req.user.region_id;
    const main_schet_id = req.query.main_schet_id;
    const id = req.params.id;
    await getByIdMainSchetService(region_id, main_schet_id);
    const result = await getByIdGrafikDB(region_id, main_schet_id, id, true);
    resFunc(res, 200, result);
  } catch (error) {
    errorCatch(error, res)
  }
}

module.exports = {
  getAllGrafik,
  getElementByIdGrafik,
  updateShartnomaGrafik
};
