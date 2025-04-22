const { OdinoxDB } = require("./db");
const { db } = require("@db/index");
const ExcelJS = require("exceljs");
const fs = require("fs");
const path = require("path");
const { HelperFunctions, sum } = require(`@helper/functions`);

exports.OdinoxService = class {
  static now = new Date();

  static async getSmeta(data) {
    const smetas = await OdinoxDB.getSmeta([
      data.region_id,
      data.main_schet_id,
      data.year,
    ]);

    return smetas;
  }

  static getJur0Data(data) {
    for (let smeta of data.smetas) {
      if (smeta.smeta_grafik) {
        smeta.summa = smeta.smeta_grafik[`oy_${data.month}`];
        delete smeta.smeta_grafik;
      } else {
        smeta.summa = 0;
      }
    }

    return data.smetas;
  }

  static getJur1Data(data) {
    for (let smeta of data.smetas) {
      if (smeta.smeta_grafik) {
        smeta.summa = smeta.smeta_grafik[`oy_${data.month}`];
        delete smeta.smeta_grafik;
      } else {
        smeta.summa = 0;
      }
    }

    return data.smetas;
  }

  static async getOdinoxType() {
    const result = await OdinoxDB.getOdinoxType([]);

    return result;
  }
};
