const { podotchetLitsoValidation } = require("@utils/validation");;
const { errorCatch } = require('@utils/errorCatch')
const { validationResponse } = require("@utils/response-for-validation");
const { resFunc } = require("@utils/resFunc");
const { queryValidation } = require("@utils/validation");
const {
  createPodotChetService,
  updatePodotchetService,
  deletePodotchetService,
  getByAllPodotChetService,
  getAllPodotChetService,
  getByIdPodotchetService,
} = require("./podotchet.litso.service");

// createPodotchetLitso
const createPodotchetLitso = async (req, res) => {
  try {
    const region_id = req.user.region_id;
    const user_id = req.user.id;
    const data = validationResponse(podotchetLitsoValidation, req.body)
    await getByAllPodotChetService(data.name, data.rayon, region_id);
    const result = await createPodotChetService({ ...data, user_id });
    return res.success(req.i18n.t('createSuccess'), 201, null, result);
  } catch (error) {
    errorCatch(error, res)
  }

}

// get all
const getPodotchetLitso = async (req, res) => {
  try {
    const region_id = req.user.region_id
    const { page, limit, search } = validationResponse(queryValidation, req.query)
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
    return res.success(req.i18n.t('getSuccess'), 200, meta, result?.data || []);
  } catch (error) {
    errorCatch(error, res)
  }
}

// updatePodotchetLitso
const updatePodotchetLitso = async (req, res) => {
  try {
    const region_id = req.user.region_id;
    const id = req.params.id;
    const podotchet_litso = await getByIdPodotchetService(region_id, id);
    const data = validationResponse(podotchetLitsoValidation, req.body)
    if (podotchet_litso.name !== data.name || podotchet_litso.rayon !== data.rayon) {
      await getByAllPodotChetService(data.name, data.rayon, region_id);
    }
    const result = await updatePodotchetService({ ...data, id });

    return res.success(req.i18n.t('updateSuccess'), 200, null, result);
  } catch (error) {
    errorCatch(error, res)
  }
}

// delete value
const deletePodotchetLitso = async (req, res) => {
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
const getByIdPodotchetLitso = async (req, res) => {
  try {
    const result = await getByIdPodotchetService(req.user.region_id, req.params.id, true);

    return res.success(req.i18n.t('getSuccess'), 200, null, result);
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
