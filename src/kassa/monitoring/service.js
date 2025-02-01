const { KassaMonitoringDB } = require('./db');

exports.KassaMonitoringService = class {
    static async get(data) {
        const result = await KassaMonitoringDB.get([data.region_id, data.main_schet_id, data.from, data.to, data.offset, data.limit]);
        let prixod_sum = 0;
        let rasxod_sum = 0;
        for (let item of result.data) {
            prixod_sum += item.prixod_sum;
            rasxod_sum += item.rasxod_sum;
        }

        const summa_from = await KassaMonitoringDB.getSumma([data.region_id, data.main_schet_id, data.from], '<');

        const summa_to = await KassaMonitoringDB.getSumma([data.region_id, data.main_schet_id, data.to], '<=');

        return {
            summa_from,
            summa_to,
            data: result.data || [],
            total_count: result.total_count,
            prixod_sum,
            rasxod_sum
        };
    }

    static async cap(data) {
        const result = await KassaMonitoringDB.cap([data.region_id, data.main_schet_id, data.from, data.to]);

        return result;
    }

    static async capExcel(data) {
        const title = `Дневной отчет по Журнал-Ордеру №1. Счет: ${data.main_schet.jur1_schet}. Ҳисоб рақами: ${returnStringSumma(data.main_schet.account_number)}`;
        const dateBetween = `За период с ${returnStringDate(new Date(data.from))} по ${returnStringDate(new Date(data.to))}`;
        const workbook = new ExcelJS.Workbook();
        const fileName = `kassa_shapka_${new Date().getTime()}.xlsx`;
        const worksheet = workbook.addWorksheet('Hisobot');
        worksheet.mergeCells('A1', 'G1');
        const titleCell = worksheet.getCell('A1');
        Object.assign(titleCell, {
            value: title,
            font: { size: 10, bold: true, color: { argb: 'FF000000' }, name: 'Times New Roman' },
            alignment: { vertical: 'middle', horizontal: 'center' },
        });
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
        const balance_from = `Остаток к началу дня: ${returnStringSumma(data.balance_from)}`;
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
            prixod_sum.value = item.prixod_sum;
            prixod_sum.numFmt = '#,##0.00';
            const rasxod_sum = worksheet.getCell(`D${row_number + 1}`);
            rasxod_sum.value = item.rasxod_sum;
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
        balanceToCell.value = `Остаток концу дня: ${returnStringSumma(data.balance_to)}`;
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
        const filePath = path.join(__dirname, '../../public/uploads/' + fileName);
        await workbook.xlsx.writeFile(filePath);

        return { fileName, filePath }
    }
}