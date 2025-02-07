const { PrixodDB } = require('./db');
const { db } = require('../../db/index');
const { IznosDB } = require('../iznos/db')
const { tashkentTime, returnLocalDate, returnSleshDate, HelperFunctions } = require('../../helper/functions');
const fs = require('fs').promises;
const ExcelJS = require('exceljs');
const path = require('path');
const xlsx = require('xlsx');

exports.PrixodJur7Service = class {
    static async templateFile() {
        const fileName = `prixod.xlsx`;
        const folderPath = path.join(__dirname, `../../../template`);

        const filePath = path.join(folderPath, fileName);

        const fileRes = await fs.readFile(filePath);

        return { fileName, fileRes };
    }

    static async importData(data) {
        await db.transaction(async client => {
            for (let doc of data.data) {
                await this.create({ ...doc, client, user_id: data.user_id, budjet_id: data.budjet_id, main_schet_id: data.main_schet_id });
            }
        })

    }

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
            await fs.access(folderPath, fs.constants.W_OK);
        } catch (error) {
            await fs.mkdir(folderPath);
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

    static async create(data) {
        const process = async (data, client) => {
            const childs = await this.createNaimenovanie({ childs: data.childs, user_id: data.user_id, budjet_id: data.budjet_id, client });

            const summa = childs.reduce((acc, child) => acc + child.kol * child.sena, 0);

            const doc = await PrixodDB.create(
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

            return doc;
        }
        let result;

        if (data.client) {
            result = await process(data, data.client);
            return result;
        }

        result = await db.transaction(async (client) => {
            const docId = await process(data, client);
            return docId;
        });

        return result;
    }

    static async createPrixodChild(data) {
        for (const child of data.childs) {
            const summa = !child.summa ? child.kol * child.sena : child.summa;
            const nds_summa = !child.summa ? child.nds_foiz / 100 * summa : child.summa;
            const summa_s_nds = !child.summa ? summa + nds_summa : child.summa;
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
                child.eski_iznos_summa,
                tashkentTime(),
                tashkentTime()
            ], data.client);

            const product_sena = summa_s_nds / child.kol;
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
        }
    }

    static async getProductIds(data) {
        const productIds = await PrixodDB.getProductsByDocId([data.id]);

        return productIds;
    }

    static async update(data) {
        const summa = data.childs.reduce((acc, child) => acc + child.kol * child.sena, 0);

        const result = await db.transaction(async (client) => {
            await PrixodDB.update([
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

            return { id: data.id }
        });

        return result;
    }

    static async checkPrixodDoc(data) {

        const result = await PrixodDB.checkPrixodDoc([data.product_id]);

        return result;
    }

    static async deleteDoc(data) {
        const result = await db.transaction(async (client) => {
            const productIds = await PrixodDB.getProductsByDocId([data.id], client);

            await PrixodDB.deletePrixodChild(data.id, productIds, client);

            const docId = await PrixodDB.delete([data.id], client);

            return docId
        });

        return result;
    }

    static async get(data) {
        const result = await PrixodDB.get([data.region_id, data.from, data.to, data.main_schet_id, data.offset, data.limit], data.search);

        return result;
    }

    static async getById(data) {
        const result = await PrixodDB.getById([data.region_id, data.id, data.main_schet_id], data.isdeleted);

        return result;
    }

    static async readFile(data) {
        const workbook = xlsx.readFile(data.filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const excel_data = xlsx.utils.sheet_to_json(sheet).map(row => {
            const newRow = {};

            for (const key in row) {
                if (Object.prototype.hasOwnProperty.call(row, key)) {
                    newRow[key] = row[key];
                }
            }

            return newRow;
        });

        const result = excel_data.filter((item, index) => index > 2);

        return result;
    }

    static groupData(data) {
        const groupedData = {};

        data.forEach(item => {
            const key = `${item.docNum}_${item.responsibleId}`;

            if (!groupedData[key]) {
                const date = item.docDate.split('.');
                groupedData[key] = {
                    doc_num: item.docNum,
                    doc_date: `${date[2]}-${date[1]}-${date[0]}`,
                    j_o_num: "",
                    opisanie: "",
                    doverennost: "",
                    kimdan_id: item.organizationId,
                    kimdan_name: item.organizationName,
                    kimga_id: item.responsibleId,
                    kimga_name: item.kimgaName,
                    id_shartnomalar_organization: null,
                    childs: []
                };
            }

            groupedData[key].childs.push({
                name: item.productName,
                edin: item.edin,
                group_jur7_id: item.groupId,
                inventar_num: item.inventarNum,
                serial_num: item.serialNum,
                kol: item.kol,
                sena: item.summa / item.kol,
                nds_foiz: item.ndsFoiz,
                debet_schet: item.debetSchet,
                kredit_sub_schet: item.kreditSubSchet,
                debet_sub_schet: item.debetSubSchet,
                kredit_schet: item.kreditSchet,
                iznos: item.iznos?.trim() === "ha",
                eski_iznos_summa: item.eskiIznosSumma || 0
            });
        });

        const groupedArray = Object.values(groupedData);

        return groupedArray;
    }
}