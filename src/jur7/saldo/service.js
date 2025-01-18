const { SaldoDB } = require('./db');
const { tashkentTime } = require('../../helper/functions');
const { db } = require('../../db/index');
const { getMonthStartEnd } = require('../../helper/functions');
const { IznosDB } = require('../iznos/db');


exports.SaldoService = class {
    static async getInfo(data) {
        const date = getMonthStartEnd(data.year, data.month);
        for (let responsible of data.responsibles) {
            responsible.products = data.products.map(item => ({ ...item }));
            for (let product of responsible.products) {
                product.kol = await SaldoDB.getKol([product.id, responsible.id, date[0]]);
                product.prixod_doc_date = data.prixod_doc_date;
            }
            responsible.products = responsible.products.filter(item => item.kol !== 0);
        }
        data.responsibles = data.responsibles.filter(item => item.products.length > 0);
        return data.responsibles;
    }

    static async createSaldo(data) {
        await db.transaction(async client => {
            await SaldoDB.deleteSaldo([data.region_id, data.month, data.year], client);
            for (let responsible of data.info) {
                for (let product of responsible.products) {
                    product.sena = await SaldoDB.getSena([product.id]);
                    const iznos = (await IznosDB.getIznos([data.region_id], responsible.id, product.id))[0];
                    product.iznos_summa_month = iznos?.sena || 0 * product.iznos_foiz / 12;
                    if (iznos) {
                        await IznosDB.deleteIznos([responsible.id, product.id, data.year, data.month], client);
                        const date1 = new Date(`${data.year}-${data.month}-01`);
                        const date2 = new Date(iznos.iznos_start_date);
                        const year1 = date1.getFullYear();
                        const month1 = date1.getMonth();
                        const year2 = date2.getFullYear();
                        const month2 = date2.getMonth();
                        const month = (year1 - year2) * 12 + (month1 - (month2 + 1));
                        if (month <= 0) {
                            continue;
                        }
                        const iznos_summa = Math.round((product.iznos_summa_month * month) * 100) / 100 + iznos.eski_iznos_summa;
                        for (let k = 1; k <= product.kol; k++) {
                            await IznosDB.createIznos([
                                data.user_id,
                                product.inventar_num,
                                product.serial_num,
                                product.id,
                                1,
                                product.sena,
                                tashkentTime(),
                                responsible.id,
                                iznos_summa,
                                data.year,
                                data.month,
                                `${data.year}-${data.month}-01`,
                                data.budjet_id,
                                tashkentTime(),
                                tashkentTime()
                            ], client)
                        }
                    }

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
                        product.iznos_summa_month,
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
            doc.prixod_data = await SaldoDB.getProductPrixod([doc.naimenovanie_tovarov_jur7_id]);
            doc.internal = await SaldoDB.getKolInternal([doc.naimenovanie_tovarov_jur7_id, doc.kimning_buynida, date[0], date[1]]);
            doc.internal.data = await SaldoDB.getProductPrixod([doc.naimenovanie_tovarov_jur7_id])
            // console.log(doc.internal.data)
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
