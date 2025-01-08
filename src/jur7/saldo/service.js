const { SaldoDB } = require('./db');
const { tashkentTime } = require('../../helper/functions');
const { db } = require('../../db/index');

exports.SaldoService = class {
    static async getInfo(data) {
        const docs = await SaldoDB.getInfo([data.region_id, data.kimning_buynida, data.year, data.month]);
        for (let doc of docs) {
            doc.kol = (doc.prixod + doc.prixod_internal) - (doc.rasxod + doc.rasxod_internal);
            doc.summa = doc.kol * doc.sena;
        }
        const result = docs.filter(item => item.kol > 0);
        return result;
    }

    static async createSaldo(data) {
        const report = await db.transaction(async client => {
            const result = [];
            for (let item of data.docs) {
                result.push(
                    await SaldoDB.createSaldo([
                        data.user_id,
                        item.naimenovanie_tovarov_jur7_id,
                        item.kol,
                        item.sena,
                        item.sena * item.kol,
                        data.month,
                        data.year,
                        tashkentTime(),
                        data.kimning_buynida,
                        tashkentTime(),
                        tashkentTime()
                    ], client)
                )
            }
            return result;
        })
        return report;
    }

    static async getSaldo(data) {
        const result = await SaldoDB.getSaldo([data.region_id], data.kimning_buynida, data.year, data.month);
        return result;
    }

    static async getByIdSaldo(data) {
        const result = await SaldoDB.getByIdSaldo([data.region_id, data.kimning_buynida, data.year, data.month]);
        return result;
    }

    static async updateSaldo(data) {
        const report = await db.transaction(async client => {
            await SaldoDB.deleteSaldo([
                data.region_id,
                data.query.year,
                data.query.month,
                data.query.budjet_id
            ], client)
            const result = [];
            for (let type of data.type_documents) {
                for (let grafik of type.smeta_grafiks) {
                    result.push(
                        await SaldoDB.createSaldo([
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

    static async deleteSaldo(data) {
        await SaldoDB.deleteSaldo([
            data.region_id,
            data.year,
            data.month,
            data.budjet_id
        ])
    }
}
