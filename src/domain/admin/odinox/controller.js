const { OdinoxService } = require("./service");

exports.Controller = class {
  static async get(req, res) {
    const { page, limit, year, main_schet_id, month } = req.query;

    const offset = (page - 1) * limit;

    const { data, total } = await OdinoxService.get({
      offset,
      limit,
      main_schet_id,
      year,
      month,
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
    const { id } = req.params;

    const data = await OdinoxService.getById({ id });

    if (!data) {
      return res.error(req.i18n.t("docNotFound"), 404);
    }

    for (let type of data.childs) {
      type.prixod = 0;
      type.rasxod = 0;

      for (let child of type.sub_childs) {
        type.prixod += child.prixod;
        type.rasxod += child.rasxod;
      }
    }

    return res.success(req.i18n.t("getSuccess"), 200, null, data);
  }

  static async update(req, res) {
    const region_id = req.user.region_id;
    const { id } = req.params;
    const user_id = req.user.id;

    const old_data = await OdinoxService.getById({
      region_id,
      id,
    });

    if (!old_data) {
      return res.error(req.i18n.t("docNotFound"), 404);
    }

    const result = await OdinoxService.update({
      ...req.body,
      id,
      user_id,
    });

    return res.success(req.i18n.t("updateSuccess"), 200, null, result);
  }
};
