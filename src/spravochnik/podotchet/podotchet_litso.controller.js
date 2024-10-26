const { podotchetLitsoValidation } = require("../../utils/validation");;
const { errorCatch } = require('../../utils/errorCatch')
const { validationResponse } = require("../../utils/response-for-validation");
const { resFunc } = require("../../utils/resFunc");
const { podotchetQueryValidation } = require("../../utils/validation");
const {
  createPodotChetService,
  updatePodotchetService,
  deletePodotchetService,
  getByAllPodotChetService,
  getAllPodotChetService,
  getByIdPodotchetService,
} = require("./podotchet.litso.service");

// createPodotchetLitso
const createPodotchetLitso = async (req, res, next) => {
  try {
    const region_id = req.user.region_id;
    const user_id = req.user.id;
    const data = validationResponse(podotchetLitsoValidation, req.body)
    await getByAllPodotChetService(data.name, data.rayon, region_id);
    const result = await createPodotChetService({ ...data, user_id });
    resFunc(res, 201, result)
  } catch (error) {
    errorCatch(error, res)
  }

}

// get all
const getPodotchetLitso = async (req, res, next) => {
  try {
    const region_id = req.user.region_id
    const { page, limit, search } = validationResponse(podotchetQueryValidation, req.query)
    const offset = (page - 1) * limit;
    const result = await getAllPodotChetService(region_id, offset, limit, search);
    const total = parseInt(result.total_count);
    const pageCount = Math.ceil(total / limit);
    const meta = {
      pageCount: pageCount,
      count: total,
      currentPage: page,
      nextPage: page >= pageCount ? null : page + 1,
      backPage: page === 1 ? null : page - 1,
    }
    resFunc(res, 200, result?.data || [], meta)
  } catch (error) {
    errorCatch(error, res)
  }
}

// updatePodotchetLitso
const updatePodotchetLitso = async (req, res, next) => {
  try {
    const region_id = req.user.region_id;
    const id = req.params.id;
    const podotchet_litso = await getByIdPodotchetService(region_id, id);  
    const data = validationResponse(podotchetLitsoValidation, req.body)
    if ( podotchet_litso.name !== data.name || podotchet_litso.rayon !== data.rayon) {
      await getByAllPodotChetService(data.name, data.rayon, region_id);
    }
    const result = await updatePodotchetService({ ...data, id });
    resFunc(res, 200, result)
  } catch (error) {
    errorCatch(error, res)
  }
}

// delete value
const deletePodotchetLitso = async (req, res, next) => {
  try {
    const region_id = req.user.region_id;
    const id = req.params.id;
    await getByIdPodotchetService(region_id, id);
    await deletePodotchetService(id);
    resFunc(res, 200, 'Delete success true')
  } catch (error) {
    errorCatch(error, res)
  }
}

// get element by id
const getByIdPodotchetLitso = async (req, res, next) => {
  try {
    const result = await getByIdPodotchetService(req.user.region_id, req.params.id, true);
    resFunc(res, 200, result)
  } catch (error) {
    errorCatch(error, res)
  }
}



module.exports = {
  getByIdPodotchetLitso,
  createPodotchetLitso,
  getPodotchetLitso,
  deletePodotchetLitso,
  updatePodotchetLitso,
};
