const { ReportMainBookDB } = require('./db');
const { typeDocuments } = require('../../helper/data');
const { MainBookSchetDB } = require('../../spravochnik/main.book.schet/db');
const { tashkentTime } = require('../../helper/functions')

exports.ReportService = class {
    static async getReport(data) {
        const result = await ReportMainBookDB.getReport([], data.year, data.month);
        return result;
    }

    static async getByIdReport(data) {
        const report = await ReportMainBookDB.getByIdReport([data.region_id, data.budjet_id, data.year, data.month]);
        if (report) {
            report.types = typeDocuments.map(item => ({ ...item }));
            const { data: schets } = await MainBookSchetDB.getMainBookSchet([0, 9999]);
            for (let type of report.types) {
                type.schets = schets.map(item => ({ ...item }));
                for (let schet of type.schets) {
                    schet.summa = await ReportMainBookDB.getSchetSummaBySchetId([
                        data.region_id,
                        data.year,
                        data.month,
                        data.budjet_id,
                        schet.id,
                        type.type
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
            data.status
        ])
        return result;
    }
}
