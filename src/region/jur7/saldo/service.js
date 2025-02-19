const { SaldoDB } = require('./db');
const { tashkentTime } = require('@helper/functions');
const { db } = require('@db/index');
const { getMonthStartEnd } = require('@helper/functions');
const { IznosDB } = require('../iznos/db');


exports.SaldoService = class {
    static async getInfo(data) {
        const date = getMonthStartEnd(data.year, data.month);

        for (let responsible of data.responsibles) {
            responsible.products = JSON.parse(JSON.stringify(data.products));

            for (let product of responsible.products) {
                product.kol_summa = await SaldoDB.getKolSumma([product.id, responsible.id, date[0]]);
            }

            responsible.products = responsible.products.filter(item => item.kol_summa.kol !== 0 && item.kol_summa.summa !== 0);
        }

        data.responsibles = data.responsibles.filter(item => item.products.length > 0);

        return data.responsibles;
    }

    static async createSaldo(data) {
        await db.transaction(async client => {
            await SaldoDB.deleteSaldo([data.region_id, data.month, data.year], client);

            for (let responsible of data.info) {
                for (let product of responsible.products) {
                    product.sena = product.kol_summa.summa / product.kol_summa.kol;
                    const iznos = (await IznosDB.get([data.region_id], responsible.id, product.id))[0];
                    product.iznos_summa_month = iznos?.sena || 0;

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
                        product.kol_summa.kol,
                        product.sena,
                        product.kol_summa.summa,
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
        const parts = data.to.match(/(\d{4})-(\d{2})-(\d{2})/).slice(1);
        const year = parts[0];
        const month = parts[1];
        const start = `${year}-${month}-01`;

        for (let responsible of data.responsibles) {
            responsible.products = JSON.parse(JSON.stringify(data.products));

            for (let product of responsible.products) {
                const from = await SaldoDB.getSaldo([data.region_id, responsible.id, year, month], product.id);
                if (!from) {
                    product.from = { kol: 0, summa: 0, sena: 0 };
                } else {
                    product.from = from.from;
                }

                product.internal = await SaldoDB.getKolSumma([product.id, responsible.id, data.to], start);
                product.to = { kol: product.from.kol + product.internal.kol };

                if (product.to.kol !== 0) {
                    product.to.summa = Math.round((product.from.summa + product.internal.summa) / product.to.kol * 100) / 100;
                    product.to.sena = Math.round((product.to.summa / product.to.kol) * 100) / 100;
                } else {
                    product.to.summa = 0;
                    product.to.sena = 0;
                }

                product.prixod_data = await SaldoDB.getProductPrixod([product.naimenovanie_tovarov_jur7_id]);

            }

            responsible.products = responsible.products.filter(item => item.to.kol !== 0 && item.to.summa !== 0);
        }

        return data.responsibles;
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
