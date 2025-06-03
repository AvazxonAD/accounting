const { RegionService } = require(`@region/service`);
const { LIMIT } = require(`@helper/constants`);
const { MainSchetService } = require(`@main_schet/service`);
const { BankSaldoService } = require(`@jur2_saldo/service`);
const { HelperFunctions } = require(`@helper/functions`);
const { BankMonitoringService } = require(`@jur2_monitoring/service`);

exports.Controller = class {
  static async get(req, res) {
    const { to, search } = req.query;
    let summa_from = 0;
    let summa_to = 0;

    const { data, total } = await RegionService.get({ offset: 0, limit: LIMIT, search });
    const { year, month } = HelperFunctions.returnMonthAndYear({ doc_date: to });
    const from = HelperFunctions.returnDate({ year, month });

    for (const region of data) {
      const mainSchets = await MainSchetService.getByRegionId({ region_id: region.id });

      const mainSchetsWithSaldo = await Promise.all(
        mainSchets.map(async (main_schet) => {
          const saldo = await BankSaldoService.getByMonth({
            main_schet_id: main_schet.id,
            year,
            month,
            region_id: region.id,
          });

          let summa_from, summa_to;
          if (saldo) {
            const data = await BankMonitoringService.get({
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

            summa_from = data.summa_from;
            summa_to = data.summa_to;
          } else {
            summa_from = 0;
            summa_to = 0;
          }

          return { ...main_schet, saldo, summa_from, summa_to };
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
    }

    return res.success(req.i18n.t("getSuccess"), 200, { summa_from, summa_to, total }, data);
  }
};
