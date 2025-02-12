const {
  createMainSchetService,
  getByIdMainSchetService,
  getAllMainSchetService,
  updateMainSchetService,
  deleteMainSchetService,
  checkMainSchetService,
  getByAccountNumberMainSchetService,
  getByBudjetIdMainSchetService
} = require("./main.schet.service");
const { getByIdBudjetService } = require("@budjet/budjet.name.service");
const { mainSchetValidator, queryMainSchetValidation } = require("@utils/validation");;
const { resFunc } = require("@utils/resFunc");
const { validationResponse } = require("@utils/response-for-validation");
const { errorCatch } = require("@utils/errorCatch");

// create
const create = async (req, res) => {
  try {
    const region_id = req.user.region_id
    const user_id = req.user.id
    const data = validationResponse(mainSchetValidator, req.body)
    await getByIdBudjetService(data.spravochnik_budjet_name_id);
    await getByAccountNumberMainSchetService(region_id, data.account_number)
    const result = await createMainSchetService({ ...data, user_id });
    resFunc(res, 200, result)
  } catch (error) {
    errorCatch(error, res)
  }
}

// get all
const getAll = async (req, res) => {
  try {
    const { limit, page, search } = validationResponse(queryMainSchetValidation, req.query)
    const offset = (page - 1) * limit;
    const { result, total } = await getAllMainSchetService(req.user.region_id, offset, limit, search);
    const pageCount = Math.ceil(total / limit);
    const meta = {
      pageCount: pageCount,
      count: total,
      currentPage: page,
      nextPage: page >= pageCount ? null : page + 1,
      backPage: page === 1 ? null : page - 1,
    }
    resFunc(res, 200, result, meta)
  } catch (error) {
    errorCatch(error, res)
  }
}

// update
const update = async (req, res) => {
  try {
    const region_id = req.user.region_id;
    const id = req.params.id;
    const testMain_schet = await getByIdMainSchetService(region_id, id);
    const data = validationResponse(mainSchetValidator, req.body)
    if (data.account_number !== testMain_schet.account_number) {
      await getByAccountNumberMainSchetService(region_id, data.account_number);
    }
    await getByIdBudjetService(data.spravochnik_budjet_name_id);
    const result = await updateMainSchetService({ ...data, id, });
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
    await getByIdMainSchetService(region_id, id);
    await checkMainSchetService(id)
    await deleteMainSchetService(id);
    resFunc(res, 200, 'delete success true')
  } catch (error) {
    errorCatch(error, res)
  }
}

// get element by id
const getElementById = async (req, res) => {
  try {
    const data = await getByIdMainSchetService(req.user.region_id, req.params.id, true);
    resFunc(res, 200, data)
  } catch (error) {
    errorCatch(error, res)
  }
}

// get by budjet id 
const getByBudjetIdMainSchet = async (req, res) => {
  try {
    const region_id = req.query.region_id;
    const budjet_id = req.query.budjet_id;
    const result = await getByBudjetIdMainSchetService(budjet_id, region_id);
    resFunc(res, 200, result)
  } catch (error) {
    errorCatch(error, res)
  }
}


module.exports = {
  getElementById,
  create,
  getAll,
  deleteValue,
  update,
  getByBudjetIdMainSchet
};
