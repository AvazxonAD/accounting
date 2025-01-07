const { ReportMainBookDB } = require('./db');
const { DocRealCost } = require('../doc/db');
const { typeDocuments } = require('../../helper/data');
const { SmetaGrafikDB } = require('../../smeta/grafik/db');
const { tashkentTime } = require('../../helper/functions')
const { db } = require('../../db/index')

exports.ReportService = class {
    static async getInfo(data) {
        const types = typeDocuments.map(item => ({ ...item }));
        const { data: smeta_grafiks } = await SmetaGrafikDB.getSmetaGrafik([data.region_id, 0, 9999], data.budjet_id, null, data.year);
        for (let type of types) {
            type.smeta_grafiks = smeta_grafiks.map(item => ({ ...item }));
            for (let grafik of type.smeta_grafiks) {
                grafik.summa = await DocRealCost.getSummaByGrafikId([
                    data.region_id,
                    data.year,
                    data.month,
                    data.budjet_id,
                    grafik.id,
                    type.type
                ]);
                if (!grafik.summa) {
                    grafik.summa = { debet_sum: 0, kredit_sum: 0 };
                }
            }
        }
        return { year: data.year, month: data.month, type_documents: types };
    }

    static async createReport(data) {
        const report = await db.transaction(async client => {
            const result = [];
            for (let type of data.type_documents) {
                for (let grafik of type.smeta_grafiks) {
                    result.push(
                        await ReportMainBookDB.createReport([
                            data.user_id,
                            tashkentTime(),
                            null,
                            null,
                            data.main_schet_id,
                            data.budjet_id,
                            grafik.id,
                            type.type,
                            data.month,
                            data.year,
                            grafik.summa.debet_sum,
                            grafik.summa.kredit_sum,
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
        for (let doc of result) {
            const times = await ReportMainBookDB.getReportTime([doc.region_id, doc.budjet_id, doc.year, doc.month]);
            doc.document_yaratilgan_vaqt = times.document_yaratilgan_vaqt;
            doc.document_qabul_qilingan_vaqt = times.document_qabul_qilingan_vaqt;
        }
        return result;
    }

    static async getByIdReport(data) {
        const report = await ReportMainBookDB.getByIdReport([data.region_id, data.budjet_id, data.year, data.month]);
        if (report) {
            report.types = typeDocuments.map(item => ({ ...item }));
            const { data: smeta_grafiks } = await SmetaGrafikDB.getSmetaGrafik([data.region_id, 0, 9999], data.budjet_id, null, data.year);
            for (let type of report.types) {
                type.smeta_grafiks = smeta_grafiks.map(item => ({ ...item }));
                for (let grafik of type.smeta_grafiks) {
                    grafik.summa = await ReportMainBookDB.getSchetSummaBySchetId([
                        data.region_id,
                        data.year,
                        data.month,
                        data.budjet_id,
                        grafik.id,
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
                for (let grafik of type.smeta_grafiks) {
                    result.push(
                        await ReportMainBookDB.createReport([
                            data.user_id,
                            tashkentTime(),
                            null,
                            null,
                            data.query.main_schet_id,
                            data.query.budjet_id,
                            grafik.id,
                            type.type,
                            data.body.month,
                            data.body.year,
                            grafik.summa.debet_sum,
                            grafik.summa.kredit_sum,
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
