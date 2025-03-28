const { KassaMonitoringDB } = require("./db");

exports.KassaMonitoringService = class {
  static async get(data) {
    const result = await KassaMonitoringDB.get(
      [
        data.region_id,
        data.main_schet_id,
        data.from,
        data.to,
        data.offset,
        data.limit,
      ],
      data.search
    );
    let page_prixod_sum = 0;
    let page_rasxod_sum = 0;
    for (let item of result.data) {
      page_prixod_sum += item.prixod_sum;
      page_rasxod_sum += item.rasxod_sum;
    }

    const summa_from = await KassaMonitoringDB.getSumma(
      [data.region_id, data.main_schet_id, data.from],
      "<",
      data.search
    );

    const summa_to = await KassaMonitoringDB.getSumma(
      [data.region_id, data.main_schet_id, data.to],
      "<=",
      data.search
    );

    return {
      data: result.data || [],
      total_count: result.total_count,
      prixod_sum: result.prixod_sum,
      rasxod_sum: result.rasxod_sum,
      page_prixod_sum,
      page_rasxod_sum,
      page_total_sum: page_prixod_sum - page_rasxod_sum,
      summa_from,
      summa_to,
    };
  }

  static async cap(data) {
    let result = await KassaMonitoringDB.capData([
      data.main_schet_id,
      data.from,
      data.to,
      data.region_id,
    ]);

    result = result.reduce((acc, item) => {
      if (!acc[item.schet]) {
        acc[item.schet] = { summa: 0, items: [] };
      }
      acc[item.schet].summa += item.summa;
      acc[item.schet].items.push(item);
      return acc;
    }, {});

    result.summa = 0;

    for (let rasxod in result) {
      if (rasxod !== "summa") {
        result.summa += result[rasxod].summa;
      }
    }

    return result;
  }

  static async daysReport(data) {
    const result = await KassaMonitoringDB.daysReport([
      data.main_schet_id,
      data.from,
      data.to,
      data.region_id,
    ]);

    const summa_from = await KassaMonitoringDB.getSumma(
      [data.region_id, data.main_schet_id, data.from],
      "<"
    );

    const summa_to = await KassaMonitoringDB.getSumma(
      [data.region_id, data.main_schet_id, data.to],
      "<="
    );

    let rasxodSumma = 0;
    let prixodSumma = 0;

    for (let rasxod of result.rasxods) {
      rasxodSumma += rasxod.summa;
    }

    for (let prixod of result.prixods) {
      prixodSumma += prixod.summa;
    }

    result.rasxodSumma = rasxodSumma;
    result.prixodSumma = prixodSumma;

    return { ...result, summa_from, summa_to };
  }
};
