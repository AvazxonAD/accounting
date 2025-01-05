const { ReportMainBookDB } = require('./db');
const { DocMainBookDB } = require('../doc/db');
const { typeDocuments } = require('../../helper/data');
const { MainBookSchetDB } = require('../../spravochnik/main.book.schet/db');
const { tashkentTime } = require('../../helper/functions')
const { db } = require('../../db/index')

exports.ReportService = class {
    static async getInfo(data) {
        const types = typeDocuments.map(item => ({ ...item }));
        const { data: schets } = await MainBookSchetDB.getMainBookSchet([0, 9999]);
        for (let type of types) {
            type.schets = schets.map(item => ({ ...item }));
            for (let schet of type.schets) {
                schet.summa = await DocMainBookDB.getSchetSummaBySchetId([
                    data.region_id,
                    data.year,
                    data.month,
                    data.budjet_id,
                    schet.id,
                    type.type
                ]);
            }
        }
        return { year: data.year, month: data.month, type_documents: types };
    }

    static async createReport(data) {
        const report = await db.transaction(async client => {
            const result = [];
            for (let type of data.type_documents) {
                for (let schet of type.schets) {
                    result.push(
                        await ReportMainBookDB.createReport([
                            data.user_id,
                            tashkentTime(),
                            null,
                            null,
                            data.main_schet_id,
                            data.budjet_id,
                            schet.id,
                            type.type,
                            data.month,
                            data.year,
                            schet.summa.debet_sum,
                            schet.summa.kredit_sum,
                            1,
                            tashkentTime(),
                            tashkentTime()
                        ], client)
                    )
                }
            }
            return result;
        })
        return report;
    }

    static async getReport(data) {
        const result = await ReportMainBookDB.getReport([data.region_id, data.budjet_id], data.year, data.month);
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
        const report = await db.transaction(async client => {
            await ReportMainBookDB.deleteReport([
                data.region_id,
                data.query.year,
                data.query.month,
                data.query.budjet_id
            ], client)
            const result = [];
            for (let type of data.type_documents) {
                for (let schet of type.schets) {
                    result.push(
                        await ReportMainBookDB.createReport([
                            data.user_id,
                            tashkentTime(),
                            null,
                            null,
                            data.query.main_schet_id,
                            data.query.budjet_id,
                            schet.id,
                            type.type,
                            data.body.month,
                            data.body.year,
                            schet.summa.debet_sum,
                            schet.summa.kredit_sum,
                            1,
                            tashkentTime(),
                            tashkentTime()
                        ], client)
                    )
                }
            }
            return result;
        })
        return report;
    }

    static async deleteReport(data) {
        await ReportMainBookDB.deleteReport([
            data.region_id,
            data.year,
            data.month,
            data.budjet_id
        ])
    }
}
