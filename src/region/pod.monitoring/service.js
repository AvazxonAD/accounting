const { PodotchetMonitoringDB } = require("./db");

exports.PodotchetMonitoringService = class {
  static async cap(data) {
    let result = await PodotchetMonitoringDB.capData([
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
};
