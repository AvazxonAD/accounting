const { RegionService } = require(`@region/service`);
const { LIMIT } = require(`@helper/constants`);
const { MainSchetService } = require(`@main_schet/service`);
const { Saldo152Service } = require(`@saldo_152/service`);
const { HelperFunctions } = require(`@helper/functions`);
const { Monitoring152Service } = require(`@monitoring_152/services`);

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
          const jur3WithSaldo = await Promise.all(
            main_schet.jur3_schets_152.map(async (schet) => {
              const saldo = await Saldo152Service.getByMonth({
                main_schet_id: main_schet.id,
                year,
                month,
                region_id: region.id,
                schet_id: schet.id,
              });

              let summa_from = 0;
              let summa_to = 0;

              if (saldo) {
                const data = await Monitoring152Service.monitoring({
                  region_id: region.id,
                  main_schet_id: main_schet.id,
                  schet: schet.schet,
                  year,
                  month,
                  from,
                  to,
                  offset: 0,
                  limit: LIMIT,
                  saldo,
                });

                summa_from = data.summa_from;
                summa_to = data.summa_to;
              }

              return { ...schet, saldo, summa_from, summa_to };
            })
          );

          return { ...main_schet, jur3_schets_152: jur3WithSaldo };
        })
      );

      region.main_schets = mainSchetsWithSaldo;
      region.summa_from = 0;
      region.summa_to = 0;

      region.main_schets.forEach((element) => {
        element.summa_from = 0;
        element.summa_to = 0;

        element.jur3_schets_152.forEach((item) => {
          element.summa_from += item.summa_from;
          element.summa_to += item.summa_to;
        });

        region.summa_from += element.summa_from;
        region.summa_to += element.summa_to;
      });

      summa_from += region.summa_from;
      summa_to += region.summa_to;
    }

    return res.success(req.i18n.t("getSuccess"), 200, { summa_from, summa_to, total }, data);
  }
};
