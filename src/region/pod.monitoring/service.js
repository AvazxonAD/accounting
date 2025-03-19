const { PodotchetMonitoringDB } = require("./db");
const ExcelJS = require("exceljs");
const { returnStringDate } = require("@helper/functions");
const path = require("path");

exports.PodotchetMonitoringService = class {
  static async cap(data) {
    const result = await PodotchetMonitoringDB.capData([
      data.main_schet_id,
      data.from,
      data.to,
      data.region_id,
      data.operatsii,
    ]);

    result.prixods = result.prixods.reduce((acc, item) => {
      if (!acc[item.schet]) {
        acc[item.schet] = { summa: 0, items: [] };
      }
      acc[item.schet].summa += item.summa;
      acc[item.schet].items.push(item);
      return acc;
    }, {});

    result.rasxods = result.rasxods.reduce((acc, item) => {
      if (!acc[item.schet]) {
        acc[item.schet] = { summa: 0, items: [] };
      }
      acc[item.schet].summa += item.summa;
      acc[item.schet].items.push(item);
      return acc;
    }, {});

    let rasxodSumma = 0;
    let prixodSumma = 0;

    for (let rasxod in result.rasxods) {
      result.rasxods[rasxod].prixod = result.prixods[rasxod] || {};

      rasxodSumma += result.rasxods[rasxod].summa;
    }

    for (let prixod in result.prixods) {
      prixodSumma += result.prixods[prixod].summa;
    }

    result.rasxods.summa = rasxodSumma;
    result.prixods.summa = prixodSumma;

    return result;
  }
};
