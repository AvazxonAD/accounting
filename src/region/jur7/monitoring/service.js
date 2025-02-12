const { Jur7MonitoringDB } = require('./db');
const ExcelJS = require('exceljs');
const path = require('path');
const { HelperFunctions } = require('@helper/functions');
const { access, constants, mkdir } = require('fs').promises;

exports.Jur7MonitoringService = class {
    static async cap(data) {
        const result = {
            schets_summa: 0,
            debet_sub_schets_summa: 0,
            kredit_sub_schets_summa: 0,
            iznos_summa: 0
        };

        result.schets = await Jur7MonitoringDB.getSchetsForCap([data.budjet_id, data.region_id, data.from, data.to]);
        for (let schet of result.schets) {
            schet.summa = await Jur7MonitoringDB.getCapSchetSumma([data.budjet_id, data.region_id, data.from, data.to, schet.debet_schet, schet.kredit_schet]);
            result.schets_summa += schet.summa;
        }

        result.debet_sub_schets = await Jur7MonitoringDB.getDebetSubSchetsForCap([data.budjet_id, data.region_id, data.from, data.to]);
        for (let schet of result.debet_sub_schets) {
            schet.summa = await Jur7MonitoringDB.getDebetSubSchetSumma([data.budjet_id, data.region_id, data.from, data.to, schet.debet_sub_schet]);
            result.debet_sub_schets_summa += schet.summa;
        }

        result.kredit_sub_schets = await Jur7MonitoringDB.getKreditSubSchetsForCap([data.budjet_id, data.region_id, data.from, data.to]);
        for (let schet of result.kredit_sub_schets) {
            schet.summa = await Jur7MonitoringDB.getKreditSubSchetSumma([data.budjet_id, data.region_id, data.from, data.to, schet.kredit_sub_schet]);
            result.kredit_sub_schets_summa += schet.summa;
        }

        result.iznos_schets = await Jur7MonitoringDB.getIznosSummaByProvodkaSubSchet([data.budjet_id, data.region_id, data.from, data.to]);
        for (let schet of result.iznos_schets) {
            result.iznos_summa += schet.summa;
        }

        return result;
    }

    static async capExcel(data) {
        const workbook = new ExcelJS.Workbook();
        const fileName = `cap_${new Date().getTime()}.xlsx`;
        const worksheet = workbook.addWorksheet('organization prixod rasxod');
        worksheet.mergeCells(`A1`, 'D1');
        worksheet.getCell('A1').value = 'Журнал-ордер N_7';
        worksheet.mergeCells(`A2`, 'D2');
        worksheet.getCell('A2').value = `${HelperFunctions.returnStringDate(new Date(data.from))} дан   ${HelperFunctions.returnStringDate(new Date(data.to))} гача`;
        worksheet.mergeCells(`A3`, 'D3');
        worksheet.getCell('A3').value = `Подлежит записи в главную книгу`;
        worksheet.getCell('A4').value = 'Дебет';
        worksheet.getCell('B4').value = 'Кредит';
        worksheet.getCell('C4').value = 'Сумма';
        let row_number = !data.schets.length ? 5 : 4;
        for (let doc of data.schets) {
            worksheet.getCell(`A${row_number}`).value = doc.debet_schet;
            worksheet.getCell(`B${row_number}`).value = doc.kredit_schet;
            worksheet.getCell(`C${row_number}`).value = doc.summa;
            row_number++
        }
        worksheet.getCell(`C${row_number}`).value = data.schets_summa;

        row_number += 3;

        worksheet.mergeCells(`A${row_number}`, `D${row_number}`);
        worksheet.getCell(`A${row_number}`).value = 'Расшифировка дебета';
        row_number++

        worksheet.getCell(`A${row_number}`).value = `Тип расхода`;
        worksheet.getCell(`B${row_number}`).value = `Объект`;
        worksheet.getCell(`C${row_number}`).value = `Под`;
        worksheet.getCell(`D${row_number}`).value = `Сумма`;
        row_number++

        for (let doc of data.debet_sub_schets) {
            const format = HelperFunctions.formatSubSchet(doc.debet_sub_schet);
            worksheet.getCell(`A${row_number}`).value = format[0];
            worksheet.getCell(`B${row_number}`).value = format[1];
            worksheet.getCell(`C${row_number}`).value = format[2];
            worksheet.getCell(`D${row_number}`).value = doc.summa;
            row_number++
        }
        worksheet.getCell(`D${row_number}`).value = data.debet_sub_schets_summa;

        row_number += 3;

        worksheet.mergeCells(`A${row_number}`, `D${row_number}`);
        worksheet.getCell(`A${row_number}`).value = 'Расшифировка кредита';
        row_number++

        worksheet.getCell(`A${row_number}`).value = `Тип расхода`;
        worksheet.getCell(`B${row_number}`).value = `Объект`;
        worksheet.getCell(`C${row_number}`).value = `Под`;
        worksheet.getCell(`D${row_number}`).value = `Сумма`;
        row_number++

        for (let doc of data.kredit_sub_schets) {
            const format = HelperFunctions.formatSubSchet(doc.kredit_sub_schet);
            worksheet.getCell(`A${row_number}`).value = format[0];
            worksheet.getCell(`B${row_number}`).value = format[1];
            worksheet.getCell(`C${row_number}`).value = format[2];
            worksheet.getCell(`D${row_number}`).value = doc.summa;
            row_number++
        }
        worksheet.getCell(`D${row_number}`).value = data.kredit_sub_schets_summa;

        row_number += 3;

        worksheet.mergeCells(`A${row_number}`, `D${row_number}`);
        worksheet.getCell(`A${row_number}`).value = 'Расшифировка дебета износ';
        row_number++

        worksheet.getCell(`A${row_number}`).value = `Тип расхода`;
        worksheet.getCell(`B${row_number}`).value = `Объект`;
        worksheet.getCell(`C${row_number}`).value = `Под`;
        worksheet.getCell(`D${row_number}`).value = `Сумма`;
        row_number++

        for (let doc of data.iznos_schets) {
            const format = HelperFunctions.formatSubSchet(doc.provodka_subschet);
            worksheet.getCell(`A${row_number}`).value = format[0];
            worksheet.getCell(`B${row_number}`).value = format[1];
            worksheet.getCell(`C${row_number}`).value = format[2];
            worksheet.getCell(`D${row_number}`).value = doc.summa;
            row_number++
        }
        worksheet.getCell(`D${row_number}`).value = data.iznos_summa;

        worksheet.getColumn(1).width = 15;
        worksheet.getColumn(2).width = 15;
        worksheet.getColumn(3).width = 30;
        worksheet.getColumn(4).width = 30;
        worksheet.getRow(1).height = 30;
        worksheet.eachRow((row, rowNumber) => {
            worksheet.getRow(rowNumber).height = 18;
            row.eachCell((cell, columnNumber) => {
                let bold = false;
                let horizontal = "center";
                if (rowNumber < 3) {
                    bold = true;
                }
                if (rowNumber > 3 && columnNumber === 3) {
                    horizontal = 'right'
                }
                Object.assign(cell, {
                    numFmt: '#,##0.00',
                    font: { size: 13, name: 'Times New Roman', bold },
                    alignment: { vertical: "middle", horizontal, wrapText: true },
                    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } },
                    border: {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    }
                });
            });
        });
        const filePath = path.join(__dirname, '../../../public/exports/' + fileName);
        await workbook.xlsx.writeFile(filePath);
        return { filePath, fileName };
    }

    static async backCap(data) {
        const result = await Jur7MonitoringDB.getSchetsForBackCap([data.budjet_id, data.region_id, data.from, data.to]);
        result.debet_sum = 0;
        result.kredit_sum = 0;
        for (let item of result.kredit_schets) {
            item.summa = await Jur7MonitoringDB.getBackCapSchetSumma([data.budjet_id, data.region_id, data.from, data.to, item.schet], 'kredit_schet');
            result.kredit_sum += item.summa;
        }

        for (let item of result.debet_schets) {
            item.summa = await Jur7MonitoringDB.getBackCapSchetSumma([data.budjet_id, data.region_id, data.from, data.to, item.schet], 'debet_schet');
            result.debet_sum += item.summa;
        }
        return result;
    }

    static async backCapExcel(data) {
        const workbook = new ExcelJS.Workbook();
        const fileName = `cap_${new Date().getTime()}.xlsx`;
        const worksheet = workbook.addWorksheet('jur_7 cap');
        worksheet.mergeCells(`A1`, 'D1');
        worksheet.getCell('A1').value = 'Журнал-ордер N_7';

        worksheet.mergeCells(`A2`, 'D2');
        worksheet.getCell('A2').value = `${HelperFunctions.returnStringDate(new Date(data.from))} дан   ${HelperFunctions.returnStringDate(new Date(data.to))} гача`;

        worksheet.mergeCells(`A3`, 'B3');
        worksheet.getCell('A3').value = `Шапка для Журнал- Ордера №7 (дебет)`;

        worksheet.mergeCells(`C3`, 'D3');
        worksheet.getCell('C3').value = 'Шапка для Журнал- Ордера №7 (кредит)';

        worksheet.getCell(`A4`).value = `Дебет счет`;
        worksheet.getCell('B4').value = 'Сумма';
        worksheet.getCell('C4').value = `Кредит счет`;
        worksheet.getCell('D4').value = `Сумма`;

        let row_number = 5;
        for (let item of data.debet_schets) {
            worksheet.getCell(`A${row_number}`).value = item.schet;
            worksheet.getCell(`B${row_number}`).value = item.summa;
            row_number++
        }
        worksheet.getCell(`B${row_number}`).value = data.debet_sum;

        row_number = 5;
        for (let item of data.kredit_schets) {
            worksheet.getCell(`C${row_number}`).value = item.schet;
            worksheet.getCell(`D${row_number}`).value = item.summa;
            row_number++
        }
        worksheet.getCell(`D${row_number}`).value = data.kredit_sum;

        worksheet.getColumn(1).width = 15;
        worksheet.getColumn(2).width = 30;
        worksheet.getColumn(3).width = 15;
        worksheet.getColumn(4).width = 30;
        worksheet.getRow(1).height = 30;
        worksheet.getRow(3).height = 60;
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber > 3) {
                worksheet.getRow(rowNumber).height = 18;
            }
            row.eachCell((cell, columnNumber) => {
                let bold = false;
                let horizontal = "center";
                if (rowNumber < 5) {
                    bold = true;
                }
                if (rowNumber > 4 && (columnNumber === 2 || columnNumber === 4)) {
                    horizontal = 'right'
                }
                Object.assign(cell, {
                    numFmt: '#,##0.00',
                    font: { size: 13, name: 'Times New Roman', bold },
                    alignment: { vertical: "middle", horizontal, wrapText: true },
                    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } },
                    border: {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    }
                });
            });
        });
        const filePath = path.join(__dirname, '../../../public/exports/' + fileName);
        await workbook.xlsx.writeFile(filePath);
        return { filePath, fileName };
    }

    static async getSaldo(data) {
        let { products, total } = await Jur7MonitoringDB.getProducts([data.responsible_id, data.offset, data.limit], data.product_id, data.search);

        for (let product of products) {

            product.from = await Jur7MonitoringDB.getKolSumma([product.naimenovanie_tovarov_jur7_id, data.responsible_id], data.from);
            product.internal = await Jur7MonitoringDB.getKolSumma([product.naimenovanie_tovarov_jur7_id, data.responsible_id], null, [data.from, data.to]);
            product.to = await Jur7MonitoringDB.getKolSumma([product.naimenovanie_tovarov_jur7_id, data.responsible_id], data.to);

            if (product.to.kol === 0 && product.to.summa === 0) {
                products = products.filter(item => item.naimenovanie_tovarov_jur7_id !== product.naimenovanie_tovarov_jur7_id)
                continue
            }

            product.prixod_data = await Jur7MonitoringDB.getPrixodInfo([product.naimenovanie_tovarov_jur7_id]);
            product.sena = product.to.summa / product.to.kol;
            product.senaRound = Math.round(product.sena * 100) / 100;
        };

        return { products, total };
    }

    static async getSchets(data) {
        const result = await Jur7MonitoringDB.getSchets([data.year, data.month, data.main_schet_id]);
        const dates = HelperFunctions.getMonthStartEnd(data.year, data.month);

        for (let schet of result) {
            schet.summa_from = await Jur7MonitoringDB.getSummaReport([data.main_schet_id, schet.schet, dates[0]], '<')
            schet.internal = await Jur7MonitoringDB.getSummaReport([data.main_schet_id, schet.schet, dates[0], dates[1]])
            schet.summa_to = await Jur7MonitoringDB.getSummaReport([data.main_schet_id, schet.schet, dates[1]], '<=')
        }

        return result;
    }

    static async obrotkaExcel(data) {
        const Workbook = new ExcelJS.Workbook();
        const worksheet = Workbook.addWorksheet('obrotka');

        worksheet.mergeCells('A1', 'C1')
        const titleCell = worksheet.getCell('A1')
        titleCell.value = `СВОДНАЯ ОБОРОТЬ ЗА ${HelperFunctions.returnMonth(data.month)} ${data.year} год.`;

        worksheet.mergeCells('D1', 'E1')
        const regionNameCell = worksheet.getCell('D1')
        regionNameCell.value = data.region.name;

        worksheet.getRow(2).values = ['СЧЕТ', 'САЛЬДО', 'ПРИХОД', 'РАСХОД', 'САЛЬДО'];

        worksheet.columns = [
            { key: 'schet', width: 20 },
            { key: 'from', width: 20 },
            { key: 'prixod', width: 20 },
            { key: 'rasxod', width: 20 },
            { key: 'to', width: 20 }
        ];

        for (let schet of data.schets) {
            worksheet.addRow(
                { schet: schet.schet, from: schet.summa_from.summa, prixod: schet.internal.prixod, rasxod: schet.internal.rasxod, to: schet.summa_to.summa }
            )
        }

        worksheet.eachRow((row, rowNumber) => {
            let size = 12;
            let bold = false;
            let horizontal = 'center'
            if (rowNumber === 1) {
                size = 15;
                bold = true;
            }
            row.eachCell((cell, cellNumber) => {
                if (rowNumber > 2 && cellNumber > 1) {
                    horizontal = 'right'
                }
                if (rowNumber === 1) {
                    Object.assign(cell, {
                        font: { size, bold, color: { argb: 'FF000000' }, name: 'Times New Roman' },
                        alignment: { vertical: 'middle', horizontal }
                    });
                } else {
                    Object.assign(cell, {
                        font: { size, bold, color: { argb: 'FF000000' }, name: 'Times New Roman' },
                        alignment: { vertical: 'middle', horizontal },
                        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } },
                        border: {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        }
                    });
                }
            })
        });

        worksheet.getRow(1).height = 25;
        worksheet.getRow(2).height = 18;
        const folderPath = path.join(__dirname, '../../../public/exports');
        const fileName = `obrotka_${new Date().getTime()}.xlsx`

        try {
            await access(folderPath, constants.W_OK);
        } catch (error) {
            await mkdir(folderPath);
        }

        const filePath = `${folderPath}/${fileName}`;
        await Workbook.xlsx.writeFile(filePath);

        return { fileName, filePath };
    }

    static async materialReport(data) {
        const dates = HelperFunctions.getMonthStartEnd(data.year, data.month);

        for (let responsible of data.responsibles) {
            responsible.schets = data.schets.map(item => ({ ...item }));
            for (let schet of responsible.schets) {
                schet.products = await Jur7MonitoringDB.getBySchetProducts([data.region_id, data.main_schet_id, schet.schet, responsible.id])
                schet.kol_from = 0;
                schet.summa_from = 0;
                schet.kol_prixod = 0;
                schet.prixod = 0;
                schet.kol_rasxod = 0;
                schet.rasxod = 0;
                schet.kol_to = 0;
                schet.summa_to = 0;
                for (let product of schet.products) {
                    product.summa_from = await Jur7MonitoringDB.getSummaReport([data.main_schet_id, schet.schet, dates[0]], '<', responsible.id, product.id)
                    product.internal = await Jur7MonitoringDB.getSummaReport([data.main_schet_id, schet.schet, dates[0], dates[1]], null, responsible.id, product.id)
                    product.summa_to = await Jur7MonitoringDB.getSummaReport([data.main_schet_id, schet.schet, dates[1]], '<=', responsible.id, product.id)
                    schet.kol_from += product.summa_from.kol
                    schet.summa_from += product.summa_from.summa;
                    schet.kol_prixod += product.internal.prixod_kol;
                    schet.prixod += product.internal.prixod;
                    schet.kol_rasxod += product.internal.rasxod_kol;
                    schet.rasxod += product.internal.rasxod;
                    schet.kol_to += product.summa_to.kol;
                    schet.summa_to += product.summa_to.summa;
                }
            }
        }

        return data.responsibles;
    }

    static async materialExcel(data) {
        const Workbook = new ExcelJS.Workbook();
        const worksheet = Workbook.addWorksheet('material');

        worksheet.mergeCells('G1', 'K1')
        const title1 = worksheet.getCell('G1')
        title1.value = '"Тасдиқлайман"'

        worksheet.mergeCells('G2', 'K2')
        const title2 = worksheet.getCell('G2')
        title2.value = data.region.name

        worksheet.mergeCells('G3', 'K3')
        const title3 = worksheet.getCell('G3')
        title3.value = 'бошлиғи'

        worksheet.mergeCells('G4', 'K4')
        const title4 = worksheet.getCell('G4')
        title4.value = ''

        worksheet.mergeCells('A5', 'K5')
        const title5 = worksheet.getCell('A5')
        title5.value = `Материалный отчёт за ${HelperFunctions.returnMonth(data.month)} ${data.year} год.`;

        const productTitleCell = worksheet.getCell('A6')
        productTitleCell.value = 'Назвал предмет'

        const edinTitleCell = worksheet.getCell('B6')
        edinTitleCell.value = 'Ед.ном'

        worksheet.mergeCells('C6', 'D6')
        const fromCell = worksheet.getCell('C6')
        fromCell.value = 'ОСТАТОК на нач';

        worksheet.mergeCells('E6', 'H6')
        const oborotCell = worksheet.getCell('E6')
        oborotCell.value = 'ОБОРОТ';

        worksheet.mergeCells('I6', 'J6')
        const toCell = worksheet.getCell('I6')
        toCell.value = 'ОСТАТОК на кон'

        const date_prixod = worksheet.getCell('K6')
        date_prixod.value = 'Дата приход'

        worksheet.getRow(7).values = [
            '',
            '',
            'Кол',
            'Остаток',
            'Кол',
            'Приход',
            'Кол',
            'Расход',
            'Кол',
            'Остаток'
        ]

        worksheet.columns = [
            { key: 'product_name', width: 30 },
            { key: 'edin', width: 15 },
            { key: 'from_kol', width: 15 },
            { key: 'from_summa', width: 15 },
            { key: 'prixod_kol', width: 15 },
            { key: 'prixod', width: 15 },
            { key: 'rasxod_kol', width: 15 },
            { key: 'rasxod', width: 15 },
            { key: 'to_kol', width: 15 },
            { key: 'to_summa', width: 15 },
            { key: 'date', width: 15 }
        ];

        for (let responsible of data.responsibles) {
            for (let schet of responsible.schets) {
                if (schet.products.length) {
                    worksheet.addRow({})
                    worksheet.addRow({ product_name: responsible.fio })
                    worksheet.addRow({ product_name: `Счет ${schet.schet}` })
                    for (let product of schet.products) {
                        worksheet.addRow(
                            {
                                product_name: product.name,
                                edin: product.edin,
                                from_kol: product.summa_from.kol,
                                from_summa: product.summa_from.summa,
                                prixod_kol: product.internal.prixod_kol,
                                prixod: product.internal.prixod,
                                rasxod_kol: product.internal.rasxod_kol,
                                rasxod: product.internal.rasxod,
                                to_kol: product.summa_to.kol,
                                to_summa: product.summa_to.summa,
                                date: product.doc_date
                            }
                        )
                    }
                    worksheet.addRow(
                        {
                            product_name: '',
                            edin: '',
                            from_kol: schet.kol_from,
                            from_summa: schet.summa_from,
                            prixod_kol: schet.kol_prixod,
                            prixod: schet.prixod,
                            rasxod_kol: schet.kol_rasxod,
                            rasxod: schet.rasxod,
                            to_kol: schet.kol_to,
                            to_summa: schet.summa_to,
                            date: undefined
                        }
                    )
                }
            }
        }
        worksheet.eachRow((row, rowNumber) => {
            let size = 12;
            let bold = false;
            let horizontal = 'center'
            let border = {
                top: { style: 'thin', color: { argb: 'FFD3D3D3' } },
                left: { style: 'thin', color: { argb: 'FFD3D3D3' } },
                bottom: { style: 'thin', color: { argb: 'FFD3D3D3' } },
                right: { style: 'thin', color: { argb: 'FFD3D3D3' } }
            };
            if (rowNumber < 6) {
                worksheet.getRow(rowNumber).height = 25;
                bold = true;
            }
            if (rowNumber === 3) {
                horizontal = 'left';
            }
            if (rowNumber === 4) {
                border = {
                    top: { style: 'thin', color: { argb: 'FFD3D3D3' } },
                    left: { style: 'thin', color: { argb: 'FFD3D3D3' } },
                    bottom: { style: 'thin' },
                    right: { style: 'thin', color: { argb: 'FFD3D3D3' } }
                };
            }
            row.eachCell((cell) => {
                if (rowNumber > 5 && cell.value !== '' && cell.value !== undefined) {
                    border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                }
                Object.assign(cell, {
                    font: { size, bold, color: { argb: 'FF000000' }, name: 'Times New Roman' },
                    alignment: { vertical: 'middle', horizontal },
                    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } },
                    border
                });
            })
        })

        const folderPath = path.join(__dirname, '../../../public/exports');
        const fileName = `material_${new Date().getTime()}.xlsx`

        try {
            await access(folderPath, constants.W_OK);
        } catch (error) {
            await mkdir(folderPath);
        }

        const filePath = `${folderPath}/${fileName}`;
        await Workbook.xlsx.writeFile(filePath);

        return { fileName, filePath };
    }
}   