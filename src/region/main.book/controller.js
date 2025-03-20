const { BudjetService } = require("@budjet/service");
const { MainBookService } = require("./service");
const { OperatsiiService } = require("@operatsii/service");
const { MAIN_BOOK_TYPE } = require(`@helper/constants`);

exports.Controller = class {
  static async getMainBookType(req, res) {
    const result = await MainBookService.getMainBookType();

    return res.success(req.i18n.t("getSuccess"), 200, null, result);
  }

  static async create(req, res) {
    const user_id = req.user.id;
    const region_id = req.user.region_id;
    const { budjet_id } = req.query;
    const { year, month } = req.body;

    const budjet = await BudjetService.getById({ id: budjet_id });
    if (!budjet) {
      return res.error(req.i18n.t("budjetNotFound"), 404);
    }

    const check = await MainBookService.get({
      offset: 0,
      limit: 1,
      region_id,
      budjet_id,
      year,
      month,
    });
    console.log(check.total);

    if (check.total) {
      return res.error(req.i18n.t("docExists"), 409, { year, month });
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
    const { page, limit, year, budjet_id } = req.query;

    const offset = (page - 1) * limit;

    const budjet = await BudjetService.getById({ id: budjet_id });
    if (!budjet) {
      return res.error(req.i18n.t("budjetNotFound"), 404);
    }

    const { data, total } = await MainBookService.get({
      region_id,
      offset,
      limit,
      budjet_id,
      year,
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

  static async update(req, res) {
    const region_id = req.user.region_id;
    const { id } = req.params;
    const { childs } = req.body;
    const user_id = req.user.id;

    const old_data = await MainBookService.getById({
      region_id,
      id,
    });

    if (!old_data) {
      return res.error(req.i18n.t("docNotFound"), 404);
    }

    for (let child of childs) {
      for (let sub_child of child.sub_childs) {
        if (sub_child.id) {
          const check = old_data.childs.find((item) => {
            return item.sub_childs.find(
              (element) => element.id === sub_child.id
            );
          });

          if (!check) {
            return res.error(req.i18n.t("docNotFound"), 404);
          }
        }
      }
    }

    const result = await MainBookService.update({
      ...req.body,
      old_data,
      id,
      user_id,
    });

    return res.success(req.i18n.t("updateSuccess"), 200, null, result);
  }
};
