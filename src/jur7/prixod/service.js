const { PrixodDB } = require('./db');
const { db } = require('../../db/index');
const { IznosDB } = require('../iznos/db')
const { tashkentTime, returnLocalDate, returnSleshDate } = require('../../helper/functions');
const { SaldoDB } = require('../saldo/db');
const { access, constants, mkdir } = require('fs').promises;
const ExcelJS = require('exceljs');
const path = require('path');

exports.PrixodJur7Service = class {
    static async prixodReport(data) {
        const result = await PrixodDB.prixodReport([data.region_id, data.from, data.to, data.main_schet_id]);
        await Promise.all(result.map(async (item) => {
            item.childs = await PrixodDB.prixodReportChild([item.id]);
            return item;
        }));
        
        const Workbook = new ExcelJS.Workbook();
        const worksheet = Workbook.addWorksheet('jur_7_prixod');
        worksheet.mergeCells('A1', 'D1');
        const titleCell = worksheet.getCell('A1');
        titleCell.value = `Приходные накладные от ${returnLocalDate(new Date(data.from))} до ${returnLocalDate(new Date(data.to))}`;
        worksheet.getRow(2).values = [
            '№ док', 'дата', 'Наименование организации', 'Наим_тов',
            'Един', 'Кол', 'Цена', 'Сумма', '№ дов', 'Дата', 'счет', 'суб.счет'
        ];
        worksheet.columns = [
            { key: 'doc_num', width: 30 },
            { key: 'doc_date', width: 30 },
            { key: 'organization', width: 30 },
            { key: 'product', width: 30 },
            { key: 'edim', width: 15 },
            { key: 'count', width: 15 },
            { key: 'cost', width: 15 },
            { key: 'amount', width: 15 },
            { key: 'c_doc_num', width: 15 },
            { key: 'c_doc_date', width: 15 },
            { key: 'schet', width: 15 },
            { key: 'sub_schet', width: 15 }
        ];

        for (let item of result) {
            worksheet.addRow({
                doc_num: '№',
                doc_date: item.doc_num,
                organization: '',
                product: 'от',
                edim: returnSleshDate(new Date(item.doc_date)),
                count: '',
                cost: '',
                amount: '',
                c_doc_num: '',
                c_doc_date: '',
                schet: '',
                sub_schet: ''
            })

            for (let i of item.childs) {
                worksheet.addRow({
                    doc_num: item.doc_num,
                    doc_date: returnSleshDate(new Date(item.doc_date)),
                    organization: item.organization,
                    product: i.product_name,
                    edim: i.edin,
                    count: i.kol,
                    cost: i.sena,
                    amount: i.summa,
                    c_doc_num: item.c_doc_num || '',
                    c_doc_date: item.c_doc_date ? returnSleshDate(new Date(item.c_doc_date)) : '',
                    schet: i.schet,
                    sub_schet: i.sub_schet
                })
            }

            worksheet.addRow({
                doc_num: '',
                doc_date: '',
                organization: '',
                product: '',
                edim: '',
                count: '',
                cost: '',
                amount: item.summa,
                c_doc_num: '',
                c_doc_date: '',
                schet: '',
                sub_schet: ''
            })
        }

        let summa = 0;
        for (let item of result) {
            summa += item.summa
        }

        worksheet.addRow({
            doc_num: 'обший итог',
            doc_date: '',
            organization: '',
            product: '',
            edim: '',
            count: '',
            cost: '',
            amount: summa,
            c_doc_num: '',
            c_doc_date: '',
            schet: '',
            sub_schet: ''
        });

        worksheet.eachRow((row, rowNumber) => {
            row.eachCell((cell, index) => {
                let bold = false;
                let size = 12;
                let argb = 'FF000000';
                let horizontal = 'center';
                let fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: "FFFFFFFF" } }
                let border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                }
                if (rowNumber < 3) {
                    bold = true;
                    size = 14;
                    argb = "FF0000FF";
                }
                if (rowNumber > 2 && (cell.value === '№' || cell.value === 'от')) {
                    argb = 'FF0000FF'
                }
                if (rowNumber > 2 && index === 2 && !/\/.*/.test(cell.value)) {
                    horizontal = 'left';
                    bold = true;
                }
                if (rowNumber > 2 && index === 5 && /\/.*/.test(cell.value)) {
                    horizontal = 'right';
                    bold = true;
                }
                if (rowNumber > 2 && (index === 1 || index === 3 || index === 5 || index === 9)) {
                    horizontal = 'left';
                }
                if (rowNumber > 2 && (index === 2 || (index > 5 && index < 11 && index !== 9 && index !== 10) || index === 12)) {
                    horizontal = 'right';
                }
                if (rowNumber > 2 && index === 8 && cell.value !== '' && '' === worksheet.getRow(rowNumber).getCell(index - 1).value) {
                    bold = true;
                }
                if (fill && border) {
                    Object.assign(cell, {
                        numFmt: "#,##0",
                        font: { size, name: 'Times New Roman', bold, color: { argb } },
                        alignment: { vertical: "middle", horizontal, wrapText: true },
                        fill,
                        border
                    });
                } else {
                    Object.assign(cell, {
                        numFmt: "#,##0",
                        font: { size, name: 'Times New Roman', bold, color: { argb } },
                        alignment: { vertical: "middle", horizontal, wrapText: true }
                    });
                }
            });
        });

        worksheet.getRow(1).height = 80;
        worksheet.getColumn(1).width = 10;
        worksheet.getColumn(2).width = 15;
        worksheet.getColumn(3).width = 25;
        worksheet.getColumn(4).width = 20;
        worksheet.getColumn(5).width = 15;
        worksheet.getColumn(6).width = 20;
        worksheet.getColumn(7).width = 20;
        worksheet.getColumn(8).width = 27;

        const folderPath = path.join(__dirname, `../../../public/exports`);
        try {
            await access(folderPath, constants.W_OK);
        } catch (error) {
            await mkdir(folderPath);
        }

        const fileName = `jur7_prixod_${new Date().getTime()}.xlsx`;
        const filePath = `${folderPath}/${fileName}`;

        await Workbook.xlsx.writeFile(filePath);

        return { fileName, filePath }
    }

    static async createNaimenovanie(data) {
        const result = [];
        for (let doc of data.childs) {
            if (doc.iznos) {
                for (let i = 1; i <= doc.kol; i++) {
                    const product = await PrixodDB.createNaimenovanie([
                        data.user_id,
                        data.budjet_id,
                        doc.name,
                        doc.edin,
                        doc.group_jur7_id,
                        doc.inventar_num,
                        doc.serial_num,
                        tashkentTime(),
                        tashkentTime()
                    ], data.client)

                    result.push({ ...product, ...doc, kol: 1 });
                }
            } else {
                const product = await PrixodDB.createNaimenovanie([
                    data.user_id,
                    data.budjet_id,
                    doc.name,
                    doc.edin,
                    doc.group_jur7_id,
                    doc.inventar_num,
                    doc.serial_num,
                    tashkentTime(),
                    tashkentTime()
                ], data.client)

                result.push({ ...product, ...doc });
            }
        }
        return result;
    }

    static async createPrixod(data) {
        await db.transaction(async (client) => {
            const childs = await this.createNaimenovanie({ childs: data.childs, user_id: data.user_id, budjet_id: data.budjet_id, client });

            const summa = childs.reduce((acc, child) => acc + child.kol * child.sena, 0);

            const doc = await PrixodDB.createPrixod(
                [
                    data.user_id,
                    data.doc_num,
                    data.doc_date,
                    data.j_o_num,
                    data.opisanie,
                    data.doverennost,
                    summa,
                    data.kimdan_id,
                    data.kimdan_name,
                    data.kimga_id,
                    data.kimga_name,
                    data.id_shartnomalar_organization,
                    data.main_schet_id,
                    tashkentTime(),
                    tashkentTime()
                ], client);

            await this.createPrixodChild({ ...data, docId: doc.id, client, childs });
        });
    }

    static async createPrixodChild(data) {
        for (const child of data.childs) {
            const summa = child.kol * child.sena;
            const nds_summa = child.nds_foiz / 100 * summa;
            const summa_s_nds = summa + nds_summa;
            await PrixodDB.createPrixodChild([
                child.id,
                child.kol,
                child.sena,
                summa,
                child.nds_foiz,
                nds_summa,
                summa_s_nds,
                child.debet_schet,
                child.debet_sub_schet,
                child.kredit_schet,
                child.kredit_sub_schet,
                child.data_pereotsenka,
                data.user_id,
                data.docId,
                data.main_schet_id,
                child.iznos,
                child.eski_iznos_summa,
                tashkentTime(),
                tashkentTime()
            ], data.client);

            const product_sena = await SaldoDB.getSena([child.id], data.client);
            const iznos_summa = (product_sena * (child.iznos_foiz / 100) / 12) + child.eski_iznos_summa;
            const month = new Date(data.doc_date).getMonth() + 1;
            const year = new Date(data.doc_date).getFullYear();

            if (child.iznos) {
                await IznosDB.createIznos([
                    data.user_id,
                    child.inventar_num,
                    child.serial_num,
                    child.id,
                    child.kol,
                    product_sena,
                    data.doc_date,
                    data.kimga_id,
                    iznos_summa,
                    year,
                    month,
                    `${year}-${month}-01`,
                    data.budjet_id,
                    child.eski_iznos_summa,
                    tashkentTime(),
                    tashkentTime()
                ], data.client)
            }

            // await SaldoDB.createSaldo([
            //     data.user_id,
            //     child.id,
            //     0,
            //     product_sena,
            //     0,
            //     month,
            //     year,
            //     `${year}-${month}-01`,
            //     data.kimga_id,
            //     iznos_summa,
            //     tashkentTime(),
            //     tashkentTime()
            // ], data.client)
        }
    }

    static async updatePrixod(data) {
        const summa = data.childs.reduce((acc, child) => acc + child.kol * child.sena, 0);

        await db.transaction(async (client) => {
            await PrixodDB.updatePrixod([
                data.doc_num,
                data.doc_date,
                data.j_o_num,
                data.opisanie,
                data.doverennost,
                summa,
                data.kimdan_id,
                data.kimdan_name,
                data.kimga_id,
                data.kimga_name,
                data.id_shartnomalar_organization,
                tashkentTime(),
                data.id
            ], client);

            const productIds = await PrixodDB.getProductsByDocId([data.id], client);

            await PrixodDB.deletePrixodChild(data.id, productIds, client);

            const childs = await this.createNaimenovanie({ childs: data.childs, user_id: data.user_id, budjet_id: data.budjet_id, client });

            await this.createPrixodChild({ ...data, docId: data.id, childs, client });
        });
    }

    static async checkPrixodDoc(data) {
        const result = await PrixodDB.checkPrixodDoc([data.productId]);
        return result;
    }

    static async deleteDoc(data) {
        await db.transaction(async (client) => {
            const productIds = await PrixodDB.getProductsByDocId([data.id], client);

            await PrixodDB.deletePrixodChild(data.id, productIds, client);

            await PrixodDB.deletePrixod([data.id], client)
        })
    }

    static async getPrixod(data) {
        const result = await PrixodDB.getPrixod([data.region_id, data.from, data.to, data.main_schet_id, data.offset, data.limit], data.search);

        return result;
    }

    static async getByIdPrixod(data) {
        const result = await PrixodDB.getByIdPrixod([data.region_id, data.id, data.main_schet_id], data.isdeleted);

        return result;
    }
}