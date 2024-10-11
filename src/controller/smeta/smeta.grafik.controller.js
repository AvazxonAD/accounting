const {
  getByAllSmetaGrafik,
  createSmetaGrafik,
  getAllSmetaGrafik,
  getElementByIdGrafik,
  updateSmetaGrafikDB,
  deleteSmetaGrafik,
} = require("../../service/smeta/smeta.grafik.service");
const pool = require("../../config/db");
const ErrorResponse = require("../../utils/errorResponse");
const { sum } = require("../../utils/returnSumma");
const { smetaGrafikValidation, smetaGrafikUpdateValidation, queryValidation } = require("../../helpers/validation/smeta/smeta.validation");
const { getByIdSmeta } = require("../../service/smeta/smeta.service");
const { getByIdBudjetService } = require("../../service/spravochnik/budjet.name.service");
const { validationResponse } = require('../../helpers/response-for-validation')
const { resFunc } = require('../../helpers/resFunc')
const { errorCatch } = require('../../helpers/errorCatch')

// create
const create = async (req, res) => {
  try {
    const region_id = req.user.region_id;
    const user_id = req.user.id;
    const { smeta_id, spravochnik_budjet_name_id, year } = validationResponse(smetaGrafikValidation, req.body)
    await getByIdSmeta(smeta_id);
    await getByIdBudjetService(spravochnik_budjet_name_id);
    await getByAllSmetaGrafik(region_id, smeta_id, spravochnik_budjet_name_id, year);
    const result = await createSmetaGrafik(user_id, smeta_id, spravochnik_budjet_name_id, year);
    resFunc(res, 200, result)
  } catch (error) {
    errorCatch(error, res)
  }
}

// get all smeta grafik 
const getSmetaGrafik = async (req, res) => {
  try {
    const region_id = req.user.region_id;
    const { page, limit } = validationResponse(queryValidation, req.query)
    const offset = (page - 1) * limit;
    const { data, total } = await getAllSmetaGrafik(region_id, offset, limit);
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

// get elament by id
const getElemnetById = async (req, res) => {
  try {
    const region_id = req.user.region_id;
    const id = req.params.id;
    const result = await getElementByIdGrafik(region_id, id, true);
    resFunc(res, 200, result)
  } catch (error) {
    errorCatch(error, res)
  }
}

// update
const update = async (req, res) => {
  try {
    const region_id = req.user.region_id;
    const id = req.params.id;
    await getElementByIdGrafik(region_id, id);
    const data = validationResponse(smetaGrafikUpdateValidation, req.body)
    const itogo = sum(
      data.oy_1,
      data.oy_2,
      data.oy_3,
      data.oy_4,
      data.oy_5,
      data.oy_6,
      data.oy_7,
      data.oy_8,
      data.oy_9,
      data.oy_10,
      data.oy_11,
      data.oy_12,
    );
    const result = await updateSmetaGrafikDB({ ...data, id, itogo });
    resFunc(res, 200, result)
  } catch (error) {
    errorCatch(error, res)
  }
}

// delete data
const deleteValue = async (req, res) => {
  try {
    const region_id = req.user.region_id;
    const id = req.params.id;
    await getElementByIdGrafik(region_id, id);
    await deleteSmetaGrafik(id);
    resFunc(res, 200, 'delete success true')
  } catch (error) {
    errorCatch(error, res)
  }
}

module.exports = {
  create,
  getSmetaGrafik,
  deleteValue,
  update,
  getElemnetById,
};
