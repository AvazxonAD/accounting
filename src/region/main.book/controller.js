const { BudjetService } = require("@budjet/service");
const { MainBookService } = require("./service");
const { OperatsiiService } = require("@operatsii/service");

exports.Controller = class {
  static async delete(req, res) {
    const region_id = req.user.region_id;
    const { id } = req.params;

    const data = await MainBookService.getById({
      region_id,
      id,
    });

    if (!data) {
      return res.error(req.i18n.t("docNotFound"), 404);
    }

    if (data.status === 3) {
      return res.error(req.i18n.t("mainBookStatus"), 409);
    }

    await MainBookService.delete({ id });

    return res.success(req.i18n.t("deleteSuccess"), 200);
  }

  static async getMainBookType(req, res) {
    const result = await MainBookService.getMainBookType();

    return res.success(req.i18n.t("getSuccess"), 200, null, result);
  }

  static async create(req, res) {
    const user_id = req.user.id;
    const region_id = req.user.region_id;
    const { budjet_id } = req.query;
    const { year, month, childs } = req.body;

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

    if (check.total) {
      return res.error(req.i18n.t("docExists"), 409, { year, month });
    }

    const internal_child = { type_id: 9, sub_childs: [] };

    for (let child of childs) {
      if (child.type_id !== 0 && child.type_id !== 9 && child.type_id !== 10) {
        for (let sub_child of child.sub_childs) {
          const index = internal_child.sub_childs.findIndex(
            (item) => item.schet === sub_child.schet
          );

          if (index !== -1) {
            internal_child.sub_childs[index].prixod += sub_child.prixod;
            internal_child.sub_childs[index].rasxod += sub_child.rasxod;
          } else {
            internal_child.sub_childs.push(sub_child);
          }
        }
      }
    }
    childs.push(internal_child);

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
    const { year, month, budjet_id } = req.query;
    const region_id = req.user.region_id;

    const budjet = await BudjetService.getById({ id: budjet_id });
    if (!budjet) {
      return res.error(req.i18n.t("budjetNotFound"), 404);
    }

    const types = await MainBookService.getMainBookType({});

    const schets = await OperatsiiService.getUniqueSchets({});

    for (let type of types) {
      if (type.id === 0) {
        type.sub_childs = JSON.parse(JSON.stringify(schets));
        type.sub_childs.forEach((element) => {
          element.prixod = 0;
          element.rasxod = 0;
        });
      }

      if (type.id === 1) {
        type.sub_childs = await MainBookService.getJur1Data({
          schets,
          budjet_id,
          year,
          month,
          region_id,
        });
      }

      if (type.id === 2) {
        type.sub_childs = await MainBookService.getJur2Data({
          schets,
          budjet_id,
          year,
          month,
          region_id,
        });
      }

      if (type.id === 3) {
        type.sub_childs = await MainBookService.getJur3Data({
          schets,
          budjet_id,
          year,
          month,
          region_id,
        });
      }

      if (type.id === 4) {
        type.sub_childs = await MainBookService.getJur3Data({
          schets,
          budjet_id,
          year,
          month,
          region_id,
        });
      }

      if (type.id === 5) {
        type.sub_childs = await MainBookService.getJur3Data({
          schets,
          budjet_id,
          year,
          month,
          region_id,
        });
      }

      if (type.id === 7) {
        type.sub_childs = await MainBookService.getJur3Data({
          schets,
          budjet_id,
          year,
          month,
          region_id,
        });
      }

      if (type.id === 9) {
        type.sub_childs = JSON.parse(JSON.stringify(schets));
        type.sub_childs.forEach((element) => {
          element.prixod = 0;
          element.rasxod = 0;
        });
      }

      if (type.id === 10) {
        type.sub_childs = JSON.parse(JSON.stringify(schets));
        type.sub_childs.forEach((element) => {
          element.prixod = 0;
          element.rasxod = 0;
        });
      }
    }

    return res.success(req.i18n.t("getSuccess"), 200, null, types);
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

    if (old_data.status === 3) {
      return res.error(req.i18n.t("mainBookStatus"), 409);
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

    const internal_child = old_data.childs.find((item) => item.type_id === 9);
    for (let sub_child of internal_child.sub_childs) {
      sub_child.prixod = 0;
      sub_child.rasxod = 0;
    }

    for (let child of childs) {
      if (child.type_id !== 0 && child.type_id !== 9 && child.type_id !== 10) {
        for (let sub_child of child.sub_childs) {
          const index = internal_child.sub_childs.findIndex(
            (item) => item.schet === sub_child.schet
          );

          if (index !== -1) {
            internal_child.sub_childs[index].prixod += sub_child.prixod;
            internal_child.sub_childs[index].rasxod += sub_child.rasxod;
          } else {
            internal_child.sub_childs.push(sub_child);
          }
        }
      }
    }
    childs.push(internal_child);

    const result = await MainBookService.update({
      ...req.body,
      old_data,
      id,
      user_id,
    });

    return res.success(req.i18n.t("updateSuccess"), 200, null, result);
  }
};
