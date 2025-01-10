const { SaldoDB } = require('./db');
const { tashkentTime } = require('../../helper/functions');
const { db } = require('../../db/index');
const { getMonthStartEnd } = require('../../helper/functions')


exports.SaldoService = class {
    static async getInfo(data) {
        const date = getMonthStartEnd(data.year, data.month);
        for (let responsible of data.responsibles) {
            responsible.products = data.products.map(item => ({ ...item }));
            for (let product of responsible.products) {
                product.kol = await SaldoDB.getKol([product.id, responsible.id, date[0]]);
            }
            responsible.products = responsible.products.filter(item => item.kol !== 0);
        }
        data.responsibles = data.responsibles.filter(item => item.products.length > 0);
        return data.responsibles;
    }

    static async createSaldo(data) {
        await db.transaction(async client => {
            await SaldoDB.deleteSaldo([data.region_id, data.month, data.year])
            for (let responsible of data.info) {
                for (let product of responsible.products) {
                    product.sena = await SaldoDB.getSena([product.id]);
                    await SaldoDB.createSaldo([
                        data.user_id,
                        product.id,
                        product.kol,
                        product.sena,
                        product.sena * product.kol,
                        data.month,
                        data.year,
                        tashkentTime(),
                        responsible.id,
                        tashkentTime(),
                        tashkentTime()
                    ], client)
                }
            }
        })
    }

    static async getSaldo(data) {
        const date = getMonthStartEnd(data.year, data.month);
        const result = await SaldoDB.getSaldo([data.region_id, data.kimning_buynida, data.year, data.month]);
        for (let doc of result) {
            doc.internal = await SaldoDB.getKolInternal([doc.naimenovanie_tovarov_jur7_id, doc.kimning_buynida, date[0], date[1]]);
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
            const internal = await SaldoDB.getKolInternal([doc.naimenovanie_tovarov_jur7_id, doc.kimning_buynida, start, data.to]);
            doc.to = { kol: doc.from.kol + (internal.prixod.kol - internal.rasxod.kol) };
            doc.to.summa = doc.to.kol * doc.sena;
            doc.prixod_doc_date = internal.prixod_doc_date;
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
