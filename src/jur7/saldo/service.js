const { SaldoDB } = require('./db');
const { tashkentTime } = require('../../helper/functions');
const { db } = require('../../db/index');
const { getMonthStartEnd } = require('../../helper/functions')

exports.SaldoService = class {
    static async getInfo(data) {
        const date = getMonthStartEnd(data.year, data.month);
        const docs = await SaldoDB.getInfo([data.region_id, data.kimning_buynida, date[0]], '<');
        for (let doc of docs) {
            doc.kol = (doc.prixod + doc.prixod_internal) - (doc.rasxod + doc.rasxod_internal);
            doc.summa = doc.kol * doc.sena;
        }
        const result = docs.filter(item => item.kol != 0);
        return result;
    }

    static async createSaldo(data) {
        const result = await db.transaction(async client => {
            await SaldoDB.deleteSaldo([data.region_id, data.month, data.year])
            const docs = [];
            for (let responsible of data.responsibles) {
                for (let item of responsible.docs) {
                    docs.push(
                        await SaldoDB.createSaldo([
                            data.user_id,
                            item.naimenovanie_tovarov_jur7_id,
                            item.kol,
                            item.sena,
                            item.sena * item.kol,
                            data.month,
                            data.year,
                            item.doc_date,
                            responsible.id,
                            tashkentTime(),
                            tashkentTime()
                        ], client)
                    )
                }
            }
            return docs;
        })
        return result;
    }

    static async getSaldo(data) {
        const date = getMonthStartEnd(data.year, data.month);
        const result = await SaldoDB.getSaldo([data.region_id, data.kimning_buynida, data.year, data.month]);
        for (let doc of result) {
            doc.internal = await SaldoDB.getSumma([doc.naimenovanie_tovarov_jur7_id, doc.kimning_buynida, date[0], date[1]]);
            doc.internal.prixod.summa = doc.internal.prixod.kol * doc.sena;
            doc.internal.rasxod.summa = doc.internal.rasxod.kol * doc.sena;
            doc.to = { kol: doc.from.kol + (doc.internal.prixod.kol - doc.internal.rasxod.kol) };
            doc.to.summa = doc.to.kol * doc.sena;
        }
        return result;
    }

    static async getSaldoForRasxod(data) {
        const parts = data.to.match(/(\d{4})-(\d{2})-(\d{2})/).slice(1);
        const year = parts[0];
        const month = parts[1];
        const start = `${year}-${month}-01`;
        const result = await SaldoDB.getSaldo([data.region_id, data.kimning_buynida, year, month], data.product_id);
        for (let doc of result) {
            const internal = await SaldoDB.getSumma([doc.naimenovanie_tovarov_jur7_id, doc.kimning_buynida, start, data.to]);
            doc.to = { kol: doc.from.kol + (internal.prixod.kol - internal.rasxod.kol) };
            doc.to.summa = doc.to.kol * doc.sena;
        }
        return result;
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
