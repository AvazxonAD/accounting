const { ReportOx } = require('./db');
const { DocOx } = require('../doc/db');
const { SmetaGrafikDB } = require('../../smeta/grafik/db')
const { tashkentTime } = require('../../helper/functions')
const { db } = require('../../db/index');


exports.ReportService = class {
    static async getInfo(data) {
        const { data: smeta_grafiks } = await SmetaGrafikDB.getSmetaGrafik([data.region_id, 0, 9999], data.budjet_id, null, data.year);
        data.smeta_grafiks = smeta_grafiks.map(item => ({ ...item }))
        for (let grafik of data.smeta_grafiks) {
            grafik.summa = await DocOx.getSummaByGrafikId([
                data.region_id,
                data.year,
                data.month,
                data.budjet_id,
                grafik.id
            ]);
            if (!grafik.summa) {
                grafik.summa = {
                    ajratilgan_mablag: 0,
                    tulangan_mablag_smeta_buyicha: 0,
                    kassa_rasxod: 0,
                    haqiqatda_harajatlar: 0,
                    qoldiq: 0
                }
            }
        }
        const summa = {
            ajratilgan_mablag: 0,
            tulangan_mablag_smeta_buyicha: 0,
            kassa_rasxod: 0,
            haqiqatda_harajatlar: 0,
            qoldiq: 0
        }
        for (let grafik of data.smeta_grafiks) {
            summa.ajratilgan_mablag += grafik.summa.ajratilgan_mablag;
            summa.tulangan_mablag_smeta_buyicha += grafik.summa.ajratilgan_mablag;
            summa.kassa_rasxod += grafik.summa.kassa_rasxod;
            summa.haqiqatda_harajatlar += grafik.summa.haqiqatda_harajatlar;
            summa.qoldiq += grafik.summa.qoldiq;
        }
        return { year: data.year, month: data.month, summa, smeta_grafiks: data.smeta_grafiks };
    }

    static async createReport(data) {
        const report = await db.transaction(async client => {
            const result = [];
            for (let grafik of data.smeta_grafiks) {
                result.push(
                    await ReportOx.createReport([
                        data.user_id,
                        tashkentTime(),
                        null,
                        null,
                        data.main_schet_id,
                        data.budjet_id,
                        grafik.id,
                        data.month,
                        data.year,
                        grafik.summa.ajratilgan_mablag,
                        grafik.summa.tulangan_mablag_smeta_buyicha,
                        grafik.summa.kassa_rasxod,
                        grafik.summa.haqiqatda_harajatlar,
                        grafik.summa.qoldiq,
                        1,
                        tashkentTime(),
                        tashkentTime()
                    ], client)
                )
            }
            return result;
        })
        return report;
    }

    static async getReport(data) {
        const result = await ReportOx.getReport([data.region_id, data.budjet_id], data.year, data.month);
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
                    grafik.summa = await ReportOx.getSummaByGrafikId([
                        data.region_id,
                        data.year,
                        data.month,
                        data.budjet_id,
                        grafik.id
                    ]);
                    grafik.year_summa = await ReportOx.getByYearSumma([
                        data.region_id,
                        data.year,
                        data.month,
                        data.budjet_id,
                        grafik.id
                    ]);
                }
            }
        }
        return report;
    }

    static async updateReport(data) {
        const report = await db.transaction(async client => {
            await ReportOx.deleteReport([
                data.region_id,
                data.query.year,
                data.query.month,
                data.query.budjet_id
            ], client)
            const result = [];
            for (let grafik of data.smeta_grafiks) {
                result.push(
                    await ReportOx.createReport([
                        data.user_id,
                        tashkentTime(),
                        null,
                        null,
                        data.query.main_schet_id,
                        data.query.budjet_id,
                        grafik.id,
                        data.body.month,
                        data.body.year,
                        grafik.summa.ajratilgan_mablag,
                        grafik.summa.tulangan_mablag_smeta_buyicha,
                        grafik.summa.kassa_rasxod,
                        grafik.summa.haqiqatda_harajatlar,
                        grafik.summa.qoldiq,
                        1,
                        tashkentTime(),
                        tashkentTime()
                    ], client)
                )
            }
            return result;
        })
        return report;
    }

    static async deleteReport(data) {
        await ReportOx.deleteReport([
            data.region_id,
            data.year,
            data.month,
            data.budjet_id
        ])
    }
}
