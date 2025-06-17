const { KassaSaldoService } = require("@jur1_saldo/service");
const { DashboardDB } = require("./db");
const { HelperFunctions } = require("@helper/functions");
const { BankSaldoService } = require("@jur2_saldo/service");
const { Jur4SaldoService } = require(`@podotchet_saldo/service`);

exports.DashboardService = class {
  static async getBudjet(data) {
    const result = await DashboardDB.getBudjet([data.region_id], data.budjet_id, data.main_schet_id);

    return result;
  }

  static async kassa(data) {
    const { year, month } = HelperFunctions.returnMonthAndYear({
      doc_date: data.to,
    });

    const from = HelperFunctions.returnDate({ year, month });

    let page_total_sum = 0;
    for (let budjet of data.budjets) {
      for (let schet of budjet.main_schets) {
        const saldo = await KassaSaldoService.getByMonth({
          main_schet_id: schet.id,
          year,
          month,
          region_id: data.region_id,
        });

        if (saldo) {
          schet.kassa = await DashboardDB.kassa([schet.id, from, data.to]);
          schet.kassa.summa += saldo.summa;
        } else {
          schet.kassa = { summa: 0 };
        }

        schet.saldo = saldo || null;
        page_total_sum += schet.kassa.summa;
      }
    }
    return {
      budjets: data.budjets,
      page_total_sum,
    };
  }

  static async bank(data) {
    let page_total_sum = 0;

    const { year, month } = HelperFunctions.returnMonthAndYear({
      doc_date: data.to,
    });

    const from = HelperFunctions.returnDate({ year, month });

    for (let budjet of data.budjets) {
      for (let schet of budjet.main_schets) {
        const saldo = await BankSaldoService.getByMonth({
          main_schet_id: schet.id,
          year,
          month,
          region_id: data.region_id,
        });

        if (saldo) {
          schet.bank = await DashboardDB.bank([schet.id, from, data.to]);
          schet.bank.summa += saldo.summa;
        } else {
          schet.bank = { summa: 0 };
        }

        schet.saldo = saldo || null;
        page_total_sum += schet.bank.summa;
      }
    }
    return {
      budjets: data.budjets,
      page_total_sum,
    };
  }

  static async podotchet(data) {
    let page_total_sum = 0;

    const { year, month } = HelperFunctions.returnMonthAndYear({
      doc_date: data.to,
    });

    const from = HelperFunctions.returnDate({ year, month });

    for (let podotchet of data.podotchets) {
      podotchet.summa = 0;
      podotchet.budjets = JSON.parse(JSON.stringify(data.budjets));

      for (let budjet of podotchet.budjets) {
        for (let main_schet of budjet.main_schets) {
          for (let schet of main_schet.jur4_schets) {
            const saldo = await Jur4SaldoService.getByMonth({
              main_schet_id: main_schet.id,
              year,
              month,
              region_id: data.region_id,
              schet_id: schet.id,
            });

            if (!saldo) {
              schet.podotchet = {
                summa: 0,
              };
            } else {
              const podotchet_saldo = saldo.childs.find((item) => item.podotchet_id == podotchet.id);

              if (!podotchet_saldo) {
                schet.podotchet = {
                  summa: 0,
                };
              } else {
                schet.podotchet = await DashboardDB.podotchet([main_schet.id, from, data.to, podotchet.id, data.region_id, schet.schet]);

                schet.podotchet.summa += podotchet_saldo.summa;

                podotchet.summa += schet.podotchet.summa;
              }
            }

            page_total_sum += schet.podotchet.summa;
          }
        }
      }
    }

    return {
      podotchets: data.podotchets,
      page_total_sum,
    };
  }
};
