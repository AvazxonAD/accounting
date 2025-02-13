const { PodotchetMonitoringDB } = require('./db');
const ExcelJS = require('exceljs');
const { returnStringDate, formatSubSchet } = require('@helper/functions');
const path = require('path');

exports.PodotchetMonitoringService = class {
    static async cap(data) {
        let itogo_rasxod = 0;
        const result = await PodotchetMonitoringDB.cap([
            data.region_id,
            data.main_schet_id,
            data.operatsii,
            data.from,
            data.to
        ]);
        const uniqueSchets = Array.from(
            new Set(result.map(item => item.schet))
        ).map(schet => ({ schet }));

        for (let schet of uniqueSchets) {
            schet.summa = 0;
            for (let doc of result) {
                if (schet.schet === doc.schet) {
                    schet.summa += doc.summa;
                }
            }
            // Corrected filter
            schet.docs = result.filter(item => item.schet === schet.schet);
        }

        for (let item of result) {
            itogo_rasxod += item.summa;
        }
        return { data: uniqueSchets, itogo_rasxod };
    }

    static async capExcel(data) {
        const workbook = new ExcelJS.Workbook();
        const fileName = `cap_${new Date().getTime()}.xlsx`;
        const worksheet = workbook.addWorksheet('organization prixod rasxod');
        worksheet.mergeCells(`A1`, 'F1');
        worksheet.getCell('A1').value = 'Журнал-ордер N_4';
        worksheet.mergeCells(`A2`, 'F2');
        worksheet.getCell('A2').value = `(${data.budjet_name} буджети)`;
        worksheet.mergeCells(`A3`, 'F3');
        worksheet.getCell('A3').value = `${returnStringDate(new Date(data.from))} дан   ${returnStringDate(new Date(data.to))} гача   ${data.operatsii}`;
        worksheet.mergeCells(`A4`, 'F4');
        worksheet.getCell('A4').value = `Подлежит записи в главную книгу`;
        worksheet.getCell('A5').value = 'счет';
        worksheet.getCell('B5').value = 'Тип расхода';
        worksheet.getCell('C5').value = 'Объект';
        worksheet.getCell('D5').value = 'Подобъект';
        worksheet.getCell('E5').value = 'Кредит';
        worksheet.getCell('F5').value = 'Сумма';
        worksheet.getCell('E6').value = data.operatsii;
        let row_number = !data.organizations.length ? 7 : 6;
        for (let schet of data.organizations) {
            for (let doc of schet.docs) {
                const sub_schet = formatSubSchet(doc.sub_schet);
                worksheet.getCell(`A${row_number}`).value = doc.schet;
                worksheet.getCell(`B${row_number}`).value = sub_schet[0];
                worksheet.getCell(`C${row_number}`).value = sub_schet[1];
                worksheet.getCell(`D${row_number}`).value = sub_schet[2];
                worksheet.getCell(`F${row_number}`).value = doc.summa;
                row_number++
            }
            worksheet.mergeCells(`A${row_number}`, `E${row_number}`);
            worksheet.getCell(`A${row_number}`).value = `Итого ${schet.schet}`;
            worksheet.getCell(`F${row_number}`).value = schet.summa;
            row_number++;
        }
        worksheet.mergeCells(`A${row_number}`, `E${row_number}`);
        worksheet.getCell(`A${row_number}`).value = 'Всего кредита';
        worksheet.getCell(`F${row_number}`).value = data.itogo_rasxod;
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
        const filePath = path.join(__dirname, '../../../public/exports/' + fileName);
        await workbook.xlsx.writeFile(filePath);
        return { fileName, filePath };
    }
}