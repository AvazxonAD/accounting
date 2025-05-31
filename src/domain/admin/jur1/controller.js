const { RegionService } = require(`@region/service`);
const { LIMIT } = require(`@helper/constants`);
const { MainSchetService } = require(`@main_schet/service`);
const { KassaSaldoService } = require(`@jur1_saldo/service`);
const { HelperFunctions } = require(`@helper/functions`);
const { KassaMonitoringService } = require(`@jur1_monitoring/service`);

exports.Controller = class {
  static async get(req, res) {
    const { to } = req.query;
    const { data } = await RegionService.get({ offset: 0, limit: LIMIT });

    const { year, month } = HelperFunctions.returnMonthAndYear({ doc_date: to });
    const from = HelperFunctions.returnDate({ year, month });

    for (const region of data) {
      const mainSchets = await MainSchetService.getByRegionId({ region_id: region.id });

      const mainSchetsWithSaldo = await Promise.all(
        mainSchets.map(async (main_schet) => {
          const saldo = await KassaSaldoService.getByMonth({
            main_schet_id: main_schet.id,
            year,
            month,
            region_id: region.id,
          });

          if (saldo) {
            const { summa_from, summa_to } = await KassaMonitoringService.get({
              region_id: region.id,
              main_schet_id: main_schet.id,
              from,
              to,
              offset: 0,
              limit: LIMIT,
              saldo,
              year,
              month,
            });
          } else {
          }

          return { ...main_schet, saldo, summa_from, summa_to };
        })
      );

      region.main_schets = mainSchetsWithSaldo;
    }

    return res.success(req.i18n.t("getSuccess"), 200, null, data);
  }
};
