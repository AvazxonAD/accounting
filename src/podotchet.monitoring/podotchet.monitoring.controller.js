const { podotchetQueryValidation, prixodRasxodPodotchetValidation } = require("../utils/validation");;
const { getByIdMainSchetService } = require("../spravochnik/main.schet/main.schet.service");
const { getLogger } = require('../utils/logger')
const { validationResponse } = require('../utils/response-for-validation');
const { errorCatch } = require("../utils/errorCatch");
const { resFunc } = require("../utils/resFunc");
const { getAllMonitoring, prixodRasxodPodotchetService } = require('./podotchet.monitoring.service')
const { getByIdPodotchetService } = require('../spravochnik/podotchet/podotchet.litso.service')
const ExcelJS = require('exceljs')
const { returnStringDate, returnLocalDate } = require('../utils/date.function')
const path = require(`path`)

const getPodotchetMonitoring = async (req, res) => {
    try {
        const { limit, page, main_schet_id, from, to, podotchet } = validationResponse(podotchetQueryValidation, req.query)
        const region_id = req.user.region_id;
        const offset = (page - 1) * limit;
        if (podotchet) {
            await getByIdPodotchetService(region_id, podotchet)
        }
        await getByIdMainSchetService(region_id, main_schet_id);
        const { total, prixod_sum, rasxod_sum, data, summa_from_prixod, summa_from_rasxod, summa_to_prixod, summa_to_rasxod } = await getAllMonitoring(
            region_id,
            main_schet_id,
            offset,
            limit,
            from,
            to,
            podotchet
        );
        const pageCount = Math.ceil(total / limit);
        const meta = {
            pageCount: pageCount,
            count: total,
            currentPage: page,
            nextPage: page >= pageCount ? null : page + 1,
            backPage: page === 1 ? null : page - 1,
            prixod_sum,
            rasxod_sum,
            summa_from_prixod,
            summa_from_rasxod,
            summa_to_prixod,
            summa_to_rasxod
        }
        getLogger.info(`Muvaffaqiyatli podotchet monitoring doclar olindi. UserId: ${req.user.id}`)
        resFunc(res, 200, data, meta)
    } catch (error) {
        errorCatch(error, res)
    }
}

const prixodRasxodPodotchet = async (req, res) => {
    try {
        const region_id = req.user.region_id;
        const { to, main_schet_id } = validationResponse(prixodRasxodPodotchetValidation, req.query);
        const data = await prixodRasxodPodotchetService(region_id, main_schet_id, to);

        const workbook = new ExcelJS.Workbook();
        const fileName = `prixod_rasxod_${new Date().getTime()}.xlsx`;
        const worksheet = workbook.addWorksheet('prixod rasxod');

        worksheet.pageSetup.margins.left = 0
        worksheet.pageSetup.margins.header = 0
        worksheet.pageSetup.margins.footer = 0
        worksheet.pageSetup.margins.right = 0
        worksheet.mergeCells('A1:E1');
        worksheet.getCell('A1').value = `Список Дебеторов / Кредиторов на ${returnStringDate(new Date(to))}`;
        worksheet.getCell('A2').value = 'Подотчетное лицо';
        worksheet.getCell('B2').value = 'Управление';
        worksheet.getCell('C2').value = 'Дата'; 
        worksheet.getCell('D2').value = 'Дебет';
        worksheet.getCell('E2').value = 'Кредит';
        let row_number = 3
        let itogo_prixod = 0
        let itogo_rasxod = 0
        for (let column of data) {
            if (column.summa === 0) continue;
            worksheet.getCell(`A${row_number}`).value = column.name;
            worksheet.getCell(`B${row_number}`).value = column.rayon;
            worksheet.getCell(`C${row_number}`).value = returnLocalDate(new Date(to));
            worksheet.getCell(`D${row_number}`).value = column.summa > 0 ? column.summa : 0;
            worksheet.getCell(`E${row_number}`).value = column.summa < 0 ? Math.abs(column.summa) : 0;
            itogo_prixod += column.summa > 0 ? column.summa : 0;
            itogo_rasxod += column.summa < 0 ? Math.abs(column.summa) : 0;
            const css_array = [`A${row_number}`, `B${row_number}`, `C${row_number}`, `D${row_number}`, `E${row_number}`];
            css_array.forEach((cell, index) => {
                let horizontal = 'center';
                if(index === 0) horizontal = 'left';
                if(index > 2) horizontal = 'right';
                const column = worksheet.getCell(cell);
                column.numFmt = '#,##0.00'; 
                column.font = { size: 10, color: { argb: 'FF000000' }, name: 'Times New Roman' };
                column.alignment = { vertical: 'middle', horizontal };
                column.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } };
                column.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' },
                };
            });
            row_number++;
        }        

        worksheet.mergeCells(`A${row_number}`, `C${row_number}`)
        worksheet.getCell(`A${row_number}`).value = 'Итого'
        worksheet.getCell(`D${row_number}`).value = itogo_prixod
        worksheet.getCell(`E${row_number}`).value = itogo_rasxod
        const css_array = ['A1', 'A2', 'B2', 'C2', 'D2', 'E2', `A${row_number}`, `D${row_number}`, `E${row_number}`];
        css_array.forEach((cell, index) => {
            const column = worksheet.getCell(cell)
            let size = 10
            let horizontal = 'center';
            if (index === 0) size = 13;
            if(index > 5) column.numFmt = '#,##0.00', horizontal = 'right'; 
            Object.assign(column, {
                font: { size, bold: true, color: { argb: 'FF000000' }, name: 'Times New Roman' },
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

        worksheet.getColumn(1).width = 30;
        worksheet.getColumn(2).width = 20;
        worksheet.getColumn(3).width = 15;
        worksheet.getColumn(4).width = 18;
        worksheet.getColumn(5).width = 18;
        worksheet.getRow(1).height = 35
        worksheet.getRow(2).height = 20

        const filePath = path.join(__dirname, '../../public/uploads/' + fileName);
        await workbook.xlsx.writeFile(filePath);

        return res.download(filePath, (err) => {
            if (err) throw new ErrorResponse(err, err.statusCode);
        });
    } catch (error) {
        errorCatch(error, res);
    }
};

module.exports = {
    getPodotchetMonitoring,
    prixodRasxodPodotchet
};
