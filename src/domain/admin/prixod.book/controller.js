const { BudjetService } = require("@budjet/service");
const { PrixodBookService } = require("./service");

exports.Controller = class {
  static async get(req, res) {
    const { page, limit, year, budjet_id, month } = req.query;

    const offset = (page - 1) * limit;

    if (budjet_id) {
      const budjet = await BudjetService.getById({ id: budjet_id });
      if (!budjet) {
        return res.error(req.i18n.t("budjetNotFound"), 404);
      }
    }

    const { data, total } = await PrixodBookService.get({
      offset,
      limit,
      budjet_id,
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

    const data = await PrixodBookService.getById({ id });

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

    const old_data = await PrixodBookService.getById({
      region_id,
      id,
    });

    if (!old_data) {
      return res.error(req.i18n.t("docNotFound"), 404);
    }

    const result = await PrixodBookService.update({
      ...req.body,
      id,
      user_id,
    });

    return res.success(req.i18n.t("updateSuccess"), 200, null, result);
  }
};
