const { Monitoringjur7DB } = require('./db');
const ExcelJS = require('exceljs');
const path = require('path');
const { returnStringDate, formatSubSchet } = require('../../helper/functions')

exports.Jur7MonitoringService = class {
    static async cap(data) {
        const result = {
            schets_summa: 0,
            debet_sub_schets_summa: 0,
            kredit_sub_schets_summa: 0,
            iznos_summa: 0
        };

        result.schets = await Monitoringjur7DB.getSchetsForCap([data.budjet_id, data.region_id, data.from, data.to]);
        for (let schet of result.schets) {
            schet.summa = await Monitoringjur7DB.getCapSchetSumma([data.budjet_id, data.region_id, data.from, data.to, schet.debet_schet, schet.kredit_schet]);
            result.schets_summa += schet.summa;
        }

        result.debet_sub_schets = await Monitoringjur7DB.getDebetSubSchetsForCap([data.budjet_id, data.region_id, data.from, data.to]);
        for (let schet of result.debet_sub_schets) {
            schet.summa = await Monitoringjur7DB.getDebetSubSchetSumma([data.budjet_id, data.region_id, data.from, data.to, schet.debet_sub_schet]);
            result.debet_sub_schets_summa += schet.summa;
        }

        result.kredit_sub_schets = await Monitoringjur7DB.getKreditSubSchetsForCap([data.budjet_id, data.region_id, data.from, data.to]);
        for (let schet of result.kredit_sub_schets) {
            schet.summa = await Monitoringjur7DB.getKreditSubSchetSumma([data.budjet_id, data.region_id, data.from, data.to, schet.kredit_sub_schet]);
            result.kredit_sub_schets_summa += schet.summa;
        }

        result.iznos_schets = await Monitoringjur7DB.getIznosSummaByProvodkaSubSchet([data.budjet_id, data.region_id, data.from, data.to]);
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
        worksheet.getCell('A2').value = `${returnStringDate(new Date(data.from))} дан   ${returnStringDate(new Date(data.to))} гача`;
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
            const format = formatSubSchet(doc.debet_sub_schet);
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
            const format = formatSubSchet(doc.kredit_sub_schet);
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
            const format = formatSubSchet(doc.provodka_subschet);
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
        const result = await Monitoringjur7DB.getSchetsForBackCap([data.budjet_id, data.region_id, data.from, data.to]);
        result.debet_sum = 0;
        result.kredit_sum = 0;
        for (let item of result.kredit_schets) {
            item.summa = await Monitoringjur7DB.getBackCapSchetSumma([data.budjet_id, data.region_id, data.from, data.to, item.schet], 'kredit_schet');
            result.kredit_sum += item.summa;
        }

        for (let item of result.debet_schets) {
            item.summa = await Monitoringjur7DB.getBackCapSchetSumma([data.budjet_id, data.region_id, data.from, data.to, item.schet], 'debet_schet');
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
        worksheet.getCell('A2').value = `${returnStringDate(new Date(data.from))} дан   ${returnStringDate(new Date(data.to))} гача`;

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
        let products = await Monitoringjur7DB.getProducts([data.responsible_id]);
        for (let product of products) {
            product.kol = await Monitoringjur7DB.getKol([product.id, data.responsible_id, data.to]);
            if (product.kol === 0) {
                products = products.filter(item => item.id !== product.id)
                continue
            }
            product.prixod_data = await Monitoringjur7DB.getPrixodInfo([product.id]);
            
        }
    }
}   