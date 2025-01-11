const { Monitoringjur7DB } = require('./db');
const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

exports.Jur7MonitoringService = class {
    static async cap(data) {
        const result = { summa: 0 }
        result.schets = await Monitoringjur7DB.getSchetsForCap([data.main_schet_id, data.region_id, data.from, data.to]);
        for (let schet of result.schets) {
            schet.summa = await Monitoringjur7DB.getSchetSumma([data.main_schet_id, data.region_id, data.from, data.to, schet.debet_schet, schet.kredit_schet]);
            result.summa += schet.summa;
        }
        return result;
    }

    static async capExcel(data) {
        const workbook = new ExcelJS.Workbook();
        const fileName = `cap_${new Date().getTime()}.xlsx`;
        const worksheet = workbook.addWorksheet('organization prixod rasxod');
        worksheet.mergeCells(`A1`, 'F1');
        worksheet.getCell('A1').value = 'Журнал-ордер N_7';
        worksheet.mergeCells(`A2`, 'F2');
        worksheet.getCell('A2').value = `${returnStringDate(new Date(data.from))} дан   ${returnStringDate(new Date(data.to))} гача`;
        worksheet.mergeCells(`A3`, 'F3');
        worksheet.getCell('A3').value = `Подлежит записи в главную книгу`;
        worksheet.getCell('A4').value = 'Дебет';
        worksheet.getCell('B4').value = 'Кредит';
        worksheet.getCell('C4').value = 'Сумма';
        let row_number = !data.organizations.length ? 5 : 4;
        for (let doc of data.schets) {
            worksheet.getCell(`A${row_number}`).value = doc.debet_schet;
            worksheet.getCell(`B${row_number}`).value = doc.kredit_schet;
            worksheet.getCell(`C${row_number}`).value = doc.summa;
            row_number++
        }
        worksheet.getCell(`C${row_number}`).value = data.summa;
        worksheet.getColumn(1).width = 15;
        worksheet.getColumn(2).width = 15;
        worksheet.getColumn(3).width = 15;
        worksheet.getColumn(4).width = 15;
        worksheet.getColumn(5).width = 15;
        worksheet.getColumn(6).width = 20;
        worksheet.getRow(1).height = 30;
        worksheet.eachRow((row, rowNumber) => {
            worksheet.getRow(rowNumber).height = 20;
            row.eachCell((cell, columnNumber) => {
                let bold = false;
                let horizontal = "left";
                if (rowNumber < 6) {
                    bold = true;
                    horizontal = 'center'
                }
                if (rowNumber > 5 && columnNumber === 6) {
                    horizontal = 'right'
                }
                if (rowNumber > 5 && columnNumber !== 1 && columnNumber !== 6) {
                    horizontal = 'center'
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
        const filePath = path.join(__dirname, '../../public/exports/' + fileName);
        await workbook.xlsx.writeFile(filePath);
        return { filePath, fileName };
    }
}