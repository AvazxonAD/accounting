const {
  createShartnoma,
  getAllShartnoma,
  updateShartnomaDB,
  getByIdShartnomaService,
  deleteShartnomaDB,
} = require("../shartnoma/shartnoma.service.js");
const { getByIdSmeta } = require("../smeta/smeta.service.js");
const { getByIdOrganizationService } = require("../spravochnik/organization/organization.service.js");
const { shartnomaValidation, ShartnomaqueryValidation } = require("../utils/validation");;
const { createShartnomaGrafik } = require("../shartnoma/shartnoma.grafik.service.js");
const { getByIdMainSchetService } = require("../spravochnik/main.schet/main.schet.service.js");
const { validationResponse } = require('../utils/response-for-validation.js')
const { errorCatch } = require("../utils/errorCatch.js");
const { resFunc } = require("../utils/resFunc.js");

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
    await getByIdOrganizationService(region_id, data.spravochnik_organization_id);
    const shartnoma = await createShartnoma({ ...data, user_id, main_schet_id });
    const grafik_data = {user_id, shartnoma_id: shartnoma.id, year: data.doc_date.split('-')[0]}
    if(shartnoma.yillik_oylik){
      grafik_data.oy_1 = shartnoma.summa / 12 
      grafik_data.oy_2 = shartnoma.summa / 12 
      grafik_data.oy_3 = shartnoma.summa / 12 
      grafik_data.oy_4 = shartnoma.summa / 12 
      grafik_data.oy_5 = shartnoma.summa / 12 
      grafik_data.oy_6 = shartnoma.summa / 12 
      grafik_data.oy_7 = shartnoma.summa / 12 
      grafik_data.oy_8 = shartnoma.summa / 12 
      grafik_data.oy_9 = shartnoma.summa / 12 
      grafik_data.oy_10 = shartnoma.summa / 12 
      grafik_data.oy_11 = shartnoma.summa / 12 
      grafik_data.oy_12 = shartnoma.summa / 12 
    } else{
      const key = `oy_` + `${shartnoma.doc_date.getMonth() + 1}` 
      grafik_data[key] = shartnoma.summa
    }
    const grafik = await createShartnomaGrafik(data);
    shartnoma.grafik = grafik
    resFunc(res, 200, shartnoma)
  } catch (error) {
    errorCatch(error, res)
  }
}

// get all
const getAll = async (req, res) => {
  try {
    const region_id = req.user.region_id;
    const { page, limit, main_schet_id, organization, pudratchi, search } = validationResponse(ShartnomaqueryValidation, req.query)
    await getByIdMainSchetService(region_id, main_schet_id);
    const offset = (page - 1) * limit;
    const { data, total } = await getAllShartnoma(region_id, main_schet_id, offset, limit, organization, pudratchi, search);
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

// get element by id
const getElementById = async (req, res) => {
  try {
    const region_id = req.user.region_id;
    const main_schet_id = req.query.main_schet_id;
    const id = req.params.id;
    await getByIdMainSchetService(region_id, main_schet_id);
    const result = await getByIdShartnomaService(region_id, main_schet_id, id, null, true);
    resFunc(res, 200, result)
  } catch (error) {
    errorCatch(error, res)
  }
}

// update shartnoma
const update_shartnoma = async (req, res) => {
  try {
    const region_id = req.user.region_id;
    const main_schet_id = req.query.main_schet_id;
    const id = req.params.id;
    await getByIdShartnomaService(region_id, main_schet_id, id);
    const data = validationResponse(shartnomaValidation, req.body)
    await getByIdMainSchetService(region_id, main_schet_id);
    await getByIdSmeta(data.smeta_id);
    await getByIdOrganizationService(region_id, data.spravochnik_organization_id);
    const result = await updateShartnomaDB({ ...data, id });
    resFunc(res, 200, result)
  } catch (error) {
    errorCatch(error, res)
  }
}

// delete shartnoma
const deleteShartnoma = async (req, res) => {
  try {
    const region_id = req.user.region_id;
    const main_schet_id = req.query.main_schet_id;
    const id = req.params.id;
    await getByIdMainSchetService(region_id, main_schet_id);
    await getByIdShartnomaService(region_id, main_schet_id, id);
    await deleteShartnomaDB(id);
    resFunc(res, 200, 'delete success true')
  } catch (error) {
    errorCatch(error, res)
  }
}

module.exports = {
  create,
  getAll,
  getElementById,
  update_shartnoma,
  deleteShartnoma,
};
