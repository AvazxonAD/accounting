const { RegionJur8SchetsService } = require("./service");
const { Jur8SchetsService } = require(`@prixod_schets/service`);

exports.Controller = class {
  static async create(req, res) {
    const { schet_id } = req.body;
    const user_id = req.user.id;
    const region_id = req.user.region_id;

    const schet = await Jur8SchetsService.getById({ id: schet_id });
    if (!schet) {
      return res.error(req.i18n.t("prixodSchetNotFound"), 404);
    }

    const check = await RegionJur8SchetsService.getBySchetId({
      schet_id,
      region_id,
    });
    if (check) {
      return res.error(req.i18n.t("docExists"), 409);
    }

    const result = await RegionJur8SchetsService.create({
      schet_id,
      user_id,
    });

    return res.success(req.i18n.t("createSuccess"), 201, null, result);
  }

  static async get(req, res) {
    const { page, limit, search } = req.query;
    const region_id = req.user.region_id;

    const offset = (page - 1) * limit;

    const { data, total } = await RegionJur8SchetsService.get({
      offset,
      limit,
      region_id,
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
    const region_id = req.user.region_id;

    const data = await RegionJur8SchetsService.getById({
      id,
      region_id,
      isdeleted: true,
    });
    if (!data) {
      return res.error(req.i18n.t("docNotFound"), 404);
    }

    return res.success(req.i18n.t("getSuccess"), 200, null, data);
  }

  static async update(req, res) {
    const { schet_id } = req.body;
    const id = req.params.id;
    const region_id = req.user.region_id;

    const old_data = await RegionJur8SchetsService.getById({ id, region_id });
    if (!old_data) {
      return res.error(req.i18n.t("docNotFound"), 404);
    }

    const schet = await Jur8SchetsService.getById({ id: schet_id });
    if (!schet) {
      return res.error(req.i18n.t("prixodSchetNotFound"), 404);
    }

    if (old_data.schet_id !== schet_id) {
      const check = await RegionJur8SchetsService.getBySchetId({
        schet_id,
        region_id,
      });
      if (check) {
        return res.error(req.i18n.t("docExists"), 409);
      }
    }

    const result = await RegionJur8SchetsService.update({ schet_id, id });

    return res.success(req.i18n.t("updateSuccess"), 200, null, result);
  }

  static async delete(req, res) {
    const id = req.params.id;
    const region_id = req.user.region_id;

    const check = await RegionJur8SchetsService.getById({ id, region_id });
    if (!check) {
      return res.error(req.i18n.t("docNotFound"), 404);
    }

    await RegionJur8SchetsService.delete({ id });

    return res.success(req.i18n.t("deleteSuccess"), 200);
  }
};
