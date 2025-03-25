const { checkSchetsEquality } = require("@helper/functions");
const { MainSchetService } = require("@main_schet/service");
const { PodotchetService } = require("@podotchet/service");
const { OperatsiiService } = require("@operatsii/service");
const { PodrazdelenieService } = require("@podraz/service");
const { SostavService } = require("@sostav/service");
const { TypeOperatsiiService } = require("@type_operatsii/service");
const { PodotchetSaldoService } = require("./service");
const { OrganizationService } = require("@organization/service");
const { ContractService } = require("@contract/service");
const { GaznaService } = require("@gazna/service");
const { AccountNumberService } = require("@account_number/service");

exports.Controller = class {
  static async create(req, res) {
    const main_schet_id = req.query.main_schet_id;
    const user_id = req.user.id;
    const region_id = req.user.region_id;

    const { childs, podotchet_id, prixod, rasxod } = req.body;

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

    const podotchet = await PodotchetService.getById({
      id: podotchet_id,
      region_id,
    });
    if (!podotchet) {
      return res.error(req.i18n.t("podotchetNotFound"), 404);
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

    const result = await PodotchetSaldoService.create({
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
    } = await PodotchetSaldoService.get({
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
      prixod_summa,
      rasxod_summa,
      summa: prixod_summa - rasxod_summa,
      page_prixod_summa,
      page_rasxod_summa,
      from_summa,
      to_summa,
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

    const result = await PodotchetSaldoService.getById({
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

    const { childs, podotchet_id, prixod, rasxod } = req.body;

    const old_data = await PodotchetSaldoService.getById({
      region_id,
      main_schet_id,
      id,
      isdeleted: true,
    });
    if (!old_data) {
      return res.error(req.i18n.t("docNotFound"), 404);
    }

    const podotchet = await PodotchetService.getById({
      id: podotchet_id,
      region_id,
    });
    if (!podotchet) {
      return res.error(req.i18n.t("podotchetNotFound"), 404);
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

    const result = await PodotchetSaldoService.update({
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

    const doc = await PodotchetSaldoService.getById({
      region_id,
      main_schet_id,
      id,
    });
    if (!doc) {
      return res.error(req.i18n.t("docNotFound"), 404);
    }

    const result = await PodotchetSaldoService.delete({ id });

    return res.success(req.i18n.t("getSuccess"), 200, null, result);
  }
};
