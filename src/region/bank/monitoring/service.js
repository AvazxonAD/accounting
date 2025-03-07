const { BankMonitoringDB } = require('./db');
const { returnStringSumma, returnStringDate, HelperFunctions, returnSleshDate } = require('@helper/functions');
const ExcelJS = require('exceljs');
const path = require('path');
const { mkdir, constants, access } = require('fs').promises;

exports.BankMonitoringService = class {
    static async get(data) {
        const result = await BankMonitoringDB.get([data.region_id, data.main_schet_id, data.from, data.to, data.offset, data.limit], data.search);

        let page_prixod_sum = 0;
        let page_rasxod_sum = 0;
        for (let item of result.data) {
            page_prixod_sum += item.prixod_sum;
            page_rasxod_sum += item.rasxod_sum;
        }

        const summa_from = await BankMonitoringDB.getSumma([data.region_id, data.main_schet_id, data.from], '<', data.search);

        const summa_to = await BankMonitoringDB.getSumma([data.region_id, data.main_schet_id, data.to], '<=', data.search);

        return {
            summa_from,
            summa_to,
            data: result.data || [],
            total_count: result.total_count,
            page_prixod_sum,
            page_rasxod_sum,
            prixod_sum: result.prixod_sum,
            rasxod_sum: result.rasxod_sum,
            total_sum: result.prixod_sum - result.rasxod_sum,
            page_total_sum: page_prixod_sum - page_rasxod_sum
        };
    }

    static async cap(data) {
        const schets = await BankMonitoringDB.getSchets([data.region_id, data.main_schet_id, data.from, data.to]);
        for (let schet of schets) {
            schet.summa = await BankMonitoringDB.getSummaSchet([data.region_id, data.main_schet_id, data.from, data.to, schet.schet]);
        }

        let prixod_sum = 0
        let rasxod_sum = 0

        schets.forEach(item => {
            prixod_sum += item.summa.prixod_sum
            rasxod_sum += item.summa.rasxod_sum
        })

        const balance_from = await BankMonitoringDB.getSumma([data.region_id, data.main_schet_id, data.from], '<');

        const balance_to = await BankMonitoringDB.getSumma([data.region_id, data.main_schet_id, data.to], '<=');

        return { balance_from, balance_to, prixod_sum, rasxod_sum, data: schets };
    }

    static async capExcel(data) {
        const title = `Дневной отчет по ${data.report_title.name} №2. Счет: ${data.main_schet.jur2_schet}. Ҳисоб рақами: ${data.main_schet.account_number}`;
        const dateBetween = `За период с ${returnStringDate(new Date(data.from))} по ${returnStringDate(new Date(data.to))}`;
        const workbook = new ExcelJS.Workbook();
        const fileName = `bank_shapka_${new Date().getTime()}.xlsx`;
        const worksheet = workbook.addWorksheet('Hisobot');

        worksheet.mergeCells('A1', 'G1');
        const titleCell = worksheet.getCell('A1');
        Object.assign(titleCell, {
            value: title,
            font: { size: 10, bold: true, color: { argb: 'FF000000' }, name: 'Times New Roman' },
            alignment: { vertical: 'middle', horizontal: 'center' },
        });

        worksheet.mergeCells('H1', 'J1');
        const region = worksheet.getCell(`H1`);
        Object.assign(region, {
            value: data.region.name,
            font: { size: 10, color: { argb: 'FF000000' }, name: 'Times New Roman' },
            alignment: { vertical: 'middle', horizontal: "center" },
            fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } },
            border: {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            }
        })

        worksheet.getRow(1).height = 30;
        worksheet.getColumn(1).width = 5
        worksheet.getColumn(2).width = 7
        worksheet.getColumn(3).width = 27
        worksheet.getColumn(4).width = 27

        worksheet.mergeCells('A2', 'D2');
        const dateCell = worksheet.getCell('A2');
        Object.assign(dateCell, {
            value: dateBetween,
            font: { size: 12, bold: true, color: { argb: 'FF000000' }, name: 'Times New Roman' },
            alignment: { vertical: 'middle', horizontal: 'center' },
        });
        worksheet.getRow(2).height = 25;
        worksheet.mergeCells('A4', 'D4');
        const balanceFromCell = worksheet.getCell('A4');
        const balance_from = `Остаток к началу дня: ${returnStringSumma(data.balance_from.summa)}`;
        Object.assign(balanceFromCell, {
            value: balance_from,
            font: { size: 12, bold: true, color: { argb: 'FF000000' }, name: 'Times New Roman' },
            alignment: { vertical: 'middle', horizontal: 'left' },
        });
        worksheet.mergeCells('A5:B5');
        const headerCell = worksheet.getCell('A5');
        Object.assign(headerCell, {
            value: 'Счет',
            font: { bold: true, size: 12, name: 'Times New Roman' },
            alignment: { vertical: 'middle', horizontal: 'center' },
            fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } },
            border: {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            }
        });
        worksheet.getCell('C5').value = 'Приход';
        worksheet.getCell('D5').value = 'Расход';
        [worksheet.getCell('C5'), worksheet.getCell('D5')].forEach((cell) => {
            Object.assign(cell, {
                font: { bold: true, size: 12, name: 'Times New Roman' },
                alignment: { vertical: 'middle', horizontal: 'center' },
                fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } },
                border: {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                }
            });
        });
        worksheet.getRow(5).height = 30;
        let row_number = 5
        for (let item of data.data) {
            worksheet.mergeCells(`A${row_number + 1}:B${row_number + 1}`);
            const schet = worksheet.getCell(`A${row_number + 1}`)
            Object.assign(schet, {
                value: item.schet,
                font: { name: 'Times New Roman' },
                alignment: { vertical: 'middle', horizontal: 'center' },
                fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } },
                border: {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                }
            });
            const prixod_sum = worksheet.getCell(`C${row_number + 1}`);
            prixod_sum.value = item.summa.prixod_sum;
            prixod_sum.numFmt = '#,##0.00';
            const rasxod_sum = worksheet.getCell(`D${row_number + 1}`);
            rasxod_sum.value = item.summa.rasxod_sum;
            rasxod_sum.numFmt = '#,##0.00';
            const array = [prixod_sum, rasxod_sum];
            array.forEach(cell => {
                Object.assign(cell, {
                    font: { name: 'Times New Roman', size: 12 },
                    alignment: { vertical: 'middle', horizontal: 'right' },
                    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } },
                    border: {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    }
                });
            });
            row_number++
        }
        worksheet.mergeCells(`A${row_number + 1}:B${row_number + 1}`);
        const summa = worksheet.getCell(`A${row_number + 1}`);
        summa.value = 'Всего'
        Object.assign(summa, {
            font: { bold: true, size: 12, name: 'Times New Roman' },
            alignment: { vertical: 'middle', horizontal: 'center' },
            fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } },
            border: {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            }
        })
        const all_prixod_summa = worksheet.getCell(`C${row_number + 1}`);
        all_prixod_summa.value = data.prixod_sum
        all_prixod_summa.numFmt = '#,##0.00';
        const all_rasxod_summa = worksheet.getCell(`D${row_number + 1}`);
        all_rasxod_summa.value = data.rasxod_sum
        all_rasxod_summa.numFmt = '#,##0.00';
        const summa_array = [all_prixod_summa, all_rasxod_summa]
        summa_array.forEach((cell) => {
            Object.assign(cell, {
                font: { bold: true, size: 12, name: 'Times New Roman' },
                alignment: { vertical: 'middle', horizontal: 'right' },
                fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } },
                border: {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                }
            });
        });
        row_number++
        worksheet.mergeCells(`A${row_number + 1}`, `D${row_number + 1}`);
        const balanceToCell = worksheet.getCell('A' + (row_number + 1));
        balanceToCell.value = `Остаток концу дня: ${returnStringSumma(data.balance_to.summa)}`;
        Object.assign(balanceToCell, {
            font: { size: 12, bold: true, color: { argb: 'FF000000' }, name: 'Times New Roman' },
            alignment: { vertical: 'middle', horizontal: 'left' },
        });
        row_number++
        worksheet.mergeCells(`A${row_number + 2}`, `C${row_number + 2}`);
        const signature = worksheet.getCell(`A${row_number + 2}`);
        signature.value = 'Главный бухгалтер ___________________________'
        worksheet.mergeCells(`A${row_number + 3}`, `C${row_number + 3}`);
        const signature2 = worksheet.getCell(`A${row_number + 3}`);
        signature2.value = 'Бухгалтер    __________________________________'
        worksheet.mergeCells(`A${row_number + 4}`, `C${row_number + 4}`)
        const signature3 = worksheet.getCell(`A${row_number + 4}`)
        signature3.value = `Получил кассир  ______________________________`
        const signature_array = [signature, signature2, signature3]
        signature_array.forEach(row => {
            Object.assign(row, {
                font: { bold: true, size: 12, name: 'Times New Roman' },
                alignment: { vertical: 'bottom', horizontal: 'left' }
            });
        });
        worksheet.getRow(row_number + 2).height = 30;
        worksheet.getRow(row_number + 3).height = 30;
        worksheet.getRow(row_number + 4).height = 30;

        const folderPath = path.join(__dirname, '../../../../public/exports');

        try {
            await access(folderPath, constants.W_OK);
        } catch (error) {
            await mkdir(folderPath);
        }

        const filePath = `${folderPath}/${fileName}`;

        await workbook.xlsx.writeFile(filePath);

        return { fileName, filePath };
    }

    static async daily(data) {
        const result = await BankMonitoringDB.daily([data.main_schet_id, data.from, data.to, data.region_id]);

        const balance_from = await BankMonitoringDB.dailySumma([data.region_id, data.main_schet_id, data.from], '<');

        const balance_to = await BankMonitoringDB.dailySumma([data.region_id, data.main_schet_id, data.to], '<=');

        let prixod_summa = 0;
        let rasxod_summa = 0;

        for (let item of result) {
            prixod_summa += item.prixod_sum;
            rasxod_summa += item.rasxod_sum;
        }

        return { data: result, balance_from, balance_to, prixod_summa, rasxod_summa };
    }

    static async dailyExcel(data) {
        const title = `Дневной отчет по ${data.report_title.name} №1. Счет: ${data.main_schet.jur1_schet}. Ҳисоб рақами: ${HelperFunctions.probelNumber(data.main_schet.account_number)}`;
        const dateBetween = `За период с ${returnStringDate(new Date(data.from))} по ${returnStringDate(new Date(data.to))}`;
        const workbook = new ExcelJS.Workbook();
        const fileName = `kundalik_hisobot_bank_${new Date().getTime()}.xlsx`;
        const worksheet = workbook.addWorksheet('Hisobot');

        worksheet.mergeCells('A1', 'G1');
        const titleCell = worksheet.getCell('A1');
        Object.assign(titleCell, {
            value: title,
            font: { size: 10, bold: true, color: { argb: 'FF000000' }, name: 'Times New Roman' },
            alignment: { vertical: 'middle', horizontal: 'left' }
        });

        worksheet.mergeCells('H1', 'J1');
        const region = worksheet.getCell(`H1`);
        Object.assign(region, {
            value: data.region.name,
            font: { size: 10, color: { argb: 'FF000000' }, name: 'Times New Roman' },
            alignment: { vertical: 'middle', horizontal: "center" },
            fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } },
            border: {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            }
        })

        worksheet.mergeCells('A2', 'G2');
        const dateCell = worksheet.getCell('A2');
        Object.assign(dateCell, {
            value: dateBetween,
            font: { size: 11, bold: true, color: { argb: 'FF000000' }, name: 'Times New Roman' },
            alignment: { vertical: 'middle', horizontal: 'left' }
        });

        worksheet.mergeCells('A4', 'G4');
        const balanceFromCell = worksheet.getCell('A4');
        balanceFromCell.value = `Остаток к началу дня: ${returnStringSumma(data.balance_from)}`;
        Object.assign(balanceFromCell, {
            font: { size: 11, bold: true, color: { argb: 'FF000000' }, name: 'Times New Roman' },
            alignment: { vertical: 'middle', horizontal: 'left' }
        });

        const doc_num = worksheet.getCell('A5');
        const date = worksheet.getCell('B5')
        const comment = worksheet.getCell('C5')
        const schet = worksheet.getCell('D5')
        const prixod = worksheet.getCell('E5')
        const rasxod = worksheet.getCell('F5')
        date.value = `Дата`
        comment.value = 'Разъяснительный текст'
        doc_num.value = `№ док`;
        schet.value = `Счет`
        prixod.value = 'Приход'
        rasxod.value = 'Расход'
        const headers = [date, comment, doc_num, schet, prixod, rasxod]
        headers.forEach(item => {
            Object.assign(item, {
                font: { bold: true, size: 10, name: 'Times New Roman' },
                alignment: { vertical: 'middle', horizontal: 'center', wrapText: true },
                fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } },
                border: {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                }
            });
        })
        let row_number = 5
        for (let object of data.data) {
            object.docs.forEach(item => {
                const doc_num = worksheet.getCell(`A${row_number + 1}`);
                const date = worksheet.getCell(`B${row_number + 1}`)
                const comment = worksheet.getCell(`C${row_number + 1}`)
                const schet = worksheet.getCell(`D${row_number + 1}`)
                const rasxod = worksheet.getCell(`F${row_number + 1}`)
                const prixod = worksheet.getCell(`E${row_number + 1}`)
                date.value = returnSleshDate(new Date(item.doc_date))
                comment.value = item.opisanie
                doc_num.value = item.doc_num
                schet.value = item.schet
                prixod.value = item.prixod_sum
                prixod.numFmt = '#,##0.00'
                rasxod.value = item.rasxod_sum
                rasxod.numFmt = '#,##0.00'
                const array = [doc_num, date, comment, schet, rasxod, prixod]
                array.forEach((item, index) => {
                    const alignment = { vertical: 'middle' }
                    if (index === 2) {
                        alignment.horizontal = 'left'
                        alignment.wrapText = true
                    } else if (index === 4 || index === 5) {
                        alignment.horizontal = 'right'
                    } else {
                        alignment.horizontal = 'center'
                    }
                    Object.assign(item, {
                        alignment,
                        font: { name: 'Times New Roman' },
                        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } },
                        border: {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        }
                    });
                })
                row_number++
            })
            worksheet.mergeCells(`A${row_number + 1}`, `D${row_number + 1}`);
            const schet = worksheet.getCell(`A${row_number + 1}`)
            schet.value = `Итого по счету ${object.schet}`
            const prixod_sum = worksheet.getCell(`E${row_number + 1}`)
            prixod_sum.value = object.prixod_sum
            prixod_sum.numFmt = '#,##0.00'
            const rasxod_sum = worksheet.getCell(`F${row_number + 1}`)
            rasxod_sum.value = object.rasxod_sum
            rasxod_sum.numFmt = '#,##0.00'
            const array = [schet, prixod_sum, rasxod_sum]
            array.forEach((item, index) => {
                let horizontal = `right`
                if (index === 0) {
                    horizontal = `left`
                }
                Object.assign(item, {
                    alignment: { vertical: 'middle', horizontal },
                    font: { name: 'Times New Roman', bold: true, size: 9 }
                });
            })
            row_number++
        }
        const itogo_prixod = worksheet.getCell(`E${row_number + 1}`)
        itogo_prixod.value = data.prixod_sum
        const itogo_rasxod = worksheet.getCell(`F${row_number + 1}`)
        itogo_rasxod.value = data.rasxod_sum
        const itogo_array = [itogo_prixod, itogo_rasxod]
        itogo_array.forEach((item) => {
            Object.assign(item, {
                numFmt: '#,##0.00',
                font: { size: 9, bold: true, color: { argb: 'FF000000' }, name: 'Times New Roman' },
                alignment: { vertical: 'middle', horizontal: 'right' },
                fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } },
                border: {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                }
            });
        })
        worksheet.mergeCells(`A${row_number + 2}`, `H${row_number + 2}`);
        const balanceToCell = worksheet.getCell(`A${row_number + 2}`);
        balanceToCell.value = `Остаток концу дня: ${returnStringSumma(data.balance_to)}`;
        Object.assign(balanceToCell, {
            font: { size: 11, bold: true, color: { argb: 'FF000000' }, name: 'Times New Roman' },
            alignment: { vertical: 'middle', horizontal: 'left' }
        });
        worksheet.getColumn(2).width = 10
        worksheet.getColumn(3).width = 12
        worksheet.getColumn(4).width = 10
        worksheet.getColumn(5).width = 18
        worksheet.getColumn(6).width = 18
        worksheet.getColumn(7).width = 9
        worksheet.getRow(1).height = 25;
        worksheet.getRow(2).height = 20;
        worksheet.getRow(5).height = 25;

        const folderPath = path.join(__dirname, '../../../../public/exports');

        try {
            await access(folderPath, constants.W_OK);
        } catch (error) {
            await mkdir(folderPath);
        }

        const filePath = `${folderPath}/${fileName}`;

        await workbook.xlsx.writeFile(filePath);

        return { fileName, filePath };
    }
}