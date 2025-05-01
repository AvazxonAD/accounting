const { DashboardDB } = require("./db");

exports.DashboardService = class {
  static async getBudjet(data) {
    const result = await DashboardDB.getBudjet(
      [data.region_id],
      data.budjet_id,
      data.main_schet_id
    );

    return result;
  }

  static async kassa(data) {
    let page_rasxod_sum = 0;
    let page_prixod_sum = 0;
    let page_total_sum = 0;
    for (let budjet of data.budjets) {
      for (let schet of budjet.main_schets) {
        schet.kassa = await DashboardDB.kassa([schet.id, data.to]);
        page_rasxod_sum += schet.kassa.rasxod_sum;
        page_prixod_sum += schet.kassa.prixod_sum;
        page_total_sum += schet.kassa.summa;
      }
    }
    return {
      budjets: data.budjets,
      page_prixod_sum,
      page_rasxod_sum,
      page_total_sum,
    };
  }

  static async bank(data) {
    let page_rasxod_sum = 0;
    let page_prixod_sum = 0;
    let page_total_sum = 0;
    for (let budjet of data.budjets) {
      for (let schet of budjet.main_schets) {
        schet.bank = await DashboardDB.bank([schet.id, data.to]);
        page_rasxod_sum += schet.bank.rasxod_sum;
        page_prixod_sum += schet.bank.prixod_sum;
        page_total_sum += schet.bank.summa;
      }
    }
    return {
      budjets: data.budjets,
      page_prixod_sum,
      page_rasxod_sum,
      page_total_sum,
    };
  }

  static async podotchet(data) {
    let page_rasxod_sum = 0;
    let page_prixod_sum = 0;
    let page_total_sum = 0;
    for (let podotchet of data.podotchets) {
      podotchet.budjets = JSON.parse(JSON.stringify(data.budjets));

      for (let budjet of podotchet.budjets) {
        for (let schet of budjet.main_schets) {
          schet.podotchet = await DashboardDB.podotchet([
            schet.id,
            data.to,
            podotchet.id,
          ]);
          page_rasxod_sum += schet.podotchet.rasxod_sum;
          page_prixod_sum += schet.podotchet.prixod_sum;
          page_total_sum += schet.podotchet.summa;
        }
      }
    }
    return {
      podotchets: data.podotchets,
      page_prixod_sum,
      page_rasxod_sum,
      page_total_sum,
    };
  }
};
