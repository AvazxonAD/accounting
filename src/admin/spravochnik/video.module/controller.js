const { VideoModuleService } = require("./service");

exports.Controller = class {
  static async create(req, res) {
    const { name } = req.body;

    const check = await VideoModuleService.getByName({ name });
    if (check) {
      return res.error(req.i18n.t("docExists"), 409);
    }

    const result = await VideoModuleService.create({ name });

    return res.success(req.i18n.t("createSuccess"), 201, null, result);
  }

  static async get(req, res) {
    const { page, limit, search } = req.query;

    const offset = (page - 1) * limit;

    const { data, total } = await VideoModuleService.get({
      offset,
      limit,
      search,
    });

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

  static async getById(req, res) {
    const id = req.params.id;

    const data = await VideoModuleService.getById({ id }, true);
    if (!data) {
      return res.error(req.i18n.t("docNotFound"), 404);
    }

    return res.success(req.i18n.t("getSuccess"), 200, null, data);
  }

  static async update(req, res) {
    const { name } = req.body;
    const id = req.params.id;
    const old_data = await VideoModuleService.getById({ id });
    if (!old_data) {
      return res.error(req.i18n.t("docNotFound"), 404);
    }

    if (old_data.name !== name) {
      const check = await VideoModuleService.getByName({ name });

      if (check) {
        return res.error(req.i18n.t("docExists"), 409);
      }
    }

    const result = await VideoModuleService.update({ name, id });

    return res.success(req.i18n.t("updateSuccess"), 200, null, result);
  }

  static async delete(req, res) {
    const id = req.params.id;

    const old_data = await VideoModuleService.getById({ id });
    if (!old_data) {
      return res.error(req.i18n.t("docNotFound"), 404);
    }

    await VideoModuleService.delete({ id });

    return res.success(req.i18n.t("deleteSuccess"), 200);
  }
};
