const { PodotchetMonitoringDB } = require("./db");

exports.PodotchetMonitoringService = class {
  static async getSumma(data) {
    const internal = await PodotchetMonitoringDB.getSumma([
      data.region_id,
      data.from,
      data.to,
      data.schet,
      data.main_schet_id,
    ]);

    return internal;
  }

  static async cap(data) {
    let result = await PodotchetMonitoringDB.capData([
      data.main_schet_id,
      data.from,
      data.to,
      data.region_id,
      data.schet,
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

  static async monitoring(data) {
    const docs = await PodotchetMonitoringDB.getMonitoring(
      [
        data.region_id,
        data.main_schet_id,
        data.from,
        data.to,
        data.schet,
        data.offset,
        data.limit,
      ],
      data.podotchet_id,
      data.search,
      data.order_by,
      data.order_type
    );

    const internal = await PodotchetMonitoringDB.getSumma(
      [data.region_id, data.from, data.to, data.schet, data.main_schet_id],
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

    return {
      data: docs,
      summa_from: data.saldo.summa,
      summa_to: data.saldo.summa + internal.summa,
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
