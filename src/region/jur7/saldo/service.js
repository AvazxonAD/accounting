const { SaldoDB } = require('@saldo/db');
const { tashkentTime } = require('@helper/functions');
const { db } = require('@db/index');
const { HelperFunctions } = require('@helper/functions');
const xlsx = require('xlsx');
const { ProductDB } = require('@product/db');
const { ResponsibleDB } = require('@responsible/db');

exports.SaldoService = class {
    static async checkDoc(data) {
        const result = await SaldoDB.checkDoc([data.product_id]);

        return result;
    }

    static async deleteById(data) {
        const result = await SaldoDB.deleteById([data.id]);

        return result;
    }

    static async updateIznosSumma(data) {
        const result = await SaldoDB.updateIznosSumma([
            data.iznos_summa,
            data.id
        ]);

        return result;
    }

    static async getById(data) {
        const result = await SaldoDB.getById([data.region_id, data.id], data.isdeleted, data.iznos);

        return result;
    }

    static async getByGroup(data) {
        const month = new Date(data.to).getMonth() + 1;
        const year = new Date(data.to).getFullYear();

        for (let group of data.groups) {
            const products = await SaldoDB.get([data.region_id, year, month, 0, 99999], data.responsible_id, data.search, data.product_id, group.id, data.iznos);
            group.products = products.data;
            for (let product of group.products) {
                product.internal = await SaldoDB.getKolAndSumma(
                    [product.naimenovanie_tovarov_jur7_id],
                    `${year}-${month < 10 ? `0${month}` : month}-01`,
                    data.to,
                    product.responsible.id
                );

                product.to = {
                    kol: product.from.kol + product.internal.kol,
                    summa: product.from.summa + product.internal.summa,
                    iznos_summa: product.from.iznos_summa + product.internal.iznos_summa
                };

                if (product.to.kol !== 0) {
                    product.to.sena = product.to.summa / product.to.kol;
                } else {
                    product.to.sena = product.to.summa;
                }
            }
        }

        return data.groups;
    }

    static async lastSaldo(data) {
        const last_date = HelperFunctions.lastDate({ year: data.year, month: data.month });

        const last_saldo = await SaldoDB.get([data.region_id, last_date.year, last_date.month, 0, 99999]);

        return { last_saldo, last_date };
    }

    static async getBlock(data) {
        const result = await SaldoDB.getBlock([data.region_id]);

        return result;
    }

    static async getSaldoDate(data) {
        const result = await SaldoDB.getSaldoDate([data.region_id, data.date]);

        return result;
    }

    static async check(data) {
        const result = await SaldoDB.check([data.region_id], data.year, data.month);

        const first = await SaldoDB.getFirstSaldoDate([data.region_id]);

        const end = await SaldoDB.getEndSaldoDate([data.region_id]);

        return { result, meta: { first, end } };
    }

    static async create(data) {
        const { data: responsibles } = await ResponsibleDB.get([0, 99999], data.region_id,);

        for (let responsible of responsibles) {
            responsible.products = data.last_saldo.filter(item => item.responsible_id === responsible.id);
            for (let product of responsible.products) {

                product.data = await SaldoDB.getKolAndSumma(
                    [product.naimenovanie_tovarov_jur7_id],
                    `${data.last_date.year}-${data.last_date.month}-01`,
                    `${data.year}-${data.month}-01`,
                    responsible.id
                );

                product.data.kol = product.data.kol + product.kol;
                product.data.summa = product.data.summa + product.summa;

                if (product.data.kol !== 0) {
                    product.data.sena = product.data.summa / product.data.kol;
                } else {
                    product.data.sena = product.data.summa;
                }

                product.id = product.naimenovanie_tovarov_jur7_id;

                product.doc_data = { doc_date: product.prixod_data.doc_date, doc_num: product.prixod_data.doc_num, id: product.prixod_data.doc_id };
            }

            responsible.products = responsible.products.filter(item =>
                item.data.iznos_summa !== 0 || (item.data.kol !== 0 && item.data.summa !== 0)
            );
        }

        const result = await responsibles.filter(item => item.products.length !== 0);

        await db.transaction(async client => {
            await SaldoDB.delete([data.year, data.month, data.region_id], client);

            for (let responsible of result) {
                for (let product of responsible.products) {
                    let sena = 0;
                    let iznos_summa = 0;
                    if (product.data.kol !== 0) {
                        sena = product.data.summa / product.data.kol;
                    } else {
                        sena = product.data.summa;
                    }

                    if (product.data.kol !== 0) {
                        iznos_summa = sena * (product.group.iznos_foiz / 100) + product.data.iznos_summa;
                        if (sena !== 0) {
                            iznos_summa = iznos_summa >= sena ? sena : iznos_summa;
                        }
                    } else {
                        iznos_summa = product.data.iznos_summa;
                    }

                    await SaldoDB.create([
                        data.user_id,
                        product.id,
                        product.data.kol,
                        sena,
                        product.data.summa,
                        data.month,
                        data.year,
                        `${data.year}-${data.month}-01`,
                        product.doc_data?.doc_date || `${data.year}-${data.month}-01`,
                        product.doc_data?.doc_num || 'saldo',
                        responsible.id,
                        data.region_id,
                        product.doc_data?.id,
                        product.iznos,
                        iznos_summa,
                        product.iznos_schet,
                        product.iznos_sub_schet,
                        product.data.iznos_summa,
                        product.iznos_start,
                        tashkentTime(),
                        tashkentTime()
                    ], client);

                    await SaldoDB.unblock([data.region_id, data.year, data.month]);
                }
            }
        })
    }

    static async get(data) {
        const { data: result } = await SaldoDB.get([data.region_id, data.year, data.month, 0, 99999]);

        return result;
    }

    static async delete(data) {
        await db.transaction(async client => {
            for (let id of data.ids) {
                await SaldoDB.deleteById([id.id], client);
            }
        })
    }

    static async importData(data) {
        await db.transaction(async client => {
            const saldo_create = [];
            for (let doc of data.docs) {
                doc.sena = doc.summa / doc.kol;

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

                        saldo_create.push({
                            ...doc,
                            product_id: product.id,
                            kol: 1,
                            summa: doc.sena
                        });
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

            let dates = [];

            let year, month;

            let first_date = await SaldoDB.getFirstSaldoDate([data.region_id]);
            if (first_date) {
                first_date = new Date(first_date.date_saldo);

                if (first_date < data.date_saldo.full_date) {
                    year = first_date.getFullYear();
                    month = first_date.getMonth() + 1;
                } else {
                    year = data.date_saldo.full_date.getFullYear();
                    month = data.date_saldo.full_date.getMonth() + 1;
                }
            } else {
                year = data.date_saldo.full_date.getFullYear();
                month = data.date_saldo.full_date.getMonth() + 1;
            }


            for (let doc of saldo_create) {
                let old_iznos = 0;
                let iznos_summa = 0;

                if (doc.iznos) {
                    old_iznos = doc.eski_iznos_summa ? doc.eski_iznos_summa / doc.kol : 0;
                    iznos_summa = (doc.sena * (doc.iznos_foiz / 100)) + old_iznos;
                    iznos_summa = iznos_summa >= doc.sena ? doc.sena : iznos_summa;
                    old_iznos = old_iznos >= doc.sena ? doc.sena : old_iznos;
                }

                await SaldoDB.create([
                    data.user_id,
                    doc.product_id,
                    doc.kol,
                    doc.sena,
                    doc.summa,
                    month,
                    year,
                    `${year}-${month}-01`,
                    doc?.doc_date || `${year}-${month}-01`,
                    doc?.doc_num || 'saldo',
                    doc.responsible_id,
                    data.region_id,
                    null,
                    doc.iznos,
                    iznos_summa,
                    doc.iznos_schet,
                    doc.iznos_sub_schet,
                    old_iznos,
                    doc.iznos_start,
                    tashkentTime(),
                    tashkentTime()
                ], client);
            }

            const next_saldo = await SaldoDB.getSaldoDate([data.region_id, `${year}-${month}-01`], client);

            for (let date of next_saldo) {
                dates.push(await SaldoDB.createSaldoDate([
                    data.region_id,
                    date.year,
                    date.month,
                    tashkentTime(),
                    tashkentTime()
                ], client));
            }

        });
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
