const { checkSchetsEquality } = require("@helper/functions");
const { MainSchetService } = require("@main_schet/service");
const { OperatsiiService } = require("@operatsii/service");
const { PodrazdelenieService } = require("@podraz/service");
const { SostavService } = require("@sostav/service");
const { TypeOperatsiiService } = require("@type_operatsii/service");
const { BankSaldoService } = require("./service");

exports.Controller = class {
  static async create(req, res) {
    const main_schet_id = req.query.main_schet_id;
    const user_id = req.user.id;
    const region_id = req.user.region_id;

    const { childs, prixod, rasxod } = req.body;

    if ((prixod && rasxod) || (!prixod && !rasxod)) {
      return res.error(req.i18n.t("validationError"), 400);
    }

    const main_schet = await MainSchetService.getById({
      region_id,
      id: main_schet_id,
    });
    if (!main_schet) {
      return res.error(req.i18n.t("mainSchetNotFound"), 400);
    }

    const operatsiis = [];
    for (let child of childs) {
      const operatsii = await OperatsiiService.getById({
        type: "general",
        id: child.operatsii_id,
      });
      if (!operatsii) {
        return res.error(req.i18n.t("operatsiiNotFound"), 404);
      }

      operatsiis.push(operatsii);

      if (child.podraz_id) {
        const podraz = await PodrazdelenieService.getById({
          region_id,
          id: child.podraz_id,
        });
        if (!podraz) {
          return res.error(req.i18n.t("podrazNotFound"), 404);
        }
      }

      if (child.sostav_id) {
        const sostav = await SostavService.getById({
          region_id,
          id: child.sostav_id,
        });
        if (!sostav) {
          return res.error(req.i18n.t("sostavNotFound"), 404);
        }
      }

      if (child.type_operatsii_id) {
        const operatsii = await TypeOperatsiiService.getById({
          id: child.type_operatsii_id,
          region_id,
        });
        if (!operatsii) {
          return res.error(req.i18n.t("typeOperatsiiNotFound"), 404);
        }
      }
    }

    if (!checkSchetsEquality(operatsiis)) {
      res.error(req.i18n.t("schetDifferentError"), 400);
    }

    const result = await BankSaldoService.create({
      ...req.body,
      main_schet_id,
      user_id,
    });

    return res.success(req.i18n.t("createSuccess"), 201, null, result);
  }

  static async get(req, res) {
    const region_id = req.user.region_id;
    const { page, limit, from, to, main_schet_id, search } = req.query;

    const main_schet = await MainSchetService.getById({
      region_id,
      id: main_schet_id,
    });
    if (!main_schet) {
      return res.error(req.i18n.t("mainSchetNotFound"), 400);
    }

    const offset = (page - 1) * limit;

    const {
      data,
      total_count,
      prixod_summa,
      rasxod_summa,
      page_prixod_summa,
      page_rasxod_summa,
      from_summa,
      to_summa,
      from_summa_prixod,
      from_summa_rasxod,
      to_summa_prixod,
      to_summa_rasxod,
    } = await BankSaldoService.get({
      search,
      region_id,
      main_schet_id,
      from,
      to,
      offset,
      limit,
    });

    const pageCount = Math.ceil(total_count / limit);

    const meta = {
      pageCount: pageCount,
      count: total_count,
      currentPage: page,
      nextPage: page >= pageCount ? null : page + 1,
      backPage: page === 1 ? null : page - 1,
      internal_prixod_summa: prixod_summa,
      internal_rasxod_summa: rasxod_summa,
      internal_summa: prixod_summa - rasxod_summa,
      page_prixod_summa,
      page_rasxod_summa,
      page_summa: page_prixod_summa - page_rasxod_summa,
      from_summa,
      to_summa,
      from_summa_prixod,
      from_summa_rasxod,
      to_summa_prixod,
      to_summa_rasxod,
    };

    return res.success(req.i18n.t("getSuccess"), 200, meta, data);
  }

  static async getById(req, res) {
    const main_schet_id = req.query.main_schet_id;
    const region_id = req.user.region_id;
    const id = req.params.id;

    const main_schet = await MainSchetService.getById({
      region_id,
      id: main_schet_id,
    });
    if (!main_schet) {
      return res.error(req.i18n.t("mainSchetNotFound"), 400);
    }

    const result = await BankSaldoService.getById({
      region_id,
      main_schet_id,
      id,
      isdeleted: true,
    });
    if (!result) {
      return res.error(req.i18n.t("docNotFound"), 404);
    }

    return res.success(req.i18n.t("getSuccess"), 200, null, result);
  }

  static async update(req, res) {
    const main_schet_id = req.query.main_schet_id;
    const user_id = req.user.id;
    const region_id = req.user.region_id;
    const id = req.params.id;

    const { childs, prixod, rasxod } = req.body;

    const old_data = await BankSaldoService.getById({
      region_id,
      main_schet_id,
      id,
      isdeleted: true,
    });
    if (!old_data) {
      return res.error(req.i18n.t("docNotFound"), 404);
    }

    if ((prixod && rasxod) || (!prixod && !rasxod)) {
      return res.error(req.i18n.t("validationError"), 400);
    }

    const main_schet = await MainSchetService.getById({
      region_id,
      id: main_schet_id,
    });
    if (!main_schet) {
      return res.error(req.i18n.t("mainSchetNotFound"), 400);
    }

    const operatsiis = [];
    for (let child of childs) {
      if (child.id) {
        const check = old_data.childs.find((item) => item.id === child.id);
        if (!check) {
          return res.error(req.i18n.t("validationError"), 400);
        }
      }

      const operatsii = await OperatsiiService.getById({
        type: "general",
        id: child.operatsii_id,
      });
      if (!operatsii) {
        return res.error(req.i18n.t("operatsiiNotFound"), 404);
      }

      operatsiis.push(operatsii);

      if (child.podraz_id) {
        const podraz = await PodrazdelenieService.getById({
          region_id,
          id: child.podraz_id,
        });
        if (!podraz) {
          return res.error(req.i18n.t("podrazNotFound"), 404);
        }
      }

      if (child.sostav_id) {
        const sostav = await SostavService.getById({
          region_id,
          id: child.sostav_id,
        });
        if (!sostav) {
          return res.error(req.i18n.t("sostavNotFound"), 404);
        }
      }

      if (child.type_operatsii_id) {
        const operatsii = await TypeOperatsiiService.getById({
          id: child.type_operatsii_id,
          region_id,
        });
        if (!operatsii) {
          return res.error(req.i18n.t("typeOperatsiiNotFound"), 404);
        }
      }
    }

    if (!checkSchetsEquality(operatsiis)) {
      res.error(req.i18n.t("schetDifferentError"), 400);
    }

    const result = await BankSaldoService.update({
      ...req.body,
      main_schet_id,
      user_id,
      id,
      old_data,
    });

    return res.success(req.i18n.t("updateSuccess"), 200, null, result);
  }

  static async delete(req, res) {
    const main_schet_id = req.query.main_schet_id;
    const region_id = req.user.region_id;
    const id = req.params.id;

    const main_schet = await MainSchetService.getById({
      region_id,
      id: main_schet_id,
    });
    if (!main_schet) {
      return res.error(req.i18n.t("mainSchetNotFound"), 400);
    }

    const doc = await BankSaldoService.getById({
      region_id,
      main_schet_id,
      id,
    });
    if (!doc) {
      return res.error(req.i18n.t("docNotFound"), 404);
    }

    const result = await BankSaldoService.delete({ id });

    return res.success(req.i18n.t("deleteSuccess"), 200, null, result);
  }
};
