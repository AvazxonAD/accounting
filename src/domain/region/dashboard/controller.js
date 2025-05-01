const { DashboardService } = require("./service");
const { MainSchetService } = require("@main_schet/service");
const { PodotchetService } = require("@podotchet/service");
const { HelperFunctions } = require("@helper/functions");
const { BankSaldoService } = require(`@jur2_saldo/service`);
const { KassaSaldoService } = require(`@jur1_saldo/service`);

exports.Controller = class {
  static async budjet(req, res) {
    const { main_schet_id, budjet_id } = req.query;
    const region_id = req.user.region_id;
    const budjets = await DashboardService.getBudjet({
      main_schet_id,
      budjet_id,
      region_id,
    });

    return res.success(req.i18n.t("getSuccess"), 200, req.query, budjets);
  }

  static async kassa(req, res) {
    const { main_schet_id, budjet_id, to } = req.query;
    const region_id = req.user.region_id;

    if (main_schet_id) {
      const main_schet = await MainSchetService.getById({
        region_id,
        id: main_schet_id,
      });
      if (!main_schet) {
        return res.error(req.i18n.t("mainSchetNotFound"), 404);
      }
    }

    const _budjets = await DashboardService.getBudjet({
      main_schet_id,
      budjet_id,
      region_id,
    });

    const { budjets, page_prixod_sum, page_rasxod_sum, page_total_sum } =
      await DashboardService.kassa({ budjets: _budjets, to, region_id });

    const meta = {
      page_prixod_sum,
      page_rasxod_sum,
      page_total_sum,
    };

    return res.success(req.i18n.t("getSuccess"), 200, meta, budjets);
  }

  static async bank(req, res) {
    const { main_schet_id, budjet_id, to } = req.query;
    const region_id = req.user.region_id;

    if (main_schet_id) {
      const main_schet = await MainSchetService.getById({
        region_id,
        id: main_schet_id,
      });
      if (!main_schet) {
        return res.error(req.i18n.t("mainSchetNotFound"), 404);
      }
    }

    const _budjets = await DashboardService.getBudjet({
      main_schet_id,
      budjet_id,
      region_id,
    });

    const { budjets, page_prixod_sum, page_rasxod_sum, page_total_sum } =
      await DashboardService.bank({ budjets: _budjets, to, region_id });

    const meta = {
      page_prixod_sum,
      page_rasxod_sum,
      page_total_sum,
    };

    return res.success(req.i18n.t("getSuccess"), 200, meta, budjets);
  }

  static async podotchet(req, res) {
    const { main_schet_id, budjet_id, to, page, limit } = req.query;
    const region_id = req.user.region_id;

    if (main_schet_id) {
      const main_schet = await MainSchetService.getById({
        region_id,
        id: main_schet_id,
      });
      if (!main_schet) {
        return res.error(req.i18n.t("mainSchetNotFound"), 404);
      }
    }

    const offset = (page - 1) * limit;

    const { data, total_count } = await PodotchetService.get({
      region_id,
      offset,
      limit,
    });

    const _budjets = await DashboardService.getBudjet({
      main_schet_id,
      budjet_id,
      region_id,
    });

    const pageCount = Math.ceil(total_count / limit);

    const { podotchets, page_prixod_sum, page_rasxod_sum, page_total_sum } =
      await DashboardService.podotchet({
        budjets: _budjets,
        to,
        region_id,
        podotchets: data,
      });

    const meta = {
      pageCount: pageCount,
      count: total_count,
      currentPage: page,
      nextPage: page >= pageCount ? null : page + 1,
      backPage: page === 1 ? null : page - 1,
      page_prixod_sum,
      page_rasxod_sum,
      page_total_sum,
    };

    return res.success(req.i18n.t("getSuccess"), 200, meta, podotchets);
  }
};
