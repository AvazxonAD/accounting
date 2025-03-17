const {
  createPodpisService,
  getAllPodpisService,
  getByIdPodpisService,
  updatePodpisService,
  deletePodpisService,
  getByAllPodpisService,
} = require("./podpis.service");
const { podpisValidation, queryValidation } = require("@utils/validation");
const { validationResponse } = require("@utils/response-for-validation");
const { resFunc } = require("@utils/resFunc");
const { errorCatch } = require("@utils/errorCatch");

// createpodpis
const createpodpis = async (req, res) => {
  try {
    const user_id = req.user.id;
    const region_id = req.user.region_id;
    const data = validationResponse(podpisValidation, req.body);
    await getByAllPodpisService(
      region_id,
      data.type_document,
      data.doljnost_name,
      data.fio_name
    );
    const result = await createPodpisService({ ...data, user_id });
    return res.success(req.i18n.t("createSuccess"), 201, null, result);
  } catch (error) {
    errorCatch(error, res);
  }
};

// get all
const get = async (req, res) => {
  try {
    const region_id = req.user.region_id;
    const { page, limit, search, type } = validationResponse(
      queryValidation,
      req.query
    );
    const offset = (page - 1) * limit;
    const { data, total } = await getAllPodpisService(
      region_id,
      offset,
      limit,
      search,
      type
    );
    const pageCount = Math.ceil(total / limit);
    const meta = {
      pageCount: pageCount,
      count: total,
      currentPage: page,
      nextPage: page >= pageCount ? null : page + 1,
      backPage: page === 1 ? null : page - 1,
    };
    resFunc(res, 200, data, meta);
  } catch (error) {
    errorCatch(error, res);
  }
};

// updatepodpis
const updatepodpis = async (req, res) => {
  try {
    const id = req.params.id;
    const region_id = req.user.region_id;
    const old_data = await getByIdPodpisService(region_id, id);
    const data = validationResponse(podpisValidation, req.body);
    if (
      (old_data.type_docuemnt !== data.type_document ||
        data.doljnost_name !== old_data.doljnost_name,
      data.fio_name !== old_data.fio_name)
    ) {
      await getByAllPodpisService(
        region_id,
        data.type_document,
        data.doljnost_name,
        data.fio_name
      );
    }
    const result = await updatePodpisService({ ...data, id });

    return res.success(req.i18n.t("updateSuccess"), 200, null, result);
  } catch (error) {
    errorCatch(error, res);
  }
};

// delete value
const deletepodpis = async (req, res) => {
  try {
    const id = req.params.id;
    const region_id = req.user.region_id;
    await getByIdPodpisService(region_id, id);
    await deletePodpisService(id);

    return res.success(req.i18n.t("deleteSuccess"), 200);
  } catch (error) {
    errorCatch(error, res);
  }
};

// get element by id
const getByIdpodpis = async (req, res) => {
  try {
    const result = await getByIdPodpisService(
      req.user.region_id,
      req.params.id,
      true
    );

    return res.success(req.i18n.t("getSuccess"), 200, null, result);
  } catch (error) {
    errorCatch(error, res);
  }
};

module.exports = {
  getByIdpodpis,
  createpodpis,
  get,
  deletepodpis,
  updatepodpis,
};
