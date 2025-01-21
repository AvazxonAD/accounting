
const { AktDB } = require('./db');
const ExcelJS = require('exceljs');
const path = require('path');
const { access, constants, mkdir } = require('fs').promises;

exports.AktService = class {
    static async capExcel(data) {
        const workbook = new ExcelJS.Workbook();
    
        const fileName = `jur3_cap${new Date().getTime()}.xlsx`;
    
        let worksheet = null;
    
        if (data.schets.length === 0) {
            worksheet = workbook.addWorksheet(`data not found`);
        }
    
        for (let schet of data.schets) {
            const capData = await AktDB.cap([data.from, data.to, data.region_id, schet.schet, data.main_schet_id]);
            let row_number = 4;
            worksheet = workbook.addWorksheet(`${schet.schet}`);
            worksheet.pageSetup.margins.left = 0;
            worksheet.pageSetup.margins.header = 0;
            worksheet.pageSetup.margins.footer = 0;
            worksheet.pageSetup.margins.bottom = 0;
            worksheet.mergeCells(`A1`, `H1`);
            const title = worksheet.getCell(`A1`);
            title.value = `Журнал-ордер № 3 Счет: ${schet.schet}`;
            worksheet.mergeCells('A2', 'H2');
            const title2 = worksheet.getCell(`A2`);
            title2.value = `Подлежит записи в главную книгу`;
            worksheet.mergeCells(`A3`, `C3`);
            const title3_1 = worksheet.getCell('A3');
            title3_1.value = 'Дебет';
            const title3_2 = worksheet.getCell(`D3`);
            title3_2.value = 'Кредит';
            worksheet.mergeCells('E3', 'H3');
            const title3_3 = worksheet.getCell('E3');
            title3_3.value = 'Сумма';
    
            let css_array = [title, title2, title3_1, title3_2, title3_3];
            let itogo = 0;
    
            for (let column of capData) {
                worksheet.mergeCells(`A${row_number}`, `C${row_number}`);
                const title3_1 = worksheet.getCell(`A${row_number}`);
                title3_1.value = `${column.schet}   ${column.smeta_number}`;
                worksheet.mergeCells(`E${row_number}`, `H${row_number}`);
                const title3_3 = worksheet.getCell(`E${row_number}`);
                title3_3.value = column.summa;
                row_number++;
                itogo += column.summa;
    
                css_array.forEach((coll, index) => {
                    let horizontal = 'center';
                    if (index === 2) horizontal = 'right';
                    if (index === 0) horizontal = 'left';
                    Object.assign(coll, {
                        numFmt: '#,##0.00',
                        font: { size: 12, color: { argb: 'FF000000' }, name: 'Times New Roman' },
                        alignment: { vertical: 'middle', horizontal },
                        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } },
                        border: {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        }
                    });
                });
            }
    
            worksheet.mergeCells(`D4`, `D${row_number - 1}`);
            const kriditSchetCell = worksheet.getCell(`D4`);
            kriditSchetCell.value = `${schet.schet}`;
            worksheet.mergeCells(`A${row_number}`, `D${row_number}`);
            const itogoStr = worksheet.getCell(`A${row_number}`);
            itogoStr.value = `Всего кредит`;
            worksheet.mergeCells(`E${row_number}`, `H${row_number}`);
            const itogoSumma = worksheet.getCell(`E${row_number}`);
            itogoSumma.value = itogo;
    
            css_array.push(kriditSchetCell, itogoStr, itogoSumma);
            css_array.forEach((coll, index) => {
                let vertical = 'middle';
                let bold = true;
                let horizontal = 'center';
                if (index === 5) vertical = 'top', bold = false;
                if (index === 6) horizontal = 'left';
                if (index === 7) horizontal = 'right';
                Object.assign(coll, {
                    numFmt: '#,##0.00',
                    font: { size: 12, bold, color: { argb: 'FF000000' }, name: 'Times New Roman' },
                    alignment: { vertical, horizontal },
                    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } },
                    border: {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    }
                });
            });
    
            worksheet.getRow(1).height = 35;
            worksheet.getRow(2).height = 25;
            worksheet.getColumn(1).width = 5;
            worksheet.getColumn(2).width = 5;
            worksheet.getColumn(3).width = 5;
            worksheet.getColumn(5).width = 5;
            worksheet.getColumn(6).width = 5;
        }
    
        const folderPath = path.join(__dirname, '../../public/exports/');
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