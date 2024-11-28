const {
  getByAllSmetaGrafik,
  createSmetaGrafik,
  getAllSmetaGrafik,
  getElementByIdGrafik,
  updateSmetaGrafikDB,
  deleteSmetaGrafik,
} = require("../smeta/smeta.grafik.service");
const { sum } = require("../utils/returnSumma");
const { smetaGrafikValidation, queryValidation } = require("../utils/validation");;
const { getByIdSmeta } = require("../smeta/smeta.service");
const { getByIdBudjetService } = require("../spravochnik/budjet/budjet.name.service");
const { validationResponse } = require('../utils/response-for-validation')
const { resFunc } = require('../utils/resFunc')
const { errorCatch } = require('../utils/errorCatch')

// create
const create = async (req, res) => {
  try {
    const region_id = req.user.region_id;
    const user_id = req.user.id;
    const data = validationResponse(smetaGrafikValidation, req.body)
    const smeta = await SmetaDB.getByIdSmeta([data.smeta_id]);
    if(!smeta){
      return res.status(404).json({
        message: "smeta not found"
      })
    };
    await getByIdBudjetService(data.spravochnik_budjet_name_id);
    await getByAllSmetaGrafik(region_id, data.smeta_id, data.spravochnik_budjet_name_id, data.year);
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
      data.oy_12
    );
    const result = await createSmetaGrafik({user_id, ...data, itogo});
    resFunc(res, 200, result)
  } catch (error) {
    errorCatch(error, res)
  }
}

// get all smeta grafik 
const getSmetaGrafik = async (req, res) => {
  try {
    const region_id = req.user.region_id;
    const { page, limit, budjet_id } = validationResponse(queryValidation, req.query)
    if(budjet_id){
      await getByIdBudjetService(budjet_id)
    }
    const offset = (page - 1) * limit;
    const { 
      data, 
      total, 
      itogo,
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
     } = await getAllSmetaGrafik(region_id, offset, limit, budjet_id,);
    const pageCount = Math.ceil(total / limit);
    const meta = {
      pageCount: pageCount,
      count: total,
      currentPage: page,
      nextPage: page >= pageCount ? null : page + 1,
      backPage: page === 1 ? null : page - 1,
      itogo,
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
    const data = validationResponse(smetaGrafikValidation, req.body)
    const old_data = await getElementByIdGrafik(region_id, id);
    if(old_data.smeta_id !== data.smeta_id || old_data.spravochnik_budjet_name_id !== data.spravochnik_budjet_name_id || old_data.year !== data.year){
      await getByAllSmetaGrafik(region_id, data.smeta_id, data.spravochnik_budjet_name_id, data.year);
    }
    const smeta = await SmetaDB.getByIdSmeta([data.smeta_id]);
    if(!smeta){
      return res.status(404).json({
        message: "smeta not found"
      })
    };
    await getByIdBudjetService(data.spravochnik_budjet_name_id);
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
      data.oy_12
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
