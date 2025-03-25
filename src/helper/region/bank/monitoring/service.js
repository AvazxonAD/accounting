const { BankMonitoringDB } = require("./db");
const {
  returnStringSumma,
  returnStringDate,
  HelperFunctions,
  returnSleshDate,
} = require("@helper/functions");
const { REPORT_RASXOD_SCHET } = require("@helper/constants");
const ExcelJS = require("exceljs");
const path = require("path");
const { mkdir, constants, access } = require("fs").promises;

exports.BankMonitoringService = class {
  static async get(data) {
    const result = await BankMonitoringDB.get(
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

    const summa_from = await BankMonitoringDB.getSumma(
      [data.region_id, data.main_schet_id, data.from],
      "<",
      data.search
    );

    const summa_to = await BankMonitoringDB.getSumma(
      [data.region_id, data.main_schet_id, data.to],
      "<=",
      data.search
    );

    return {
      summa_from,
      summa_to,
      data: result.data || [],
      total_count: result.total_count,
      page_prixod_sum,
      page_rasxod_sum,
      prixod_sum: result.prixod_sum,
      rasxod_sum: result.rasxod_sum,
      total_sum: result.prixod_sum - result.rasxod_sum,
      page_total_sum: page_prixod_sum - page_rasxod_sum,
    };
  }

  static async cap(data) {
    const result = await BankMonitoringDB.capData([
      data.main_schet_id,
      data.from,
      data.to,
      data.region_id,
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

  static async daysReport(data) {
    const result = await BankMonitoringDB.daysReport([
      data.main_schet_id,
      data.from,
      data.to,
      data.region_id,
    ]);

    const summa_from = await BankMonitoringDB.getSumma(
      [data.region_id, data.main_schet_id, data.from],
      "<"
    );

    const summa_to = await BankMonitoringDB.getSumma(
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
