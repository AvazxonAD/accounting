const { SaldoDB } = require('@saldo/db');
const { tashkentTime } = require('@helper/functions');
const { db } = require('@db/index');
const { HelperFunctions } = require('@helper/functions');
const { IznosDB } = require('@iznos/db');
const xlsx = require('xlsx');
const { ProductDB } = require('@product/db');
const { ResponsibleDB } = require('@responsible/db');

exports.SaldoService = class {
    static async check(data) {
        const result = await SaldoDB.check([data.region_id, data.year, data.month]);

        return result;
    }

    static async create(data) {
        const last_date = HelperFunctions.lastDate({ year: data.year, month: data.month });
        let result;
        const { data: responsibles } = await ResponsibleDB.get([data.region_id, 0, 99999]);
        const { data: products } = await ProductDB.get([data.region_id, 0, 99999]);

        const last_saldo = await SaldoDB.get([data.region_id, last_date.year, last_date.month]);

        if (last_saldo.length === 0) {
            for (let responsible of responsibles) {
                responsible.products = JSON.parse(JSON.stringify(products));
                for (let product of responsible.products) {
                    product.data = await SaldoDB.getKolAndSumma([product.id, responsible.id], null, `${data.year}-${data.month}-01`);
                }

                responsible.products = responsible.products.filter(item => item.data.kol !== 0 && item.data.summa !== 0);

                for (let product of responsible.products) {
                    product.doc_data = await SaldoDB.getProductPrixod([product.id]);
                }
            }

            result = await responsibles.filter(item => item.products.length !== 0);
        } else {
            for (let responsible of responsibles) {
                responsible.products = last_saldo.filter(item => item.responsible_id === responsible.id);
                for (let product of responsible.products) {

                    product.data = await SaldoDB.getKolAndSumma([product.id, responsible.id], `${last_date.year}-${last_date.month}-01`, `${data.year}-${data.month}-01`);
                    product.data.kol = product.data.kol + product.kol;
                    product.data.summa = product.data.summa + product.summa;
                    product.data.sena = product.data.summa / product.data.kol;

                    product.id = product.naimenovanie_tovarov_jur7_id;

                    product.doc_data = { doc_date: product.doc_date, doc_num: product.doc_num, id: product.doc_id };
                }

                responsible.products = responsible.products.filter(item => item.data.kol !== 0 && item.data.summa !== 0);

            }
            result = await responsibles.filter(item => item.products.length !== 0);
        }

        await db.transaction(async client => {
            await SaldoDB.delete([data.year, data.month, data.region_id], client);

            for (let responsible of result) {
                for (let product of responsible.products) {
                    await SaldoDB.create([
                        data.user_id,
                        product.id,
                        product.data.kol,
                        product.data.summa / product.data.kol,
                        product.data.summa,
                        data.month,
                        data.year,
                        `${data.year}-${data.month}-01`,
                        product.doc_data.doc_date || `${data.year}-${data.month}-01`,
                        product.doc_data.doc_num || 'saldo',
                        responsible.id,
                        data.region_id,
                        tashkentTime(),
                        tashkentTime()
                    ], client);
                }
            }
        })
    }

    static async getByResponsibles(data) {
        const month = new Date(data.to).getMonth() + 1;
        const year = new Date(data.to).getFullYear();

        for (let responsible of data.responsibles) {
            responsible.products = await SaldoDB.get([data.region_id, year, month], responsible.id, data.search, data.product_id);
            for (let product of responsible.products) {
                product.from = { kol: product.kol, sena: product.sena, summa: product.summa };

                product.internal = await SaldoDB.getKolAndSumma([product.naimenovanie_tovarov_jur7_id, responsible.id], `${year}-${month < 10 ? `0${month}` : month}-01`, data.to);

                product.to = { kol: product.from.kol + product.internal.kol, summa: product.from.summa + product.internal.summa };
                product.to.sena = product.to.summa / product.to.kol;
            }

            responsible.products = responsible.products.filter(item => item.to.kol !== 0 && item.to.summa !== 0)
        }
        const result = await data.responsibles.filter(item => item.products.length !== 0);

        return result;
    }

    static async get(data) {
        const result = await SaldoDB.get([data.region_id, data.year, data.month]);

        return result;
    }

    static async delete(data) {
        let doc;

        if (data.check_prixod) {
            doc = await db.transaction(async client => {
                const result = await SaldoDB.delete([data.product_id], client);
                return result;
            })
        } else {
            doc = await SaldoDB.delete([data.product_id]);
        }

        return doc;
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
                            doc.iznos,
                            tashkentTime(),
                            tashkentTime()
                        ], client);

                        const sena = doc.summa / doc.kol;

                        saldo_create.push({
                            ...doc,
                            product_id: product.id,
                            kol: 1,
                            sena,
                            summa: sena,
                        });

                        const old_iznos = doc.eski_iznos_summa / doc.kol;
                        const iznos_summa = (sena * (doc.iznos_foiz / 100) / 12) + old_iznos;

                        const year = doc.doc_date ? (new Date(doc.doc_date).getFullYear()) : new Date().getFullYear();
                        const month = doc.doc_date ? (new Date(doc.doc_date).getMonth() + 1) : new Date().getMonth() + 1;

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
                            year,
                            month,
                            `${year}-${month}-01`,
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
                        doc.iznos,
                        tashkentTime(),
                        tashkentTime()
                    ], client);

                    saldo_create.push({ product_id: product.id, ...doc });
                }
            }


            for (let doc of saldo_create) {
                const year = doc.doc_date ? new Date(doc.doc_date).getFullYear() : new Date().getFullYear();
                const month = doc.doc_date ? new Date(doc.doc_date).getMonth() + 1 : new Date().getMonth() + 1;

                await SaldoDB.create([
                    data.user_id,
                    doc.product_id,
                    doc.kol,
                    doc.summa / doc.kol,
                    doc.summa,
                    month,
                    year,
                    `${year}-${month}-01`,
                    doc.doc_date || `${year}-${month}-01`,
                    doc.doc_num || 'saldo',
                    doc.responsible_id,
                    data.region_id,
                    null,
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
