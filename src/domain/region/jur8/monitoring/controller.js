const { BudjetService } = require("@budjet/service");
const { Jur8MonitoringService } = require(`./service`);
const { RegionJur8SchetsService } = require(`@region_prixod_schets/service`);
const { HelperFunctions } = require("@helper/functions");

exports.Controller = class {
  static async update(req, res) {
    const { main_schet_id } = req.query;
    const region_id = req.user.region_id;
    const id = req.params.id;
    const { childs, year, month } = req.body;
    const user_id = req.user.id;

    const budjet = await BudjetService.getById({ id: main_schet_id });
    if (!budjet) {
      return res.error(req.i18n.t("budjetNotFound"), 404);
    }

    const doc = await Jur8MonitoringService.getById({
      region_id,
      main_schet_id,
      id,
    });
    if (!doc) {
      return res.error(req.i18n.t("docNotFound"), 404);
    }

    if (doc.year !== year || doc.month !== month) {
      const check = await Jur8MonitoringService.get({
        main_schet_id,
        region_id,
        offset: 0,
        limit: 1,
        year,
        month,
      });
      if (check.data.length) {
        return res.error(req.i18n.t("docExists"), 409);
      }
    }

    for (let child of childs) {
      const schet = await RegionJur8SchetsService.getById({
        id: child.schet_id,
        region_id,
      });
      if (!schet) {
        return res.error(req.i18n.t(`prixodSchetNotFound`), 404);
      }
    }

    const result = await Jur8MonitoringService.update({
      ...req.body,
      ...req.params,
      user_id,
      ...req.query,
    });

    return res.success(req.i18n.t(`updateSuccess`), 200, null, result);
  }

  static async delete(req, res) {
    const { main_schet_id } = req.query;
    const region_id = req.user.region_id;
    const id = req.params.id;

    const budjet = await BudjetService.getById({ id: main_schet_id });
    if (!budjet) {
      return res.error(req.i18n.t("budjetNotFound"), 404);
    }

    const doc = await Jur8MonitoringService.getById({
      region_id,
      main_schet_id,
      id,
    });
    if (!doc) {
      return res.error(req.i18n.t("docNotFound"), 404);
    }

    const result = await Jur8MonitoringService.delete({ id });

    return res.success(req.i18n.t(`deleteSuccess`), 200, null, result);
  }

  static async getById(req, res) {
    const { main_schet_id } = req.query;
    const region_id = req.user.region_id;
    const id = req.params.id;

    const budjet = await BudjetService.getById({ id: main_schet_id });
    if (!budjet) {
      return res.error(req.i18n.t("budjetNotFound"), 404);
    }

    const result = await Jur8MonitoringService.getById({
      region_id,
      main_schet_id,
      isdeleted: true,
      id,
    });
    if (!result) {
      return res.error(req.i18n.t("docNotFound"), 404);
    }

    return res.success(req.i18n.t("getSuccess"), 200, null, result);
  }

  static async get(req, res) {
    const region_id = req.user.region_id;
    const { page, limit, main_schet_id } = req.query;

    const offset = (page - 1) * limit;

    const budjet = await BudjetService.getById({ id: main_schet_id });
    if (!budjet) {
      return res.error(req.i18n.t("budjetNotFound"), 404);
    }

    const { data, summa, total } = await Jur8MonitoringService.get({
      region_id,
      offset,
      ...req.query,
    });

    const pageCount = Math.ceil(total / limit);
    const meta = {
      pageCount: pageCount,
      count: total,
      currentPage: page,
      nextPage: page >= pageCount ? null : page + 1,
      backPage: page === 1 ? null : page - 1,
      summa,
    };

    return res.success(req.i18n.t("getSuccess"), 200, meta, data);
  }

  static async create(req, res) {
    const user_id = req.user.id;
    const { main_schet_id } = req.query;
    const region_id = req.user.region_id;
    const { childs, year, month } = req.body;

    const budjet = await BudjetService.getById({ id: main_schet_id });
    if (!budjet) {
      return res.error(req.i18n.t("budjetNotFound"), 404);
    }

    const check = await Jur8MonitoringService.get({
      main_schet_id,
      region_id,
      offset: 0,
      limit: 1,
      year,
      month,
    });
    if (check.data.length) {
      return res.error(req.i18n.t("docExists"), 409);
    }

    for (let child of childs) {
      const schet = await RegionJur8SchetsService.getById({
        id: child.schet_id,
        region_id,
      });

      if (!schet) {
        return res.error(req.i18n.t(`prixodSchetNotFound`), 404);
      }
    }

    const result = await Jur8MonitoringService.create({
      ...req.body,
      user_id,
      ...req.query,
    });

    return res.success(req.i18n.t("createSuccess"), 200, null, result);
  }

  static async getData(req, res) {
    const region_id = req.user.region_id;
    const { main_schet_id, year, month } = req.query;

    const date = HelperFunctions.getDate({ year, month });

    const budjet = await BudjetService.getById({ id: main_schet_id });
    if (!budjet) {
      return res.error(req.i18n.t("budjetNotFound"), 404);
    }

    const schets = await RegionJur8SchetsService.get({
      region_id,
      offset: 0,
      limit: 9999999,
    });

    const result = await Jur8MonitoringService.getData({
      region_id,
      schets: schets.data,
      from: date[0],
      to: date[1],
      main_schet_id,
    });

    return res.success(req.i18n.t("getSuccess"), 200, null, result);
  }
};
