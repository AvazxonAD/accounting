const { BudjetService } = require("@budjet/service");
const { MainBookService } = require("./service");
const { OperatsiiService } = require("@operatsii/service");

exports.Controller = class {
  static async create(req, res) {
    const { budjet_id } = req.query;
    const user_id = req.user.id;

    const budjet = await BudjetService.getById({ id: budjet_id });
    if (!budjet) {
      return res.error(req.i18n.t("budjetNotFound"), 404);
    }

    const result = await MainBookService.create({
      budjet_id,
      ...req.body,
      user_id,
    });

    return res.success(req.i18n.t("createSuccess"), 200, null, result);
  }

  static async get(req, res) {
    const region_id = req.user.region_id;
    const { page, limit } = req.query;

    const offset = (page - 1) * limit;

    const { data, total } = await MainBookService.get({
      region_id,
      offset,
      limit,
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
    const region_id = req.user.region_id;
    const { id } = req.params;

    const data = await MainBookService.getById({
      region_id,
      id,
      isdeleted: true,
    });

    if (!data) {
      return res.error(req.i18n.t("docNotFound"), 404);
    }

    return res.success(req.i18n.t("getSuccess"), 200, null, data);
  }

  static async getData(req, res) {
    const schets = await OperatsiiService.getUniqueSchets({});

    return res.success(req.i18n.t("getSuccess"), 200, null, schets);
  }
};
