const {
  getByNameBudjetService,
  createBudjetService,
  getBudjetService,
  getByIdBudjetService,
  updateBudjetService,
  deleteBudjetService,
} = require("./budjet.name.service");
const { budjetValidation } = require("../../utils/validation");;
const { validationResponse } = require("../../utils/response-for-validation");
const { resFunc } = require("../../utils/resFunc");
const { errorCatch } = require("../../utils/errorCatch");

// createBudjet
const createBudjet = async (req, res) => {
  try {
    const { name } = validationResponse(budjetValidation, req.body)
    await getByNameBudjetService(name);
    const result = await createBudjetService(name);
    resFunc(res, 201, result)
  } catch (error) {
    errorCatch(error, res)
  }
}

// get all
const getBudjet = async (req, res) => {
  try {
    const result = await getBudjetService();
    resFunc(res, 200, result)
  } catch (error) {
    errorCatch(error, res)
  }
}

// updateBudjet
const updateBudjet = async (req, res) => {
  try {
    const id = req.params.id;
    const oldBudjet = await getByIdBudjetService(req.params.id);
    const { name } = validationResponse(budjetValidation, req.body)
    if (oldBudjet.name !== name) {
      await getByNameBudjetService(name);      
    }
    const result = await updateBudjetService(name, id);
    resFunc(res, 200, result)
  } catch (error) {
    errorCatch(error, res)
  }
}

// delete value
const deleteBudjet = async (req, res) => {
  try {
    const id = req.params.id;
    await getByIdBudjetService(id);
    await deleteBudjetService(id);
    resFunc(res, 200, 'delete success true')
  } catch (error) {
    errorCatch(error, res)
  }
}

// get element by id
const getByIdBudjet = async (req, res) => {
  try {
    const result = await getByIdBudjetService(req.params.id, true);
    resFunc(res, 200, result)
  } catch (error) {
    errorCatch(error, res)
  }
}

module.exports = {
  getByIdBudjet,
  createBudjet,
  getBudjet,
  deleteBudjet,
  updateBudjet,
};
