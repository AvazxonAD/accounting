const { ReportOx } = require('./db');
const { SmetaGrafikDB } = require('../../smeta/grafik/db');
const { tashkentTime } = require('../../helper/functions')

exports.ReportService = class {
    static async getReport(data) {
        const result = await ReportOx.getReport([], data.year, data.month);
        for (let doc of result) {
            const times = await ReportOx.getReportTime([doc.region_id, doc.budjet_id, doc.year, doc.month]);
            doc.document_yaratilgan_vaqt = times.document_yaratilgan_vaqt;
            doc.document_qabul_qilingan_vaqt = times.document_qabul_qilingan_vaqt;
        }
        return result;
    }

    static async getByIdReport(data) {
        const { data: smeta_grafiks } = await SmetaGrafikDB.getSmetaGrafik([data.region_id, 0, 9999], data.budjet_id, null, data.year);
        data.smeta_grafiks = smeta_grafiks.map(item => ({ ...item }))
        const report = await ReportOx.getByIdReport([data.region_id, data.budjet_id, data.year, data.month]);
        if (report) {
            report.smeta_grafiks = data.smeta_grafiks.map(item => ({ ...item }));
            if (report) {
                for (let grafik of report.smeta_grafiks) {
                    grafik.summa = await ReportOx.getSchetSummaBySchetId([
                        data.region_id,
                        data.year,
                        data.month,
                        data.budjet_id,
                        grafik.id
                    ]);
                }
                const summa = {
                    ajratilgan_mablag: 0,
                    tulangan_mablag_smeta_buyicha: 0,
                    kassa_rasxod: 0,
                    haqiqatda_harajatlar: 0,
                    qoldiq: 0
                }
                for (let grafik of report.smeta_grafiks) {
                    summa.ajratilgan_mablag += grafik.summa.ajratilgan_mablag;
                    summa.tulangan_mablag_smeta_buyicha += grafik.summa.ajratilgan_mablag;
                    summa.kassa_rasxod += grafik.summa.kassa_rasxod;
                    summa.haqiqatda_harajatlar += grafik.summa.haqiqatda_harajatlar;
                    summa.qoldiq += grafik.summa.qoldiq;
                }
            }
        }
        return report;
    }

    static async updateReport(data) {
        const result = await ReportOx.updateReport([
            data.region_id,
            data.year,
            data.month,
            data.budjet_id,
            data.user_id_qabul_qilgan,
            tashkentTime(),
            data.status
        ])
        return result;
    }
}
