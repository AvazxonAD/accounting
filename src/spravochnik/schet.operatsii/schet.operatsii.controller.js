const {
  createSchetOperatsiiService,
  getByIdSchetOperatsiiService,
  getAllSchetOperatsiiService,
  updateSchetOperatsiiService,
  deleteSchetOperatsiiService,
  getByAllOperatsiiService
} = require("./schet.operatsii.service");
const { getByIdBudjetService } = require("../budjet/budjet.name.service");
const { schetOperatsiiValidation, schetOperatsiiQueryValidation } = require("../../utils/validation");;
const { resFunc } = require("../../utils/resFunc");
const { validationResponse } = require("../../utils/response-for-validation");
const { errorCatch } = require("../../utils/errorCatch");

// create
const create = async (req, res) => {
  try {
    const region_id = req.user.region_id
    const user_id = req.user.id
    const data = validationResponse(schetOperatsiiValidation, req.body)
    await getByAllOperatsiiService(region_id, data.name, data.schet)
    const result = await createSchetOperatsiiService({ ...data, user_id });
    resFunc(res, 200, result)
  } catch (error) {
    errorCatch(error, res)
  }
}

// get all
const getAll = async (req, res) => {
  try {
    const { limit, page, search } = validationResponse(schetOperatsiiQueryValidation, req.query)
    const offset = (page - 1) * limit;
    const { result, total } = await getAllSchetOperatsiiService(req.user.region_id, offset, limit, search);
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
    const oldData = await getByIdSchetOperatsiiService(region_id, id);
    const data = validationResponse(schetOperatsiiValidation, req.body)
    if (data.name !== oldData.name || data.schet !== oldData.schet) {
      await getByAllOperatsiiService(region_id, data.name, data.schet);
    }
    const result = await updateSchetOperatsiiService({ ...data, id });
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
    await getByIdSchetOperatsiiService(region_id, id);
    await deleteSchetOperatsiiService(id);
    resFunc(res, 200, 'delete success true')
  } catch (error) {
    errorCatch(error, res)
  }
}

// get element by id
const getElementById = async (req, res) => {
  try {
    const data = await getByIdSchetOperatsiiService(req.user.region_id, req.params.id, true);
    resFunc(res, 200, data)
  } catch (error) {
    errorCatch(error, res)
  }
}

module.exports = {
  getElementById,
  create,
  getAll,
  deleteValue,
  update
};
