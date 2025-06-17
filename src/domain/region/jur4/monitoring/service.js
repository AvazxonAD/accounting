const { HelperFunctions } = require("@helper/functions");
const { PodotchetMonitoringDB } = require("./db");

exports.PodotchetMonitoringService = class {
  static async daysReport(data) {
    const result = await PodotchetMonitoringDB.daysReport(
      [data.region_id, data.main_schet_id, data.from, data.to, data.schet],
      data.podotchet_id
    );

    let rasxodSumma = 0;
    let prixodSumma = 0;

    const from = HelperFunctions.returnDate(data);

    const summa_from = await PodotchetMonitoringDB.getSumma(
      [data.region_id, data.schet, data.main_schet_id, from, data.from],
      data.podotchet_id,
      null,
      true
    );

    const summa_to = await PodotchetMonitoringDB.getSumma(
      [data.region_id, data.schet, data.main_schet_id, data.from, data.to],
      data.podotchet_id
    );

    for (let rasxod of result.rasxods) {
      rasxodSumma += rasxod.summa;
    }

    for (let prixod of result.prixods) {
      prixodSumma += prixod.summa;
    }

    result.rasxodSumma = rasxodSumma;
    result.prixodSumma = prixodSumma;

    return {
      ...result,
      summa_from: summa_from.summa + data.saldo.summa,
      summa_to: summa_to.summa + data.saldo.summa,
    };
  }

  static async getSumma(data) {
    const internal = await PodotchetMonitoringDB.getSumma([data.region_id, data.schet, data.main_schet_id, data.from, data.to]);

    return internal;
  }

  static async cap(data) {
    let result = await PodotchetMonitoringDB.capData([data.main_schet_id, data.from, data.to, data.region_id, data.schet]);

    const prixods = await PodotchetMonitoringDB.capDataPrixods([data.main_schet_id, data.from, data.to, data.region_id, data.schet]);

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

    return { rasxods: result, prixods };
  }

  static async reportBySchets(data) {
    const rasxods = await PodotchetMonitoringDB.reportBySchetsRasxods([data.main_schet_id, data.from, data.to, data.region_id, data.schet]);

    const prixods = await PodotchetMonitoringDB.reportBySchetsPrixods([data.main_schet_id, data.from, data.to, data.region_id, data.schet]);

    const result = HelperFunctions.reportBySchetsGroup({ prixods, rasxods });

    return result;
  }

  static async monitoring(data) {
    const docs = await PodotchetMonitoringDB.getMonitoring(
      [data.region_id, data.main_schet_id, data.from, data.to, data.schet, data.offset, data.limit],
      data.podotchet_id,
      data.search,
      data.order_by || "doc_date",
      data.order_type || "DESC"
    );

    const internal = await PodotchetMonitoringDB.getSumma(
      [data.region_id, data.schet, data.main_schet_id, data.from, data.to],
      data.podotchet_id,
      data.search
    );

    const from = HelperFunctions.returnDate({
      year: data.year,
      month: data.month,
    });

    const summa_from = await PodotchetMonitoringDB.getSumma(
      [data.region_id, data.schet, data.main_schet_id, from, data.from],
      data.podotchet_id,
      data.search,
      true
    );

    const summa_to = await PodotchetMonitoringDB.getSumma(
      [data.region_id, data.schet, data.main_schet_id, from, data.to],
      data.podotchet_id,
      data.search
    );

    const total = await PodotchetMonitoringDB.getTotalMonitoring(
      [data.region_id, data.main_schet_id, data.from, data.to, data.schet],
      data.podotchet_id,
      data.search
    );

    let page_rasxod_sum = 0;
    let page_prixod_sum = 0;
    docs.forEach((item) => {
      page_rasxod_sum += item.rasxod_sum;
      page_prixod_sum += item.prixod_sum;
    });

    const saldo_summa = data.saldo?.summa || 0;

    return {
      data: docs,
      summa_from: saldo_summa + summa_from.summa,
      summa_to: saldo_summa + summa_to.summa,
      page_prixod_sum,
      page_rasxod_sum,
      page_total_sum: page_prixod_sum - page_rasxod_sum,
      total,
      total_sum: internal.summa,
      prixod_sum: internal.prixod_sum,
      rasxod_sum: internal.rasxod_sum,
    };
  }
};
