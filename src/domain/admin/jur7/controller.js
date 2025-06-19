const { Jur7SaldoService } = require("@jur7_saldo/service");
const { ResponsibleService } = require("@responsible/service");
const { RegionService } = require("@region/service");
const { HelperFunctions } = require(`@helper/functions`);
const { LIMIT } = require(`@helper/constants`);
const { MainSchetService } = require(`@main_schet/service`);

exports.Controller = class {
  static async getDoc(req, res) {
    const { kimning_buynida, to, responsible, search, page, limit, region_id } = req.query;
    const data = { responsibles: [], products: [] };

    const offset = (page - 1) * limit;

    if (region_id) {
      const region = await RegionService.getById({ id: region_id });
      if (!region) {
        return res.error(req.i18n.t("regionNotFound"), 404);
      }
    }

    if (kimning_buynida) {
      const responsible = await ResponsibleService.getById({
        region_id,
        id: kimning_buynida,
        budjet_id: req.query.budjet_id,
      });
      if (!responsible) {
        return res.error(req.i18n.t("responsibleNotFound"), 404);
      }
    }

    if (responsible === "true") {
      let { data: responsibles } = await ResponsibleService.get({
        region_id,
        offset: 0,
        limit: 99999999,
      });
      if (kimning_buynida) {
        responsibles = responsibles.filter((item) => item.id === kimning_buynida);
      }

      data.responsibles = await Jur7SaldoService.getByResponsibles({
        region_id,
        to,
        responsibles,
        search,
        offset,
        limit,
      });
    } else {
      const _data = await Jur7SaldoService.getByProduct({
        ...req.query,
        region_id,
        to,
        search,
        offset,
        limit,
        responsible_id: kimning_buynida,
      });
      data.products = _data.data;
      data.total = _data.total;
    }

    const pageCount = Math.ceil(data.total / limit);

    const meta = {
      pageCount: pageCount,
      count: data.total,
      currentPage: page,
      nextPage: page >= pageCount ? null : page + 1,
      backPage: page === 1 ? null : page - 1,
    };

    return res.success(req.i18n.t("getSuccess"), 200, meta, data);
  }

  static async get(req, res) {
    const { to, search } = req.query;
    let summa_from = 0;
    let summa_to = 0;

    const { data, total } = await RegionService.get({ offset: 0, limit: LIMIT, search });
    const { year, month } = HelperFunctions.returnMonthAndYear({ doc_date: to });

    await Promise.all(
      data.map(async (region) => {
        const mainSchets = await MainSchetService.getByRegionId({ region_id: region.id });

        const mainSchetsWithSaldo = await Promise.all(
          mainSchets.map((main_schet) => {
            return Jur7SaldoService.getByProduct({
              ...req.query,
              main_schet_id: main_schet.id,
              year,
              month,
              region_id: region.id,
            }).then((saldo) => {
              const summa_from = saldo ? saldo.from_summa : 0;
              const summa_to = saldo ? saldo.to_summa : 0;
              return { ...main_schet, saldo, summa_from, summa_to };
            });
          })
        );

        region.main_schets = mainSchetsWithSaldo;

        region.summa_from = 0;
        region.summa_to = 0;

        region.main_schets.forEach((element) => {
          region.summa_from += element.summa_from;
          region.summa_to += element.summa_to;
        });

        summa_from += region.summa_from;
        summa_to += region.summa_to;
      })
    );

    return res.success(req.i18n.t("getSuccess"), 200, { summa_from, summa_to, total }, data);
  }
};
