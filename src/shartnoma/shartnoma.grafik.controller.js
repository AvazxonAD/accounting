const { getByIdGrafikDB, getAllGrafikDB, updateShartnomaGrafikDB } = require("../shartnoma/shartnoma.grafik.service");
const ErrorResponse = require("../utils/errorResponse");
const { sum } = require("../utils/returnSumma");
const { shartnomaGarfikValidation, ShartnomaqueryValidation } = require("../utils/validation");;
const { OrganizationDB } = require("../spravochnik/organization/db.js");
const { errorCatch } = require("../utils/errorCatch");
const { resFunc } = require("../utils/resFunc");
const { validationResponse } = require('../utils/response-for-validation')
const { getByIdBudjetService } = require('../spravochnik/budjet/budjet.name.service')

// update conctract grafik 
const updateShartnomaGrafik = async (req, res) => {
  try {
    const region_id = req.user.region_id;
    const budjet_id = req.query.budjet_id;
    const id = req.params.id;
    await getByIdBudjetService(budjet_id)
    const grafik = await getByIdGrafikDB(region_id, budjet_id, id);
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
    const { organization, budjet_id, page, limit } = validationResponse(ShartnomaqueryValidation, req.query)
    const offset = (page - 1) * limit;
    await getByIdBudjetService(budjet_id);
    if(organization){
      await (region_id, organization)
    }
    const { data, total } = await getAllGrafikDB(region_id, budjet_id, organization, limit, offset);
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
    const budjet_id = req.query.budjet_id;
    const id = req.params.id;
    await getByIdBudjetService(budjet_id);
    const result = await getByIdGrafikDB(region_id, budjet_id, id, true);
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
