const { ReportMainBookDB } = require("./db");
const { typeDocuments } = require("@helper/data");
const { tashkentTime } = require("@helper/functions");
const { SmetaGrafikDB } = require("@smeta_grafik/db");

exports.ReportService = class {
  static async getReport(data) {
    const result = await ReportMainBookDB.getReport([], data.year, data.month);
    for (let doc of result) {
      const times = await ReportMainBookDB.getReportTime([
        doc.region_id,
        doc.budjet_id,
        doc.year,
        doc.month,
      ]);
      doc.document_yaratilgan_vaqt = times.document_yaratilgan_vaqt;
      doc.document_qabul_qilingan_vaqt = times.document_qabul_qilingan_vaqt;
    }
    return result;
  }

  static async getByIdReport(data) {
    const report = await ReportMainBookDB.getByIdReport([
      data.region_id,
      data.budjet_id,
      data.year,
      data.month,
    ]);
    if (report) {
      report.types = typeDocuments.map((item) => ({ ...item }));
      const { data: smeta_grafiks } = await SmetaGrafikDB.getSmetaGrafik(
        [data.region_id, 0, 99999],
        data.budjet_id,
        null,
        data.year
      );
      for (let type of report.types) {
        type.smeta_grafiks = smeta_grafiks.map((item) => ({ ...item }));
        for (let schet of type.smeta_grafiks) {
          schet.summa = await ReportMainBookDB.getSchetSummaBySchetId([
            data.region_id,
            data.year,
            data.month,
            data.budjet_id,
            schet.id,
            type.type,
          ]);
        }
      }
    }
    return report;
  }

  static async updateReport(data) {
    const result = await ReportMainBookDB.updateReport([
      data.region_id,
      data.year,
      data.month,
      data.budjet_id,
      data.user_id_qabul_qilgan,
      tashkentTime(),
      data.status,
    ]);
    return result;
  }
};
