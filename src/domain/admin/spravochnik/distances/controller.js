const { DistancesService } = require("./service");
const { ConstanstsService } = require("@constants/service");

exports.Controller = class {
  // get
  static async get(req, res) {
    const { page, limit, search, from_region_id, to_region_id } = req.query;

    const offset = (page - 1) * limit;

    if (from_region_id) {
      const from = await ConstanstsService.getByIdRegion({ id: from_region_id });
      if (!from) {
        return res.error(req.i18n.t("districtNotFound"), 404);
      }
    }

    if (to_region_id) {
      const to = await ConstanstsService.getByIdRegion({ id: to_region_id });
      if (!to) {
        return res.error(req.i18n.t("districtNotFound"), 404);
      }
    }

    const { data, total } = await DistancesService.get({ offset, limit, search, ...req.query });

    const pageCount = Math.ceil(total / limit);
    const meta = {
      pageCount: pageCount,
      count: total,
      currentPage: page,
      nextPage: page >= pageCount ? null : page + 1,
      backPage: page === 1 ? null : page - 1,
    };

    return res.success(req.i18n.t("getSuccess"), 200, meta, data);
  }

  // get by id
  static async getById(req, res) {
    const id = req.params.id;

    const data = await DistancesService.getById({ id, isdeleted: true });
    if (!data) {
      return res.error(req.i18n.t("distancesNotFound"), 404);
    }

    return res.success(req.i18n.t("getSuccess"), 200, null, data);
  }

  // update
  static async update(req, res) {
    const id = req.params.id;
    const data = await DistancesService.getById({ id, isdeleted: true });
    if (!data) {
      return res.error(req.i18n.t("distancesNotFound"), 404);
    }

    const result = await DistancesService.update({ ...data, ...req.body, id });

    return res.success(req.i18n.t("updateSuccess"), 200, null, result);
  }

  // create
  static async create(req, res) {
    const { from_region_id, to_region_id } = req.body;

    const from = await ConstanstsService.getByIdRegion({ id: from_region_id });
    if (!from) {
      return res.error(req.i18n.t("districtNotFound"), 404);
    }

    const to = await ConstanstsService.getByIdRegion({ id: to_region_id });
    if (!to) {
      return res.error(req.i18n.t("districtNotFound"), 404);
    }

    const check = await DistancesService.getByRegionId({ from_region_id, to_region_id });
    if (check) {
      return res.error(req.i18n.t("distancesExists"), 400);
    }

    const result = await DistancesService.create({ ...req.body });

    return res.success(req.i18n.t("createSuccess"), 200, null, result);
  }

  // delete
  static async delete(req, res) {
    const id = req.params.id;

    const data = await DistancesService.getById({ id, isdeleted: true });
    if (!data) {
      return res.error(req.i18n.t("distancesNotFound"), 404);
    }

    await DistancesService.delete({ id, ...data });

    return res.success(req.i18n.t("deleteSuccess"), 200);
  }
};
