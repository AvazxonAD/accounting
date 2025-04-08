const { Jur8SchetsService } = require("./service");

exports.Controller = class {
  static async create(req, res) {
    const { schet, name } = req.body;

    const check = await Jur8SchetsService.getBySchet({ schet });

    if (check) {
      return res.error(req.i18n.t("docExists"), 409);
    }

    const result = await Jur8SchetsService.create({ schet, name });

    return res.success(req.i18n.t("createSuccess"), 201, null, result);
  }

  static async get(req, res) {
    const { page, limit, search } = req.query;

    const offset = (page - 1) * limit;

    const { data, total } = await Jur8SchetsService.get({
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

    const data = await Jur8SchetsService.getById({ id, isdeleted: true });
    if (!data) {
      return res.error(req.i18n.t("docNotFound"), 404);
    }

    return res.success(req.i18n.t("getSuccess"), 200, null, data);
  }

  static async update(req, res) {
    const { schet, name } = req.body;
    const id = req.params.id;

    const old_data = await Jur8SchetsService.getById({ id });
    if (!old_data) {
      return res.error(req.i18n.t("docNotFound"), 404);
    }

    if (old_data.schet !== schet) {
      const check = await Jur8SchetsService.getBySchet({ schet });
      if (check) {
        return res.error(req.i18n.t("docExists"), 409);
      }
    }

    const result = await Jur8SchetsService.update({ schet, name, id });

    return res.success(req.i18n.t("updateSuccess"), 200, null, result);
  }

  static async delete(req, res) {
    const id = req.params.id;

    const check = await Jur8SchetsService.getById({ id });
    if (!check) {
      return res.error(req.i18n.t("docNotFound"), 404);
    }

    await Jur8SchetsService.delete({ id });

    return res.success(req.i18n.t("deleteSuccess"), 200);
  }
};
