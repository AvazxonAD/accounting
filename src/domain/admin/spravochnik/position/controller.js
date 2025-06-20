const { PositionsService } = require("./service");

exports.Controller = class {
  // get
  static async get(req, res) {
    const { page, limit } = req.query;

    const offset = (page - 1) * limit;

    const { data, total } = await PositionsService.get({ ...req.query, offset });

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

    const data = await PositionsService.getById({ id, isdeleted: true });
    if (!data) {
      return res.error(req.i18n.t("positionNotFound"), 404);
    }

    return res.success(req.i18n.t("getSuccess"), 200, null, data);
  }

  // update
  static async update(req, res) {
    const id = req.params.id;
    const { name } = req.body;

    const data = await PositionsService.getById({ id, isdeleted: true });
    if (!data) {
      return res.error(req.i18n.t("positionNotFound"), 404);
    }

    if (data.name !== name) {
      const check = await PositionsService.getByName({ name });
      if (check) {
        return res.error(req.i18n.t("positionExists"), 400);
      }
    }

    const result = await PositionsService.update({ ...data, ...req.body, id });

    return res.success(req.i18n.t("updateSuccess"), 200, null, result);
  }

  // create
  static async create(req, res) {
    const { name } = req.body;

    const check = await PositionsService.getByName({ name });
    if (check) {
      return res.error(req.i18n.t("positionExists"), 400);
    }

    const result = await PositionsService.create({ ...req.body });

    return res.success(req.i18n.t("createSuccess"), 200, null, result);
  }

  // delete
  static async delete(req, res) {
    const id = req.params.id;

    const data = await PositionsService.getById({ id, isdeleted: true });
    if (!data) {
      return res.error(req.i18n.t("positionNotFound"), 404);
    }

    await PositionsService.delete({ id, ...data });

    return res.success(req.i18n.t("deleteSuccess"), 200);
  }
};
