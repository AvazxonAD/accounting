const { SaldoDB } = require('./db');
const { tashkentTime } = require('@helper/functions');
const { db } = require('@db/index');
const { getMonthStartEnd } = require('@helper/functions');
const { IznosDB } = require('../iznos/db');
const { ProductService } = require('@product/service');
const path = require('path');
const fs = require('fs');
const xlsx = require('xlsx');
const { ProductDB } = require('@product/db');

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
        for (let responsible of data.responsibles) {
            responsible.products = JSON.parse(JSON.stringify(data.products));

            for (let product of responsible.products) {

                product.from = await SaldoDB.getKolSumma([product.id, responsible.id], data.from);
                product.from.sena = Math.round((product.from.summa && product.from.kol) ? product.from.summa / product.from.kol : 0 * 100) / 100;

                product.internal = await SaldoDB.getKolSumma([product.id, responsible.id], data.from, data.to);
                product.internal.sena = Math.round(product.internal.summa / product.internal.kol * 100) / 100;

                product.to = await SaldoDB.getKolSumma([product.id, responsible.id], null, data.to);
                product.to.sena = Math.round(product.to.summa / product.to.kol * 100) / 100;

                product.prixod_data = await SaldoDB.getProductPrixod([product.id]);
            }

            responsible.products = responsible.products.filter(item => item.to.kol !== 0 && item.to.summa !== 0);
        }

        data.responsibles = data.responsibles.filter(item => item.products.length !== 0);

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

    static async templateFile() {
        const fileName = `saldo.xlsx`;
        const folderPath = path.join(__dirname, `../../../../public/template/`);

        const filePath = path.join(folderPath, fileName);

        const fileRes = await fs.promises.readFile(filePath);

        return { fileName, fileRes };
    }

    static async importData(data) {
        await db.transaction(async client => {
            const saldo_create = [];
            for (let doc of data.docs) {
                if (doc.iznos) {
                    for (let i = 1; i <= doc.kol; i++) {
                        const product = await ProductDB.create([
                            data.user_id,
                            data.budjet_id,
                            doc.name,
                            doc.edin,
                            doc.group_jur7_id,
                            doc.inventar_num,
                            doc.serial_num,
                            tashkentTime(),
                            tashkentTime()
                        ], client);

                        const sena = doc.summa / doc.kol;

                        saldo_create.push({
                            product_id: product.id,
                            kol: 1,
                            sena,
                            summa: sena,
                            doc_date: doc.doc_date,
                            responsible_id: doc.responsible_id
                        });

                        const old_iznos = doc.eski_iznos_summa / doc.kol;
                        const iznos_summa = (sena * (doc.iznos_foiz / 100) / 12) + old_iznos;

                        await IznosDB.createIznos([
                            data.user_id,
                            doc.inventar_num,
                            doc.serial_num,
                            product.id,
                            1,
                            sena,
                            doc.doc_date,
                            doc.responsible_id,
                            iznos_summa,
                            doc.doc_date ? (new Date(doc.doc_date).getFullYear()) : new Date().getFullYear(),
                            doc.doc_date ? (new Date(doc.doc_date).getMonth() + 1) : new Date().getMonth() + 1,
                            doc.doc_date,
                            data.budjet_id,
                            old_iznos,
                            tashkentTime(),
                            tashkentTime()
                        ], client)
                    }
                } else {
                    const product = await ProductDB.create([
                        data.user_id,
                        data.budjet_id,
                        doc.name,
                        doc.edin,
                        doc.group_jur7_id,
                        doc.inventar_num,
                        doc.serial_num,
                        tashkentTime(),
                        tashkentTime()
                    ], client);

                    saldo_create.push({ product_id: product.id, ...doc });
                }
            }

            for (let doc of saldo_create) {
                await SaldoDB.create([
                    data.user_id,
                    doc.product_id,
                    doc.kol,
                    doc.summa / doc.kol,
                    doc.summa,
                    doc.doc_date,
                    doc.doc_date,
                    doc.responsible_id,
                    tashkentTime(),
                    tashkentTime()
                ], client);
            }
        })
    }

    static async readFile(data) {
        const workbook = xlsx.readFile(data.filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const excel_data = xlsx.utils.sheet_to_json(sheet).map((row, index) => {
            const newRow = {};
            for (const key in row) {
                if (Object.prototype.hasOwnProperty.call(row, key)) {
                    newRow[key] = row[key];
                }
            }

            return newRow;
        });

        const result = excel_data.filter((item, index) => index >= 3);

        return result;
    }
}
